const TIPS: ReadonlyArray<{ judul: string; isi: string; sumber: string }> = [
  {
    judul: "Tekanan Darah Anak",
    isi: "Skrining tekanan darah rutin sejak usia 3 tahun kini memakai ambang persentil AAP 2017, bukan lagi tabel lama.",
    sumber: "Kalkulator Tekanan Darah",
  },
  {
    judul: "eGFR Pediatrik",
    isi: "Untuk usia 1-25 tahun, formula CKiD U25 (Pierce 2021) kini jadi rujukan utama estimasi eGFR, dengan Bedside Schwartz sebagai pembanding.",
    sumber: "Kalkulator eGFR",
  },
  {
    judul: "Skor Klinis Kawasaki",
    isi: "Kriteria Kawasaki/AHA membantu deteksi dini kasus atipikal yang tidak memenuhi seluruh kriteria klasik. Jangan menyingkirkan diagnosis hanya karena kriteria tidak lengkap.",
    sumber: "Skoring Klinis",
  },
  {
    judul: "Nutrisi Neonatus",
    isi: "GIR (Glucose Infusion Rate) awal pada bayi preterm umumnya dimulai rendah lalu dititrasi naik bertahap sesuai toleransi gula darah.",
    sumber: "Tools Neonatus",
  },
  {
    judul: "Alur Tata Laksana Asma",
    isi: "Pada serangan asma akut, penilaian ulang respons setelah nebulisasi awal menentukan apakah anak masuk jalur rawat inap atau observasi lanjut.",
    sumber: "Alur Tata Laksana",
  },
];

function ambilIndexHarian(panjang: number): number {
  const sekarang = new Date();
  const awalTahun = new Date(Date.UTC(sekarang.getUTCFullYear(), 0, 0));
  const selisihHari = Math.floor((sekarang.getTime() - awalTahun.getTime()) / 86400000);
  return ((selisihHari % panjang) + panjang) % panjang;
}

/**
 * Kartu "Pediatric Insight" beranda: satu poin edukasi klinis singkat yang
 * berganti tiap hari, diambil dari daftar tips berbasis pedoman yang sudah
 * dipakai kalkulator Tinyverse. Ini murni pengingat, BUKAN pengganti
 * kalkulator atau guideline lengkap.
 */
export function HomeInsight() {
  const tip = TIPS[ambilIndexHarian(TIPS.length)];

  return (
    <section className="tv-card tv-stack tv-insight-card">
      <div className="tv-home-section-head">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden style={{ display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.45 1 1.2 1 2.05V17h6v-.25c0-.85.4-1.6 1-2.05A7 7 0 0 0 12 2z"
                stroke="#38BDF8"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Pediatric Insight</span>
        </h2>
        <p>Satu poin edukasi klinis singkat, berganti tiap hari.</p>
      </div>
      <p className="tv-insight-body">
        <strong>{tip.judul}.</strong> {tip.isi}
      </p>
      <p className="tv-insight-note">
        {"Terkait: " + tip.sumber + ". Selalu verifikasi dengan guideline resmi dan penilaian klinis langsung."}
      </p>
    </section>
  );
}
