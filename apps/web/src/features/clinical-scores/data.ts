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
  {
    id: "apgar",
    emoji: "👶",
    nama: "Skor APGAR Neonatus",
    ringkas: "Evaluasi adaptasi awal bayi baru lahir",
    ket: "Pemeriksaan kondisi fisik bayi baru lahir pada menit ke-1 dan menit ke-5 (serta menit ke-10 jika skor <7) untuk menilai kebutuhan resusitasi.",
    sumber: "Apgar V. A proposal for a new method of evaluation of the newborn infant. Curr Res Anesth Analg. 1953;32(4):260-267. AAP & ACOG Committee Opinion No. 644 (2015).",
    maxTotal: 10,
    items: [
      {
        label: "A - Appearance (Warna kulit)",
        opsi: [
          { teks: "Pucat / biru seluruh tubuh", nilai: 0 },
          { teks: "Tubuh merah muda, ekstremitas biru (akrosianosis)", nilai: 1 },
          { teks: "Seluruh tubuh merah muda (pink)", nilai: 2 },
        ],
      },
      {
        label: "P - Pulse (Frekuensi jantung)",
        opsi: [
          { teks: "Tidak ada (0 bpm)", nilai: 0 },
          { teks: "Lambat (< 100 kali/menit)", nilai: 1 },
          { teks: "Normal (≥ 100 kali/menit)", nilai: 2 },
        ],
      },
      {
        label: "G - Grimace (Refleks / respons stimulasi)",
        opsi: [
          { teks: "Tidak ada respon / flaksid", nilai: 0 },
          { teks: "Meringis / gerakan sedikit saat stimulasi", nilai: 1 },
          { teks: "Menangis kuat, batuk, bersin, atau menarik kaki", nilai: 2 },
        ],
      },
      {
        label: "A - Activity (Tonus otot)",
        opsi: [
          { teks: "Lumpuh / lemas / tidak ada gerakan", nilai: 0 },
          { teks: "Fleksi ringan pada ekstremitas (lengan/kaki)", nilai: 1 },
          { teks: "Gerakan aktif, fleksi kuat pada semua ekstremitas", nilai: 2 },
        ],
      },
      {
        label: "R - Respiration (Usaha napas)",
        opsi: [
          { teks: "Tidak bernapas (apnea)", nilai: 0 },
          { teks: "Napas lambat, tidak teratur, menangis lemah", nilai: 1 },
          { teks: "Napas baik/teratur, menangis kuat", nilai: 2 },
        ],
      },
    ],
    interpret: (t) => {
      if (t >= 7) {
        return {
          kategori: "Normal / Adaptasi Baik (Skor 7–10)",
          level: "ok",
          saran: "Bayi dalam kondisi adaptasi baik. Lanjutkan perawatan rutin neonatus, pengeringan, hangat, Inisiasi Menyusu Dini (IMD), dan observasi berkala.",
        };
      }
      if (t >= 4) {
        return {
          kategori: "Asfiksia Sedang (Skor 4–6)",
          level: "warn",
          saran: "Bayi mengalami depresi sedang / asfiksia ringan–sedang. Berikan pembersihan jalan napas, rangsang taktil, oksigenasi/ventilasi tekanan positif (VTP) jika belum bernapas adekuat. Evaluasi ulang APGAR menit ke-5 dan ke-10.",
        };
      }
      return {
        kategori: "Asfiksia Berat / Depresi Berat (Skor 0–3)",
        level: "crit",
        saran: "Bayi mengalami asfiksia berat. Lakukan protokol resusitasi neonatus (NRP/PALS) segera: bersihkan jalan napas, VTP dengan balon & sungkup, kompresi dada bila denyut jantung <60 x/menit, dan persiapkan epinefrin/jalur IV.",
      };
    },
  },
  {
    id: "ballard",
    emoji: "📏",
    nama: "New Ballard Score (Maturitas Gestasi)",
    ringkas: "Estimasi usia kehamilan & maturitas fisik/neuromuskular neonatus",
    ket: "Penilaian maturitas neuromuskular (6 kriteria) dan fisik (6 kriteria) untuk memperkirakan usia gestasi bayi prematur dan aterm (20–44 minggu).",
    sumber: "Ballard JL, Khoury JC, Wedig K, et al. New Ballard Score, expanded to include extremely premature infants. J Pediatr. 1991;119(3):417-423.",
    maxTotal: 50,
    items: [
      {
        label: "1. Posture (Sikap Tubuh)",
        opsi: [
          { teks: "Ekstensi penuh (0°)", nilai: 0 },
          { teks: "Fleksi ringan pada panggul & lutut", nilai: 1 },
          { teks: "Fleksi sedang pada panggul & lutut", nilai: 2 },
          { teks: "Lengan fleksi, kaki fleksi kuat", nilai: 3 },
          { teks: "Fleksi penuh / hiperfleksi 4 ekstremitas", nilai: 4 },
        ],
      },
      {
        label: "2. Square Window (Pergelangan Tangan)",
        opsi: [
          { teks: "> 90° (fleksi minimal)", nilai: -1 },
          { teks: "90°", nilai: 0 },
          { teks: "60°", nilai: 1 },
          { teks: "45°", nilai: 2 },
          { teks: "30°", nilai: 3 },
          { teks: "0° (telapak tangan menempel)", nilai: 4 },
        ],
      },
      {
        label: "3. Arm Recoil (Rekoil Lengan)",
        opsi: [
          { teks: "180° (tidak ada recoil/tetap lurus)", nilai: 0 },
          { teks: "140° – 180° (recoil lambat/parsial)", nilai: 1 },
          { teks: "110° – 140° (recoil moderat)", nilai: 2 },
          { teks: "90° – 110° (recoil cepat)", nilai: 3 },
          { teks: "< 90° (recoil seketika/fleksi kuat)", nilai: 4 },
        ],
      },
      {
        label: "4. Popliteal Angle (Sudut Popliteal)",
        opsi: [
          { teks: "180° (lutut lurus tanpa hambatan)", nilai: -1 },
          { teks: "160°", nilai: 0 },
          { teks: "140°", nilai: 1 },
          { teks: "120°", nilai: 2 },
          { teks: "100°", nilai: 3 },
          { teks: "90°", nilai: 4 },
          { teks: "< 90°", nilai: 5 },
        ],
      },
      {
        label: "5. Scarf Sign (Tanda Selendang)",
        opsi: [
          { teks: "Siku melewati garis aksila kontralateral", nilai: -1 },
          { teks: "Siku mencapai garis aksila anterior kontralateral", nilai: 0 },
          { teks: "Siku mencapai garis puting kontralateral", nilai: 1 },
          { teks: "Siku mencapai prosesus xifoideus (garis tengah)", nilai: 2 },
          { teks: "Siku di antara garis tengah dan puting ipsilateral", nilai: 3 },
          { teks: "Siku tidak mencapai garis tengah", nilai: 4 },
        ],
      },
      {
        label: "6. Heel to Ear (Tumit ke Telinga)",
        opsi: [
          { teks: "Tumit mudah menyentuh telinga (180°)", nilai: -1 },
          { teks: "Tumit mendekati telinga (160°)", nilai: 0 },
          { teks: "Tumit setinggi dada atas (140°)", nilai: 1 },
          { teks: "Tumit setinggi dada bawah (120°)", nilai: 2 },
          { teks: "Tumit setinggi umbilikus (100°)", nilai: 3 },
          { teks: "Tumit di lipat paha / tahanan kuat (<90°)", nilai: 4 },
        ],
      },
      {
        label: "7. Kulit (Skin)",
        opsi: [
          { teks: "Lengket, rapuh, transparan", nilai: -1 },
          { teks: "Gelatinus, merah, translusen", nilai: 0 },
          { teks: "Halus, merah muda, vena terlihat jelas", nilai: 1 },
          { teks: "Pengelupasan superfisial/ruam, sedikit vena", nilai: 2 },
          { teks: "Area pucat & retak, pembuluh jarang", nilai: 3 },
          { teks: "Seperti perkamen, retak dalam, tak ada pembuluh", nilai: 4 },
          { teks: "Seperti kulit penyamak, retak-retak, keriput", nilai: 5 },
        ],
      },
      {
        label: "8. Lanugo",
        opsi: [
          { teks: "Tidak ada lanugo", nilai: -1 },
          { teks: "Jarang (sparse)", nilai: 0 },
          { teks: "Banyak / lebat (abundant)", nilai: 1 },
          { teks: "Mulai menipis", nilai: 2 },
          { teks: "Sebagian besar botak / hilang", nilai: 3 },
          { teks: "Hampir seluruhnya botak", nilai: 4 },
        ],
      },
      {
        label: "9. Permukaan Plantar Telapak Kaki (Plantar Surface)",
        opsi: [
          { teks: "Tumit-ibu jari 40–50 mm (-1) / <40 mm (-2)", nilai: -2 },
          { teks: ">50 mm, tanpa garis lipatan (no crease)", nilai: -1 },
          { teks: "Bercak/garis merah samar di anterior", nilai: 0 },
          { teks: "Garis lipatan melintang anterior saja", nilai: 1 },
          { teks: "Garis lipatan 2/3 anterior telapak", nilai: 2 },
          { teks: "Garis lipatan di seluruh telapak kaki", nilai: 3 },
          { teks: "Lipatan dalam & menonjol di seluruh telapak", nilai: 4 },
        ],
      },
      {
        label: "10. Payudara / Areola (Breast)",
        opsi: [
          { teks: "Tidak teraba / imperceptible", nilai: -1 },
          { teks: "Hampir tidak teraba", nilai: 0 },
          { teks: "Areola datar, tanpa nodul payudara", nilai: 1 },
          { teks: "Areola berbintik, nodul 1–2 mm", nilai: 2 },
          { teks: "Areola terangkat, nodul 3–4 mm", nilai: 3 },
          { teks: "Areola penuh, nodul 5–10 mm", nilai: 4 },
        ],
      },
      {
        label: "11. Mata & Telinga (Eye & Ear)",
        opsi: [
          { teks: "Kelopak mata menyatu rapat (-2) / longgar (-1)", nilai: -1 },
          { teks: "Kelopak terbuka; daun telinga datar & tetap terlipat", nilai: 0 },
          { teks: "Daun telinga sedikit melengkung, lunak, recoil lambat", nilai: 1 },
          { teks: "Daun telinga melengkung baik, lunak tapi cepat recoil", nilai: 2 },
          { teks: "Telinga terbentuk & kaku, instant recoil", nilai: 3 },
          { teks: "Kartilago tebal, telinga sangat kaku", nilai: 4 },
        ],
      },
      {
        label: "12. Genitalia Laki-laki / Perempuan (Genitals)",
        opsi: [
          { teks: "Skrotum datar & halus / Klitoris menonjol & labia datar", nilai: -1 },
          { teks: "Skrotum kosong, rugae samar / Klitoris menonjol, labia minora kecil", nilai: 0 },
          { teks: "Testis di kanalis atas, rugae jarang / Klitoris & labia minora menonjol", nilai: 1 },
          { teks: "Testis mulai turun, rugae sedikit / Majora & minora sama menonjol", nilai: 2 },
          { teks: "Testis sudah di bawah, rugae baik / Majora besar, minora kecil", nilai: 3 },
          { teks: "Testis pendulans, rugae dalam / Majora menutupi penuh klitoris & minora", nilai: 4 },
        ],
      },
    ],
    interpret: (t) => {
      // Linear conversion: 24 + (t / 5) * 2
      const gestasiMinggu = Math.max(20, Math.min(44, Math.round(24 + (t / 5) * 2)));
      if (gestasiMinggu < 28) {
        return {
          kategori: `Preterm Sangat Ekstrem (${gestasiMinggu} Minggu Gestasi)`,
          level: "crit",
          saran: `Total skor ${t} setara dengan estimasi usia gestasi ${gestasiMinggu} minggu. Bayi sangat prematur: memerlukan NICU intensif, termoregulasi ketat, surfaktan/CPAP, nutrisi parenteral, dan pencegahan IVH.`,
        };
      }
      if (gestasiMinggu <= 31) {
        return {
          kategori: `Preterm Sangat / Very Preterm (${gestasiMinggu} Minggu Gestasi)`,
          level: "warn",
          saran: `Total skor ${t} setara dengan estimasi usia gestasi ${gestasiMinggu} minggu. Perawatan NICU/HNC, bantuan respirasi (CPAP), pencegahan hipotermi, dan nutrisi enteral bertahap.`,
        };
      }
      if (gestasiMinggu <= 36) {
        return {
          kategori: `Preterm Moderat / Late Preterm (${gestasiMinggu} Minggu Gestasi)`,
          level: "warn",
          saran: `Total skor ${t} setara dengan estimasi usia gestasi ${gestasiMinggu} minggu. Monitor ketat refleks hisap/minum, suhunya, kadar bilirubin, dan gula darah.`,
        };
      }
      if (gestasiMinggu <= 41) {
        return {
          kategori: `Cukup Bulan / Aterm (${gestasiMinggu} Minggu Gestasi)`,
          level: "ok",
          saran: `Total skor ${t} setara dengan estimasi usia gestasi ${gestasiMinggu} minggu (Aterm). Lanjutkan perawatan rutin neonatus cukup bulan, rawat gabung, dan ASI eksklusif.`,
        };
      }
      return {
        kategori: `Lewat Bulan / Post-term (${gestasiMinggu} Minggu Gestasi)`,
        level: "warn",
        saran: `Total skor ${t} setara dengan estimasi usia gestasi ${gestasiMinggu} minggu. Evaluasi dismaturitas (kulit terkelupas), hipoglikemia, dan sindrom aspirasi mekonium.`,
      };
    },
  },
];
