// Obat/Dosing bounded context — tipe domain (pure, no React/DOM).
// Port 1:1 dari struktur data v17 `daftarObat` (dimuat dari Firestore) dan
// dari hasil `hitungDosisInti`.

export type DoseType = "flat" | "perKgVolume" | "byAge" | "ageBands" | "perKg"
export type DoseBasis = "perDay" | "perDose" | "singleDose" | "perEpisode"

export interface SediaanOption {
	sediaanMg?: number
	sediaanMl?: number
	label?: string
}

export interface DoseAgeBand {
	usiaMinBulan: number
	usiaMaxBulan: number
	tipe: "perKg" | "flat"
	labelUsia?: string
	frekuensi?: string
	catatan?: string
	doseBasis?: DoseBasis
	dosesPerDay?: number
	maxDosesPerDay?: number
	dosisMinPerKg?: number
	dosisMaxPerKg?: number
	dosisFlatMin?: number
	dosisFlatMax?: number
	dosisMaksimalTunggalMg?: number
	dosisMaksimalHarianMg?: number
	sediaanMg?: number
	sediaanMl?: number
	sediaanLabel?: string
}

/**
 * Bentuk data satu obat, persis field yang dipakai oleh `hitungDosisInti` v17.
 * Field lain yang ada pada dokumen Firestore (mis. `kelasAlergi`, `puyer`,
 * `kontraindikasi`, dll) TIDAK dimodelkan di sini karena tidak dipakai oleh
 * mesin perhitungan dosis — hanya dipakai oleh modul lain (interaksi obat,
 * puyer, dsb.) yang akan dimigrasi pada bounded context terpisah.
 */
export interface Obat {
	nama: string
	varian?: string
	doseType: DoseType
	doseBasis?: DoseBasis
	unitLabel?: string
	satuanDosis?: string
	frekuensi?: string
	catatan?: string
	indikasi?: string
	sediaanCustomText?: string

	dosesPerDay?: number
	maxDosesPerDay?: number

	// perKg (default branch)
	dosisMinPerKg?: number
	dosisMaxPerKg?: number

	// flat
	dosisFlatMin?: number
	dosisFlatMax?: number

	// perKgVolume
	volumeMinPerKg?: number
	volumeMaxPerKg?: number

	// capping
	dosisMaksimalTunggalMg?: number
	dosisMaksimalHarianMg?: number
	dosisMaksimalHarianPerKg?: number

	// byAge
	ambangUsiaBulan?: number
	dosisDibawahAmbangMg?: number
	dosisDiatasAmbangMg?: number
	catatanDibawahAmbang?: string
	catatanDiatasAmbang?: string
	usiaMinValidBulan?: number
	usiaMaxValidBulan?: number

	// sediaan
	sediaanMg?: number
	sediaanMl?: number
	sediaanOptions?: SediaanOption[]

	// ageBands
	bands?: DoseAgeBand[]
}

/** Hasil sukses dari `calculateDosing` — port dari return value `hitungDosisInti`. */
export interface DosingResult {
	error: null
	peringatan: string[]
	dosisMinMg: number | null
	dosisMaxMg: number | null
	dosisMinMl: number | null
	dosisMaxMl: number | null
	dosisHarianMinMg: number | null
	dosisHarianMaxMg: number | null
	beratBadan: number | null
	usiaBulan: number | null
	band: DoseAgeBand | null
	sedMgFinal?: number
	sedMlFinal?: number
	sediaanLabelFinal: string | null
	doseBasisFinal: DoseBasis
	dosesPerDayFinal: number | null
}

/** Hasil gagal (input tidak valid) — port dari `{ error: string }` v17. */
export interface DosingError {
	error: string
}

export type DosingOutput = DosingResult | DosingError

export function isDosingError(output: DosingOutput): output is DosingError {
	return output.error !== null
}
