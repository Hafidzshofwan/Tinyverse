import "server-only";
import type { Plan } from "@tinyverse/billing";

/**
 * Katalog paket SEMENTARA.
 *
 * PERHATIAN: nama, durasi, dan harga di bawah ini masih karangan untuk
 * keperluan pengujian. Ganti dengan angka sungguhan sebelum pembayaran
 * dinyalakan di Fase 5.
 *
 * WHY masih di kode, belum di Firestore: selama harga belum final, menyimpannya
 * di basis data hanya menambah satu tempat lagi yang harus disunting setiap
 * kali berubah. Bentuk datanya sudah sama persis dengan dokumen `plans` nanti,
 * jadi pemindahannya kelak tidak mengubah satu pun pemakainya.
 */
export const KATALOG_PLAN: readonly Plan[] = [
  { id: "bulanan", nama: "Bulanan", durasiHari: 30, hargaRupiah: 49000, aktif: true },
  { id: "tahunan", nama: "Tahunan", durasiHari: 365, hargaRupiah: 490000, aktif: true },
];

export function cariPlan(planId: string): Plan | null {
  return KATALOG_PLAN.find((p) => p.id === planId) ?? null;
}
