import { describe, it, expect } from "vitest"
import {
	parklandVolumeMl,
	maintenanceHollidaySegarMlPerDay,
	urineOutputTarget,
} from "./parkland"
import { hollidayGolden } from "./__fixtures__/burns.golden"

describe("parklandVolumeMl = 4 x BB x %TBSA", () => {
	it("14 kg, 26.5% → 1484 mL", () => {
		expect(parklandVolumeMl(14, 26.5)).toBe(1484)
	})
	it("%TBSA 0 → 0 mL (valid)", () => {
		expect(parklandVolumeMl(20, 0)).toBe(0)
	})
	it("menolak berat/tbsa tidak valid", () => {
		expect(() => parklandVolumeMl(0, 10)).toThrow()
		expect(() => parklandVolumeMl(10, -1)).toThrow()
	})
})

describe("maintenanceHollidaySegarMlPerDay — golden vs v17", () => {
	for (const g of hollidayGolden) {
		it(`${g.weightKg} kg → ${g.totalMlPerDay} mL/hari`, () => {
			expect(maintenanceHollidaySegarMlPerDay(g.weightKg)).toBe(g.totalMlPerDay)
		})
	}
})

describe("urineOutputTarget — ambang 30 kg", () => {
	it("< 30 kg → 1-2 mL/kg/jam", () => {
		expect(urineOutputTarget(29.9)).toEqual({ minMlPerHour: 29.9, maxMlPerHour: 59.8, label: "1\u20132 mL/kg/jam" })
	})
	it(">= 30 kg → 0,5-1 mL/kg/jam", () => {
		expect(urineOutputTarget(30)).toEqual({ minMlPerHour: 15, maxMlPerHour: 30, label: "0,5\u20131 mL/kg/jam" })
	})
})
