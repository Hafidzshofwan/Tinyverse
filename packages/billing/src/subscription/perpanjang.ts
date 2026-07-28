import { palingAkhir, tambahHari, type IsoDateTime } from "../shared"
import type { Plan } from "../plans/types"
import type { Langganan } from "./types"

/**
 * Terapkan pembelian yang sudah LUNAS ke sebuah langganan.
 *
 * Aturan intinya ada pada satu baris: titik awal adalah yang mana pun yang
 * lebih akhir antara "sekarang" dan "akhir periode berjalan".
 *
 * Dua perilaku yang lahir dari satu aturan itu:
 *
 * 1. Pelanggan yang memperpanjang LEBIH AWAL tidak kehilangan sisa harinya.
 *    Membeli 30 hari saat masih tersisa 10 hari menghasilkan 40 hari. Bila
 *    titik awalnya selalu "sekarang", pelanggan yang tertib justru dihukum -
 *    dan mereka akan menyadarinya.
 *
 * 2. Pelanggan yang sudah kedaluwarsa mulai dari hari ini, bukan dari tanggal
 *    berakhir yang sudah lewat. Tanpa ini, seseorang yang kembali setelah
 *    enam bulan akan membeli 30 hari yang seluruhnya sudah habis di masa lalu.
 *
 * Fungsi ini murni: ia mengembalikan langganan baru dan tidak mengubah apa pun.
 */
export function terapkanPembelian(args: {
	langganan: Langganan
	plan: Plan
	orderId: string
	sekarang: IsoDateTime
}): Langganan {
	const { langganan, plan, orderId, sekarang } = args

	const mulai = langganan.periodeBerakhir
		? palingAkhir(sekarang, langganan.periodeBerakhir)
		: sekarang

	return {
		...langganan,
		planId: plan.id,
		/* periodeMulai menandai awal masa berlangganan pertama dan tidak
		   ditulis ulang, agar riwayat pelanggan lama tetap terbaca. */
		periodeMulai: langganan.periodeMulai ?? sekarang,
		periodeBerakhir: tambahHari(mulai, plan.durasiHari),
		lastOrderId: orderId,
		updatedAt: sekarang,
	}
}
