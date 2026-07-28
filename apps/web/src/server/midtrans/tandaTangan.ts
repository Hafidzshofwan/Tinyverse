/**
 * Verifikasi tanda tangan notifikasi Midtrans.
 *
 * WHY berkas ini ada di apps/web dan bukan di packages/billing: paket billing
 * sengaja dijaga tetap murni - tanpa jaringan dan tanpa kriptografi - supaya
 * seluruh aturan uang dapat diuji tanpa lingkungan. Kriptografi tinggal di
 * lapisan rute, persis seperti yang dinyatakan orders/midtrans.ts.
 *
 * Alamat webhook bersifat publik: siapa pun boleh mengirim POST ke sana.
 * Satu-satunya yang membedakan Midtrans dari penipu adalah tanda tangan ini.
 * Tanpa pemeriksaan ini, seseorang cukup menebak sebuah order_id untuk
 * membuka akses berbayar secara gratis.
 */
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * SHA512(order_id + status_code + gross_amount + ServerKey).
 *
 * PENTING: `grossAmount` harus berupa teks MENTAH persis seperti yang dikirim
 * Midtrans, misalnya "15000.00". Mengubahnya menjadi angka lalu kembali ke teks
 * akan menghasilkan "15000", dan tanda tangan tidak akan pernah cocok. Bug ini
 * sangat sulit dilacak karena semua nilai terlihat benar saat dibaca manusia.
 */
export function hitungTandaTangan(args: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  serverKey: string;
}): string {
  return createHash("sha512")
    .update(
      args.orderId + args.statusCode + args.grossAmount + args.serverKey,
      "utf8",
    )
    .digest("hex");
}

/**
 * Perbandingan yang tidak membocorkan informasi lewat lamanya waktu.
 *
 * Perbandingan biasa dengan === berhenti pada karakter pertama yang berbeda,
 * sehingga lama pemeriksaan menyiratkan berapa banyak karakter awal yang sudah
 * benar. Celah itu dapat dipakai menebak tanda tangan sedikit demi sedikit.
 */
export function tandaTanganCocok(diterima: string, dihitung: string): boolean {
  const a = Buffer.from(diterima.trim().toLowerCase(), "utf8");
  const b = Buffer.from(dihitung.trim().toLowerCase(), "utf8");
  /* timingSafeEqual melempar bila panjangnya berbeda, jadi disaring dulu.
     Panjang tanda tangan bukan rahasia, sehingga kebocoran waktu di sini
     tidak berarti apa-apa. */
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
