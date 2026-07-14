import { describe, it, expect } from "vitest"
import { rehydrationPlanB, rehydrationPlanC } from "./rehydration"
import { planBGolden, planCGolden } from "./__fixtures__/fluids.golden"

describe("rehydrationPlanB (Rencana B) — golden vs v17", () => {
	for (const g of planBGolden) {
		it(`BB ${g.weightKg} kg → ${g.totalMlDisplay} mL`, () => {
			const r = rehydrationPlanB(g.weightKg)
			expect(r.totalMl).toBe(g.totalMlExact)
			expect(Number(r.totalMl.toFixed(0))).toBe(g.totalMlDisplay)
			expect(r.mlPerHour.toFixed(1)).toBe(g.mlPerHourDisplay)
			expect(r.overHours).toBe(g.overHours)
		})
	}
})

describe("rehydrationPlanC (Rencana C) — golden vs v17", () => {
	for (const g of planCGolden) {
		it(`BB ${g.weightKg} kg ${g.ageCategory} → ${g.totalMl} mL`, () => {
			const r = rehydrationPlanC(g.weightKg, g.ageCategory)
			expect(r.totalMl).toBe(g.totalMl)
			expect(r.totalHours).toBe(g.totalHours)
			expect(r.stage1.volumeMl).toBe(g.stage1.volumeMl)
			expect(r.stage1.hours).toBe(g.stage1.hours)
			expect(r.stage1.mlPerHour.toFixed(1)).toBe(g.stage1.mlPerHourDisplay)
			expect(r.stage2.volumeMl).toBe(g.stage2.volumeMl)
			expect(r.stage2.hours).toBe(g.stage2.hours)
			expect(r.stage2.mlPerHour.toFixed(1)).toBe(g.stage2.mlPerHourDisplay)
		})
	}

	it("menolak kategori/berat tidak valid", () => {
		expect(() => rehydrationPlanC(0, "bayi")).toThrow()
		// @ts-expect-error kategori usia tidak valid harus ditolak oleh tipe
		expect(() => rehydrationPlanC(8, "dewasa")).toThrow()
	})
})
