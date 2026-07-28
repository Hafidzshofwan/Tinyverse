/**
 * Pembacaan environment variable sisi server.
 *
 * WHY berkas terpisah: agar ada SATU tempat yang gagal keras saat kredensial
 * belum dipasang. Kegagalan yang jelas di awal jauh lebih baik daripada error
 * Firebase yang membingungkan jauh di dalam alur permintaan.
 *
 * PENTING: tidak satu pun nama di sini boleh berawalan NEXT_PUBLIC_.
 * Variabel berawalan itu ikut dikirim ke browser dan bisa dibaca siapa saja.
 */
import "server-only";

function wajib(nama: string): string {
  const nilai = process.env[nama];
  if (!nilai) {
    throw new Error(
      `Environment variable ${nama} belum diset. ` +
        `Lihat apps/web/.env.example untuk daftar lengkapnya.`,
    );
  }
  return nilai;
}

export function envAdmin() {
  return {
    projectId: wajib("FIREBASE_PROJECT_ID"),
    clientEmail: wajib("FIREBASE_CLIENT_EMAIL"),
    /*
     * Kunci privat mengandung baris baru. Saat disimpan di Vercel, baris baru
     * itu lazim tersimpan sebagai teks "\n" dua karakter, sehingga harus
     * dikembalikan menjadi baris baru sungguhan sebelum dipakai.
     */
    privateKey: wajib("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  };
}

/** Masa hidup cookie sesi. Firebase membatasi maksimum 14 hari. */
export const SESI_BERLAKU_HARI = 5;
