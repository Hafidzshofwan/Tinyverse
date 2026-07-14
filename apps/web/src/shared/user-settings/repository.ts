import type { UserSettings } from "./types";

/**
 * Port penyimpanan pengaturan pengguna (pola Repository).
 *
 * Sejalan dengan `UserRepository.getSettings/updateSettings` di paket
 * `@tinyverse/data-access`. UI tidak perlu tahu implementasinya localStorage
 * atau Firestore — cukup memakai kontrak ini.
 */
export interface UserSettingsRepository {
  /** Ambil seluruh pengaturan milik satu pengguna. */
  get(uid: string): Promise<UserSettings>;
  /**
   * Perbarui sebagian pengaturan (baca-ubah-tulis / shallow merge) dan
   * kembalikan hasil akhir setelah penggabungan.
   */
  update(uid: string, patch: Partial<UserSettings>): Promise<UserSettings>;
}
