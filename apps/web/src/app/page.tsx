import { HomeGreeting, HomeQuickAccess, HomeFavorites } from "@/widgets/home-dashboard";
import { SidebarIcon } from "@/shared/ui";

export default function Page() {
  return (
    <div className="tv-container">
      <HomeGreeting />

      <HomeQuickAccess />

      <div className="tv-home-cols">
        <HomeFavorites />

        <section className="tv-card tv-stack">
          <div className="tv-home-section-head">
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span aria-hidden style={{ display: "inline-flex" }}>
                <SidebarIcon slug="ai-assistant" size={22} />
              </span>
              <span>Pediatric Insight</span>
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
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span aria-hidden style={{ display: "inline-flex" }}>
              <SidebarIcon slug="beranda" size={22} />
            </span>
            <span>Update Tinyverse</span>
          </h2>
          <p>Versi 3.5 — Fitur Terbaru &amp; Peningkatan Sistem</p>
        </div>
        <ul className="tv-update-list">
          <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span aria-hidden style={{ display: "inline-flex", marginTop: "2px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#0284C7" strokeWidth="2" />
                <path d="M16 16L21 21" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <strong>Pencarian Global Direct-Target:</strong> Mengetik atau memilih fitur langsung membuka spesifik sub-tab, kalkulator, atau skor klinis yang dituju.
            </div>
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span aria-hidden style={{ display: "inline-flex", marginTop: "2px" }}>
              <SidebarIcon slug="tumbuh-kembang" size={20} />
            </span>
            <div>
              <strong>Pemantauan Pertumbuhan Longitudinal:</strong> Grafik trend pertumbuhan berkala anak (multiple visit) dengan Z-score WHO/CDC, pelacakan stunting &amp; wasting.
            </div>
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span aria-hidden style={{ display: "inline-flex", marginTop: "2px" }}>
              <SidebarIcon slug="darurat" size={20} />
            </span>
            <div>
              <strong>Mode Darurat &amp; Resusitasi PALS:</strong> Kalkulator dosis obat emergensi, estimasi ETT &amp; defibrilator, serta Timer &amp; Log Algoritma RJP/CPR real-time.
            </div>
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span aria-hidden style={{ display: "inline-flex", marginTop: "2px" }}>
              <SidebarIcon slug="protokol" size={20} />
            </span>
            <div>
              <strong>Integrasi Fitur Pediatrik Lengkap:</strong> Kalkulator dosis &amp; puyer, terapi cairan, interpretasi lab/AGD, 8 skoring klinis, alur tatalaksana interaktif, dan jadwal imunisasi IDAI.
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
