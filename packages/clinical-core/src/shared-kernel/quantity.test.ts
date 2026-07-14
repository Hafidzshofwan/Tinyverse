import { describe, it, expect } from "vitest"

import { mass, volume, time, toUnit, add, subtract } from "./quantity"

describe("Quantity — golden vectors", () => {
	it("converts units", () => {
		expect(toUnit(mass(1, "g"), "mg").value).toBe(1000)
		expect(toUnit(time(1, "day"), "h").value).toBe(24)
	})

	it("adds within a dimension", () => {
		const total = add(mass(500, "mg"), mass(1, "g"))
		expect(total.value).toBe(1500)
		expect(total.unit).toBe("mg")
	})

	it("subtracts within a dimension", () => {
		const remaining = subtract(volume(1000, "mL"), volume(0.25, "L"))
		expect(remaining.value).toBe(750)
		expect(remaining.unit).toBe("mL")
	})

	it("rejects non-finite values", () => {
		expect(() => mass(Number.NaN, "mg")).toThrow()
	})
})
