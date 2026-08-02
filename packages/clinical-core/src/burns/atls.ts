// Burns bounded context — resusitasi cairan kerangka ATLS (edisi 10).
//
// WHY berkas terpisah: parkland.ts adalah port setia v17 dan dikunci oleh
// golden fixture (burns.golden.ts + v17-burn-reference.json). Mengubah
// parklandVolumeMl akan membuat uji golden merah dan memaksa penyuntingan
// fixture beku. Karena itu kerangka ATLS ditulis sebagai modul BARU yang
// berdampingan; Parkland tetap utuh sebagai pembanding historis.
//
// Perbedaan inti terhadap Parkland: faktor mL/kg/%TBSA tidak lagi tunggal,
// melainkan bergantung usia dan mekanisme cedera. Semua fungsi PURE.


import { assertPositiveWeight } from "./guards"

/** Mekanisme cedera yang mengubah faktor cairan. */
export type BurnMechanism = "termal" | "listrik"

/** Batas usia dewasa/remaja pada kerangka ATLS. */
export const ATLS_ADULT_AGE_YEARS = 14
/** Faktor anak < 14 tahun (mL/kg/%TBSA). */
export const ATLS_FACTOR_CHILD = 3
/** Faktor remaja & dewasa >= 14 tahun (mL/kg/%TBSA). */
export const ATLS_FACTOR_ADULT = 2
/** Faktor cedera listrik, segala usia (mL/kg/%TBSA). */
export const ATLS_FACTOR_ELECTRICAL = 4
/** Berat maksimum yang masih mendapat rumatan dekstrosa terpisah. */
export const ATLS_MAINTENANCE_MAX_WEIGHT_KG = 30
/** Pagar merah fluid creep (mL/kg/%TBSA dalam 24 jam). */
export const ATLS_FLUID_CREEP_ML_PER_KG_PER_TBSA = 6
/** Lama fase pertama sejak JAM NOL (waktu kejadian), bukan sejak tiba. */
export const ATLS_FIRST_PHASE_HOURS = 8
/** Lama fase kedua. */
export const ATLS_SECOND_PHASE_HOURS = 16

export interface AtlsFactor {
	mlPerKgPerTbsa: number
	reason: string
}

/**
 * Faktor cairan ATLS. Listrik menang atas usia karena rabdomiolisis menuntut
 * volume lebih besar berapa pun umurnya.
 */
export function atlsFactor(ageYears: number, mechanism: BurnMechanism = "termal"): AtlsFactor {
	if (mechanism === "listrik") {
		return { mlPerKgPerTbsa: ATLS_FACTOR_ELECTRICAL, reason: "Cedera listrik (segala usia)" }
	}
	if (!Number.isFinite(ageYears) || ageYears < 0) {
		throw new Error(`Usia tidak valid: ${ageYears}. Harus angka >= 0.`)
	}
	if (ageYears < ATLS_ADULT_AGE_YEARS) {
		return { mlPerKgPerTbsa: ATLS_FACTOR_CHILD, reason: "Anak < 14 tahun" }
	}
	return { mlPerKgPerTbsa: ATLS_FACTOR_ADULT, reason: "Remaja/dewasa >= 14 tahun" }
}

/**
 * Rumatan 4-2-1 (mL/jam). Sengaja versi PER JAM, bukan Holliday-Segar harian:
 * protokol luka bakar memberi rumatan sebagai jalur infus terpisah yang
 * TIDAK dititrasi, sehingga yang dibutuhkan klinisi adalah laju per jam.
 */
export function maintenance421MlPerHour(weightKg: number): number {
	assertPositiveWeight(weightKg)
	if (weightKg <= 10) return weightKg * 4
	if (weightKg <= 20) return 40 + (weightKg - 10) * 2
	return 60 + (weightKg - 20) * 1
}

export interface AtlsUrineTarget {
	minMlPerHour: number
	maxMlPerHour: number
	label: string
}

/**
 * Target keluaran urin versi ATLS.
 * - Mioglobinuria/cedera listrik: 1-2 mL/kg/jam berapa pun beratnya.
 * - <= 30 kg: 1 mL/kg/jam.
 * - > 30 kg: 0,5 mL/kg/jam (setara 30-50 mL/jam pada dewasa).
 */
export function atlsUrineTarget(weightKg: number, mechanism: BurnMechanism = "termal"): AtlsUrineTarget {
	assertPositiveWeight(weightKg)
	if (mechanism === "listrik") {
		return { minMlPerHour: weightKg * 1, maxMlPerHour: weightKg * 2, label: "1\u20132 mL/kg/jam (mioglobinuria)" }
	}
	if (weightKg <= ATLS_MAINTENANCE_MAX_WEIGHT_KG) {
		return { minMlPerHour: weightKg * 1, maxMlPerHour: weightKg * 1, label: "1 mL/kg/jam" }
	}
	return { minMlPerHour: weightKg * 0.5, maxMlPerHour: weightKg * 0.5, label: "0,5 mL/kg/jam" }
}

export interface AtlsResuscitationInput {
	weightKg: number
	tbsaPercent: number
	ageYears: number
	mechanism?: BurnMechanism
	/** Jam berlalu sejak KEJADIAN (jam nol), bukan sejak tiba. Default 0. */
	hoursSinceInjury?: number
	/** Cairan yang sudah masuk sebelum tiba (mL). Default 0. */
	preHospitalMl?: number
}

export interface AtlsResuscitationResult {
	factorMlPerKgPerTbsa: number
	factorReason: string
	mechanism: BurnMechanism
	totalMlPer24h: number
	firstPhaseMl: number
	secondPhaseMl: number
	hoursSinceInjury: number
	/** Sisa jam fase pertama setelah dikurangi keterlambatan. */
	remainingFirstPhaseHours: number
	/** True bila pasien tiba setelah jam ke-8; jatah fase 1 sudah terlambat. */
	firstPhaseElapsed: boolean
	preHospitalMl: number
	firstPhaseRemainingMl: number
	firstPhaseRateMlPerHour: number
	secondPhaseRateMlPerHour: number
	maintenanceApplies: boolean
	maintenanceMlPerHour: number
	urineTargetMinMlPerHour: number
	urineTargetMaxMlPerHour: number
	urineTargetLabel: string
	/** Laju yang bila terlampaui menandakan resusitasi sulit / fluid creep. */
	fluidCreepRateMlPerHour: number
	exceedsFluidCreep: boolean
}

/**
 * Resusitasi cairan luka bakar kerangka ATLS.
 *
 * total 24 jam = faktor x BB x %TBSA (Ringer Laktat)
 * separuh dalam 8 jam pertama SEJAK KEJADIAN, separuh dalam 16 jam berikutnya.
 *
 * Bila pasien datang terlambat, jatah fase pertama dibagi SISA jam, bukan 8
 * jam penuh — inilah koreksi jam nol yang sering terlewat di bangsal.
 */
export function calculateAtlsBurnResuscitation(input: AtlsResuscitationInput): AtlsResuscitationResult {
	const { weightKg, tbsaPercent, ageYears } = input
	const mechanism: BurnMechanism = input.mechanism ?? "termal"
	const hoursSinceInjury = input.hoursSinceInjury ?? 0
	const preHospitalMl = input.preHospitalMl ?? 0

	assertPositiveWeight(weightKg)
	if (!Number.isFinite(tbsaPercent) || tbsaPercent < 0 || tbsaPercent > 100) {
		throw new Error(`%TBSA tidak valid: ${tbsaPercent}. Harus angka 0-100.`)
	}
	if (!Number.isFinite(hoursSinceInjury) || hoursSinceInjury < 0) {
		throw new Error(`Jam sejak kejadian tidak valid: ${hoursSinceInjury}. Harus angka >= 0.`)
	}
	if (!Number.isFinite(preHospitalMl) || preHospitalMl < 0) {
		throw new Error(`Cairan pra-rumah sakit tidak valid: ${preHospitalMl}. Harus angka >= 0.`)
	}

	const faktor = atlsFactor(ageYears, mechanism)
	const totalMlPer24h = faktor.mlPerKgPerTbsa * weightKg * tbsaPercent
	const firstPhaseMl = totalMlPer24h / 2
	const secondPhaseMl = totalMlPer24h / 2

	const firstPhaseElapsed = hoursSinceInjury >= ATLS_FIRST_PHASE_HOURS
	const remainingFirstPhaseHours = firstPhaseElapsed ? 0 : ATLS_FIRST_PHASE_HOURS - hoursSinceInjury
	const firstPhaseRemainingMl = Math.max(firstPhaseMl - preHospitalMl, 0)
	// Bila fase 1 sudah lewat, sisa volume dikejar dalam 1 jam sebagai angka
	// pengingat; keputusan akhir tetap di tangan klinisi.
	const pembagi = remainingFirstPhaseHours > 0 ? remainingFirstPhaseHours : 1
	const firstPhaseRateMlPerHour = firstPhaseRemainingMl / pembagi
	const secondPhaseRateMlPerHour = secondPhaseMl / ATLS_SECOND_PHASE_HOURS

	const maintenanceApplies = weightKg <= ATLS_MAINTENANCE_MAX_WEIGHT_KG
	const maintenanceMlPerHour = maintenanceApplies ? maintenance421MlPerHour(weightKg) : 0

	const urine = atlsUrineTarget(weightKg, mechanism)
	const fluidCreepRateMlPerHour =
		(ATLS_FLUID_CREEP_ML_PER_KG_PER_TBSA * weightKg * tbsaPercent) / 24

	return {
		factorMlPerKgPerTbsa: faktor.mlPerKgPerTbsa,
		factorReason: faktor.reason,
		mechanism,
		totalMlPer24h,
		firstPhaseMl,
		secondPhaseMl,
		hoursSinceInjury,
		remainingFirstPhaseHours,
		firstPhaseElapsed,
		preHospitalMl,
		firstPhaseRemainingMl,
		firstPhaseRateMlPerHour,
		secondPhaseRateMlPerHour,
		maintenanceApplies,
		maintenanceMlPerHour,
		urineTargetMinMlPerHour: urine.minMlPerHour,
		urineTargetMaxMlPerHour: urine.maxMlPerHour,
		urineTargetLabel: urine.label,
		fluidCreepRateMlPerHour,
		exceedsFluidCreep: firstPhaseRateMlPerHour > fluidCreepRateMlPerHour,
	}
}
