import { describe, it, expect } from "vitest"

import { convertMass, convertVolume, convertTime } from "./units"

describe("units — golden vectors", () => {
	it("mass conversions", () => {
		expect(convertMass(1, "g", "mg")).toBe(1000)
		expect(convertMass(2, "kg", "g")).toBe(2000)
		expect(convertMass(1000, "mg", "g")).toBe(1)
		expect(convertMass(500, "mcg", "mg")).toBeCloseTo(0.5, 9)
	})

	it("volume conversions", () => {
		expect(convertVolume(1, "L", "mL")).toBe(1000)
		expect(convertVolume(250, "mL", "L")).toBeCloseTo(0.25, 9)
	})

	it("time conversions", () => {
		expect(convertTime(2, "h", "min")).toBe(120)
		expect(convertTime(1, "day", "h")).toBe(24)
		expect(convertTime(1, "day", "min")).toBe(1440)
	})
})
