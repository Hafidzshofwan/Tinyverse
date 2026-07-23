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
        <div className="judul-section">
          <div
            className="ikon-bulat"
            style={{ background: "#D936A61A", color: "#D936A6" }}
            aria-hidden
          >
            💉
          </div>
          <div>
            <h2>Jadwal Imunisasi Anak</h2>
            <p>
              Rekomendasi IDAI 2024 — usia 0–18 tahun, lengkap dengan materi
              tiap vaksin.
            </p>
          </div>
        </div>

        <div className="kartu">
          <ScheduleChart />
        </div>

        <div className="kartu">
          <div className="dx-sub-h">💉 Materi Vaksin</div>
          <VaccineCatalog />
        </div>
      </div>
    </div>
  );
}
