import { ScheduleChart } from "@/features/immunization-schedule";
import { VaccineCatalog } from "@/features/vaccine-catalog";

/**
 * Panel Jadwal Imunisasi (React native) — pengganti island iframe v17.
 * Struktur & gaya pastel (biru/kuning/hijau) dipertahankan 1:1 sesuai
 * imunisasi-tool.html: hero judul, kartu Bagan Jadwal (tab + zoom), kartu
 * Materi Vaksin (dropdown + detail). Warna diatur lewat v17-imunisasi.css
 * (diimpor dari page.tsx), bukan tema navy-magenta terpadu.
 */
export function ImunisasiPanel() {
  return (
    <div className="tv-page-imunisasi-wrapper">
      <div className="tv-page-imunisasi" id="page-imunisasi">
        <div className="imunisasi-shell">
          <section className="imunisasi-hero">
            <h2>Jadwal Imunisasi Anak</h2>
            <p>
              Rekomendasi Ikatan Dokter Anak Indonesia (IDAI) 2024 — usia
              0–18 tahun, lengkap dengan materi tiap vaksin.
            </p>
          </section>

          <ScheduleChart />

          <div className="kartu">
            <div className="judul-section">
              <div className="ikon-bulat" style={{ background: "#E6F7EC" }}>
                💉
              </div>
              <div>
                <h2>Materi Vaksin</h2>
                <p>
                  Pilih satu vaksin untuk melihat penyakit yang dicegah,
                  jenis (hidup/mati), cara pemberian, jadwal &amp; dosis,
                  KIPI, dan kontraindikasi.
                </p>
              </div>
            </div>
            <VaccineCatalog />
          </div>
        </div>
      </div>
    </div>
  );
}
