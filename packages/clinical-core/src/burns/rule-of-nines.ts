// Rule of Nines (Wallace) dengan modifikasi pediatri.
//
// WHY berkas terpisah: Lund & Browder tetap rujukan utama di alat ini dan
// tidak boleh berubah sedikit pun. Rule of Nines disediakan sebagai metode
// cepat yang berdiri sendiri, sehingga tidak ada satu baris pun milik
// lund-browder.ts atau parkland.ts yang perlu disentuh.
//
// Aturan pediatri: bayi kepala 18% dan tiap tungkai 13,5%. Setiap tahun usia
// kepala berkurang 1% dan dialihkan ke kedua tungkai (0,5% per tungkai),
// sampai menyamai angka dewasa pada usia 9 tahun. Total selalu 100%.

export type RuleOfNinesArea =
	| "headFront"
	| "headBack"
	| "chest"
	| "abdomen"
	| "upperBack"
	| "lowerBack"
	| "armRightFront"
	| "armRightBack"
	| "armLeftFront"
	| "armLeftBack"
	| "legRightFront"
	| "legRightBack"
	| "legLeftFront"
	| "legLeftBack"
	| "perineum"

export const RULE9_AREAS: ReadonlyArray<RuleOfNinesArea> = [
	"headFront",
	"headBack",
	"chest",
	"abdomen",
	"upperBack",
	"lowerBack",
	"armRightFront",
	"armRightBack",
	"armLeftFront",
	"armLeftBack",
	"legRightFront",
	"legRightBack",
	"legLeftFront",
	"legLeftBack",
	"perineum",
]

export const RULE9_ADULT_AGE_YEARS = 9
export const RULE9_INFANT_HEAD_PERCENT = 18
export const RULE9_INFANT_LEG_PERCENT = 13.5

export type RuleOfNinesChart = {
	headPercent: number
	legPercent: number
	label: string
}

/**
 * Bagan Rule of Nines sesuai usia.
 * Usia tidak valid diperlakukan sebagai 1 tahun, sama seperti perilaku
 * lundBrowderByAge, supaya kedua metode tidak berbeda sikap saat data kosong.
 */
export function ruleOfNinesByAge(ageYears: number): RuleOfNinesChart {
	const aman = Number.isFinite(ageYears) ? ageYears : 1
	const tahun = Math.min(Math.max(Math.floor(aman), 0), RULE9_ADULT_AGE_YEARS)
	const headPercent = RULE9_INFANT_HEAD_PERCENT - tahun
	const legPercent = RULE9_INFANT_LEG_PERCENT + tahun * 0.5
	const label =
		tahun === 0
			? "Bayi (0 tahun)"
			: tahun >= RULE9_ADULT_AGE_YEARS
				? "Dewasa (>= 9 tahun)"
				: `${tahun} tahun`
	return { headPercent, legPercent, label }
}

export function ruleOfNinesAreaPercent(
	area: RuleOfNinesArea,
	ageYears: number,
): number {
	const chart = ruleOfNinesByAge(ageYears)
	const kepala = chart.headPercent / 2
	const tungkai = chart.legPercent / 2
	const peta: Record<RuleOfNinesArea, number> = {
		headFront: kepala,
		headBack: kepala,
		chest: 9,
		abdomen: 9,
		upperBack: 9,
		lowerBack: 9,
		armRightFront: 4.5,
		armRightBack: 4.5,
		armLeftFront: 4.5,
		armLeftBack: 4.5,
		legRightFront: tungkai,
		legRightBack: tungkai,
		legLeftFront: tungkai,
		legLeftBack: tungkai,
		perineum: 1,
	}
	return peta[area]
}

export function ruleOfNinesAreaLabel(area: RuleOfNinesArea): string {
	const peta: Record<RuleOfNinesArea, string> = {
		headFront: "Kepala & leher depan",
		headBack: "Kepala & leher belakang",
		chest: "Dada",
		abdomen: "Perut",
		upperBack: "Punggung atas",
		lowerBack: "Punggung bawah",
		armRightFront: "Lengan kanan depan",
		armRightBack: "Lengan kanan belakang",
		armLeftFront: "Lengan kiri depan",
		armLeftBack: "Lengan kiri belakang",
		legRightFront: "Tungkai kanan depan",
		legRightBack: "Tungkai kanan belakang",
		legLeftFront: "Tungkai kiri depan",
		legLeftBack: "Tungkai kiri belakang",
		perineum: "Perineum",
	}
	return peta[area]
}

export type RuleOfNinesContribution = {
	area: RuleOfNinesArea
	label: string
	percent: number
}

export type RuleOfNinesResult = {
	chart: RuleOfNinesChart
	tbsaPercent: number
	contributions: ReadonlyArray<RuleOfNinesContribution>
}

/** Menjumlahkan %TBSA dari daftar regio terpilih. Duplikat diabaikan. */
export function ruleOfNinesTbsa(
	areas: ReadonlyArray<RuleOfNinesArea>,
	ageYears: number,
): RuleOfNinesResult {
	const chart = ruleOfNinesByAge(ageYears)
	const unik = Array.from(new Set(areas))
	const contributions = unik.map((area) => ({
		area,
		label: ruleOfNinesAreaLabel(area),
		percent: ruleOfNinesAreaPercent(area, ageYears),
	}))
	const total = contributions.reduce((acc, c) => acc + c.percent, 0)
	return {
		chart,
		tbsaPercent: Math.round(total * 100) / 100,
		contributions,
	}
}
