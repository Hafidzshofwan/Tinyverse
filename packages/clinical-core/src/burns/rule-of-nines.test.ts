import { describe, expect, it } from "vitest"

import { burnAreaPercent, lundBrowderByAge } from "./lund-browder"
import {
	RULE9_AREAS,
	ruleOfNinesAreaLabel,
	ruleOfNinesAreaPercent,
	ruleOfNinesByAge,
	ruleOfNinesTbsa,
} from "./rule-of-nines"

describe("bagan Rule of Nines sesuai usia", () => {
	it("bayi: kepala 18% dan tiap tungkai 13,5%", () => {
		const c = ruleOfNinesByAge(0)
		expect(c.headPercent).toBe(18)
		expect(c.legPercent).toBe(13.5)
		expect(c.label).toBe("Bayi (0 tahun)")
	})

	it("tiap tahun kepala berkurang 1% dan tungkai bertambah 0,5%", () => {
		expect(ruleOfNinesByAge(1).headPercent).toBe(17)
		expect(ruleOfNinesByAge(1).legPercent).toBe(14)
		expect(ruleOfNinesByAge(5).headPercent).toBe(13)
		expect(ruleOfNinesByAge(5).legPercent).toBe(16)
	})

	it("berhenti di angka dewasa pada usia 9 tahun", () => {
		expect(ruleOfNinesByAge(9).headPercent).toBe(9)
		expect(ruleOfNinesByAge(9).legPercent).toBe(18)
		expect(ruleOfNinesByAge(40).headPercent).toBe(9)
		expect(ruleOfNinesByAge(40).legPercent).toBe(18)
		expect(ruleOfNinesByAge(9).label).toBe("Dewasa (>= 9 tahun)")
	})

	it("usia tidak valid diperlakukan sebagai 1 tahun", () => {
		expect(ruleOfNinesByAge(Number.NaN).headPercent).toBe(17)
		expect(ruleOfNinesByAge(Number.NaN).label).toBe("1 tahun")
	})

	it("usia negatif dijepit ke 0 tahun, tidak melempar galat", () => {
		expect(ruleOfNinesByAge(-3).headPercent).toBe(18)
	})
})

describe("total seluruh regio selalu 100%", () => {
	it.each([0, 1, 5, 9, 40])("usia %i tahun", (usia) => {
		const total = RULE9_AREAS.reduce(
			(acc, area) => acc + ruleOfNinesAreaPercent(area, usia),
			0,
		)
		expect(Math.round(total * 100) / 100).toBe(100)
	})
})

describe("persen per regio", () => {
	it("kepala dibagi rata depan dan belakang", () => {
		expect(ruleOfNinesAreaPercent("headFront", 0)).toBe(9)
		expect(ruleOfNinesAreaPercent("headBack", 0)).toBe(9)
		expect(ruleOfNinesAreaPercent("headFront", 40)).toBe(4.5)
	})

	it("batang tubuh dan lengan tidak bergantung usia", () => {
		expect(ruleOfNinesAreaPercent("chest", 0)).toBe(9)
		expect(ruleOfNinesAreaPercent("chest", 40)).toBe(9)
		expect(ruleOfNinesAreaPercent("armRightFront", 0)).toBe(4.5)
		expect(ruleOfNinesAreaPercent("armLeftBack", 40)).toBe(4.5)
		expect(ruleOfNinesAreaPercent("perineum", 3)).toBe(1)
	})

	it("tungkai bergantung usia", () => {
		expect(ruleOfNinesAreaPercent("legRightFront", 0)).toBe(6.75)
		expect(ruleOfNinesAreaPercent("legRightFront", 40)).toBe(9)
	})

	it("label berbahasa Indonesia", () => {
		expect(ruleOfNinesAreaLabel("lowerBack")).toBe("Punggung bawah")
		expect(ruleOfNinesAreaLabel("perineum")).toBe("Perineum")
	})
})

describe("penjumlahan TBSA", () => {
	it("anak 5 tahun: kepala penuh + dada = 22%", () => {
		const r = ruleOfNinesTbsa(["headFront", "headBack", "chest"], 5)
		expect(r.tbsaPercent).toBe(22)
		expect(r.contributions).toHaveLength(3)
		expect(r.chart.label).toBe("5 tahun")
	})

	it("regio duplikat hanya dihitung sekali", () => {
		const r = ruleOfNinesTbsa(["chest", "chest", "abdomen"], 40)
		expect(r.tbsaPercent).toBe(18)
		expect(r.contributions).toHaveLength(2)
	})

	it("tanpa regio terpilih hasilnya 0%", () => {
		expect(ruleOfNinesTbsa([], 3).tbsaPercent).toBe(0)
	})
})

describe("pagar anti-regresi: Lund & Browder tidak boleh ikut berubah", () => {
	it("bagan Lund usia 1 tahun tetap A 8,5 / B 3,25 / C 2,5", () => {
		const c = lundBrowderByAge(1)
		expect(c.A).toBe(8.5)
		expect(c.B).toBe(3.25)
		expect(c.C).toBe(2.5)
	})

	it("dada versi Lund tetap 6,5% dan berbeda dari Rule of Nines 9%", () => {
		expect(burnAreaPercent("chest", 5)).toBe(6.5)
		expect(ruleOfNinesAreaPercent("chest", 5)).toBe(9)
	})
})
