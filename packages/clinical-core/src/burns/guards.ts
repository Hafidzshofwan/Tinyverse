// Burns bounded context — input guards. Fungsi murni harus menolak input tidak valid.

/** Usia (tahun) harus angka finite dan >= 0. Bayi < 1 th valid (mis. 0.5). */
export function assertValidAgeYears(ageYears: number): void {
	if (typeof ageYears !== "number" || !Number.isFinite(ageYears) || ageYears < 0) {
		throw new Error(`Usia tidak valid: ${ageYears}. Harus angka >= 0 tahun.`)
	}
}

/** Berat badan (kg) harus angka finite dan > 0. */
export function assertPositiveWeight(weightKg: number): void {
	if (typeof weightKg !== "number" || !Number.isFinite(weightKg) || weightKg <= 0) {
		throw new Error(`Berat badan tidak valid: ${weightKg}. Harus angka lebih dari 0 kg.`)
	}
}
