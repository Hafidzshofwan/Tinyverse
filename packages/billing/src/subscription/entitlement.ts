import { sebelum, sisaHari, tambahHari, type IsoDateTime } from "../shared"
import type { Entitlement, Langganan } from "./types"

/**
 * Masa tenggang setelah langganan berakhir.
 *
 * Dipasang 0 karena model sekali bayar tidak punya alasan untuk memberi
 * tenggang: tidak ada penarikan dana yang bisa gagal karena masalah teknis
 * bank. Nilainya tetap dijadikan parameter agar bisa dipakai sebagai alat
 * pemulihan bila suatu saat ada gangguan pembayaran di sisi kita, tanpa perlu
 * mengubah logika.
 */
export const TENGGANG_HARI_BAWAAN = 0

/**
 * Tentukan apakah sebuah akun berhak mengakses fitur berbayar.
 *
 * Ini adalah SATU-SATUNYA tempat pertanyaan itu dijawab di seluruh sistem.
 * Bila kelak muncul pemeriksaan hak akses kedua di tempat lain, keduanya pasti
 * akan berbeda perilaku pada kasus pinggir, dan perbedaan itu akan berupa
 * pelanggan membayar yang tertolak atau pelanggan kedaluwarsa yang lolos.
 */
export function hitungEntitlement(
	langganan: Langganan | null,
	sekarang: IsoDateTime,
	tenggangHari: number = TENGGANG_HARI_BAWAAN,
): Entitlement {
	if (!langganan || !langganan.periodeBerakhir) {
		return { status: "belum", bolehAkses: false, berakhirPada: null, sisaHari: 0 }
	}

	const batas = tenggangHari > 0
		? tambahHari(langganan.periodeBerakhir, tenggangHari)
		: langganan.periodeBerakhir

	const masihBerlaku = sebelum(sekarang, batas)

	return {
		status: masihBerlaku ? "aktif" : "kedaluwarsa",
		bolehAkses: masihBerlaku,
		berakhirPada: langganan.periodeBerakhir,
		sisaHari: sisaHari(sekarang, langganan.periodeBerakhir),
	}
}
