/**
 * Kesalahan standar lapisan data-access.
 *
 * Semua adapter (Firebase, in-memory, dll.) melempar tipe ini agar lapisan
 * di atas bisa menangani error secara seragam tanpa tahu sumber datanya.
 */

export class RepositoryError extends Error {
	readonly code: string
	readonly detail?: unknown
	constructor(code: string, message: string, detail?: unknown) {
		super(message)
		this.name = "RepositoryError"
		this.code = code
		this.detail = detail
	}
}

/** Entitas yang diminta tidak ditemukan. */
export class NotFoundError extends RepositoryError {
	constructor(entity: string, id: string) {
		super("not_found", entity + ' dengan id "' + id + '" tidak ditemukan.')
		this.name = "NotFoundError"
	}
}

/** Metode adapter belum diimplementasikan (mis. kerangka Firebase P11). */
export class NotImplementedError extends RepositoryError {
	constructor(what: string) {
		super("not_implemented", what + " belum diimplementasikan.")
		this.name = "NotImplementedError"
	}
}
