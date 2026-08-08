import "server-only";

/**
 * Promo peluncuran (launching promo) Tinyverse.
 *
 * Diskon 40% untuk SEMUA paket langganan, berlaku selama 2 bulan sejak
 * tanggal MULAI di bawah. Begitu tanggal BERAKHIR terlewati, harga otomatis
 * kembali ke harga normal tanpa perlu mengubah kode apa pun -- promo ini
 * memang dirancang untuk padam sendiri, bukan dimatikan manual.
 *
 * WHY tanggal ditulis tetap (bukan dihitung dari "hari deploy" atau
 * "permintaan pertama"): promo harus mulai dan berakhir pada waktu yang SAMA
 * untuk semua pengguna, dan tidak boleh bergeser hanya karena server
 * di-restart atau di-deploy ulang.
 *
 * Untuk mengubah promo di masa depan (memperpanjang, mengganti persentase,
 * atau mematikan lebih awal), cukup sunting nilai di bawah ini -- tidak ada
 * tempat lain yang perlu disentuh.
 */
export const PROMO_LAUNCHING = {
  /** Saklar utama. Set `false` untuk mematikan promo kapan saja. */
  aktif: true,
  /** Potongan harga, dalam persen. */
  diskonPersen: 40,
  /** Semua jam memakai WIB (UTC+7), zona waktu utama basis pengguna. */
  mulai: "2026-08-08T00:00:00+07:00",
  berakhir: "2026-10-08T00:00:00+07:00",
} as const;

/**
 * True bila promo sedang berlaku pada waktu yang diberikan (bawaan: sekarang).
 * Menerima `padaWaktu` eksplisit supaya mudah diuji tanpa mengganggu jam
 * sistem.
 */
export function promoSedangBerlaku(padaWaktu: Date = new Date()): boolean {
  if (!PROMO_LAUNCHING.aktif) return false;
  const t = padaWaktu.getTime();
  return (
    t >= new Date(PROMO_LAUNCHING.mulai).getTime() &&
    t < new Date(PROMO_LAUNCHING.berakhir).getTime()
  );
}

/** Menghitung harga setelah potongan promo, dibulatkan ke rupiah penuh. */
export function hargaSetelahDiskon(hargaAsli: number): number {
  const potongan = Math.round((hargaAsli * PROMO_LAUNCHING.diskonPersen) / 100);
  return Math.max(0, hargaAsli - potongan);
}
