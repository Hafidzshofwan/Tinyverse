// Burns bounded context — rumus cairan (Parkland, rumatan Holliday-Segar, target urin).
// Semua PURE. Port setia dari v17 (hitungLukaBakar + burnHollidaySegar).

import { assertPositiveWeight } from "./guards"

/** Ambang berat: < 30 kg pakai target urin 1-2 mL/kg/jam; >= 30 kg pakai 0,5-1. */
export const URINE_WEIGHT_THRESHOLD_KG = 30

/**
 * Volume Parkland 24 jam = 4 mL x BB(kg) x %TBSA.
 * Cairan pilihan: Ringer Laktat (RL) hangat (informasi ditampilkan di UI).
 */
export function parklandVolumeMl(weightKg: number, tbsaPercent: number): number {
	assertPositiveWeight(weightKg)
	if (!Number.isFinite(tbsaPercent) || tbsaPercent < 0) {
		throw new Error(`%TBSA tidak valid: ${tbsaPercent}. Harus angka >= 0.`)
	}
	return 4 * weightKg * tbsaPercent
}

/**
 * Rumatan harian Holliday-Segar (mL/hari) — SAMA dengan fluids.maintenanceFluids.
 * Disalin di sini agar bounded context Burns tetap mandiri (tanpa coupling ke Fluids).
 * Ada uji anti-drift (burns.test.ts) yang memastikan nilainya identik dengan Fluids.
 */
export function maintenanceHollidaySegarMlPerDay(weightKg: number): number {
	assertPositiveWeight(weightKg)
	if (weightKg <= 10) return weightKg * 100
	if (weightKg <= 20) return 1000 + (weightKg - 10) * 50
	return 1500 + (weightKg - 20) * 20
}

export interface UrineTarget {
	minMlPerHour: number
	maxMlPerHour: number
	label: string
}

/** Target produksi urin per jam berdasar berat badan (identik v17). */
export function urineOutputTarget(weightKg: number): UrineTarget {
	assertPositiveWeight(weightKg)
	const underThreshold = weightKg < URINE_WEIGHT_THRESHOLD_KG
	return {
		minMlPerHour: underThreshold ? weightKg * 1 : weightKg * 0.5,
		maxMlPerHour: underThreshold ? weightKg * 2 : weightKg * 1,
		label: underThreshold ? "1\u20132 mL/kg/jam" : "0,5\u20131 mL/kg/jam",
	}
}
