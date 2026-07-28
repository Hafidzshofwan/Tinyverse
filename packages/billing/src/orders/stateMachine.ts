import { BillingError } from "../shared"
import type { StatusPesanan } from "./types"

/**
 * Peralihan status yang diizinkan.
 *
 * WHY sebuah mesin status, bukan sekadar menimpa nilai status:
 *
 * Notifikasi dari gateway pembayaran tiba lewat jaringan publik, dan jaringan
 * tidak menjamin urutan. Notifikasi "kedaluwarsa" yang dikirim lebih dulu bisa
 * saja tiba SETELAH notifikasi "lunas" karena satu di antaranya sempat dicoba
 * ulang. Bila status ditimpa begitu saja, pesanan yang sudah dibayar dan sudah
 * membuka akses akan berubah menjadi kedaluwarsa, dan akses pelanggan tertutup
 * tanpa sebab yang terlihat.
 *
 * Tabel ini menjadikan hal itu mustahil: status final tidak menerima peralihan
 * apa pun, sehingga notifikasi yang terlambat ditolak dengan sendirinya.
 */
const PERALIHAN: Record<StatusPesanan, readonly StatusPesanan[]> = {
	menunggu: ["dibayar", "gagal", "kedaluwarsa", "dibatalkan"],
	/* Dari "dibayar" hanya boleh maju ke "selesai". Dana yang sudah masuk tidak
	   boleh dianulir oleh notifikasi susulan; pengembalian dana adalah proses
	   terpisah yang tidak dijalankan lewat jalur ini. */
	dibayar: ["selesai"],
	selesai: [],
	gagal: [],
	kedaluwarsa: [],
	dibatalkan: [],
}

export function bolehBeralih(dari: StatusPesanan, ke: StatusPesanan): boolean {
	return PERALIHAN[dari].includes(ke)
}

/**
 * Peralihan ke status yang sama dianggap sah dan tidak mengubah apa pun.
 *
 * WHY: gateway MENGIRIM ULANG notifikasi yang sama bila tidak menerima balasan
 * 200 tepat waktu. Menganggap pengulangan sebagai kesalahan akan membuat kita
 * membalas 500, yang justru memicu pengiriman ulang berikutnya - lingkaran
 * yang tidak pernah selesai.
 */
export function beralih(dari: StatusPesanan, ke: StatusPesanan): StatusPesanan {
	if (dari === ke) return dari
	if (!bolehBeralih(dari, ke)) {
		throw new BillingError(
			"peralihan_terlarang",
			'Pesanan tidak boleh beralih dari "' + dari + '" ke "' + ke + '".',
		)
	}
	return ke
}
