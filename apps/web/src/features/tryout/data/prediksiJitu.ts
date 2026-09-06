import type { PaketTryOut } from "../types";

export const PAKET_PREDIKSI_JITU: PaketTryOut = {
  id: "drill-pediatri-prediksi-jitu",
  slug: "drill-pediatri-prediksi-jitu",
  judul: "Try Out UKNPDPD Pediatri — Paket 1 (Prediksi Jitu 25 Soal)",
  deskripsi:
    "Neonatologi, Gastrohepatologi, Tumbuh Kembang, Nutrisi & Metabolik, Infeksi Tropis, Alergi & Imunologi, Endokrinologi, Respirologi, Neurologi",
  durasiMenit: 25,
  passingGradePersen: 66,
  kategori: "ukmppd",
  kategoriLabel: "Prediksi Jitu UKMPPD",
  badge: "25 Soal / 25 Menit",
  daftarSoal: [
    {
      id: "pj-soal-01",
      nomor: 1,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki baru saja dilahirkan dari ibu G4P3A0 usia kehamilan 40–41 minggu. Pasca dilahirkan bayi tampak sesak napas. Pada pemeriksaan tanda-tanda vital didapatkan HR 120 x/menit, RR 70 x/menit, suhu 36,4°C. Pada pemeriksaan fisik didapatkan retraksi intercostal ringan (+/+), tidak ada sianosis sentral atau perifer, terdapat penurunan ringan udara masuk, suara merintih bisa didengar melalui stetoskop.",
      pertanyaan: "Berapakah nilai Down score pasien di atas dan bagaimana interpretasinya?",
      opsi: [
        { id: "a", teks: "Total Down score 3, tidak gawat napas" },
        { id: "b", teks: "Total Down score 4, gawat napas" },
        { id: "c", teks: "Total Down score 5, gawat napas" },
        { id: "d", teks: "Total Down score 6, gawat napas" },
        { id: "e", teks: "Total Down score 7, ancaman gagal napas" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Downes score menilai 5 parameter klinis gawat napas: frekuensi napas, sianosis, retraksi, merintih (grunting), dan udara masuk (air entry), masing-masing diskor 0–2.\n• Frekuensi napas 70 x/menit (60–80 x/m) = 1\n• Sianosis: tidak ada = 0\n• Retraksi interkostal ringan = 1\n• Merintih terdengar dengan stetoskop = 1\n• Penurunan ringan udara masuk = 1\nTotal skor = 4, diinterpretasikan sebagai gawat napas (respiratory distress). Skor >6 dikaitkan dengan ancaman gagal napas (impending respiratory failure).",
      referensi: "Management of Respiratory Distress in the Newborn — Downes Score; Pedoman Pelayanan Medis Neonatus IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Skoring Klinis (Downes Score)",
        href: "/preview/skoring",
      },
    },
    {
      id: "pj-soal-02",
      nomor: 2,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi laki-laki berusia 1 bulan dikonsulkan dari ruangan perawatan dengan keluhan desaturasi yang berulang. Anak lahir dari ibu G1P0A0 usia kehamilan 35–36 minggu dengan BBL 1.900 gram. Pasien dirawat dan mendapatkan ventilasi mekanik selama ini. Pada pemeriksaan fisik didapatkan HR 110 x/menit, RR 75 x/menit, suhu 36,3°C, pernapasan cuping hidung, retraksi interkostal (+/+). Gambaran foto thorax didapatkan area atelektasis dan hiperinflasi.",
      pertanyaan: "Apakah diagnosis yang tepat pada pasien di atas?",
      opsi: [
        { id: "a", teks: "Hyaline Membrane Disease" },
        { id: "b", teks: "Meconium Aspiration Syndrome" },
        { id: "c", teks: "Transient Tachypnea of the Newborn" },
        { id: "d", teks: "Bronchopulmonary Dysplasia" },
        { id: "e", teks: "Bronkopneumonia" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Bronchopulmonary Dysplasia (BPD) merupakan penyakit paru kronik terutama pada bayi prematur yang memerlukan dukungan ventilasi mekanik dan suplementasi oksigen jangka panjang (≥ 28 hari). Faktor pendukung diagnosis adalah prematuritas (35–36 minggu, BBL 1.900 gram), riwayat ventilasi mekanik selama 1 bulan, episode desaturasi berulang, serta temuan radiologis toraks khas berupa kombinasi area atelektasis fokal dan hiperinflasi.",
      referensi: "StatPearls — Bronchopulmonary Dysplasia; Pedoman Pelayanan Medis Neonatus IDAI.",
    },
    {
      id: "pj-soal-03",
      nomor: 3,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi laki-laki berusia 4 hari datang karena tidak aktif dan tidak mau menyusu. Pasien sempat kejang beberapa detik. Pemeriksaan menunjukkan sklera ikterik, kuning sampai telapak tangan dan kaki. Bilirubin total 25 mg/dL.",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "ABO incompatibility" },
        { id: "b", teks: "Rhesus incompatibility" },
        { id: "c", teks: "Atresia bilier" },
        { id: "d", teks: "Breastmilk jaundice" },
        { id: "e", teks: "Kern icterus" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Kadar bilirubin total 25 mg/dL pada neonatus usia 4 hari merupakan hiperbilirubinemia berat yang berisiko menembus sawar darah otak (neurotoksik). Kombinasi hiperbilirubinemia berat dengan gangguan neurologis nyata (letargi/tidak aktif, penolakan minum, dan bangkitan kejang) mengarah pada acute bilirubin encephalopathy yang dapat berujung pada kerusakan permanen (Kernicterus). Pasien memerlukan evaluasi transfusi tukar segera.",
      referensi: "American Academy of Pediatrics — Clinical Practice Guideline: Hyperbilirubinemia (2022); Konsensus IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Bilirubin Neonatus (AAP 2022)",
        href: "/preview/bilirubin",
      },
    },
    {
      id: "pj-soal-04",
      nomor: 4,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi perempuan berusia 4 hari datang ke IGD karena tampak tidak aktif dan tidak merespons seperti biasanya. Anak demam dan rewel sejak kemarin yang semakin tinggi. Pemeriksaan: letargi, HR 130 x/menit, RR 70 x/menit, suhu 38,9°C, leukosit 23.000/µL.",
      pertanyaan: "Apakah diagnosis yang paling tepat?",
      opsi: [
        { id: "a", teks: "Kern icterus" },
        { id: "b", teks: "Tetanus neonatorum" },
        { id: "c", teks: "Early onset sepsis neonatal" },
        { id: "d", teks: "Late onset sepsis neonatal" },
        { id: "e", teks: "Kejang demam kompleks" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Sepsis neonatorum ditegakkan dari tanda infeksi sistemik pada neonatus (letargi/penurunan kesadaran, takipnea, demam tinggi, dan leukositosis nyata 23.000/µL). Usia 4 hari sudah berada dalam spektrum late-onset neonatal sepsis (EOS) yang muncul pada hari-hari awal kehidupan pascapersalinan, sering kali bersumber dari transmisi vertikal saat proses persalinan.",
      referensi: "WHO — Neonatal Sepsis / Infection Guidance; Pedoman Pelayanan Medis IDAI.",
      linkAlatTerkait: {
        label: "Tools Neonatus & Perinatologi",
        href: "/preview/neonatus",
      },
    },
    {
      id: "pj-soal-05",
      nomor: 5,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki berusia 7 hari datang dengan keluhan tampak mecucu, tidak dapat minum susu, dan kaku-kaku. Pasien dilahirkan di dukun beranak dan belum pernah kontrol. Pemeriksaan: HR 130 x/menit, RR 45 x/menit, suhu 38,4°C, mulut mencucu, tangan kaki kaku, perut papan, tali pusat eritem dan berbau tidak sedap.",
      pertanyaan: "Apakah karakteristik etiologi yang tepat?",
      opsi: [
        { id: "a", teks: "Basil gram negatif, berspora, anaerob obligat, drumstick appearance" },
        { id: "b", teks: "Basil gram positif, tidak berspora, anaerob obligat, drumstick appearance" },
        { id: "c", teks: "Basil gram positif, berspora, aerob obligat, drumstick appearance" },
        { id: "d", teks: "Basil gram negatif, berspora, anaerob obligat, tennis racket" },
        { id: "e", teks: "Basil gram positif, berspora, anaerob obligat, tennis racket" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Manifestasi klinis trismus (mulut mencucu), perut papan, spasme tonik ekstremitas, dan infeksi tali pusat pascapersalinan dukun beranak adalah tanda patognomonik Tetanus Neonatorum. Etiologinya adalah Clostridium tetani: bakteri basil Gram positif, pembentuk spora terminal dengan penonjolan khas menyerupai raket tenis (tennis racket) atau pemukul drum (drumstick), serta bersifat anaerob obligat.",
      referensi: "WHO — Tetanus; Buku Ajar Infeksi & Pediatri Tropis IDAI.",
    },
    {
      id: "pj-soal-06",
      nomor: 6,
      subdivisi: "tumbuh-kembang",
      subdivisiLabel: "Tumbuh Kembang",
      tingkatSKDI: "3A",
      vignette:
        "Seorang anak laki-laki berusia 10 tahun memiliki sendi sangat lentur, ibu jari dapat ditekuk ke belakang, perawakan tinggi, ekstremitas dan jari-jari panjang, hipermobilitas sendi dan murmur.",
      pertanyaan: "Apakah diagnosis yang paling mungkin?",
      opsi: [
        { id: "a", teks: "Sindroma Turner" },
        { id: "b", teks: "Sindroma Down" },
        { id: "c", teks: "Sindroma Klinefelter" },
        { id: "d", teks: "Sindroma Marfan" },
        { id: "e", teks: "Sindroma Jacobs" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Sindroma Marfan merupakan kelainan herediter jaringan ikat (autosomal dominan, mutasi gen fibrillin-1 / FBN1). Ciri khasnya adalah habitus marfanoid: perawakan tinggi jangkung, rasio rentang lengan terhadap tinggi badan meningkat, araknodaktili (jari-jari panjang), hipermobilitas sendi / hiperlaksitas ligamen, serta murmur kardiovaskular akibat prolaps katup mitral atau dilatasi akar aorta.",
      referensi: "Nelson Textbook of Pediatrics — Marfan Syndrome.",
    },
    {
      id: "pj-soal-07",
      nomor: 7,
      subdivisi: "tumbuh-kembang",
      subdivisiLabel: "Tumbuh Kembang",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 3 tahun datang ke posyandu untuk kontrol tumbuh kembang. BB 15 kg, TB 100 cm. Z-score antropometri berada dalam garis hijau. KPSP mendapatkan total skor 9.",
      pertanyaan: "Apakah kesimpulan atau kelanjutan yang tepat?",
      opsi: [
        { id: "a", teks: "Dicurigai ada gangguan perkembangan" },
        { id: "b", teks: "Perlu dirujuk ke fasilitas kesehatan lebih lanjut" },
        { id: "c", teks: "Nasehati ibu untuk beri stimulasi lebih kepada anak dan kunjungan ulang" },
        { id: "d", teks: "Jadwalkan kunjungan ulang 2 minggu kemudian" },
        { id: "e", teks: "Dianjurkan dilakukan pemeriksaan ulang pada umur selanjutnya" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Berdasarkan pedoman skrining KPSP (Kuesioner Pra Skrining Perkembangan) Kemenkes RI: Jawaban 'Ya' berjumlah 9 atau 10 berarti perkembangan anak Sesuai dengan Tahap Perkembangannya (S). Tatalaksananya adalah memuji keberhasilan orang tua, menganjurkan kelanjutan stimulasi di rumah, dan menjadwalkan pemeriksaan KPSP rutin pada kelompok umur selanjutnya.",
      referensi: "Kementerian Kesehatan RI — Pedoman Pelaksanaan SDIDTK / KPSP.",
      linkAlatTerkait: {
        label: "Skrining Perkembangan (KPSP)",
        href: "/preview/pertumbuhan?tab=skrining&tool=kpsp",
        icon: "kpsp",
      },
    },
    {
      id: "pj-soal-08",
      nomor: 8,
      subdivisi: "nutrisi-metabolik",
      subdivisiLabel: "Nutrisi & Metabolik",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak perempuan berusia 4 tahun datang karena lemas dan tidak mau makan. Tampak kurus kering, wajah tua, iga gambang, baggy pants, tanpa edema. GDS 40 mg/dL.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "IVFD RL dengan 5% dextrose" },
        { id: "b", teks: "Resomal 5 mL/kg peroral" },
        { id: "c", teks: "Glukosa 10% peroral" },
        { id: "d", teks: "Nutrisi F75 tiap 2 jam" },
        { id: "e", teks: "Glukosa IV 10% 5 mL/kg" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pasien mengalami severe acute malnutrition (SAM) tipe marasmus dengan komplikasi hipoglikemia (GDS 40 mg/dL, di bawah batas waspada 54 mg/dL pada anak malnutrisi berat). Menurut Protokol 10 Langkah Tata Laksana Gizi Buruk WHO/Kemenkes: jika anak masih sadar dan mampu minum, berikan 50 mL larutan glukosa 10% per oral (atau melalui NGT bila sulit menelan), lalu segera lanjutkan dengan formula F-75. (Pemberian glukosa IV 10% 5 mL/kg diindikasikan bila anak tidak sadar, letargis berat, atau mengalami kejang).",
      referensi: "WHO — Inpatient Management of Severe Acute Malnutrition; Pedoman Gizi Buruk Kemenkes RI.",
    },
    {
      id: "pj-soal-09",
      nomor: 9,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki berusia 9 bulan datang untuk imunisasi rutin. Tidak ada keluhan. Imunisasi sebelumnya lengkap dan hanya pernah demam ringan setelah imunisasi.",
      pertanyaan: "Apakah jenis vaksin, cara, dan dosis yang tepat?",
      opsi: [
        { id: "a", teks: "MR, 0,5 mL, intrakutan" },
        { id: "b", teks: "MR, 0,05 mL, subkutan" },
        { id: "c", teks: "MR, 0,5 mL, subkutan" },
        { id: "d", teks: "MR, 0,05 mL, intramuskular" },
        { id: "e", teks: "MR, 0,5 mL, intramuskular" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Vaksin MR (Measles Rubella) pada jadwal program imunisasi dasar nasional Kemenkes RI dan IDAI diberikan pada usia 9 bulan. Vaksin ini merupakan vaksin hidup yang dilemahkan (live-attenuated) dengan volume dosis 0,5 mL yang disuntikkan secara subkutan (SC) pada aspek anterolateral paha atau muskulus deltoid kiri atas.",
      referensi: "Kementerian Kesehatan RI — Program Imunisasi Nasional; Jadwal Imunisasi Rekomendasi IDAI 2024.",
      linkAlatTerkait: {
        label: "Jadwal & Panduan Imunisasi IDAI",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj-soal-10",
      nomor: 10,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 5 tahun datang dengan BAB cair sejak kemarin, 5–10 kali/hari, tanpa lendir dan darah. Turgor kembali cepat.",
      pertanyaan: "Apakah tatalaksana yang tepat, kecuali?",
      opsi: [
        { id: "a", teks: "Rehidrasi oralit setiap kali BAB cair" },
        { id: "b", teks: "Teruskan menu sesuai umur anak" },
        { id: "c", teks: "Antibiotik selektif" },
        { id: "d", teks: "Suplementasi Zinc 10 hari 10 mg per hari" },
        { id: "e", teks: "Edukasi" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Berdasarkan 5 Pilar Tata Laksana Diare (Lintas Diare Kemenkes RI & WHO): (1) Rehidrasi oralit setiap kali diare, (2) Suplementasi Zinc selama 10–14 hari: dosis 10 mg/hari untuk bayi usia < 6 bulan, dan 20 mg/hari untuk anak usia ≥ 6 bulan. Karena anak ini berusia 5 tahun (> 6 bulan), dosis yang tepat adalah 20 mg/hari. Oleh karena itu, opsi D ('Zinc 10 hari 10 mg per hari') adalah tatalaksana yang salah/kecuali. (3) Teruskan makanan/ASI, (4) Antibiotik selektif hanya atas indikasi, (5) Edukasi tanda bahaya.",
      referensi: "WHO — Zinc supplementation in diarrhoea; Pedoman Pengendalian Diare Kemenkes RI.",
      linkAlatTerkait: {
        label: "Kalkulator Rehidrasi Cairan Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj-soal-11",
      nomor: 11,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki berusia 10 bulan mengalami BAB cair setelah pertama kali mengonsumsi susu formula. Feses berbau masam dan anus tampak kemerahan.",
      pertanyaan: "Apakah penunjang terbaik yang dapat digunakan?",
      opsi: [
        { id: "a", teks: "Double blind placebo controlled food challenge" },
        { id: "b", teks: "Radio Allergo Sorbent Test" },
        { id: "c", teks: "Hidrogen breath test" },
        { id: "d", teks: "Skin prick test" },
        { id: "e", teks: "IgE RAST" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Feses yang berbau asam (masam) dan adanya eritema natum perianal (akibat asam laktat hasil fermentasi bakteri kolon) pascapemberian susu formula mengindikasikan intoleransi/malabsorpsi laktosa. Pemeriksaan penunjang noninvasif pilihan terbaik untuk mendeteksi malabsorpsi karbohidrat/laktosa adalah Hydrogen Breath Test (HBT). Opsi DBPCFC, Skin Prick Test, dan RAST digunakan untuk kecurigaan alergi protein susu sapi (CMPA) yang dimediasi reaksi imunologik, bukan defisiensi enzimatik laktase.",
      referensi: "NIDDK/NIH — Diagnosis of Lactose Intolerance; Konsensus Gastrohepatologi Anak IDAI.",
    },
    {
      id: "pj-soal-12",
      nomor: 12,
      subdivisi: "alergi-imunologi",
      subdivisiLabel: "Alergi & Imunologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi perempuan berusia 15 bulan mengalami BAB cair, mual muntah, dan gatal kemerahan seluruh tubuh setelah mulai mengonsumsi susu formula. Pemeriksaan menunjukkan urtikaria generalisata, perut kembung dan bising usus meningkat.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "Rehidrasi cairan IV" },
        { id: "b", teks: "Antibiotik" },
        { id: "c", teks: "Bilas lambung" },
        { id: "d", teks: "Susu bebas laktosa" },
        { id: "e", teks: "Susu terhidrolisir sempurna" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Munculnya gejala sistemik alergi kulit (urtikaria generalisata) bersama keluhan gastrointestinal pascapemberian susu formula mengarah pada Cow's Milk Protein Allergy (CMPA), bukan intoleransi laktosa semata. Susu bebas laktosa tetap mengandung protein susu sapi utuh (kasein/whey) sehingga tidak mengatasi reaksi alergi. Berdasarkan panduan WAO/DRACMA dan IDAI, tatalaksana nutrisi eliminasi lini pertama untuk CMPA adalah susu formula terhidrolisis ekstensif/sempurna (Extensively Hydrolyzed Formula / eHF).",
      referensi: "World Allergy Organization — DRACMA Guideline; Rekomendasi Alergi Susu Sapi IDAI.",
    },
    {
      id: "pj-soal-13",
      nomor: 13,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi laki-laki berusia 14 hari, lahir pada usia gestasi 35–36 minggu, mengonsumsi susu formula sejak lahir, mengalami BAB berdarah dan lendir, muntah, distensi abdomen, eritema dinding abdomen dan bising usus berkurang. Foto abdomen menunjukkan gambaran yang sesuai dengan kasus.",
      pertanyaan: "Apakah tatalaksana awal yang tepat?",
      opsi: [
        { id: "a", teks: "Dekompresi dengan NGT" },
        { id: "b", teks: "Pemberian nutrisi parenteral" },
        { id: "c", teks: "Antibiotik spektrum luas" },
        { id: "d", teks: "Eksisi usus yang nekrotik" },
        { id: "e", teks: "Laparotomi" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Gambaran klinis distensi abdomen, intoleransi minum/muntah, hematokezia, dan eritema dinding abdomen pada bayi prematur pengguna susu formula sangat khas untuk Necrotizing Enterocolitis (NEC). Tata laksana awal medis segera yang esensial adalah menghentikan minum enteral (NPO/puasakan usus) dan melakukan dekompresi lambung dengan NGT, di samping resusitasi cairan intravena dan antibiotik spektrum luas.",
      referensi: "MSD Manual Professional — Necrotizing Enterocolitis; Pedoman Pelayanan Medis IDAI.",
    },
    {
      id: "pj-soal-14",
      nomor: 14,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 8 tahun mengalami penurunan berat badan, cepat lelah, cepat lapar, sering haus dan sering BAK malam hari. GDS 300 mg/dL.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "Metformin" },
        { id: "b", teks: "Glimepirid" },
        { id: "c", teks: "Glibenklamid" },
        { id: "d", teks: "Akarbose" },
        { id: "e", teks: "Insulin" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Gejala klasik poliuria (nokturia), polidipsia, polifagia, dan penurunan berat badan drastis dengan GDS 300 mg/dL pada anak menegakkan diagnosis Diabetes Melitus Tipe 1. Patogenesisnya melibatkan destruksi autoimun sel beta pankreas yang memicu defisiensi insulin absolut, sehingga terapi mutlak substitusi hormon seumur hidup adalah Insulin eksogen. OAD (obat anti-diabetes oral) tidak diindikasikan pada DM tipe 1 anak.",
      referensi: "ISPAD — Clinical Practice Consensus Guidelines 2024: Insulin; Konsensus DM Tipe 1 IDAI.",
    },
    {
      id: "pj-soal-15",
      nomor: 15,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak perempuan berusia 10 tahun sempat pingsan saat mengikuti baris-berbaris. Anak belum sarapan. Pemeriksaan lain dalam batas normal.",
      pertanyaan: "Pada pasien di atas dikatakan kadar gula darah rendah apabila?",
      opsi: [
        { id: "a", teks: "Glukosa plasma <45 mg/dL" },
        { id: "b", teks: "Glukosa plasma <35 mg/dL" },
        { id: "c", teks: "Glukosa plasma <25 mg/dL" },
        { id: "d", teks: "Glukosa plasma <20 mg/dL" },
        { id: "e", teks: "Glukosa plasma <15 mg/dL" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Dalam literatur tradisional pediatri dan bank soal UKMPPD, batas diagnosis hipoglikemia yang memerlukan intervensi klinis dinyatakan bila kadar glukosa plasma < 45 mg/dL (atau < 2,5 mmol/L). Pada pedoman modern, batas kewaspadaan klinis sering digunakan pada angka < 54–60 mg/dL tergantung konteks komorbiditas.",
      referensi: "WHO — Hypoglycaemia in Children; Konsensus Tata Laksana Hipoglikemia pada Anak IDAI.",
    },
    {
      id: "pj-soal-16",
      nomor: 16,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi laki-laki berusia 1 bulan tampak kurang aktif, panjang badan lebih pendek, ubun-ubun besar, makroglossi dan hernia umbilikalis. Kondisi tersebut konsisten dengan hipotiroid kongenital. Saat skrining hipotiroid pada bayi bisa dicurigai hipotiroid ketika?",
      pertanyaan: "Saat skrining hipotiroid pada bayi bisa dicurigai hipotiroid ketika?",
      opsi: [
        { id: "a", teks: "Kadar TSH ≥30 mU/L" },
        { id: "b", teks: "Kadar TSH ≥25 mU/L" },
        { id: "c", teks: "Kadar TSH ≥20 mU/L" },
        { id: "d", teks: "Kadar TSH ≥15 mU/L" },
        { id: "e", teks: "Kadar TSH ≥10 mU/L" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pada program Skrining Hipotiroid Kongenital (SHK) Kementerian Kesehatan RI melalui sampel tetes darah tumit (dried blood spot) pada usia 48–72 jam, ambang batas TSH neonatal yang dicurigai positif (cut-off) adalah TSH ≥ 20 mU/L (atau µU/mL). Bayi dengan hasil ini harus segera di-recall untuk konfirmasi serum fT4 dan TSHs guna memulai terapi levotiroksin sedini mungkin demi mencegah retardasi mental permanen.",
      referensi: "Kementerian Kesehatan RI — Pedoman Skrining Hipotiroid Kongenital; IDAI.",
    },
    {
      id: "pj-soal-17",
      nomor: 17,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 20 bulan mengalami demam tinggi selama sekitar tiga hari. Ruam muncul saat pasien sudah tidak demam. Saat diperiksa suhu 37°C dengan ruam generalisata.",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "Eritema infeksiosum" },
        { id: "b", teks: "Morbili" },
        { id: "c", teks: "Campak jerman" },
        { id: "d", teks: "HFMD" },
        { id: "e", teks: "Roseola Infantum" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Pola khas demam tinggi mendadak selama 3–5 hari tanpa kelainan fokal yang jelas, kemudian demam mereda turun normal (defervescence) dan BERSAMAAN dengan itu muncul ruam makulopapular eritematosa yang menyebar dari badan ke leher dan ekstremitas adalah tanda klasik Roseola Infantum (Exanthema Subitum / Sixth Disease) akibat Human Herpesvirus 6 (HHV-6). Berbeda dengan Morbili di mana ruam timbul saat demam masih memuncak disertai batuk, pilek, konjungtivitis, dan Koplik spot.",
      referensi: "CDC — Roseola / HHV-6 Clinical Information; Buku Ajar Infeksi & Pediatri Tropis IDAI.",
    },
    {
      id: "pj-soal-18",
      nomor: 18,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 6 tahun mengalami ruam kemerahan setelah demam, nyeri kepala dan nyeri tenggorokan. Tonsil membesar dan eritem dengan eksudat putih abu, strawberry tongue, serta ruam generalisata.",
      pertanyaan: "Apakah tatalaksana definitif yang tepat?",
      opsi: [
        { id: "a", teks: "Paracetamol" },
        { id: "b", teks: "Dexametasone" },
        { id: "c", teks: "Metronidazole" },
        { id: "d", teks: "Prednisone" },
        { id: "e", teks: "Penisilin" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Faringotonsilitis eksudatif disertai demam, strawberry tongue, dan ruam makulopapular halus difus menyerupai amplas (sandpaper rash) menandakan Scarlet Fever (Demam Skarlatina) yang diakibatkan oleh eksotoksin Streptococcus beta-hemolyticus grup A (GAS). Terapi definitif etiologik pilihan utama adalah antibiotik golongan Penisilin (atau Amoksisilin oral) selama 10 hari guna mengeradikasi kuman serta mencegah komplikasi demam rematik akut.",
      referensi: "CDC — Clinical Guidance for Scarlet Fever; Red Book AAP.",
    },
    {
      id: "pj-soal-19",
      nomor: 19,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki berusia 6 hari datang ke IGD dengan rewel dan demam tinggi. Ibu sering memberikan daun-daun tradisional di pusar. Pemeriksaan: suhu 38,8°C, keluar pus dari sisa tali pusat dan berbau busuk.",
      pertanyaan: "Apakah terapi awal yang tepat pada pasien di atas?",
      opsi: [
        { id: "a", teks: "Ampisilin intravena" },
        { id: "b", teks: "Gentamisin intravena" },
        { id: "c", teks: "Metronidazole intravena" },
        { id: "d", teks: "Bersihkan dengan chlorhexidine 4% setiap hari" },
        { id: "e", teks: "Normal saline setiap hari" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kondisi ini merupakan Omfalitis (infeksi umbilikus pada neonatus) akibat praktik perawatan tali pusat yang tidak higienis. Sesuai penandaan kunci jawaban bank soal UKMPPD, tindakan perawatan tali pusat lokal yang ditekankan adalah membersihkan dengan larutan antiseptik Chlorhexidine 4% setiap hari. (Catatan evidensi klinis: Pada praktik klinis nyata, bila omfalitis telah disertai manifestasi sistemik seperti demam tinggi dan rewel/letargi, tatalaksana wajib mengombinasikan perawatan lokal dengan antibiotik parenteral spektrum luas seperti ampisilin dan gentamisin untuk mencegah sepsis neonatal).",
      referensi: "WHO — Umbilical Cord Care / Neonatal Infection Prevention; Pedoman Pelayanan Medis IDAI.",
    },
    {
      id: "pj-soal-20",
      nomor: 20,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 7 tahun mengalami nyeri pipi kiri dan demam. Teman sebangku juga mengalami keluhan serupa. Terdapat bengkak antara lobus aurikula dan angulus mandibula sinistra, tanpa fluktuasi.",
      pertanyaan: "Apakah tatalaksana nonfarmakologi yang tepat?",
      opsi: [
        { id: "a", teks: "Antibiotik" },
        { id: "b", teks: "NSAID" },
        { id: "c", teks: "Paracetamol" },
        { id: "d", teks: "Kompres hangat untuk bengkak" },
        { id: "e", teks: "Kompres dingin untuk bengkak" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Pembengkakan di area kelenjar parotis (antara daun telinga dan angulus mandibula yang mengangkat daun telinga) dengan riwayat kontak teman sekolah mengarah pada Parotitis Epidemika (Mumps) akibat infeksi virus Paramyxovirus. Karena bersifat self-limiting, tatalaksana nonfarmakologis untuk meredakan nyeri dan pembengkakan adalah kompres dingin pada area pembengkakan kelenjar, istirahat cukup, dan konsumsi makanan lunak yang tidak asam.",
      referensi: "CDC — Mumps Clinical Overview; Nelson Textbook of Pediatrics.",
    },
    {
      id: "pj-soal-21",
      nomor: 21,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 3 tahun datang ke IGD karena sesak. Disertai demam, batuk dan pilek sejak 2 hari. RR 55/menit, retraksi intercostal minimal, ronki kedua lapang paru. Foto toraks menunjukkan bercak opak.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "Amoksisilin oral 2 × 5 mg/kg" },
        { id: "b", teks: "Amoksisilin oral 2 × 10 mg/kg" },
        { id: "c", teks: "Amoksisilin oral 2 × 40 mg/kg" },
        { id: "d", teks: "Amoksisilin oral 2 × 100 mg/kg" },
        { id: "e", teks: "Amoksisilin oral 2 × 250 mg/kg" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pedoman WHO dan IDAI merekomendasikan antibiotik oral lini pertama untuk pneumonia komunitas rawat jalan pada anak usia 2–59 bulan adalah Amoksisilin oral dosis tinggi 80 mg/kgBB/hari dibagi dalam 2 dosis (yaitu 40 mg/kgBB per kali pemberian, 2 kali sehari) selama 3–5 hari.",
      referensi: "WHO — Guideline on Pneumonia and Diarrhoea in Children; Pedoman Pneumonia Anak IDAI 2025.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/obat",
      },
    },
    {
      id: "pj-soal-22",
      nomor: 22,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 5 tahun mengalami batuk dan demam lebih dari dua minggu, berat badan tidak naik selama tiga bulan. Ayah sedang menjalani pengobatan TB. BB 20 kg. Mantoux positif dan foto toraks curiga TB.",
      pertanyaan: "Apakah tatalaksana fase intensif yang tepat?",
      opsi: [
        { id: "a", teks: "RHZ 1 tablet per hari selama 2 bulan" },
        { id: "b", teks: "RHZ 2 tablet per hari selama 2 bulan" },
        { id: "c", teks: "RHZ 3 tablet per hari selama 2 bulan" },
        { id: "d", teks: "RHZ 4 tablet per hari selama 2 bulan" },
        { id: "e", teks: "RHZ 5 tablet per hari selama 2 bulan" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Berdasarkan pedoman nasional penanggulangan Tuberkulosis Kemenkes RI dan WHO, rejimen OAT anak dengan Kombinasi Dosis Tetap (KDT / FDC RHZ 75/50/150 mg per tablet) pada fase intensif (2 bulan): rentang berat badan 15–24 kg (pada pasien ini BB 20 kg) memperoleh dosis 4 tablet KDT RHZ per hari diminum satu kali setiap hari selama 2 bulan.",
      referensi: "Petunjuk Teknis Tata Laksana Tuberkulosis pada Anak Kemenkes RI / WHO.",
    },
    {
      id: "pj-soal-23",
      nomor: 23,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak perempuan 3,5 tahun datang karena sesak napas dan lebih nyaman duduk. Disertai nyeri telan, suara berubah menjadi serak, dan demam 3 hari. Belum pernah imunisasi. Suhu 39,4°C dan pemeriksaan radiologis sesuai kasus.",
      pertanyaan: "Apakah etiologi yang tepat?",
      opsi: [
        { id: "a", teks: "Bordetella pertussis" },
        { id: "b", teks: "Parainfluenza virus" },
        { id: "c", teks: "Haemophilus influenzae tipe b" },
        { id: "d", teks: "GABHS" },
        { id: "e", teks: "Corynebacterium diphtheriae" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Klinis posisi tripod, disfagia, air liur menetes (drooling), disfonia/suara serak, dan demam tinggi menandakan Epiglotitis Akut (thumb sign pada foto lateral leher). Sebelum era vaksinasi luas, dan pada anak yang belum divaksinasi, etiologi tersering dan paling berbahaya adalah Haemophilus influenzae tipe b (Hib).",
      referensi: "WHO — Haemophilus influenzae type b; Red Book AAP.",
    },
    {
      id: "pj-soal-24",
      nomor: 24,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi laki-laki berusia 4 bulan mengalami sesak berulang yang hilang timbul. Keluhan muncul ketika berbaring, disertai bibir kebiruan dan membaik ketika miring. Laringoskopi menunjukkan gambaran omega-shaped.",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "Croup" },
        { id: "b", teks: "Pseudocroup" },
        { id: "c", teks: "Epiglotitis" },
        { id: "d", teks: "Pertusis" },
        { id: "e", teks: "Laryngomalacia" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Laringomalasia merupakan kelainan kongenital penyebab stridor inspiratorik paling sering pada bayi akibat kelemahan struktur kartilago supraglotis. Gejala khas: stridor yang memburuk pada posisi telentang, menangis, atau menyusu, dan berkurang pada posisi miring atau tengkurap. Temuan visualisasi laringoskopi fleksibel memperlihatkan lipatan epiglotis berbentuk huruf omega (omega-shaped epiglottis) yang kolaps saat inspirasi.",
      referensi: "StatPearls — Laryngomalacia; Nelson Textbook of Pediatrics.",
    },
    {
      id: "pj-soal-25",
      nomor: 25,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 2 tahun datang karena sempat kejang 15 menit sebelum masuk rumah sakit. Kejang sekali, seluruh tubuh, mata mendelik ke atas, durasi sekitar 30 detik, setelah kejang sadar. Tidak ada riwayat kejang sebelumnya. Demam sejak sehari sebelumnya, suhu 39,4°C.",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "Meningitis" },
        { id: "b", teks: "Ensefalitis" },
        { id: "c", teks: "Meningo-ensefalitis" },
        { id: "d", teks: "Kejang demam simpleks" },
        { id: "e", teks: "Kejang demam kompleks" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kejang Demam Sederhana / Simpleks didefinisikan sebagai bangkitan kejang akibat demam pada anak usia 6 bulan–5 tahun yang memenuhi kriteria: (1) Kejang bersifat umum (generalisata), (2) Durasi singkat < 15 menit (di sini sekitar 30 detik), (3) Tidak berulang dalam kurun 24 jam (hanya 1 kali), dan (4) Anak langsung pulih sadar penuh setelah kejang berhenti.",
      referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI 2024; AAP Febrile Seizures Guideline.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Kejang Demam",
        href: "/preview/alur",
      },
    },
  ],
};
