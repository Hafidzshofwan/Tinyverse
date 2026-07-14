// GCS bounded context — perhitungan skor pGCS.
// Port SETIA dari v17 (darurat-gcs-script > hitung()). Fungsi murni.

import type { GcsInput, GcsResult, GcsLevel } from "./types"
import { assertValidComponentScores } from "./guards"

/**
 * Hitung pGCS dari komponen Eye/Verbal/Motor.
 * - Skor null = komponen belum dipilih → hasil `complete: false`.
 * - `intubated` true → Verbal = "T" (tidak dinilai), total = E + M.
 * Semua teks (scoreText/totalText/category/advice) identik dengan v17.
 */
export function calculateGcs(input: GcsInput): GcsResult {
	const { eye, motor, verbal, intubated } = input
	assertValidComponentScores(eye, motor, verbal)

	const v = intubated ? null : verbal
	const vText = intubated ? "T" : v != null ? String(v) : "\u2013"
	const scoreText =
		`E${eye != null ? eye : "\u2013"} V${vText} M${motor != null ? motor : "\u2013"}`

	const complete = eye != null && motor != null && (intubated || v != null)
	if (!complete) {
		return {
			complete: false,
			scoreText,
			total: null,
			level: null,
			category: null,
			advice: null,
			totalText: null,
			intubated,
		}
	}

	const total = eye + motor + (intubated ? 0 : (v as number))
	let level: GcsLevel
	let category: string
	let advice: string
	let totalText: string

	if (intubated) {
		category = "Verbal terintubasi (T)"
		advice =
			`E+M = ${total} (verbal tidak dapat dinilai). Total GCS penuh tak dapat dihitung; pantau tren E & M.`
		level = total <= 4 ? "kritis" : total <= 8 ? "waspada" : "stabil"
		totalText = `${scoreText} = ${total}T`
	} else {
		if (total >= 13) {
			level = "stabil"
			category = "Cedera ringan"
			advice = "cedera kepala ringan. Observasi & nilai ulang berkala."
		} else if (total >= 9) {
			level = "waspada"
			category = "Cedera sedang"
			advice =
				"cedera sedang. Pantau ketat, siapkan pencitraan & nilai ulang lebih sering."
		} else {
			level = "kritis"
			category = "Cedera berat"
			advice =
				"cedera berat. Pertimbangkan proteksi jalan napas/intubasi (GCS \u22648) & panggil bantuan segera."
		}
		totalText = `${scoreText} = ${total}/15`
	}

	return {
		complete: true,
		total,
		level,
		category,
		advice,
		totalText,
		scoreText,
		intubated,
	}
}
