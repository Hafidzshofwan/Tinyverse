"use client";

import { useCallback, useEffect, useState } from "react";
import type { HasilKuis } from "./types";

const STORAGE_KEY = "tv_kuis_riwayat";

function bacaRiwayat(): HasilKuis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HasilKuis[];
  } catch {
    return [];
  }
}

function simpanHasil(hasil: HasilKuis): void {
  if (typeof window === "undefined") return;
  try {
    const riwayat = bacaRiwayat();
    riwayat.push(hasil);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(riwayat));
  } catch {
    // localStorage penuh atau private mode — abaikan
  }
}

function getSkorTerbaik(modulId: string): number | null {
  const riwayat = bacaRiwayat().filter((h) => h.modulId === modulId);
  if (riwayat.length === 0) return null;
  return Math.max(...riwayat.map((h) => h.persentase));
}

export function useKuisStorage(modulId: string) {
  const [skorTerbaik, setSkorTerbaik] = useState<number | null>(null);
  const [jumlahPercobaan, setJumlahPercobaan] = useState(0);

  useEffect(() => {
    const riwayat = bacaRiwayat().filter((h) => h.modulId === modulId);
    setSkorTerbaik(getSkorTerbaik(modulId));
    setJumlahPercobaan(riwayat.length);
  }, [modulId]);

  const simpan = useCallback(
    (skor: number, total: number) => {
      const hasil: HasilKuis = {
        modulId,
        skor,
        total,
        persentase: Math.round((skor / total) * 100),
        tanggal: new Date().toISOString(),
      };
      simpanHasil(hasil);
      setSkorTerbaik((prev) =>
        prev === null ? hasil.persentase : Math.max(prev, hasil.persentase),
      );
      setJumlahPercobaan((prev) => prev + 1);
    },
    [modulId],
  );

  return { skorTerbaik, jumlahPercobaan, simpan };
}

export function useSemuaRiwayat() {
  const [riwayat, setRiwayat] = useState<HasilKuis[]>([]);
  useEffect(() => {
    setRiwayat(bacaRiwayat());
  }, []);
  return riwayat;
}
