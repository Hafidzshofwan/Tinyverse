import { describe, it, expect } from "vitest"
import {
	eyeMotorAgeGroup,
	verbalAgeGroup,
	eyeMotorAgeGroupLabel,
	verbalAgeGroupLabel,
} from "./age"

describe("eyeMotorAgeGroup — ambang 12 bulan", () => {
	it("0 & 11 bln → lt1", () => {
		expect(eyeMotorAgeGroup(0)).toBe("lt1")
		expect(eyeMotorAgeGroup(11)).toBe("lt1")
	})
	it("12 bln → ge1", () => {
		expect(eyeMotorAgeGroup(12)).toBe("ge1")
		expect(eyeMotorAgeGroup(200)).toBe("ge1")
	})
})

describe("verbalAgeGroup — ambang 24 & 60 bulan", () => {
	it("< 24 bln → lt2", () => {
		expect(verbalAgeGroup(0)).toBe("lt2")
		expect(verbalAgeGroup(23)).toBe("lt2")
	})
	it("24..60 bln → 2to5", () => {
		expect(verbalAgeGroup(24)).toBe("2to5")
		expect(verbalAgeGroup(60)).toBe("2to5")
	})
	it("> 60 bln → gt5", () => {
		expect(verbalAgeGroup(61)).toBe("gt5")
	})
})

describe("label kelompok usia", () => {
	it("eye/motor", () => {
		expect(eyeMotorAgeGroupLabel("lt1")).toBe("<1 tahun")
		expect(eyeMotorAgeGroupLabel("ge1")).toBe(">1 tahun")
	})
	it("verbal", () => {
		expect(verbalAgeGroupLabel("lt2")).toBe("<2 tahun")
		expect(verbalAgeGroupLabel("2to5")).toBe("2\u20135 tahun")
		expect(verbalAgeGroupLabel("gt5")).toBe(">5 tahun")
	})
})

describe("usia tidak valid ditolak", () => {
	it("negatif / NaN", () => {
		expect(() => eyeMotorAgeGroup(-1)).toThrow()
		expect(() => verbalAgeGroup(Number.NaN)).toThrow()
	})
})
