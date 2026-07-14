import { NotFoundError } from "../shared/errors"
import type { Id, ListOptions, Page } from "../shared/types"
import type { DrugRecord } from "./types"
import type { DrugRepository } from "./repository"

/**
 * Implementasi in-memory untuk pengembangan, preview, & pengujian
 * (tanpa Firebase). Deterministik: daftar diurutkan berdasarkan `nama`.
 */
export class InMemoryDrugRepository implements DrugRepository {
	private readonly byId: Map<Id, DrugRecord>

	constructor(seed: readonly DrugRecord[] = []) {
		this.byId = new Map<Id, DrugRecord>(seed.map((d) => [d.id, d] as const))
	}

	async findById(id: Id): Promise<DrugRecord | null> {
		return this.byId.get(id) ?? null
	}

	async getById(id: Id): Promise<DrugRecord> {
		const found = await this.findById(id)
		if (!found) throw new NotFoundError("Obat", id)
		return found
	}

	async list(options: ListOptions = {}): Promise<Page<DrugRecord>> {
		const sorted = [...this.byId.values()].sort((a, b) =>
			a.nama.localeCompare(b.nama),
		)
		return paginate(sorted, options)
	}

	async search(
		query: string,
		options: ListOptions = {},
	): Promise<Page<DrugRecord>> {
		const q = query.trim().toLowerCase()
		const matched = [...this.byId.values()].filter(
			(d) =>
				d.nama.toLowerCase().includes(q) ||
				(d.indikasi?.toLowerCase().includes(q) ?? false),
		)
		matched.sort((a, b) => a.nama.localeCompare(b.nama))
		return paginate(matched, options)
	}
}

/** Paginasi berbasis kursor sederhana (kursor = indeks awal sebagai string). */
function paginate<T>(rows: readonly T[], options: ListOptions): Page<T> {
	const start = options.cursor ? Number(options.cursor) : 0
	const limit = options.limit ?? rows.length
	const slice = rows.slice(start, start + limit)
	const next = start + limit
	return {
		items: slice,
		nextCursor: next < rows.length ? String(next) : null,
	}
}
