/**
 * Ringkasan pesanan untuk ditampilkan kepada pelanggan.
 *
 * WHY bukan Pesanan mentah: field seperti createdByUid dan midtransOrderId
 * tidak perlu -- dan tidak boleh -- terbit ke peramban. Bentuk ini sengaja
 * dipersempit ke apa yang benar-benar ditampilkan, dan dipakai bersama oleh
 * halaman langganan (render di server) maupun /api/me/pesanan (JSON).
 */
import "server-only";

import type { Pesanan, StatusPesanan } from "@tinyverse/billing";

import { FirestoreOrderRepository } from "@/server/ordersAdmin";

export type RingkasanPesanan = {
  id: string;
  status: StatusPesanan;
  labelStatus: string;
  nama: string;
  hargaRupiah: number;
  durasiHari: number;
  createdAt: string;
  expiresAt: string;
};

export const LABEL_STATUS_PESANAN: Record<StatusPesanan, string> = {
  menunggu: "Menunggu pembayaran",
  dibayar: "Pembayaran diterima",
  selesai: "Berhasil",
  gagal: "Gagal",
  kedaluwarsa: "Kedaluwarsa",
  dibatalkan: "Dibatalkan",
};

function ringkas(p: Pesanan): RingkasanPesanan {
  return {
    id: p.id,
    status: p.status,
    labelStatus: LABEL_STATUS_PESANAN[p.status],
    nama: p.snapshotHarga.nama,
    hargaRupiah: p.snapshotHarga.hargaRupiah,
    durasiHari: p.snapshotHarga.durasiHari,
    createdAt: p.createdAt,
    expiresAt: p.expiresAt,
  };
}

/** Riwayat pesanan milik satu akun, terbaru lebih dulu. */
export async function riwayatPesanan(accountId: string): Promise<RingkasanPesanan[]> {
  const repo = new FirestoreOrderRepository();
  const daftar = await repo.listByAccount(accountId);
  return daftar.map(ringkas);
}
