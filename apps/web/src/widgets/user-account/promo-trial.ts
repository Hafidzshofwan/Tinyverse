/**
 * SATU-SATUNYA sumber angka durasi trial untuk seluruh teks di antarmuka.
 *
 * Berkas ini sengaja dibuat terpisah dan hanya berisi satu konstanta, supaya
 * angka trial tidak pernah ditulis ulang sebagai teks literal di komponen mana
 * pun. Setiap kali durasi berubah, cukup satu baris di bawah yang disunting.
 *
 * WHY BUKAN RE-EXPORT LANGSUNG DARI @tinyverse/billing
 *
 * Cara paling ringkas memang `export { HARI_PERCOBAAN as HARI_TRIAL } from
 * "@tinyverse/billing"`, dan itu sempat direncanakan. Tetapi berkas ini dipakai
 * oleh PromoTrial.tsx yang ikut terkirim ke peramban lewat AuthScreen. Menarik
 * seluruh indeks paket billing ke dalam bundel klien berarti ikut menyeret
 * modul pesanan dan Midtrans - kode yang tidak pernah dibutuhkan layar login,
 * memperbesar berkas yang harus diunduh sebelum halaman masuk bisa dipakai, dan
 * berisiko gagal build bila salah satu modul itu bergantung pada API Node.
 *
 * Satu angka demi satu paket server di bundel klien bukan pertukaran yang adil.
 *
 * Sebagai gantinya, kesetaraan angka ini dengan HARI_PERCOBAAN dijaga oleh
 * promo-trial.test.ts. Menaikkan durasi trial tanpa memperbarui berkas ini akan
 * membuat CI merah, bukan membuat spanduk login diam-diam berbohong kepada
 * calon pengguna.
 *
 * MASIH HARUS DIPERIKSA MANUAL saat durasi berubah, karena angkanya tertulis
 * sebagai kalimat di dokumen yang mengikat secara hukum:
 *   - apps/web/src/app/syarat-ketentuan/page.tsx  (bagian 3)
 *   - apps/web/src/app/pengembalian-dana/page.tsx
 */
export const HARI_TRIAL = 10;
