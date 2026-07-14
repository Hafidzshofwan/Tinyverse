import { describe, it, expect } from "vitest"

import { roundTo, roundToStep, roundToSignificant, clamp } from "./rounding"

describe("rounding — golden vectors", () => {
	it("roundTo (half-up)", () => {
		expect(roundTo(2.5, 0)).toBe(3)
		expect(roundTo(2.345, 2)).toBe(2.35)
		expect(roundTo(1.005, 2)).toBe(1.01)
		expect(roundTo(10, 2)).toBe(10)
	})

	it("roundToStep", () => {
		expect(roundToStep(7, 2.5)).toBe(7.5)
		expect(roundToStep(11, 5)).toBe(10)
		expect(roundToStep(2.6, 0.5)).toBe(2.5)
	})

	it("roundToSignificant", () => {
		expect(roundToSignificant(0.0034521, 2)).toBe(0.0035)
		expect(roundToSignificant(12345, 3)).toBe(12300)
		expect(roundToSignificant(0, 2)).toBe(0)
	})

	it("clamp", () => {
		expect(clamp(5, 0, 10)).toBe(5)
		expect(clamp(-3, 0, 10)).toBe(0)
		expect(clamp(20, 0, 10)).toBe(10)
	})
})
