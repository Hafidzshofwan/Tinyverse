import type { Langganan } from "@tinyverse/billing"
import type { Id } from "../shared/types"

/**
 * Port akses langganan. Satu akun memiliki paling banyak satu langganan,
 * sehingga accountId sekaligus menjadi id dokumennya.
 *
 * Sengaja TIDAK ada metode `setStatus` atau sejenisnya. Status langganan tidak
 * pernah disimpan - ia dihitung dari periodeBerakhir oleh @tinyverse/billing.
 * Menyediakan metode untuk menulis status akan mengundang orang memakainya,
 * dan sejak itu ada dua sumber kebenaran yang pasti akan berselisih.
 */
export type SubscriptionRepository = {
	/** Langganan sebuah akun; null bila akun belum pernah membeli. */
	get(accountId: Id): Promise<Langganan | null>
	/** Simpan/perbarui langganan (upsert). */
	save(langganan: Langganan): Promise<void>
	/**
	 * Terapkan satu pembelian TEPAT SEKALI, apa pun yang terjadi.
	 *
	 * WHY metode ini ada dan get()+save() tidak cukup:
	 * Memperpanjang masa aktif berarti membaca langganan, memutuskan, lalu
	 * menulis. Bila ketiganya operasi terpisah, dua pemroses yang berjalan
	 * nyaris bersamaan atas satu pesanan - misalnya notifikasi kiriman ulang
	 * dari gateway dan putaran rekonsiliasi terjadwal - bisa sama-sama membaca
	 * langganan yang belum mencatat pesanan itu, lalu sama-sama menambah masa
	 * aktif. Pelanggan membayar sekali dan menerima dua kali. Penulisan
	 * bersyarat pada pesanan tidak menutup celah ini, karena pesanan sudah
	 * berstatus "dibayar" pada kedua pemroses.
	 *
	 * Adapter WAJIB menjalankan baca-periksa-tulis sebagai satu operasi atomik.
	 *
	 * @param args.orderId pesanan yang sedang diterapkan. Bila langganan sudah
	 *   mencatatnya sebagai `lastOrderId`, penerapan dilewati.
	 * @param args.hitung menerima langganan saat ini (null bila belum pernah
	 *   ada) dan mengembalikan langganan sesudah pembelian. Fungsi ini HARUS
	 *   murni dan sinkron: transaksi dapat diulang oleh basis data, sehingga ia
	 *   bisa dipanggil lebih dari sekali.
	 * @returns `diterapkan: false` bila pembelian ini sudah pernah diterapkan;
	 *   `langganan` selalu berisi keadaan terakhir yang sah.
	 */
	terapkanSekaliSaja(args: {
		accountId: Id
		orderId: string
		hitung: (langganan: Langganan | null) => Langganan
	}): Promise<{ diterapkan: boolean; langganan: Langganan }>
}
