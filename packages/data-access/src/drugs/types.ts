import type { Id } from "../shared/types"

/**
 * DTO penyimpanan katalog obat — bentuk apa adanya dari `obat.json` v17
 * (35 obat). Ini SENGAJA "data mentah penyimpanan", bukan tipe domain klinis.
 *
 * Pemetaan ke tipe domain (clinical-core `dosing`) dilakukan di lapisan
 * entity aplikasi, BUKAN di sini. Repository hanya berurusan dengan
 * penyimpanan & pengambilan record.
 */

export type DrugDoseType =
	| "flat"
	| "perKg"
	| "ageBands"
	| "perKgVolume"
	| "byAge"

export type DrugDoseBasis = "perDay" | "perDose"

/** Opsi sediaan (mis. sirup 120 mg / 5 mL). */
export type DrugSediaanOption = {
	label: string
	sediaanMg?: number
	sediaanMl?: number
	sediaanIU?: number
}

/** Satu pita usia untuk `doseType: "ageBands"`. */
export type DrugBand = {
	labelUsia: string
	tipe: string
	usiaMinBulan?: number
	usiaMaxBulan?: number
	doseBasis?: DrugDoseBasis
	frekuensi?: string
	dosisFlatMin?: number
	dosisFlatMax?: number
	maxDosesPerDay?: number
	catatan?: string
}

/** Konfigurasi puyer (racikan). */
export type DrugPuyer = {
	mode?: string
	dosis?: number
	sediaan?: number
	alias?: string[]
	catatan?: string
}

/**
 * Satu record obat. Field inti selalu ada; sisanya opsional karena
 * bergantung pada `doseType` (flat / perKg / ageBands / perKgVolume / byAge).
 */
export type DrugRecord = {
	// --- Inti ---
	id: Id
	nama: string
	jenis: string
	icon?: string
	doseType: DrugDoseType
	doseBasis?: DrugDoseBasis

	// --- Dosis flat ---
	dosisFlatMin?: number
	dosisFlatMax?: number

	// --- Dosis per kg ---
	dosisMinPerKg?: number
	dosisMaxPerKg?: number
	dosisMaksimalTunggalMg?: number
	dosisMaksimalHarianMg?: number
	dosisMaksimalHarianPerKg?: number

	// --- Volume per kg (perKgVolume) ---
	volumeMinPerKg?: number
	volumeMaxPerKg?: number

	// --- byAge (ambang usia) ---
	ambangUsiaBulan?: number
	usiaMinValidBulan?: number
	usiaMaxValidBulan?: number
	dosisDibawahAmbangMg?: number
	dosisDiatasAmbangMg?: number
	catatanDibawahAmbang?: string
	catatanDiatasAmbang?: string

	// --- Sediaan ---
	satuanDosis?: string
	unitLabel?: string
	sediaanMg?: number
	sediaanMl?: number
	sediaanIU?: number
	sediaanOptions?: DrugSediaanOption[]
	sediaanCustomText?: string

	// --- ageBands ---
	bands?: DrugBand[]

	// --- Frekuensi & dosis harian ---
	maxDosesPerDay?: number
	dosesPerDay?: number
	frekuensi?: string

	// --- Informasi klinis / keselamatan ---
	indikasi?: string
	catatan?: string
	kelasAlergi?: string[]
	interaksiTags?: string[]
	kontraindikasi?: string[]
	peringatan?: string[]
	keselamatanVersi?: string
	keselamatanCatatan?: string

	// --- Puyer ---
	bisaDipuyer?: boolean
	puyerSediaanMg?: number
	puyer?: DrugPuyer
}
