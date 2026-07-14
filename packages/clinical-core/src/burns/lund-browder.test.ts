import { describe, it, expect } from "vitest"
import { lundBrowderByAge, burnAreaPercent, burnAreaLabel, BURN_AREAS } from "./lund-browder"
import { chartGolden, chartNaNGolden, areaPercentGolden } from "./__fixtures__/burns.golden"

describe("lundBrowderByAge — golden vs v17", () => {
	for (const g of chartGolden) {
		it(`usia ${g.ageYears} th → ${g.label} (A=${g.A}, B=${g.B}, C=${g.C})`, () => {
			const r = lundBrowderByAge(g.ageYears)
			expect(r).toEqual({ A: g.A, B: g.B, C: g.C, label: g.label })
		})
	}

	it("usia NaN → default kelompok '1 tahun' (perilaku v17)", () => {
		expect(lundBrowderByAge(Number.NaN)).toEqual(chartNaNGolden)
	})
})

describe("burnAreaPercent — golden vs v17", () => {
	for (const g of areaPercentGolden) {
		it(`${g.area} @ ${g.ageYears} th = ${g.percent}%`, () => {
			expect(burnAreaPercent(g.area, g.ageYears)).toBe(g.percent)
		})
	}

	it("BURN_AREAS mencakup 49 region dan semua punya label", () => {
		expect(BURN_AREAS.length).toBe(49)
		for (const a of BURN_AREAS) {
			expect(typeof burnAreaLabel(a)).toBe("string")
			expect(burnAreaLabel(a).length).toBeGreaterThan(0)
		}
	})
})
