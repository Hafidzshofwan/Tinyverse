// Uji unit untuk guards.ts — validasi input berat badan & usia.
// Nilai batas (2kg, 150kg, 216 bulan, dst.) di-cross-check terhadap perilaku
// nyata v17 lewat golden vectors di dosing.test.ts (Ambroxol BB0/BB200,
// Vitamin A usia-1/usia300). Uji ini fokus ke unit guard secara terisolasi.

import { describe, expect, it } from "vitest"
import { findMatchingBand, validateAgeInput, validateWeightInput } from "./guards"
import type { DoseAgeBand } from "./types"

describe("validateWeightInput", () => {
	it("menolak berat 0 atau negatif", () => {
		expect(validateWeightInput("0")).toEqual({ error: "Mohon masukkan berat badan yang valid (lebih dari 0 kg)." })
		expect(validateWeightInput("-5")).toEqual({ error: "Mohon masukkan berat badan yang valid (lebih dari 0 kg)." })
	})

	it("menolak berat di atas 150kg sebagai tidak wajar", () => {
		expect(validateWeightInput("200")).toEqual({
			error: "Berat badan tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.",
		})
	})

	it("menerima berat valid", () => {
		expect(validateWeightInput("10")).toEqual({ beratBadan: 10 })
	})
})

describe("validateAgeInput", () => {
	it("menolak usia negatif", () => {
		expect(validateAgeInput("-1")).toEqual({ error: "Mohon masukkan usia anak yang valid (dalam bulan)." })
	})

	it("menolak usia di atas 216 bulan sebagai tidak wajar", () => {
		expect(validateAgeInput("300")).toEqual({
			error: "Usia tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.",
		})
	})

	it("menerima usia valid", () => {
		expect(validateAgeInput("48")).toEqual({ usiaBulan: 48 })
	})
})

describe("findMatchingBand", () => {
	const bands: DoseAgeBand[] = [
		{ usiaMinBulan: 0, usiaMaxBulan: 23, tipe: "perKg" },
		{ usiaMinBulan: 24, usiaMaxBulan: 59, tipe: "flat" },
	]

	it("mengembalikan band yang cocok dengan usia", () => {
		expect(findMatchingBand(bands, 12)).toBe(bands[0])
		expect(findMatchingBand(bands, 36)).toBe(bands[1])
	})

	it("mengembalikan null bila tidak ada band cocok", () => {
		expect(findMatchingBand(bands, 100)).toBeNull()
		expect(findMatchingBand(undefined, 10)).toBeNull()
	})
})
