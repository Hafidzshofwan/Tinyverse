// Fluids bounded context — tipe domain (pure, no React/DOM).

export type DripType = "bloodSet" | "makro" | "mikro"
export type PlanCAgeCategory = "bayi" | "anak"

/** Satu pilihan drip set siap tampil (id domain, nama, dan faktor tetesnya). */
export interface DripOption {
	id: DripType
	label: string
	dropFactor: number
}

export interface MaintenanceFluidResult {
	weightKg: number
	totalMlPerDay: number
	mlPerHour: number
}

export interface DripRateResult {
	volumeMl: number
	hours: number
	dripType: DripType
	dropFactor: number
	gttPerMin: number
	gttPerMinRaw: number
	mlPerHour: number
}

export interface RehydrationPlanBResult {
	weightKg: number
	totalMl: number
	mlPerHour: number
	overHours: number
}

export interface RehydrationStage {
	mlPerKg: number
	volumeMl: number
	hours: number
	mlPerHour: number
}

export interface RehydrationPlanCResult {
	weightKg: number
	ageCategory: PlanCAgeCategory
	totalMl: number
	stage1: RehydrationStage
	stage2: RehydrationStage
	totalHours: number
}
