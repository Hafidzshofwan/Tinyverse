import type { Pesanan, StatusPesanan } from "@tinyverse/billing"
import type { Id } from "../shared/types"

/**
 * Port akses pesanan.
 *
 * WHY ada `findByMidtransOrderId` di samping `findById`:
 * Notifikasi dari Midtrans hanya membawa `order_id` versi mereka, bukan id
 * dokumen kita. Tanpa jalur pencarian ini, penanganan webhook terpaksa
 * memindai seluruh koleksi pesanan - lambat, mahal, dan makin buruk seiring
 * bertambahnya transaksi.
 *
 * WHY `updateStatus` menerima `dariStatus`:
 * Ini adalah penulisan bersyarat. Adapter wajib menolak pembaruan bila status
 * di basis data ternyata sudah bukan `dariStatus` lagi. Dua notifikasi Midtrans
 * yang tiba nyaris bersamaan bisa sama-sama membaca status "menunggu", lalu
 * sama-sama menulis "dibayar" - dan langganan diperpanjang dua kali untuk satu
 * pembayaran. Pemeriksaan di lapisan aplikasi tidak cukup; penjagaannya harus
 * menyatu dengan operasi tulis itu sendiri.
 */
export type OrderRepository = {
	create(pesanan: Pesanan): Promise<void>
	findById(id: Id): Promise<Pesanan | null>
	findByMidtransOrderId(midtransOrderId: string): Promise<Pesanan | null>
	/** Pesanan sebuah akun, terbaru lebih dulu. */
	listByAccount(accountId: Id): Promise<Pesanan[]>
	/**
	 * Ubah status hanya bila status saat ini masih `dariStatus`.
	 * @returns true bila berhasil; false bila status sudah berubah (kalah lomba).
	 */
	updateStatus(args: {
		id: Id
		dariStatus: StatusPesanan
		keStatus: StatusPesanan
		padaWaktu: string
	}): Promise<boolean>
}
