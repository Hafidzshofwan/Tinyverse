"use client";

import type { UserSettings } from "./types";

/**
 * Implementasi penyimpanan lokal (localStorage / per-browser).
 *
 * Kunci penyimpanan sengaja dipertahankan sama seperti versi sebelumnya
 * (`tv-favorit`, `tv-pemakaian`) supaya data personalisasi pengguna yang sudah
 * ada tidak hilang saat pembaruan ini dipasang.
 */

const KUNCI_PEMAKAIAN = "tv-pemakaian";
const KUNCI_FAVORIT = "tv-favorit";

function bacaJson<T>(kunci: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const mentah = window.localStorage.getItem(kunci);
    return mentah ? (JSON.parse(mentah) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Baca seluruh pengaturan dari localStorage. */
export function bacaLokal(): UserSettings {
  return {
    favorit: bacaJson<string[]>(KUNCI_FAVORIT, []),
    pemakaian: bacaJson<Record<string, number>>(KUNCI_PEMAKAIAN, {}),
  };
}

/** Tulis seluruh pengaturan ke localStorage. */
export function tulisLokal(nilai: UserSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KUNCI_FAVORIT, JSON.stringify(nilai.favorit));
    window.localStorage.setItem(
      KUNCI_PEMAKAIAN,
      JSON.stringify(nilai.pemakaian),
    );
  } catch {
    /* abaikan bila storage tidak tersedia (mis. mode privat penuh). */
  }
}
