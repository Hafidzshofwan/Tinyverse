/**
 * Konten klinis Fluids — parameter yang dipakai kalkulator cairan (P5/P6).
 * PURE DATA: tanpa import, tanpa logika. Divalidasi oleh fluids.schema.ts saat dimuat.
 *
 * PENTING (fidelitas): seluruh nilai di-port APA ADANYA dari TinyVerse v17 (sumber
 * kebenaran saat ini). Rujukan guideline bersifat informatif dan MASIH MENUNGGU
 * verifikasi klinis sebelum dijadikan sumber otoritatif.
 */
export const fluidsContentRaw = {
	provenance: {
		source: "Ported from TinyVerse v17",
		version: "v17",
		effectiveDate: "2026-07-12",
		reviewedBy: "pending-clinical-review",
		note: "Nilai identik dengan v17. Rujukan informatif: Holliday-Segar (1957) untuk rumatan; WHO IMCI untuk rehidrasi. Verifikasi klinis tertunda.",
	},
	data: {
		maintenance: {
			method: "Holliday-Segar",
			firstTierMaxKg: 10,
			firstTierMlPerKg: 100,
			secondTierMaxKg: 20,
			secondTierBaseMl: 1000,
			secondTierMlPerKg: 50,
			thirdTierBaseMl: 1500,
			thirdTierMlPerKg: 20,
		},
		dripFactors: {
			makro: 20,
			mikro: 60,
		},
		rehydration: {
			planB: { mlPerKg: 75, overHours: 3 },
			planC: {
				bayi: {
					stage1: { mlPerKg: 30, hours: 1 },
					stage2: { mlPerKg: 70, hours: 5 },
				},
				anak: {
					stage1: { mlPerKg: 30, hours: 0.5 },
					stage2: { mlPerKg: 70, hours: 2.5 },
				},
			},
		},
	},
} as const
