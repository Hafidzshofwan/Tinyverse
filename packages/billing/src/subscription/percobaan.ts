import { tambahHari, type IsoDateTime } from "../shared"
import type { Langganan } from "./types"

/**
 * Masa percobaan gratis.
 *
 * Bentuknya SENGAJA sama dengan langganan biasa: sebuah dokumen langganan
 * dengan tanggal berakhir. Tidak ada field baru, tidak ada status baru, dan
 * `hitungEntitlement` tidak diubah satu baris pun.
 *
 * WHY begitu: gerbang akses berbayar sudah terbukti benar dan sudah teruji.
 * Menambah jenis akses kedua yang dihitung dengan cara berbeda berarti dua
 * jawaban untuk satu pertanyaan "boleh masuk atau tidak", dan dua jawaban itu
 * pasti akan berbeda pada kasus pinggir - berupa pelanggan membayar yang
 * tertolak, atau akses gratis yang tidak pernah tertutup. Karena itu masa
 * percobaan hanyalah langganan 2 hari yang tidak dibayar.
 */

/**
 * Penanda paket untuk langganan hasil masa percobaan.
 *
 * Id ini TIDAK ada di katalog paket, sehingga ia tidak bisa dibeli. Nilainya
 * hanya informasi: yang menentukan akses tetap `periodeBerakhir`.
 */
export const PERCOBAAN_PLAN_ID = "percobaan"

/** Lama masa percobaan dalam hari. */
export const HARI_PERCOBAAN = 2

/**
 * Susun langganan masa percobaan untuk sebuah akun.
 *
 * Fungsi ini murni: waktu dititipkan dari luar, tidak ada Firestore, tidak ada
 * jam sistem. `lastOrderId` dibiarkan null karena tidak ada uang yang masuk -
 * dan null itulah yang kelak membedakan akses gratis dari akses berbayar bila
 * suatu saat perlu dibedakan.
 */
export function buatLanggananPercobaan(
	accountId: string,
	sekarang: IsoDateTime,
): Langganan {
	return {
		accountId,
		planId: PERCOBAAN_PLAN_ID,
		periodeMulai: sekarang,
		periodeBerakhir: tambahHari(sekarang, HARI_PERCOBAAN),
		lastOrderId: null,
		updatedAt: sekarang,
	}
}

/**
 * Apakah akun ini masih berhak mendapat masa percobaan?
 *
 * Syaratnya satu: akun belum punya catatan langganan sama sekali.
 *
 * WHY cukup satu syarat, tanpa penanda terpisah: dokumen langganan tidak pernah
 * dihapus. Setelah masa percobaan berakhir dokumen itu tetap ada (dengan
 * tanggal lampau), dan setelah pembelian ia ditimpa tetapi tetap ada. Jadi
 * keberadaan dokumen itu sendiri sudah menjadi bukti permanen bahwa akun ini
 * pernah dilayani. Menambah field penanda kedua hanya akan menciptakan dua
 * sumber kebenaran yang bisa berselisih.
 *
 * Konsekuensi yang perlu diketahui: akun dengan dokumen langganan KOSONG
 * (semua tanggal null) juga tidak mendapat masa percobaan. Itu memang
 * diinginkan - dokumen kosong hanya lahir dari campur tangan manual, dan
 * campur tangan manual tidak boleh diam-diam membuka akses gratis baru.
 */
export function bolehDapatPercobaan(langganan: Langganan | null): boolean {
	return langganan === null
}
