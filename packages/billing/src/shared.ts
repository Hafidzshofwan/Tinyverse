/**
 * Tipe dasar bersama untuk domain penagihan.
 *
 * Seluruh paket ini MURNI: tidak ada Firebase, tidak ada Midtrans, tidak ada
 * pembacaan jam sistem. Setiap fungsi yang butuh "sekarang" menerimanya sebagai
 * argumen. Itulah yang membuat aturan uang bisa diuji dengan pasti - termasuk
 * kasus yang mustahil dipancing di dunia nyata, seperti pembayaran yang tiba
 * setelah pesanan kedaluwarsa.
 */

/** Waktu dalam ISO-8601 UTC, mengikuti konvensi data-access. */
export type IsoDateTime = string

/**
 * Uang disimpan sebagai BILANGAN BULAT rupiah.
 *
 * WHY bukan number pecahan: 0.1 + 0.2 tidak sama dengan 0.3 pada bilangan
 * pecahan biner. Untuk nominal yang ditagihkan ke orang, galat sekecil apa pun
 * tidak dapat diterima. Rupiah tidak punya satuan di bawah 1, jadi bilangan
 * bulat sudah memadai tanpa perlu satuan minor seperti sen.
 */
export type Rupiah = number

export class BillingError extends Error {
	readonly code: string
	constructor(code: string, message: string) {
		super(message)
		this.name = "BillingError"
		this.code = code
	}
}

/** Ubah ISO-8601 menjadi milidetik, menolak nilai yang tidak masuk akal. */
export function keMilidetik(waktu: IsoDateTime): number {
	const ms = Date.parse(waktu)
	if (Number.isNaN(ms)) {
		throw new BillingError("waktu_tidak_sah", 'Waktu "' + waktu + '" bukan ISO-8601 yang sah.')
	}
	return ms
}

const SEHARI_MS = 86400000

/**
 * Tambahkan sejumlah hari ke sebuah waktu.
 *
 * WHY memakai penjumlahan milidetik, bukan setDate():
 * Seluruh perhitungan berjalan dalam UTC. Bila memakai kalender lokal, satu
 * langganan 30 hari bisa berubah panjang saat melewati pergantian waktu musim
 * panas di zona tertentu. Pelanggan yang membayar 30 hari harus menerima 30 x
 * 24 jam, di mana pun ia berada.
 */
export function tambahHari(waktu: IsoDateTime, hari: number): IsoDateTime {
	if (!Number.isInteger(hari) || hari < 0) {
		throw new BillingError("durasi_tidak_sah", "Durasi hari harus bilangan bulat >= 0.")
	}
	return new Date(keMilidetik(waktu) + hari * SEHARI_MS).toISOString()
}

/** Bandingkan dua waktu: true bila `a` benar-benar sebelum `b`. */
export function sebelum(a: IsoDateTime, b: IsoDateTime): boolean {
	return keMilidetik(a) < keMilidetik(b)
}

/** Ambil waktu yang lebih akhir di antara dua nilai. */
export function palingAkhir(a: IsoDateTime, b: IsoDateTime): IsoDateTime {
	return keMilidetik(a) >= keMilidetik(b) ? a : b
}

/** Sisa hari penuh menuju `batas`; 0 bila sudah lewat. */
export function sisaHari(sekarang: IsoDateTime, batas: IsoDateTime): number {
	const selisih = keMilidetik(batas) - keMilidetik(sekarang)
	if (selisih <= 0) return 0
	return Math.ceil(selisih / SEHARI_MS)
}
