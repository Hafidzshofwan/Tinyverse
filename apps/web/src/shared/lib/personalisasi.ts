"use client";

/**
 * Lapisan kompatibilitas.
 *
 * Sejak P12, seluruh logika personalisasi (favorit + pemakaian) dipindahkan ke
 * modul `@/shared/user-settings` yang menerapkan pola Repository (localStorage
 * + Firestore per-akun). File ini sengaja dipertahankan sebagai penerus API
 * lama agar komponen yang sudah ada (HomeQuickAccess, HomeFavorites, AppShell)
 * tidak perlu diubah import-nya.
 */
export {
  bacaFavorit,
  bacaPemakaian,
  catatPemakaian,
  toggleFavorit,
  hapusFavorit,
  usePemakaian,
  useFavorit,
  setPenggunaAktif,
} from "@/shared/user-settings";
