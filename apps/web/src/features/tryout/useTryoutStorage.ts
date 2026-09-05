"use client";

import { useState, useEffect, useCallback } from "react";
import type { HasilTryOut } from "./types";
import { PAKET_TRYOUT_LIST } from "./data";

const STORAGE_PREFIX = "tv_tryout_history_";

export interface SubdivisiStatAkumulasi {
  subdivisi: string;
  label: string;
  totalSoal: number;
  totalBenar: number;
  persenAkurasi: number;
}

export interface TrenSesiEvaluasi {
  id: string;
  paketId: string;
  paketJudul: string;
  tanggalISO: string;
  labelTanggal: string;
  skorPersen: number;
  jumlahBenar: number;
  totalSoal: number;
  lulus: boolean;
}

export interface RingkasanEvaluasiGlobal {
  hasData: boolean;
  totalSesi: number;
  rataRataAkurasi: number;
  skorTertinggi: number;
  totalSoalDikerjakan: number;
  totalSoalBenar: number;
  totalSoalSalah: number;
  subdivisiStats: SubdivisiStatAkumulasi[];
  trenSesi: TrenSesiEvaluasi[];
  subdivisiTerendah: SubdivisiStatAkumulasi | null;
  subdivisiTertinggi: SubdivisiStatAkumulasi | null;
}

export function useTryoutStorage(paketId: string) {
  const [riwayat, setRiwayat] = useState<HasilTryOut[]>([]);
  const [skorTerbaik, setSkorTerbaik] = useState<number | null>(null);
  const [jumlahPercobaan, setJumlahPercobaan] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !paketId) return;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${paketId}`);
      if (raw) {
        const list = JSON.parse(raw) as HasilTryOut[];
        if (Array.isArray(list) && list.length > 0) {
          setRiwayat(list);
          setJumlahPercobaan(list.length);
          const maxSkor = Math.max(...list.map((r) => r.skorPersen));
          setSkorTerbaik(maxSkor);
        }
      }
    } catch {
      // safe fallback
    }
  }, [paketId]);

  function simpanHasil(hasil: HasilTryOut) {
    if (typeof window === "undefined" || !paketId) return;
    try {
      const existing = localStorage.getItem(`${STORAGE_PREFIX}${paketId}`);
      const list: HasilTryOut[] = existing ? JSON.parse(existing) : [];
      const updated = [hasil, ...list].slice(0, 10); // simpan 10 riwayat terbaru
      localStorage.setItem(`${STORAGE_PREFIX}${paketId}`, JSON.stringify(updated));
      setRiwayat(updated);
      setJumlahPercobaan(updated.length);
      setSkorTerbaik((prev) => (prev === null ? hasil.skorPersen : Math.max(prev, hasil.skorPersen)));
      // Trigger event agar dashboard menu awal langsung update
      window.dispatchEvent(new Event("tv-tryout-updated"));
    } catch {
      // safe fallback
    }
  }

  return { riwayat, skorTerbaik, jumlahPercobaan, simpanHasil };
}

export function useAllTryoutStats(): {
  stats: RingkasanEvaluasiGlobal;
  refresh: () => void;
  isContohAktif: boolean;
  setContohAktif: (val: boolean) => void;
} {
  const [tick, setTick] = useState(0);
  const [isContohAktif, setContohAktif] = useState(false);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    function onUpdate() {
      refresh();
    }
    window.addEventListener("tv-tryout-updated", onUpdate);
    return () => {
      window.removeEventListener("tv-tryout-updated", onUpdate);
    };
  }, [refresh]);

  const [stats, setStats] = useState<RingkasanEvaluasiGlobal>(() => ({
    hasData: false,
    totalSesi: 0,
    rataRataAkurasi: 0,
    skorTertinggi: 0,
    totalSoalDikerjakan: 0,
    totalSoalBenar: 0,
    totalSoalSalah: 0,
    subdivisiStats: [],
    trenSesi: [],
    subdivisiTerendah: null,
    subdivisiTertinggi: null,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Ambil semua riwayat dari seluruh paket tryout
      const allResults: { hasil: HasilTryOut; paketJudul: string }[] = [];

      for (const paket of PAKET_TRYOUT_LIST) {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}${paket.id}`);
        if (raw) {
          try {
            const list = JSON.parse(raw) as HasilTryOut[];
            if (Array.isArray(list)) {
              for (const item of list) {
                allResults.push({ hasil: item, paketJudul: paket.judul });
              }
            }
          } catch {
            // skip corrupted item
          }
        }
      }

      if (allResults.length === 0) {
        // Belum ada riwayat nyata
        setStats({
          hasData: false,
          totalSesi: 0,
          rataRataAkurasi: 0,
          skorTertinggi: 0,
          totalSoalDikerjakan: 0,
          totalSoalBenar: 0,
          totalSoalSalah: 0,
          subdivisiStats: [],
          trenSesi: [],
          subdivisiTerendah: null,
          subdivisiTertinggi: null,
        });
        return;
      }

      // Hitung metrik keseluruhan
      const totalSesi = allResults.length;
      let totalSkorPersen = 0;
      let skorTertinggi = 0;
      let totalSoalDikerjakan = 0;
      let totalSoalBenar = 0;
      let totalSoalSalah = 0;

      // Akumulasi subdivisi
      const subdivisiMap: Record<string, { label: string; total: number; benar: number }> = {};

      // Riwayat untuk grafik tren
      const trenSesi: TrenSesiEvaluasi[] = [];

      // Sort by date ascending untuk tren
      const sortedResults = [...allResults].sort((a, b) => {
        const timeA = new Date(a.hasil.tanggalISO).getTime() || 0;
        const timeB = new Date(b.hasil.tanggalISO).getTime() || 0;
        return timeA - timeB;
      });

      sortedResults.forEach((entry, idx) => {
        const h = entry.hasil;
        totalSkorPersen += h.skorPersen;
        if (h.skorPersen > skorTertinggi) {
          skorTertinggi = h.skorPersen;
        }
        totalSoalDikerjakan += h.totalSoal;
        totalSoalBenar += h.jumlahBenar;
        totalSoalSalah += h.jumlahSalah;

        // Akumulasi rincian subdivisi
        if (Array.isArray(h.rincianSubdivisi)) {
          for (const s of h.rincianSubdivisi) {
            const current = subdivisiMap[s.subdivisi] ?? {
              label: s.label,
              total: 0,
              benar: 0,
            };
            current.total += s.total;
            current.benar += s.benar;
            subdivisiMap[s.subdivisi] = current;
          }
        }

        const dateObj = new Date(h.tanggalISO);
        const labelTanggal = isNaN(dateObj.getTime())
          ? `Sesi #${idx + 1}`
          : dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            });

        trenSesi.push({
          id: `${h.paketId}-${h.tanggalISO}-${idx}`,
          paketId: h.paketId,
          paketJudul: entry.paketJudul,
          tanggalISO: h.tanggalISO,
          labelTanggal,
          skorPersen: h.skorPersen,
          jumlahBenar: h.jumlahBenar,
          totalSoal: h.totalSoal,
          lulus: h.lulus,
        });
      });

      const rataRataAkurasi = Math.round(totalSkorPersen / totalSesi);

      const subdivisiStats: SubdivisiStatAkumulasi[] = Object.entries(subdivisiMap).map(
        ([key, val]) => {
          const persenAkurasi = val.total > 0 ? Math.round((val.benar / val.total) * 100) : 0;
          return {
            subdivisi: key,
            label: val.label,
            totalSoal: val.total,
            totalBenar: val.benar,
            persenAkurasi,
          };
        }
      );

      // Sort subdivisi dari persentase terendah ke tertinggi (agar yang perlu dievaluasi tampak jelas)
      subdivisiStats.sort((a, b) => a.persenAkurasi - b.persenAkurasi);

      const subdivisiTerendah = subdivisiStats[0] ?? null;
      const subdivisiTertinggi =
        subdivisiStats.length > 0 ? subdivisiStats[subdivisiStats.length - 1] ?? null : null;

      setStats({
        hasData: true,
        totalSesi,
        rataRataAkurasi,
        skorTertinggi,
        totalSoalDikerjakan,
        totalSoalBenar,
        totalSoalSalah,
        subdivisiStats,
        trenSesi,
        subdivisiTerendah,
        subdivisiTertinggi,
      });
    } catch {
      // safe fallback
    }
  }, [tick]);

  return { stats, refresh, isContohAktif, setContohAktif };
}

