/**
 * Konversi satuan dasar (shared-kernel).
 * Semua fungsi PURE. Basis internal: massa->mg, volume->mL, waktu->menit.
 */

export type MassUnit = "mcg" | "mg" | "g" | "kg"
export type VolumeUnit = "mL" | "L"
export type TimeUnit = "min" | "h" | "day"

const MASS_TO_MG: Record<MassUnit, number> = {
	mcg: 0.001,
	mg: 1,
	g: 1000,
	kg: 1_000_000,
}

const VOLUME_TO_ML: Record<VolumeUnit, number> = {
	mL: 1,
	L: 1000,
}

const TIME_TO_MIN: Record<TimeUnit, number> = {
	min: 1,
	h: 60,
	day: 1440,
}

export function convertMass(value: number, from: MassUnit, to: MassUnit): number {
	return (value * MASS_TO_MG[from]) / MASS_TO_MG[to]
}

export function convertVolume(
	value: number,
	from: VolumeUnit,
	to: VolumeUnit,
): number {
	return (value * VOLUME_TO_ML[from]) / VOLUME_TO_ML[to]
}

export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
	return (value * TIME_TO_MIN[from]) / TIME_TO_MIN[to]
}
