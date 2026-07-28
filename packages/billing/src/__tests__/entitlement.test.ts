import { describe, expect, it } from "vitest"
import { hitungEntitlement } from "../subscription/entitlement"
import { langgananKosong, type Langganan } from "../subscription/types"

const SEKARANG = "2026-06-01T00:00:00.000Z"

function langganan(berakhir: string | null): Langganan {
	return {
		accountId: "akun-1",
		planId: "bulanan",
		periodeMulai: "2026-01-01T00:00:00.000Z",
		periodeBerakhir: berakhir,
		lastOrderId: "order-1",
		updatedAt: SEKARANG,
	}
}

describe("hitungEntitlement", () => {
	it("menolak akun yang belum pernah membeli", () => {
		const e = hitungEntitlement(langgananKosong("akun-1", SEKARANG), SEKARANG)
		expect(e.status).toBe("belum")
		expect(e.bolehAkses).toBe(false)
	})

	it("menolak langganan null", () => {
		expect(hitungEntitlement(null, SEKARANG).bolehAkses).toBe(false)
	})

	it("mengizinkan saat periode masih berjalan", () => {
		const e = hitungEntitlement(langganan("2026-06-15T00:00:00.000Z"), SEKARANG)
		expect(e.status).toBe("aktif")
		expect(e.bolehAkses).toBe(true)
		expect(e.sisaHari).toBe(14)
	})

	it("menolak saat periode sudah lewat", () => {
		const e = hitungEntitlement(langganan("2026-05-31T00:00:00.000Z"), SEKARANG)
		expect(e.status).toBe("kedaluwarsa")
		expect(e.bolehAkses).toBe(false)
		expect(e.sisaHari).toBe(0)
	})

	/*
	 * Kasus pinggir yang menentukan: detik terakhir.
	 * Batas ditetapkan eksklusif - saat jam menunjuk tepat ke waktu berakhir,
	 * akses sudah tertutup. Tanpa tes ini, perbedaan antara < dan <= tidak akan
	 * pernah ketahuan sampai ada pelanggan yang mengeluh.
	 */
	it("menutup akses tepat pada milidetik berakhir", () => {
		const batas = "2026-06-01T00:00:00.000Z"
		expect(hitungEntitlement(langganan(batas), batas).bolehAkses).toBe(false)
	})

	it("masih mengizinkan satu milidetik sebelum berakhir", () => {
		const e = hitungEntitlement(langganan("2026-06-01T00:00:00.001Z"), SEKARANG)
		expect(e.bolehAkses).toBe(true)
	})

	it("tenggang memperpanjang akses tanpa mengubah tanggal berakhir", () => {
		const e = hitungEntitlement(langganan("2026-05-30T00:00:00.000Z"), SEKARANG, 3)
		expect(e.bolehAkses).toBe(true)
		/* Yang ditampilkan ke pelanggan tetap tanggal asli, bukan tanggal + tenggang. */
		expect(e.berakhirPada).toBe("2026-05-30T00:00:00.000Z")
	})

	it("tenggang tidak menyelamatkan yang sudah lewat terlalu jauh", () => {
		const e = hitungEntitlement(langganan("2026-05-01T00:00:00.000Z"), SEKARANG, 3)
		expect(e.bolehAkses).toBe(false)
	})
})
