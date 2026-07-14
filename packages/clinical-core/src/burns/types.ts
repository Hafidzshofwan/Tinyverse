// Burns (Luka Bakar) bounded context — tipe domain (pure, no React/DOM).
// Port setia dari TinyVerse v17: burnLundBrowderByAge / burnAreaPercent /
// burnHollidaySegar / hitungLukaBakar.

/**
 * Semua region tubuh yang bisa dipilih pada peta luka bakar v17.
 * Nama key SENGAJA identik dengan v17 agar UI/entities dapat memetakan 1:1.
 */
export type BurnArea =
	| "headFront" | "headBack" | "neckFront" | "neckBack"
	| "head" | "neck" | "chest" | "abdomen" | "upperBack" | "lowerBack"
	| "buttockRight" | "buttockLeft" | "perineum"
	| "armRightUpperFront" | "armRightLowerFront" | "handRightFront"
	| "armRightUpperBack" | "armRightLowerBack" | "handRightBack"
	| "armLeftUpperFront" | "armLeftLowerFront" | "handLeftFront"
	| "armLeftUpperBack" | "armLeftLowerBack" | "handLeftBack"
	| "armRightFull" | "armLeftFull"
	| "legRightThighFront" | "legRightLowerFront" | "footRightFront"
	| "legRightThighBack" | "legRightLowerBack" | "footRightBack"
	| "legLeftThighFront" | "legLeftLowerFront" | "footLeftFront"
	| "legLeftThighBack" | "legLeftLowerBack" | "footLeftBack"
	| "legRightFull" | "legLeftFull"
	| "armRightFront" | "armRightBack" | "armLeftFront" | "armLeftBack"
	| "legRightFront" | "legRightBack" | "legLeftFront" | "legLeftBack"

/**
 * Nilai chart Lund-Browder yang bergantung usia.
 * A = 1/2 kepala, B = 1/2 paha, C = 1/2 tungkai bawah (konvensi Lund-Browder).
 */
export interface LundBrowderChart {
	A: number
	B: number
	C: number
	/** Label kelompok usia chart yang aktif, mis. "1 tahun", "Dewasa". */
	label: string
}

/** Kontribusi satu region terhadap total %TBSA. */
export interface BurnAreaContribution {
	area: BurnArea
	label: string
	percent: number
}

/**
 * Hasil lengkap rehidrasi luka bakar (Lund-Browder + Parkland + Holliday-Segar).
 * Semua nilai adalah angka MENTAH (belum dibulatkan untuk tampilan).
 * Pembulatan/format (toFixed) adalah tanggung jawab lapisan UI.
 */
export interface BurnResuscitationResult {
	ageYears: number
	weightKg: number
	chart: LundBrowderChart
	tbsaPercent: number
	contributions: BurnAreaContribution[]
	/** Parkland 24 jam = 4 mL x BB(kg) x %TBSA. */
	parklandMlPer24h: number
	/** Separuh Parkland untuk 8 jam pertama. */
	first8hMl: number
	/** Separuh Parkland untuk 16 jam berikutnya. */
	next16hMl: number
	/** Rumatan Holliday-Segar (mL/hari). */
	maintenanceMlPerDay: number
	/** Parkland 24 jam + rumatan harian. */
	total24hMl: number
	urineTargetMinMlPerHour: number
	urineTargetMaxMlPerHour: number
	urineTargetLabel: string
}
