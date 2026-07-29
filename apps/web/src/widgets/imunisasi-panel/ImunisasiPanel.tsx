import { ScheduleChart } from "@/features/immunization-schedule";
import { VaccineCatalog } from "@/features/vaccine-catalog";

/**
 * Panel Jadwal Imunisasi (React native) — pengganti island iframe v17.
 * Mengikuti tema navy-magenta terpadu yang sudah dipakai Lab/Darurat/Cairan
 * (bukan lagi palet pastel biru/kuning/hijau v17): header judul-section,
 * kartu putih (etail), tab tersegmentasi navy untuk Bagan Jadwal/Keterangan.
 */
export function ImunisasiPanel() {
  return (
    <div className="tv-page-imunisasi-wrapper">
      <div className="tv-page-imunisasi">
        <div className="judul-section" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className="ikon-bulat"
            style={{ background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-hidden
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#E0E7FF" />
              <rect x="4" y="5" width="16" height="15" rx="2" stroke="#3730A3" strokeWidth="1.8" fill="#C7D2FE" fillOpacity="0.4" />
              <path d="M4 9H20M8 3V6M16 3V6" stroke="#3730A3" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="8" cy="13" r="1.5" fill="#4338CA" />
              <circle cx="12" cy="13" r="1.5" fill="#4338CA" />
              <circle cx="16" cy="13" r="1.5" fill="#10B981" />
              <path d="M14.5 17L15.5 18L18 15.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px", fontWeight: 800, margin: 0, color: "#0A0B5F" }}>Jadwal Imunisasi Anak</h2>
            <p style={{ fontSize: "10.24px", margin: 0, color: "rgba(10, 11, 95, 0.62)" }}>
              Rekomendasi IDAI 2024 — usia 0–18 tahun, lengkap dengan materi
              tiap vaksin.
            </p>
          </div>
        </div>

        <div className="kartu">
          <ScheduleChart />
        </div>

        <div className="kartu">
          <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 3L21 6M19.5 4.5L16 8M14.5 6.5L17.5 9.5M10.5 10.5L13.5 13.5" stroke="#D936A6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 18L13.5 10.5L10.5 7.5L3 15V18H6Z" stroke="#D936A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FCE7F3"/>
              <path d="M3 21L6 18" stroke="#D936A6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Materi Vaksin
          </div>
          <VaccineCatalog />
        </div>
      </div>
    </div>
  );
}
