import { describe, expect, it } from "vitest"
import { BillingError, palingAkhir, sebelum, sisaHari, tambahHari } from "../shared"

describe("aritmetika waktu", () => {
	it("menambah hari dalam UTC", () => {
		expect(tambahHari("2026-01-01T00:00:00.000Z", 30)).toBe("2026-01-31T00:00:00.000Z")
	})

	/* Tahun kabisat 2028: 29 Februari harus ikut terhitung. */
	it("melewati tahun kabisat dengan benar", () => {
		expect(tambahHari("2028-02-27T00:00:00.000Z", 3)).toBe("2028-03-01T00:00:00.000Z")
	})

	it("365 hari dari 1 Januari tahun kabisat tidak jatuh di 1 Januari", () => {
		expect(tambahHari("2028-01-01T00:00:00.000Z", 365)).toBe("2028-12-31T00:00:00.000Z")
	})

	it("menolak waktu yang tidak sah", () => {
		expect(() => tambahHari("bukan-tanggal", 1)).toThrow(BillingError)
	})

	it("menolak durasi negatif atau pecahan", () => {
		expect(() => tambahHari("2026-01-01T00:00:00.000Z", -1)).toThrow(BillingError)
		expect(() => tambahHari("2026-01-01T00:00:00.000Z", 1.5)).toThrow(BillingError)
	})

	it("membandingkan waktu", () => {
		expect(sebelum("2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z")).toBe(true)
		expect(sebelum("2026-01-01T00:00:00.000Z", "2026-01-01T00:00:00.000Z")).toBe(false)
	})

	it("memilih waktu paling akhir", () => {
		expect(palingAkhir("2026-01-01T00:00:00.000Z", "2026-06-01T00:00:00.000Z")).toBe(
			"2026-06-01T00:00:00.000Z",
		)
	})

	it("membulatkan sisa hari ke atas dan tidak pernah negatif", () => {
		/* Sisa 12 jam tetap ditampilkan sebagai 1 hari, bukan 0. */
		expect(sisaHari("2026-01-01T00:00:00.000Z", "2026-01-01T12:00:00.000Z")).toBe(1)
		expect(sisaHari("2026-06-01T00:00:00.000Z", "2026-01-01T00:00:00.000Z")).toBe(0)
	})
})
