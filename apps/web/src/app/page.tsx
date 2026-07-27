import { HomeGreeting, HomeQuickAccess, HomeFavorites } from "@/widgets/home-dashboard";
import { SidebarIcon } from "@/shared/ui";

function PediatricInsightIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tvInsightGrad1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="tvInsightGrad2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
      </defs>
      <path
        d="M12 2a8 8 0 0 0-8 8c0 3.31 2.02 6.15 4.9 7.33L8.5 20a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1l.4-2.67C18.78 16.15 20 13.31 20 10a8 8 0 0 0-8-8z"
        stroke="url(#tvInsightGrad1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 3v1"
        stroke="url(#tvInsightGrad2)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.75" fill="#F59E0B" />
      <path
        d="M12 4.5v1M6.5 6.5l.7.7M17.5 6.5l-.7.7"
        stroke="#38BDF8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Page() {
  return (
    <div className="tv-container">
      <HomeGreeting />

      <HomeQuickAccess />

      <div className="tv-home-cols">
        <HomeFavorites />

        <section className="tv-card tv-stack tv-insight-card">
          <div className="tv-home-section-head">
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span aria-hidden style={{ display: "inline-flex" }}>
                <PediatricInsightIcon size={22} />
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

      <section className="tv-card tv-stack tv-update-card">
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
