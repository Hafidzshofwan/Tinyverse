import "server-only";
import type { Plan } from "@tinyverse/billing";

/**
 * Katalog paket langganan.
 *
 * Harga di bawah ini sudah ditetapkan pemilik aplikasi. Model penagihannya
 * SEKALI BAYAR: bila tidak diperpanjang, tidak ada tagihan berikutnya dan tidak
 * ada penarikan otomatis.
 *
 * WHY masih di kode, belum di Firestore: satu-satunya pemakainya adalah server,
 * dan menyimpannya di basis data akan menambah satu tempat lagi yang harus
 * disunting setiap kali harga berubah. Bentuk datanya sudah sama persis dengan
 * dokumen `plans` nanti, jadi pemindahannya kelak tidak mengubah pemakainya.
 *
 * PENTING: `id` adalah kunci abadi. Ia tersimpan di dokumen langganan dan
 * pesanan yang sudah terlanjur dibuat, jadi jangan pernah mengubah atau memakai
 * ulang id lama untuk paket yang berbeda. Menambah paket baru selalu aman;
 * memensiunkan paket lama cukup dengan `aktif: false` agar riwayat tetap
 * terbaca.
 *
 * URUTAN array ini menentukan urutan kartu di halaman /langganan, karena halaman
 * itu me-render KATALOG_PLAN secara langsung. Dijaga dari termurah ke termahal.
 *
 * CATATAN tentang masa percobaan: PERCOBAAN_PLAN_ID ("percobaan") dari
 * @tinyverse/billing SENGAJA tidak ada di katalog ini. Katalog adalah daftar
 * barang yang dijual, dan masa percobaan tidak dijual. Akibatnya
 * cariPlan("percobaan") mengembalikan null, dan itu benar: tidak ada satu pun
 * jalur pembayaran yang boleh menerima "percobaan" sebagai paket yang dibeli.
 */
export const KATALOG_PLAN: readonly Plan[] = [
  { id: "bulanan", nama: "1 Bulan", durasiHari: 30, hargaRupiah: 15000, aktif: true },
  { id: "kuartalan", nama: "3 Bulan", durasiHari: 90, hargaRupiah: 35000, aktif: true },
  { id: "semesteran", nama: "6 Bulan", durasiHari: 180, hargaRupiah: 60000, aktif: true },
  { id: "tahunan", nama: "1 Tahun", durasiHari: 365, hargaRupiah: 100000, aktif: true },
];

export function cariPlan(planId: string): Plan | null {
  return KATALOG_PLAN.find((p) => p.id === planId) ?? null;
}
