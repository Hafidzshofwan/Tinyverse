"use client";

import { useState } from "react";

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
  {
    judul: "Kejang Demam Kompleks",
    isi: "Kejang demam kompleks (fokal, >15 menit, atau berulang dalam 24 jam) memerlukan evaluasi lebih lanjut untuk menyingkirkan meningitis atau ensefalitis.",
    sumber: "Alur Tata Laksana",
  },
  {
    judul: "Dehidrasi Ringan-Sedang",
    isi: "Rehidrasi oral (oralit) tetap menjadi pilihan utama pada dehidrasi ringan-sedang akibat diare akut — lebih aman dan efektif dibanding langsung memasang infus.",
    sumber: "Terapi Cairan",
  },
  {
    judul: "Luka Bakar Anak",
    isi: "Rumus Parkland (4 mL/kgBB/%TBSA) digunakan untuk rehidrasi luka bakar, dengan separuh volume diberikan dalam 8 jam pertama sejak kejadian, bukan sejak tiba di fasilitas.",
    sumber: "Terapi Cairan",
  },
  {
    judul: "Interpretasi AGD",
    isi: "Selalu evaluasi kompensasi setelah menentukan gangguan primer. Kompensasi yang melampaui prediksi mengisyaratkan adanya gangguan asam-basa campuran.",
    sumber: "Interpretasi Lab",
  },
  {
    judul: "Bilirubin Neonatus",
    isi: "Ambang fototerapi dan transfusi tukar bervariasi berdasarkan usia gestasi dan faktor risiko neurotoksisitas — selalu gunakan nomogram, bukan angka tunggal.",
    sumber: "Tools Neonatus",
  },
  {
    judul: "Dosis Obat Pediatrik",
    isi: "Dosis obat anak berbasis berat badan (mg/kgBB) memiliki batas dosis dewasa (dosis maksimum) — pastikan dihitung keduanya dan diambil yang lebih rendah.",
    sumber: "Dosis Obat",
  },
  {
    judul: "Stunting vs Wasting",
    isi: "Stunting (TB/U rendah) mencerminkan malnutrisi kronik, sedangkan wasting (BB/TB rendah) mencerminkan malnutrisi akut. Keduanya dapat terjadi bersamaan pada satu anak.",
    sumber: "Tumbuh Kembang",
  },
  {
    judul: "Ketoasidosis Diabetik Anak",
    isi: "Hindari bolus cairan berlebihan pada KAD anak — risiko edema serebri meningkat pada koreksi osmolalitas terlalu cepat. Koreksi bertahap dalam 24-48 jam.",
    sumber: "Alur Tata Laksana",
  },
  {
    judul: "Skor APGAR",
    isi: "Skor APGAR bukan alat untuk memutuskan resusitasi — resusitasi dimulai berdasarkan penilaian klinis langsung. APGAR dicatat pada menit ke-1 dan ke-5 sebagai dokumentasi.",
    sumber: "Skoring Klinis",
  },
  {
    judul: "Penilaian Segitiga Anak (PAT)",
    isi: "PAT (Pediatric Assessment Triangle) memungkinkan penilaian kesan umum anak dalam <30 detik tanpa alat: penampilan, kerja napas, dan sirkulasi kulit.",
    sumber: "Mode Darurat",
  },
  {
    judul: "Hipoglikemia Neonatus",
    isi: "Kadar glukosa <47 mg/dL pada neonatus memerlukan tindakan, terlepas dari ada tidaknya gejala. Bayi preterm dan kecil masa kehamilan (KMK) berisiko lebih tinggi.",
    sumber: "Alur Tata Laksana",
  },
  {
    judul: "Imunisasi Kejar",
    isi: "Anak yang terlambat imunisasi tidak perlu mengulang dari awal — jadwal kejar (catch-up) memungkinkan percepatan tanpa mengurangi efektivitas proteksi.",
    sumber: "Jadwal Imunisasi",
  },
  {
    judul: "CKD pada Anak",
    isi: "Estimasi eGFR pada anak tidak bisa memakai rumus dewasa (CKD-EPI). Formula CKiD U25 berbasis tinggi badan dan kreatinin adalah standar saat ini untuk usia 1-25 tahun.",
    sumber: "Kalkulator eGFR",
  },
  {
    judul: "Racikan Puyer",
    isi: "Pada racikan puyer, dosis aktual yang diterima anak bergantung pada homogenitas gerusan — kesalahan pencampuran bisa menyebabkan satu bungkus overdosis dan bungkus lain underdosis.",
    sumber: "Obat & Puyer",
  },
  {
    judul: "Denver II vs KPSP",
    isi: "Denver II adalah alat skrining standar emas berbasis observasi dengan 125 item, sedangkan KPSP adalah alat skrining singkat berbasis laporan orang tua — keduanya saling melengkapi, bukan menggantikan.",
    sumber: "Tumbuh Kembang",
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
 * berganti tiap hari secara otomatis, dengan tombol navigasi manual agar
 * pengguna bisa menelusuri tips lain tanpa menunggu hari berikutnya.
 * Diperluas dari 5 ke 20 tips agar rotasi harian tidak terasa basi.
 * Ini murni pengingat, BUKAN pengganti kalkulator atau guideline lengkap.
 */
export function HomeInsight() {
  const indexHarian = ambilIndexHarian(TIPS.length);
  const [offset, setOffset] = useState(0);

  const indexAktif = (indexHarian + offset + TIPS.length) % TIPS.length;
  const tip = TIPS[indexAktif]!;

  const kePrev = () => setOffset((o) => o - 1);
  const keNext = () => setOffset((o) => o + 1);

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid var(--tv-border, #e2e8f0)",
    background: "transparent",
    cursor: "pointer",
    color: "var(--tv-soft-teks, #64748b)",
    flexShrink: 0,
    padding: 0,
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <p style={{ margin: 0, flex: 1 }}>Satu poin edukasi klinis singkat, berganti tiap hari.</p>
          <button onClick={kePrev} style={btnStyle} aria-label="Tips sebelumnya" title="Tips sebelumnya">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 11, color: "var(--tv-soft-teks, #64748b)", minWidth: 32, textAlign: "center" }}>
            {indexAktif + 1}/{TIPS.length}
          </span>
          <button onClick={keNext} style={btnStyle} aria-label="Tips berikutnya" title="Tips berikutnya">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
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
