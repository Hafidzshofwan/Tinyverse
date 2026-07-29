/**
 * Rekonsiliasi pesanan tertinggal.
 *
 * Webhook menunggu dikabari; berkas ini yang bertanya lebih dulu.
 *
 * WHY ini ada: seluruh pembukaan akses bergantung pada satu notifikasi yang
 * datang lewat jaringan publik. Bila notifikasi itu hilang - server sedang
 * tumbang, deploy sedang berjalan, jaringan Midtrans tersendat - tidak ada apa
 * pun yang menyusul. Pelanggan sudah membayar, aksesnya tidak terbuka, dan
 * satu-satunya cara kita mengetahuinya adalah bila ia mengeluh.
 *
 * ATURAN PALING PENTING DI BERKAS INI:
 * Rekonsiliasi TIDAK PERNAH mengambil keputusan uang sendiri. Setiap pesanan
 * dialirkan ke prosesNotifikasiMidtrans - fungsi yang sama persis yang dipakai
 * webhook. Dengan begitu seluruh penjagaan yang sudah diuji (penulisan
 * bersyarat, pemeriksaan lastOrderId, pencocokan nominal, mesin status) berlaku
 * tanpa perlu ditulis ulang, dan mustahil ada dua kebenaran yang berbeda.
 */
import type {
  OrderRepository,
  SubscriptionRepository,
} from "@tinyverse/data-access";

import { prosesNotifikasiMidtrans } from "./prosesNotifikasi";

/**
 * Jeda sebelum sebuah pesanan yang lewat tempo boleh diusik.
 *
 * Jam kita dan jam Midtrans tidak pernah persis sama, dan pembayaran bisa saja
 * sedang diselesaikan tepat saat batas waktu terlampaui. Menunggu setengah jam
 * lebih lama tidak merugikan siapa pun; terburu-buru bisa merugikan.
 */
export const JEDA_AMAN_MENIT = 30;

/** Batas pesanan per putaran, supaya satu panggilan selalu selesai cepat. */
export const BATAS_PER_PUTARAN = 25;

/** Jawaban Get Status yang dipakai; sengaja hanya field yang diperlukan. */
export type StatusResmi = {
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
};

export type KodeRekonsiliasi =
  | "diterapkan"
  | "status_diperbarui"
  | "ditandai_kedaluwarsa"
  | "tidak_berubah"
  | "perlu_ditinjau"
  | "gagal";

export type BarisRekonsiliasi = {
  orderId: string;
  kode: KodeRekonsiliasi;
  pesan: string;
  transactionStatus: string;
};

export type RingkasanRekonsiliasi = {
  diperiksa: number;
  diterapkan: number;
  statusDiperbarui: number;
  ditandaiKedaluwarsa: number;
  tidakBerubah: number;
  perluDitinjau: number;
  gagal: number;
  baris: BarisRekonsiliasi[];
};

/** Waktu batas pemeriksaan: sekarang dikurangi jeda aman. */
export function batasWaktuAman(sekarang: string): string {
  const ms = new Date(sekarang).getTime() - JEDA_AMAN_MENIT * 60 * 1000;
  return new Date(ms).toISOString();
}

function pesanKesalahan(kesalahan: unknown): string {
  return kesalahan instanceof Error ? kesalahan.message : String(kesalahan);
}

/**
 * Memeriksa pesanan tertinggal dan menyusulkan yang seharusnya sudah terjadi.
 *
 * Seluruh kebergantungan masuk lewat argumen - termasuk jam dan cara bertanya
 * ke Midtrans - supaya seluruh skenario dapat diuji tanpa jaringan sama sekali.
 */
export async function rekonsiliasiPesanan(args: {
  sekarang: string;
  orderRepo: OrderRepository;
  subRepo: SubscriptionRepository;
  ambilStatus: (orderId: string) => Promise<StatusResmi | null>;
  batas?: number;
  catat?: (baris: BarisRekonsiliasi) => Promise<void>;
}): Promise<RingkasanRekonsiliasi> {
  const batas = args.batas ?? BATAS_PER_PUTARAN;

  const daftar = await args.orderRepo.listPerluRekonsiliasi({
    sampai: batasWaktuAman(args.sekarang),
    batas,
  });

  const ringkasan: RingkasanRekonsiliasi = {
    diperiksa: 0,
    diterapkan: 0,
    statusDiperbarui: 0,
    ditandaiKedaluwarsa: 0,
    tidakBerubah: 0,
    perluDitinjau: 0,
    gagal: 0,
    baris: [],
  };

  async function catat(
    orderId: string,
    kode: KodeRekonsiliasi,
    pesan: string,
    transactionStatus: string,
  ): Promise<void> {
    const baris: BarisRekonsiliasi = { orderId, kode, pesan, transactionStatus };
    ringkasan.baris.push(baris);

    if (kode === "diterapkan") ringkasan.diterapkan += 1;
    else if (kode === "status_diperbarui") ringkasan.statusDiperbarui += 1;
    else if (kode === "ditandai_kedaluwarsa") ringkasan.ditandaiKedaluwarsa += 1;
    else if (kode === "tidak_berubah") ringkasan.tidakBerubah += 1;
    else if (kode === "perlu_ditinjau") ringkasan.perluDitinjau += 1;
    else ringkasan.gagal += 1;

    if (!args.catat) return;
    try {
      await args.catat(baris);
    } catch {
      /* Kegagalan mencatat tidak boleh menggagalkan pemulihan uang. Catatan
         adalah jejak, bukan syarat. */
    }
  }

  for (const pesanan of daftar) {
    ringkasan.diperiksa += 1;

    let resmi: StatusResmi | null;
    try {
      resmi = await args.ambilStatus(pesanan.id);
    } catch (kesalahan) {
      /* Satu pesanan yang gagal dibaca tidak boleh menghentikan sisanya.
         Putaran berikutnya akan mencobanya lagi. */
      await catat(
        pesanan.id,
        "gagal",
        "Gagal membaca status dari Midtrans: " + pesanKesalahan(kesalahan),
        "",
      );
      continue;
    }

    if (!resmi) {
      /*
       * Midtrans tidak mengenal transaksinya. Untuk pesanan yang masih
       * menunggu, artinya pembeli tidak pernah sampai memilih cara membayar,
       * dan pesanan itu boleh dirapikan.
       *
       * Perhatikan bahwa keputusan ini TIDAK pernah diambil hanya karena jam
       * kita sudah lewat. Selama Midtrans masih menjawab "pending", pesanan
       * dibiarkan menunggu - Virtual Account dan QRIS lazim dibayar belakangan,
       * dan menutupnya lebih dulu akan membuat pembayaran yang sungguhan masuk
       * ditolak oleh mesin status kita sendiri.
       */
      if (pesanan.status === "menunggu") {
        const berhasil = await args.orderRepo.updateStatus({
          id: pesanan.id,
          dariStatus: "menunggu",
          keStatus: "kedaluwarsa",
          padaWaktu: args.sekarang,
        });
        await catat(
          pesanan.id,
          berhasil ? "ditandai_kedaluwarsa" : "tidak_berubah",
          berhasil
            ? "Tidak ada transaksi di Midtrans sampai lewat tempo."
            : "Status sudah berubah lebih dulu oleh proses lain.",
          "",
        );
      } else {
        /* Pesanan berstatus dibayar tetapi transaksinya tidak dikenal Midtrans.
           Janggal, dan bukan urusan mesin. */
        await catat(
          pesanan.id,
          "perlu_ditinjau",
          "Pesanan berstatus " + pesanan.status +
            " tetapi Midtrans tidak mengenal transaksinya.",
          "",
        );
      }
      continue;
    }

    try {
      const hasil = await prosesNotifikasiMidtrans({
        notifikasi: {
          order_id: pesanan.id,
          status_code: resmi.status_code,
          gross_amount: resmi.gross_amount,
          transaction_status: resmi.transaction_status,
          ...(resmi.fraud_status ? { fraud_status: resmi.fraud_status } : {}),
        },
        sekarang: args.sekarang,
        orderRepo: args.orderRepo,
        subRepo: args.subRepo,
      });

      const kode: KodeRekonsiliasi =
        hasil.kode === "diterapkan"
          ? "diterapkan"
          : hasil.kode === "status_diperbarui"
            ? "status_diperbarui"
            : hasil.kode === "diabaikan"
              ? "tidak_berubah"
              : "perlu_ditinjau";

      await catat(pesanan.id, kode, hasil.pesan, resmi.transaction_status);
    } catch (kesalahan) {
      await catat(
        pesanan.id,
        "gagal",
        "Gagal memproses: " + pesanKesalahan(kesalahan),
        resmi.transaction_status,
      );
    }
  }

  return ringkasan;
}
