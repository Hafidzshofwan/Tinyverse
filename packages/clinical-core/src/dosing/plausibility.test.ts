// Uji unit untuk plausibility.ts — peringatan berat/usia tidak wajar dan
// peringatan "belum punya batas dosis maksimum". Nilai numerik silang-cek
// terhadap golden vector Ambroxol BB1.5/BB70/BB40-usia6 dan Ivermectin BB20.

import { describe, expect, it } from "vitest"
import { checkMissingDoseCap, checkWeightAgePlausibility } from "./plausibility"
import type { Obat } from "./types"

describe("checkWeightAgePlausibility", () => {
	it("memperingatkan berat sangat rendah (<2kg)", () => {
		expect(checkWeightAgePlausibility("1.5", "12")[0]).toContain("sangat rendah")
	})

	it("memperingatkan berat tinggi (>60kg)", () => {
		expect(checkWeightAgePlausibility("70", "120")[0]).toContain("tergolong tinggi")
	})

	it("memperingatkan ketidaksesuaian berat vs usia", () => {
		const warnings = checkWeightAgePlausibility("40", "6")
		expect(warnings.some((w) => w.includes("tampak tidak sesuai"))).toBe(true)
	})

	it("tidak memperingatkan untuk berat/usia yang wajar", () => {
		expect(checkWeightAgePlausibility("10", "60")).toEqual([])
	})
})

describe("checkMissingDoseCap", () => {
	it("memperingatkan bila obat perKg tanpa batas dosis maksimum sama sekali", () => {
		const obat: Obat = { nama: "Ivermectin", doseType: "perKg", dosisMinPerKg: 150, dosisMaxPerKg: 200 }
		expect(checkMissingDoseCap(obat, null, 20)).toHaveLength(1)
	})

	it("tidak memperingatkan bila sudah punya batas", () => {
		const obat: Obat = { nama: "Ibuprofen", doseType: "perKg", dosisMaksimalTunggalMg: 400 }
		expect(checkMissingDoseCap(obat, null, 20)).toEqual([])
	})

	it("tidak memperingatkan untuk doseType flat (tidak berskala per kg)", () => {
		const obat: Obat = { nama: "Albendazole", doseType: "flat" }
		expect(checkMissingDoseCap(obat, null, 20)).toEqual([])
	})
})
