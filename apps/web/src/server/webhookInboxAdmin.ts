/**
 * Jurnal mentah webhook dan catatan hasil pemrosesannya.
 *
 * WHY dua koleksi terpisah:
 * - `webhookInbox` menyimpan apa yang DIKIRIM Midtrans, apa adanya.
 * - `paymentEvents` menyimpan apa yang KITA PUTUSKAN atas kiriman itu.
 *
 * Saat sebuah pembayaran dipersengketakan, dua catatan itulah yang menjawab
 * pertanyaan "apa yang sebenarnya terjadi", tanpa perlu menebak dari log.
 *
 * Keduanya hanya catatan. Penjaga sesungguhnya terhadap pemrosesan ganda
 * adalah penulisan bersyarat pada FirestoreOrderRepository.updateStatus dan
 * pemeriksaan lastOrderId - bukan berkas ini.
 */
import "server-only";

import { KOLEKSI_BILLING } from "@/server/billingCollections";
import { adminDb } from "@/server/firebaseAdmin";

/**
 * Mencatat notifikasi mentah. Hanya dipanggil SETELAH tanda tangan terbukti
 * sah: menulis kiriman siapa pun akan mengubah koleksi ini menjadi tempat
 * pembuangan sampah yang bisa dijejali orang luar.
 */
export async function catatWebhookMentah(args: {
  orderId: string;
  payload: unknown;
  sekarang: string;
}): Promise<void> {
  await adminDb()
    .collection(KOLEKSI_BILLING.webhookInbox)
    .add({
      orderId: args.orderId,
      payload: args.payload,
      diterimaPada: args.sekarang,
    });
}

export async function catatHasilPembayaran(args: {
  orderId: string;
  kode: string;
  pesan: string;
  transactionStatus: string;
  sekarang: string;
}): Promise<void> {
  await adminDb().collection(KOLEKSI_BILLING.paymentEvents).add({
    orderId: args.orderId,
    kode: args.kode,
    pesan: args.pesan,
    transactionStatus: args.transactionStatus,
    padaWaktu: args.sekarang,
  });
}
