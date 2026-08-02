import { KelolaPenggunaPanel } from "@/widgets/kelola-pengguna";

export const metadata = {
  title: "Kelola Pengguna | Tinyverse",
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
