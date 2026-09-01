import type { Kasus } from "../types";

export const kasusIkterus: Kasus = {
  id: "ikterus-neonatus",
  judul: "Ikterus Neonatus — Ambang Fototerapi",
  deskripsi: "Bayi prematur 35 minggu usia 36 jam dengan hiperbilirubinemia. Latih penentuan ambang intervensi dan pemilihan jenis fototerapi.",
  kategori: "neonatus",
  tingkat: "menengah",
  referensi: ["AAP Clinical Practice Guideline Pediatrics 2022", "IDAI Panduan Hiperbilirubinemia 2022"],
  langkah: [
    {
      id: "ik1",
      judul: "Presentasi Pasien",
      tipeInput: "info",
      narasi: `Bayi Siti, perempuan, lahir SC atas indikasi preterm spontan usia gestasi 35 minggu. BB lahir 2.400 gram. Kini usia 36 jam, dirawat di ruang transisi.

Keluhan: Kuning bertambah sejak usia 24 jam, kini tampak kuning hingga setinggi dada–perut (Kramer III).

Pemeriksaan:
• Bilirubin total: 14 mg/dL
• Bilirubin direk: 0,4 mg/dL
• Golongan darah: Ibu O+, Bayi A+ (ada potensi inkompatibilitas ABO)
• Coombs direk: Negatif
• G6PD: Belum diperiksa
• Klinis: Aktif, menyusu baik, tidak ada tanda ensefalopati`,
      penjelasan: "Catat faktor risiko: usia gestasi <38 minggu, potensi inkompatibilitas ABO (meski Coombs negatif), dan G6PD belum diperiksa. Faktor ini mempengaruhi ambang intervensi.",
    },
    {
      id: "ik2",
      judul: "Identifikasi Faktor Risiko",
      tipeInput: "mcq",
      narasi: "Berdasarkan data klinis bayi Siti, identifikasi faktor yang MENURUNKAN ambang batas fototerapi (meningkatkan risiko neurotoksisitas).",
      pertanyaan: "Faktor risiko neurotoksisitas yang relevan pada kasus ini adalah?",
      opsi: [
        { id: "a", teks: "Coombs direk negatif — berarti tidak ada hemolisis, tidak ada faktor risiko" },
        { id: "b", teks: "Usia gestasi 35 minggu (preterm late) dan G6PD belum disingkirkan" },
        { id: "c", teks: "Berat lahir 2.400 gram adalah satu-satunya faktor risiko" },
        { id: "d", teks: "Golongan darah ibu O+ saja tanpa mempertimbangkan faktor lain" },
      ],
      jawabanBenar: "b",
      penjelasan: "Faktor risiko neurotoksisitas: (1) usia gestasi <38 minggu — sel otak lebih rentan ✓, (2) G6PD defisiensi — belum disingkirkan ✓, (3) inkompatibilitas ABO — meski Coombs negatif, hemolisis low-grade tetap mungkin. Coombs negatif tidak 100% menyingkirkan hemolisis ABO.",
    },
    {
      id: "ik3",
      judul: "Keputusan Fototerapi",
      tipeInput: "mcq",
      narasi: "Bayi 35 minggu, usia 36 jam, bilirubin total 14 mg/dL, dengan faktor risiko (preterm late, G6PD belum diketahui).",
      pertanyaan: "Berdasarkan nomogram AAP 2022, keputusan yang tepat untuk bayi ini?",
      opsi: [
        { id: "a", teks: "Pantau saja, ulangi bilirubin 12 jam lagi — belum perlu tindakan" },
        { id: "b", teks: "Mulai fototerapi segera — bilirubin 14 mg/dL sudah melampaui ambang untuk 35 minggu + faktor risiko" },
        { id: "c", teks: "Berikan albumin IV dulu sebelum fototerapi" },
        { id: "d", teks: "Langsung siapkan transfusi tukar tanpa fototerapi dulu" },
      ],
      jawabanBenar: "b",
      penjelasan: "Nomogram AAP 2022: untuk bayi 35 minggu (high-risk karena ada faktor risiko), usia 36 jam, ambang fototerapi ≈11–12 mg/dL. Bilirubin 14 mg/dL SUDAH melampaui ambang → fototerapi segera. Tunggu tidak aman karena bilirubin terus naik.",
      linkKalkulator: { label: "Kalkulator Bilirubin Neonatus", href: "/preview/neonatus" },
    },
    {
      id: "ik4",
      judul: "Pilih Jenis Fototerapi",
      tipeInput: "mcq",
      narasi: "Keputusan sudah diambil: fototerapi diperlukan segera. Bilirubin 14 mg/dL, belum ada tanda ensefalopati.",
      pertanyaan: "Jenis fototerapi yang paling tepat dipilih untuk kondisi ini?",
      opsi: [
        { id: "a", teks: "Fototerapi konvensional 1 lampu, bayi berpakaian lengkap" },
        { id: "b", teks: "Fototerapi intensif — lampu ganda (atas dan bawah) atau sinar tinggi, kulit terekspos maksimal" },
        { id: "c", teks: "Blanket fiberoptik saja, bayi boleh tetap digendong ibu" },
        { id: "d", teks: "Paparan sinar matahari pagi 30 menit saja sudah cukup" },
      ],
      jawabanBenar: "b",
      penjelasan: "Fototerapi INTENSIF diindikasikan saat bilirubin mendekati ambang transfusi tukar atau ada faktor risiko tinggi. Komponen: (1) lampu ganda (atas + bawah/bilibed), (2) paparan kulit maksimal (hanya diapers), (3) jarak lampu 10–30 cm. Irradiansi target ≥30 µW/cm²/nm. Pastikan mata tertutup.",
    },
    {
      id: "ik5",
      judul: "Evaluasi Respons Fototerapi",
      tipeInput: "numerik",
      narasi: "Setelah 6 jam fototerapi intensif, bilirubin diukur ulang: 11,5 mg/dL. Sebelumnya 14 mg/dL.",
      pertanyaan: "Berapa penurunan bilirubin (mg/dL) dalam 6 jam ini?",
      jawabanBenar: 2.5,
      toleransi: 0.1,
      penjelasan: "14 − 11,5 = 2,5 mg/dL dalam 6 jam (= 0,4 mg/dL/jam). Respons fototerapi intensif yang adekuat: penurunan ≥1–2 mg/dL dalam 4–6 jam pertama. Jika respons kurang (turun <1 mg/dL/6 jam), pertimbangkan: memastikan teknik benar, periksa hemolisis aktif, konsul untuk transfusi tukar.",
    },
    {
      id: "ik6",
      judul: "Kapan Fototerapi Dihentikan",
      tipeInput: "mcq",
      narasi: "Bilirubin terus turun dengan fototerapi intensif. Kapan fototerapi dapat dihentikan?",
      pertanyaan: "Kriteria penghentian fototerapi yang paling tepat adalah?",
      opsi: [
        { id: "a", teks: "Setelah tepat 24 jam fototerapi, apapun nilai bilirubin" },
        { id: "b", teks: "Bilirubin sudah di bawah ambang fototerapi (≥2–3 mg/dL di bawah ambang awal)" },
        { id: "c", teks: "Bilirubin di bawah 5 mg/dL untuk semua bayi" },
        { id: "d", teks: "Saat bayi menyusu dengan baik dan tidak tampak kuning secara visual" },
      ],
      jawabanBenar: "b",
      penjelasan: "Fototerapi dihentikan saat bilirubin turun ≥2–3 mg/dL di bawah ambang fototerapi, atau secara klinis bilirubin tidak lagi membahayakan. Setelah stop fototerapi: kontrol bilirubin ulang dalam 12–24 jam untuk deteksi rebound (terutama pada hemolisis). Jangan hanya mengandalkan penilaian visual.",
    },
    {
      id: "ik7",
      judul: "Pesan Dokter Senior",
      tipeInput: "info",
      narasi: `Excellent! Kamu sudah menangani hiperbilirubinemia neonatus dengan tepat.

📌 Poin kunci:

1. FAKTOR RISIKO neurotoksisitas (preterm, G6PD, hemolisis, asfiksia, asidosis, albumin rendah) → TURUNKAN ambang intervensi
2. NOMOGRAM bukan angka mati — usia gestasi + jam usia + faktor risiko menentukan ambang
3. FOTOTERAPI INTENSIF: paparan kulit maksimal, lampu ganda, irradiansi ≥30 µW/cm²/nm
4. EVALUASI RESPONS setelah 4–6 jam pertama
5. PERIKSA G6PD pada semua bayi ikterus — defisiensi sering terlewat
6. ATRESIA BILIER: singkirkan jika ikterus persisten >2 minggu (tinja acholic = emergensi, Kasai sebelum usia 60 hari!)
7. REBOUND bilirubin: kontrol ulang 12–24 jam setelah stop fototerapi`,
      penjelasan: "Kunci diagnosis: nomogram berbasis usia gestasi + usia bayi (jam) + faktor risiko. Kunci terapi: fototerapi intensif + pemantauan ketat + periksa G6PD.",
    },
  ],
};
