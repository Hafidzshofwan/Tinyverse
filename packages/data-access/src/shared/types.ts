/** Tipe primitif bersama untuk lapisan data-access. */

/** ID unik entitas (string opak; jangan diurai/diparse isinya). */
export type Id = string

/** Timestamp ISO-8601, mis. "2026-07-12T14:00:00.000Z". */
export type IsoDateTime = string

/**
 * Hasil daftar berhalaman. Dibuat generik agar semua repository memakai
 * bentuk paginasi yang sama saat data tumbuh besar (kursor, bukan offset).
 */
export type Page<T> = {
	items: T[]
	/** Kursor untuk halaman berikutnya; null bila sudah habis. */
	nextCursor: string | null
}

/** Opsi query daftar standar. */
export type ListOptions = {
	limit?: number
	cursor?: string | null
}
