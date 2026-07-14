import { describe, it, expect } from "vitest"

import { ageInDays, ageInMonths, ageInYears, ageBand } from "./age"

const birth = new Date("2020-01-15T00:00:00Z")

describe("age — golden vectors", () => {
	it("ageInDays", () => {
		expect(ageInDays(birth, new Date("2020-01-16T00:00:00Z"))).toBe(1)
		expect(ageInDays(birth, new Date("2020-02-15T00:00:00Z"))).toBe(31)
	})

	it("ageInMonths", () => {
		expect(ageInMonths(birth, new Date("2020-02-14T00:00:00Z"))).toBe(0)
		expect(ageInMonths(birth, new Date("2020-02-15T00:00:00Z"))).toBe(1)
		expect(ageInMonths(birth, new Date("2021-01-15T00:00:00Z"))).toBe(12)
	})

	it("ageInYears", () => {
		expect(ageInYears(birth, new Date("2021-01-14T00:00:00Z"))).toBe(0)
		expect(ageInYears(birth, new Date("2021-01-15T00:00:00Z"))).toBe(1)
		expect(ageInYears(birth, new Date("2025-07-01T00:00:00Z"))).toBe(5)
	})

	it("ageBand", () => {
		expect(ageBand(birth, new Date("2020-01-20T00:00:00Z"))).toBe("neonate")
		expect(ageBand(birth, new Date("2020-06-15T00:00:00Z"))).toBe("infant")
		expect(ageBand(birth, new Date("2026-01-15T00:00:00Z"))).toBe("child")
		expect(ageBand(birth, new Date("2032-01-15T00:00:00Z"))).toBe("adolescent")
	})

	it("rejects ref before birth", () => {
		expect(() => ageInDays(birth, new Date("2019-01-01T00:00:00Z"))).toThrow()
	})
})
