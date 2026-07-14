// Uji `calculateDosing` terhadap SEMUA golden vector yang ditangkap dari
// v17 asli (lihat __fixtures__/dosing.golden.ts). Setiap vektor adalah
// input+output nyata dari `window.hitungDosisInti()` v17, dijalankan
// headless terhadap data obat.json sungguhan milik pengguna.

import { describe, expect, it } from "vitest"
import { calculateDosing } from "./dosing"
import { dosingGoldenVectors, obatFixtures } from "./__fixtures__/dosing.golden"

const NUMERIC_KEYS = [
	"dosisMinMg",
	"dosisMaxMg",
	"dosisMinMl",
	"dosisMaxMl",
	"dosisHarianMinMg",
	"dosisHarianMaxMg",
	"beratBadan",
	"usiaBulan",
	"sedMgFinal",
	"sedMlFinal",
	"dosesPerDayFinal",
] as const

describe("calculateDosing — golden vectors dari v17", () => {
	for (const vector of dosingGoldenVectors) {
		it(vector.label, () => {
			const obat = obatFixtures[vector.obatKey]
			expect(obat, `fixture obat tidak ditemukan: ${vector.obatKey}`).toBeDefined()

			const { bb, usia, sediaanIdx } = vector.inputs
			const actual = calculateDosing(obat as any, bb, usia, sediaanIdx ?? undefined)
			const expected = vector.expected as any

			if (expected.error !== null && expected.error !== undefined) {
				expect((actual as any).error).toBe(expected.error)
				return
			}

			expect((actual as any).error).toBeNull()

			for (const key of NUMERIC_KEYS) {
				const expectedValue = expected[key]
				const actualValue = (actual as any)[key]
				if (expectedValue === null || expectedValue === undefined) {
					expect(actualValue ?? null, key).toBeNull()
				} else {
					expect(actualValue, key).toBeCloseTo(expectedValue, 6)
				}
			}

			expect((actual as any).peringatan, "peringatan").toEqual(expected.peringatan)
			expect((actual as any).doseBasisFinal, "doseBasisFinal").toBe(expected.doseBasisFinal)
			expect((actual as any).sediaanLabelFinal, "sediaanLabelFinal").toBe(expected.sediaanLabelFinal ?? null)

			if (expected.band === null) {
				expect((actual as any).band).toBeNull()
			} else {
				expect((actual as any).band).not.toBeNull()
			}
		})
	}
})
