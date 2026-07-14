import {
	dripRate,
	maintenanceFluids,
	rehydrationPlanB,
	rehydrationPlanC,
	type DripType,
	type PlanCAgeCategory,
} from "@tinyverse/clinical-core"
import type { FluidView } from "../model/types"

// Re-export tipe domain agar layer di atas (features) tidak mengimpor langsung dari package.
export type { DripType, PlanCAgeCategory }

/**
 * Adapter entity Fluid: memanggil pure functions clinical-core (P5) dan
 * memformat hasilnya untuk tampilan. Pembulatan tampilan (toFixed) HIDUP di sini
 * (lapisan UI), sesuai keputusan arsitektur P5 — domain tetap mengembalikan angka eksak.
 */
export function viewMaintenance(weightKg: number): FluidView {
	const r = maintenanceFluids(weightKg)
	return {
		rows: [
			{ label: "Kebutuhan per hari", value: `${r.totalMlPerDay.toFixed(0)} mL/hari` },
			{ label: "Setara per jam", value: `≈ ${r.mlPerHour.toFixed(1)} mL/jam` },
		],
	}
}

export function viewDrip(volumeMl: number, hours: number, dripType: DripType): FluidView {
	const r = dripRate(volumeMl, hours, dripType)
	return {
		rows: [
			{ label: "Laju tetesan", value: `${r.gttPerMin} tetes/menit` },
			{ label: "Nilai presisi", value: `${r.gttPerMinRaw.toFixed(1)} tetes/menit` },
			{ label: "Setara laju", value: `≈ ${r.mlPerHour.toFixed(1)} mL/jam` },
			{ label: "Faktor tetes", value: `${r.dropFactor} gtt/mL` },
		],
	}
}

export function viewPlanB(weightKg: number): FluidView {
	const r = rehydrationPlanB(weightKg)
	return {
		rows: [
			{ label: "Total cairan", value: `${r.totalMl.toFixed(0)} mL` },
			{ label: "Laju", value: `≈ ${r.mlPerHour.toFixed(1)} mL/jam` },
			{ label: "Durasi", value: `${r.overHours} jam` },
		],
	}
}

export function viewPlanC(weightKg: number, ageCategory: PlanCAgeCategory): FluidView {
	const r = rehydrationPlanC(weightKg, ageCategory)
	return {
		rows: [
			{ label: "Total cairan", value: `${r.totalMl.toFixed(0)} mL` },
			{
				label: `Tahap 1 (${r.stage1.mlPerKg} mL/kg)`,
				value: `${r.stage1.volumeMl.toFixed(0)} mL / ${r.stage1.hours} jam (≈ ${r.stage1.mlPerHour.toFixed(1)} mL/jam)`,
			},
			{
				label: `Tahap 2 (${r.stage2.mlPerKg} mL/kg)`,
				value: `${r.stage2.volumeMl.toFixed(0)} mL / ${r.stage2.hours} jam (≈ ${r.stage2.mlPerHour.toFixed(1)} mL/jam)`,
			},
			{ label: "Total waktu", value: `${r.totalHours} jam` },
		],
	}
}
