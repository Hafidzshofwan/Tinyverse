import { describe, it, expect } from "vitest"
import { fluidsContent, getFluidsData, getFluidsProvenance } from "./index"

describe("fluids content", () => {
	it("lolos validasi skema saat dimuat", () => {
		expect(fluidsContent.data.maintenance.method).toBe("Holliday-Segar")
	})

	it("membawa provenance lengkap", () => {
		const p = getFluidsProvenance()
		expect(p.source).toContain("v17")
		expect(p.version).toBe("v17")
		expect(p.effectiveDate).toBe("2026-07-12")
	})

	it("nilai identik dengan v17 (golden constants)", () => {
		const d = getFluidsData()
		expect(d.dripFactors).toEqual({ makro: 20, mikro: 60 })
		expect(d.rehydration.planB).toEqual({ mlPerKg: 75, overHours: 3 })
		expect(d.rehydration.planC.bayi.stage2).toEqual({ mlPerKg: 70, hours: 5 })
		expect(d.rehydration.planC.anak.stage1).toEqual({ mlPerKg: 30, hours: 0.5 })
		expect(d.maintenance.firstTierMlPerKg).toBe(100)
		expect(d.maintenance.secondTierBaseMl).toBe(1000)
		expect(d.maintenance.secondTierMlPerKg).toBe(50)
		expect(d.maintenance.thirdTierBaseMl).toBe(1500)
		expect(d.maintenance.thirdTierMlPerKg).toBe(20)
	})
})
