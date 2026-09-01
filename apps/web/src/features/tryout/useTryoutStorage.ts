"use client";

import { useState, useEffect } from "react";
import type { HasilTryOut } from "./types";

const STORAGE_PREFIX = "tv_tryout_history_";

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
    } catch {
      // safe fallback
    }
  }

  return { riwayat, skorTerbaik, jumlahPercobaan, simpanHasil };
}
