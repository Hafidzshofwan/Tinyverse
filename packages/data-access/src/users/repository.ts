import type { Id } from "../shared/types"
import type { UserAccount, UserSettings } from "./types"

/**
 * Port akses akun & pengaturan pengguna.
 *
 * Lapisan aplikasi bergantung pada interface ini, bukan pada Firebase
 * Auth/Firestore langsung. Adapter konkret bisa ditukar bebas.
 */
export type UserRepository = {
	/** Akun berdasarkan uid; null bila belum ada. */
	getAccount(uid: Id): Promise<UserAccount | null>
	/** Simpan/perbarui akun (upsert). */
	saveAccount(account: UserAccount): Promise<void>
	/** Pengaturan pengguna; mengembalikan default bila belum diset. */
	getSettings(uid: Id): Promise<UserSettings>
	/** Perbarui sebagian pengaturan (merge dangkal), lalu kembalikan hasilnya. */
	updateSettings(uid: Id, patch: Partial<UserSettings>): Promise<UserSettings>
}
