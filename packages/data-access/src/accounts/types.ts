import type { Id, IsoDateTime } from "../shared/types"

/**
 * Akun = PEMILIK langganan.
 *
 * WHY akun terpisah dari user: langganan sengaja TIDAK ditempelkan ke uid
 * pengguna. Hari ini satu akun berisi satu orang, sehingga lapisan ini terasa
 * berlebihan. Tetapi saat nanti ada institusi yang membeli banyak lisensi,
 * kita cukup menambah anggota ke akun yang sudah ada. Bila langganan terlanjur
 * menempel di uid, seluruh data langganan yang sedang berjalan (dengan uang
 * sungguhan di dalamnya) harus dimigrasi — pekerjaan mahal dan berisiko.
 * Biaya sekarang: satu koleksi. Biaya nanti: berminggu-minggu.
 */
export type Account = {
	id: Id
	/** "personal" = satu orang; "organization" = institusi (dipakai kelak). */
	kind: AccountKind
	name: string
	/** uid pemilik. Untuk akun personal, sama dengan satu-satunya anggota. */
	ownerUid: Id
	createdAt: IsoDateTime
}

export type AccountKind = "personal" | "organization"

/** Peran anggota di dalam akun. Sengaja sudah ada sejak awal agar pengecekan
 *  hak akses tidak perlu diubah bentuknya saat fitur multi-user datang. */
export type MembershipRole = "owner" | "admin" | "member"

/** Hubungan N:N antara user dan akun. */
export type Membership = {
	accountId: Id
	uid: Id
	role: MembershipRole
	createdAt: IsoDateTime
}
