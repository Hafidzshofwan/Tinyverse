"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserSettings } from "./types";
import { bacaLokal, tulisLokal } from "./local";
import { buatRepoFirestore } from "./firestore";
import type { UserSettingsRepository } from "./repository";

/**
 * Store personalisasi reaktif (favorit + pemakaian).
 *
 * Strategi "offline-first":
 * - Cache di memori menjadi sumber baca cepat (sinkron) untuk komponen, agar
 *   API publik tetap sederhana dan tidak perlu mengubah komponen lama.
 * - Setiap tulisan langsung disimpan ke localStorage (cache lokal) SEKALIGUS
 *   dikirim ke Firestore lewat repository bila pengguna login (mode "akun").
 * - Saat login, pengaturan akun dimuat. Bila akun masih kosong tetapi ada data
 *   lokal, data lokal diunggah sekali (migrasi mulus per-browser -> per-akun).
 */

const EVENT = "tv-personalisasi"; // pertahankan nama event lama (kompatibel).

type Mode = "lokal" | "akun";

let mode: Mode = "lokal";
let uidAktif: string | null = null;
let repo: UserSettingsRepository | null = null;

let cache: UserSettings = { favorit: [], pemakaian: {} };
let terhidrasiLokal = false;

function pancarkan(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function pastikanLokal(): void {
  if (terhidrasiLokal || typeof window === "undefined") return;
  cache = bacaLokal();
  terhidrasiLokal = true;
}

function repoAktif(): UserSettingsRepository {
  if (!repo) repo = buatRepoFirestore();
  return repo;
}

function simpanKeAkun(patch: Partial<UserSettings>): void {
  if (mode !== "akun" || !uidAktif) return;
  const uid = uidAktif;
  void (async () => {
    try {
      await repoAktif().update(uid, patch);
    } catch {
      /* offline / ditolak aturan keamanan: cukup andalkan cache lokal. */
    }
  })();
}

// ---- Pembacaan sinkron (dipakai komponen) --------------------------------

export function bacaFavorit(): string[] {
  pastikanLokal();
  return cache.favorit;
}

export function bacaPemakaian(): Record<string, number> {
  pastikanLokal();
  return cache.pemakaian;
}

// ---- Penulisan (optimistic + write-through) ------------------------------

/** Catat satu kali pembukaan fitur (dipanggil sistem dari AppShell). */
export function catatPemakaian(href: string): void {
  if (!href) return;
  pastikanLokal();
  const pemakaian: Record<string, number> = {
    ...cache.pemakaian,
    [href]: (cache.pemakaian[href] ?? 0) + 1,
  };
  cache = { ...cache, pemakaian };
  tulisLokal(cache);
  simpanKeAkun({ pemakaian });
  pancarkan();
}

/** Tambah bila belum favorit, hapus bila sudah. */
export function toggleFavorit(href: string): void {
  if (!href) return;
  pastikanLokal();
  const daftar = cache.favorit.slice();
  const posisi = daftar.indexOf(href);
  if (posisi >= 0) daftar.splice(posisi, 1);
  else daftar.push(href);
  cache = { ...cache, favorit: daftar };
  tulisLokal(cache);
  simpanKeAkun({ favorit: daftar });
  pancarkan();
}

export function hapusFavorit(href: string): void {
  pastikanLokal();
  const daftar = cache.favorit.filter((h) => h !== href);
  cache = { ...cache, favorit: daftar };
  tulisLokal(cache);
  simpanKeAkun({ favorit: daftar });
  pancarkan();
}

// ---- Sinkronisasi akun ----------------------------------------------------

/**
 * Dipanggil AppShell setiap status login berubah.
 * - uid asli -> mode "akun" (Firestore + localStorage).
 * - null     -> mode "lokal" (mis. keluar / Mode Tinjau) => localStorage saja.
 */
export function setPenggunaAktif(uid: string | null): void {
  if (!uid) {
    mode = "lokal";
    uidAktif = null;
    return;
  }
  if (mode === "akun" && uidAktif === uid) return; // sudah aktif, hindari muat ganda.
  mode = "akun";
  uidAktif = uid;
  void hidrasiDariAkun(uid);
}

async function hidrasiDariAkun(uid: string): Promise<void> {
  pastikanLokal();
  try {
    const jauh = await repoAktif().get(uid);
    const akunKosong =
      jauh.favorit.length === 0 && Object.keys(jauh.pemakaian).length === 0;
    const lokalAda =
      cache.favorit.length > 0 || Object.keys(cache.pemakaian).length > 0;
    if (akunKosong && lokalAda) {
      // Migrasi sekali: unggah data lokal ke akun.
      cache = await repoAktif().update(uid, {
        favorit: cache.favorit,
        pemakaian: cache.pemakaian,
      });
    } else {
      cache = jauh;
    }
    tulisLokal(cache);
    pancarkan();
  } catch {
    /* offline: tetap gunakan cache lokal yang ada. */
  }
}

// ---- Hook reaktif ---------------------------------------------------------

function useSinkron<T>(baca: () => T, awal: T): T {
  const [nilai, setNilai] = useState<T>(awal);
  useEffect(() => {
    const perbarui = () => setNilai(baca());
    perbarui();
    window.addEventListener(EVENT, perbarui);
    window.addEventListener("storage", perbarui);
    return () => {
      window.removeEventListener(EVENT, perbarui);
      window.removeEventListener("storage", perbarui);
    };
  }, [baca]);
  return nilai;
}

export function usePemakaian(): Record<string, number> {
  const baca = useCallback(() => bacaPemakaian(), []);
  return useSinkron<Record<string, number>>(baca, {});
}

export function useFavorit(): string[] {
  const baca = useCallback(() => bacaFavorit(), []);
  return useSinkron<string[]>(baca, []);
}
