import type { Kasus } from "../types";

export const kasusKejangDemam: Kasus = {
  id: "kejang-demam",
  judul: "Kejang Demam — Sederhana vs Kompleks",
  deskripsi: "Anak 2 tahun dengan kejang fokal saat demam tinggi berlangsung 25 menit. Latih klasifikasi, dosis diazepam rektal, indikasi LP, dan edukasi orang tua.",
  kategori: "neurologi",
  tingkat: "dasar",
  referensi: ["AAP Clinical Report Febrile Seizures 2011", "IDAI Rekomendasi Kejang Demam 2016"],
  langkah: [
    {
      id: "kd1",
      judul: "Presentasi Pasien",
      tipeInput: "info",
      narasi: `Dika, laki-laki, 2 tahun, BB 12 kg, dibawa orang tua ke IGD karena kejang saat demam.

Riwayat kejang: Mulai 30 menit yang lalu. Berlangsung sekitar 25 menit. Hanya mengenai sisi kanan tubuh (tangan dan kaki kanan bergerak ritmis). Setelah kejang berhenti spontan, anak tampak bingung dan tidak mengenali orang tua selama ±30 menit (post-ictal confusion).

Riwayat penyakit: Demam sejak kemarin sore, suhu tertinggi 39,5°C. Tidak ada riwayat infeksi SSP sebelumnya.
Riwayat keluarga: Ada riwayat kejang demam pada kakak (kini sudah tidak kejang).
Riwayat kejang: Pernah kejang demam 1× usia 18 bulan, berhenti <5 menit, generalisata.

Pemeriksaan saat datang (kejang sudah berhenti):
• Kesadaran: Somnolen, post-ictal
• Suhu: 38,8°C
• Nadi: 130×/mnt
• Kaku kuduk: Tidak ada
• Tanda Brudzinski/Kernig: Negatif`,
      penjelasan: "Identifikasi 3 kriteria pembeda: (1) durasi, (2) karakteristik (generalisata/fokal), (3) frekuensi dalam 24 jam. Post-ictal confusion BUKAN kriteria kejang kompleks, tapi merupakan pertanda perlu evaluasi lebih lanjut.",
    },
    {
      id: "kd2",
      judul: "Klasifikasi Kejang",
      tipeInput: "mcq",
      narasi: "Kejang Dika: durasi 25 menit, hanya sisi kanan (fokal), satu episode, disertai demam tinggi, post-ictal 30 menit, sebelumnya pernah kejang demam sederhana.",
      pertanyaan: "Klasifikasi kejang Dika dan alasannya yang paling tepat?",
      opsi: [
        { id: "a", teks: "Kejang demam sederhana — karena pertama kali dengan karakter fokal" },
        { id: "b", teks: "Kejang demam kompleks — memenuhi ≥1 kriteria: fokal DAN durasi >15 menit" },
        { id: "c", teks: "Status epileptikus febris — karena berlangsung >20 menit" },
        { id: "d", teks: "Epilepsi dengan pemicu demam — karena ada riwayat sebelumnya" },
      ],
      jawabanBenar: "b",
      penjelasan: "Kejang Demam KOMPLEKS jika ≥1 dari: (1) durasi >15 menit ✓ (Dika: 25 menit), (2) fokal ✓ (Dika: hanya sisi kanan), (3) berulang dalam 24 jam. Kasus Dika memenuhi 2 kriteria. Bukan status epileptikus karena <30 menit dan SUDAH berhenti. Bukan epilepsi karena selalu ada pemicu demam.",
    },
    {
      id: "kd3",
      judul: "Tatalaksana Akut Kejang",
      tipeInput: "mcq",
      narasi: "Jika Dika tiba di IGD dalam kondisi MASIH KEJANG, apa lini pertama tatalaksana untuk menghentikan kejang?",
      pertanyaan: "Tatalaksana pertama untuk menghentikan kejang demam yang masih berlangsung adalah?",
      opsi: [
        { id: "a", teks: "Fenobarbital IV 20 mg/kgBB — lini pertama untuk kejang" },
        { id: "b", teks: "Diazepam rektal 0,5 mg/kgBB — lini pertama, cepat dan aman" },
        { id: "c", teks: "Fenitoin IV 20 mg/kgBB dalam 20 menit" },
        { id: "d", teks: "Tunggu berhenti sendiri, kejang demam selalu berhenti dalam 5 menit" },
      ],
      jawabanBenar: "b",
      penjelasan: "LINI PERTAMA kejang demam aktif: Diazepam rektal 0,5 mg/kgBB (dapat diulang 1× setelah 5 menit jika belum berhenti). Alternatif: midazolam buccal/intranasal 0,2 mg/kgBB. Jika 2 dosis benzodiazepine gagal → fenobarbital atau fenitoin IV. JANGAN tunggu — kejang >5 menit harus diintervensi.",
    },
    {
      id: "kd4",
      judul: "Hitung Dosis Diazepam",
      tipeInput: "numerik",
      narasi: "Dosis diazepam rektal: 0,5 mg/kgBB. BB Dika = 12 kg. Sediaan tersedia: ampul 10 mg/2 mL.",
      pertanyaan: "Berapa mg dosis diazepam rektal yang diberikan untuk Dika?",
      jawabanBenar: 6,
      toleransi: 0,
      penjelasan: "0,5 mg/kgBB × 12 kg = 6 mg rektal. Dari ampul 10 mg/2 mL → berikan 1,2 mL rektal. Gunakan spuit 2 mL tanpa jarum, masukkan 2–3 cm ke rektum. Sediaan rektal tube yang tersedia di Indonesia: 5 mg (untuk anak <15 kg) dan 10 mg (untuk anak ≥15 kg).",
      linkKalkulator: { label: "Kalkulator Dosis Diazepam", href: "/preview/dosing" },
    },
    {
      id: "kd5",
      judul: "Indikasi Pungsi Lumbal",
      tipeInput: "mcq",
      narasi: "Kejang Dika sudah berhenti. Anak masih post-ictal (somnolen). Tidak ada kaku kuduk. Tanda Brudzinski/Kernig negatif. Namun kejang bersifat fokal dan post-ictal confusion >15 menit.",
      pertanyaan: "Apakah pungsi lumbal (LP) diindikasikan pada kasus Dika?",
      opsi: [
        { id: "a", teks: "Tidak perlu — tanda meningismus negatif sudah cukup menyingkirkan meningitis" },
        { id: "b", teks: "Perlu dipertimbangkan — kejang fokal dan post-ictal confusion berkepanjangan adalah indikasi evaluasi LP" },
        { id: "c", teks: "Wajib dilakukan pada semua kejang demam tanpa kecuali" },
        { id: "d", teks: "Hanya perlu jika demam >40°C" },
      ],
      jawabanBenar: "b",
      penjelasan: "Indikasi LP pada kejang demam (AAP 2011): (1) tanda meningismus/ensefalitis, (2) bayi <12 bulan SANGAT dipertimbangkan, (3) 12–18 bulan dipertimbangkan kuat, (4) sudah mendapat antibiotik (mungkin menutupi tanda), (5) kejang fokal atau post-ictal >1 jam. Kasus Dika memiliki 2 indikasi → LP dipertimbangkan kuat. Tanda negatif membantu tapi tidak cukup untuk menyingkirkan meningitis pada kejang fokal.",
    },
    {
      id: "kd6",
      judul: "Profilaksis Antikonvulsan",
      tipeInput: "mcq",
      narasi: "Dika pulang dalam kondisi baik 6 jam kemudian. Orang tua sangat cemas dan meminta obat antikonvulsan jangka panjang.",
      pertanyaan: "Indikasi pemberian antikonvulsan profilaksis JANGKA PANJANG pada kejang demam adalah?",
      opsi: [
        { id: "a", teks: "Semua kasus kejang demam kompleks otomatis mendapat profilaksis fenobarbital" },
        { id: "b", teks: "Dipertimbangkan jika kejang demam berulang ≥3 kali dalam 12 bulan, atau rekurensi tinggi dengan faktor risiko berat" },
        { id: "c", teks: "Diberikan pada semua anak dengan riwayat kejang demam apapun jenisnya" },
        { id: "d", teks: "Hanya jika ada riwayat epilepsi pada kedua orang tua" },
      ],
      jawabanBenar: "b",
      penjelasan: "Profilaksis KONTINYU (fenobarbital/asam valproat) JARANG diindikasikan dan harus mempertimbangkan efek samping vs manfaat. Pertimbangkan pada: ≥3 episode dalam 12 bulan dengan orang tua sangat cemas. Profilaksis INTERMITEN (diazepam oral saat demam) lebih banyak digunakan namun efektivitasnya masih diperdebatkan (AAP tidak merekomendasikannya secara rutin). Kasus Dika: tidak ada indikasi profilaksis saat ini.",
    },
    {
      id: "kd7",
      judul: "Pesan Dokter Senior",
      tipeInput: "info",
      narasi: `Hebat! Kejang demam adalah kondisi yang sangat sering ditemui di IGD anak.

📌 Yang WAJIB diingat:

KLASIFIKASI:
KD Sederhana: generalisata, <15 menit, tidak berulang dalam 24 jam
KD Kompleks: fokal ATAU >15 menit ATAU berulang dalam 24 jam

TATALAKSANA AKUT:
• <5 menit: Observasi, pastikan jalan napas
• >5 menit: Diazepam rektal 0,5 mg/kgBB (ulangi 1× setelah 5 mnt)
• Gagal 2× benzodiazepin: Fenobarbital IV 20 mg/kgBB
• Tetap gagal: Fenitoin IV / ICU

EDUKASI ORANG TUA (sangat penting!):
✓ Rekurensi: 30% pada episode pertama
✓ Risiko epilepsi di kemudian hari: hanya 2–3%
✓ Jika kejang di rumah: posisikan miring, jangan masukkan apapun ke mulut, hitung durasi, hubungi ambulans jika >5 menit
✓ Sediakan diazepam rektal di rumah, ajarkan cara pemakaian

PROGNOSIS: Sangat baik. Tidak memengaruhi kecerdasan.`,
      penjelasan: "KD Sederhana vs Kompleks: fokal/durasi >15 mnt/berulang 24 jam. Lini 1: diazepam rektal 0,5 mg/kgBB. Edukasi orang tua adalah bagian terpenting tatalaksana.",
    },
  ],
};
