import { describe, expect, it } from "vitest"
import { hitungEntitlement } from "../subscription/entitlement"
import { terapkanPembelian } from "../subscription/perpanjang"
import {
	HARI_PERCOBAAN,
	PERCOBAAN_PLAN_ID,
	bolehDapatPercobaan,
	buatLanggananPercobaan,
} from "../subscription/percobaan"
import { langgananKosong, type Langganan } from "../subscription/types"
import type { Plan } from "../plans/types"

const SEKARANG = "2026-06-01T00:00:00.000Z"
/* Dua hari setelah SEKARANG. Ditulis sebagai angka mati, bukan dihitung ulang
   dengan tambahHari - kalau tambahHari suatu saat rusak, uji yang memakai
   tambahHari untuk menyusun jawabannya sendiri akan tetap hijau. */
const AKHIR_PERCOBAAN = "2026-06-03T00:00:00.000Z"

const PAKET_BULANAN: Plan = {
	id: "bulanan",
	nama: "1 Bulan",
	durasiHari: 30,
	hargaRupiah: 15000,
	aktif: true,
}

const PAKET_KUARTALAN: Plan = {
	id: "kuartalan",
	nama: "3 Bulan",
	durasiHari: 90,
	hargaRupiah: 35000,
	aktif: true,
}

function langgananBerbayar(berakhir: string): Langganan {
	return {
		accountId: "akun-1",
		planId: "bulanan",
		periodeMulai: "2026-01-01T00:00:00.000Z",
		periodeBerakhir: berakhir,
		lastOrderId: "order-1",
		updatedAt: SEKARANG,
	}
}

describe("buatLanggananPercobaan", () => {
	it("memberi akses tepat dua hari", () => {
		const langganan = buatLanggananPercobaan("akun-1", SEKARANG)
		const e = hitungEntitlement(langganan, SEKARANG)

		expect(HARI_PERCOBAAN).toBe(2)
		expect(langganan.periodeBerakhir).toBe(AKHIR_PERCOBAAN)
		expect(e.status).toBe("aktif")
		expect(e.bolehAkses).toBe(true)
		expect(e.sisaHari).toBe(2)
	})

	it("tidak menyimpan nomor pesanan, karena tidak ada uang yang masuk", () => {
		const langganan = buatLanggananPercobaan("akun-1", SEKARANG)
		expect(langganan.lastOrderId).toBeNull()
		expect(langganan.planId).toBe(PERCOBAAN_PLAN_ID)
	})

	it("menutup akses tepat saat masa percobaan habis", () => {
		const langganan = buatLanggananPercobaan("akun-1", SEKARANG)
		expect(hitungEntitlement(langganan, AKHIR_PERCOBAAN).bolehAkses).toBe(false)
	})

	it("masih mengizinkan satu milidetik sebelum habis", () => {
		const langganan = buatLanggananPercobaan("akun-1", SEKARANG)
		const e = hitungEntitlement(langganan, "2026-06-02T23:59:59.999Z")
		expect(e.bolehAkses).toBe(true)
	})

	it("hari ketiga sudah tertutup dan berstatus kedaluwarsa", () => {
		const langganan = buatLanggananPercobaan("akun-1", SEKARANG)
		const e = hitungEntitlement(langganan, "2026-06-04T00:00:00.000Z")
		expect(e.status).toBe("kedaluwarsa")
		expect(e.bolehAkses).toBe(false)
	})
})

describe("bolehDapatPercobaan", () => {
	it("mengizinkan akun yang belum punya catatan langganan", () => {
		expect(bolehDapatPercobaan(null)).toBe(true)
	})

	it("menolak akun yang sedang berlangganan", () => {
		expect(bolehDapatPercobaan(langgananBerbayar("2026-12-31T00:00:00.000Z"))).toBe(
			false,
		)
	})

	/*
	 * Kasus yang menentukan: langganan yang SUDAH LEWAT tetap menutup pintu
	 * masa percobaan. Tanpa uji ini, seseorang yang langganannya habis bisa
	 * mendapat 2 hari gratis setiap kali dokumennya dianggap "tidak aktif",
	 * dan itu berarti akses gratis tanpa batas dengan cara menunggu.
	 */
	it("menolak akun yang langganannya sudah kedaluwarsa", () => {
		expect(bolehDapatPercobaan(langgananBerbayar("2026-05-01T00:00:00.000Z"))).toBe(
			false,
		)
	})

	it("menolak akun yang masa percobaannya sudah pernah dipakai", () => {
		const bekasPercobaan = buatLanggananPercobaan("akun-1", "2026-01-01T00:00:00.000Z")
		expect(bolehDapatPercobaan(bekasPercobaan)).toBe(false)
	})

	it("menolak akun dengan dokumen langganan kosong", () => {
		expect(bolehDapatPercobaan(langgananKosong("akun-1", SEKARANG))).toBe(false)
	})
})

describe("pembelian saat masa percobaan masih berjalan", () => {
	/*
	 * KEPUTUSAN TERCATAT, bukan kecelakaan.
	 *
	 * terapkanPembelian menghitung titik awal dari yang paling akhir antara
	 * "sekarang" dan akhir periode berjalan. Karena masa percobaan adalah
	 * periode berjalan, pembeli mendapat sisa masa percobaannya sebagai bonus -
	 * paling banyak 2 hari.
	 *
	 * Ini dibiarkan dengan sengaja: perilakunya konsisten dengan janji yang
	 * sudah tertulis di perpanjang.ts ("pelanggan yang memperpanjang lebih awal
	 * tidak kehilangan sisa harinya"), dan menambah cabang khusus di fungsi
	 * yang menghitung masa akses hasil uang sungguhan jauh lebih berisiko
	 * daripada memberi 2 hari. Uji ini ada supaya perilaku itu tidak pernah
	 * berubah tanpa seseorang sadar mengubahnya.
	 */
	it("menambahkan paket di atas sisa masa percobaan", () => {
		const percobaan = buatLanggananPercobaan("akun-1", SEKARANG)
		const sesudah = terapkanPembelian({
			langganan: percobaan,
			plan: PAKET_BULANAN,
			orderId: "TV-1",
			sekarang: "2026-06-02T00:00:00.000Z",
		})

		/* 3 Juni (akhir percobaan) + 30 hari, bukan 2 Juni + 30 hari. */
		expect(sesudah.periodeBerakhir).toBe("2026-07-03T00:00:00.000Z")
		expect(sesudah.planId).toBe("bulanan")
		expect(sesudah.lastOrderId).toBe("TV-1")
	})

	it("menimpa penanda percobaan sehingga akun tidak bisa mengulanginya", () => {
		const percobaan = buatLanggananPercobaan("akun-1", SEKARANG)
		const sesudah = terapkanPembelian({
			langganan: percobaan,
			plan: PAKET_BULANAN,
			orderId: "TV-1",
			sekarang: "2026-06-02T00:00:00.000Z",
		})

		expect(sesudah.planId).not.toBe(PERCOBAAN_PLAN_ID)
		expect(bolehDapatPercobaan(sesudah)).toBe(false)
	})

	it("masa percobaan tidak mengubah tanggal awal berlangganan", () => {
		const percobaan = buatLanggananPercobaan("akun-1", SEKARANG)
		const sesudah = terapkanPembelian({
			langganan: percobaan,
			plan: PAKET_BULANAN,
			orderId: "TV-1",
			sekarang: "2026-06-02T00:00:00.000Z",
		})

		/* periodeMulai tetap menunjuk saat akses pertama kali terbuka, yaitu awal
		   masa percobaan, agar riwayat pelanggan terbaca utuh. */
		expect(sesudah.periodeMulai).toBe(SEKARANG)
	})
})

describe("paket 3 bulan", () => {
	/*
	 * Yang diuji di sini hanya aritmetika durasinya. Isi katalog paket ada di
	 * apps/web (planKatalog.ts) dan sengaja tidak diimpor, karena paket billing
	 * tidak boleh bergantung pada aplikasi web.
	 */
	it("memberi 90 hari akses dari akun yang belum pernah punya masa aktif", () => {
		const sesudah = terapkanPembelian({
			langganan: langgananKosong("akun-1", SEKARANG),
			plan: PAKET_KUARTALAN,
			orderId: "TV-2",
			sekarang: SEKARANG,
		})

		expect(sesudah.periodeBerakhir).toBe("2026-08-30T00:00:00.000Z")
		expect(hitungEntitlement(sesudah, SEKARANG).sisaHari).toBe(90)
	})
})
