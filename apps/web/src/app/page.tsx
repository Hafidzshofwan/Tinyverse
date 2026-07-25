import { HomeGreeting, HomeQuickAccess, HomeFavorites } from "@/widgets/home-dashboard";

export default function Page() {
  return (
    <div className="tv-container">
      <HomeGreeting />

      <HomeQuickAccess />

      <div className="tv-home-cols">
        <HomeFavorites />

        <section className="tv-card tv-stack">
          <div className="tv-home-section-head">
            <h2>
              <span aria-hidden>{"\uD83E\uDDE0"}</span> Pediatric Insight
            </h2>
            <p>Informasi edukatif singkat hari ini.</p>
          </div>
          <p className="tv-insight-body">
            Tanda dehidrasi pada anak dinilai bersama asupan, keluaran urine, dan
            kondisi umum. Rencana rehidrasi disesuaikan dengan derajat dehidrasi
            serta berat badan.
          </p>
          <p className="tv-insight-note">
            Insight harian untuk edukasi, bukan pengganti penilaian klinis.
          </p>
        </section>
      </div>

      <section className="tv-card tv-stack">
        <div className="tv-home-section-head">
          <h2>
            <span aria-hidden>{"\uD83D\uDE80"}</span> Update Tinyverse
          </h2>
          <p>Versi 3.5 — Fitur Terbaru &amp; Peningkatan Sistem</p>
        </div>
        <ul className="tv-update-list">
          <li>
            <span aria-hidden>{"\uD83D\uDD0D"}</span>
            <div>
              <strong>Pencarian Global Direct-Target:</strong> Mengetik atau memilih fitur langsung membuka spesifik sub-tab, kalkulator, atau skor klinis yang dituju.
            </div>
          </li>
          <li>
            <span aria-hidden>{"\uD83D\uDCC8"}</span>
            <div>
              <strong>Pemantauan Pertumbuhan Longitudinal:</strong> Grafik trend pertumbuhan berkala anak (multiple visit) dengan Z-score WHO/CDC, pelacakan stunting &amp; wasting.
            </div>
          </li>
          <li>
            <span aria-hidden>{"\u26A1"}</span>
            <div>
              <strong>Mode Darurat &amp; Resusitasi PALS:</strong> Kalkulator dosis obat emergensi, estimasi ETT &amp; defibrilator, serta Timer &amp; Log Algoritma RJP/CPR real-time.
            </div>
          </li>
          <li>
            <span aria-hidden>{"\uD83E\uDE7B"}</span>
            <div>
              <strong>Integrasi Fitur Pediatrik Lengkap:</strong> Kalkulator dosis &amp; puyer, terapi cairan, interpretasi lab/AGD, 8 skoring klinis, alur tatalaksana interaktif, dan jadwal imunisasi IDAI.
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
