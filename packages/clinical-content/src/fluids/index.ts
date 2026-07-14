import { fluidsContentRaw } from "./fluids.data"
import { fluidsContentSchema, type FluidsContent, type FluidsData } from "./fluids.schema"
import type { Provenance } from "../provenance/schema"

/**
 * Konten Fluids yang SUDAH divalidasi. Parsing terjadi saat modul dimuat, jadi
 * data yang cacat gagal cepat (fail-fast) alih-alih menyebar diam-diam ke domain.
 */
export const fluidsContent: FluidsContent = fluidsContentSchema.parse(fluidsContentRaw)

/** Ambil hanya data klinis Fluids (tanpa provenance). */
export function getFluidsData(): FluidsData {
	return fluidsContent.data
}

/** Ambil metadata provenance konten Fluids. */
export function getFluidsProvenance(): Provenance {
	return fluidsContent.provenance
}

export type { FluidsContent, FluidsData } from "./fluids.schema"
