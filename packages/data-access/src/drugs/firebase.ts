import {
	type Firestore,
	type QueryConstraint,
	collection,
	doc,
	getDoc,
	getDocs,
	limit as limitClause,
	orderBy,
	query,
	startAfter,
} from "firebase/firestore"
import { NotFoundError } from "../shared/errors"
import type { Id, ListOptions, Page } from "../shared/types"
import type { DrugRecord } from "./types"
import type { DrugRepository } from "./repository"

/** Dependensi adapter Firestore katalog obat. */
export type FirebaseDrugRepositoryDeps = {
	/** Instance Firestore (dari `getFirestore(app)`). */
	firestore: Firestore
	/** Nama koleksi Firestore; default "drugs". */
	collectionName?: string
}

/**
 * Adapter Firestore untuk katalog obat.
 *
 * Setiap obat disimpan sebagai satu dokumen di koleksi `drugs` dengan
 * document id = `DrugRecord.id`. Bentuk dokumen = `DrugRecord` apa adanya.
 */
export class FirebaseDrugRepository implements DrugRepository {
	private readonly firestore: Firestore
	private readonly collectionName: string

	constructor(deps: FirebaseDrugRepositoryDeps) {
		this.firestore = deps.firestore
		this.collectionName = deps.collectionName ?? "drugs"
	}

	async findById(id: Id): Promise<DrugRecord | null> {
		const snap = await getDoc(doc(this.firestore, this.collectionName, id))
		return snap.exists() ? (snap.data() as DrugRecord) : null
	}

	async getById(id: Id): Promise<DrugRecord> {
		const found = await this.findById(id)
		if (!found) throw new NotFoundError("Obat", id)
		return found
	}

	async list(options: ListOptions = {}): Promise<Page<DrugRecord>> {
		const col = collection(this.firestore, this.collectionName)
		const clauses: QueryConstraint[] = [orderBy("nama")]
		if (options.cursor) clauses.push(startAfter(options.cursor))
		if (options.limit) clauses.push(limitClause(options.limit))
		const snap = await getDocs(query(col, ...clauses))
		const items = snap.docs.map((d) => d.data() as DrugRecord)
		const last = items[items.length - 1]
		const reachedLimit =
			options.limit !== undefined && items.length === options.limit
		const nextCursor = reachedLimit && last ? last.nama : null
		return { items, nextCursor }
	}

	async search(
		queryText: string,
		options: ListOptions = {},
	): Promise<Page<DrugRecord>> {
		// Katalog kecil & statis (±35 obat): ambil semua lalu filter di memori,
		// meniru perilaku v17. Firestore tidak punya pencarian substring bawaan.
		const col = collection(this.firestore, this.collectionName)
		const snap = await getDocs(query(col, orderBy("nama")))
		const q = queryText.trim().toLowerCase()
		const all = snap.docs.map((d) => d.data() as DrugRecord)
		const matched = all.filter(
			(d) =>
				d.nama.toLowerCase().includes(q) ||
				(d.indikasi?.toLowerCase().includes(q) ?? false),
		)
		const start = options.cursor ? Number(options.cursor) : 0
		const lim = options.limit ?? matched.length
		const slice = matched.slice(start, start + lim)
		const next = start + lim
		return {
			items: slice,
			nextCursor: next < matched.length ? String(next) : null,
		}
	}
}
