import type { DripRateResult, DripType } from "./types"
import { assertPositive } from "./guards"

/** Faktor tetes per jenis drip set (tetes per mL). */
export const DROP_FACTOR: Record<DripType, number> = { makro: 20, mikro: 60 }

/**
 * Laju tetesan infus (faktor tetes).
 *
 * tetes/menit = (volume mL × faktor tetes) / (lama jam × 60)
 *
 * Pure port dari v17 `hitungFaktorTetes`. `gttPerMin` memakai Math.round
 * (sama seperti v17); `gttPerMinRaw` menyimpan nilai sebelum pembulatan.
 */
export function dripRate(volumeMl: number, hours: number, dripType: DripType = "makro"): DripRateResult {
	assertPositive(volumeMl, "Volume cairan (mL)")
	assertPositive(hours, "Lama pemberian (jam)")

	const dropFactor = DROP_FACTOR[dripType]
	if (dropFactor === undefined) {
		throw new Error(`Jenis drip tidak valid: ${dripType}. Gunakan "makro" atau "mikro".`)
	}

	const minutes = hours * 60
	const mlPerHour = volumeMl / hours
	const gttPerMinRaw = (volumeMl * dropFactor) / minutes
	const gttPerMin = Math.round(gttPerMinRaw)

	return { volumeMl, hours, dripType, dropFactor, gttPerMin, gttPerMinRaw, mlPerHour }
}
