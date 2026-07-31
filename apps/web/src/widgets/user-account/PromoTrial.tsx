import { HARI_TRIAL } from "./promoTrial";

/**
 * Spanduk promo trial gratis pada layar login/daftar.
 *
 * Angka hari TIDAK boleh ditulis literal di sini; selalu ambil dari konstanta
 * HARI_TRIAL agar teks promo tidak pernah tertinggal saat durasi diubah.
 *
 * IKON sengaja berupa SVG sebaris, bukan emoji. Emoji dirender oleh sistem
 * operasi, sehingga bentuk dan warnanya berbeda di Windows, Android, dan iOS -
 * satu-satunya elemen di layar masuk yang tidak bisa dikendalikan desain.
 * SVG juga ikut menyesuaikan diri dengan ukuran teks dan tetap tajam di layar
 * kerapatan tinggi.
 *
 * @param ringkas - Bila true, baris penjelas disembunyikan dan bentuknya
 *   menjadi pil. Dipakai di mode "masuk" yang hanya perlu dorongan singkat,
 *   sedangkan mode "daftar" menampilkan versi lengkap.
 */
export function PromoTrial({ ringkas = false }: { ringkas?: boolean }) {
  return (
    <div
      className={ringkas ? "tv-promo-trial ringkas" : "tv-promo-trial"}
      role="note"
    >
      <svg
        className="tv-promo-ikon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Id gradien diberi awalan tv-promo- supaya tidak bentrok dengan
              gradien milik ikon chip di AuthScreen yang tampil sehalaman. */}
          <linearGradient
            id="tv-promo-kilau"
            x1="3"
            y1="2"
            x2="21"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#5EEAD4" />
            <stop offset="0.5" stopColor="#10B981" />
            <stop offset="1" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.4c.31 0 .58.21.66.51l1.02 3.75a4.7 4.7 0 0 0 3.29 3.29l3.75 1.02a.69.69 0 0 1 0 1.32l-3.75 1.02a4.7 4.7 0 0 0-3.29 3.29l-1.02 3.75a.69.69 0 0 1-1.32 0l-1.02-3.75a4.7 4.7 0 0 0-3.29-3.29L3.28 12.3a.69.69 0 0 1 0-1.32l3.75-1.02a4.7 4.7 0 0 0 3.29-3.29l1.02-3.75c.08-.3.35-.51.66-.51Z"
          fill="url(#tv-promo-kilau)"
        />
        <circle cx="19.4" cy="4.6" r="1.55" fill="#6EE7B7" />
        <circle cx="5.1" cy="19" r="1.05" fill="#99F6E4" />
      </svg>
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
