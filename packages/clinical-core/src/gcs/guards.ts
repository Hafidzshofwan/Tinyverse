// GCS bounded context — input guards. Fungsi murni menolak input tidak valid.

/** Rentang skor valid tiap komponen (sesuai OPSI v17). */
export const EYE_SCORE_RANGE = { min: 1, max: 4 } as const
export const MOTOR_SCORE_RANGE = { min: 1, max: 6 } as const
export const VERBAL_SCORE_RANGE = { min: 1, max: 5 } as const

function assertScoreInRange(
	name: string,
	value: number | null,
	min: number,
	max: number,
): void {
	if (value === null) return
	if (
		typeof value !== "number" ||
		!Number.isInteger(value) ||
		value < min ||
		value > max
	) {
		throw new Error(
			`Skor ${name} tidak valid: ${value}. Harus bilangan bulat ${min}\u2013${max} atau kosong (null).`,
		)
	}
}

/** Validasi ketiga komponen sekaligus (null = belum dipilih, diizinkan). */
export function assertValidComponentScores(
	eye: number | null,
	motor: number | null,
	verbal: number | null,
): void {
	assertScoreInRange("Eye", eye, EYE_SCORE_RANGE.min, EYE_SCORE_RANGE.max)
	assertScoreInRange("Motor", motor, MOTOR_SCORE_RANGE.min, MOTOR_SCORE_RANGE.max)
	assertScoreInRange("Verbal", verbal, VERBAL_SCORE_RANGE.min, VERBAL_SCORE_RANGE.max)
}

/** Usia (bulan) harus angka finite dan >= 0. */
export function assertValidAgeMonths(ageMonths: number): void {
	if (
		typeof ageMonths !== "number" ||
		!Number.isFinite(ageMonths) ||
		ageMonths < 0
	) {
		throw new Error(
			`Usia tidak valid: ${ageMonths}. Harus angka >= 0 bulan.`,
		)
	}
}
