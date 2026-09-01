import type { KuisModul } from "../types";

export const kuisSkoring: KuisModul = {
  modulId: "skoring",
  judul: "Skoring Klinis",
  deskripsi: "Uji pemahaman tentang 10 skor klinis pediatrik tervalidasi",
  icon: "skoring",
  soal: [
    {
      id: "sk-01",
      pertanyaan:
        "Anak 3 tahun dibawa karena suara serak dan batuk seperti gonggongan anjing. Pemeriksaan: stridor inspirasi terdengar saat istirahat, retraksi suprasternal ringan, tidak ada sianosis, air entry sedikit berkurang, anak compos mentis. Berdasarkan Skor Westley, derajat keparahan croup anak ini adalah…",
      opsi: [
        { id: "a", teks: "Ringan (skor 0–2)" },
        { id: "b", teks: "Sedang (skor 3–7)" },
        { id: "c", teks: "Berat (skor 8–11)" },
        { id: "d", teks: "Mengancam jiwa (skor >11)" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Komponen Westley: stridor saat istirahat = 2, retraksi suprasternal ringan = 1, tidak sianosis = 0, air entry sedikit berkurang = 1, compos mentis = 0. Total = 4 → derajat SEDANG (3–7). Tatalaksana: deksametason oral/IM dan nebulisasi epinefrin jika ada distres bermakna.",
      referensi: "Westley CR et al., Am J Dis Child 1978; IDAI 2020",
    },
    {
      id: "sk-02",
      pertanyaan:
        "Neonatus 2 jam dengan distres napas. Skor Downes dinilai: RR 74×/menit (skor 1), retraksi ringan (skor 1), tidak sianosis (skor 0), air entry bilateral sedikit berkurang (skor 1), tidak terdengar grunting (skor 0). Interpretasi dan tindakan yang tepat adalah…",
      opsi: [
        { id: "a", teks: "Skor 3 → gangguan napas ringan; monitoring ketat dan oksigen suplemen sesuai SpO₂" },
        { id: "b", teks: "Skor 3 → normal, bayi boleh rawat gabung tanpa pemantauan khusus" },
        { id: "c", teks: "Skor 4 → gangguan napas sedang; pertimbangkan CPAP" },
        { id: "d", teks: "Skor 7 → berat; intubasi segera" },
      ],
      jawabanBenar: "a",
      penjelasan:
        "Skor Downes = 1+1+0+1+0 = 3. Skor 0–3 = ringan, cukup observasi dan oksigen tambahan via hood/CPAP sesuai SpO₂ target 90–95%. Skor 4–6 = sedang (pertimbangkan CPAP/ventilasi non-invasif), ≥7 = berat (pertimbangkan intubasi).",
      referensi: "Downes JJ et al., Clin Pediatr 1970; IDAI Neonatologi 2022",
    },
    {
      id: "sk-03",
      pertanyaan:
        "Bayi baru lahir dinilai APGAR menit ke-1: warna tubuh biru di ekstremitas saja (1), denyut jantung 88×/menit (1), meringis saat dirangsang (1), tonus fleksi minimal (1), napas tidak teratur (1). Nilai APGAR dan tindakan yang sesuai adalah…",
      opsi: [
        { id: "a", teks: "APGAR 3 → depresi berat, resusitasi aktif segera" },
        { id: "b", teks: "APGAR 5 → depresi sedang; stimulasi, posisikan, dan oksigen aliran bebas" },
        { id: "c", teks: "APGAR 7 → normal, hanya perawatan rutin" },
        { id: "d", teks: "APGAR 5 → resusitasi tidak diperlukan karena HR masih ada" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Setiap komponen bernilai 1, total APGAR = 5. Nilai 4–6 = depresi sedang. Tindakan: stimulasi taktil, pastikan airway, berikan oksigen aliran bebas. Nilai ulang menit ke-5; jika membaik ≥7 → rawat rutin. Jika tetap rendah → eskalasi bantuan napas.",
      referensi: "AAP/AHA Neonatal Resuscitation Program 2021; IDAI 2022",
    },
    {
      id: "sk-04",
      pertanyaan:
        "Sistem skoring TB anak IDAI menggunakan ambang nilai berapa untuk memutuskan dimulainya terapi OAT pada anak yang belum terkonfirmasi bakteriologis?",
      opsi: [
        { id: "a", teks: "≥4 poin" },
        { id: "b", teks: "≥6 poin" },
        { id: "c", teks: "≥8 poin" },
        { id: "d", teks: "≥10 poin" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Skor TB anak IDAI: ≥6 poin = kemungkinan TB, OAT dimulai. Komponen: kontak TB sumber BTA+ (3 poin), uji tuberkulin positif (3 poin), status gizi buruk (2 poin) atau kurang (1 poin), demam ≥2 minggu tanpa sebab lain (1 poin), batuk ≥3 minggu (1 poin), pembesaran KGB leher (1 poin), foto toraks sugestif TB (1 poin). Skor <6: pertimbangkan diagnosis lain.",
      referensi: "IDAI, Pedoman Nasional TB Anak 2020",
    },
    {
      id: "sk-05",
      pertanyaan:
        "Anak 8 tahun datang dengan mengi dan sesak. Berdasarkan Pediatric Asthma Score (PAS), kombinasi temuan mana yang menandakan serangan BERAT dan memerlukan manajemen intensif segera?",
      opsi: [
        { id: "a", teks: "SpO₂ >95% tanpa oksigen, wheezing hanya akhir ekspirasi" },
        { id: "b", teks: "SpO₂ 92–95% dengan oksigen 2 L/mnt, wheezing sepanjang ekspirasi" },
        { id: "c", teks: "SpO₂ <90% meski dengan oksigen, silent chest, tidak dapat berbicara" },
        { id: "d", teks: "SpO₂ 96%, retraksi interkostal ringan, dapat berbicara kalimat penuh" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "PAS skor 12–15 (berat) ditandai: SpO₂ <90% dengan oksigen, tidak terdengar suara napas (silent chest), retraksi suprasternal dan supraklavikular, tidak mampu berbicara. Tatalaksana: SABA nebulisasi kontinu, ipratropium bromida, kortikosteroid sistemik, dan pertimbangkan magnesium sulfat IV atau ICU.",
      referensi: "GINA 2023; IDAI Panduan Asma Anak 2021",
    },
    {
      id: "sk-06",
      pertanyaan:
        "Anak 10 tahun dengan nyeri tenggorokan dan demam 38,8°C. Pemeriksaan: eksudat tonsil bilateral, adenopati servikal anterior nyeri tekan, tidak ada batuk, tidak ada rinitis. Berdasarkan skor McIsaac, penanganan yang paling tepat adalah…",
      opsi: [
        { id: "a", teks: "Skor ≤1: tidak perlu antibiotik, cukup simtomatik" },
        { id: "b", teks: "Skor 2–3: lakukan rapid antigen test (RADT) dulu sebelum memutuskan antibiotik" },
        { id: "c", teks: "Skor ≥4: kemungkinan GAS tinggi, berikan antibiotik empiris (amoksisilin)" },
        { id: "d", teks: "Skor ≥4: berikan antiviral karena kemungkinan EBV" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "Skor McIsaac: demam >38°C (+1), eksudat tonsil (+1), adenopati servikal anterior (+1), tidak ada batuk (+1), usia 3–14 tahun (+1) = total 5. Skor ≥4 → risiko GAS (Group A Streptococcus) tinggi (>50%), langsung beri amoksisilin 50 mg/kgBB/hari 10 hari. Skor 2–3 → pertimbangkan RADT. Skor ≤1 → antibiotik tidak diperlukan.",
      referensi: "McIsaac WJ et al., CMAJ 1998; IDAI 2020",
    },
    {
      id: "sk-07",
      pertanyaan:
        "Anak 4 tahun, demam 40°C selama 7 hari tidak respons antibiotik. Ditemukan: konjungtivitis non-purulenta bilateral, ruam polimorfik di badan, eritema dan fisura bibir, limfadenopati servikal unilateral 1,8 cm. Dasar penetapan diagnosis Kawasaki Disease adalah…",
      opsi: [
        { id: "a", teks: "Hanya butuh 3 dari 5 kriteria utama + demam" },
        { id: "b", teks: "Memenuhi 4 dari 5 kriteria utama + demam ≥5 hari" },
        { id: "c", teks: "Seluruh 5 kriteria utama harus terpenuhi sebelum diagnosa dibuat" },
        { id: "d", teks: "Demam saja + ekokardiografi abnormal (incomplete Kawasaki)" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Kriteria Kawasaki klasik (AHA 2017): demam ≥5 hari + ≥4 dari 5 kriteria utama (konjungtivitis bilateral non-purulenta, perubahan mukosa mulut, ruam polimorfik, perubahan ekstremitas, limfadenopati servikal unilateral ≥1,5 cm). Kasus ini memenuhi 4 kriteria utama + demam 7 hari → diagnosis dapat ditegakkan. Tatalaksana: IVIG 2 g/kgBB dosis tunggal + aspirin.",
      referensi: "McCrindle BW et al., Circulation 2017 (AHA Scientific Statement)",
    },
    {
      id: "sk-08",
      pertanyaan:
        "New Ballard Score (NBS) digunakan dalam praktik neonatologi untuk tujuan apa?",
      opsi: [
        { id: "a", teks: "Menilai derajat asfiksia dan kebutuhan resusitasi neonatus" },
        { id: "b", teks: "Memperkirakan usia gestasi berdasarkan maturitas neuromuskular dan fisik" },
        { id: "c", teks: "Menilai derajat hiperbilirubinemia dan kebutuhan fototerapi" },
        { id: "d", teks: "Menilai keparahan distres napas pada bayi prematur" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "New Ballard Score menilai 6 kriteria neuromuskular (postur, square window, arm recoil, popliteal angle, scarf sign, heel-to-ear) dan 6 kriteria fisik (kulit, lanugo, permukaan plantar, payudara, mata/telinga, genitalia). Skor total dikonversi ke taksiran usia gestasi, akurat untuk usia 20–44 minggu. Dinilai dalam 12–96 jam pertama kehidupan.",
      referensi: "Ballard JL et al., J Pediatr 1991",
    },
  ],
};
