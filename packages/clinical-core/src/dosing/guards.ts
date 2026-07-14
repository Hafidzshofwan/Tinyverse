// Obat/Dosing bounded context — validasi input berat badan & usia.
//
// Berbeda dari bounded context Fluids (yang throw Error), fungsi ini
// mengembalikan `{ error: string }` alih-alih throw. Ini SENGAJA meniru
// kontrak asli `hitungDosisInti` v17 (early-return `{ error }`), karena
// kalkulator ini punya banyak cabang validasi bertingkat (usia vs berat,
// per doseType) yang di v17 semuanya memakai pola return-based error, bukan
// exception. Mempertahankan kontrak ini penting untuk fidelity port 1:1.

import type { DoseAgeBand, DoseType } from "./types"

export type WeightCheck = { beratBadan: number } | { error: string }
export type AgeCheck = { usiaBulan: number } | { error: string }

function toFloat(input: string | number | undefined): number {
	return typeof input === "number" ? input : Number.parseFloat(String(input ?? ""))
}

/**
 * Validasi berat badan. Port dari pengecekan `beratBadan` di v17
 * (dipakai di cabang default/flat/perKgVolume DAN di band `tipe: "perKg"`).
 */
export function validateWeightInput(beratBadanInput: string | number | undefined, forBand = false): WeightCheck {
	const beratBadan = toFloat(beratBadanInput)
	if (Number.isNaN(beratBadan) || beratBadan <= 0) {
		return {
			error: forBand
				? "Mohon masukkan berat badan yang valid (lebih dari 0 kg) untuk kelompok usia ini."
				: "Mohon masukkan berat badan yang valid (lebih dari 0 kg).",
		}
	}
	if (beratBadan > 150) {
		return { error: "Berat badan tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda." }
	}
	return { beratBadan }
}

/** Validasi usia (bulan). Port dari pengecekan `usiaBulan` di v17 (byAge & ageBands). */
export function validateAgeInput(usiaBulanInput: string | number | undefined): AgeCheck {
	const usiaBulan = toFloat(usiaBulanInput)
	if (Number.isNaN(usiaBulan) || usiaBulan < 0) {
		return { error: "Mohon masukkan usia anak yang valid (dalam bulan)." }
	}
	if (usiaBulan > 216) {
		return { error: "Usia tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda." }
	}
	return { usiaBulan }
}

/** Cari age band yang cocok. Port dari `obat.bands.find(...)` di v17. */
export function findMatchingBand(bands: DoseAgeBand[] | undefined, usiaBulan: number): DoseAgeBand | null {
	if (!bands) return null
	return bands.find((b) => usiaBulan >= b.usiaMinBulan && usiaBulan <= b.usiaMaxBulan) ?? null
}

export function isKnownDoseType(doseType: string): doseType is DoseType {
	return doseType === "flat" || doseType === "perKgVolume" || doseType === "byAge" || doseType === "ageBands" || doseType === "perKg"
}
