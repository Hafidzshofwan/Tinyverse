/**
 * Modul pengaturan pengguna (pola Repository, P12).
 *
 * Menyediakan port `UserSettingsRepository` + dua implementasi (localStorage &
 * Firestore) dan sebuah store reaktif offline-first. Komponen cukup memakai
 * hook/fungsi dari sini tanpa tahu detail penyimpanannya.
 */
export type { UserSettings } from "./types";
export { DEFAULT_USER_SETTINGS } from "./types";
export type { UserSettingsRepository } from "./repository";
export {
  bacaFavorit,
  bacaPemakaian,
  catatPemakaian,
  toggleFavorit,
  hapusFavorit,
  usePemakaian,
  useFavorit,
  setPenggunaAktif,
} from "./store";
