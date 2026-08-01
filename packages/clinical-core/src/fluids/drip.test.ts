import { describe, it, expect } from "vitest"
import { DRIP_OPTIONS, DROP_FACTOR, dripRate } from "./drip"
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

	it("blood set memakai faktor 15 tetes/mL", () => {
		const r = dripRate(500, 8, "bloodSet")
		expect(r.dropFactor).toBe(15)
		expect(r.gttPerMinRaw.toFixed(1)).toBe("15.6")
		expect(r.gttPerMin).toBe(16)
		expect(r.mlPerHour.toFixed(1)).toBe("62.5")
	})

	it("tabel faktor tetes lengkap dan konsisten dengan daftar pilihan", () => {
		expect(DROP_FACTOR).toEqual({ bloodSet: 15, makro: 20, mikro: 60 })
		expect(DRIP_OPTIONS.map((o) => o.id)).toEqual(["bloodSet", "makro", "mikro"])
		for (const o of DRIP_OPTIONS) {
			expect(o.dropFactor).toBe(DROP_FACTOR[o.id])
			expect(dripRate(500, 8, o.id).dropFactor).toBe(o.dropFactor)
			expect(o.label.length).toBeGreaterThan(0)
		}
	})

	it("menolak input tidak valid", () => {
		expect(() => dripRate(0, 8)).toThrow()
		expect(() => dripRate(500, 0)).toThrow()
		expect(() => dripRate(-100, 8)).toThrow()
	})
})
