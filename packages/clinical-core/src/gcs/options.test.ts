import { describe, it, expect } from "vitest"
import { EYE_OPTIONS, MOTOR_OPTIONS, VERBAL_OPTIONS } from "./options"

describe("integritas tabel OPSI", () => {
	it("Eye: 2 grup, skor 4..1", () => {
		for (const grp of ["lt1", "ge1"] as const) {
			expect(EYE_OPTIONS[grp].map((o) => o.score)).toEqual([4, 3, 2, 1])
			for (const o of EYE_OPTIONS[grp]) expect(o.label.length).toBeGreaterThan(0)
		}
	})
	it("Motor: 2 grup, skor 6..1", () => {
		for (const grp of ["lt1", "ge1"] as const) {
			expect(MOTOR_OPTIONS[grp].map((o) => o.score)).toEqual([6, 5, 4, 3, 2, 1])
		}
	})
	it("Verbal: 3 grup, skor 5..1", () => {
		for (const grp of ["lt2", "2to5", "gt5"] as const) {
			expect(VERBAL_OPTIONS[grp].map((o) => o.score)).toEqual([5, 4, 3, 2, 1])
		}
	})
	it("label spesifik v17 (contoh)", () => {
		expect(EYE_OPTIONS.lt1[1]!.label).toBe("Terhadap teriakan")
		expect(EYE_OPTIONS.ge1[1]!.label).toBe("Terhadap perintah verbal")
		expect(MOTOR_OPTIONS.ge1[0]!.label).toBe("Mengikuti perintah")
		expect(VERBAL_OPTIONS.lt2[0]!.label).toBe("Tersenyum, coos, atau babbling")
		expect(VERBAL_OPTIONS.gt5[0]!.label).toBe("Orientasi baik")
	})
})
