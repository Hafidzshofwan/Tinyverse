import { describe, it, expect } from "vitest"
import { calculateGcs } from "./gcs"
import { gcsGolden } from "./__fixtures__/gcs.golden"

describe("calculateGcs — golden vs v17 (149 skenario)", () => {
	for (const g of gcsGolden) {
		const tag = `E${g.eye ?? "-"} V${g.verbal ?? "-"} M${g.motor ?? "-"}${g.intubated ? " (tube)" : ""}`
		it(tag, () => {
			const r = calculateGcs({
				eye: g.eye,
				motor: g.motor,
				verbal: g.verbal,
				intubated: g.intubated,
			})
			expect(r.complete).toBe(g.complete)
			expect(r.scoreText).toBe(g.scoreText)
			expect(r.total).toBe(g.total)
			expect(r.level).toBe(g.level)
			expect(r.category).toBe(g.category)
			expect(r.advice).toBe(g.advice)
			expect(r.totalText).toBe(g.totalText)
		})
	}
})

describe("calculateGcs — contoh kunci", () => {
	it("E4 V5 M6 = 15/15 stabil", () => {
		const r = calculateGcs({ eye: 4, verbal: 5, motor: 6, intubated: false })
		expect(r.totalText).toBe("E4 V5 M6 = 15/15")
		expect(r.level).toBe("stabil")
	})
	it("batas 9 = waspada, 8 = kritis", () => {
		expect(calculateGcs({ eye: 3, verbal: 3, motor: 3, intubated: false }).level).toBe("waspada")
		expect(calculateGcs({ eye: 2, verbal: 3, motor: 3, intubated: false }).level).toBe("kritis")
	})
	it("batas 13 = stabil, 12 = waspada", () => {
		expect(calculateGcs({ eye: 3, verbal: 4, motor: 6, intubated: false }).level).toBe("stabil")
		expect(calculateGcs({ eye: 3, verbal: 3, motor: 6, intubated: false }).level).toBe("waspada")
	})
	it("intubasi → total E+M, teks berakhiran T", () => {
		const r = calculateGcs({ eye: 4, verbal: 5, motor: 6, intubated: true })
		expect(r.total).toBe(10)
		expect(r.totalText).toBe("E4 VT M6 = 10T")
		expect(r.level).toBe("stabil")
	})
	it("intubasi batas: <=4 kritis, <=8 waspada, >8 stabil", () => {
		expect(calculateGcs({ eye: 1, verbal: null, motor: 3, intubated: true }).level).toBe("kritis")
		expect(calculateGcs({ eye: 1, verbal: null, motor: 7 - 1, intubated: true }).level).toBe("waspada")
		expect(calculateGcs({ eye: 4, verbal: null, motor: 5, intubated: true }).level).toBe("stabil")
	})
	it("belum lengkap → complete false, tanpa total", () => {
		const r = calculateGcs({ eye: null, verbal: 5, motor: 6, intubated: false })
		expect(r.complete).toBe(false)
		expect(r.total).toBeNull()
		expect(r.scoreText).toBe("E\u2013 V5 M6")
	})
})

describe("calculateGcs — menolak skor tidak valid", () => {
	it("eye di luar 1-4", () => {
		expect(() => calculateGcs({ eye: 5, verbal: 5, motor: 6, intubated: false })).toThrow()
		expect(() => calculateGcs({ eye: 0, verbal: 5, motor: 6, intubated: false })).toThrow()
	})
	it("motor di luar 1-6", () => {
		expect(() => calculateGcs({ eye: 4, verbal: 5, motor: 7, intubated: false })).toThrow()
	})
	it("verbal di luar 1-5", () => {
		expect(() => calculateGcs({ eye: 4, verbal: 6, motor: 6, intubated: false })).toThrow()
	})
	it("skor pecahan ditolak", () => {
		expect(() => calculateGcs({ eye: 3.5, verbal: 5, motor: 6, intubated: false })).toThrow()
	})
})
