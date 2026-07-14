// Katalog skor klinis anak. Item, nilai, ambang, dan logika interpretasi
// disalin PERSIS dari implementasi v17 milik pengguna (array SKOR) agar konsisten
// dan tidak menebak. Setiap interpret adalah fungsi murni.

export interface OpsiSkor {
  teks: string;
  nilai: number;
}

export interface ParameterSkor {
  label: string;
  opsi: OpsiSkor[];
}

export interface HasilInterpretasi {
  kategori: string;
  level: "ok" | "warn" | "crit";
  saran: string;
}

export interface DefinisiSkor {
  id: string;
  emoji: string;
  nama: string;
  ringkas: string;
  ket: string;
  sumber: string;
  maxTotal: number;
  hideTotal?: boolean;
  items: ParameterSkor[];
  interpret: (total: number, vals: number[]) => HasilInterpretasi;
}

export const DAFTAR_SKOR: DefinisiSkor[] = [
  {
    id: "cds",
    emoji: "\uD83D\uDCA7",
    nama: "Skor Dehidrasi (CDS)",
    ringkas: "Derajat dehidrasi",
    ket: "Clinical Dehydration Scale 4-item untuk menilai derajat dehidrasi anak.",
    sumber: "Clinical Dehydration Scale \u2014 Goldman RD dkk., Pediatrics 2008.",
    maxTotal: 8,
    items: [
      { label: "Keadaan umum", opsi: [{ teks: "Normal", nilai: 0 }, { teks: "Haus/gelisah/iritabel", nilai: 1 }, { teks: "Mengantuk, lemas, dingin/berkeringat, atau koma", nilai: 2 }] },
      { label: "Mata", opsi: [{ teks: "Normal", nilai: 0 }, { teks: "Sedikit cekung", nilai: 1 }, { teks: "Sangat cekung", nilai: 2 }] },
      { label: "Membran mukosa (lidah)", opsi: [{ teks: "Lembap", nilai: 0 }, { teks: "Lengket", nilai: 1 }, { teks: "Kering", nilai: 2 }] },
      { label: "Air mata", opsi: [{ teks: "Ada", nilai: 0 }, { teks: "Berkurang", nilai: 1 }, { teks: "Tidak ada", nilai: 2 }] },
    ],
    interpret: (t) => {
      if (t === 0) return { kategori: "Tanpa dehidrasi", level: "ok", saran: "Tidak ada tanda dehidrasi. Lanjutkan cairan rumatan & edukasi tanda bahaya." };
      if (t <= 4) return { kategori: "Dehidrasi ringan\u2013sedang", level: "warn", saran: "Pertimbangkan rehidrasi oral (Rencana Terapi B). Lihat fitur Terapi Cairan." };
      return { kategori: "Dehidrasi sedang\u2013berat", level: "crit", saran: "Rehidrasi agresif (Rencana Terapi C / IV). Nilai ulang ketat & cari tanda syok." };
    },
  },
  {
    id: "croup",
    emoji: "\uD83D\uDDE3\uFE0F",
    nama: "Westley Croup Score",
    ringkas: "Beratnya croup",
    ket: "Menilai beratnya croup (laringotrakeobronkitis).",
    sumber: "Westley CR dkk., Am J Dis Child 1978.",
    maxTotal: 17,
    items: [
      { label: "Tingkat kesadaran", opsi: [{ teks: "Normal (termasuk tidur)", nilai: 0 }, { teks: "Disorientasi", nilai: 5 }] },
      { label: "Sianosis", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Saat agitasi", nilai: 4 }, { teks: "Saat istirahat", nilai: 5 }] },
      { label: "Stridor", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Saat agitasi", nilai: 1 }, { teks: "Saat istirahat", nilai: 2 }] },
      { label: "Masuknya udara (air entry)", opsi: [{ teks: "Normal", nilai: 0 }, { teks: "Menurun", nilai: 1 }, { teks: "Sangat menurun", nilai: 2 }] },
      { label: "Retraksi", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Ringan", nilai: 1 }, { teks: "Sedang", nilai: 2 }, { teks: "Berat", nilai: 3 }] },
    ],
    interpret: (t) => {
      if (t <= 2) return { kategori: "Croup ringan", level: "ok", saran: "Umumnya rawat jalan. Deksametason dosis tunggal; edukasi tanda perburukan." };
      if (t <= 5) return { kategori: "Croup sedang", level: "warn", saran: "Deksametason + pertimbangkan nebulisasi epinefrin; observasi." };
      if (t <= 11) return { kategori: "Croup berat", level: "crit", saran: "Epinefrin nebul + deksametason, oksigen, observasi ketat di fasilitas dengan kemampuan resusitasi." };
      return { kategori: "Ancaman gagal napas", level: "crit", saran: "Skor \u226512: ancaman gagal napas \u2014 epinefrin nebul + deksametason, oksigen, siapkan jalan napas lanjut & bantuan segera (rujuk ICU)." };
    },
  },
  {
    id: "pas",
    emoji: "\uD83E\uDE79",
    nama: "Pediatric Appendicitis Score (PAS)",
    ringkas: "Kemungkinan apendisitis",
    ket: "Menilai kemungkinan apendisitis akut pada anak dengan nyeri perut.",
    sumber: "Samuel M. Pediatric appendicitis score. J Pediatr Surg 2002.",
    maxTotal: 10,
    items: [
      { label: "Migrasi nyeri dari umbilikus ke perut kanan bawah", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Anoreksia", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Mual / muntah", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Nyeri tekan perut kanan bawah", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 2 }] },
      { label: "Nyeri saat batuk/perkusi/melompat (kanan bawah)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 2 }] },
      { label: "Demam \u2265 38\u00B0C", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Leukositosis (\u2265 10.000/\u00B5L)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Neutrofilia (neutrofil > 75%)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
    ],
    interpret: (t) => {
      if (t <= 3) return { kategori: "Kemungkinan rendah", level: "ok", saran: "Apendisitis kecil kemungkinannya. Pertimbangkan diagnosis lain; observasi bila perlu." };
      if (t <= 6) return { kategori: "Kemungkinan sedang (equivocal)", level: "warn", saran: "Observasi berseri & pertimbangkan USG/imaging serta konsultasi bedah." };
      return { kategori: "Kemungkinan tinggi", level: "crit", saran: "Kecurigaan apendisitis tinggi \u2014 konsultasi bedah segera." };
    },
  },
  {
    id: "downes",
    emoji: "\uD83E\uDEC1",
    nama: "Downes Score",
    ringkas: "Distres napas neonatus",
    ket: "Menilai derajat distres napas pada neonatus.",
    sumber: "Downes JJ dkk. (Downes\u2013Vidyasagar), 1970/1971.",
    maxTotal: 10,
    items: [
      { label: "Frekuensi napas", opsi: [{ teks: "< 60 x/menit", nilai: 0 }, { teks: "60\u201380 x/menit", nilai: 1 }, { teks: "> 80 x/menit atau apnea", nilai: 2 }] },
      { label: "Sianosis", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Ada saat menghirup udara ruangan", nilai: 1 }, { teks: "Tetap ada dengan FiO\u2082 40%", nilai: 2 }] },
      { label: "Masuknya udara (air entry)", opsi: [{ teks: "Baik/jelas", nilai: 0 }, { teks: "Menurun/tertunda", nilai: 1 }, { teks: "Nyaris tak terdengar", nilai: 2 }] },
      { label: "Merintih (grunting)", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Terdengar dengan stetoskop", nilai: 1 }, { teks: "Terdengar tanpa stetoskop", nilai: 2 }] },
      { label: "Retraksi", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Ringan", nilai: 1 }, { teks: "Berat", nilai: 2 }] },
    ],
    interpret: (t) => {
      if (t <= 3) return { kategori: "Distres napas ringan", level: "ok", saran: "Distres ringan. Pemantauan berkala & nilai ulang tiap jam (penilaian berseri lebih penting daripada satu kali)." };
      if (t <= 6) return { kategori: "Distres napas sedang", level: "warn", saran: "Pertimbangkan analisa gas darah & bantuan napas (mis. CPAP). Pantau ketat." };
      return { kategori: "Distres berat / ancaman gagal napas", level: "crit", saran: "Dukungan napas segera & analisa gas darah. Skor \u22657 terkait risiko mortalitas lebih tinggi." };
    },
  },
  {
    id: "pass",
    emoji: "\uD83C\uDF2C\uFE0F",
    nama: "Pediatric Asthma Severity Score (PASS)",
    ringkas: "Beratnya serangan asma",
    ket: "Menilai beratnya serangan asma anak (usia 1\u201318 th).",
    sumber: "Gorelick MH dkk., Acad Emerg Med 2004. (Ambang kategori bersifat indikatif.)",
    maxTotal: 6,
    items: [
      { label: "Mengi (wheezing)", opsi: [{ teks: "Tidak ada / ringan", nilai: 0 }, { teks: "Sedang", nilai: 1 }, { teks: "Berat atau tidak terdengar (aliran udara buruk)", nilai: 2 }] },
      { label: "Usaha napas (retraksi / otot bantu)", opsi: [{ teks: "Normal / sedikit menurun", nilai: 0 }, { teks: "Sedang", nilai: 1 }, { teks: "Berat", nilai: 2 }] },
      { label: "Perpanjangan ekspirasi", opsi: [{ teks: "Normal / sedikit memanjang", nilai: 0 }, { teks: "Cukup memanjang", nilai: 1 }, { teks: "Sangat memanjang", nilai: 2 }] },
    ],
    interpret: (t) => {
      if (t <= 2) return { kategori: "Serangan ringan", level: "ok", saran: "Bronkodilator sesuai protokol; nilai respons. PASS berguna dipantau sebelum & sesudah terapi." };
      if (t <= 4) return { kategori: "Serangan sedang", level: "warn", saran: "Bronkodilator berulang + kortikosteroid sistemik; observasi respons." };
      return { kategori: "Serangan berat", level: "crit", saran: "Terapi agresif (nebulisasi berulang/kontinu, steroid, oksigen); pertimbangkan rawat / ICU." };
    },
  },
  {
    id: "kawasaki",
    emoji: "\uD83C\uDF53",
    nama: "Kriteria Kawasaki (AHA)",
    ringkas: "Diagnosis Kawasaki",
    ket: "Kriteria diagnosis penyakit Kawasaki klasik.",
    sumber: "AHA 2017 (McCrindle dkk., Circulation) & AAP Red Book 2024.",
    maxTotal: 6,
    hideTotal: true,
    items: [
      { label: "Demam \u2265 5 hari", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Injeksi konjungtiva bilateral (non-eksudatif)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Perubahan bibir / rongga mulut (bibir pecah/merah, strawberry tongue)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Perubahan ekstremitas (eritema/edema telapak, deskuamasi)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Ruam polimorfik", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Limfadenopati servikal (\u2265 1,5 cm)", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
    ],
    interpret: (_t, vals) => {
      const demam = vals[0] === 1;
      let jml = 0;
      for (let i = 1; i < vals.length; i++) jml += vals[i]?? 0;
      if (!demam) return { kategori: "Kriteria belum terpenuhi", level: "warn", saran: `Demam \u22655 hari (syarat utama) belum ada. Kriteria utama saat ini ${jml}/5. Dokter berpengalaman dapat mendiagnosis dini bila demam \u22654 hari dengan \u22654 kriteria menonjol. Pantau.` };
      if (jml >= 4) return { kategori: "Memenuhi kriteria KD klasik", level: "crit", saran: `Demam \u22655 hari + ${jml}/5 kriteria utama \u2192 Kawasaki klasik. Ekokardiografi & terapi IVIG + aspirin sesegera mungkin.` };
      if (jml >= 2) return { kategori: "Curiga KD inkomplet", level: "warn", saran: `Demam + ${jml}/5 kriteria. Evaluasi lab (CRP/LED, trombosit, albumin, ALT, leukosit urin) & ekokardiografi.` };
      return { kategori: "Kurang mendukung", level: "ok", saran: `Demam + ${jml}/5 kriteria. Kriteria KD klasik belum terpenuhi; pertimbangkan diagnosis lain & pantau.` };
    },
  },
  {
    id: "centor",
    emoji: "\uD83E\uDDA0",
    nama: "Skor Centor (Modifikasi McIsaac)",
    ringkas: "Faringitis streptokokus",
    ket: "Estimasi kemungkinan faringitis streptokokus grup A (GAS).",
    sumber: "Centor RM 1981; McIsaac WJ, CMAJ 1998.",
    maxTotal: 5,
    items: [
      { label: "Usia", opsi: [{ teks: "3\u201314 tahun", nilai: 1 }, { teks: "15\u201344 tahun", nilai: 0 }, { teks: "\u2265 45 tahun", nilai: -1 }] },
      { label: "Eksudat / pembengkakan tonsil", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "KGB servikal anterior nyeri/bengkak", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Suhu > 38\u00B0C", opsi: [{ teks: "Tidak", nilai: 0 }, { teks: "Ya", nilai: 1 }] },
      { label: "Batuk", opsi: [{ teks: "Ada", nilai: 0 }, { teks: "Tidak ada", nilai: 1 }] },
    ],
    interpret: (t) => {
      if (t <= 1) return { kategori: "Risiko rendah", level: "ok", saran: "Kemungkinan GAS rendah. Tidak perlu tes/antibiotik; terapi suportif." };
      if (t <= 3) return { kategori: "Risiko sedang", level: "warn", saran: "Lakukan tes cepat antigen strep (RADT); beri antibiotik bila positif." };
      return { kategori: "Risiko tinggi", level: "crit", saran: "Pertimbangkan terapi empiris antibiotik (idealnya tetap konfirmasi dengan tes)." };
    },
  },
  {
    id: "tbanak",
    emoji: "\uD83E\uDE7B",
    nama: "Skoring TB Anak",
    ringkas: "Skoring TB pada anak",
    ket: "Sistem skoring untuk diagnosis TB pada anak (Tabel 3.1). Ambang diagnosis: skor \u22656.",
    sumber: "Petunjuk Teknis Manajemen dan Tatalaksana TB pada Anak \u2014 Kemenkes RI, 2016.",
    maxTotal: 13,
    items: [
      { label: "Kontak TB", opsi: [{ teks: "Tidak jelas", nilai: 0 }, { teks: "Laporan keluarga, BTA (\u2013)/tidak jelas/tidak tahu", nilai: 2 }, { teks: "BTA (+)", nilai: 3 }] },
      { label: "Uji tuberkulin (Mantoux)", opsi: [{ teks: "Negatif / tidak dilakukan", nilai: 0 }, { teks: "Positif (\u226510 mm, atau \u22655 mm pada imunokompromais)", nilai: 3 }] },
      { label: "Berat badan / keadaan gizi", opsi: [{ teks: "Normal", nilai: 0 }, { teks: "BB/TB <90% atau BB/U <80%", nilai: 1 }, { teks: "Gizi buruk klinis atau BB/TB <70% atau BB/U <60%", nilai: 2 }] },
      { label: "Demam tanpa sebab jelas", opsi: [{ teks: "Tidak / <2 minggu", nilai: 0 }, { teks: "\u22652 minggu", nilai: 1 }] },
      { label: "Batuk kronik", opsi: [{ teks: "Tidak / <2 minggu", nilai: 0 }, { teks: "\u22652 minggu", nilai: 1 }] },
      { label: "Pembesaran KGB kolli, aksila, inguinal", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "\u22651 cm, >1 KGB, tidak nyeri", nilai: 1 }] },
      { label: "Pembengkakan tulang/sendi (panggul, lutut, falang)", opsi: [{ teks: "Tidak ada", nilai: 0 }, { teks: "Ada pembengkakan", nilai: 1 }] },
      { label: "Foto toraks", opsi: [{ teks: "Normal / kelainan tidak jelas", nilai: 0 }, { teks: "Gambaran sugestif (mendukung) TB", nilai: 1 }] },
    ],
    interpret: (t, vals) => {
      if (t >= 6) return { kategori: "Diagnosis TB anak (klinis)", level: "crit", saran: "Skor \u22656 \u2192 tegakkan diagnosis TB anak dan mulai terapi OAT sesuai pedoman. Evaluasi respons pengobatan secara berkala." };
      const tuberkulinPositif = vals[1] === 3;
      const adaKontak = (vals[0] ?? 0) >= 2;
      if (tuberkulinPositif || adaKontak) return { kategori: "TB anak klinis (skor <6, ada faktor kunci)", level: "crit", saran: "Skor <6 namun uji tuberkulin (+) dan/atau ada kontak TB paru \u2192 dapat ditegakkan sebagai TB anak klinis. Pertimbangkan mulai OAT (sesuai alur diagnosis TB anak)." };
      return { kategori: "Belum dapat didiagnosis TB", level: "warn", saran: "Skor <6 tanpa uji tuberkulin (+)/kontak TB paru \u2192 observasi gejala selama 2 minggu. Bila gejala menetap, evaluasi ulang; bila menghilang, kemungkinan bukan TB." };
    },
  },
];
