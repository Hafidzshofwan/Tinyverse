import type { Id, IsoDateTime } from "../shared/types"

/**
 * Akun pengguna. Bentuk minimal turunan Firebase Auth v17
 * (`currentUser`: uid / email / displayName). Field lain menyusul saat wiring.
 */
export type UserAccount = {
	uid: Id
	email: string | null
	displayName: string | null
	photoUrl?: string | null
	createdAt?: IsoDateTime
	lastLoginAt?: IsoDateTime
}

/** Tema warna aplikasi (sesuai token ui-kit: navy default / warm). */
export type ThemeName = "navy" | "warm"

/**
 * Pengaturan & preferensi pengguna. Field diturunkan dari data yang v17
 * simpan di localStorage (tema, favorit, obat terakhir, nomor RM, dll.).
 *
 * Bentuk ini PLACEHOLDER — akan difinalkan saat memindahkan penyimpanan
 * v17 ke repository. `extra` menampung preferensi yang belum dipetakan.
 */
export type UserSettings = {
	theme?: ThemeName
	/** Id obat yang difavoritkan. */
	favoriteDrugIds?: Id[]
	/** Id obat yang baru dipakai (urut terbaru dulu). */
	recentDrugIds?: Id[]
	/** Nomor rekam medis default pada form. */
	defaultRmNumber?: string
	/** Preferensi lain yang belum dipetakan (bebas). */
	extra?: Record<string, unknown>
}

/** Nilai default pengaturan bila pengguna belum punya. */
export const DEFAULT_USER_SETTINGS: UserSettings = {
	theme: "navy",
	favoriteDrugIds: [],
	recentDrugIds: [],
}
