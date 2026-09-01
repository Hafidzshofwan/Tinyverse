import type { Kasus } from "../types";

export const kasusFttGizi: Kasus = {
  id: "ftt-gizi",
  judul: "Failure to Thrive — Penilaian & Tatalaksana Gizi",
  deskripsi: "Anak perempuan 18 bulan dengan berat badan dan tinggi badan jauh di bawah standar. Latih penilaian antropometri, klasifikasi gizi, dan tatalaksana nutrisi terapi.",
  kategori: "tumbuh-kembang",
  tingkat: "dasar",
  referensi: ["WHO Child Growth Standards 2006", "IDAI Panduan Nutrisi Anak 2021", "WHO Management of Severe Acute Malnutrition 2013"],
  langkah: [
    {
      id: "ftt1",
      judul: "Presentasi Pasien",
      tipeInput: "info",
      narasi: `Rani, perempuan, 18 bulan, dibawa orang tua karena khawatir anak tidak tumbuh dengan baik.

Keluhan orang tua: Sejak usia 8 bulan, berat badan naik sangat lambat. Anak sering tidak mau makan, mudah sakit batuk-pilek (3–4× per bulan).

Data antropometri hari ini:
• Berat Badan (BB): 7,0 kg
• Panjang Badan (PB): 74 cm
• Lingkar Kepala: 46 cm (normal)
• Lingkar Lengan Atas (LiLA): 11,5 cm

Riwayat:
• Lahir spontan, BB lahir 3.100 g, PB lahir 48 cm
• ASI eksklusif 6 bulan, MPASI dimulai usia 7 bulan
• Imunisasi lengkap sesuai usia
• Tidak ada riwayat diare kronis, tidak batuk >3 minggu`,
      penjelasan: "Kumpulkan data anthropometri lengkap: BB/U, PB/U, dan BB/PB. Ketiganya memberikan informasi berbeda tentang status gizi.",
    },
    {
      id: "ftt2",
      judul: "Penilaian Status Gizi BB/U",
      tipeInput: "mcq",
      narasi: "BB Rani = 7,0 kg, Usia = 18 bulan. Rujukan WHO Girls 18 bulan: Median = 10,2 kg | -2 SD = 8,2 kg | -3 SD = 7,1 kg.",
      pertanyaan: "Berdasarkan indikator BB/U, status gizi Rani adalah?",
      opsi: [
        { id: "a", teks: "Gizi baik (Z-score BB/U antara -2 SD dan +2 SD)" },
        { id: "b", teks: "Gizi kurang / Underweight (Z-score BB/U antara -3 SD dan -2 SD)" },
        { id: "c", teks: "Gizi buruk / Berat badan sangat kurang (Z-score BB/U < -3 SD)" },
        { id: "d", teks: "Risiko gizi lebih (Z-score BB/U > +1 SD)" },
      ],
      jawabanBenar: "c",
      penjelasan: "BB 7,0 kg berada di bawah batas -3 SD (7,1 kg), dengan Z-score ≈ -3,2 SD → Gizi buruk / Berat badan sangat kurang (Severely Underweight) berdasarkan indikator BB/U WHO. Selanjutnya diperlukan penilaian PB/U untuk mengevaluasi stunting dan BB/PB untuk mengevaluasi wasting.",
      linkKalkulator: { label: "Grafik Pertumbuhan WHO", href: "/preview/pertumbuhan" },
    },
    {
      id: "ftt3",
      judul: "Penilaian Lengkap 3 Indikator",
      tipeInput: "mcq",
      narasi: "PB Rani = 74 cm. Rujukan WHO PB/U 18 bulan: Median = 80,7 cm | -2 SD = 76,0 cm | -3 SD = 72,8 cm. BB/PB 7,0 kg/74 cm: Z-score ≈ -1,5 SD (gizi baik / tidak ada wasting bermakna).",
      pertanyaan: "Profil gizi Rani yang paling akurat berdasarkan ketiga indikator adalah?",
      opsi: [
        { id: "a", teks: "Gizi baik pada semua indikator antropometri" },
        { id: "b", teks: "Severely Underweight (BB/U < -3 SD) + Stunting (PB/U < -2 SD) — pola malnutrisi kronis yang memerlukan tatalaksana nutrisi segera" },
        { id: "c", teks: "Hanya Wasting berat (gizi buruk akut), tinggi badan masih normal" },
        { id: "d", teks: "Semua normal — variasi fisiologis pertumbuhan anak" },
      ],
      jawabanBenar: "b",
      penjelasan: "BB/U: Z-score ≈ -3,2 SD → Severely Underweight (BB sangat kurang / gizi buruk BB/U) ✓. PB/U: 74 cm vs -2 SD (76,0 cm) → Z-score ≈ -2,6 SD → Stunted (pendek) ✓. BB/PB: Z-score ≈ -1,5 SD → Normal (tidak wasting). Kombinasi berat badan sangat kurang dan perawakan pendek tanpa wasting akut menunjukkan proses malnutrisi kronis (berlangsung lama).",
    },
    {
      id: "ftt4",
      judul: "Investigasi Penyebab",
      tipeInput: "mcq",
      narasi: "Profil gizi Rani: severely underweight + stunting, tanpa wasting bermakna. Tidak ada diare kronis, tidak batuk >3 minggu, tidak ada edema bilateral.",
      pertanyaan: "Pemeriksaan penunjang yang paling PENTING sebagai investigasi awal?",
      opsi: [
        { id: "a", teks: "CT scan kepala untuk menilai pertumbuhan otak" },
        { id: "b", teks: "Darah lengkap, albumin serum, feses rutin/kultur — screening penyebab organik dasar" },
        { id: "c", teks: "Ekokardiografi untuk menyingkirkan PJB" },
        { id: "d", teks: "Analisis kromosom karena kemungkinan sindrom genetik" },
      ],
      jawabanBenar: "b",
      penjelasan: "Investigasi bertahap: Lini 1 — darah lengkap (anemia, infeksi), albumin (status protein), feses (parasit, malabsorpsi), urinalisis. Lini 2 — TSH, IGF-1, sweat test (CF), serologis celiac, foto rontgen tulang (bone age). Ekokardiografi atau genetik hanya jika ada indikasi klinis spesifik.",
    },
    {
      id: "ftt5",
      judul: "Target Kenaikan BB",
      tipeInput: "numerik",
      narasi: "Rani didiagnosis malnutrisi kronis (severely underweight + stunting). BB saat ini 7,0 kg. Target kenaikan BB minimum fase rehabilitasi = 10 g/kgBB/hari.",
      pertanyaan: "Berapa gram kenaikan BB per hari yang menjadi target minimum untuk Rani? (BB 7,0 kg × 10 g/kgBB/hari)",
      jawabanBenar: 70,
      toleransi: 2,
      penjelasan: "10 g/kgBB/hari × 7 kg = 70 g/hari (minimum). Target optimal: 10–15 g/kgBB/hari pada fase rehabilitasi. Bila kenaikan <5 g/kgBB/hari → cari penyebab: infeksi tersembunyi, asupan tidak adekuat, atau malabsorpsi.",
    },
    {
      id: "ftt6",
      judul: "Tatalaksana Diet Awal",
      tipeInput: "mcq",
      narasi: "Rani tidak memiliki edema, tidak ada anoreksia berat (mau makan meski sedikit), tidak ada komplikasi medis akut.",
      pertanyaan: "Tatalaksana gizi yang paling tepat untuk Rani saat ini?",
      opsi: [
        { id: "a", teks: "Langsung berikan RUTF (Ready-to-Use Therapeutic Food) 200 kcal/kgBB/hari" },
        { id: "b", teks: "Rawat jalan dengan pemberian RUSF/RUTF (F100 ekuivalen) + edukasi intensif orang tua + kontrol tiap 1–2 minggu" },
        { id: "c", teks: "Rawat inap, mulai F75 fase stabilisasi (100 kcal/kgBB/hari) terlebih dahulu" },
        { id: "d", teks: "Berikan vitamin dan mineral saja, diet tidak perlu diubah" },
      ],
      jawabanBenar: "b",
      penjelasan: "Tanpa komplikasi + mau makan = kandidat rawat jalan (IMAM — Integrated Management of Acute Malnutrition). Berikan RUTF atau makanan terapeutik berbasis lokal. F75/F100 (WHO therapeutic diet) digunakan untuk gizi buruk dengan komplikasi yang dirawat inap. Pantau ketat: timbang tiap 1–2 minggu, target kenaikan BB >10 g/kgBB/hari.",
    },
    {
      id: "ftt7",
      judul: "Pesan Dokter Senior",
      tipeInput: "info",
      narasi: `Bagus sekali! Kasus gizi buruk/kurang yang tidak ditangani serius adalah penyebab 45% kematian anak di dunia.

📌 Framework penilaian gizi anak:

3 INDIKATOR WAJIB:
• BB/U (Underweight) → beban gizi keseluruhan
• PB-TB/U (Stunting) → malnutrisi KRONIS
• BB/PB-TB (Wasting) → malnutrisi AKUT

KLASIFIKASI WHO:
• Z-score < -2 SD → masalah gizi
• Z-score < -3 SD → masalah gizi BERAT

TATALAKSANA NUTRISI:
• Rawat jalan (tanpa komplikasi): RUTF/RUSF
• Rawat inap (dengan komplikasi): F75 → F100 → RUTF
• Stabilisasi → Transisi → Rehabilitasi → Follow-up

RED FLAGS (rujuk segera):
• Anoreksia (tidak mau makan sama sekali)
• Edema bilateral
• Komplikasi medis (dehidrasi, infeksi berat, hipoglikemia)
• Tidak ada kenaikan BB setelah 2 minggu terapi`,
      penjelasan: "3 indikator: BB/U (underweight), TB/U (stunting), BB/TB (wasting). Tanpa komplikasi → RUTF rawat jalan. Dengan komplikasi → rawat inap F75.",
    },
  ],
};
