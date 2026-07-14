import type {
	PlanCAgeCategory,
	RehydrationPlanBResult,
	RehydrationPlanCResult,
	RehydrationStage,
} from "./types"
import { assertPositiveWeight } from "./guards"

/**
 * Rehidrasi Rencana B (WHO/IDAI) — dehidrasi ringan–sedang.
 * 75 mL/kg diberikan merata dalam 3 jam.
 * Pure port dari v17 `hitungRencanaB`.
 */
export function rehydrationPlanB(weightKg: number): RehydrationPlanBResult {
	assertPositiveWeight(weightKg)
	const overHours = 3
	const totalMl = weightKg * 75
	const mlPerHour = totalMl / overHours
	return { weightKg, totalMl, mlPerHour, overHours }
}

interface PlanCTiming {
	stage1Hours: number
	stage2Hours: number
	totalHours: number
}

const PLAN_C_TIMING: Record<PlanCAgeCategory, PlanCTiming> = {
	bayi: { stage1Hours: 1, stage2Hours: 5, totalHours: 6 },
	anak: { stage1Hours: 0.5, stage2Hours: 2.5, totalHours: 3 },
}

/**
 * Rehidrasi Rencana C (WHO/IDAI) — dehidrasi berat.
 * Tahap 1: 30 mL/kg, Tahap 2: 70 mL/kg (total 100 mL/kg).
 * Durasi tergantung kategori usia (bayi < 1 th vs anak ≥ 1 th).
 * Pure port dari v17 `hitungRencanaC`.
 */
export function rehydrationPlanC(weightKg: number, ageCategory: PlanCAgeCategory): RehydrationPlanCResult {
	assertPositiveWeight(weightKg)
	const timing = PLAN_C_TIMING[ageCategory]
	if (!timing) {
		throw new Error(`Kategori usia tidak valid: ${ageCategory}. Gunakan "bayi" atau "anak".`)
	}

	const stage1: RehydrationStage = {
		mlPerKg: 30,
		volumeMl: weightKg * 30,
		hours: timing.stage1Hours,
		mlPerHour: (weightKg * 30) / timing.stage1Hours,
	}
	const stage2: RehydrationStage = {
		mlPerKg: 70,
		volumeMl: weightKg * 70,
		hours: timing.stage2Hours,
		mlPerHour: (weightKg * 70) / timing.stage2Hours,
	}
	const totalMl = weightKg * 100

	return { weightKg, ageCategory, totalMl, stage1, stage2, totalHours: timing.totalHours }
}
