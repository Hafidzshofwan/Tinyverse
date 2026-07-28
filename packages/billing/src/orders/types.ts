import type { IsoDateTime } from "../shared"
import type { SnapshotHarga } from "../plans/types"

/**
 * Status pesanan.
 *
 * "menunggu"    - pesanan dibuat, pembayaran belum terkonfirmasi
 * "dibayar"     - dana terkonfirmasi oleh gateway
 * "selesai"     - langganan sudah diperpanjang atas pesanan ini
 * "gagal"       - ditolak gateway atau bank
 * "kedaluwarsa" - lewat batas waktu tanpa pembayaran
 * "dibatalkan"  - dibatalkan pembeli atau operator sebelum dibayar
 *
 * WHY "dibayar" dan "selesai" dipisah:
 * Di antara keduanya ada operasi tulis ke basis data yang bisa gagal. Bila
 * keduanya digabung, sebuah pesanan yang dananya sudah masuk tetapi gagal
 * memperpanjang langganan tidak akan meninggalkan jejak apa pun - pelanggan
 * membayar, akses tidak terbuka, dan tidak ada cara mengetahuinya selain
 * laporan dari pelanggan itu sendiri. Dengan dipisah, pesanan tersebut
 * tertinggal di status "dibayar" dan dapat ditemukan otomatis.
 */
export type StatusPesanan =
	| "menunggu"
	| "dibayar"
	| "selesai"
	| "gagal"
	| "kedaluwarsa"
	| "dibatalkan"

export type Pesanan = {
	id: string
	accountId: string
	createdByUid: string
	snapshotHarga: SnapshotHarga
	status: StatusPesanan
	/** Nomor pesanan yang dikirim ke gateway; harus unik selamanya. */
	midtransOrderId: string
	createdAt: IsoDateTime
	expiresAt: IsoDateTime
	updatedAt: IsoDateTime
}

/** Status yang tidak akan pernah berubah lagi. */
export const STATUS_FINAL: readonly StatusPesanan[] = [
	"selesai",
	"gagal",
	"kedaluwarsa",
	"dibatalkan",
]

export function sudahFinal(status: StatusPesanan): boolean {
	return STATUS_FINAL.includes(status)
}
