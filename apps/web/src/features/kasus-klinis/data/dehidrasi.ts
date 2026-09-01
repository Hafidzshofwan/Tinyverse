import type { Kasus } from "../types";

export const kasusDehidrasi: Kasus = {
  id: "dehidrasi-rencana-c",
  judul: "Dehidrasi Berat — Rencana C WHO",
  deskripsi: "Bayi 10 bulan dengan diare cair profus, letargis, tidak mampu minum. Latih kemampuan klasifikasi dehidrasi dan penghitungan cairan IV.",
  kategori: "dehidrasi",
  tingkat: "menengah",
  referensi: ["WHO Pocket Book of Hospital Care for Children 2013", "IDAI Panduan Diare Akut 2019"],
  langkah: [
    {
      id: "d1",
      judul: "Presentasi Pasien",
      tipeInput: "info",
      narasi: `Bayi Arif, laki-laki, 10 bulan, BB 8 kg, dibawa ke IGD karena diare cair 8× sejak kemarin disertai muntah 5×. Sejak pagi anak tidak mau minum sama sekali dan tampak sangat lemas.

Pemeriksaan fisik:
• Keadaan umum: Letargis, tampak sangat sakit
• Nadi: 148×/mnt, lemah
• RR: 46×/mnt
• Suhu: 37,8°C
• Mata: Sangat cekung, air mata tidak ada
• Mulut dan lidah: Sangat kering
• Ubun-ubun besar: Sangat cekung
• Turgor kulit: Kembali sangat lambat (>3 detik)
• CRT: 4 detik`,
      penjelasan: "Perhatikan kombinasi tanda klinis: letargis/tidak sadar, mata sangat cekung, tidak bisa minum, dan turgor sangat buruk. Kumpulkan informasi sebelum memutuskan tatalaksana.",
    },
    {
      id: "d2",
      judul: "Klasifikasi Dehidrasi",
      tipeInput: "mcq",
      narasi: "Berdasarkan temuan pada pemeriksaan fisik di atas (letargis, mata sangat cekung, tidak bisa minum, turgor kembali sangat lambat):",
      pertanyaan: "Klasifikasi dehidrasi yang paling tepat pada bayi Arif adalah?",
      opsi: [
        { id: "a", teks: "Tanpa dehidrasi" },
        { id: "b", teks: "Dehidrasi ringan–sedang" },
        { id: "c", teks: "Dehidrasi berat" },
        { id: "d", teks: "Syok septik" },
      ],
      jawabanBenar: "c",
      penjelasan: "Dehidrasi BERAT (WHO): ≥2 dari 3 tanda utama: (1) letargis/tidak sadar ✓, (2) mata sangat cekung ✓, (3) tidak bisa minum atau minum sangat lemah ✓, (4) turgor kembali sangat lambat ✓. Pada kasus ini keempat tanda terpenuhi → dehidrasi berat. Rencana C (cairan IV) wajib segera dimulai.",
    },
    {
      id: "d3",
      judul: "Pilih Rencana Rehidrasi",
      tipeInput: "mcq",
      narasi: "Bayi Arif terklasifikasi dehidrasi berat dan tidak mampu minum sama sekali.",
      pertanyaan: "Rencana rehidrasi WHO yang tepat untuk kondisi ini adalah?",
      opsi: [
        { id: "a", teks: "Rencana A — oralit di rumah (50–100 mL setiap BAB)" },
        { id: "b", teks: "Rencana B — oralit 75 mL/kgBB selama 3–4 jam di faskes" },
        { id: "c", teks: "Rencana C — cairan IV segera (RL 100 mL/kgBB)" },
        { id: "d", teks: "Tunggu sampai anak mau minum, baru mulai oralit" },
      ],
      jawabanBenar: "c",
      penjelasan: "Rencana C digunakan untuk dehidrasi berat atau ketidakmampuan minum. Cairan pilihan: Ringer Laktat (RL). Total 100 mL/kgBB dibagi: 30 mL/kgBB dalam 1 jam pertama (bayi <12 bulan), lanjut 70 mL/kgBB dalam 5 jam berikutnya.",
      linkKalkulator: { label: "Buka Kalkulator Cairan", href: "/preview/cairan" },
    },
    {
      id: "d4",
      judul: "Hitung Fase Cepat",
      tipeInput: "numerik",
      narasi: "Fase cepat Rencana C untuk bayi <12 bulan: Ringer Laktat 30 mL/kgBB diberikan dalam 1 jam pertama. BB Arif = 8 kg.",
      pertanyaan: "Berapa mL cairan yang diberikan pada fase cepat (30 mL/kgBB) untuk bayi BB 8 kg?",
      jawabanBenar: 240,
      toleransi: 0,
      penjelasan: "30 mL/kgBB × 8 kg = 240 mL Ringer Laktat diberikan dalam 1 jam pertama. Pantau nadi, turgor, dan CRT setiap 15–30 menit. Jika memburuk atau syok → percepat tetesan.",
      linkKalkulator: { label: "Buka Kalkulator Cairan", href: "/preview/cairan" },
    },
    {
      id: "d5",
      judul: "Hitung Total Cairan 24 Jam",
      tipeInput: "numerik",
      narasi: "Total Rencana C = 100 mL/kgBB (30 mL/kgBB fase cepat + 70 mL/kgBB fase lanjutan). BB Arif = 8 kg.",
      pertanyaan: "Berapa mL total cairan IV Rencana C untuk bayi BB 8 kg?",
      jawabanBenar: 800,
      toleransi: 0,
      penjelasan: "100 mL/kgBB × 8 kg = 800 mL total. Rincian: 240 mL dalam 1 jam pertama, dilanjutkan 560 mL (70 mL × 8) dalam 5 jam berikutnya. Tambahkan cairan rumatan terpisah (Holliday-Segar) jika ada kebutuhan tambahan.",
      linkKalkulator: { label: "Buka Kalkulator Cairan", href: "/preview/cairan" },
    },
    {
      id: "d6",
      judul: "Evaluasi Setelah 1 Jam",
      tipeInput: "mcq",
      narasi: "Setelah 1 jam fase cepat (240 mL), kondisi Arif membaik: turgor kembali cepat, nadi kuat, CRT 2 detik, mulai mau minum sedikit. Mata masih sedikit cekung.",
      pertanyaan: "Tatalaksana yang paling tepat dilanjutkan?",
      opsi: [
        { id: "a", teks: "Hentikan infus, langsung pulangkan dengan oralit Rencana A" },
        { id: "b", teks: "Lanjutkan sisa 560 mL IV dalam 5 jam, sambil mulai oralit bertahap" },
        { id: "c", teks: "Berikan bolus tambahan 20 mL/kgBB karena belum pulih sempurna" },
        { id: "d", teks: "Mulai antibiotik IV empiris dan rawat ICU" },
      ],
      jawabanBenar: "b",
      penjelasan: "Evaluasi setelah fase cepat: jika membaik → lanjutkan sisa 70 mL/kgBB dalam 5 jam + mulai oralit bertahap. Jika masih berat → ulangi fase cepat. Antibiotik tidak rutin untuk diare watery; pertimbangkan hanya jika ada kolera atau diare berdarah.",
    },
    {
      id: "d7",
      judul: "Pesan Dokter Senior",
      tipeInput: "info",
      narasi: `Selamat! Kamu berhasil menangani kasus dehidrasi berat dengan benar.

📌 Poin kunci yang harus diingat:

1. KLASIFIKASI cepat dengan 3 tanda utama WHO (letargis, tidak bisa minum, turgor sangat buruk)
2. CAIRAN pilihan: Ringer Laktat (bukan dextrose!) untuk dehidrasi berat
3. KECEPATAN berbeda: bayi <12 bulan → 1 jam + 5 jam; anak ≥12 bulan → 30 menit + 2,5 jam
4. PEMANTAUAN setiap 15–30 menit selama fase cepat
5. ORALIT tetap dimulai secepat mungkin saat anak sudah bisa minum
6. ZINC 10 mg/hari (bayi) atau 20 mg/hari (anak >6 bulan) selama 10–14 hari
7. Tanda bahaya: kejang, penurunan kesadaran, demam >39°C → evaluasi penyebab lain`,
      penjelasan: "WHO Rencana C: RL 100 mL/kgBB total. Fase cepat <12 bulan = 1 jam, ≥12 bulan = 30 menit. Evaluasi ulang setelah setiap fase.",
    },
  ],
};
