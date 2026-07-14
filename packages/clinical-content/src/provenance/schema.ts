import { z } from "zod"

/**
 * Skema metadata asal-usul (provenance) yang WAJIB menyertai setiap konten klinis.
 * Tujuan: tiap angka klinis dapat ditelusuri sumber, versi, dan tanggal berlakunya.
 */
export const provenanceSchema = z.object({
	/** Dari mana data ini berasal (guideline, paper, atau "ported from v17"). */
	source: z.string().min(1),
	/** Penanda versi konten (mis. "v17", "2024.1"). */
	version: z.string().min(1),
	/** Tanggal berlaku, format ISO YYYY-MM-DD. */
	effectiveDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "effectiveDate harus format ISO YYYY-MM-DD"),
	/** URL rujukan opsional. */
	url: z.string().url().optional(),
	/** Siapa/proses yang meninjau (opsional). */
	reviewedBy: z.string().optional(),
	/** Catatan tambahan (opsional). */
	note: z.string().optional(),
})

export type Provenance = z.infer<typeof provenanceSchema>
