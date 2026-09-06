import type { PaketTryOut } from "../types";

export const PAKET_PREDIKSI_JITU_2: PaketTryOut = {
  id: "drill-pediatri-prediksi-jitu-2",
  slug: "drill-pediatri-prediksi-jitu-2",
  judul: "Try Out UKNPDPD Pediatri — Paket 2 (Prediksi Jitu 25 Soal)",
  deskripsi:
    "Neonatologi, Gastrohepatologi, Infeksi Tropis, Respirologi, Gawat Darurat, Neurologi, Tumbuh Kembang, Nutrisi, Endokrinologi",
  durasiMenit: 25,
  passingGradePersen: 66,
  kategori: "uknpdpd",
  kategoriLabel: "Prediksi Jitu UKNPDPD",
  badge: "25 Soal / 25 Menit",
  daftarSoal: [
    {
      id: "pj2-soal-01",
      nomor: 1,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi perempuan lahir post-term pada usia kehamilan 43 minggu. Pasca lahir bayi tidak menangis spontan, tampak sesak napas berat, sianosis perioral, dan retraksi interkostal yang nyata. Pemeriksaan tanda vital menunjukkan HR 140 x/menit dan RR 70 x/menit.",
      pertanyaan:
        "Manakah pernyataan atau temuan pemeriksaan penunjang yang tepat mengenai kondisi pasien tersebut?",
      opsi: [
        {
          id: "a",
          teks: "Riwayat penggunaan ventilasi mekanik jangka panjang merupakan faktor risiko utama",
        },
        {
          id: "b",
          teks: "Pemeriksaan penunjang: infiltrat kasar",
        },
        {
          id: "c",
          teks: "Patofisiologi kelainan ini terutama disebabkan oleh defisiensi surfaktan",
        },
        {
          id: "d",
          teks: "Tatalaksana suportif awal cukup dengan pemberian oksigen bila perlu",
        },
        {
          id: "e",
          teks: "Gangguan keseimbangan asam basa yang paling khas adalah asidosis metabolik",
        },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Gambaran klinis sesuai Meconium Aspiration Syndrome (MAS). Bayi post-term (≥42 minggu) berisiko tinggi MAS karena maturasi usus sudah lengkap dan hipoksia in utero dapat memicu peristalsis sehingga terjadi pengeluaran mekonium in utero yang kemudian teraspirasi saat napas pertama. Temuan foto toraks khas MAS: infiltrat kasar/patchy bilateral (opasitas tidak homogen), hiperinflasi (air trapping), atelektasis fokal, serta risiko pneumotoraks. Analisis pilihan lain yang salah: (A) Ventilator jangka panjang adalah penyebab BPD; (C) Defisiensi surfaktan khas RDS pada bayi prematur; (D) MAS dengan distres berat memerlukan CPAP atau ventilasi mekanik; (E) MAS lebih sering memicu asidosis respiratorik akibat retensi CO₂, bukan semata asidosis metabolik.",
      referensi:
        "Fanaroff AA. Meconium aspiration syndrome. NEJM 2008; Nelson Textbook of Pediatrics 22nd ed. Ch 122; Avery's Neonatology Board Review.",
      linkAlatTerkait: {
        label: "Alur Resusitasi Neonatus",
        href: "/preview/alur",
      },
    },
    {
      id: "pj2-soal-02",
      nomor: 2,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi berusia 28 hari dibawa orang tuanya dengan keluhan tampak kuning sejak lahir, lemas, dan malas menyusu. Dari riwayat obstetri diketahui golongan darah ibu adalah O dan golongan darah bayi adalah A. Pemeriksaan laboratorium menunjukkan kadar bilirubin total 25 mg/dL. Pemeriksaan feses normal kekuningan dan buang air kecil berwarna jernih.",
      pertanyaan:
        "Apakah diagnosis etiologis yang mendasari kondisi hiperbilirubinemia pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Atresia bilier ekstrahepatik" },
        { id: "b", teks: "Breastmilk jaundice" },
        { id: "c", teks: "Inkompatibilitas golongan darah" },
        { id: "d", teks: "Sepsis neonatorum awitan lambat" },
        { id: "e", teks: "Kernicterus fase kronis" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "ABO hemolytic disease of the newborn (HDN): ibu bergolongan darah O secara alami memiliki IgG anti-A dan anti-B yang dapat melewati plasenta, menyebabkan hemolisis eritrosit pada janin/bayi bergolongan darah A atau B sehingga terjadi hiperbilirubinemia indirek berat. Letargi dan bilirubin total 25 mg/dL merupakan tanda bahaya ensefalopati bilirubin yang memerlukan fototerapi intensif atau transfusi tukar sesuai nomogram AAP 2022. Menyingkirkan diagnosis lain: atresia bilier memiliki feses akolik dan urin teh (tidak ada pada kasus ini); breastmilk jaundice biasanya bayi tetap aktif dan muncul setelah minggu pertama; kernicterus adalah komplikasi, bukan diagnosis etiologis primer.",
      referensi:
        "AAP Clinical Practice Guideline — Management of Hyperbilirubinemia in the Newborn Infant ≥35 Weeks Gestation. Pediatrics 2022;150(3):e2022058859.",
      linkAlatTerkait: {
        label: "Kalkulator Bilirubin Neonatus (AAP 2022)",
        href: "/preview/bilirubin",
      },
    },
    {
      id: "pj2-soal-03",
      nomor: 3,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang neonatus berusia 2 hari dibawa ke IGD dengan keluhan mulut kaku mencucu (trismus), spasme otot seluruh tubuh, dan sulit menyusu. Bayi lahir ditolong oleh dukun beranak di rumah. Pada pemeriksaan fisik tali pusat tampak basah, berbau busuk, dan terdapat pus. Pemeriksaan tes spatula didapatkan hasil positif.",
      pertanyaan: "Apakah diagnosis yang paling tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Sepsis neonatorum awitan dini" },
        { id: "b", teks: "Meningitis bakterialis neonatal" },
        { id: "c", teks: "Ensefalopati hipoksik iskemik" },
        { id: "d", teks: "Tetanus neonatorum" },
        { id: "e", teks: "Kejang demam neonatus" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Trias khas tetanus neonatorum: (1) Trismus (kaku mulut, sulit menyusu), (2) Spasme otot generalisata / opistotonus, dan (3) Infeksi umbilikus (omfalitis) sebagai portal masuk Clostridium tetani. Eksotoksin tetanospasmin menghambat pelepasan neurotransmiter inhibitorik (GABA dan glisin) di medula spinalis dan batang otak sehingga memicu rigiditas dan spasme otot. Tes spatula positif: menyentuh faring posterior menimbulkan spasme refleks masseter (bukan refleks muntah). Kejang demam tidak terjadi pada neonatus (membutuhkan demam dan usia >6 bulan).",
      referensi:
        "WHO Vaccine-Preventable Diseases Surveillance Standards — Neonatal Tetanus; IDAI Buku Ajar Infeksi Pediatri; Nelson 22nd ed. Ch 236.",
      linkAlatTerkait: {
        label: "Alur Tata Laksana Kejang Akut",
        href: "/preview/alur",
      },
    },
    {
      id: "pj2-soal-04",
      nomor: 4,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "3A",
      vignette:
        "Seorang bayi berusia 6 bulan dibawa orang tuanya karena keterlambatan perkembangan fisik, di mana anak hanya bisa mengangkat kepala. Pada pemeriksaan fisik didapatkan mikrosefali dengan oksiput menonjol, mikrognatia, clenched fists (jari telunjuk fleksi menindih jari ketiga), rocker-bottom feet / club foot, dan bising jantung pada auskultasi.",
      pertanyaan:
        "Apakah kelainan kromosom yang mendasari gambaran klinis pasien tersebut?",
      opsi: [
        { id: "a", teks: "Trisomi 13 (Patau syndrome)" },
        { id: "b", teks: "Kelainan kromosom 18" },
        { id: "c", teks: "Trisomi 21 (Down syndrome)" },
        { id: "d", teks: "Monosomi X (Turner syndrome)" },
        { id: "e", teks: "Mikrodelesi kromosom 5p (Cri-du-chat)" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Trisomi 18 (Edwards syndrome) memiliki fitur klinis khas: mikrosefali dengan oksiput menonjol, mikrognatia/retrognasia, clenched fists (jari telunjuk menindih jari ketiga), rocker-bottom feet / club foot, kelainan jantung bawaan (VSD, ASD, PDA) pada >90% kasus, dan retardasi psikomotor berat. Membedakan trisomi lain: Trisomi 13 (Patau) khas dengan holoprosensefali, polidaktili, dan bibir/palatum sumbing; Trisomi 21 (Down) khas dengan hipotoni, wajah datar, simian crease, dan fisura palpebra miring ke atas.",
      referensi:
        "Cereda A, Carey JC. The trisomy 18 syndrome. Orphanet J Rare Dis 2012;7:81; Nelson 22nd ed. Ch 100.",
      linkAlatTerkait: {
        label: "Skrining Perkembangan (KPSP)",
        href: "/preview/pertumbuhan?tab=skrining&tool=kpsp",
        icon: "kpsp",
      },
    },
    {
      id: "pj2-soal-05",
      nomor: 5,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 3 tahun dibawa dengan keluhan diare 8 kali per hari. Pada pemeriksaan fisik ditemukan tanda severe acute malnutrition (SAM) berupa iga gambang (+), baggy pants (+), anak tampak gelisah, mata cowong, dan turgor lambat. Berat badan anak 15 kg. Tanda vital: TD 90/60 mmHg, HR 100 x/menit, RR 30 x/menit. Hasil GDS 90 mg/dL.",
      pertanyaan:
        "Bagaimanakah tatalaksana rehidrasi awal yang tepat untuk pasien tersebut sesuai protokol WHO / Kemenkes?",
      opsi: [
        { id: "a", teks: "Ringer Laktat 450 mL IV dalam 30 menit pertama" },
        { id: "b", teks: "Cairan KaEN 1B 150 mL/jam secara intravena" },
        {
          id: "c",
          teks: "ReSoMal 75 cc setiap 30 menit dalam 2 jam pertama",
        },
        {
          id: "d",
          teks: "Bolus Glukosa 10% 75 mL IV dilanjutkan rehidrasi oral",
        },
        {
          id: "e",
          teks: "Oralit standar WHO 1.125 mL per oral dalam kurun 3 jam",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pasien mengalami Severe Acute Malnutrition (SAM) marasmus (iga gambang, baggy pants) dengan dehidrasi tanpa syok (tensi dan denyut nadi masih stabil). Pada anak SAM tanpa syok, rehidrasi intravena standar dihindari karena risiko overload cairan dan gagal jantung. Gunakan ReSoMal (Rehydration Solution for Malnutrition) dengan kandungan natrium lebih rendah serta kalium dan magnesium lebih tinggi. Perhitungan dosis: 5 mL/kgBB setiap 30 menit × BB 15 kg = 75 mL setiap 30 menit selama 2 jam pertama, dilanjutkan 5–10 mL/kg/jam berikutnya. Hasil GDS 90 mg/dL menunjukkan tidak hipoglikemia (batas SAM <54 mg/dL), sehingga bolus glukosa IV tidak diperlukan.",
      referensi:
        "WHO Guideline on Prevention and Management of Wasting and Nutritional Oedema 2023; WHO Pocket Book of Hospital Care for Children 2013, Ch 7; IDAI Rekomendasi SAM.",
      linkAlatTerkait: {
        label: "Kalkulator Terapi Cairan & Rehidrasi",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj2-soal-06",
      nomor: 6,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi berusia 28 hari dibawa orang tuanya ke puskesmas untuk imunisasi. Dari anamnesis diketahui ibu bayi menderita tuberkulosis aktif yang sedang menjalani pengobatan OAT fase lanjutan (konsolidasi). Bayi lahir cukup bulan dan saat ini dalam kondisi klinis sehat tanpa keluhan.",
      pertanyaan:
        "Bagaimanakah rekomendasi pemberian imunisasi BCG dan tatalaksana yang tepat pada bayi tersebut?",
      opsi: [
        {
          id: "a",
          teks: "Segera berikan imunisasi BCG intradermal saat ini juga",
        },
        {
          id: "b",
          teks: "Berikan vaksin BCG bersamaan dengan OAT profilaksis INH",
        },
        {
          id: "c",
          teks: "Tunda BCG, beri profilaksis TB, uji tuberkulin usia 3 bulan",
        },
        {
          id: "d",
          teks: "Tunda imunisasi BCG hingga ibu sembuh tanpa perlu profilaksis",
        },
        {
          id: "e",
          teks: "Berikan OAT kombinasi terapeutik 2RHZ selama 2 bulan terlebih dahulu",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Berdasarkan Catatan Imunisasi IDAI 2023 dan Pedoman Kemenkes/WHO untuk bayi dari ibu dengan TB: (1) Tunda BCG karena pemberian profilaksis INH akan menghambat replikasi kuman vaksin hidup BCG, (2) Mulai Terapi Pencegahan Tuberkulosis (TPT) dengan Isoniazid (INH) 10 mg/kgBB/hari, dan (3) Lakukan uji tuberkulin pada usia 3 bulan. Jika uji tuberkulin negatif dan bayi tidak bergejala, profilaksis INH dilanjutkan hingga genap 6 bulan, kemudian vaksin BCG diberikan minimal 2 minggu setelah profilaksis selesai. Bila tuberkulin positif atau muncul gejala TB aktif, evaluasi dan terapi sebagai TB aktif.",
      referensi:
        "IDAI — Catatan Imunisasi 2023; Kemenkes Juknis ILTB 2020; WHO Operational Handbook on TB Module 5 (2022).",
      linkAlatTerkait: {
        label: "Jadwal & Panduan Imunisasi IDAI",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj2-soal-07",
      nomor: 7,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 24 bulan dibawa ke klinik karena diare 8–10 kali per hari sejak kemarin. Pemeriksaan fisik menunjukkan anak tampak gelisah/rewel, ubun-ubun besar cekung, mata cowong, dan turgor kulit kembali lambat. Berat badan anak 12 kg.",
      pertanyaan:
        "Berapakah kebutuhan cairan oralit pada fase rehidrasi aktif sesuai rencana terapi yang tepat?",
      opsi: [
        {
          id: "a",
          teks: "Cairan Ringer Laktat 360 cc IV dalam 30 menit",
        },
        {
          id: "b",
          teks: "Oralit 360 cc dalam 3 jam pertama",
        },
        {
          id: "c",
          teks: "Oralit 75 cc per oral dalam 3 jam",
        },
        {
          id: "d",
          teks: "Oralit 600 cc dalam 4 jam pertama",
        },
        {
          id: "e",
          teks: "Oralit 900 cc dalam 3 jam",
        },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Pasien mengalami diare akut dengan dehidrasi ringan-sedang (ditemukan 2 atau lebih tanda klinis: gelisah, mata cowong, turgor lambat). Sesuai Rencana Terapi B WHO/Kemenkes (LINTAS DIARE): berikan cairan oralit sebesar 75 mL/kgBB dalam 3 jam di fasilitas kesehatan. Perhitungan: BB 12 kg × 75 mL = 900 mL (cc) oralit dalam 3 jam. Setelah 3 jam, nilai ulang derajat dehidrasi anak untuk menentukan langkah berikutnya. Pilihan A (360 cc) adalah dosis bolus resusitasi syok IV (Rencana C), bukan terapi B oralit.",
      referensi:
        "Kemenkes RI — Buku Saku Lintas Diare (LINTAS DIARE); WHO Treatment of Diarrhoea 2005; IDAI PPM Diare Akut.",
      linkAlatTerkait: {
        label: "Kalkulator Rehidrasi Cairan Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj2-soal-08",
      nomor: 8,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi berusia 12 bulan dibawa dengan keluhan diare dan timbul ruam kemerahan setelah pemberian ASI dihentikan dan beralih ke susu formula sapi. Pada pemeriksaan fisik didapatkan bising usus meningkat dan lesi makulopapular eritema multipel di hampir seluruh tubuh.",
      pertanyaan:
        "Manakah tatalaksana eliminasi nutrisi lini pertama yang paling tepat untuk pasien tersebut?",
      opsi: [
        {
          id: "a",
          teks: "Mengganti dengan susu formula rendah laktosa (low lactose)",
        },
        {
          id: "b",
          teks: "Mengganti dengan susu formula bebas laktosa (lactose-free)",
        },
        {
          id: "c",
          teks: "Tatalaksana: susu terhidrolisis ekstensif",
        },
        {
          id: "d",
          teks: "Menghentikan susu karena diare dan ruam bukan reaksi imunologis",
        },
        {
          id: "e",
          teks: "Mengganti langsung dengan susu formula kedelai (soy formula) konsentrasi tinggi",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Cow's Milk Protein Allergy (CMA) merupakan reaksi hipersensitivitas imunologis (baik IgE-mediated maupun non-IgE-mediated) terhadap protein susu sapi (kasein/whey). Manifestasi klinis khas melibatkan sistem gastrointestinal (diare) dan kulit (makula eritema/urtikaria). Tatalaksana lini pertama adalah eliminasi protein susu sapi utuh dengan memberikan formula terhidrolisis ekstensif (Extensively Hydrolyzed Formula / eHF). Bila gejala menetap atau terjadi reaksi anafilaksis berat, diberikan formula asam amino bebas (Amino Acid Formula / AAF). Formula bebas laktosa tidak mengatasi kelainan ini karena protein kasein/whey masih tetap utuh.",
      referensi:
        "WAO/EAACI DRACMA Guideline Update; ESPGHAN CMA Position Paper 2012; IDAI UKK Alergi-Imunologi.",
    },
    {
      id: "pj2-soal-09",
      nomor: 9,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi berusia 1 bulan dibawa ke IGD dengan keluhan kejang sisi kiri dan penurunan kesadaran. Bayi lahir di rumah ditolong oleh dukun beranak dan tidak pernah mendapatkan suntikan setelah lahir. Pada pemeriksaan fisik didapatkan konjungtiva anemis dan fontanel anterior menonjol tegang. Hasil laboratorium menunjukkan PT dan aPTT memanjang.",
      pertanyaan:
        "Apakah patofisiologi utama yang mendasari kondisi perdarahan intrakranial pada pasien tersebut?",
      opsi: [
        {
          id: "a",
          teks: "Defisiensi faktor VIII dan IX herediter",
        },
        {
          id: "b",
          teks: "Destruksi trombosit autoimun akibat antibodi maternal",
        },
        {
          id: "c",
          teks: "Defisiensi faktor von Willebrand kongenital",
        },
        {
          id: "d",
          teks: "Defisiensi kompleks protrombin yang didapat",
        },
        {
          id: "e",
          teks: "Koagulasi intravaskular diseminata sekunder akibat sepsis berat",
        },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kasus ini merupakan Vitamin K Deficiency Bleeding (VKDB) tipe late (awitan lambat, usia 2–12 minggu) dengan manifestasi tersering berupa perdarahan intrakranial (kejang fokal, fontanel anterior tegang/menonjol, penurunan kesadaran, anemia). Faktor risiko utama adalah lahir di dukun tanpa injeksi profilaksis vitamin K1 saat lahir. Defisiensi vitamin K menyebabkan kegagalan aktivasi faktor pembekuan darah yang bergantung pada vitamin K (faktor II, VII, IX, dan X) sehingga terjadi pemanjangan PT dan aPTT. Kondisi ini dikenal sebagai Acquired Prothrombin Complex Deficiency (APCD) / Defisiensi kompleks protrombin yang didapat.",
      referensi:
        "IDAI Rekomendasi Profilaksis Vitamin K Neonatus; Shearer MJ. Vitamin K deficiency bleeding. Lancet 2009.",
    },
    {
      id: "pj2-soal-10",
      nomor: 10,
      subdivisi: "gawat-darurat",
      subdivisiLabel: "Gawat Darurat Pediatri",
      tingkatSKDI: "4A",
      vignette:
        "Seorang neonatus aterm dengan berat badan 3 kg dilahirkan tidak menangis spontan dan tonus otot lunglai. Telah dilakukan ventilasi tekanan positif (VTP) efektif, koreksi langkah SRMROPA, serta kompresi dada terkoordinasi (3:1) selama 60 detik. Evaluasi menunjukkan denyut jantung (HR) tetap 50 x/menit.",
      pertanyaan:
        "Apakah langkah intervensi farmakologis selanjutnya yang tepat sesuai panduan AHA/AAP NRP 2025?",
      opsi: [
        {
          id: "a",
          teks: "Hentikan resusitasi dan berikan natrium bikarbonat IV",
        },
        {
          id: "b",
          teks: "Lanjutkan kompresi dada + epinefrin 0,2 mg IV bolus",
        },
        {
          id: "c",
          teks: "VTP + epinefrin 0,03 mg/kg IV (1:10.000)",
        },
        {
          id: "d",
          teks: "Berikan bolus cairan kristaloid 30 mL/kg dalam 5 menit",
        },
        {
          id: "e",
          teks: "Berikan atropin sulfat 0,02 mg/kg intravena",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Indikasi pemberian epinefrin dalam resusitasi neonatus (NRP) adalah bila denyut jantung tetap <60 x/menit setelah VTP efektif selama 30 detik diikuti kompresi dada terkoordinasi dengan VTP (3:1) selama 60 detik. Berdasarkan panduan AHA/AAP NRP 2025, dosis epinefrin intravena (IV/UVC) adalah 0,01–0,03 mg/kgBB menggunakan larutan 1:10.000 (setara 0,1–0,3 mL/kg larutan 1:10.000). Untuk bayi BB 3 kg: dosis IV adalah 0,03–0,09 mg IV (0,3–0,9 mL larutan 1:10.000). Pilihan 0,2 mg IV melebihi batas dosis rekomendasi dan berisiko memicu hipertensi berat, vasokonstriksi perifer ekstrem, serta bradikardia paradoksikal.",
      referensi:
        "AHA/AAP Neonatal Resuscitation Program (NRP) 2025. Pediatrics 2025;157(1):e2025074352.",
      linkAlatTerkait: {
        label: "Alur Resusitasi Neonatus",
        href: "/preview/alur",
      },
    },
    {
      id: "pj2-soal-11",
      nomor: 11,
      subdivisi: "tumbuh-kembang",
      subdivisiLabel: "Tumbuh Kembang",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 2,5 tahun dibawa ke posyandu untuk pemantauan tumbuh kembang rutin. Berdasarkan plotting pada kurva standar WHO didapatkan indeks antropometri: BB/U berada di antara 0 dan +1 SD, TB/U berada di antara -2 dan -3 SD, serta BB/TB berada di antara -2 dan -1 SD.",
      pertanyaan:
        "Bagaimanakah interpretasi status pertumbuhan dan status gizi anak tersebut menurut standar WHO?",
      opsi: [
        { id: "a", teks: "BB normal, Gizi baik, Pendek" },
        {
          id: "b",
          teks: "Berat badan kurang (underweight), gizi kurang, perawakan normal",
        },
        {
          id: "c",
          teks: "Berat badan normal, gizi kurang, perawakan sangat pendek",
        },
        {
          id: "d",
          teks: "Berat badan lebih, gizi baik, perawakan pendek (stunted)",
        },
        {
          id: "e",
          teks: "Berat badan normal, gizi baik, perawakan normal",
        },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Berdasarkan standar baku antropometri WHO (WHO Child Growth Standards): (1) BB/U (Weight-for-age) antara 0 sampai +1 SD diinterpretasikan sebagai Berat Badan Normal (-2 SD s.d. +1 SD); (2) TB/U (Height-for-age) antara -2 sampai -3 SD diinterpretasikan sebagai Pendek / Stunted (<-2 SD s.d. -3 SD); (3) BB/TB (Weight-for-height) antara -2 sampai -1 SD diinterpretasikan sebagai Gizi Baik / Normal (-2 SD s.d. +1 SD). Kombinasi stunted dengan gizi baik menandakan kegagalan pertumbuhan linear kronis tanpa adanya malnutrisi/wasting akut saat ini.",
      referensi:
        "WHO Child Growth Standards 2006; Kemenkes RI Tabel Baku Pertumbuhan WHO; IDAI Buku Ajar Nutrisi Pediatri.",
      linkAlatTerkait: {
        label: "Kurva Pertumbuhan & Status Gizi (WHO)",
        href: "/preview/pertumbuhan",
      },
    },
    {
      id: "pj2-soal-12",
      nomor: 12,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi laki-laki berusia 3 hari dibawa ibunya karena kuning sejak hari pertama. Dari anamnesis diketahui bayi jarang disusui karena ASI dirasa masih sedikit. Pemeriksaan fisik menunjukkan ikterus mencapai telapak tangan dan kaki (Kramer IV–V). Kadar bilirubin total serum adalah 15 mg/dL. BAB berwarna kuning cerah dan BAK normal.",
      pertanyaan:
        "Manakah tatalaksana awal paling mendasar yang harus dianjurkan kepada ibu?",
      opsi: [
        {
          id: "a",
          teks: "Hentikan pemberian ASI selama 48 jam dan ganti susu formula",
        },
        {
          id: "b",
          teks: "Lakukan transfusi tukar emergensi segera di ruang rawat intensif",
        },
        { id: "c", teks: "Berikan ASI" },
        {
          id: "d",
          teks: "Berikan suplementasi air putih dan larutan dekstrosa per oral",
        },
        {
          id: "e",
          teks: "Berikan antibiotik spektrum luas dan asam ursodeoksikolat",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Kondisi ini sesuai dengan Suboptimal Intake Hyperbilirubinemia (dahulu disebut breastfeeding jaundice), di mana asupan ASI yang tidak adekuat pada hari-hari pertama memicu dehidrasi ringan, penurunan motilitas usus, dan peningkatan resirkulasi enterohepatik bilirubin. Intervensi utama yang paling fundamental adalah mengoptimalkan dan meningkatkan frekuensi menyusui (minimal 8–12 kali per 24 jam) serta memperbaiki teknik perlekatan ibu-bayi. Catatan terminologi AAP 2022: istilah suboptimal intake hyperbilirubinemia dianjurkan menggantikan breastfeeding jaundice untuk menegaskan bahwa masalahnya ada pada volume asupan, bukan komponen ASI-nya.",
      referensi:
        "AAP Clinical Practice Guideline — Management of Hyperbilirubinemia. Pediatrics 2022;150(3):e2022058859.",
      linkAlatTerkait: {
        label: "Kalkulator Bilirubin Neonatus (AAP 2022)",
        href: "/preview/bilirubin",
      },
    },
    {
      id: "pj2-soal-13",
      nomor: 13,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang bayi prematur lahir pada usia kehamilan 32 minggu, saat ini berusia 2 minggu. Bayi mengalami buang air besar berdarah, muntah residu lambung, suhu 39°C, distensi abdomen, penurunan bising usus, dan riwayat konsumsi susu formula sejak lahir.",
      pertanyaan:
        "Manakah pernyataan di bawah ini yang KURANG TEPAT mengenai tatalaksana necrotizing enterocolitis (NEC)?",
      opsi: [
        {
          id: "a",
          teks: "Pasien harus dipuasakan total (NPO) dan dilakukan dekompresi nasogastrik",
        },
        {
          id: "b",
          teks: "Prematuritas dan pemberian susu formula merupakan faktor risiko mayor",
        },
        {
          id: "c",
          teks: "Foto polos abdomen dapat memperlihatkan gambaran pneumatosis intestinalis",
        },
        {
          id: "d",
          teks: "Antibiotik sesuai kultur (pernyataan kurang tepat)",
        },
        {
          id: "e",
          teks: "Adanya pneumoperitoneum merupakan indikasi tindakan laparotomi eksplorasi",
        },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Necrotizing Enterocolitis (NEC) merupakan kegawatdaruratan bedah neonatal. Prematuritas dan formula feeding adalah faktor risiko mayor. Tatalaksana awal mencakup puasa total (NPO), dekompresi saluran cerna dengan NGT, resusitasi cairan, dan pemberian antibiotik intravena spektrum luas. Pernyataan D kurang tepat karena antibiotik spektrum luas harus segera dimulai secara EMPIRIS tanpa menunggu hasil kultur darah keluar. Menunda antibiotik dapat mempercepat perforasi usus dan syok septik. Temuan patognomonik foto abdomen adalah pneumatosis intestinalis (gas dalam dinding usus).",
      referensi:
        "Neu J, Walker WA. Necrotizing Enterocolitis. NEJM 2011;364:255–264; IDAI Buku Ajar Neonatologi.",
    },
    {
      id: "pj2-soal-14",
      nomor: 14,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak berusia 3 tahun dibawa dengan keluhan demam selama 5 hari berturut-turut. Pada pemeriksaan fisik didapatkan ruam di tubuh, bengkak dan eritema pada tangan serta kaki, konjungtivitis bilateral non-purulen, strawberry tongue, dan limfadenopati servikal berukuran 2 cm. Hasil laboratorium menunjukkan leukosit 15.000/uL.",
      pertanyaan: "Apakah diagnosis yang paling tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Demam Scarlet (Scarlet fever)" },
        { id: "b", teks: "Campak (Morbili)" },
        { id: "c", teks: "Penyakit Kawasaki" },
        { id: "d", teks: "Juvenile Idiopathic Arthritis tipe sistemik" },
        { id: "e", teks: "Sindrom Syok Toksik (TSS)" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Kriteria diagnosis Penyakit Kawasaki (AHA 2024): demam persisten ≥5 hari disertai minimal 4 dari 5 kriteria klinis utama: (1) Injeksi konjungtiva bilateral non-eksudatif, (2) Perubahan mukosa oral (strawberry tongue, bibir eritematosa pecah-pecah), (3) Limfadenopati servikal ≥1,5 cm (biasanya unilateral), (4) Perubahan ekstremitas perifer (eritema/edema palmar-plantar pada fase akut atau deskuamasi periungual pada fase subakut), dan (5) Ruam polimorfik di badan. Kasus ini memenuhi kelima kriteria klinis (5/5). Tatalaksana baku adalah pemberian IVIG 2 g/kg dosis tunggal bersama aspirin untuk mencegah terbentuknya aneurisma arteri koroner.",
      referensi:
        "Jone PN et al. Circulation 2024;150:e481–e500; McCrindle BW et al. Circulation 2017;135:e927–e999.",
    },
    {
      id: "pj2-soal-15",
      nomor: 15,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi berusia 11 bulan dibawa dengan demam tinggi 5 hari, batuk, pilek, konjungtivitis, dan ruam kemerahan yang berawal dari belakang telinga lalu menyebar ke seluruh tubuh. Pada mukosa bukal ditemukan Koplik spot.",
      pertanyaan:
        "Berapakah dosis suplementasi Vitamin A yang tepat diberikan pada pasien tersebut sesuai panduan WHO / Kemenkes?",
      opsi: [
        { id: "a", teks: "Vitamin A 100.000 IU hari 1 dan 2" },
        { id: "b", teks: "Vitamin A 200.000 IU hari 1 dan 2" },
        { id: "c", teks: "Vitamin A 50.000 IU hari 1 dan 2" },
        { id: "d", teks: "Vitamin A 100.000 IU dosis tunggal saja" },
        { id: "e", teks: "Vitamin A 200.000 IU dosis tunggal saja" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Koplik spot (bercak putih keabu-abuan pada mukosa bukal setinggi gigi molar) merupakan tanda patognomonik campak (morbili). Dosis vitamin A WHO/Kemenkes berdasarkan usia: Usia <6 bulan: 50.000 IU/hari selama 2 hari berturut-turut; Usia 6–11 bulan: 100.000 IU/hari (kapsul biru) selama 2 hari berturut-turut; Usia ≥12 bulan: 200.000 IU/hari (kapsul merah) selama 2 hari berturut-turut. Karena bayi berusia 11 bulan, dosis yang tepat adalah 100.000 IU pada hari ke-1 dan ke-2. Dosis ketiga (2–4 minggu kemudian) hanya diindikasikan bila terdapat tanda klinis defisiensi vitamin A nyata.",
      referensi:
        "WHO Measles Position Paper 2023; Kemenkes RI Pedoman Pengendalian Campak dan Rubela; IDAI Jadwal Imunisasi Anak.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/obat",
      },
    },
    {
      id: "pj2-soal-16",
      nomor: 16,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "3A",
      vignette:
        "Seorang bayi berusia 2 minggu dibawa karena tampak somnolen, didapatkan hidrosefalus, korioretinitis, dan kalsifikasi intrakranial difus pada pemeriksaan CT scan kepala. Dari anamnesis diketahui ibu sering mengalami demam saat hamil dan memelihara beberapa kucing di rumah.",
      pertanyaan:
        "Apakah diagnosis etiologis infeksi kongenital yang paling mungkin pada bayi tersebut?",
      opsi: [
        { id: "a", teks: "Sitomegalovirus kongenital" },
        { id: "b", teks: "Rubella kongenital" },
        { id: "c", teks: "Herpes Simplex Virus tipe 2" },
        { id: "d", teks: "Sifilis kongenital" },
        { id: "e", teks: "Toksoplasmosis" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Trias klasik Sabin pada toksoplasmosis kongenital: (1) Hidrosefalus, (2) Korioretinitis, dan (3) Kalsifikasi intrakranial difus pada parenkim otak. Membedakan infeksi kongenital TORCH: Toksoplasmosis memiliki kalsifikasi intrakranial difus; CMV memiliki kalsifikasi periventrikular dan mikrosefali; Rubela memiliki trias katarak, kelainan jantung (PDA/VSD), dan tuli sensorineural. Kucing merupakan inang definitif Toxoplasma gondii di mana oosista infeksius dikeluarkan melalui feses dan dapat mencemari makanan/lingkungan ibu hamil.",
      referensi:
        "CDC Congenital Toxoplasmosis Case Definition 2024; Montoya JG, Liesenfeld O. Lancet 2004.",
    },
    {
      id: "pj2-soal-17",
      nomor: 17,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 5 tahun dibawa dengan batuk berdahak 3 minggu, berat badan sulit naik dalam 3 bulan, dan suhu tubuh subfebris 38°C. Pada pemeriksaan fisik toraks terdengar ronki di apeks paru kanan. Uji tuberkulin menunjukkan hasil positif (indurasi 14 mm). Pemeriksaan TCM belum tersedia. Berat badan anak 18 kg.",
      pertanyaan:
        "Apakah paduan regimen OAT yang tepat diberikan untuk pasien tersebut?",
      opsi: [
        { id: "a", teks: "OAT 2RHZE/4RH" },
        { id: "b", teks: "OAT 2RH/4RH" },
        { id: "c", teks: "OAT 2RHZ/4RH" },
        { id: "d", teks: "Profilaksis INH monoterapi selama 6 bulan" },
        { id: "e", teks: "OAT 2RHZ/4R3H3" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Diagnosis TB anak ditegakkan berdasarkan sistem skoring TB IDAI/Kemenkes: kontak TB (skor 3) + uji tuberkulin positif (skor 3) + batuk kronik ≥2 minggu (skor 1) + gizi kurang/BB tidak naik (skor 1) = total skor ≥6, sehingga diindikasikan pemberian OAT. Regimen OAT lini pertama anak tanpa kecurigaan resistensi adalah 2RHZ/4RH: 2 bulan fase intensif dengan Rifampisin, Isoniazid, dan Pirazinamid harian; dilanjutkan 4 bulan fase lanjutan dengan Rifampisin dan Isoniazid harian. Etambutol (E) umumnya tidak disertakan pada TB anak standar tanpa komplikasi berat untuk menghindari risiko neuritis optik.",
      referensi:
        "IDAI Pedoman Nasional TB Anak 2016; WHO Consolidated Guidelines on TB Module 5 (2022); Kemenkes Juknis Tatalaksana TB Anak.",
    },
    {
      id: "pj2-soal-18",
      nomor: 18,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi berusia 15 bulan dibawa dengan sesak napas, demam, batuk, dan pilek sejak 3 hari yang lalu. Tidak ada riwayat sesak atau mengi serupa sebelumnya. Pada pemeriksaan fisik didapatkan HR 130 x/menit, RR 70 x/menit, wheezing bilateral, dan foto toraks memperlihatkan air trapping serta hiperaerasi kedua lapang paru.",
      pertanyaan: "Apakah diagnosis yang paling tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Serangan asma akut pertama" },
        { id: "b", teks: "Bronkopneumonia bakterialis" },
        { id: "c", teks: "Bronkiolitis" },
        { id: "d", teks: "Pertusis fase kataral" },
        { id: "e", teks: "Laringotrakeitis akut" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Bronkiolitis merupakan infeksi virus akut pada saluran napas bawah (tersering disebabkan oleh RSV) pada bayi dan anak usia <24 bulan. Kriteria diagnosis klinis AAP 2014 & IDAI: anak berusia <2 tahun dengan episode mengi (wheezing) pertama kali dalam hidupnya, didahului gejala ISPA (batuk, pilek, demam subfebris) 1–3 hari, disertai takipnea dan retraksi. Gambaran radiologis khas menunjukkan hiperinflasi, air trapping, dan diafragma mendatar. Tatalaksana utamanya adalah suportif (oksigenasi dan hidrasi), sementara bronkodilator dan kortikosteroid rutin tidak direkomendasikan.",
      referensi:
        "AAP Clinical Practice Guideline — Bronchiolitis. Pediatrics 2014;134:e1474–e1502; IDAI Konsensus Bronkiolitis.",
    },
    {
      id: "pj2-soal-19",
      nomor: 19,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak berusia 6 tahun dibawa ke IGD dengan sesak napas, demam 3 hari, nyeri menelan berat, suara teredam (muffled voice), drooling (air liur menetes), stridor inspiratorik, dan retraksi interkostal. Riwayat imunisasi tidak lengkap. Anak tampak lebih nyaman duduk membungkuk ke depan (posisi tripod).",
      pertanyaan:
        "Apakah gambaran radiologis foto polos jaringan lunak leher lateral yang diharapkan ditemukan?",
      opsi: [
        { id: "a", teks: "Steeple sign" },
        { id: "b", teks: "Thumbprint sign" },
        { id: "c", teks: "Omega-shaped epiglottis" },
        { id: "d", teks: "Double bubble sign" },
        { id: "e", teks: "Sail sign" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Kasus ini merupakan Epiglottitis Akut (biasanya disebabkan Haemophilus influenzae tipe b pada anak yang belum diimunisasi lengkap). Gambaran klinis khas trias 4D: Dysphagia, Drooling, Dysphonia (muffled voice), dan Distress napas. Pada foto polos leher proyeksi lateral tampak pembengkakan epiglotis yang menonjol menyerupai ibu jari (thumbprint sign). Pembeda radiologis: steeple sign ditemukan pada croup (laringotrakeitis) pada foto proyeksi AP; omega-shaped epiglottis khas untuk laringomalasia. Catatan klinis kritis: pengamanan jalan napas (intubasi/trakeostomi) adalah prioritas mutlak dan tidak boleh ditunda demi pemeriksaan foto rontgen.",
      referensi:
        "Nelson Textbook of Pediatrics 22nd ed. Ch 415; Sack JL, Brock CD. Am Fam Physician 2002.",
    },
    {
      id: "pj2-soal-20",
      nomor: 20,
      subdivisi: "respirologi",
      subdivisiLabel: "Respirologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 5 tahun dibawa dengan keluhan batuk 2 minggu dengan bunyi melengking khas, didahului napas panjang, dan sering diakhiri muntah. Riwayat imunisasi dasar tidak lengkap. Di antara serangan batuk tampak mata merah dan sianosis bibir.",
      pertanyaan: "Apakah diagnosis yang paling tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Bronkiolitis" },
        { id: "b", teks: "Asma bronkial persisten" },
        { id: "c", teks: "Tuberkulosis paru anak" },
        { id: "d", teks: "Aspirasi benda asing saluran napas" },
        { id: "e", teks: "Pertussis" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Gejala klinis batuk paroksismal beruntun yang diakhiri suara melengking saat menarik napas dalam (inspiratory whoop) dan muntah pascabatuk (post-tussive emesis) merupakan ciri khas pertusis (batuk rejan / whooping cough) yang disebabkan oleh Bordetella pertussis. Fase klinis pertusis: (1) Fase kataral (1–2 minggu): batuk ringan, pilek; (2) Fase paroksismal (1–6 minggu): batuk whooping, muntah, sianosis; (3) Fase konvalesens: batuk mereda bertahap. Tatalaksana utama adalah antibiotik makrolida (azitromisin atau eritromisin).",
      referensi:
        "CDC Clinical Overview of Pertussis; WHO Pertussis Position Paper 2015; IDAI Jadwal Imunisasi Anak.",
    },
    {
      id: "pj2-soal-21",
      nomor: 21,
      subdivisi: "gawat-darurat",
      subdivisiLabel: "Gawat Darurat Pediatri",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 1 tahun dengan berat badan 10 kg dibawa ke klinik karena kejang. Kejang pertama berlangsung 1 menit lalu berhenti, namun 20 menit kemudian anak kejang lagi. Suhu tubuh 40°C. Belum pernah mendapatkan obat antikejang dan pemeriksaan kaku kuduk (-). Saat tiba di klinik anak masih dalam kondisi kejang.",
      pertanyaan:
        "Bagaimanakah tatalaksana medikamentosa awal yang tepat untuk menghentikan kejang pada anak tersebut?",
      opsi: [
        { id: "a", teks: "Diazepam rektal 10 mg supp" },
        { id: "b", teks: "Fenobarbital 100 mg intramuskular" },
        { id: "c", teks: "Diazepam rektal 5 mg supp" },
        { id: "d", teks: "Parasetamol suppositoria 150 mg" },
        { id: "e", teks: "Midazolam bukal 10 mg" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Tatalaksana akut kejang demam bila akses intravena belum terpasang adalah pemberian diazepam rektal. Berdasarkan pedoman Konsensus Penatalaksanaan Kejang Demam IDAI (cut-off berat badan 12 kg): anak dengan BB ≤12 kg diberikan diazepam rektal 5 mg supositoria; anak dengan BB >12 kg diberikan diazepam rektal 10 mg supositoria. Karena berat badan anak adalah 10 kg (≤12 kg), dosis yang tepat adalah diazepam rektal 5 mg. Jika kejang belum berhenti setelah 5 menit, dapat diulang 1 kali dengan dosis yang sama sebelum merujuk ke rumah sakit.",
      referensi:
        "IDAI Konsensus Penatalaksanaan Kejang Demam 2016 (revisi); WHO ETAT 2016; IDAI Buku Ajar Neurologi Anak.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Kejang Demam",
        href: "/preview/alur",
      },
    },
    {
      id: "pj2-soal-22",
      nomor: 22,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi & Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 7 tahun dibawa ke klinik setelah mengalami demam tinggi selama 4 hari yang membaik setelah minum obat penurun panas, kemudian muncul ruam makulopapular eritematosa generalisata berwarna merah muda saat demam telah mereda.",
      pertanyaan:
        "Apakah etiologi virus yang paling sering mendasari penyakit tersebut?",
      opsi: [
        { id: "a", teks: "Parvovirus B19" },
        { id: "b", teks: "Virus Rubella" },
        { id: "c", teks: "Human herpesvirus 6 (HHV-6)" },
        { id: "d", teks: "Virus Epstein-Barr (EBV)" },
        { id: "e", teks: "Coxsackievirus A16" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pola klinis demam tinggi mendadak selama 3–4 hari yang kemudian turun secara lisis dan segera diikuti munculnya ruam makulopapular eritematosa berwarna merah muda (rose-colored rash) merupakan ciri khas Roseola Infantum (Exanthem Subitum). Lebih dari 90% kasus disebabkan oleh Human Herpesvirus 6 (HHV-6) dan sebagian oleh HHV-7. Berbeda dengan campak di mana ruam muncul saat puncak demam, ruam pada roseola muncul justru saat demam mereda.",
      referensi:
        "Zerr DM et al. Clin Infect Dis 2005; Nelson Textbook of Pediatrics 22nd ed. Ch 279.",
    },
    {
      id: "pj2-soal-23",
      nomor: 23,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki berusia 7 tahun dibawa dengan keluhan tubuh sangat kurus, polidipsia (sering haus), dan poliuria (buang air kecil 4–5 kali setiap malam hari) sejak 1 bulan terakhir. Nafsu makan anak tidak menurun (polifagia). Pemeriksaan laboratorium menunjukkan kadar GDS 450 mg/dL.",
      pertanyaan:
        "Apakah mekanisme patofisiologi utama yang mendasari penyakit pasien tersebut?",
      opsi: [
        { id: "a", teks: "Resistensi reseptor insulin perifer" },
        { id: "b", teks: "Defisiensi insulin absolut" },
        { id: "c", teks: "Hipersekresi hormon glukagon otonom" },
        { id: "d", teks: "Resistensi tubulus ginjal terhadap ADH" },
        { id: "e", teks: "Penurunan sekresi insulin relatif akibat obesitas" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Gejala klasik trias diabetes (poliuria, polidipsia, polifagia) yang disertai penurunan berat badan drastis dan hiperglikemia nyata (GDS 450 mg/dL) pada anak usia sekolah merupakan gambaran Diabetes Melitus Tipe 1. Patofisiologinya adalah proses autoimun yang menyebabkan destruksi sel beta pankreas sehingga terjadi defisiensi insulin absolut. Tatalaksana definitif membutuhkan terapi substitusi insulin eksogen seumur hidup.",
      referensi:
        "ADA Standards of Care in Diabetes 2024; ISPAD Clinical Practice Consensus Guidelines 2022; IDAI Buku Ajar Endokrinologi Anak.",
    },
    {
      id: "pj2-soal-24",
      nomor: 24,
      subdivisi: "nutrisi-metabolik",
      subdivisiLabel: "Nutrisi & Metabolik",
      tingkatSKDI: "3A",
      vignette:
        "Seorang anak berusia 5 tahun dibawa karena kesulitan belajar dan keterlambatan kognitif. Pada pemeriksaan fisik kulit dan rambut tampak jauh lebih cerah (rambut pirang/rambut jagung) dibandingkan anggota keluarga lainnya. Urin anak berbau apek khas seperti tikus (mousy odor).",
      pertanyaan:
        "Manakah pernyataan atau tatalaksana utama yang tepat untuk mencegah penurunan fungsi kognitif lebih lanjut?",
      opsi: [
        {
          id: "a",
          teks: "Pemberian cairan diuresis paksa untuk mempercepat ekskresi asam amino",
        },
        {
          id: "b",
          teks: "Etiologi kelainan diturunkan secara genetik autosomal dominan",
        },
        {
          id: "c",
          teks: "Tatalaksana: diet restriksi fenilalanin",
        },
        {
          id: "d",
          teks: "Pemberian suplemen asam amino fenilalanin dosis tinggi harian",
        },
        {
          id: "e",
          teks: "Pemberian obat perangsang peningkatan enzim fenilalanin hidroksilase",
        },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Fenilketonuria (PKU) adalah kelainan inborn error of metabolism autosomal resesif akibat defisiensi enzim fenilalanin hidroksilase (PAH). Fenilalanin yang tidak dapat diubah menjadi tirosin menumpuk dalam darah dan jaringan saraf, menyebabkan toksisitas otak dan disabilitas intelektual. Akumulasi fenilasetat menimbulkan bau apek khas mousy odor pada urin. Berkurangnya tirosin menghambat sintesis melanin sehingga memicu hipopigmentasi (kulit terang, rambut pirang/jagung). Tatalaksana utama seumur hidup adalah diet restriksi ketat fenilalanin.",
      referensi:
        "Mitchell JJ et al. Phenylalanine hydroxylase deficiency. Genetics in Medicine 2011;13(8):697–707; GeneReviews — PAH Deficiency.",
    },
    {
      id: "pj2-soal-25",
      nomor: 25,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "3A",
      vignette:
        "Seorang anak berusia 2,5 tahun dibawa orang tuanya karena gangguan berjalan. Pada pemeriksaan fisik didapatkan pola jalan spastik serta hipertonus dan refleks fisiologis meningkat nyata pada ekstremitas superior dan inferior dextra (unilateral). Riwayat partus lama dan asfiksia saat lahir. Kontak mata terpantau kurang adekuat.",
      pertanyaan:
        "Apakah klasifikasi cerebral palsy yang paling tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "CP spastik tipe hemiplegik" },
        { id: "b", teks: "CP spastik tipe diplegik" },
        { id: "c", teks: "CP spastik tipe quadriplegik" },
        { id: "d", teks: "CP tipe ataksik" },
        { id: "e", teks: "CP tipe diskinetik" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Cerebral palsy spastik diklasifikasikan berdasarkan distribusi topografi keterlibatan motorik: (1) Hemiplegia: melibatkan satu sisi tubuh (ekstremitas atas dan bawah ipsilateral, pada pasien ini ekstremitas dextra); (2) Diplegia: kedua tungkai bawah terlibat jauh lebih berat dibanding ekstremitas atas; (3) Quadriplegia: keempat ekstremitas dan batang tubuh terlibat secara menyeluruh. Keterlibatan hipertonus unilateral dextra (atas dan bawah) secara spesifik mengarah pada diagnosis CP spastik tipe hemiplegik.",
      referensi:
        "Rosenbaum P et al. Dev Med Child Neurol 2007;49(Suppl 109):8–14; Surveillance of Cerebral Palsy in Europe (SCPE) classification.",
    },
  ],
};
