// Burns bounded context — orchestrator rehidrasi luka bakar (pure).
// Menggabungkan Lund-Browder (%TBSA) + Parkland + Holliday-Segar + target urin.
// Port setia dari v17 hitungLukaBakar (tanpa DOM & tanpa pembulatan tampilan).

import type { BurnArea, BurnResuscitationResult } from "./types"
import { assertValidAgeYears, assertPositiveWeight } from "./guards"
import { lundBrowderByAge, burnAreaPercent, burnAreaLabel } from "./lund-browder"
import {
	parklandVolumeMl,
	maintenanceHollidaySegarMlPerDay,
	urineOutputTarget,
} from "./parkland"

/**
 * Hitung total %TBSA dari sekumpulan region terpilih pada usia tertentu.
 * Region duplikat dihilangkan (mengikuti perilaku Set di v17: burnAreaState).
 */
export function totalTbsaPercent(areas: Iterable<BurnArea>, ageYears: number): number {
	const unique = new Set(areas)
	let tbsa = 0
	for (const area of unique) tbsa += burnAreaPercent(area, ageYears)
	return tbsa
}

/**
 * Rehidrasi luka bakar lengkap.
 *
 * @param areas    region terpilih (duplikat diabaikan)
 * @param ageYears usia dalam tahun (bayi < 1 th mis. 0.5)
 * @param weightKg berat badan (kg)
 *
 * Melempar error bila usia/berat tidak valid (v17 hanya menampilkan peringatan,
 * tetapi di core kita menolak input tak valid — lapisan UI yang menerjemahkannya).
 * %TBSA = 0 (belum ada region) tetap valid dan menghasilkan Parkland 0 mL,
 * identik dengan perilaku v17.
 */
export function calculateBurnResuscitation(
	areas: Iterable<BurnArea>,
	ageYears: number,
	weightKg: number,
): BurnResuscitationResult {
	assertValidAgeYears(ageYears)
	assertPositiveWeight(weightKg)

	const chart = lundBrowderByAge(ageYears)
	const unique = [...new Set(areas)]
	const contributions = unique.map((area) => ({
		area,
		label: burnAreaLabel(area),
		percent: burnAreaPercent(area, ageYears),
	}))
	const tbsaPercent = contributions.reduce((sum, c) => sum + c.percent, 0)

	const parklandMlPer24h = parklandVolumeMl(weightKg, tbsaPercent)
	const maintenanceMlPerDay = maintenanceHollidaySegarMlPerDay(weightKg)
	const urine = urineOutputTarget(weightKg)

	return {
		ageYears,
		weightKg,
		chart,
		tbsaPercent,
		contributions,
		parklandMlPer24h,
		first8hMl: parklandMlPer24h / 2,
		next16hMl: parklandMlPer24h / 2,
		maintenanceMlPerDay,
		total24hMl: parklandMlPer24h + maintenanceMlPerDay,
		urineTargetMinMlPerHour: urine.minMlPerHour,
		urineTargetMaxMlPerHour: urine.maxMlPerHour,
		urineTargetLabel: urine.label,
	}
}
