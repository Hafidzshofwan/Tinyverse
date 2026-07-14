import type { MaintenanceFluidResult } from "./types"
import { assertPositiveWeight } from "./guards"

/**
 * Cairan rumatan (maintenance) metode Holliday–Segar.
 *
 * - 0–10 kg   : 100 mL/kg/hari
 * - 11–20 kg  : 1000 mL + 50 mL/kg untuk tiap kg di atas 10
 * - > 20 kg   : 1500 mL + 20 mL/kg untuk tiap kg di atas 20
 *
 * Pure port dari v17 `hitungKebutuhanCairan`. Hanya menghitung angka;
 * pembulatan tampilan (toFixed) adalah tanggung jawab lapisan UI.
 */
export function maintenanceFluids(weightKg: number): MaintenanceFluidResult {
	assertPositiveWeight(weightKg)

	let totalMlPerDay: number
	if (weightKg <= 10) {
		totalMlPerDay = weightKg * 100
	} else if (weightKg <= 20) {
		totalMlPerDay = 1000 + (weightKg - 10) * 50
	} else {
		totalMlPerDay = 1500 + (weightKg - 20) * 20
	}

	const mlPerHour = totalMlPerDay / 24
	return { weightKg, totalMlPerDay, mlPerHour }
}
