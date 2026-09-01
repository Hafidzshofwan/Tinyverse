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
];

export function getPaketTryoutById(id: string): PaketTryOut | undefined {
  return PAKET_TRYOUT_LIST.find((p) => p.id === id || p.slug === id);
}
