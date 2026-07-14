import { describe, it, expect } from "vitest"
import { dripRate } from "./drip"
import { dripGolden } from "./__fixtures__/fluids.golden"

describe("dripRate (faktor tetes) — golden vs v17", () => {
	for (const g of dripGolden) {
		it(`${g.volumeMl} mL / ${g.hours} j ${g.dripType} → ${g.gttPerMin} tetes/menit`, () => {
			const r = dripRate(g.volumeMl, g.hours, g.dripType)
			expect(r.dropFactor).toBe(g.dropFactor)
			expect(r.gttPerMin).toBe(g.gttPerMin)
			expect(r.gttPerMinRaw.toFixed(1)).toBe(g.gttPerMinRawDisplay)
			expect(r.mlPerHour.toFixed(1)).toBe(g.mlPerHourDisplay)
		})
	}

	it("menolak input tidak valid", () => {
		expect(() => dripRate(0, 8)).toThrow()
		expect(() => dripRate(500, 0)).toThrow()
		expect(() => dripRate(-100, 8)).toThrow()
	})
})
