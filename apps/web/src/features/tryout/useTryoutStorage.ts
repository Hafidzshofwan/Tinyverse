"use client";

/**
 * useTryoutStorage.ts
 * -------------------
 * Hook penyimpanan hasil tryout dengan sinkronisasi antar-perangkat.
 *
 * Strategi:
 *  • User sudah login  → Firestore sebagai sumber kebenaran utama.
 *    localStorage tetap ditulis sebagai cache offline agar UI tetap
 *    responsif jika koneksi lambat.
 *  • User belum login  → localStorage saja (perilaku lama, tidak berubah).
 *
 * Migrasi otomatis:
 *  Saat user login pertama kali di perangkat yang sudah punya riwayat
 *  localStorage, data lokal diunggah ke Firestore (merge ke sisi server),
 *  lalu localStorage dihapus agar tidak terjadi duplikasi di sesi berikutnya.
 */

import { useState, useEffect, useCallback } from "react";
import type { HasilTryOut } from "./types";
import { PAKET_TRYOUT_LIST } from "./data";
import {
  ambilRiwayatPaket,
  simpanHasilPaket,
  ambilSemuaRiwayat,
} from "./tryoutFirestore";


// ---------------------------------------------------------------------------
// Konstanta & helper localStorage (dipertahankan untuk mode offline/tamu)
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "tv_tryout_history_";
const MAX_RIWAYAT = 10;

function bacaLokal(paketId: string): HasilTryOut[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${paketId}`);
    if (!raw) return [];
    const list = JSON.parse(raw) as HasilTryOut[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function tulisLokal(paketId: string, list: HasilTryOut[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${paketId}`,
      JSON.stringify(list.slice(0, MAX_RIWAYAT)),
    );
  } catch {
    // localStorage penuh atau private mode — abaikan
  }
}

function hapusLokal(paketId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${paketId}`);
  } catch {
    // abaikan
  }
}

// ---------------------------------------------------------------------------
// useTryoutStorage  —  hook per-paket
// ---------------------------------------------------------------------------

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // Baca uid dari firebase auth secara langsung (tanpa hook)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let unsubscribe: (() => void) | null = null;

    import("@/shared/firebase/firebaseClient")
      .then(({ initFirebase }) => initFirebase())
      .then(({ auth }) => {
        unsubscribe = auth.onAuthStateChanged((user: { uid: string } | null) => {
          setUid(user?.uid ?? null);
        });
      })
      .catch(() => {
        setUid(null);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Muat riwayat saat paketId atau uid berubah
  useEffect(() => {
    if (!paketId) return;

    async function muat() {
      setIsSyncing(true);
      try {
        if (uid) {
          // --- Mode online: Firestore sebagai sumber utama ---
          // Periksa apakah ada riwayat lokal yang belum diunggah (migrasi)
          const lokal = bacaLokal(paketId);
          if (lokal.length > 0) {
            // Unggah satu per satu dari yang terlama ke terbaru
            // agar urutan di server tetap benar
            const terurut = [...lokal].reverse();
            for (const h of terurut) {
              await simpanHasilPaket(uid, paketId, h);
            }
            hapusLokal(paketId); // bersihkan localStorage setelah migrasi
          }

          const remoteList = await ambilRiwayatPaket(uid, paketId);
          terapkanRiwayat(remoteList);
        } else {
          // --- Mode offline: baca dari localStorage ---
          terapkanRiwayat(bacaLokal(paketId));
        }
      } catch {
        // Jika Firestore gagal, fallback ke localStorage
        terapkanRiwayat(bacaLokal(paketId));
      } finally {
        setIsSyncing(false);
      }
    }

    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paketId, uid]);

  function terapkanRiwayat(list: HasilTryOut[]) {
    setRiwayat(list);
    setJumlahPercobaan(list.length);
    if (list.length > 0) {
      setSkorTerbaik(Math.max(...list.map((r) => r.skorPersen)));
    } else {
      setSkorTerbaik(null);
    }
  }

  async function simpanHasil(hasil: HasilTryOut) {
    if (typeof window === "undefined" || !paketId) return;

    try {
      let updated: HasilTryOut[];

      if (uid) {
        // Simpan ke Firestore (sinkron antar-perangkat)
        updated = await simpanHasilPaket(uid, paketId, hasil);
        // Perbarui cache lokal agar UI tetap responsif saat offline
        tulisLokal(paketId, updated);
      } else {
        // Simpan ke localStorage saja (mode tamu)
        const existing = bacaLokal(paketId);
        updated = [hasil, ...existing].slice(0, MAX_RIWAYAT);
        tulisLokal(paketId, updated);
      }

      terapkanRiwayat(updated);

      // Beri tahu komponen lain (misal: dashboard) bahwa ada data baru
      window.dispatchEvent(new Event("tv-tryout-updated"));
    } catch {
      // Firestore gagal — tulis ke localStorage sebagai cadangan
      const existing = bacaLokal(paketId);
      const updated = [hasil, ...existing].slice(0, MAX_RIWAYAT);
      tulisLokal(paketId, updated);
      terapkanRiwayat(updated);
      window.dispatchEvent(new Event("tv-tryout-updated"));
    }
  }

  return { riwayat, skorTerbaik, jumlahPercobaan, isSyncing, simpanHasil };
}

// ---------------------------------------------------------------------------
// useAllTryoutStats  —  hook dashboard evaluasi global
// ---------------------------------------------------------------------------

export function useAllTryoutStats(): {
  stats: RingkasanEvaluasiGlobal;
  refresh: () => void;
  isContohAktif: boolean;
  setContohAktif: (val: boolean) => void;
  isSyncing: boolean;
} {
  const [tick, setTick] = useState(0);
  const [isContohAktif, setContohAktif] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Dengarkan perubahan auth
  useEffect(() => {
    if (typeof window === "undefined") return;
    let unsubscribe: (() => void) | null = null;

    import("@/shared/firebase/firebaseClient")
      .then(({ initFirebase }) => initFirebase())
      .then(({ auth }) => {
        unsubscribe = auth.onAuthStateChanged((user: { uid: string } | null) => {
          setUid(user?.uid ?? null);
          // Refresh stats setiap kali status auth berubah
          setTick((t) => t + 1);
        });
      })
      .catch(() => setUid(null));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Dengarkan event update dari useTryoutStorage
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

    async function hitungStats() {
      setIsSyncing(true);
      try {
        // Kumpulkan semua riwayat dari sumber yang tepat
        const allResults: { hasil: HasilTryOut; paketJudul: string }[] = [];

        if (uid) {
          // --- Sumber: Firestore (data terpadu dari semua perangkat) ---
          const remoteAll = await ambilSemuaRiwayat(uid);
          for (const paket of PAKET_TRYOUT_LIST) {
            const list = remoteAll[paket.id];
            if (Array.isArray(list)) {
              for (const item of list) {
                allResults.push({ hasil: item, paketJudul: paket.judul });
              }
            }
          }
        } else {
          // --- Sumber: localStorage (mode tamu) ---
          for (const paket of PAKET_TRYOUT_LIST) {
            const list = bacaLokal(paket.id);
            for (const item of list) {
              allResults.push({ hasil: item, paketJudul: paket.judul });
            }
          }
        }

        setStats(hitungRingkasan(allResults));
      } catch {
        // Firestore gagal — fallback ke localStorage
        const allResults: { hasil: HasilTryOut; paketJudul: string }[] = [];
        for (const paket of PAKET_TRYOUT_LIST) {
          const list = bacaLokal(paket.id);
          for (const item of list) {
            allResults.push({ hasil: item, paketJudul: paket.judul });
          }
        }
        setStats(hitungRingkasan(allResults));
      } finally {
        setIsSyncing(false);
      }
    }

    hitungStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, uid]);

  return { stats, refresh, isContohAktif, setContohAktif, isSyncing };
}

// ---------------------------------------------------------------------------
// Fungsi kalkulasi statistik (dipisahkan agar mudah diuji)
// ---------------------------------------------------------------------------

function hitungRingkasan(
  allResults: { hasil: HasilTryOut; paketJudul: string }[],
): RingkasanEvaluasiGlobal {
  if (allResults.length === 0) {
    return {
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
    };
  }

  const totalSesi = allResults.length;
  let totalSkorPersen = 0;
  let skorTertinggi = 0;
  let totalSoalDikerjakan = 0;
  let totalSoalBenar = 0;
  let totalSoalSalah = 0;

  const subdivisiMap: Record<string, { label: string; total: number; benar: number }> =
    {};
  const trenSesi: TrenSesiEvaluasi[] = [];

  // Urutkan ascending by date untuk grafik tren
  const sorted = [...allResults].sort((a, b) => {
    const tA = new Date(a.hasil.tanggalISO).getTime() || 0;
    const tB = new Date(b.hasil.tanggalISO).getTime() || 0;
    return tA - tB;
  });

  sorted.forEach((entry, idx) => {
    const h = entry.hasil;
    totalSkorPersen += h.skorPersen;
    if (h.skorPersen > skorTertinggi) skorTertinggi = h.skorPersen;
    totalSoalDikerjakan += h.totalSoal;
    totalSoalBenar += h.jumlahBenar;
    totalSoalSalah += h.jumlahSalah;

    if (Array.isArray(h.rincianSubdivisi)) {
      for (const s of h.rincianSubdivisi) {
        const cur = subdivisiMap[s.subdivisi] ?? {
          label: s.label,
          total: 0,
          benar: 0,
        };
        cur.total += s.total;
        cur.benar += s.benar;
        subdivisiMap[s.subdivisi] = cur;
      }
    }

    const dateObj = new Date(h.tanggalISO);
    const labelTanggal = isNaN(dateObj.getTime())
      ? `Sesi #${idx + 1}`
      : dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

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

  const subdivisiStats: SubdivisiStatAkumulasi[] = Object.entries(
    subdivisiMap,
  ).map(([key, val]) => ({
    subdivisi: key,
    label: val.label,
    totalSoal: val.total,
    totalBenar: val.benar,
    persenAkurasi: val.total > 0 ? Math.round((val.benar / val.total) * 100) : 0,
  }));

  // Urut dari terendah ke tertinggi agar area lemah tampak duluan
  subdivisiStats.sort((a, b) => a.persenAkurasi - b.persenAkurasi);

  return {
    hasData: true,
    totalSesi,
    rataRataAkurasi,
    skorTertinggi,
    totalSoalDikerjakan,
    totalSoalBenar,
    totalSoalSalah,
    subdivisiStats,
    trenSesi,
    subdivisiTerendah: subdivisiStats[0] ?? null,
    subdivisiTertinggi:
      subdivisiStats.length > 0
        ? subdivisiStats[subdivisiStats.length - 1]
        : null,
  };
}
