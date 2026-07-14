import { describe, it, expect } from "vitest"
import { calculateBurnResuscitation, totalTbsaPercent } from "./burns"
import { maintenanceHollidaySegarMlPerDay } from "./parkland"
import { maintenanceFluids } from "../fluids"
import { scenarioGolden, hollidayGolden } from "./__fixtures__/burns.golden"
import type { BurnArea } from "./types"

describe("calculateBurnResuscitation — skenario golden vs v17", () => {
	for (const s of scenarioGolden) {
		it(s.name, () => {
			const r = calculateBurnResuscitation(s.areas as BurnArea[], s.ageYears, s.weightKg)
			expect(r.tbsaPercent).toBeCloseTo(s.tbsaPercent, 6)
			expect(r.parklandMlPer24h).toBeCloseTo(s.parklandMlPer24h, 6)
			expect(r.first8hMl).toBeCloseTo(s.first8hMl, 6)
			expect(r.next16hMl).toBeCloseTo(s.next16hMl, 6)
			expect(r.maintenanceMlPerDay).toBe(s.maintenanceMlPerDay)
			expect(r.total24hMl).toBeCloseTo(s.total24hMl, 6)
			expect(r.urineTargetMinMlPerHour).toBeCloseTo(s.urineTargetMinMlPerHour, 6)
			expect(r.urineTargetMaxMlPerHour).toBeCloseTo(s.urineTargetMaxMlPerHour, 6)
			expect(r.urineTargetLabel).toBe(s.urineTargetLabel)
		})
	}

	it("region duplikat dihitung sekali (perilaku Set v17)", () => {
		const once = totalTbsaPercent(["chest"], 5)
		const twice = totalTbsaPercent(["chest", "chest"], 5)
		expect(twice).toBe(once)
	})

	it("menolak usia/berat tidak valid", () => {
		expect(() => calculateBurnResuscitation(["chest"], Number.NaN, 20)).toThrow()
		expect(() => calculateBurnResuscitation(["chest"], 5, 0)).toThrow()
		expect(() => calculateBurnResuscitation(["chest"], -1, 20)).toThrow()
	})
})

describe("anti-drift: rumatan Burns == Fluids (Holliday–Segar)", () => {
	for (const g of hollidayGolden) {
		it(`${g.weightKg} kg identik`, () => {
			expect(maintenanceHollidaySegarMlPerDay(g.weightKg)).toBe(
				maintenanceFluids(g.weightKg).totalMlPerDay,
			)
		})
	}
})
