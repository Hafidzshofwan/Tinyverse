import { describe, expect, it } from "vitest"
import { terapkanPembelian } from "../subscription/perpanjang"
import { langgananKosong, type Langganan } from "../subscription/types"
import type { Plan } from "../plans/types"

const BULANAN: Plan = {
	id: "bulanan",
	nama: "Bulanan",
	durasiHari: 30,
	hargaRupiah: 49000,
	aktif: true,
}

const TAHUNAN: Plan = {
	id: "tahunan",
	nama: "Tahunan",
	durasiHari: 365,
	hargaRupiah: 490000,
	aktif: true,
}

const SEKARANG = "2026-06-01T00:00:00.000Z"

function aktifSampai(berakhir: string): Langganan {
	return {
		accountId: "akun-1",
		planId: "bulanan",
		periodeMulai: "2026-01-01T00:00:00.000Z",
		periodeBerakhir: berakhir,
		lastOrderId: "order-lama",
		updatedAt: "2026-01-01T00:00:00.000Z",
	}
}

describe("terapkanPembelian", () => {
	it("pembelian pertama mulai dari sekarang", () => {
		const hasil = terapkanPembelian({
			langganan: langgananKosong("akun-1", SEKARANG),
			plan: BULANAN,
			orderId: "order-1",
			sekarang: SEKARANG,
		})
		expect(hasil.periodeMulai).toBe(SEKARANG)
		expect(hasil.periodeBerakhir).toBe("2026-07-01T00:00:00.000Z")
	})

	/*
	 * Perilaku yang paling mudah salah dan paling cepat dikeluhkan:
	 * memperpanjang lebih awal tidak boleh menghanguskan sisa hari.
	 */
	it("perpanjangan lebih awal menumpuk di atas sisa hari", () => {
		const hasil = terapkanPembelian({
			langganan: aktifSampai("2026-06-11T00:00:00.000Z"),
			plan: BULANAN,
			orderId: "order-2",
			sekarang: SEKARANG,
		})
		/* sisa 10 hari + 30 hari = 40 hari sejak sekarang */
		expect(hasil.periodeBerakhir).toBe("2026-07-11T00:00:00.000Z")
	})

	it("pembelian setelah kedaluwarsa mulai dari sekarang, bukan dari masa lalu", () => {
		const hasil = terapkanPembelian({
			langganan: aktifSampai("2026-01-01T00:00:00.000Z"),
			plan: BULANAN,
			orderId: "order-3",
			sekarang: SEKARANG,
		})
		expect(hasil.periodeBerakhir).toBe("2026-07-01T00:00:00.000Z")
	})

	it("periodeMulai pertama tidak ditulis ulang saat perpanjangan", () => {
		const hasil = terapkanPembelian({
			langganan: aktifSampai("2026-06-11T00:00:00.000Z"),
			plan: BULANAN,
			orderId: "order-2",
			sekarang: SEKARANG,
		})
		expect(hasil.periodeMulai).toBe("2026-01-01T00:00:00.000Z")
	})

	it("naik ke paket tahunan tetap menumpuk", () => {
		const hasil = terapkanPembelian({
			langganan: aktifSampai("2026-06-11T00:00:00.000Z"),
			plan: TAHUNAN,
			orderId: "order-4",
			sekarang: SEKARANG,
		})
		expect(hasil.periodeBerakhir).toBe("2027-06-11T00:00:00.000Z")
		expect(hasil.planId).toBe("tahunan")
	})

	it("tidak mengubah objek asal", () => {
		const asal = aktifSampai("2026-06-11T00:00:00.000Z")
		terapkanPembelian({ langganan: asal, plan: BULANAN, orderId: "o", sekarang: SEKARANG })
		expect(asal.periodeBerakhir).toBe("2026-06-11T00:00:00.000Z")
		expect(asal.lastOrderId).toBe("order-lama")
	})

	it("membeli dua kali berturut-turut menambah dua periode penuh", () => {
		const satu = terapkanPembelian({
			langganan: langgananKosong("akun-1", SEKARANG),
			plan: BULANAN,
			orderId: "o1",
			sekarang: SEKARANG,
		})
		const dua = terapkanPembelian({
			langganan: satu,
			plan: BULANAN,
			orderId: "o2",
			sekarang: SEKARANG,
		})
		expect(dua.periodeBerakhir).toBe("2026-07-31T00:00:00.000Z")
	})
})
