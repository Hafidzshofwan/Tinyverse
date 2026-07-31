/**
 * SATU-SATUNYA sumber angka durasi trial untuk seluruh teks di antarmuka.
 *
 * Berkas ini sengaja dibuat terpisah dan hanya berisi satu konstanta, supaya
 * angka trial tidak pernah ditulis ulang sebagai teks literal di komponen mana
 * pun. Setiap kali durasi berubah, cukup satu baris di bawah yang disunting.
 *
 * CATATAN PENTING
 * Konstanta ini hanya mengatur ANGKA YANG DITAMPILKAN. Durasi trial yang
 * sesungguhnya diberikan kepada pengguna ditentukan oleh logika langganan di
 * sisi server (paket @tinyverse/billing). Selama keduanya masih terpisah, ada
 * risiko teks promo dan durasi asli tidak sinkron.
 *
 * Begitu konstanta resmi di @tinyverse/billing diketahui namanya, ganti isi
 * berkas ini menjadi satu baris re-export, misalnya:
 *
 *   export { HARI_TRIAL } from "@tinyverse/billing";
 *
 * sehingga hanya ada satu angka di seluruh repositori.
 */
export const HARI_TRIAL = 7;
