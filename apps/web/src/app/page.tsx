import type { Metadata } from "next";
import { KelolaPenggunaPanel } from "@/widgets/kelola-pengguna";

/** Halaman admin internal -- sengaja noindex, lihat juga app/robots.ts. */
export const metadata: Metadata = {
  title: "Kelola Pengguna",
  robots: { index: false, follow: false },
};

/**
 * Halaman penuh kelola pengguna.
 *
 * Sebelumnya ini sebuah modal, dan tabelnya terpotong karena kartu modal punya
 * lebar maksimum. Tabel dengan empat kolom yang salah satunya berisi tanggal
 * memang tidak muat di sana.
 *
 * Tidak ada penjaga di berkas ini. Yang menentukan tetap route
 * /api/admin/pengguna, yang menolak siapa pun tanpa custom claim admin. Halaman
 * ini hanya kulit; menaruh pemeriksaan kedua di sini akan menciptakan jawaban
 * kedua atas pertanyaan "siapa admin", dan dua jawaban itu pasti berselisih
 * suatu saat.
 */
export default function KelolaPenggunaPage() {
  return <KelolaPenggunaPanel />;
}
