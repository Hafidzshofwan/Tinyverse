import { HARI_TRIAL } from "./promoTrial";

/**
 * Spanduk promo trial gratis pada layar login/daftar.
 *
 * Angka hari TIDAK boleh ditulis literal di sini; selalu ambil dari konstanta
 * HARI_TRIAL agar teks promo tidak pernah tertinggal saat durasi diubah.
 *
 * @param ringkas - Bila true, baris penjelas disembunyikan. Dipakai di mode
 *   "masuk" yang hanya perlu dorongan singkat, sedangkan mode "daftar"
 *   menampilkan versi lengkap.
 */
export function PromoTrial({ ringkas = false }: { ringkas?: boolean }) {
  return (
    <div className="tv-promo-trial" role="note">
      <span className="tv-promo-ikon" aria-hidden="true">
        {"\uD83C\uDF81"}
      </span>
      <span className="tv-promo-teks">
        <strong>Gratis {HARI_TRIAL} hari untuk pendaftar baru</strong>
        {ringkas ? null : (
          <span className="tv-promo-sub">
            Akses penuh seluruh alat klinis. Tanpa kartu kredit.
          </span>
        )}
      </span>
    </div>
  );
}
