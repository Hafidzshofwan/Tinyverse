import { describe, expect, it } from "vitest"
import { beralih, bolehBeralih } from "../orders/stateMachine"
import { petakanStatusMidtrans } from "../orders/midtrans"
import { STATUS_FINAL, sudahFinal, type StatusPesanan } from "../orders/types"

describe("mesin status pesanan", () => {
	it("alur normal: menunggu -> dibayar -> selesai", () => {
		expect(beralih("menunggu", "dibayar")).toBe("dibayar")
		expect(beralih("dibayar", "selesai")).toBe("selesai")
	})

	it("pesanan menunggu boleh gagal, kedaluwarsa, atau dibatalkan", () => {
		expect(bolehBeralih("menunggu", "gagal")).toBe(true)
		expect(bolehBeralih("menunggu", "kedaluwarsa")).toBe(true)
		expect(bolehBeralih("menunggu", "dibatalkan")).toBe(true)
	})

	/*
	 * Inti dari keberadaan mesin status ini.
	 * Notifikasi "kedaluwarsa" yang tiba terlambat tidak boleh mencabut akses
	 * pelanggan yang dananya sudah masuk.
	 */
	it("notifikasi terlambat tidak bisa membatalkan pembayaran", () => {
		expect(bolehBeralih("dibayar", "kedaluwarsa")).toBe(false)
		expect(() => beralih("dibayar", "kedaluwarsa")).toThrow(/tidak boleh beralih/)
	})

	it("pesanan selesai kebal terhadap notifikasi apa pun", () => {
		const semua: StatusPesanan[] = [
			"menunggu", "dibayar", "gagal", "kedaluwarsa", "dibatalkan",
		]
		for (const ke of semua) {
			expect(bolehBeralih("selesai", ke)).toBe(false)
		}
	})

	it("pesanan kedaluwarsa tidak bisa dihidupkan kembali", () => {
		expect(() => beralih("kedaluwarsa", "dibayar")).toThrow()
	})

	/*
	 * Midtrans mengirim ulang notifikasi yang sama bila tidak menerima 200.
	 * Pengulangan harus diterima diam-diam, bukan dianggap kesalahan - kalau
	 * kita membalas error, Midtrans akan mengirim ulang lagi tanpa henti.
	 */
	it("notifikasi berulang bersifat idempoten", () => {
		expect(beralih("dibayar", "dibayar")).toBe("dibayar")
		expect(beralih("selesai", "selesai")).toBe("selesai")
		expect(beralih("kedaluwarsa", "kedaluwarsa")).toBe("kedaluwarsa")
	})

	it("status final dikenali dengan benar", () => {
		expect(sudahFinal("menunggu")).toBe(false)
		expect(sudahFinal("dibayar")).toBe(false)
		for (const s of STATUS_FINAL) expect(sudahFinal(s)).toBe(true)
	})
})

describe("pemetaan notifikasi Midtrans", () => {
	it("settlement berarti lunas", () => {
		expect(petakanStatusMidtrans({ transaction_status: "settlement" })).toBe("dibayar")
	})

	it("capture dengan fraud accept berarti lunas", () => {
		expect(
			petakanStatusMidtrans({ transaction_status: "capture", fraud_status: "accept" }),
		).toBe("dibayar")
	})

	/*
	 * Jebakan utama Midtrans: "capture" terdengar seperti berhasil, tetapi
	 * dengan fraud_status "challenge" dana belum tentu cair. Memperlakukannya
	 * sebagai lunas berarti membuka akses berbayar atas uang yang mungkin tidak
	 * pernah masuk.
	 */
	it("capture dengan fraud challenge TIDAK dianggap lunas", () => {
		expect(
			petakanStatusMidtrans({ transaction_status: "capture", fraud_status: "challenge" }),
		).toBeNull()
	})

	it("capture tanpa fraud_status tidak dianggap lunas", () => {
		expect(petakanStatusMidtrans({ transaction_status: "capture" })).toBeNull()
	})

	it("memetakan status kegagalan", () => {
		expect(petakanStatusMidtrans({ transaction_status: "deny" })).toBe("gagal")
		expect(petakanStatusMidtrans({ transaction_status: "cancel" })).toBe("dibatalkan")
		expect(petakanStatusMidtrans({ transaction_status: "expire" })).toBe("kedaluwarsa")
		expect(petakanStatusMidtrans({ transaction_status: "pending" })).toBe("menunggu")
	})

	it("refund dan status asing diserahkan ke manusia", () => {
		expect(petakanStatusMidtrans({ transaction_status: "refund" })).toBeNull()
		expect(petakanStatusMidtrans({ transaction_status: "chargeback" })).toBeNull()
		expect(petakanStatusMidtrans({ transaction_status: "entah" })).toBeNull()
	})
})
