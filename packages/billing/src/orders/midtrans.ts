import type { StatusPesanan } from "./types"

/**
 * Terjemahan notifikasi Midtrans ke status internal.
 *
 * Paket ini tetap murni: yang diterjemahkan hanya nilai teks, tanpa jaringan
 * dan tanpa kriptografi. Pemeriksaan tanda tangan berlangsung di lapisan rute
 * API, sebelum fungsi ini dipanggil.
 */
export type NotifikasiMidtrans = {
	transaction_status: string
	fraud_status?: string
}

/**
 * Jebakan yang paling sering terlewat ada pada pasangan
 * `capture` + `fraud_status: "challenge"`.
 *
 * Statusnya terbaca seperti keberhasilan, padahal artinya transaksi ditahan
 * untuk ditinjau manual dan dananya BELUM tentu cair. Memperlakukannya sebagai
 * lunas berarti memberi akses berbayar atas pembayaran yang mungkin akhirnya
 * ditolak. Karena itu ia dipetakan ke null - biarkan pesanan tetap menunggu
 * sampai Midtrans mengirim kabar berikutnya.
 *
 * Mengembalikan null berarti: "belum ada keputusan, jangan ubah apa pun".
 */
export function petakanStatusMidtrans(n: NotifikasiMidtrans): StatusPesanan | null {
	const s = n.transaction_status

	if (s === "capture") {
		if (n.fraud_status === "accept") return "dibayar"
		return null
	}

	if (s === "settlement") return "dibayar"
	if (s === "pending") return "menunggu"
	if (s === "deny") return "gagal"
	if (s === "cancel") return "dibatalkan"
	if (s === "expire") return "kedaluwarsa"

	/* refund, partial_refund, chargeback, dan status tak dikenal lainnya
	   sengaja tidak ditangani otomatis - semuanya perlu keputusan manusia. */
	return null
}
