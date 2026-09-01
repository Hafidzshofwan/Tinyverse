import type { Kasus } from "../types";

export const kasusAsmatikus: Kasus = {
  id: "status-asmatikus",
  judul: "Serangan Asma Akut — Eskalasi Tatalaksana",
  deskripsi: "Anak 7 tahun dengan serangan asma sedang-berat tidak respons nebulisasi awal. Latih skoring PAS, kalkulasi dosis, dan keputusan eskalasi.",
  kategori: "respirasi",
  tingkat: "menengah",
  referensi: ["GINA 2023", "IDAI Panduan Asma Anak 2021", "AAP Clinical Practice Guideline"],
  langkah: [
    {
      id: "as1",
      judul: "Presentasi Pasien",
      tipeInput: "info",
      narasi: `Budi, laki-laki, 7 tahun, BB 22 kg, diantar ke IGD karena sesak napas berat sejak 5 jam. Riwayat asma sejak usia 3 tahun, terakhir kontrol 2 bulan lalu.

Di rumah sudah menggunakan 4 puff salbutamol inhaler, tidak membaik.

Pemeriksaan saat tiba:
• Kesadaran: Compos mentis, tampak distres, hanya bisa bicara kata per kata
• SpO₂: 92% tanpa oksigen (room air)
• RR: 38×/mnt, napas cepat dan dangkal
• Nadi: 128×/mnt
• Auskultasi: Wheezing ekspirasi-inspirasi di seluruh lapang paru
• Retraksi: Interkostal dan subkostal jelas
• Sianosis: Tidak tampak`,
      penjelasan: "Fokus pada SpO₂, kemampuan bicara, dan pola auskultasi. Ini adalah kunci penilaian Pediatric Asthma Score (PAS).",
    },
    {
      id: "as2",
      judul: "Penilaian Derajat Serangan (PAS)",
      tipeInput: "mcq",
      narasi: "Pediatric Asthma Score (PAS): komponen SpO₂ tanpa O₂ (92% = skor 2), frekuensi napas (38×/mnt = skor 2), auskultasi (wheezing E-I = skor 2), retraksi (interkostal + subkostal = skor 2), bicara (kata per kata = skor 2).",
      pertanyaan: "Berdasarkan PAS, derajat serangan asma Budi adalah?",
      opsi: [
        { id: "a", teks: "Ringan (PAS 5–7) — nebulisasi PRN, observasi" },
        { id: "b", teks: "Sedang (PAS 8–11) — nebulisasi tiap 20 mnt, steroid sistemik, pantau ketat" },
        { id: "c", teks: "Berat (PAS 12–15) — pertimbangkan ICU, intubasi" },
        { id: "d", teks: "Mengancam jiwa — silent chest, intubasi segera" },
      ],
      jawabanBenar: "b",
      penjelasan: "PAS: 2+2+2+2+2 = 10 poin → SEDANG (8–11). Tatalaksana: oksigen target SpO₂ >94%, nebulisasi salbutamol + ipratropium tiap 20 menit × 3, kortikosteroid sistemik (prednisolon oral atau metilprednisolon IV), evaluasi ketat.",
    },
    {
      id: "as3",
      judul: "Tatalaksana Awal",
      tipeInput: "mcq",
      narasi: "Budi diklasifikasikan serangan asma sedang. Oksigen sudah dipasang, SpO₂ naik ke 95%.",
      pertanyaan: "Pilihan tatalaksana farmakologis awal yang PALING LENGKAP dan TEPAT?",
      opsi: [
        { id: "a", teks: "Salbutamol nebulisasi saja, 3× tiap 20 menit" },
        { id: "b", teks: "Salbutamol + ipratropium bromida nebulisasi, kortikosteroid sistemik (prednisolon oral/metilprednisolon IV)" },
        { id: "c", teks: "Aminofilin IV bolus 6 mg/kgBB langsung" },
        { id: "d", teks: "Antibiotik empiris + kortikosteroid inhaler" },
      ],
      jawabanBenar: "b",
      penjelasan: "Tatalaksana serangan sedang: (1) SABA: salbutamol nebulisasi tiap 20 mnt × 3, (2) SAMA: ipratropium 250 µg nebulisasi (dosis pertama hingga ketiga), (3) STEROID: prednisolon oral 1–2 mg/kgBB atau metilprednisolon IV 1 mg/kgBB. Aminofilin BUKAN lini pertama. Antibiotik tidak rutin karena asma bukan infeksi bakteri.",
      linkKalkulator: { label: "Kalkulator Dosis Obat", href: "/preview/dosing" },
    },
    {
      id: "as4",
      judul: "Hitung Dosis Salbutamol",
      tipeInput: "numerik",
      narasi: "Dosis salbutamol nebulisasi: 0,15 mg/kgBB per dosis. Minimal 2,5 mg, maksimal 5 mg. BB Budi = 22 kg.",
      pertanyaan: "Berapa mg dosis salbutamol nebulisasi untuk Budi? (jawab dalam mg, 1 desimal)",
      jawabanBenar: 3.3,
      toleransi: 0.1,
      penjelasan: "0,15 × 22 = 3,3 mg per kali nebulisasi. Masih dalam rentang 2,5–5 mg → aman. Larutkan dalam 2–3 mL NaCl 0,9%. Frekuensi: tiap 20 menit sebanyak 3 kali dalam 1 jam pertama. Jika serangan berat, bisa diberikan kontinu (0,5 mg/kgBB/jam).",
      linkKalkulator: { label: "Kalkulator Dosis Salbutamol", href: "/preview/dosing" },
    },
    {
      id: "as5",
      judul: "Tidak Respons — Eskalasi",
      tipeInput: "mcq",
      narasi: "Setelah 3× nebulisasi salbutamol + ipratropium dan prednisolon oral, kondisi Budi: SpO₂ 90% dengan O₂ 6 L/mnt, retraksi masih ada, masih bicara kata per kata. PAS naik ke 12 (berat).",
      pertanyaan: "Eskalasi tatalaksana yang paling tepat selanjutnya?",
      opsi: [
        { id: "a", teks: "Ulangi 3 nebulisasi lagi dengan dosis yang sama" },
        { id: "b", teks: "Magnesium sulfat IV 40–50 mg/kgBB dalam 20 menit + pertimbangkan ICU" },
        { id: "c", teks: "Mulai antibiotik amoksisilin IV" },
        { id: "d", teks: "Berikan antihistamin untuk mengurangi bronkospasme" },
      ],
      jawabanBenar: "b",
      penjelasan: "Tidak respons setelah 3 nebulisasi (serangan berat): (1) Magnesium sulfat IV 40–50 mg/kgBB (max 2 g) dalam 20 menit — evidence kuat untuk bronkodilatasi. (2) Pertimbangkan nebulisasi salbutamol kontinu. (3) Helioks (jika tersedia). (4) Konsul ICU untuk evaluasi ventilasi mekanik. Intubasi adalah pilihan terakhir karena risiko barotrauma.",
    },
    {
      id: "as6",
      judul: "Indikasi Intubasi",
      tipeInput: "mcq",
      narasi: "Tim ICU sudah dipanggil. Sementara menunggu, apa tanda yang paling kuat mengindikasikan intubasi SEGERA?",
      pertanyaan: "Tanda yang paling menunjukkan perlunya intubasi segera pada serangan asma adalah?",
      opsi: [
        { id: "a", teks: "SpO₂ 88% yang sudah diberikan O₂ mask NRM" },
        { id: "b", teks: "Silent chest DISERTAI penurunan kesadaran (GCS ≤12)" },
        { id: "c", teks: "Tidak respons setelah 3× nebulisasi (kriteria tunggal)" },
        { id: "d", teks: "RR >50 kali/menit pada anak usia sekolah" },
      ],
      jawabanBenar: "b",
      penjelasan: "Indikasi intubasi: APNEIC, penurunan kesadaran + silent chest (kelelahan otot napas), hipoksia refrakter (SpO₂ <90% meski FiO₂ tinggi). Silent chest TANPA penurunan kesadaran dan SpO₂ 88% sendiri belum cukup → coba eskalasi lain (MgSO₄, HeO₂) dulu. Intubasi pada asma berisiko: barotrauma, air trapping — hanya jika tidak ada pilihan.",
    },
    {
      id: "as7",
      judul: "Pesan Dokter Senior",
      tipeInput: "info",
      narasi: `Kerja bagus! Kamu sudah melewati kasus asma akut dengan benar.

📌 Algoritma Asma Akut Anak yang harus dihapal:

RINGAN (PAS 5–7):
→ SABA inhaler/nebulisasi PRN + kortikosteroid oral
→ Bisa rawat jalan jika respons baik

SEDANG (PAS 8–11):
→ O₂, SABA + SAMA nebulisasi tiap 20 mnt × 3
→ Kortikosteroid sistemik WAJIB
→ Observasi minimal 4 jam

BERAT (PAS 12–15):
→ Semua di atas + MgSO₄ IV 40–50 mg/kgBB/20 mnt
→ ICU konsul, pertimbangkan intubasi
→ Nebulisasi salbutamol kontinu

INGAT: Antibiotik BUKAN standar terapi asma akut.
Aminofilin sudah jarang dipakai (efek samping tinggi, evidence lemah).
Target SpO₂: >94% (atau >95% pada anak).`,
      penjelasan: "PAS ringan 5–7, sedang 8–11, berat 12–15. Eskalasi: SABA → SABA+SAMA+steroid → MgSO4 → ICU → intubasi (last resort).",
    },
  ],
};
