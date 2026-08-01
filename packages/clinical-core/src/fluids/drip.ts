import type { DripOption, DripRateResult, DripType } from "./types"
import { assertPositive } from "./guards"

/** Faktor tetes per jenis drip set (tetes per mL). */
export const DROP_FACTOR: Record<DripType, number> = { bloodSet: 15, makro: 20, mikro: 60 }

/** Nama tampilan per jenis drip set. Satu-satunya sumber label. */
export const DRIP_LABEL: Record<DripType, string> = {
	bloodSet: "Blood set",
	makro: "Makro drip",
	mikro: "Mikro drip",
}

/** Urutan pilihan drip set untuk ditampilkan di UI (kecil ke besar). */
export const DRIP_TYPES = ["bloodSet", "makro", "mikro"] as const satisfies readonly DripType[]

/** Daftar siap pakai untuk UI: id, label, dan faktor tetesnya. */
export const DRIP_OPTIONS: readonly DripOption[] = DRIP_TYPES.map((id) => ({
	id,
	label: DRIP_LABEL[id],
	dropFactor: DROP_FACTOR[id],
}))

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
		const pilihan = DRIP_TYPES.map((t) => `"${t}"`).join(", ")
		throw new Error(`Jenis drip tidak valid: ${dripType}. Gunakan ${pilihan}.`)
	}

	const minutes = hours * 60
	const mlPerHour = volumeMl / hours
	const gttPerMinRaw = (volumeMl * dropFactor) / minutes
	const gttPerMin = Math.round(gttPerMinRaw)

	return { volumeMl, hours, dripType, dropFactor, gttPerMin, gttPerMinRaw, mlPerHour }
}
