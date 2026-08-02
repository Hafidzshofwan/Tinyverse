import { describe, expect, it } from "vitest"
import {
	atlsFactor,
	atlsUrineTarget,
	calculateAtlsBurnResuscitation,
	maintenance421MlPerHour,
} from "./atls"
import { parklandVolumeMl } from "./parkland"

describe("faktor cairan ATLS", () => {
	it("anak di bawah 14 tahun memakai 3 mL", () => {
		expect(atlsFactor(4).mlPerKgPerTbsa).toBe(3)
		expect(atlsFactor(13.9).mlPerKgPerTbsa).toBe(3)
	})

	it("remaja dan dewasa memakai 2 mL", () => {
		expect(atlsFactor(14).mlPerKgPerTbsa).toBe(2)
		expect(atlsFactor(40).mlPerKgPerTbsa).toBe(2)
	})

	it("cedera listrik memakai 4 mL berapa pun usianya", () => {
		expect(atlsFactor(2, "listrik").mlPerKgPerTbsa).toBe(4)
		expect(atlsFactor(40, "listrik").mlPerKgPerTbsa).toBe(4)
	})

	it("menolak usia negatif", () => {
		expect(() => atlsFactor(-1)).toThrow()
	})
})

describe("rumatan 4-2-1 per jam", () => {
	it("bayi 8 kg", () => {
		expect(maintenance421MlPerHour(8)).toBe(32)
	})
	it("anak 15 kg", () => {
		expect(maintenance421MlPerHour(15)).toBe(50)
	})
	it("anak 25 kg", () => {
		expect(maintenance421MlPerHour(25)).toBe(65)
	})
})

describe("target urin ATLS", () => {
	it("anak <= 30 kg memakai 1 mL/kg/jam", () => {
		expect(atlsUrineTarget(15).minMlPerHour).toBe(15)
	})
	it("di atas 30 kg memakai 0,5 mL/kg/jam", () => {
		expect(atlsUrineTarget(60).minMlPerHour).toBe(30)
	})
	it("cedera listrik menuntut 1-2 mL/kg/jam", () => {
		const t = atlsUrineTarget(60, "listrik")
		expect(t.minMlPerHour).toBe(60)
		expect(t.maxMlPerHour).toBe(120)
	})
})

describe("resusitasi ATLS", () => {
	it("contoh berjalan: anak 15 kg, 25% TBSA, tiba 2 jam setelah kejadian", () => {
		const r = calculateAtlsBurnResuscitation({
			weightKg: 15,
			tbsaPercent: 25,
			ageYears: 4,
			hoursSinceInjury: 2,
		})
		expect(r.totalMlPer24h).toBe(1125)
		expect(r.firstPhaseMl).toBe(562.5)
		expect(r.remainingFirstPhaseHours).toBe(6)
		expect(Math.round(r.firstPhaseRateMlPerHour)).toBe(94)
		expect(Math.round(r.secondPhaseRateMlPerHour)).toBe(35)
		expect(r.maintenanceApplies).toBe(true)
		expect(r.maintenanceMlPerHour).toBe(50)
		expect(r.urineTargetMinMlPerHour).toBe(15)
	})

	it("cairan pra-rumah sakit mengurangi jatah fase pertama", () => {
		const r = calculateAtlsBurnResuscitation({
			weightKg: 15,
			tbsaPercent: 25,
			ageYears: 4,
			hoursSinceInjury: 2,
			preHospitalMl: 200,
		})
		expect(r.firstPhaseRemainingMl).toBe(362.5)
	})

	it("pasien yang datang setelah jam ke-8 ditandai terlambat", () => {
		const r = calculateAtlsBurnResuscitation({
			weightKg: 15,
			tbsaPercent: 25,
			ageYears: 4,
			hoursSinceInjury: 9,
		})
		expect(r.firstPhaseElapsed).toBe(true)
		expect(r.remainingFirstPhaseHours).toBe(0)
	})

	it("pasien di atas 30 kg tidak mendapat jalur rumatan terpisah", () => {
		const r = calculateAtlsBurnResuscitation({ weightKg: 60, tbsaPercent: 20, ageYears: 30 })
		expect(r.maintenanceApplies).toBe(false)
		expect(r.maintenanceMlPerHour).toBe(0)
	})

	it("menolak %TBSA di luar 0-100", () => {
		expect(() =>
			calculateAtlsBurnResuscitation({ weightKg: 15, tbsaPercent: 120, ageYears: 4 }),
		).toThrow()
	})

	it("anak mendapat volume lebih kecil daripada Parkland lama", () => {
		const atls = calculateAtlsBurnResuscitation({ weightKg: 15, tbsaPercent: 25, ageYears: 4 })
		expect(atls.totalMlPer24h).toBeLessThan(parklandVolumeMl(15, 25))
	})

	it("parkland lama tidak berubah (pagar anti-regresi)", () => {
		expect(parklandVolumeMl(15, 25)).toBe(1500)
	})
})
