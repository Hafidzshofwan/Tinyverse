// GCS (Skor Kesadaran) bounded context — tipe domain (pure, no React/DOM).
// Port setia dari TinyVerse v17 (darurat-gcs-script): OPSI + hitung().
// pGCS = Pediatric Glasgow Coma Scale. Total 3–15.

/** Tingkat kegawatan hasil GCS (warna kartu di v17). */
export type GcsLevel = "stabil" | "waspada" | "kritis"

/** Kelompok usia untuk komponen Eye & Motor. */
export type EyeMotorAgeGroup = "lt1" | "ge1"

/** Kelompok usia untuk komponen Verbal. */
export type VerbalAgeGroup = "lt2" | "2to5" | "gt5"

/** Satu pilihan skor pada sebuah komponen (skor + deskripsi klinis). */
export interface GcsOption {
	score: number
	label: string
}

/**
 * Input penilaian GCS. Skor null = komponen belum dipilih.
 * `intubated` (tube) = verbal tidak dapat dinilai ("T").
 */
export interface GcsInput {
	eye: number | null
	motor: number | null
	verbal: number | null
	intubated: boolean
}

/**
 * Hasil GCS. Nilai teks (scoreText/totalText/category/advice) di-port setia
 * dari v17 agar tampilan identik. Interpretasi klinis TIDAK dibulatkan/diubah
 * di layer UI.
 */
export interface GcsResult {
	/** true jika Eye, Motor, dan (Verbal ATAU intubasi) sudah terisi. */
	complete: boolean
	/** Ringkasan komponen, mis. "E4 V5 M6" atau "E1 VT M3". */
	scoreText: string
	/** Total skor; null bila belum lengkap. Saat intubasi = E+M saja. */
	total: number | null
	level: GcsLevel | null
	/** Kategori cedera, mis. "Cedera ringan" / "Verbal terintubasi (T)". */
	category: string | null
	/** Saran tindak lanjut (teks v17). */
	advice: string | null
	/** Teks total lengkap, mis. "E4 V5 M6 = 15/15" atau "E1 VT M3 = 4T". */
	totalText: string | null
	intubated: boolean
}
