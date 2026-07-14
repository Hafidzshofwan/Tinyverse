// Obat/Dosing bounded context — pemilihan sediaan aktif.
// Pure port dari v17 `pilihSediaanAktif`.

import type { Obat, SediaanOption } from "./types"

export function pilihSediaanAktif(obat: Obat, sediaanIndexInput?: string | number): SediaanOption | null {
	if (!obat || !Array.isArray(obat.sediaanOptions) || obat.sediaanOptions.length === 0) return null
	const parsed = Number.parseInt(String(sediaanIndexInput ?? 0), 10)
	const raw = Number.isNaN(parsed) ? 0 : parsed
	const idx = Math.max(0, Math.min(obat.sediaanOptions.length - 1, raw))
	// idx sudah diklem ke rentang array yang valid & array dipastikan tidak
	// kosong di atas, jadi elemen ini selalu ada; `?? null` hanya untuk
	// memenuhi tipe di bawah `noUncheckedIndexedAccess`.
	return obat.sediaanOptions[idx] ?? null
}

export interface MlResult {
	dosisMinMl: number | null
	dosisMaxMl: number | null
}

/** Konversi mg -> mL dari sediaan aktif. Pure port dari v17 `hitungMlDariSediaan`. */
export function hitungMlDariSediaan(
	sedMgFinal: number | undefined,
	sedMlFinal: number | undefined,
	dosisMinMg: number | null,
	dosisMaxMg: number | null,
): MlResult {
	if (sedMgFinal && sedMlFinal && dosisMinMg !== null && dosisMaxMg !== null) {
		const mgPerMl = sedMgFinal / sedMlFinal
		return { dosisMinMl: dosisMinMg / mgPerMl, dosisMaxMl: dosisMaxMg / mgPerMl }
	}
	return { dosisMinMl: null, dosisMaxMl: null }
}
