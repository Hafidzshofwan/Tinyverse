import type { PaketTryOut } from "../types";

export const PAKET_TRYOUT_LIST: PaketTryOut[] = [
  {
    id: "ukmppd-stase-anak-1",
    slug: "ukmppd-stase-anak-1",
    judul: "Try Out UKNPDPD Pediatri — Paket 1 (Komprehensif)",
    deskripsi: "Simulasi ujian CBT komprehensif: Respirologi, Neonatologi, Infeksi Tropis, Gastrohepatologi, dan Gawat Darurat Pediatri.",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi UKNPDPD",
    badge: "SKDI 4A / 3B",
    daftarSoal: [
      {
        id: "to-01",
        nomor: 1,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 4 tahun dibawa ke IGD dengan keluhan sesak napas yang semakin memberat sejak 6 jam lalu. Pasien memiliki riwayat asma bronkial sejak usia 2 tahun. Pada pemeriksaan fisik didapatkan anak gelisah, berbicara terputus-putus dalam kata, frekuensi napas 50 kali/menit, denyut nadi 130 kali/menit, SpO2 91% pada udara kamar, tampak retraksi suprasternal dan interkostal nyata, serta terdengar mengi ekspiratoir dan inspiratoir di seluruh lapang paru.",
        pertanyaan: "Tatalaksana medikamentosa awal yang paling tepat diberikan di IGD adalah?",
        opsi: [
          { id: "a", teks: "Inhalasi salbutamol + ipratropium bromida nebulisasi per 20 menit dalam 1 jam pertama + kortikosteroid sistemik oral/IV" },
          { id: "b", teks: "Inhalasi salbutamol dosis tunggal + antibiotik seftriakson intravena" },
          { id: "c", teks: "Injeksi aminofilin bolus intravena + mukolitik nebulisasi" },
          { id: "d", teks: "Inhalasi kortikosteroid dosis rendah secara mandiri tanpa bronkodilator" },
          { id: "e", teks: "Injeksi epinefrin subkutan 0,01 mg/kgBB sebagai lini pertama" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Berdasarkan Pedoman Diagnosis dan Tata Laksana Asma Anak (IDAI 2021) & GINA 2023, pasien mengalami serangan asma derajat berat (gelisah, bicara per kata, retraksi jelas, SpO2 < 92%). Tatalaksana lini pertama di IGD adalah pemberian Short-Acting Beta-2 Agonist (SABA / Salbutamol) dikombinasikan dengan Short-Acting Muscarinic Antagonist (SAMA / Ipratropium Bromida) secara nebulisasi continue/intermiten tiap 20 menit dalam 1 jam pertama, disertai inisiasi dini kortikosteroid sistemik (metilprednisolon/prednison 1–2 mg/kgBB/hari).",
        referensi: "Pedoman Nasional Asma Anak IDAI (2021); Global Initiative for Asthma (GINA 2023).",
        linkAlatTerkait: {
          label: "Buka Penilaian Skoring PAS & Asma",
          href: "/preview/skoring",
        },
      },
      {
        id: "to-02",
        nomor: 2,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Bayi laki-laki berusia 36 jam lahir cukup bulan (38 minggu, BBL 3.100 gram) dari ibu golongan darah O Rh positif. Bayi memiliki golongan darah A Rh positif. Ibu mengeluhkan kulit bayinya tampak kuning hingga ke daerah dada dan perut (Kramer 3). Bayi tampak aktif dan menyusu ASI kuat. Hasil laboratorium menunjukkan kadar Bilirubin Total Serum (TSB) 14,8 mg/dL dengan Bilirubin Direk 0,6 mg/dL. Ambang fototerapi AAP untuk usia dan faktor risiko pasien adalah 12,0 mg/dL.",
        pertanyaan: "Tatalaksana yang paling tepat untuk neonatus ini adalah?",
        opsi: [
          { id: "a", teks: "Observasi rawat jalan dan jemur di bawah sinar matahari pagi 15 menit" },
          { id: "b", teks: "Fototerapi intensif di rumah sakit serta lanjutkan pemberian ASI adekuat" },
          { id: "c", teks: "Transfusi tukar darurat (double volume exchange transfusion)" },
          { id: "d", teks: "Hentikan pemberian ASI dan ganti dengan formula hidrolisat ekstensif" },
          { id: "e", teks: "Pemberian fenobarbital oral 5 mg/kgBB/hari untuk induksi enzim hepar" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Bayi mengalami hiperbilirubinemia indirek dengan inkompatibilitas ABO (Ibu O, Bayi A) yang merupakan faktor risiko neurotoksisitas hemolitik isoimun. Kadar Bilirubin Total (14,8 mg/dL) telah melampaui ambang batas fototerapi AAP (12,0 mg/dL). Terapi pilihan utama adalah inisiasi fototerapi intensif segera disertai optimalisasi hidrasi per oral (ASI diteruskan). Menjemur di bawah sinar matahari tidak direkomendasikan karena inefektif dan berisiko sunburn/hipertermia.",
        referensi: "Kemper AR, et al. Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation. Pediatrics 2022.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Kurva Fototerapi AAP",
          href: "/preview/neonatus",
        },
      },
      {
        id: "to-03",
        nomor: 3,
        subdivisi: "gastrohepatologi",
        subdivisiLabel: "Gastrohepatologi",
        tingkatSKDI: "4A",
        vignette:
          "Anak perempuan berusia 10 bulan (BB 8 kg) dibawa orang tuanya ke puskesmas karena diare cair sejak 2 hari yang lalu, frekuensi BAB 6–8 kali per hari tanpa lendir atau darah. Pada pemeriksaan fisik didapatkan anak rewel dan haus (minum dengan sangat lahap), mata agak cekung, air mata berkurang, dan turgor kulit kembali lambat (1–2 detik).",
        pertanyaan: "Berdasarkan pedoman WHO/IDAI, klasifikasi dehidrasi dan rencana terapi yang tepat adalah?",
        opsi: [
          { id: "a", teks: "Tanpa dehidrasi → Terapi Rencana A di rumah dengan oralit 50–100 mL setiap BAB" },
          { id: "b", teks: "Dehidrasi ringan–sedang → Terapi Rencana B dengan 600 mL oralit dalam 3–4 jam pertama" },
          { id: "c", teks: "Dehidrasi berat → Terapi Rencana C dengan infus Ringer Laktat 240 mL dalam 1 jam" },
          { id: "d", teks: "Dehidrasi ringan–sedang → Terapi antibiotik kotrimoksazol oral + puasakan 6 jam" },
          { id: "e", teks: "Tanpa dehidrasi → Berikan cairan infus D5 1/4 NS kecepatan rumatan" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Pasien memenuhi 2 tanda dehidrasi ringan–sedang menurut klasifikasi WHO: rewel/haus minum lahap, mata cekung, turgor lambat. Tatalaksana yang tepat adalah WHO Rencana B: pemberian Oralit sejumlah 75 mL/kgBB dalam 3–4 jam pertama di fasilitas kesehatan. Untuk BB 8 kg: 75 mL × 8 = 600 mL oralit dalam 3–4 jam pertama, dilanjutkan suplementasi Zinc 20 mg/hari (karena usia > 6 bulan) selama 10–14 hari.",
        referensi: "Buku Saku Pelayanan Kesehatan Anak di Rumah Sakit, WHO 2013; Pedoman Diare Akut IDAI 2019.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Terapi Cairan & Rehidrasi",
          href: "/preview/cairan",
        },
      },
      {
        id: "to-04",
        nomor: 4,
        subdivisi: "neurologi",
        subdivisiLabel: "Neurologi",
        tingkatSKDI: "4A",
        vignette:
          "Anak laki-laki berusia 18 bulan dibawa ke IGD karena kejang saat demam. Kejang berlangsung selama 3 menit berupa kelojotan seluruh tubuh (tonik-klonik umum), mata mendelik ke atas, dan setelah kejang anak menangis lalu tertidur. Ini merupakan kejang pertama kali. Tidak ada riwayat trauma kepala, riwayat keluarga dengan epilepsi disangkal. Pada pemeriksaan fisis pascakejang: Suhu 39,2°C, anak sadar baik, tidak ada tanda rangsang meningeal, defisit neurologis fokal (-).",
        pertanyaan: "Diagnosis yang paling tepat pada pasien ini adalah?",
        opsi: [
          { id: "a", teks: "Kejang Demam Sederhana (Simple Febrile Seizure)" },
          { id: "b", teks: "Kejang Demam Kompleks (Complex Febrile Seizure)" },
          { id: "c", teks: "Epilepsi umum idiopatik" },
          { id: "d", teks: "Meningitis bakterial akut" },
          { id: "e", teks: "Ensefalopati pasca-infeksi" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Kejang Demam Sederhana (KDS) didefinisikan sebagai bangkitan kejang yang berlangsung singkat (< 15 menit), bersifat umum (tonik dan/atau klonik bilateral), tidak berulang dalam kurun waktu 24 jam, dan terjadi pada anak usia 6 bulan hingga 5 tahun yang dipicu oleh demam (bukan infeksi SSP atau gangguan elektrolit). Pasien sadar baik pasca-kejang tanpa tanda rangsang meningeal.",
        referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI (2016); AAP Febrile Seizures Guideline.",
      },
      {
        id: "to-05",
        nomor: 5,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Anak perempuan berusia 6 tahun (BB 20 kg) dirawat pada hari ke-4 demam dengan diagnosis Demam Berdarah Dengue (DBD). Saat ini suhu tubuh mulai turun (37,0°C / fase kritis), namun pasien mengeluh nyeri perut hebat dan lemas. Pada pemeriksaan fisik: TD 100/70 mmHg, HR 108 x/menit, RR 24 x/menit, akral hangat, CRT 2 detik. Hasil laboratorium: Hb 14,8 g/dL, Hematokrit 46% (meningkat 25% dari baseline), Trombosit 38.000/uL.",
        pertanyaan: "Kondisi klinis pasien dan tatalaksana cairan intravena inisial yang tepat adalah?",
        opsi: [
          { id: "a", teks: "DBD derajat II tanpa syok dengan tanda bahaya (warning signs) → Berikan kristaloid isotonis (RL/NaCl 0,9%) 5–7 mL/kgBB/jam selama 1–2 jam" },
          { id: "b", teks: "Dengue Shock Syndrome (DSS) terkompensasi → Berikan bolus koloid 20 mL/kgBB secepatnya" },
          { id: "c", teks: "Fase pemulihan demam dengue → Hentikan cairan intravena untuk mencegah overload" },
          { id: "d", teks: "Trombositopenia refrakter → Lakukan transfusi konsentrat trombosit segera" },
          { id: "e", teks: "DBD derajat I → Terapi cairan rumatan D5 1/4 NS kecepatan lambat 2 mL/kgBB/jam" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Pasien berada pada fase kritis DBD derajat II dengan warning signs (nyeri perut hebat, hemokonsentrasi Ht meningkat > 20%, trombositopenia berat). Berdasarkan Pedoman WHO & IDAI 2014, tatalaksana cairan inisial untuk DBD dengan warning signs tanpa syok adalah infus larutan kristaloid isotonis (Ringer Laktat atau NaCl 0,9%) dengan kecepatan 5–7 mL/kgBB/jam selama 1–2 jam, lalu dititrasi bertahap turun (3–5 mL/kg/jam) sesuai respons klinis dan tren hematokrit. Transfusi trombosit tidak diindikasikan kecuali terdapat perdarahan masif.",
        referensi: "WHO Dengue Guidelines for Diagnosis, Treatment, Prevention and Control (2009); Panduan Praktis Klinis IDAI Infeksi Dengue.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Dosis & Cairan",
          href: "/preview/cairan",
        },
      },
    ],
  },
  {
    id: "ukmppd-stase-anak-2",
    slug: "ukmppd-stase-anak-2",
    judul: "Try Out UKNPDPD Pediatri — Paket 2 (Infeksi & Tumbuh Kembang)",
    deskripsi: "Latihan fokus: Morbili/Campak, Tuberkulosis Anak & Skoring TB, Imunisasi Kejar, Stunting & Gagal Tumbuh, serta Infeksi Saluran Kemih.",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi UKNPDPD",
    badge: "SKDI 4A / 3B",
    daftarSoal: [
      {
        id: "to-2-01",
        nomor: 1,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Anak laki-laki berusia 3 tahun dibawa ke puskesmas dengan demam tinggi 4 hari, batuk pilek (coryza), dan mata merah berair (konjungtivitis). Hari ini muncul ruam makulopapular kemerahan yang bermula dari belakang telinga dan garis rambut, lalu menyebar ke leher dan dada. Pada pemeriksaan mukosa bukal dekat molar bawah ditemukan bercak putih keabuan dengan dasar eritematosa (Koplik spots).",
        pertanyaan: "Diagnosis klinis dan suplementasi mikronutrien esensial yang wajib diberikan sesuai rekomendasi WHO/IDAI adalah?",
        opsi: [
          { id: "a", teks: "Morbili (Campak) → Suplementasi Vitamin A dosis 200.000 IU segera dan hari berikutnya" },
          { id: "b", teks: "Rubella (German Measles) → Suplementasi Vitamin C 500 mg per hari" },
          { id: "c", teks: "Roseola Infantum (Exanthema Subitum) → Terapi Asiklovir oral" },
          { id: "d", teks: "Demam Skarlatina → Suplementasi Zinc 20 mg per hari" },
          { id: "e", teks: "Varisela Zoster → Suplementasi Vitamin D3 1000 IU" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Trias 3C (cough, coryza, conjunctivitis) disertai Koplik's spot dan ruam makulopapular sefalokaudal khas untuk Morbili (Campak). Terapi suportif utama wajib disertai suplementasi Vitamin A dosis tinggi (200.000 IU untuk usia ≥ 12 bulan) yang diberikan dalam 2 dosis (hari ke-1 dan ke-2) guna mencegah defisiensi, kebutaan xerophthalmia, serta komplikasi pneumonia berat.",
        referensi: "Pedoman Teknis Pengendalian Campak-Rubella Kemenkes RI / WHO (2020).",
        linkAlatTerkait: {
          label: "Buka Panduan Imunisasi & Vaksinasi",
          href: "/preview/imunisasi",
        },
      },
      {
        id: "to-2-02",
        nomor: 2,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Anak perempuan berusia 5 tahun dibawa ibunya karena berat badan tidak kunjung naik dan nafsu makan turun selama 3 bulan terakhir. Pasien juga batuk hilang timbul lebih dari 3 minggu tanpa perbaikan dengan antibiotik standar. Ayah pasien sedang menjalani pengobatan TB paru selama 2 bulan (BTA positif). Hasil uji tuberkulin (Mantoux test PPD RT23 2TU) menunjukkan indurasi transversal sebesar 14 mm.",
        pertanyaan: "Berdasarkan Sistem Skoring Tuberkulosis Anak IDAI, skor total dan langkah tatalaksana yang tepat adalah?",
        opsi: [
          { id: "a", teks: "Skor ≥ 6 (TB Anak Terkonfirmasi Klinis) → Inisiasi Obat Anti Tuberkulosis (OAT) regimen 2RHZ / 4RH" },
          { id: "b", teks: "Skor < 6 → Cukup observasi dan berikan multivitamin penambah nafsu makan" },
          { id: "c", teks: "Skor 5 → Berikan profilaksis Isoniazid (INH) monoterapi selama 3 bulan" },
          { id: "d", teks: "Lakukan foto rontgen toraks berulang setelah 1 bulan sebelum memulai terapi" },
          { id: "e", teks: "Rujuk untuk bronkoskopi dan biopsi paru" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Penghitungan Sistem Skoring TB Anak IDAI: Kontak TB BTA positif (skor 3) + Uji Tuberkulin positif ≥ 10 mm (skor 3) + BB/status gizi kurang menetap (skor 1) + Batuk kronik ≥ 3 minggu (skor 1) = Total Skor 8. Bila skor total ≥ 6, anak didiagnosis TB dan harus segera dimulai terapi OAT kategori anak (2HRZ/4HR).",
        referensi: "Petunjuk Teknis Manajemen TB Anak IDAI & Kemenkes RI (2023).",
        linkAlatTerkait: {
          label: "Buka Sistem Skoring Klinis TB",
          href: "/preview/skoring",
        },
      },
      {
        id: "to-2-03",
        nomor: 3,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki berusia 14 bulan dibawa ke klinik tumbuh kembang untuk pemeriksaan berkala. Dari riwayat imunisasi dasar, pasien belum pernah mendapatkan vaksin PCV (Pneumokokus) sama sekali. Orang tua ingin melengkapi imunisasi PCV yang tertinggal.",
        pertanyaan: "Berdasarkan Jadwal Imunisasi IDAI 2024 (Catch-up schedule), jadwal pemberian vaksin PCV yang tepat adalah?",
        opsi: [
          { id: "a", teks: "Diberikan 2 dosis dengan interval minimal 2 bulan (8 minggu)" },
          { id: "b", teks: "Diberikan 3 dosis lengkap seperti jadwal bayi usia < 6 bulan" },
          { id: "c", teks: "Diberikan 1 dosis tunggal saja tanpa perlu ulangan" },
          { id: "d", teks: "Tidak perlu diberikan karena sudah lewat usia efektif" },
          { id: "e", teks: "Diberikan bersamaan dengan vaksin BCG dan oral polio" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Berdasarkan Rekomendasi Jadwal Imunisasi IDAI 2024: Untuk anak usia 12–23 bulan yang belum pernah mendapat PCV (catch-up/imunisasi kejar), regimen yang direkomendasikan adalah pemberian 2 dosis PCV dengan interval minimal 2 bulan (8 minggu) antar dosis.",
        referensi: "Jadwal Imunisasi Anak Usia 0–18 Tahun Rekomendasi IDAI 2024.",
        linkAlatTerkait: {
          label: "Buka Jadwal & Pelacak Imunisasi IDAI",
          href: "/preview/imunisasi",
        },
      },
      {
        id: "to-2-04",
        nomor: 4,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "4A",
        vignette:
          "Anak perempuan berusia 24 bulan dibawa ibunya karena postur tubuhnya tampak jauh lebih pendek dibanding teman sebayanya. Pada pemeriksaan antropometri: Panjang Badan 79 cm (Z-score PB/U -2,8 SD menurut kurva WHO), Berat Badan 9,8 kg (Z-score BB/PB -0,8 SD / gizi baik). Proporsi tubuh normal (segmen atas/bawah sesuai usia), riwayat kelahiran cukup bulan dengan PB lahir 49 cm.",
        pertanyaan: "Interpretasi status pertumbuhan anak tersebut menurut kriteria WHO/Kemenkes adalah?",
        opsi: [
          { id: "a", teks: "Pendek (Stunted) dengan status gizi baik (gizi normal)" },
          { id: "b", teks: "Sangat Pendek (Severely Stunted) dengan gizi kurang" },
          { id: "c", teks: "Normal dengan perawakan pendek familial" },
          { id: "d", teks: "Gagal tumbuh (Failure to thrive) akut" },
          { id: "e", teks: "Perawakan pendek disproporsional (Achondroplasia)" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Berdasarkan standar antropometri WHO (Permenkes 2020): Indeks PB/U atau TB/U di antara -2 SD hingga -3 SD diklasifikasikan sebagai Pendek (Stunted). Indeks BB/PB berada di antara -2 SD hingga +1 SD yang menunjukkan status Gizi Baik (Normal).",
        referensi: "Permenkes RI No 2 Tahun 2020 tentang Standar Antropometri Anak; WHO Child Growth Standards.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Kurva Pertumbuhan WHO",
          href: "/preview/pertumbuhan",
        },
      },
      {
        id: "to-2-05",
        nomor: 5,
        subdivisi: "nefrologi",
        subdivisiLabel: "Nefrologi",
        tingkatSKDI: "4A",
        vignette:
          "Anak laki-laki berusia 7 tahun mengeluh nyeri saat berkemih (disuria), sering kencing sedikit-sedikit (polakisuria), dan nyeri pada perut bagian bawah sejak 2 hari lalu. Demam dialami (38,1°C). Pada pemeriksaan urinalisis didapatkan leukosituria 25-30/LPB, nitrit (+), dan leukosit esterase (+). Diagnosis kerja adalah Infeksi Saluran Kemih (ISK) pertama kali.",
        pertanyaan: "Pilihan antibiotik oral lini pertama yang direkomendasikan untuk ISK tanpa komplikasi pada anak adalah?",
        opsi: [
          { id: "a", teks: "Sefiksim oral 8 mg/kgBB/hari dibagi 2 dosis selama 7–10 hari" },
          { id: "b", teks: "Siprofloksasin oral 30 mg/kgBB/hari selama 14 hari" },
          { id: "c", teks: "Metronidazol oral 30 mg/kgBB/hari selama 5 hari" },
          { id: "d", teks: "Gentamisin intravena bolus harian selama 14 hari" },
          { id: "e", teks: "Eritromisin oral 40 mg/kgBB/hari selama 3 hari" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Menurut Konsensus Infeksi Saluran Kemih pada Anak (IDAI), lini pertama terapi antimikroba oral empiris untuk ISK akut tanpa komplikasi (sistitis/pielonefritis ringan) adalah golongan sefalosporin generasi ke-3 oral seperti Sefiksim (8 mg/kgBB/hari terbagi 2 dosis) atau Amoksisilin-Klavulanat selama 7–10 hari.",
        referensi: "Konsensus Infeksi Saluran Kemih pada Anak IDAI (2011/Revisi 2021).",
        linkAlatTerkait: {
          label: "Buka Kalkulator Dosis Obat Pediatri",
          href: "/preview/obat",
        },
      },
    ],
  },
  {
    id: "ukmppd-stase-anak-3",
    slug: "ukmppd-stase-anak-3",
    judul: "Try Out UKNPDPD Pediatri — Paket 3 (Gawat Darurat, Kardiologi & Nefrologi)",
    deskripsi: "Latihan fokus: Resusitasi Syok Anafilaksis, Tetralogy of Fallot Spell Hipoksia, Sindrom Nefrotik Akut, PALS & Aritmia Pediatri, dan TPN Neonatus.",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi UKNPDPD",
    badge: "SKDI 4A / 3B",
    daftarSoal: [
      {
        id: "to-3-01",
        nomor: 1,
        subdivisi: "gawat-darurat",
        subdivisiLabel: "Gawat Darurat",
        tingkatSKDI: "4A",
        vignette:
          "Anak laki-laki berusia 6 tahun (BB 20 kg) tiba-tiba mengalami sesak napas berat, stridor inspiratoir, urtikaria menyeluruh di kulit, serta bibir bengkak 10 menit setelah disuntik antibiotik di poliklinik. Pada pemeriksaan: TD 70/40 mmHg, laju nadi 145 x/menit halus, CRT 4 detik, suara napas terdengar wheezing bilateral.",
        pertanyaan: "Langkah medikamentosa darurat pertama yang harus segera diberikan adalah?",
        opsi: [
          { id: "a", teks: "Injeksi Epinefrin (1:1.000) 0,2 mL (0,01 mg/kgBB) secara Intramuskular (IM) di paha anterolateral" },
          { id: "b", teks: "Injeksi Deksametason IV 10 mg bolus lambat" },
          { id: "c", teks: "Injeksi Difenhidramin IM 20 mg" },
          { id: "d", teks: "Inhalasi nebulisasi budesonid 0,5 mg" },
          { id: "e", teks: "Infus dopamine continue 5 mcg/kg/menit" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Pasien mengalami Syok Anafilaksis (kegawatan mengancam nyawa). Terapi lini pertama yang mutlak dan tidak boleh ditunda adalah Epinefrin (Adrenalin) larutan 1:1.000 dengan dosis 0,01 mg/kgBB (maks 0,3 mg pada anak) secara Intramuskular di regio paha anterolateral (vastus lateralis). Antihistamin dan kortikosteroid hanya merupakan terapi lini kedua.",
        referensi: "Pedoman Tata Laksana Anafilaksis IDAI / World Allergy Organization (WAO) Anaphylaxis Guidelines.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Obat Darurat & Resusitasi",
          href: "/preview/darurat",
        },
      },
      {
        id: "to-3-02",
        nomor: 2,
        subdivisi: "kardiologi",
        subdivisiLabel: "Kardiologi",
        tingkatSKDI: "3B",
        vignette:
          "Bayi laki-laki berusia 11 bulan dengan riwayat penyakit jantung bawaan sianotik dibawa ibunya ke IGD karena tiba-tiba menjadi sangat biru (sianosis hebat), napas cepat dan dalam (hiperpnea), serta gelisah setelah menangis kencang. Pasien didiagnosis mengalami Tetralogy of Fallot (ToF) tet spell / spell hipoksia.",
        pertanyaan: "Tindakan posisi awal dan medikamentosa lini pertama yang tepat untuk mengatasi serangan sianotik ini adalah?",
        opsi: [
          { id: "a", teks: "Posisikan Knee-Chest (lutut ke dada) + Oksigenasi + Morfin sulfat 0,1 mg/kgBB SC/IM" },
          { id: "b", teks: "Posisikan Trendelenburg + Bolus Furosemid 2 mg/kgBB IV" },
          { id: "c", teks: "Posisikan telentang elevasi kepala 45 derajat + Injeksi Digoksin IV" },
          { id: "d", teks: "Injeksi Kalsium Glukonas 10% IV bolus lambat" },
          { id: "e", teks: "Inhalasi Salbutamol nebulisasi dosis tinggi" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Tatalaksana awal Hypercyanotic Spell pada Tetralogy of Fallot adalah memposisikan anak dalam Knee-Chest position untuk meningkatkan Systemic Vascular Resistance (SVR) dan mengurangi right-to-left shunt, berikan O2 100%, serta injeksi Morfin Sulfat 0,1 mg/kgBB SC/IM/IV guna menenangkan anak dan menekan pusat napas yang hiperpnea serta relaksasi infundibular spasme.",
        referensi: "Park's Pediatric Cardiology for Practitioners (7th ed); Panduan Praktik Klinis Kardiologi Anak IDAI.",
        linkAlatTerkait: {
          label: "Buka Kalkulator Penanganan Darurat Pediatri",
          href: "/preview/darurat",
        },
      },
      {
        id: "to-3-03",
        nomor: 3,
        subdivisi: "nefrologi",
        subdivisiLabel: "Nefrologi",
        tingkatSKDI: "3A",
        vignette:
          "Anak laki-laki berusia 4 tahun (BB 16 kg) dibawa orang tuanya karena kedua kelopak mata tampak bengkak (edema periorbital) terutama saat bangun pagi sejak 5 hari lalu, yang kemudian menjalar ke perut (asites) dan tungkai. Hasil pemeriksaan laboratorium menunjukkan: Proteinuria masif +++ (kuantitatif > 40 mg/m2/jam), Hipoalbuminemia berat (Serum Albumin 1,6 g/dL), dan Hiperkolesterolemia (Kolesterol total 360 mg/dL).",
        pertanyaan: "Diagnosis klinis dan terapi medikamentosa inisial lini pertama menurut konsensus IDAI adalah?",
        opsi: [
          { id: "a", teks: "Sindrom Nefrotik Idiopatik Inisial → Prednison dosis penuh 60 mg/m2 LPB/hari (atau 2 mg/kgBB/hari) selama 4 minggu" },
          { id: "b", teks: "Glomerulonefritis Akut Pasca Streptokokus (GNAPS) → Antibiotik Eritromisin oral" },
          { id: "c", teks: "Gagal Ginjal Akut Prerenal → Infus albumin 20% rutin tanpa kortikosteroid" },
          { id: "d", teks: "Sindrom Nefrotik Resisten Steroid → Siklofosfamid oral langsung" },
          { id: "e", teks: "Kwarshiorkor Gizi Buruk → F-75 formula stabilisasi" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Tetrad sindrom nefrotik: proteinuria masif, hipoalbuminemia (< 2,5 g/dL), edema anasarka, dan hiperkolesterolemia. Berdasarkan Konsensus Tata Laksana Sindrom Nefrotik Idiopatik IDAI, terapi inisial serangan pertama adalah Prednison dosis penuh (full dose) 60 mg/m2 LPB/hari (atau 2 mg/kgBB/hari, maks 80 mg/hari) dibagi 3 dosis setiap hari selama 4 minggu pertama.",
        referensi: "Konsensus Tata Laksana Sindrom Nefrotik Idiopatik pada Anak IDAI (2012/Revisi).",
        linkAlatTerkait: {
          label: "Buka Kalkulator Laju Filtrasi Glomerulus (eGFR)",
          href: "/preview/egfr",
        },
      },
      {
        id: "to-3-04",
        nomor: 4,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Bayi baru lahir perempuan dari ibu dengan Diabetes Melitus Gestasional tidak terkontrol, lahir pada usia gestasi 39 minggu dengan BBL 4.200 gram (Makrosomia/LGA). Pada usia 2 jam pascalahir, bayi tampak jittery (gemetar), letargis, dan hipotermia. Pemeriksaan gula darah sewaktu (GDS/bedside glucose) menunjukkan hasil 28 mg/dL.",
        pertanyaan: "Tatalaksana koreksi hipoglikemia simtomatik neonatus yang tepat adalah?",
        opsi: [
          { id: "a", teks: "Bolus Dektrosa 10% (D10) 2 mL/kgBB intravena kecepatan 1 mL/menit dilanjutkan infus D10 dengan GIR 6–8 mg/kg/menit" },
          { id: "b", teks: "Bolus Dektrosa 40% (D40) 5 mL/kgBB secepatnya" },
          { id: "c", teks: "Berikan air gula 50 mL per oral dengan sendok" },
          { id: "d", teks: "Injeksi insulin regular 0,1 unit/kgBB" },
          { id: "e", teks: "Infus Ringer Asetat kecepatan rumatan" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Pada neonatus dengan hipoglikemia simtomatik atau GDS < 30-35 mg/dL, terapi darurat berupa bolus Dextrose 10% (D10W) sebanyak 2 mL/kgBB (200 mg/kg) secara IV pelan (1 mL/menit), diikuti infus glukosa kontinu dengan Glucose Infusion Rate (GIR) awal 6–8 mg/kg/menit. Dilarang menggunakan konsentrasi tinggi seperti D40 pada neonatus karena risiko hiperosmolaritas dan nekrosis jaringan.",
        referensi: "Panduan Tata Laksana Hipoglikemia pada Neonatus IDAI; AAP Pediatric Hypoglycemia Guidelines.",
        linkAlatTerkait: {
          label: "Buka Kalkulator GIR & TPN Neonatus",
          href: "/preview/tpn-neonatus",
        },
      },
      {
        id: "to-3-05",
        nomor: 5,
        subdivisi: "gawat-darurat",
        subdivisiLabel: "Gawat Darurat",
        tingkatSKDI: "4A",
        vignette:
          "Anak perempuan berusia 3 tahun (BB 14 kg) mengalami henti napas dan henti jantung di ruang rawat inap. Tim resusitasi memulai RJP (CPR kualitas tinggi) dan memasang monitor defibrilator. Monitor menunjukkan irama Ventricular Fibrillation (VF) yang refrakter. Tim bersiap melakukan defibrilasi manual asinkron (shock).",
        pertanyaan: "Berdasarkan pedoman Pediatric Advanced Life Support (PALS 2020), dosis energi kejut listrik (shock) pertama yang tepat adalah?",
        opsi: [
          { id: "a", teks: "2 Joule/kgBB (28 Joule) asinkron, dilanjutkan segera CPR 2 menit" },
          { id: "b", teks: "10 Joule/kgBB (140 Joule) sinkron" },
          { id: "c", teks: "0,5 Joule/kgBB sinkron (Kardioversi)" },
          { id: "d", teks: "200 Joule monofasik tetap tanpa hitungan BB" },
          { id: "e", teks: "Tidak boleh shock, berikan Amiodaron bolus dulu" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Berdasarkan AHA PALS Guidelines (2020): Pada ritme shockable (VF / pulseless VT), energi defibrilasi kejut pertama adalah 2 J/kgBB. Jika tetap refrakter pada shock kedua berikan 4 J/kgBB (dan dosis selanjutnya minimal 4 J/kgBB hingga maksimal 10 J/kgBB atau dosis dewasa). Segera lanjutkan siklus CPR 2 menit pasca-defibrilasi tanpa menunda untuk cek nadi/ritme.",
        referensi: "American Heart Association (AHA) Pediatric Advanced Life Support (PALS) Guidelines 2020.",
        linkAlatTerkait: {
          label: "Buka Algoritma Resusitasi & PALS Pediatri",
          href: "/preview/darurat",
        },
      },
    ],
  },
];

export function getPaketTryoutById(id: string): PaketTryOut | undefined {
  return PAKET_TRYOUT_LIST.find((p) => p.id === id || p.slug === id);
}
