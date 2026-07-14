/**
 * Bentuk pengaturan pengguna yang dapat dipersonalisasi.
 *
 * Sengaja dibuat sebagai cermin dari `UserSettings` pada paket
 * `@tinyverse/data-access` (P11), sehingga penyimpanan dapat berpindah dari
 * localStorage -> Firestore -> paket data-access tanpa mengubah komponen UI.
 */
export interface UserSettings {
  /** Daftar href fitur favorit pilihan pengguna. */
  favorit: string[];
  /** Berapa kali tiap fitur dibuka (dasar urutan otomatis Quick Access). */
  pemakaian: Record<string, number>;
}

/** Nilai awal ketika pengguna belum punya pengaturan tersimpan. */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  favorit: [],
  pemakaian: {},
};
