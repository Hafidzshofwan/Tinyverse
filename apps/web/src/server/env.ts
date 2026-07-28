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

/**
 * Konfigurasi Midtrans.
 *
 * WHY tidak ada NEXT_PUBLIC_ di sini: mode redirect tidak memerlukan Client Key
 * di browser. Pelanggan dibawa ke halaman milik Midtrans, sehingga seluruh
 * percakapan dengan gateway berlangsung dari server ke server.
 */
export type ModeMidtrans = "sandbox" | "production";

export function envMidtrans() {
  const mode = process.env.MIDTRANS_MODE;
  if (mode !== "sandbox" && mode !== "production") {
    throw new Error(
      `Environment variable MIDTRANS_MODE harus bernilai "sandbox" atau ` +
        `"production", bukan ${JSON.stringify(mode ?? null)}.`,
    );
  }

  const serverKey = wajib("MIDTRANS_SERVER_KEY");

  /*
   * Penjaga satu arah, dan sengaja hanya satu arah.
   *
   * Kunci sandbox LAZIMNYA berawalan "SB-", tetapi tidak semua akun demikian -
   * jadi ketiadaan awalan itu bukan bukti kesalahan dan tidak boleh ditolak.
   * Yang pasti keliru adalah kebalikannya: kunci berawalan "SB-" tidak mungkin
   * merupakan kunci produksi. Hanya arah yang pasti itu yang dijaga di sini.
   */
  if (mode === "production" && serverKey.startsWith("SB-")) {
    throw new Error(
      "MIDTRANS_MODE bernilai production, tetapi MIDTRANS_SERVER_KEY adalah " +
        "kunci sandbox. Pembayaran sungguhan tidak akan pernah masuk.",
    );
  }

  return {
    mode,
    serverKey,
    /** Pembuatan transaksi Snap. */
    urlSnap:
      mode === "production"
        ? "https://app.midtrans.com/snap/v1"
        : "https://app.sandbox.midtrans.com/snap/v1",
    /** Pembacaan status transaksi (verifikasi ganda webhook). */
    urlApi:
      mode === "production"
        ? "https://api.midtrans.com/v2"
        : "https://api.sandbox.midtrans.com/v2",
  };
}

/**
 * Alamat dasar aplikasi untuk menyusun URL kepulangan setelah membayar.
 *
 * WHY dibaca dari environment dan bukan dari header permintaan: header Host
 * dikirim oleh peramban dan bisa dipalsukan. Alamat tujuan kepulangan tidak
 * boleh ditentukan oleh pihak yang tidak kita percayai.
 */
export function envAplikasi() {
  return { baseUrl: wajib("APP_BASE_URL").replace(/\/+$/, "") };
}
