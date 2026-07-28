import type { IsoDateTime } from "../shared"

/**
 * Status langganan yang mungkin.
 *
 * Sengaja hanya tiga. Model sekali bayar tidak mengenal "dibatalkan" (tidak
 * ada yang perlu dibatalkan bila tidak ada tagihan berulang), tidak mengenal
 * "menunggak" (tidak ada penarikan yang bisa gagal), dan tidak mengenal
 * "akan berakhir" (setiap langganan selalu akan berakhir).
 */
export type StatusLangganan = "belum" | "aktif" | "kedaluwarsa"

/**
 * Catatan langganan sebuah akun. Satu akun punya paling banyak satu.
 *
 * Perhatikan yang TIDAK ada di sini: tidak ada field `status`.
 *
 * WHY: status yang disimpan pasti akan basi. Sebuah langganan yang berakhir
 * pukul 00:00 tidak mengirim sinyal apa pun ke basis data - kolom `status`
 * akan tetap bertuliskan "aktif" sampai ada yang memperbaruinya. Bila hak
 * akses bergantung pada kolom itu, maka hak akses bergantung pada sebuah cron
 * yang berjalan tepat waktu, selamanya, tanpa pernah gagal.
 *
 * Karena itu status DIHITUNG dari `periodeBerakhir` setiap kali dibutuhkan.
 * Cron tetap berguna untuk mengirim pengingat, tetapi ia tidak pernah menjadi
 * penentu apakah seseorang masih boleh masuk.
 */
export type Langganan = {
	accountId: string
	/** Paket terakhir yang dibeli; sekadar informasi, bukan penentu akses. */
	planId: string | null
	periodeMulai: IsoDateTime | null
	periodeBerakhir: IsoDateTime | null
	lastOrderId: string | null
	updatedAt: IsoDateTime
}

/** Hasil pemeriksaan hak akses pada satu titik waktu. */
export type Entitlement = {
	status: StatusLangganan
	/** Satu-satunya field yang boleh dipakai untuk membuka atau menutup fitur. */
	bolehAkses: boolean
	berakhirPada: IsoDateTime | null
	sisaHari: number
}

/** Langganan kosong untuk akun yang belum pernah membeli. */
export function langgananKosong(accountId: string, sekarang: IsoDateTime): Langganan {
	return {
		accountId,
		planId: null,
		periodeMulai: null,
		periodeBerakhir: null,
		lastOrderId: null,
		updatedAt: sekarang,
	}
}
