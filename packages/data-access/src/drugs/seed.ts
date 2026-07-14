import { type Firestore, doc, writeBatch } from "firebase/firestore"
import type { DrugRecord } from "./types"

/**
 * Unggah (seed) katalog obat ke Firestore sekali jalan.
 *
 * Menulis tiap obat sebagai dokumen `drugs/{id}` memakai satu batch
 * (atomik). Panggil dari skrip sekali pakai — lihat `examples/seed-drugs.mjs`.
 *
 * @returns jumlah dokumen yang ditulis.
 */
export async function seedDrugsToFirestore(
	firestore: Firestore,
	drugs: readonly DrugRecord[],
	collectionName = "drugs",
): Promise<number> {
	const batch = writeBatch(firestore)
	for (const d of drugs) {
		batch.set(doc(firestore, collectionName, d.id), d)
	}
	await batch.commit()
	return drugs.length
}
