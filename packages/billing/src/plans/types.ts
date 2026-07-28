import type { Rupiah } from "../shared"

/**
 * Paket langganan.
 *
 * Model penagihan TinyVerse adalah SEKALI BAYAR: pelanggan membeli sejumlah
 * hari akses, dan bila tidak membeli lagi, akses berhenti dengan sendirinya.
 * Tidak ada tagihan berulang, tidak ada kartu yang disimpan.
 *
 * Konsekuensi desain: paket dijelaskan oleh `durasiHari`, bukan oleh "siklus
 * penagihan". Perbedaan ini terlihat sepele, tetapi menghapus seluruh kelas
 * kerumitan - tidak perlu tanggal tagih berikutnya, tidak perlu pembatalan,
 * tidak perlu penanganan kartu yang ditolak, tidak perlu prorata.
 */
export type Plan = {
	id: string
	nama: string
	durasiHari: number
	hargaRupiah: Rupiah
	/** Paket lama tetap disimpan agar pesanan lampau tetap bisa dibaca. */
	aktif: boolean
}

/**
 * Harga dibekukan ke dalam pesanan saat pesanan dibuat.
 *
 * WHY: bila harga hanya dirujuk lewat planId, menaikkan harga besok akan ikut
 * mengubah tampilan pesanan kemarin - dan itu menyesatkan pelanggan sekaligus
 * merusak pembukuan. Angka yang pernah ditagihkan tidak boleh berubah.
 */
export type SnapshotHarga = {
	planId: string
	nama: string
	durasiHari: number
	hargaRupiah: Rupiah
}

export function bekukanHarga(plan: Plan): SnapshotHarga {
	return {
		planId: plan.id,
		nama: plan.nama,
		durasiHari: plan.durasiHari,
		hargaRupiah: plan.hargaRupiah,
	}
}
