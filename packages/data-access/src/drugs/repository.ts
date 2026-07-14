import type { Id, ListOptions, Page } from "../shared/types"
import type { DrugRecord } from "./types"

/**
 * Port (kontrak) akses katalog obat.
 *
 * Lapisan aplikasi HANYA bergantung pada interface ini — bukan pada Firebase.
 * Implementasi konkret (Firebase / in-memory) bisa ditukar tanpa mengubah
 * kode pemakai. Inilah inti pola repository di P11.
 */
export type DrugRepository = {
	/** Ambil satu obat berdasarkan id; melempar NotFoundError bila tak ada. */
	getById(id: Id): Promise<DrugRecord>
	/** Ambil satu obat; null bila tak ada (tanpa melempar error). */
	findById(id: Id): Promise<DrugRecord | null>
	/** Daftar obat (berhalaman). */
	list(options?: ListOptions): Promise<Page<DrugRecord>>
	/** Cari obat berdasarkan teks (nama atau indikasi). */
	search(query: string, options?: ListOptions): Promise<Page<DrugRecord>>
}
