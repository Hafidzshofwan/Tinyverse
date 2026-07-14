// Burns bounded context — chart Lund-Browder + persentase & label region.
// Port SETIA (nilai identik) dari v17: burnLundBrowderByAge / burnAreaPercent / burnAreaLabel.

import type { BurnArea, LundBrowderChart } from "./types"

/** Semua region peta luka bakar v17 (urutan sama seperti map v17). */
export const BURN_AREAS: readonly BurnArea[] = [
	"headFront", "headBack", "neckFront", "neckBack",
	"head", "neck", "chest", "abdomen", "upperBack", "lowerBack",
	"buttockRight", "buttockLeft", "perineum",
	"armRightUpperFront", "armRightLowerFront", "handRightFront",
	"armRightUpperBack", "armRightLowerBack", "handRightBack",
	"armLeftUpperFront", "armLeftLowerFront", "handLeftFront",
	"armLeftUpperBack", "armLeftLowerBack", "handLeftBack",
	"armRightFull", "armLeftFull",
	"legRightThighFront", "legRightLowerFront", "footRightFront",
	"legRightThighBack", "legRightLowerBack", "footRightBack",
	"legLeftThighFront", "legLeftLowerFront", "footLeftFront",
	"legLeftThighBack", "legLeftLowerBack", "footLeftBack",
	"legRightFull", "legLeftFull",
	"armRightFront", "armRightBack", "armLeftFront", "armLeftBack",
	"legRightFront", "legRightBack", "legLeftFront", "legLeftBack",
]

/**
 * Pilih baris chart Lund-Browder berdasar usia (tahun).
 * Catatan v17: bila usia NaN, chart default ke kelompok "1 tahun".
 * Perilaku ini SENGAJA dipertahankan agar identik dengan v17.
 */
export function lundBrowderByAge(ageYears: number): LundBrowderChart {
	if (!Number.isFinite(ageYears)) return { A: 8.5, B: 3.25, C: 2.5, label: "1 tahun" }
	if (ageYears < 1) return { A: 9.5, B: 2.75, C: 2.5, label: "0 tahun" }
	if (ageYears < 5) return { A: 8.5, B: 3.25, C: 2.5, label: "1 tahun" }
	if (ageYears < 10) return { A: 6.5, B: 4, C: 2.75, label: "5 tahun" }
	if (ageYears < 15) return { A: 5.5, B: 4.25, C: 3, label: "10 tahun" }
	if (ageYears < 18) return { A: 4.5, B: 4.5, C: 3.25, label: "15 tahun" }
	return { A: 3.5, B: 4.75, C: 3.5, label: "Dewasa" }
}

/**
 * Persentase %TBSA satu region pada usia tertentu.
 * Region yang tidak dikenal menghasilkan 0 (identik dengan `map[area] || 0` di v17).
 */
export function burnAreaPercent(area: BurnArea, ageYears: number): number {
	const age = lundBrowderByAge(ageYears)
	const map: Record<BurnArea, number> = {
		headFront: age.A, headBack: age.A, neckFront: 1, neckBack: 1,
		head: age.A * 2, neck: 2, chest: 6.5, abdomen: 6.5, upperBack: 6.5, lowerBack: 6.5,
		buttockRight: 2.5, buttockLeft: 2.5, perineum: 1,
		armRightUpperFront: 2, armRightLowerFront: 1.5, handRightFront: 1.25,
		armRightUpperBack: 2, armRightLowerBack: 1.5, handRightBack: 1.25,
		armLeftUpperFront: 2, armLeftLowerFront: 1.5, handLeftFront: 1.25,
		armLeftUpperBack: 2, armLeftLowerBack: 1.5, handLeftBack: 1.25,
		armRightFull: 9.5, armLeftFull: 9.5,
		legRightThighFront: age.B, legRightLowerFront: age.C, footRightFront: 1.75,
		legRightThighBack: age.B, legRightLowerBack: age.C, footRightBack: 1.75,
		legLeftThighFront: age.B, legLeftLowerFront: age.C, footLeftFront: 1.75,
		legLeftThighBack: age.B, legLeftLowerBack: age.C, footLeftBack: 1.75,
		legRightFull: (age.B + age.C + 1.75) * 2, legLeftFull: (age.B + age.C + 1.75) * 2,
		armRightFront: 4.75, armRightBack: 4.75, armLeftFront: 4.75, armLeftBack: 4.75,
		legRightFront: age.B + age.C + 1.75, legRightBack: age.B + age.C + 1.75,
		legLeftFront: age.B + age.C + 1.75, legLeftBack: age.B + age.C + 1.75,
	}
	return map[area] ?? 0
}

/** Label manusiawi (Bahasa Indonesia) untuk sebuah region. Identik dengan v17. */
export function burnAreaLabel(area: BurnArea): string {
	const labels: Record<BurnArea, string> = {
		headFront: "Kepala depan", headBack: "Kepala belakang",
		neckFront: "Leher depan", neckBack: "Leher belakang",
		head: "Kepala depan + belakang", neck: "Leher depan + belakang",
		chest: "Dada anterior", abdomen: "Abdomen anterior",
		upperBack: "Punggung atas posterior", lowerBack: "Punggung bawah posterior",
		buttockRight: "Bokong kanan", buttockLeft: "Bokong kiri", perineum: "Perineum/genital",
		armRightUpperFront: "Lengan atas kanan anterior", armRightLowerFront: "Lengan bawah kanan anterior",
		handRightFront: "Telapak tangan kanan anterior", armRightUpperBack: "Lengan atas kanan posterior",
		armRightLowerBack: "Lengan bawah kanan posterior", handRightBack: "Punggung tangan kanan posterior",
		armLeftUpperFront: "Lengan atas kiri anterior", armLeftLowerFront: "Lengan bawah kiri anterior",
		handLeftFront: "Telapak tangan kiri anterior", armLeftUpperBack: "Lengan atas kiri posterior",
		armLeftLowerBack: "Lengan bawah kiri posterior", handLeftBack: "Punggung tangan kiri posterior",
		armRightFull: "Seluruh lengan kanan", armLeftFull: "Seluruh lengan kiri",
		legRightFull: "Seluruh tungkai kanan", legLeftFull: "Seluruh tungkai kiri",
		legRightThighFront: "Paha kanan anterior", legRightLowerFront: "Tungkai bawah kanan anterior",
		footRightFront: "Kaki kanan anterior", legRightThighBack: "Paha kanan posterior",
		legRightLowerBack: "Tungkai bawah kanan posterior", footRightBack: "Kaki kanan posterior",
		legLeftThighFront: "Paha kiri anterior", legLeftLowerFront: "Tungkai bawah kiri anterior",
		footLeftFront: "Kaki kiri anterior", legLeftThighBack: "Paha kiri posterior",
		legLeftLowerBack: "Tungkai bawah kiri posterior", footLeftBack: "Kaki kiri posterior",
		armRightFront: "Lengan kanan anterior", armRightBack: "Lengan kanan posterior",
		armLeftFront: "Lengan kiri anterior", armLeftBack: "Lengan kiri posterior",
		legRightFront: "Tungkai kanan anterior", legRightBack: "Tungkai kanan posterior",
		legLeftFront: "Tungkai kiri anterior", legLeftBack: "Tungkai kiri posterior",
	}
	return labels[area] ?? area
}
