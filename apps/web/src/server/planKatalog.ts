import "server-only";
import type { Plan } from "@tinyverse/billing";

import {
  PROMO_LAUNCHING,
  hargaSetelahDiskon,
  promoSedangBerlaku,
} from "./promoLaunching";

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
  { id: "kuartalan", nama: "3 Bulan", durasiHari: 90, hargaRupiah: 30000, aktif: true },
  { id: "semesteran", nama: "6 Bulan", durasiHari: 180, hargaRupiah: 50000, aktif: true },
  { id: "tahunan", nama: "1 Tahun", durasiHari: 365, hargaRupiah: 80000, aktif: true },
];

export function cariPlan(planId: string, padaWaktu: Date = new Date()): Plan | null {
  const plan = KATALOG_PLAN.find((p) => p.id === planId) ?? null;
  if (!plan) return null;
  if (!promoSedangBerlaku(padaWaktu)) return plan;

  /* Harga yang dikembalikan di sini adalah harga yang SUNGGUH ditagihkan --
     dipakai langsung oleh /api/checkout. Diskon promo peluncuran otomatis
     berhenti berlaku begitu PROMO_LAUNCHING.berakhir terlewati, tanpa perlu
     mengubah baris ini. */
  return { ...plan, hargaRupiah: hargaSetelahDiskon(plan.hargaRupiah) };
}

/**
 * Satu baris katalog untuk KEBUTUHAN TAMPILAN: berisi harga yang berlaku
 * sekarang (`hargaRupiah`, sudah didiskon bila promo aktif) sekaligus harga
 * normal (`hargaAsli`) supaya halaman bisa menampilkan coretan harga lama.
 */
export type PaketTampil = Plan & {
  /** Harga normal sebelum promo, untuk ditampilkan tercoret saat promo aktif. */
  hargaAsli: number;
  /** Persentase diskon yang sedang berlaku pada baris ini (0 bila tidak ada promo). */
  diskonPersen: number;
  /** True bila baris ini sedang memakai harga promo. */
  promoAktif: boolean;
};

/**
 * Seluruh katalog (termasuk paket tidak aktif) dengan harga promo peluncuran
 * sudah diterapkan bila sedang berlaku. Dipakai oleh halaman /langganan dan
 * gerbang berbayar supaya harga yang ditampilkan selalu konsisten dengan yang
 * sungguh ditagihkan oleh /api/checkout.
 */
export function katalogTampil(padaWaktu: Date = new Date()): readonly PaketTampil[] {
  const promoAktif = promoSedangBerlaku(padaWaktu);
  return KATALOG_PLAN.map((p) => ({
    ...p,
    hargaRupiah: promoAktif ? hargaSetelahDiskon(p.hargaRupiah) : p.hargaRupiah,
    hargaAsli: p.hargaRupiah,
    diskonPersen: promoAktif ? PROMO_LAUNCHING.diskonPersen : 0,
    promoAktif,
  }));
}
