// Uji unit untuk capping.ts — pembatasan dosis tunggal/harian & peringatan
// terkait. Nilai numerik silang-cek terhadap golden vector Ambroxol BB30
// (cap harian) dan Ibuprofen BB45 (cap tunggal) di dosing.test.ts.

import { describe, expect, it } from "vitest"
import { batasHarianMg, batasiDosisHarian, batasiDosisTunggal, cekBatasHarianDariDosisPerKali } from "./capping"
import type { Obat } from "./types"

const baseObat: Obat = { nama: "Uji", doseType: "perKg", satuanDosis: "mg" }

describe("batasHarianMg", () => {
	it("mengambil nilai terkecil dari semua batas yang berlaku", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalHarianMg: 45, dosisMaksimalHarianPerKg: 2 }
		expect(batasHarianMg(obat, null, 30)).toBe(45) // 2*30=60 > 45
		expect(batasHarianMg(obat, null, 10)).toBe(20) // 2*10=20 < 45
	})

	it("mengembalikan null bila tidak ada batas", () => {
		expect(batasHarianMg(baseObat, null, 10)).toBeNull()
	})
})

describe("batasiDosisTunggal", () => {
	it("membatasi dosisMaxMg dan menurunkan dosisMinMg bila melampaui", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalTunggalMg: 400 }
		const result = batasiDosisTunggal(obat, null, 225, 450)
		expect(result.dosisMaxMg).toBe(400)
		expect(result.dosisMinMg).toBe(225)
		expect(result.peringatan).toHaveLength(1)
	})

	it("tidak mengubah apa pun bila di bawah batas", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalTunggalMg: 400 }
		const result = batasiDosisTunggal(obat, null, 50, 100)
		expect(result).toEqual({ dosisMinMg: 50, dosisMaxMg: 100, peringatan: [] })
	})
})

describe("batasiDosisHarian", () => {
	it("membatasi dosisHarianMaxMg bila melampaui batas harian", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalHarianMg: 45 }
		const result = batasiDosisHarian(obat, null, 30, 30, 60)
		expect(result.dosisHarianMaxMg).toBe(45)
		expect(result.dosisHarianMinMg).toBe(30)
		expect(result.peringatan[0]).toContain("melebihi batas harian")
	})
})

describe("cekBatasHarianDariDosisPerKali", () => {
	it("memperingatkan bila dosis-per-kali dikali frekuensi maksimum melampaui batas harian", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalHarianMg: 1200, maxDosesPerDay: 4 }
		expect(cekBatasHarianDariDosisPerKali(obat, null, null, 400)).toHaveLength(1)
	})

	it("tidak memperingatkan bila masih dalam batas", () => {
		const obat: Obat = { ...baseObat, dosisMaksimalHarianMg: 1200, maxDosesPerDay: 4 }
		expect(cekBatasHarianDariDosisPerKali(obat, null, null, 100)).toEqual([])
	})
})
