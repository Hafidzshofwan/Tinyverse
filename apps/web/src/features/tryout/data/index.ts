import type { PaketTryOut } from "../types";
import { PAKET_PREDIKSI_JITU } from "./prediksiJitu";

export const PAKET_TRYOUT_LIST: PaketTryOut[] = [
  PAKET_PREDIKSI_JITU,
  {
    id: "drill-pediatri-paket-1",
    slug: "drill-pediatri-paket-1",
    judul: "Try Out UKMPPD Pediatri — Paket 2 (Komprehensif A)",
    deskripsi: "Neonatologi, Gastrohepatologi, Infeksi Tropis, Tumbuh Kembang, Nutrisi & Metabolik",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi Komprehensif",
    badge: "15 Soal / 15 Menit",
    daftarSoal: [
      {
        id: "p1-soal-01",
        nomor: 1,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki baru lahir beberapa jam yang lalu di bidan dan dibawa ke RS dengan keluhan bayi tampak sesak dan biru. Bayi lahir dari seorang ibu G1P0A0 dengan usia kehamilan 32 minggu dengan BBL 2.000 gram. Bayi tidak menangis spontan setelah lahir. Pemeriksaan tanda vital TD 70/50, HR 140, RR 70, T 37°C. Pada pemeriksaan fisik didapatkan retraksi intercostal (+), pernapasan cuping hidung (+), dan sianosis perioral (+).",
        pertanyaan: "Pernyataan yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Gambaran rontgen ditemukan gambaran atelektasis" },
          { id: "b", teks: "Salah satu faktor risiko adalah ketuban pecah dini" },
          { id: "c", teks: "Etiologi keluhan pasien berupa kolaps paru" },
          { id: "d", teks: "Diagnosis yang tepat adalah hyaline membrane disease" },
          { id: "e", teks: "Tatalaksana yang tepat adalah suction" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Bayi prematur (32 minggu, BBL 2000 g) yang mengalami distres pernapasan progresif pascalahir (takipnea, retraksi, cuping hidung, sianosis) memiliki gambaran klasik Hyaline Membrane Disease (HMD) / Respiratory Distress Syndrome (RDS) tipe 1 yang disebabkan oleh defisiensi surfaktan akibat imaturitas paru.",
        referensi: "Pedoman Pelayanan Medis Neonatus IDAI; Nelson Textbook of Pediatrics."
      },
      {
        id: "p1-soal-02",
        nomor: 2,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki lahir secara pervaginam dengan usia kehamilan 37 minggu di RS. Bayi lahir tidak menangis spontan dan tonus otot buruk. Berat badan bayi 2.500 gram. Dokter telah melakukan penanganan awal. Kemudian dievaluasi, bayi megap-megap dengan laju napas 80 x/menit. Pemeriksaan tanda vital TD 80/60, RR 70, T 36,3°C. Pemeriksaan fisik didapatkan retraksi intercostal (+).",
        pertanyaan: "Tatalaksana berikutnya yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Berikan oksigen aliran bebas" },
          { id: "b", teks: "Melakukan VTP + epinefrin 0,2 mg IV" },
          { id: "c", teks: "Melakukan VTP" },
          { id: "d", teks: "Melakukan VTP + kompresi dada" },
          { id: "e", teks: "Berikan CPAP dengan PEEP 7 cmH2O" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pada alur resusitasi neonatus (IDAI / AHA Neonatal Resuscitation Program), jika setelah langkah awal bayi masih megap-megap (gasping) atau apneu atau HR < 100 x/menit, langkah mutlak selanjutnya adalah segera melakukan Ventilasi Tekanan Positif (VTP) dengan balon dan sungkup.",
        referensi: "Pedoman Resusitasi Neonatus IDAI / AHA NRP Guidelines."
      },
      {
        id: "p1-soal-03",
        nomor: 3,
        subdivisi: "gastrohepatologi",
        subdivisiLabel: "Gastrohepatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi perempuan berusia 14 hari dibawa oleh orang tuanya ke dokter karena kuning hampir seluruh badan sejak hari pertama lahir. Riwayat demam disangkal. Ibu memberi ASI 10 kali per hari. BAB berwarna cokelat dan urin berwarna kuning jernih. Pemeriksaan tanda vital TD 80/60, HR 140, RR 40, T 37,2°C. Pemeriksaan fisik didapatkan ikterus hingga telapak tangan dan kaki. Pada pemeriksaan penunjang didapatkan bilirubin total 21 mg/dL.",
        pertanyaan: "Tatalaksana yang paling tepat untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Observasi" },
          { id: "b", teks: "Tambahkan jumlah dan frekuensi ASI" },
          { id: "c", teks: "Medikamentosa" },
          { id: "d", teks: "Fototerapi" },
          { id: "e", teks: "Transfusi tukar" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Pada bayi cukup bulan usia 14 hari dengan bilirubin 21 mg/dL namun TANPA tanda ensefalopati bilirubin akut (masih aktif, menyusu baik, tidak ada opistotonos/high-pitched cry/letargi), tatalaksana yang tepat adalah Fototerapi Intensif terlebih dahulu. Menurut nomogram AAP 2022 dan panduan IDAI, ambang Transfusi Tukar pada bayi term tanpa faktor risiko di atas usia 7 hari adalah sekitar 25 mg/dL. Bilirubin 21 mg/dL belum mencapai ambang tersebut. Transfusi Tukar hanya diindikasikan jika bilirubin mencapai ambang exchange atau muncul tanda ensefalopati akut.",
        referensi: "AAP Clinical Practice Guideline Hyperbilirubinemia 2022; Tata Laksana Hiperbilirubinemia Neonatus IDAI."
      },
      {
        id: "p1-soal-04",
        nomor: 4,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi perempuan berusia 3 hari datang dibawa orang tuanya karena mengalami demam tinggi. Keluhan disertai mual, muntah, BAB cair, dan kesulitan bernapas. Ibu memiliki riwayat ketuban pecah dan berbau. Pemeriksaan tanda vital didapatkan TD 80/60, HR 140, RR 70, T 39,1°C. Pemeriksaan fisik didapatkan retraksi intercostal (+), distensi abdomen (+), bising usus menurun. Pada pemeriksaan laboratorium didapatkan leukosit 25.000.",
        pertanyaan: "Pernyataan yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Pasien tidak diberikan antibiotik karena penyakit dapat sembuh tanpa antibiotik" },
          { id: "b", teks: "Faktor risiko terjadinya keluhan pasien adalah ibu tidak melakukan imunisasi tetanus" },
          { id: "c", teks: "Diagnosis pasien adalah sepsis neonatorum early onset" },
          { id: "d", teks: "Pasien hanya perlu observasi karena tingkat mortalitas pasien rendah" },
          { id: "e", teks: "Pemberian antibiotik dapat diberikan dengan menunggu hasil kultur" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Sepsis yang timbul dalam 72 jam pertama kehidupan (usia 3 hari) dengan faktor risiko korioamnionitis maternal (ketuban pecah dan berbau) diklasifikasikan sebagai Early Onset Sepsis (EOS). Infeksi umumnya didapat secara vertikal intrapartum.",
        referensi: "Pedoman Pelayanan Medis Sepsis Neonatorum IDAI."
      },
      {
        id: "p1-soal-05",
        nomor: 5,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki berusia 5 hari dirujuk oleh bidan ke rumah sakit karena tidak mau menyusu, disertai mengalami kekakuan pada mulut hingga badan. Riwayat bayi lahir ditolong dukun beranak. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 60, T 38°C. Pada pemeriksaan fisik didapatkan tonus otot spasme (+), trismus (+), mulut mencucu, dan umbilikus bayi tercium bau busuk, disertai pus (+).",
        pertanyaan: "Etiologi yang menyebabkan kondisi pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Corynebacterium diphtheriae" },
          { id: "b", teks: "Streptococcus grup B" },
          { id: "c", teks: "Clostridium tetani" },
          { id: "d", teks: "Haemophilus influenzae" },
          { id: "e", teks: "Escherichia coli" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Gejala trismus (sulit menyusu/mulut mencucu seperti ikan/risus sardonicus), spasme otot menyeluruh, dan infeksi tali pusat pascapersalinan non-steril adalah tanda patognomonik Tetanus Neonatorum yang disebabkan oleh eksotoksin (tetanospasmin) dari bakteri Clostridium tetani.",
        referensi: "Buku Ajar Infeksi & Pediatri Tropis IDAI."
      },
      {
        id: "p1-soal-06",
        nomor: 6,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "3A",
        vignette:
          "Seorang anak perempuan berusia 16 tahun dengan keluhan pertumbuhan yang tidak normal jika dibandingkan teman seusianya. Perawakan anak pendek. Pertumbuhan seks sekunder (-) dan menstruasi (-). Pemeriksaan tanda vital TD 120/80, HR 80, RR 18, T 36,4°C. Pemeriksaan fisik didapatkan dada lebar, leher pendek. Pada pemeriksaan jantung didapatkan kelainan.",
        pertanyaan: "Diagnosis yang tepat adalah?",
        opsi: [
          { id: "a", teks: "Sindrom Prader-Willi" },
          { id: "b", teks: "Sindrom Marfan" },
          { id: "c", teks: "Sindrom Klinefelter" },
          { id: "d", teks: "Sindrom Turner" },
          { id: "e", teks: "Sindrom Jones" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Perawakan pendek (short stature), amenore primer dengan ketiadaan tanda seks sekunder (infantilisme seksual), leher bersayap/pendek (webbed neck), dada perisai (broad shield chest), dan kelainan kardiovaskular (seperti koarktasio aorta) merupakan karakteristik klasik Sindrom Turner (kariotipe 45,X0).",
        referensi: "Buku Ajar Endokrinologi Anak IDAI."
      },
      {
        id: "p1-soal-07",
        nomor: 7,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "3A",
        vignette:
          "Seorang anak laki-laki berusia 4 tahun diantar oleh orang tuanya ke poliklinik anak dengan keluhan perkembangan anak yang terlambat dibandingkan dengan teman-temannya. Kulit pasien tampak lebih cerah dibanding keluarga, namun keluarga berkulit sawo matang. Pemeriksaan tanda vital TD 90/60, HR 90, RR 26, T 36,2°C. Pada pemeriksaan fisik didapatkan kulit cerah, rambut seperti warna jagung, serta pemeriksaan urin terdapat mousy odor.",
        pertanyaan: "Pernyataan yang tepat terkait kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Adanya defisiensi phenylalanine hydroxylase" },
          { id: "b", teks: "Diturunkan secara autosomal dominan" },
          { id: "c", teks: "Ekskresi fenilalanin pada tubuh yang berlebihan" },
          { id: "d", teks: "Tatalaksana berupa diet tinggi fenilalanin" },
          { id: "e", teks: "Terdapat penurunan kadar fenilalanin" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Kasus menggambarkan Fenilketonuria (PKU), penyakit kelainan metabolisme inborn yang disebabkan oleh mutasi/defisiensi enzim fenilalanin hidroksilase (PAH), menyebabkan akumulasi fenilalanin yang menimbulkan gangguan perkembangan saraf, hipopigmentasi kulit/rambut, dan aroma urin khas apek (mousy/musty odor).",
        referensi: "Nelson Textbook of Pediatrics, Inborn Errors of Amino Acid Metabolism."
      },
      {
        id: "p1-soal-08",
        nomor: 8,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 24 bulan datang diantar kedua orang tuanya ke puskesmas untuk melihat pertumbuhan dan perkembangan anak. Keluhan pada anak disangkal. Pemeriksaan tanda vital TD 90/60, HR 120, RR 40, T 36,4°C. Pemeriksaan fisik dalam batas normal. Pada pemeriksaan antropometri didapatkan hasil sesuai dengan usia dan berada di garis hijau. Pada saat pemeriksaan KPSP didapatkan total skor 10.",
        pertanyaan: "Interpretasi dan tatalaksana lanjutan untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Meragukan, sehingga beri nasihat ibu untuk stimulasi dan cek ulang 2 minggu lagi" },
          { id: "b", teks: "Meragukan, namun dianggap tidak ada gangguan" },
          { id: "c", teks: "Terdapat penyimpangan dan perlu rujuk ke Sp.A" },
          { id: "d", teks: "Sesuai usia dan perlu rujuk ke Sp.A" },
          { id: "e", teks: "Sesuai usia dan periksa ulang pada usia selanjutnya" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Pada interpretasi skrining KPSP Kemenkes RI: Jawaban 'YA' berjumlah 9 atau 10 berarti perkembangan anak Sesuai dengan Tahap Perkembangannya (S). Tatalaksananya adalah pujilah orang tua/pengasuh, teruskan pola asuh sesuai tahap perkembangan, dan jadwalkan pemeriksaan KPSP rutin pada kelompok umur selanjutnya.",
        referensi: "Pedoman Pelaksanaan SDIDTK Kemenkes RI."
      },
      {
        id: "p1-soal-09",
        nomor: 9,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 2 tahun dibawa ke IGD karena penurunan kesadaran. Anak tidak mau makan apa pun sejak 1 hari terakhir. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 30, T 36,2°C. Pada pemeriksaan fisik anak tampak apatis, sangat kurus, iga gambang (+), baggy pants (+), edema (-). Saat dilakukan pemeriksaan GDS 42 mg/dL.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Berikan 50 mL glukosa 10% atau sukrosa 10% per oral" },
          { id: "b", teks: "Berikan RL 30 cc/kg dalam 30 menit, lanjut 70 cc/kg dalam 2,5 jam" },
          { id: "c", teks: "Berikan oralit 200 cc" },
          { id: "d", teks: "Berikan IV D10% 5 cc/kgBB, lanjutkan dengan F75" },
          { id: "e", teks: "Berikan Resomal 5 mL/kgBB tiap 30 menit dalam 2 jam pertama" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Anak mengalami gizi buruk tipe marasmus dengan komplikasi hipoglikemia berat disertai penurunan kesadaran (apatis/letargis) dan GDS < 54 mg/dL. Menurut Protokol 10 Langkah Tata Laksana Gizi Buruk WHO/Kemenkes: bila tidak sadar/letargis, berikan Glukosa/Dekstrosa 10% IV secara steril 5 mL/kgBB, kemudian segera lanjutkan pemberian formula F-75.",
        referensi: "Buku Pedoman Pelayanan Anak Gizi Buruk Kemenkes RI / WHO."
      },
      {
        id: "p1-soal-10",
        nomor: 10,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 1 bulan datang dibawa orang tua ke dokter anak atas saran dari bidan. Ibu pasien mengatakan bahwa saat pemeriksaan ANC di puskesmas HIV ibu reaktif, tetapi belum melakukan pengobatan lebih lanjut. Anak saat ini terdapat putih-putih di mulutnya disertai demam sumer-sumer yang dirasakan sejak sekitar 3 minggu. Pemeriksaan fisik HR 130, RR 28, suhu 37,8°C, candidiasis oral. Pada pemeriksaan serologis HIV pada anak didapatkan hasil reaktif.",
        pertanyaan: "Imunisasi apa saja yang tidak dapat diberikan untuk anak?",
        opsi: [
          { id: "a", teks: "Semua dapat diberikan dengan observasi ketat" },
          { id: "b", teks: "Tidak boleh diberikan vaksin BCG dan pentabio" },
          { id: "c", teks: "Tidak boleh diberikan vaksin BCG dan OPV" },
          { id: "d", teks: "Tidak boleh diberikan vaksin pentabio dan IPV" },
          { id: "e", teks: "Tidak boleh diberikan vaksin pentabio dan BCG" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pada anak yang terkonfirmasi terinfeksi HIV simtomatik atau imunokompromais berat, vaksin hidup yang dilemahkan (live attenuated) dikontraindikasikan, khususnya vaksin BCG (karena risiko diseminasi BCG-itis) dan Oral Polio Vaccine (OPV diganti dengan Inactivated Polio Vaccine / IPV).",
        referensi: "Pedoman Imunisasi pada Anak dengan Kondisi Khusus IDAI 2024."
      },
      {
        id: "p1-soal-11",
        nomor: 11,
        subdivisi: "gastrohepatologi",
        subdivisiLabel: "Gastrohepatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 12 bulan datang ke IGD dibawa oleh kedua orang tuanya dengan keluhan BAB cair sering dengan frekuensi sekitar 8–10 kali sehari sejak kemarin. Keluhan tinja disertai darah maupun lendir disangkal. Anak juga mengalami muntah dengan frekuensi sekitar 5 kali sehari. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 40, T 36,5°C. Pada pemeriksaan fisik didapatkan anak tampak gelisah, ubun-ubun besar teraba cekung, mata cowong, turgor kulit kembali lambat, dan BB 10 kg.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Dipulangkan, banyak minum di rumah" },
          { id: "b", teks: "Memberikan rehidrasi melalui IV line 300 mL dalam 30 menit pertama" },
          { id: "c", teks: "Memberikan rehidrasi dengan oralit 200 mL setiap BAB" },
          { id: "d", teks: "Memberikan rehidrasi melalui IV line 300 mL dalam 1 jam pertama" },
          { id: "e", teks: "Memberikan rehidrasi dengan oralit 750 mL dalam 3 jam" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Pasien mengalami diare akut dengan Dehidrasi Tak Berat / Ringan-Sedang (gelisah, mata cowong, turgor lambat). Sesuai Rencana Terapi B WHO/Kemenkes: Rehidrasi oralit dalam 3 jam pertama dihitung dengan rumus 75 mL/kgBB = 75 x 10 kg = 750 mL oralit dalam 3 jam.",
        referensi: "Panduan Praktik Klinis Gastroenterologi Anak IDAI / WHO Diarrhoea Guidelines."
      },
      {
        id: "p1-soal-12",
        nomor: 12,
        subdivisi: "gastrohepatologi",
        subdivisiLabel: "Gastrohepatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki berusia 9 bulan dibawa oleh orang tuanya ke puskesmas dengan keluhan BAB cair sejak 2 hari yang lalu. Pasien diare sebanyak 7–8 kali dalam sehari. Keluhan diare disertai darah dan lendir disangkal. Riwayat konsumsi susu formula yang berbeda dari susu formula sebelumnya. Pemeriksaan tanda vital didapatkan TD 80/60, HR 90, RR 37, T 36,5°C. Pada pemeriksaan fisik didapatkan distensi abdomen (+), anus hiperemis, dan feses berbau asam.",
        pertanyaan: "Pernyataan yang kurang tepat terkait dengan keluhan pasien di atas adalah?",
        opsi: [
          { id: "a", teks: "Tatalaksana yang diberikan berupa susu bebas laktosa" },
          { id: "b", teks: "Diagnosis pasien adalah alergi susu sapi" },
          { id: "c", teks: "Adanya defisiensi enzim laktase" },
          { id: "d", teks: "Pemeriksaan penunjang yang dilakukan adalah hydrogen breath test" },
          { id: "e", teks: "Kelainan pasien bukan merupakan reaksi imunologis" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Feses berbau asam (fermentasi karbohidrat), eritema natum/ruam popok perianal akibat pH asam tinja, dan kembung pascasusu formula adalah gambaran klasik Intoleransi Laktosa (bukan reaksi imunologik alergi protein susu sapi/CMPA). Maka pernyataan yang TIDAK tepat adalah 'Diagnosis pasien adalah alergi susu sapi'.",
        referensi: "Rekomendasi Diagnosis dan Tata Laksana Alergi Susu Sapi IDAI."
      },
      {
        id: "p1-soal-13",
        nomor: 13,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 18 bulan dibawa ke IGD karena anak tampak lemas. Anak mengalami BAB cair dan mual muntah sejak kemarin, BAB cair kurang lebih 6 kali dalam sehari. Pemeriksaan tanda vital didapatkan TD 90/60, HR 120, RR 24, T 36,2°C. Pemeriksaan fisik didapatkan anak tampak sadar dan kehausan, terlihat sangat kurus, mata cowong (+), iga gambang (+), baggy pants (+), BB 10 kg. Pada pemeriksaan GDS 85 mg/dL.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Berikan Resomal 50 mL tiap 30 menit dalam 2 jam pertama" },
          { id: "b", teks: "Berikan RL 300 cc dalam 30 menit, lanjut RL 700 cc dalam 2,5 jam" },
          { id: "c", teks: "Berikan oralit 750 cc dalam 3 jam pertama" },
          { id: "d", teks: "Berikan oralit 200 cc/BAB cair" },
          { id: "e", teks: "Berikan 50 mL glukosa 10% atau sukrosa 10% per oral" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Pada anak gizi buruk yang sadar dengan dehidrasi, rehidrasi diberikan menggunakan ReSoMal (Rehydration Solution for Malnutrition) sebanyak 5 mL/kgBB setiap 30 menit selama 2 jam pertama (untuk BB 10 kg = 50 mL tiap 30 menit). Oralit standar tidak boleh digunakan karena risiko kelebihan natrium dan gagal jantung.",
        referensi: "Pedoman Pelayanan Anak Gizi Buruk Kemenkes RI."
      },
      {
        id: "p1-soal-14",
        nomor: 14,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang bayi laki-laki berusia 2 minggu datang dibawa oleh orang tuanya ke IGD RS karena mengalami BAB darah. Keluhan disertai muntah. Bayi lahir dari seorang ibu G1P0A0 usia kehamilan 32 minggu. Riwayat konsumsi susu formula sejak lahir. Pemeriksaan tanda vital didapatkan TD 80/60, HR 140, RR 70, T 39°C. Pada pemeriksaan fisik didapatkan retraksi intercostal (+), distensi abdomen (+), penurunan bising usus. Pemeriksaan foto abdomen didapatkan gambaran pneumatosis intestinalis.",
        pertanyaan: "Pernyataan yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Riwayat lahir postterm merupakan faktor risiko dari keluhan pasien" },
          { id: "b", teks: "Faktor risiko pemberian makanan sesuai usia" },
          { id: "c", teks: "Terjadi kerusakan dinding intestinal berat akibat proses inflamasi" },
          { id: "d", teks: "Diagnosis pasien adalah intususepsi" },
          { id: "e", teks: "Tatalaksana awal berupa pemberian antibiotik" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pneumatosis intestinalis (adanya gas di dinding usus) pada bayi prematur dengan distensi abdomen dan hematokezia adalah tanda patognomonik Necrotizing Enterocolitis (NEC), di mana terjadi inflamasi transmural dan iskemia nekrotik pada mukosa usus.",
        referensi: "Gomella's Neonatology; Pedoman Pelayanan Medis Neonatus IDAI."
      },
      {
        id: "p1-soal-15",
        nomor: 15,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 1 bulan datang dibawa oleh kedua orang tuanya ke IGD RS dengan keluhan anak tidak dapat dibangunkan sejak 1 hari yang lalu. Dua hari sebelumnya anak sempat mengalami kejang pada sisi kanan tubuh. Riwayat anak lahir cukup bulan, ditolong dukun beranak. Pemeriksaan tanda vital TD 80/60, HR 100, RR 40, T 36,5°C. Pemeriksaan fisik didapatkan konjungtiva anemis, ubun-ubun menonjol. Pada pemeriksaan faal hemostasis didapatkan PT dan aPTT memanjang.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Hidrosefalus" },
          { id: "b", teks: "Tetanus neonatorum" },
          { id: "c", teks: "Vit K deficiency bleeding" },
          { id: "d", teks: "Ensefalitis" },
          { id: "e", teks: "Epilepsi" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Bayi usia 1 bulan pascapersalinan dukun (tidak mendapat profilaksis vitamin K injeksi saat lahir) yang datang dengan tanda perdarahan intrakranial (ubun-ubun menonjol, kejang fokal, penurunan kesadaran) serta pemanjangan PT dan aPTT mengalami APBD (Acquired Prothrombin Complex Deficiency) / Vitamin K Deficiency Bleeding (VKDB) tipe lambat.",
        referensi: "Panduan Praktik Klinis Hematologi Anak IDAI."
      },
    ],
  },
  {
    id: "drill-pediatri-paket-2",
    slug: "drill-pediatri-paket-2",
    judul: "Try Out UKMPPD Pediatri — Paket 3 (Komprehensif B)",
    deskripsi: "Endokrinologi, Infeksi Tropis, Respirologi, Neurologi, Tumbuh Kembang",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi Komprehensif",
    badge: "15 Soal / 15 Menit",
    daftarSoal: [
      {
        id: "p2-soal-16",
        nomor: 1,
        subdivisi: "endokrinologi",
        subdivisiLabel: "Endokrinologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 8 tahun dibawa oleh orang tuanya ke poliklinik anak dengan keluhan anak tampak sangat kurus. Pasien memiliki keluhan merasa sering haus, sehingga minum terus-menerus. Kemudian pasien sering sekali makan. Pasien juga sering terbangun untuk buang air kecil. Keluhan ini sudah dirasakan sejak 3 bulan yang lalu. Pemeriksaan tanda vital TD 90/70, HR 90, RR 24, T 36,2°C. Pemeriksaan GDS didapatkan hasil 350 mg/dL.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Akarbose" },
          { id: "b", teks: "Insulin" },
          { id: "c", teks: "Glibenklamid" },
          { id: "d", teks: "Glimepirid" },
          { id: "e", teks: "Metformin" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Gejala klasik polidipsia, polifagia, poliuria, dan penurunan BB disertai hiperglikemia (GDS 350 mg/dL) pada anak usia 8 tahun merupakan manifestasi Diabetes Melitus Tipe 1. Terapi mutlak dan esensial yang wajib diberikan seumur hidup adalah Insulin eksogen.",
        referensi: "Konsensus Nasional Pengelolaan Diabetes Melitus Tipe 1 IDAI / ISPAD Guidelines."
      },
      {
        id: "p2-soal-17",
        nomor: 2,
        subdivisi: "endokrinologi",
        subdivisiLabel: "Endokrinologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 6 tahun datang dibawa oleh orang tuanya dengan keluhan lemas sejak 3 jam yang lalu. Riwayat orang tua pasien menderita Diabetes melitus. Pada pemeriksaan fisik tampak mengantuk dengan TD 80/60, HR 120, RR 36, T 36,2°C. Pada pemeriksaan GDS didapatkan hasil 35 mg/dL.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Berikan glukosa oral ditambah dengan glukosa 5% dan cek ulang 1 jam kemudian" },
          { id: "b", teks: "Berikan glukosa oral dan cek ulang 1 jam kemudian" },
          { id: "c", teks: "Bolus glukosa 10% 2 mL/kgBB dan cek ulang 1 jam kemudian" },
          { id: "d", teks: "Infus NaCl 0,9% 20 mL/kgBB" },
          { id: "e", teks: "Injeksi insulin short acting subkutan" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Pada anak sadar/kooperatif yang mengalami hipoglikemia, terapi lini pertama adalah pemberian karbohidrat kerja cepat per oral (glukosa oral 10–20 gram) kemudian evaluasi ulang kadar gula darah berkala.",
        referensi: "Konsensus Tata Laksana Hipoglikemia pada Anak IDAI."
      },
      {
        id: "p2-soal-18",
        nomor: 3,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "3B",
        vignette:
          "Seorang anak perempuan berusia 3,5 tahun datang dibawa oleh orang tuanya ke poliklinik anak dengan keluhan anak tidak respons terhadap suara panggilan. Riwayat anak lahir secara normal dengan BBL 3000 gram di bidan. Pemeriksaan tanda vital TD 80/60, HR 100, RR 30, T 36,3°C. Pemeriksaan fisik dijumpai adanya kekeruhan pada kedua lensa mata, auskultasi jantung terdengar murmur sistolik pada apex. Pada pemeriksaan menggunakan garpu tala dijumpai Rinne (+/+), Weber tidak ada lateralisasi, Schwabach memendek di kedua telinga.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Tuli konduktif" },
          { id: "b", teks: "Rubeola" },
          { id: "c", teks: "Toxoplasmosis" },
          { id: "d", teks: "Herpes simplex" },
          { id: "e", teks: "Rubella" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Trias Klasik Gregg (Congenital Rubella Syndrome): Katarak kongenital bilateral (kekeruhan lensa), Tuli sensorineural (Schwabach memendek), dan Penyakit Jantung Bawaan (PDA/stenosis arteri pulmonalis).",
        referensi: "Buku Ajar Infeksi & Pediatri Tropis IDAI."
      },
      {
        id: "p2-soal-19",
        nomor: 4,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 4 tahun datang diantar oleh orang tuanya ke rumah sakit dengan keluhan ruam pada seluruh tubuh. Ruam kemerahan muncul sejak dua hari lalu. Keluhan disertai demam, nyeri kepala, dan nyeri tenggorok. Pemeriksaan tanda vital TD 80/60, HR 120, RR 30, T 39°C. Pada pemeriksaan fisik didapatkan ruam makulopapular generalisata, lidah edema dan eritema.",
        pertanyaan: "Etiologi pada keluhan pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Autoimun" },
          { id: "b", teks: "Parvovirus B19" },
          { id: "c", teks: "Streptococcus BHGA" },
          { id: "d", teks: "Human herpes virus 6" },
          { id: "e", teks: "Staphylococcus aureus" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Faringitis eksudatif yang disertai demam, ruam skarlatiniform (sandpaper appearance), dan strawberry tongue (lidah bengkak eritematosa) disebabkan oleh eksotoksin pirogenik Streptococcus beta hemolyticus grup A (SBHGA) pada penyakit Scarlet Fever.",
        referensi: "Red Book: Report of the Committee on Infectious Diseases AAP."
      },
      {
        id: "p2-soal-20",
        nomor: 5,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 18 bulan datang dibawa orang tuanya ke puskesmas dengan keluhan demam, batuk pilek, dan muncul ruam kulit sejak 4 hari yang lalu. Ruam awalnya muncul pada mulut berupa bercak kemerahan yang kemudian menjadi lenting berisi air. Pasien selalu menangis ketika makan karena merasa nyeri saat menelan, sehingga tidak mau makan. Pemeriksaan tanda vital TD 80/60, HR 100, RR 30, T 39,2°C. Pada pemeriksaan fisik ditemukan lesi vesikel eritematosa pada palmar, plantar, gluteus, dan ditemukan lesi aftosa multipel dengan tepi eritema pada mukosa bukal.",
        pertanyaan: "Pernyataan yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Diagnosis pasien adalah roseola infantum" },
          { id: "b", teks: "Shingles merupakan nama lain dari penyakit pasien" },
          { id: "c", teks: "Penyakit pasien tidak dapat sembuh sendiri" },
          { id: "d", teks: "Etiologi kondisi pasien adalah coxsackievirus A61" },
          { id: "e", teks: "Terapi suportif merupakan tatalaksana yang dapat diberikan" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Hand, Foot, and Mouth Disease (HFMD / Flu Singapura) disebabkan oleh enterovirus (umumnya Coxsackievirus A16 atau Enterovirus 71). Penyakit ini bersifat self-limiting sehingga terapi utamanya adalah terapi suportif dan simtomatik (antipiretik, hidrasi adekuat, dan pereda nyeri mukosa).",
        referensi: "Pedoman Tata Laksana Infeksi Tropis IDAI."
      },
      {
        id: "p2-soal-21",
        nomor: 6,
        subdivisi: "endokrinologi",
        subdivisiLabel: "Endokrinologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 8 bulan datang dibawa oleh orang tuanya ke rumah sakit dengan keluhan anak tidak mau minum ASI sejak lahir. Jika menangis terdengar suara serak. Saat ini pasien hanya bisa mengangkat kepalanya. Pemeriksaan tanda vital TD 80/60, HR 120, RR 40, T 36,2°C. Pemeriksaan fisik dijumpai makroglossia, wajah dismorfik, kulit kering, serta hernia umbilikalis.",
        pertanyaan: "Pemeriksaan penunjang awal yang dapat dilakukan untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "fT4" },
          { id: "b", teks: "TSH" },
          { id: "c", teks: "LH" },
          { id: "d", teks: "FSH" },
          { id: "e", teks: "fT3" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Gejala tangisan serak, makroglosia, hernia umbilikalis, keterlambatan motorik, dan hipotonia sangat mengarah pada Hipotiroid Kongenital. Pemeriksaan laboratorium skrining dan penunjang awal utama yang paling sensitif adalah Thyroid Stimulating Hormone (TSH).",
        referensi: "Pedoman Skrining Hipotiroid Kongenital Kemenkes RI / IDAI."
      },
      {
        id: "p2-soal-22",
        nomor: 7,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 12 bulan dibawa ke rumah sakit oleh orang tuanya dengan keluhan timbul ruam merah di seluruh tubuh sejak 2 hari yang lalu. Ruam muncul diawali pada daerah belakang telinga, kemudian menyebar ke seluruh tubuh. Riwayat pasien memiliki batuk, pilek, dan demam sejak 3 hari yang lalu serta mata berair. Pemeriksaan tanda vital TD 80/60, HR 100, RR 30, T 39,2°C. Pada pemeriksaan fisik didapatkan konjungtivitis (+), mukosa mulut ditemukan Koplik spot, iga gambang (+), dan baggy pants (+).",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Vitamin A 50.000 IU pada hari 1 dan 2" },
          { id: "b", teks: "Vitamin A 100.000 IU pada hari 1 dan 2" },
          { id: "c", teks: "Vitamin A 200.000 IU pada hari 1 dan 2" },
          { id: "d", teks: "Vitamin A 100.000 IU pada hari 1, 2, dan 2–4 minggu setelah pemberian kedua" },
          { id: "e", teks: "Vitamin A 200.000 IU pada hari 1, 2, dan 2–4 minggu setelah pemberian kedua" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Pasien mengalami Campak/Morbili pada anak usia ≥ 12 bulan disertai komplikasi gizi buruk (iga gambang, baggy pants). Pada kondisi campak dengan malnutrisi berat/defisiensi vitamin A nyata, dosis Vitamin A adalah 200.000 IU kapsul merah pada hari ke-1, hari ke-2, dan dosis ketiga diberikan 2–4 minggu kemudian.",
        referensi: "Buku Saku Pelayanan Kesehatan Anak di Rumah Sakit WHO / Kemenkes RI."
      },
      {
        id: "p2-soal-23",
        nomor: 8,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 12 bulan datang dibawa orang tuanya ke IGD karena anak tampak sesak. Pasien juga mengeluhkan batuk pilek sejak 3 hari yang lalu dan belum diberikan obat apa pun. Riwayat keluhan serupa disangkal. Pemeriksaan tanda vital didapatkan TD 80/60, HR 100, RR 60, T 38°C. Pemeriksaan fisik paru didapatkan wheezing (+/+), fine inspiratory crackles (+). Pemeriksaan foto toraks didapatkan gambaran air trapping (+) dan hiperaerasi (+).",
        pertanyaan: "Etiologi yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Haemophilus influenzae tipe b" },
          { id: "b", teks: "Respiratory syncytial virus" },
          { id: "c", teks: "Bordetella pertussis" },
          { id: "d", teks: "Streptococcus pneumoniae" },
          { id: "e", teks: "Parainfluenza virus" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Episode pertama mengi ekspiratoir dan ronki halus pada bayi < 2 tahun yang diawali ISPA atas disertai tanda hiperinflasi paru pada rontgen adalah gambaran klinis Bronkiolitis Akut. Agen etiologi tersering (> 80% kasus) adalah Respiratory Syncytial Virus (RSV).",
        referensi: "Konsensus Penanganan Bronkiolitis Akut pada Anak IDAI."
      },
      {
        id: "p2-soal-24",
        nomor: 9,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 6 tahun datang ke IGD diantar oleh orang tuanya dengan keluhan sesak napas. Sesak dialami sejak 1 jam yang lalu. Keluhan sesak sudah dialami pasien sebanyak tiga kali dalam seminggu. Pasien hanya bisa menjawab pertanyaan dalam kata yang terputus-putus dan lebih nyaman dengan posisi duduk. Tanda vital TD 90/60, HR 90, RR 50, T 37°C, SpO2 96%. Pada pemeriksaan fisik didapatkan pasien tampak gelisah dengan otot bantu pernapasan (+), retraksi dinding dada (+), wheezing (+) seluruh lapang paru, sianosis (-).",
        pertanyaan: "Diagnosis yang tepat pada pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Asma intermiten serangan sedang" },
          { id: "b", teks: "Asma persisten sedang serangan berat" },
          { id: "c", teks: "Asma persisten sedang serangan sedang" },
          { id: "d", teks: "Asma intermiten serangan berat" },
          { id: "e", teks: "Asma persisten ringan serangan berat" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Klasifikasi derajat penyakit asma (GINA/IDAI): gejala >2×/minggu tetapi TIDAK setiap hari = Persisten Ringan (bukan persisten sedang; persisten sedang = gejala hampir setiap hari). Derajat serangan akut: bicara terputus per kata, posisi duduk bertumpu, gelisah, RR 50×/mnt, SpO₂ 96%, retraksi nyata, wheezing seluruh lapang paru = Serangan Berat. Sehingga diagnosis lengkap yang tepat adalah Asma Persisten Ringan Serangan Berat.",
        referensi: "Pedoman Nasional Asma Anak (PNAA) IDAI 2022; GINA Global Strategy for Asthma Management 2023."
      },
      {
        id: "p2-soal-25",
        nomor: 10,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 4 tahun datang ke puskesmas dibawa oleh orang tuanya dengan keluhan batuk sejak 10 hari yang lalu. Batuk disertai bunyi melengking. Keluhan lain disertai adanya muntah setelah batuk. Riwayat imunisasi tidak lengkap. Pemeriksaan tanda vital TD 90/60, HR 100, RR 50, T 37,4°C. Pada pemeriksaan fisik keadaan umum pasien tampak sesak dengan perdarahan subkonjungtiva dan sianosis pada bibir.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Observasi karena bersifat self-limiting" },
          { id: "b", teks: "Ceftriaxone 1 gram/hari" },
          { id: "c", teks: "Eritromisin 40–50 mg/kgBB dibagi 4 dosis" },
          { id: "d", teks: "Kloramfenikol 50 mg/kgBB dibagi 4 dosis" },
          { id: "e", teks: "Dexamethasone 0,3–0,6 mg/kgBB/hari" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pasien mengalami Pertusis (Whooping Cough / Batuk 100 Hari) pada fase paroksismal (batuk paroksismal, whoop inspiratoir, post-tussive vomiting, subconjunctival bleeding). Terapi antibiotik lini pertama pilihan adalah golongan makrolida, yaitu Eritromisin oral dosis 40–50 mg/kgBB/hari terbagi 4 dosis selama 14 hari.",
        referensi: "Pedoman Pengendalian Pertusis Kemenkes RI / WHO."
      },
      {
        id: "p2-soal-26",
        nomor: 11,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 6 tahun datang ke poliklinik dibawa oleh orang tuanya karena anak mengalami sesak napas. Keluhan disertai demam, batuk seperti menggonggong, dan suara serak. Pemeriksaan tanda vital TD 90/60, HR 100, RR 50, T 38,4°C. Pada pemeriksaan fisik didapatkan stridor inspirasi, retraksi intercostal (+), dan pemeriksaan rontgen servikal didapatkan gambaran steeple sign.",
        pertanyaan: "Diagnosis yang tepat pada pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Pertussis" },
          { id: "b", teks: "Asma bronkial" },
          { id: "c", teks: "Croup" },
          { id: "d", teks: "Laryngomalacia" },
          { id: "e", teks: "Epiglottitis" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Trias klinis Croup (Laringotrakeobronkitis Akut): batuk menggonggong (barking cough), suara parau (hoarseness), dan stridor inspiratorik. Pada rontgen leher AP didapatkan penyempitan trakea subglotis khas menyerupai menara gereja (Steeple sign).",
        referensi: "Nelson Essentials of Pediatrics; Panduan Praktik Klinis Respirologi Anak IDAI."
      },
      {
        id: "p2-soal-27",
        nomor: 12,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang anak laki-laki berusia 4 tahun datang dibawa oleh orang tuanya ke IGD karena anak tampak sesak napas. Keluhan sesak disertai demam sejak 3 hari yang lalu, kemudian pasien juga mengeluhkan nyeri menelan, suara yang berubah, dan lebih sering mengeluarkan air liur. Pemeriksaan tanda vital didapatkan TD 80/60, HR 100, RR 40, T 38,5°C. Pada pemeriksaan fisik didapatkan retraksi intercostal (+).",
        pertanyaan: "Agen yang menyebabkan keluhan pasien adalah?",
        opsi: [
          { id: "a", teks: "Haemophilus influenzae tipe b" },
          { id: "b", teks: "Bordetella pertussis" },
          { id: "c", teks: "Parainfluenza virus" },
          { id: "d", teks: "Mycobacterium tuberculosis" },
          { id: "e", teks: "Respiratory syncytial virus" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Gejala 4D (Dysphagia, Dysphonia, Drooling, Distress pernapasan) yang progresif cepat dengan posisi tripod adalah gambaran khas Epiglotitis Akut. Etiologi tersering pada anak yang belum divaksinasi adalah Haemophilus influenzae type b (Hib).",
        referensi: "Pediatric Emergency Medicine; Red Book AAP."
      },
      {
        id: "p2-soal-28",
        nomor: 13,
        subdivisi: "neurologi",
        subdivisiLabel: "Neurologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 1 tahun datang ke IGD dibawa oleh orang tuanya karena mengalami kejang 15 menit yang lalu. Sebelum kejang, pasien mengalami demam. Pasien mengalami kejang seluruh tubuh dengan durasi 1 menit. Pasien belum diberikan obat apa pun dan saat ini pasien mengalami kejang kembali. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 30, T 40°C. Pada pemeriksaan fisik didapatkan anak sadar, kaku kuduk (-), Brudzinski (-), Lasègue (-), Kernig (-), BB 11 kg. Saat sedang diperiksa, anak kembali kejang.",
        pertanyaan: "Tatalaksana yang dapat diberikan untuk kasus pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Fenobarbital IV 20 mg/kgBB" },
          { id: "b", teks: "Diazepam IV 10 mg" },
          { id: "c", teks: "Diazepam rektal 5 mg suppositoria" },
          { id: "d", teks: "Fenitoin IV 20 mg/kgBB" },
          { id: "e", teks: "Diazepam rektal 10 mg suppositoria" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pada tata laksana kejang akut anak di mana belum terpasang akses intravena, lini pertama adalah pemberian Diazepam per rektal: Dosis 5 mg untuk anak dengan BB < 12 kg (atau 10 mg untuk BB ≥ 12 kg). Pada soal BB anak 11 kg, maka dosis yang tepat adalah Diazepam rektal 5 mg.",
        referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI."
      },
      {
        id: "p2-soal-29",
        nomor: 14,
        subdivisi: "neurologi",
        subdivisiLabel: "Neurologi",
        tingkatSKDI: "3A",
        vignette:
          "Seorang anak laki-laki berusia 2 tahun dibawa oleh orang tuanya ke poliklinik karena perkembangan anaknya tidak sesuai dengan teman seusianya. Pasien sulit untuk berjalan dan perlu dibantu untuk berdiri. Komunikasi pasien terhadap lingkungan sekitar kurang dan pasien kesulitan dalam makan dan minum. Riwayat kehamilan dan persalinan normal pervaginam, menangis spontan namun mengalami partus lama. Pemeriksaan tanda vital TD 90/70, HR 100, RR 30, T 36,3°C. Pada pemeriksaan fisik didapatkan kontak mata kurang baik, scissors gait (+), hipertonus pada ekstremitas superior-inferior dextra.",
        pertanyaan: "Diagnosis yang tepat pada kondisi pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Cerebral palsy spastik tipe hemiplegik" },
          { id: "b", teks: "Cerebral palsy tipe athetoid" },
          { id: "c", teks: "Cerebral palsy spastik tipe quadriplegi" },
          { id: "d", teks: "Cerebral palsy spastik tipe diplegik" },
          { id: "e", teks: "Cerebral palsy tipe ataxic" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Adanya gangguan motorik non-progresif sejak dini disertai hipertonisitas/spastisitas yang mengenai satu sisi tubuh (ekstremitas superior dan inferior dextra) mengarah pada Cerebral Palsy Spastik tipe Hemiplegik.",
        referensi: "Buku Ajar Neurologi Anak IDAI."
      },
      {
        id: "p2-soal-30",
        nomor: 15,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "3A",
        vignette:
          "Seorang anak laki-laki berusia 3 tahun datang ke poliklinik anak diantar oleh orang tuanya karena anak belum dapat berjalan seperti anak seusianya. Keluhan lain didapatkan pasien mengalami kesulitan ketika berdiri. Pasien harus bertumpu pada paha menggunakan tangan agar dapat berdiri. Riwayat paman dari ibu pernah ada yang mengalami hal serupa. Pemeriksaan tanda vital didapatkan TD 90/60, HR 100, RR 30, T 37°C. Pemeriksaan fisik didapatkan waddling gait, Gowers sign (+), otot betis terlihat hipertrofi, hiporefleksia (+).",
        pertanyaan: "Etiologi pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Mutasi gen dystrophin yang diproduksi secara parsial" },
          { id: "b", teks: "Adanya suatu infeksi akibat virus/bakteri" },
          { id: "c", teks: "Mutasi gen dystrophin yang tidak diproduksi" },
          { id: "d", teks: "Keluhan terjadi akibat suatu autoimun" },
          { id: "e", teks: "Pelaksanaan imunisasi yang tidak lengkap" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Tanda khas Gowers sign (+), pseudohipertrofi betis (calf pseudohypertrophy), waddling gait, dan pewarisan X-linked resesif merupakan ciri Duchenne Muscular Dystrophy (DMD), di mana mutasi gen dystrophin menyebabkan ketiadaan total (absence) produksi protein distrofin fungsional.",
        referensi: "Nelson Textbook of Pediatrics; Neuromuscular Disorders in Children."
      },
    ],
  },
  {
    id: "drill-pediatri-paket-3",
    slug: "drill-pediatri-paket-3",
    judul: "Try Out UKMPPD Pediatri — Paket 4 (Komprehensif C)",
    deskripsi: "Neonatologi, Tumbuh Kembang, Nutrisi & Metabolik, Infeksi Tropis, Alergi & Imunologi, Endokrinologi, Respirologi, Gastrohepatologi",
    durasiMenit: 15,
    passingGradePersen: 66,
    kategori: "ukmppd",
    kategoriLabel: "Simulasi Komprehensif",
    badge: "15 Soal / 15 Menit",
    daftarSoal: [
      {
        id: "p3-soal-31",
        nomor: 1,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang bayi laki-laki baru lahir beberapa jam yang lalu di RS dari seorang ibu G1P0A0 dengan usia kehamilan 32 minggu dengan BBL 2.100 gram. Bayi tidak menangis spontan setelah lahir. Lalu pasien dilakukan pemasangan ventilator selama 1 bulan untuk mengatasi sesak pada pasien. Pemeriksaan tanda vital TD 80/60, HR 120, RR 70, T 37°C. Pada pemeriksaan fisik didapatkan retraksi intercostal (+), pernapasan cuping hidung (+), sianosis perioral (+).",
        pertanyaan: "Diagnosis yang tepat pada kondisi pasien adalah?",
        opsi: [
          { id: "a", teks: "Bronchiolitis" },
          { id: "b", teks: "Transient Tachypnea of the Newborn" },
          { id: "c", teks: "Bronchopulmonary dysplasia" },
          { id: "d", teks: "Hyaline membrane disease" },
          { id: "e", teks: "Meconium aspiration syndrome" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Bayi prematur dengan riwayat RDS yang membutuhkan bantuan oksigen dan ventilasi mekanik jangka panjang (> 28 hari) serta masih mengalami ketergantungan oksigen/distres napas kronik didiagnosis sebagai Bronchopulmonary Dysplasia (BPD) / Chronic Lung Disease of Prematurity.",
        referensi: "Pedoman Pelayanan Medis Neonatus IDAI."
      },
      {
        id: "p3-soal-32",
        nomor: 2,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang anak laki-laki berusia 2 minggu datang dibawa oleh orang tuanya ke IGD RS dengan keluhan anak tampak lemas dan tidak mau menyusu, bahkan sempat kejang kelojotan 1 kali dengan durasi 30 detik dan tidak sadar setelah kejang. Selain itu orang tuanya mengeluhkan anak terlihat kuning sejak hari pertama lahir. Anak mendapatkan ASI sejak lahir sebanyak 8 kali per hari. BAB seperti dempul dan BAK seperti warna teh disangkal. Ibu memiliki golongan darah B. Pemeriksaan tanda vital TD 80/60, HR 100, RR 40, T 37°C. Pada pemeriksaan fisik anak tampak tidak aktif dan terus tertidur walaupun diberi rangsangan. Pemeriksaan laboratorium didapatkan golongan darah anak B, bilirubin total 21 mg/dL.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Breastmilk jaundice" },
          { id: "b", teks: "Kern icterus" },
          { id: "c", teks: "Atresia bilier" },
          { id: "d", teks: "Breastfeeding jaundice" },
          { id: "e", teks: "Inkompatibilitas golongan darah" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Hiperbilirubinemia berat (bilirubin 21 mg/dL) yang disertai manifestasi neurologis (letargi, penurunan kesadaran, kejang, penolakan minum) menandakan telah terjadi deposisi bilirubin indirek di basal ganglia (ensefalopati bilirubin kronis / Kernicterus).",
        referensi: "Tata Laksana Hiperbilirubinemia Neonatus IDAI."
      },
      {
        id: "p3-soal-33",
        nomor: 3,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 2,5 tahun dibawa ke dokter anak karena belum dapat berbicara dan tumbuh kembang tidak sesuai dengan teman seusianya. Pemeriksaan tanda vital TD 90/60, HR 100, RR 30, T 36,8°C. Pada pemeriksaan fisik didapatkan kepala microcephalic dengan bagian anteroposterior mendatar, sela hidung datar, macroglossia, mata sipit dengan sudut bagian bawah-tengah membentuk lipatan, jarak antara jari pertama dan kedua pada tangan dan kaki melebar.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Sindrom Edward" },
          { id: "b", teks: "Sindrom Down" },
          { id: "c", teks: "Sindrom Patau" },
          { id: "d", teks: "Sindrom Klinefelter" },
          { id: "e", teks: "Sindrom Turner" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Stigma dismorfik khas: brakisefali dengan oksiput mendatar, epicanthal folds pada mata, jembatan hidung datar (flat nasal bridge), makroglosia, dan sandal gap (jarak lebar ibu jari kaki ke jari kedua) merupakan ciri patognomonik Sindrom Down (Trisomi 21).",
        referensi: "Nelson Textbook of Pediatrics; Panduan Tumbuh Kembang Anak IDAI."
      },
      {
        id: "p3-soal-34",
        nomor: 4,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "3A",
        vignette:
          "Seorang anak laki-laki berusia 3 tahun datang dibawa oleh orang tuanya ke poliklinik dengan keluhan kepala anak terlihat miring ke sisi kiri. Hal ini telah disadari sejak lahir. Anak lahir secara normal dengan berat 2.600 gram, cukup bulan, dan anak menangis spontan. Riwayat demam tinggi dan trauma disangkal. Riwayat vaksinasi lengkap. Perkembangan anak baik dan sesuai dengan usia. Pemeriksaan tanda vital TD 90/60, HR 100, RR 30, T 37°C. Pada pemeriksaan fisik terdapat kepala yang miring ke sisi kiri, garis rambut posterior rendah dan leher pendek, disertai ROM terbatas.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Sindroma Turner" },
          { id: "b", teks: "Tortikolis didapat" },
          { id: "c", teks: "Sindroma Klippel-Feil" },
          { id: "d", teks: "Fraktur clavicula" },
          { id: "e", teks: "Tortikolis kongenital" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Trias klasik Klippel-Feil Syndrome: leher pendek (short neck), batas garis rambut posterior yang rendah (low posterior hairline), dan keterbatasan rentang gerak leher (limited cervical range of motion) akibat fusi kongenital vertebra servikalis.",
        referensi: "Nelson Textbook of Pediatrics; Orthopaedic Pediatrics."
      },
      {
        id: "p3-soal-35",
        nomor: 5,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 3 tahun diantar oleh ibunya ke posyandu balita untuk melakukan pengukuran rutin tinggi badan dan berat badan anak, serta melakukan skrining pada perkembangan anak. Anak tidak memiliki keluhan apa pun. Pemeriksaan tanda vital TD 90/60, HR 100, RR 30, T 36,3°C. Pada hasil pengukuran didapatkan BB menurut usia di bawah -3, TB menurut usia di antara -2 dan -1, dan BB menurut TB < -3 SD.",
        pertanyaan: "Interpretasi pertumbuhan pada anak tersebut adalah?",
        opsi: [
          { id: "a", teks: "BB normal, Gizi buruk, Pendek" },
          { id: "b", teks: "BB sangat kurang, Gizi buruk, Tinggi normal" },
          { id: "c", teks: "BB normal, Gizi baik, Tinggi normal" },
          { id: "d", teks: "BB kurang, Gizi buruk, Tinggi normal" },
          { id: "e", teks: "BB kurang, Gizi kurang, Pendek" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Berdasarkan Kurva Antropometri Standar WHO (Permenkes No. 2/2020): BB/U < -3 SD = Berat Badan Sangat Kurang (Severely Underweight); TB/U antara -2 SD s.d. -1 SD = Tinggi Normal; BB/TB < -3 SD = Gizi Buruk (Severely Wasted).",
        referensi: "Permenkes RI No 2 Tahun 2020 tentang Standar Antropometri Anak."
      },
      {
        id: "p3-soal-36",
        nomor: 6,
        subdivisi: "tumbuh-kembang",
        subdivisiLabel: "Tumbuh Kembang",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 24 bulan datang diantar kedua orang tuanya ke puskesmas untuk melihat pertumbuhan dan perkembangan anak. Keluhan pada anak disangkal. Pemeriksaan tanda vital TD 80/60, HR 100, RR 30, T 37,2°C. Pemeriksaan fisik dalam batas normal. Pada pemeriksaan antropometri didapatkan hasil sesuai dengan usia dan berada di garis hijau. Pada saat pemeriksaan KPSP didapatkan total skor 9.",
        pertanyaan: "Interpretasi dan tatalaksana lanjutan untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Sesuai usia dan perlu rujuk ke Sp.A" },
          { id: "b", teks: "Meragukan, namun dianggap tidak ada gangguan" },
          { id: "c", teks: "Meragukan, sehingga beri nasihat ibu untuk stimulasi dan cek ulang 2 minggu lagi" },
          { id: "d", teks: "Terdapat penyimpangan dan perlu rujuk ke Sp.A" },
          { id: "e", teks: "Sesuai usia dan periksa ulang pada usia selanjutnya" },
        ],
        jawabanBenar: "e",
        pembahasan:
          "Skor KPSP 9 atau 10 berarti perkembangan anak Sesuai Tahap Perkembangan (S). Tatalaksana yang tepat adalah melanjutkan stimulasi perkembangan anak dan menjadwalkan pemeriksaan KPSP berkala pada usia skrining berikutnya.",
        referensi: "Buku Panduan SDIDTK Kemenkes RI."
      },
      {
        id: "p3-soal-37",
        nomor: 7,
        subdivisi: "nutrisi-metabolik",
        subdivisiLabel: "Nutrisi & Metabolik",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 24 bulan datang dibawa oleh orang tuanya ke IGD karena anak tampak lemas. Anak mengalami BAB cair dan mual muntah sejak kemarin, BAB cair kurang lebih 10 kali dalam sehari. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 30, T 36,7°C. Pemeriksaan fisik didapatkan anak tampak gelisah dan kehausan, terlihat sangat kurus, mata cowong (+), iga gambang (+), baggy pants (+). Pada pemeriksaan GDS 90 mg/dL.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Berikan RL 30 cc/kg dalam 30 menit, lanjut 70 cc/kg dalam 2,5 jam" },
          { id: "b", teks: "Berikan oralit 200 cc/BAB cair" },
          { id: "c", teks: "Berikan Resomal 5 mL/kgBB tiap 30 menit dalam 2 jam pertama" },
          { id: "d", teks: "Berikan 50 mL glukosa 10% atau 10% sukrosa (1 sdt gula + 50 mL air) per oral" },
          { id: "e", teks: "Berikan oralit 75 cc/kg dalam 3 jam pertama" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pada anak gizi buruk (marasmus) dengan dehidrasi yang masih sadar, rehidrasi cairan oral dilakukan secara bertahap dengan larutan ReSoMal sebanyak 5 mL/kgBB setiap 30 menit selama 2 jam pertama, kemudian dilanjutkan evaluasi tanda hidrasi.",
        referensi: "Pedoman Tata Laksana Gizi Buruk Kemenkes RI / WHO."
      },
      {
        id: "p3-soal-38",
        nomor: 8,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 1 tahun datang ke poliklinik dibawa oleh orang tuanya dengan keluhan batuk sejak 2 minggu yang lalu. Batuk disertai bunyi melengking. Terkadang pasien muntah setelah batuk. Riwayat imunisasi tidak lengkap. Pemeriksaan tanda vital didapatkan TD 80/60, HR 120, RR 50, T 39,1°C. Pada pemeriksaan fisik didapatkan keadaan umum tampak sesak, perdarahan subkonjungtiva (+), dan sianosis pada bibir (+).",
        pertanyaan: "Vaksinasi yang seharusnya diberikan untuk mencegah penyakit ini adalah?",
        opsi: [
          { id: "a", teks: "MMR" },
          { id: "b", teks: "Polio" },
          { id: "c", teks: "DPT" },
          { id: "d", teks: "Hepatitis B" },
          { id: "e", teks: "PCV" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pasien menderita Pertusis (Batuk Rejan). Imunisasi pencegahan primer yang wajib diberikan dalam program nasional adalah vaksin DPT (Difteri, Pertusis, Tetanus) yang diberikan pada usia 2, 3, 4 bulan dan booster pada usia 18 bulan.",
        referensi: "Jadwal Imunisasi Anak Rekomendasi IDAI 2024."
      },
      {
        id: "p3-soal-39",
        nomor: 9,
        subdivisi: "alergi-imunologi",
        subdivisiLabel: "Alergi & Imunologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang bayi laki-laki berusia 8 bulan datang dibawa oleh orang tua ke IGD rumah sakit karena mengalami diare sejak 3 hari lalu. Keluhan disertai adanya ruam-ruam pada kulit. Pasien baru saja konsumsi susu formula dikarenakan sudah selesai ASI eksklusif. Pemeriksaan fisik didapatkan tanda vital TD 80/60, HR 100, RR 36, T 36,5°C. Pada pemeriksaan fisik didapatkan bising usus meningkat dan terdapat makula eritema multipel generalisata.",
        pertanyaan: "Pernyataan yang tepat untuk pasien tersebut adalah?",
        opsi: [
          { id: "a", teks: "Etiologi berupa defisiensi enzim laktase" },
          { id: "b", teks: "Tatalaksana yang diberikan berupa susu terhidrolisis sempurna" },
          { id: "c", teks: "Diagnosis pasien adalah intoleransi laktosa" },
          { id: "d", teks: "Pemeriksaan penunjang yang dilakukan adalah hydrogen breath test" },
          { id: "e", teks: "Kelainan pasien bukan merupakan reaksi imunologis" },
        ],
        jawabanBenar: "b",
        pembahasan:
          "Manifestasi diare disertai kelainan kulit (urtikaria/makula eritematosa multipel) yang timbul setelah pengenalan susu sapi merupakan tanda Alergi Susu Sapi (CMA / Cow's Milk Allergy - reaksi imunologis). Tatalaksana lini pertama pada bayi non-ASI adalah penggantian susu formula dengan formula terhidrolisat ekstensif/sempurna (Extensively Hydrolyzed Formula / eHF).",
        referensi: "Rekomendasi Diagnosis dan Tata Laksana Alergi Susu Sapi IDAI."
      },
      {
        id: "p3-soal-40",
        nomor: 10,
        subdivisi: "neonatologi",
        subdivisiLabel: "Neonatologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang bayi laki-laki baru lahir dibantu oleh bidan dan dibawa ke RS dengan keluhan bayi tampak sesak dan biru. Bayi lahir dari seorang ibu P1A0 usia kandungan 42 minggu dengan BBL 3.000 gram. Bayi tidak menangis spontan setelah lahir. Pemeriksaan tanda vital TD 80/60, HR 130, RR 70, T 37°C. Pada pemeriksaan fisik didapatkan pernapasan cuping hidung (+), sianosis perioral (+), retraksi intercostal (+).",
        pertanyaan: "Mekanisme penyebab terjadinya keluhan pada pasien?",
        opsi: [
          { id: "a", teks: "Ventilasi oksigen jangka panjang" },
          { id: "b", teks: "Imaturitas struktur paru dan insufisiensi produksi surfaktan" },
          { id: "c", teks: "Adanya retensi cairan di paru" },
          { id: "d", teks: "Aspirasi cairan amnion yang mengandung meconium" },
          { id: "e", teks: "Penyerapan dan pengeluaran cairan alveolar paru yang terhambat" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Pada kehamilan lewat waktu / postterm (42 minggu), hipoksia intrauterin memicu pasase mekonium ke dalam cairan ketuban. Bayi lahir asfiksia dengan distres pernapasan berat menunjukkan Sindrom Aspirasi Mekonium (SAM/MAS) akibat aspirasi cairan amnion bercampur mekonium ke saluran napas bawah.",
        referensi: "Pedoman Pelayanan Medis Neonatus IDAI."
      },
      {
        id: "p3-soal-41",
        nomor: 11,
        subdivisi: "endokrinologi",
        subdivisiLabel: "Endokrinologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 2 bulan datang dibawa oleh orang tuanya ke rumah sakit dengan keluhan anak tidak mau minum ASI sejak lahir. Ketika menangis terdapat suara serak. Saat ini pasien belum bisa mengangkat kepalanya. Pemeriksaan tanda vital TD 80/60, N 120, RR 40, T 37,2°C. Pemeriksaan fisik dijumpai makroglossia, wajah dismorfik, dan hernia umbilikalis.",
        pertanyaan: "Pernyataan yang benar berdasarkan kasus di atas adalah?",
        opsi: [
          { id: "a", teks: "Diagnosis pasien adalah Down syndrome" },
          { id: "b", teks: "Keluhan pasien muncul karena kekurangan zat besi" },
          { id: "c", teks: "Pemeriksaan penunjang yang diperlukan adalah FSH" },
          { id: "d", teks: "Skoring yang digunakan dalam menegakkan diagnosis adalah Quebec score" },
          { id: "e", teks: "Tatalaksana yang diberikan adalah Metimazol" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Klinis menggambarkan Hipotiroid Kongenital (makroglosia, hernia umbilikalis, suara serak, hipotonia/keterlambatan motorik). Salah satu sistem skoring klinis yang digunakan untuk skrining/evaluasi kecurigaan hipotiroid kongenital pada bayi adalah Skor Quebec (Quebec Clinical Scoring System).",
        referensi: "Panduan Praktik Klinis Endokrinologi Anak IDAI."
      },
      {
        id: "p3-soal-42",
        nomor: 12,
        subdivisi: "respirologi",
        subdivisiLabel: "Respirologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak laki-laki berusia 9 tahun datang ke puskesmas dibawa oleh orang tuanya dengan keluhan batuk yang melengking sejak 14 hari yang lalu. Orang tua pasien mengatakan pasien akan muntah setelah batuk dan tarik napas dalam sebelum batuk. Riwayat imunisasi tidak lengkap. Pemeriksaan tanda vital TD 90/60, HR 120, RR 60, T 39°C. Pada pemeriksaan fisik anak tampak sesak, serta ditemukan mata merah dan sianosis pada bibir.",
        pertanyaan: "Fase yang dialami pasien berdasarkan tanda dan gejala pasien adalah?",
        opsi: [
          { id: "a", teks: "Fase inisiasi" },
          { id: "b", teks: "Fase konvalesens" },
          { id: "c", teks: "Fase kataralis" },
          { id: "d", teks: "Fase paroksismal" },
          { id: "e", teks: "Fase maturasi" },
        ],
        jawabanBenar: "d",
        pembahasan:
          "Pertusis memiliki 3 fase klinis: (1) Fase kataral (1-2 minggu pertama, batuk ringan/pilek), (2) Fase paroksismal (minggu ke 2-6, batuk paroksismal beruntun diakhiri inspirasi melengking/whoop, muntah post-tussive, sianosis, perdarahan subkonjungtiva), dan (3) Fase konvalesens (resolusi berangsur-angsur). Pasien berada pada Fase Paroksismal.",
        referensi: "Buku Ajar Respirologi Anak IDAI."
      },
      {
        id: "p3-soal-43",
        nomor: 13,
        subdivisi: "infeksi-tropis",
        subdivisiLabel: "Infeksi Tropis",
        tingkatSKDI: "3A",
        vignette:
          "Seorang bayi perempuan berusia 1 minggu dibawa oleh orang tuanya ke IGD karena anak tidak bangun sejak kemarin. Anak lahir secara pervaginam. Riwayat ibu pasien mengalami demam saat hamil. Saat hamil ibu pasien memelihara kucing di rumah. Pemeriksaan tanda vital TD 80/60, HR 120, RR 30, T 36,4°C. Pemeriksaan fisik anak tampak somnolen dan terdapat hidrosefalus. Pemeriksaan mata tampak adanya korioretinitis dan CT scan tampak kalsifikasi intrakranial difus.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Toxoplasmosis" },
          { id: "b", teks: "Rubella" },
          { id: "c", teks: "Cytomegalovirus" },
          { id: "d", teks: "Sifilis" },
          { id: "e", teks: "Herpes simplex" },
        ],
        jawabanBenar: "a",
        pembahasan:
          "Trias Klasik Sabin (Toksoplasmosis Kongenital): Hidrosefalus, Korioretinitis, dan Kalsifikasi intrakranial difus/intraserebral. Didukung riwayat kontak hewan inang definitif (kucing) selama kehamilan ibu.",
        referensi: "Buku Ajar Infeksi & Pediatri Tropis IDAI."
      },
      {
        id: "p3-soal-44",
        nomor: 14,
        subdivisi: "alergi-imunologi",
        subdivisiLabel: "Alergi & Imunologi",
        tingkatSKDI: "3B",
        vignette:
          "Seorang anak laki-laki berusia 6 tahun datang ke poliklinik dibawa oleh orang tuanya dengan keluhan kemerahan di tangan dan kaki sekitar 1 minggu terakhir. Keluhan disertai mata merah berair dan demam. Pemeriksaan tanda vital TD 90/60, HR 120, RR 30, T 39,2°C. Pemeriksaan fisik didapatkan injeksi konjungtiva ODS, strawberry tongue, dan pembesaran KGB colli. Pemeriksaan laboratorium didapatkan Hb 13, PCV 35%, leukosit 18.000, trombosit 200.000 dan LED 60, PT dan aPTT normal.",
        pertanyaan: "Diagnosis yang tepat pada pasien adalah?",
        opsi: [
          { id: "a", teks: "Measles" },
          { id: "b", teks: "Scarlet fever" },
          { id: "c", teks: "Kawasaki disease" },
          { id: "d", teks: "Eritema infeksiosum" },
          { id: "e", teks: "Exanthema subitum" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Kriteria Penyakit Kawasaki: Demam ≥ 5 hari disertai minimal 4 dari 5 kriteria utama: (1) Perubahan ekstremitas (eritema/edema tangan-kaki), (2) Eksantema polimorfik, (3) Injeksi konjungtiva bulbar non-eksudatif bilateral, (4) Perubahan bibir dan rongga mulut (strawberry tongue, bibir pecah eritema), dan (5) Limfadenopati servikal akut unilateral (KGB colli).",
        referensi: "Pedoman Diagnosis dan Tata Laksana Penyakit Kawasaki IDAI / AHA Guidelines."
      },
      {
        id: "p3-soal-45",
        nomor: 15,
        subdivisi: "gastrohepatologi",
        subdivisiLabel: "Gastrohepatologi",
        tingkatSKDI: "4A",
        vignette:
          "Seorang anak perempuan berusia 5 tahun datang ke IGD dibawa oleh kedua orang tuanya dengan keluhan BAB cair dengan frekuensi sekitar 6 kali dalam sehari sejak 2 hari yang lalu. Keluhan BAB disertai darah maupun lendir disangkal. Orang tua pasien mengatakan anak banyak minum air. Pemeriksaan tanda vital TD 85/60, HR 100, RR 30, T 36,8°C. Pada pemeriksaan fisik anak tampak gelisah, mata cekung, turgor kulit kembali lambat, dan BB 25 kg.",
        pertanyaan: "Tatalaksana yang tepat untuk pasien adalah?",
        opsi: [
          { id: "a", teks: "Dipulangkan, banyak minum di rumah" },
          { id: "b", teks: "Memberikan rehidrasi dengan oralit 200 mL setiap BAB" },
          { id: "c", teks: "Memberikan rehidrasi dengan oralit 1.875 mL dalam 3 jam" },
          { id: "d", teks: "Memberikan rehidrasi melalui IV line 750 mL dalam 30 menit pertama" },
          { id: "e", teks: "Memberikan rehidrasi melalui IV line 750 mL dalam 1 jam pertama" },
        ],
        jawabanBenar: "c",
        pembahasan:
          "Pasien mengalami Diare Akut dengan Dehidrasi Ringan-Sedang (Dehidrasi Tak Berat) dengan BB 25 kg. Sesuai Rencana Terapi B WHO: Berikan oralit 75 mL/kgBB dalam 3 jam pertama = 75 x 25 kg = 1.875 mL larutan oralit dalam 3 jam pertama di sarana kesehatan.",
        referensi: "Buku Saku Pelayanan Kesehatan Anak di Rumah Sakit WHO / Kemenkes RI."
      },
    ],
  },
];

export function getPaketTryoutById(id: string): PaketTryOut | undefined {
  return PAKET_TRYOUT_LIST.find((p) => p.id === id);
}
