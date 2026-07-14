import { z } from "zod"
import { provenanceSchema, type Provenance } from "../provenance/schema"

/**
 * Membungkus sebuah skema data menjadi "konten terversi": data + provenance-nya.
 * Dipakai agar setiap dataset klinis selalu membawa metadata asal-usul.
 */
export function versionedContentSchema<TData extends z.ZodTypeAny>(dataSchema: TData) {
	return z.object({
		provenance: provenanceSchema,
		data: dataSchema,
	})
}

/** Bentuk hasil parse dari versionedContentSchema. */
export interface VersionedContent<TData> {
	provenance: Provenance
	data: TData
}
