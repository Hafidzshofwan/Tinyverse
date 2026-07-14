import { describe, it, expect } from "vitest"
import { maintenanceFluids } from "./maintenance"
import { maintenanceGolden } from "./__fixtures__/fluids.golden"

describe("maintenanceFluids (Holliday–Segar) — golden vs v17", () => {
	for (const g of maintenanceGolden) {
		it(`BB ${g.weightKg} kg → ${g.totalMlPerDay} mL/hari`, () => {
			const r = maintenanceFluids(g.weightKg)
			expect(r.totalMlPerDay).toBe(g.totalMlPerDay)
			expect(r.mlPerHour.toFixed(1)).toBe(g.mlPerHourDisplay)
		})
	}

	it("menolak berat badan tidak valid", () => {
		expect(() => maintenanceFluids(0)).toThrow()
		expect(() => maintenanceFluids(-3)).toThrow()
		expect(() => maintenanceFluids(Number.NaN)).toThrow()
	})
})
