import type { PaketTryOut } from "../types";

export const PAKET_PREDIKSI_JITU_3: PaketTryOut = {
  id: "drill-pediatri-prediksi-jitu-3",
  slug: "drill-pediatri-prediksi-jitu-3",
  judul: "Try Out UKNPDPD Pediatri — Paket 3 (Prediksi Jitu 25 Soal)",
  deskripsi:
    "Gastrohepatologi, Nefrologi, Neurologi, Alergi & Imunologi, Infeksi Tropis, Gawat Darurat",
  durasiMenit: 25,
  passingGradePersen: 66,
  kategori: "uknpdpd",
  kategoriLabel: "Prediksi Jitu UKNPDPD",
  badge: "25 Soal / 25 Menit",
  daftarSoal: [
    {
      id: "pj3-soal-01",
      nomor: 1,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan usia 5 tahun dibawa ibunya ke dokter dengan keluhan diare sejak kemarin, frekuensi 7 kali dalam sehari. BAB cair, tanpa lendir dan darah, demam disangkal. Pemeriksaan fisik didapatkan keadaan umum baik, tanda-tanda vital dalam batas normal, mata cowong (-), mukosa mulut dan lidah basah, dan turgor kembali cepat.",
      pertanyaan: "Apa diagnosis yang tepat pada pasien?",
      opsi: [
        { id: "a", teks: "Diare akut tanpa dehidrasi" },
        { id: "b", teks: "Diare akut dehidrasi ringan-sedang" },
        { id: "c", teks: "Diare kronis dehidrasi ringan-sedang" },
        { id: "d", teks: "Diare akut dehidrasi berat" },
        { id: "e", teks: "Diare kronis dehidrasi berat" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Diare berlangsung kurang dari 14 hari sehingga termasuk diare akut. Mata tidak cowong, mukosa basah, turgor cepat, dan kondisi umum baik menunjukkan tidak ada tanda dehidrasi. Tata laksana utama adalah ORS sesuai kehilangan cairan, zinc pada anak sesuai usia, serta melanjutkan ASI dan makanan. Antibiotik tidak diperlukan pada diare cair akut tanpa indikasi khusus.",
      referensi: "WHO Diarrhoea/IMCI; Pedoman Tata Laksana Diare Kemenkes RI/IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Cairan & Rehidrasi Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj3-soal-02",
      nomor: 2,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan usia 2 tahun datang dibawa orang tuanya ke IGD dengan keluhan diare sejak 3 hari yang lalu. BAB cair lebih dari 10 kali dalam sehari, tidak disertai darah dan lendir. Anak juga dikeluhkan muntah tiap minum. Pada pemeriksaan fisik anak tampak lemah, Nadi 158 kali/menit, Suhu 36,5 °C, laju napas 28 kali/menit, ubun-ubun besar cekung, mata cowong, turgor kulit kembali sangat lambat.",
      pertanyaan: "Apa diagnosis yang tepat pada pasien?",
      opsi: [
        { id: "a", teks: "Diare akut tanpa dehidrasi" },
        { id: "b", teks: "Diare akut dehidrasi ringan-sedang" },
        { id: "c", teks: "Diare kronis dehidrasi ringan-sedang" },
        { id: "d", teks: "Diare akut dehidrasi berat" },
        { id: "e", teks: "Diare kronis dehidrasi berat" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Mata sangat cekung, ubun-ubun cekung, turgor sangat lambat (>2 detik), lemah/letargis, dan muntah setiap kali minum menunjukkan dehidrasi berat. Durasi diare 3 hari (<14 hari) mengategorikannya sebagai diare akut. Penanganan mengikuti Rencana Terapi C: resusitasi cairan intravena segera (Ringer Laktat atau NaCl 0,9%). Bila akses IV sulit, gunakan NGT dengan ORS sambil mempersiapkan rujukan.",
      referensi: "WHO IMCI Diarrhoea; Panduan Pelayanan Klinis Tata Laksana Diare IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Cairan & Rehidrasi Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj3-soal-03",
      nomor: 3,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak perempuan berusia 5 tahun dibawa ibunya ke puskesmas karena sudah 3 hari BAB cair dan kini malas minum. Dari pemeriksaan ditemukan mata cowong, cubitan kulit kembali sangat lambat dan anak tidak mau minum. BAK terakhir 5 jam yang lalu dan sedikit. Tekanan darah 90/50 mmHg, nadi 122 kali/menit, frekuensi napas 26 kali/menit, suhu 37,8°C. Dokter telah mencoba memasang IV line tapi gagal sehingga akan segera merujuk anak ke RS.",
      pertanyaan: "Manajemen apa yang harus dilakukan selama merujuk anak ke RS?",
      opsi: [
        { id: "a", teks: "Diberikan air putih peroral" },
        { id: "b", teks: "Diberikan air putih melalui NGT" },
        { id: "c", teks: "Diberikan oralit 10-20 cc/kgBB/jam per oral" },
        { id: "d", teks: "Diberikan oralit 20 cc/kgBB/jam melalui NGT" },
        { id: "e", teks: "Diberikan oralit 30 cc/kgBB/jam melalui NGT" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Anak mengalami dehidrasi berat dan akses IV gagal terpasang di faskes primer. Menurut panduan WHO IMCI dan Kemenkes (Rencana Terapi C bila IV gagal), bila fasilitas rujukan terdekat memerlukan waktu perjalanan dan ada tenaga yang terlatih memasang NGT, berikan larutan Oralit melalui pipa nasogastrik (NGT) dengan dosis 20 mL/kgBB/jam selama 6 jam (total 120 mL/kgBB). Evaluasi tanda dehidrasi setiap 1–2 jam selama transportasi rujukan.",
      referensi: "WHO Pocket Book of Hospital Care for Children; Kemenkes RI Tata Laksana Diare.",
      linkAlatTerkait: {
        label: "Kalkulator Cairan & Rehidrasi Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj3-soal-04",
      nomor: 4,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan umur 7 tahun dibawa ibunya ke puskesmas mengeluh BAB cair 5 kali dalam sehari, disertai lendir dan berbau, serta tampak berminyak, tidak disertai darah. Pada pemeriksaan tinja didapatkan protozoa berbentuk seperti buah pir.",
      pertanyaan: "Apa terapi yang diberikan pada kasus tersebut?",
      opsi: [
        { id: "a", teks: "Cotrimoksasole" },
        { id: "b", teks: "amoksisilin" },
        { id: "c", teks: "metronidazol" },
        { id: "d", teks: "sefiksim" },
        { id: "e", teks: "Cefadroxil" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Temuan protozoa berflagel berbentuk buah pir/layang-layang dengan dua inti mata burung hantu (owl-eyes) pada feses adalah trofozoit Giardia duodenalis (Giardia lamblia). Giardiasis menyebabkan malabsorpsi lemak (steatore/feses berminyak berbau busuk) dan flatulensi. Terapi lini pertama adalah Metronidazol 15–30 mg/kgBB/hari dibagi 3 dosis selama 5–7 hari (atau tinidazol/nitazoxanide).",
      referensi: "CDC Parasites — Giardiasis; Nelson Textbook of Pediatrics 22nd ed.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj3-soal-05",
      nomor: 5,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki usia 4 tahun datang dibawa ibunya ke puskesmas dengan keluhan diare sejak 2 hari yang lalu, BAB cair 4 kali sehari, didapatkan lendir dan sedikit darah. Pemeriksaan fisik didapatkan compos mentis, anak tampak lemas, turgor kulit kembali agak lambat, tidak ada tanda dehidrasi. Pemeriksaan feses didapatkan leukosit dan eritrosit meningkat.",
      pertanyaan: "Apa terapi yang tepat diberikan pada pasien?",
      opsi: [
        { id: "a", teks: "amoksisilin" },
        { id: "b", teks: "Kotrimoksasole" },
        { id: "c", teks: "Metronidazol" },
        { id: "d", teks: "Azitromisin" },
        { id: "e", teks: "Tetrasiklin" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Diare berdarah (disentri basiler) yang ditandai dengan eritrosit dan leukosit pada feses paling sering disebabkan oleh Shigella spp. Pilihan klasik pada pedoman dasar/soal UKMPPD adalah Kotrimoksazol (trimetoprim-sulfametoksazol). Meskipun pada praktik terkini WHO AWaRe merekomendasikan azitromisin atau sefalosporin generasi ke-3 karena resistensi, kunci soal standar UKMPPD/PPDS historis adalah Kotrimoksazol. Pemberian zinc dan rehidrasi tetap menjadi pilar terapi.",
      referensi: "WHO Guidelines for the Control of Shigellosis; Buku Saku Pelayanan Kesehatan Anak di RS (Kemenkes/WHO).",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj3-soal-06",
      nomor: 6,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi laki-laki usia 2 bulan dibawa ke dokter oleh ibunya dengan keluhan berak encer kekuningan disertai demam sejak 4 hari yang lalu. Frekuensi berak 3-4 kali/hari. Berak tidak disertai darah maupun lendir. Berak menyemprot disertai pantat merah dan bau asam. Bayi saat ini mendapat ASI eksklusif. Tidak terdapat riwayat pemberian susu formula. Pemeriksaan fisik nadi 140 kali/menit, frekuensi napas 30 kali/menit, suhu 38,3 °C, didapatkan perut kembung, bising usus meningkat, eritema perianal, tidak didapatkan tanda dehidrasi.",
      pertanyaan: "Apakah kemungkinan etiologi yang menyebabkan keluhan tersebut?",
      opsi: [
        { id: "a", teks: "Vibrio cholera" },
        { id: "b", teks: "Escherichia coli" },
        { id: "c", teks: "Rotavirus" },
        { id: "d", teks: "Intoleransi laktosa" },
        { id: "e", teks: "Alergi protein susu sapi" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Diare cair berbusa/menyemprot disertai demam dan eritema perianal pada bayi usia 2 bulan paling sering disebabkan oleh infeksi Rotavirus. Rotavirus merusak enterosit vili usus halus bagian apikal dan memproduksi enterotoksin NSP4, menyebabkan hilangnya enzim laktase brush-border sehingga timbul malabsorpsi laktosa sekunder transien yang menghasilkan feses asam (pantat merah) dan berbau asam.",
      referensi: "Nelson Textbook of Pediatrics; IDAI Pedoman Imunisasi Rotavirus.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj3-soal-07",
      nomor: 7,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak usia 9 bulan dibawa ke dokter dengan keluhan BAB terus menerus dengan konsistensi cair, berlendir, tidak berdarah, berbuih dan berbau asam. BAB keluar sebanyak 3-4 sendok dengan frekuensi 4 kali dalam satu hari ini. Pasien juga dikeluhkan perutnya kembung dan sering kentut. Riwayat anak minum susu formula sejak 5 hari ini, sebelumnya hanya minum ASI. Pemeriksaan fisik abdomen meteorismus, bising usus meningkat, eritem perianal, turgor kembali cepat.",
      pertanyaan: "Apakah kemungkinan penyebab kasus di atas?",
      opsi: [
        { id: "a", teks: "Intoleransi laktosa" },
        { id: "b", teks: "Alergi susu sapi" },
        { id: "c", teks: "Alergi makanan" },
        { id: "d", teks: "Gastroenteritis" },
        { id: "e", teks: "Peritonitis" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Gejala klinis khas: feses cair berbuih (foamy), berbau asam, perut kembung (meteorismus/flatus meningkat), dan eritema perianal akibat iritasi asam feses (pH < 5,5) yang muncul segera setelah peralihan ke susu formula standar sapi yang tinggi laktosa. Kondisi ini khas untuk intoleransi laktosa (defisiensi enzim laktase). Berbeda dengan alergi susu sapi yang dimediasi imunologis (sering ada darah samar, ruam eksem, muntah hebat, atau atopi keluarga).",
      referensi: "ESPGHAN Committee on Nutrition; Nelson Textbook of Pediatrics Ch. 343.",
      linkAlatTerkait: {
        label: "Kalkulator Nutrisi & Kalori Anak",
        href: "/preview/nutrisi",
      },
    },
    {
      id: "pj3-soal-08",
      nomor: 8,
      subdivisi: "alergi-imunologi",
      subdivisiLabel: "Alergi & Imunologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berumur 1 tahun bersama ibunya periksa ke dokter dengan keluhan rewel dan diare terus menerus sejak 1 minggu ini. Diare cair tanpa lendir darah. Riwayat ASI eksklusif 6 bulan, kemudian dilanjutkan MPASI. Anak konsumsi susu formula sejak 10 hari terakhir karena ASI sudah tidak keluar. Anak tampak rewel, tidak menunjukkan tanda dehidrasi, ketika dilakukan pemeriksaan fisik didapatkan lesi makulopapular kemerahan pada pipi, tangan, kaki dan juga sekitar anus.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "Mengganti susu formula dengan susu terhidrolisat sebagian" },
        { id: "b", teks: "Mengganti susu formula dengan susu terhidrolisat sempurna" },
        { id: "c", teks: "Mengganti susu formula dengan susu soya" },
        { id: "d", teks: "Mengganti susu formula dengan susu rendah laktosa" },
        { id: "e", teks: "Mengganti susu formula dengan susu bebas laktosa" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Kombinasi gejala gastrointestinal (diare kronik pasca sufor) dan manifestasi kutan alergi (ruam makulopapular/dermatitis atopi) pasca konsumsi susu formula sapi mengarah pada Alergi Susu Sapi (Cow's Milk Protein Allergy / CMPA). Tatalaksana lini pertama pada bayi/anak dengan dugaan CMPA gejala ringan-sedang adalah mengganti formula sapi standar dengan Formula Terhidrolisat Sempurna (Extensively Hydrolyzed Formula / eHF). Formula terhidrolisat parsial hanya untuk pencegahan, bukan terapi. Formula asam amino diindikasikan bila reaksi anafilaksis berat atau gagal dengan eHF.",
      referensi: "IDAI Rekomendasi Diagnosis dan Tata Laksana Alergi Susu Sapi 2014; ESPGHAN Guidelines 2023.",
      linkAlatTerkait: {
        label: "Kalkulator Nutrisi & Kalori Anak",
        href: "/preview/nutrisi",
      },
    },
    {
      id: "pj3-soal-09",
      nomor: 9,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki usia 5 tahun datang dibawa oleh orang tuanya ke IGD karena diare cair sejak 3 hari yang lalu. Diare cair tanpa darah maupun lendir. Selain diare, pasien juga dikeluhkan muntah namun jarang-jarang. Saat ini pasien tampak rewel dan gelisah. Mata cowong dan turgor kembali sangat lambat.",
      pertanyaan: "Berapakah kebutuhan cairan dan carian apa yang harus diberikan kepada pasien?",
      opsi: [
        { id: "a", teks: "Oralit 75 cc/kgBB dalam 3 jam" },
        { id: "b", teks: "Oralit 50-100 cc setiap kali BAB" },
        { id: "c", teks: "Kristaloid 30 cc/kgBB dalam 30 menit" },
        { id: "d", teks: "Kristaloid 20 cc/kgBB dalam 1 jam" },
        { id: "e", teks: "Kristaloid 120 cc/kgBB dalam 6 jam" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Tanda mata cowong dan turgor sangat lambat (>2 detik) menandakan Dehidrasi Berat. Pada anak usia >12 bulan, tata laksana Rencana C (Kemenkes/WHO) adalah pemberian cairan kristaloid isotonik (Ringer Laktat atau NaCl 0,9%) total 100 mL/kgBB, dibagi dalam 2 tahap:\n1) Tahap I: 30 mL/kgBB dalam 30 menit pertama.\n2) Tahap II: 70 mL/kgBB dalam 2,5 jam berikutnya.\nEvaluasi nadi dan perfusi dilakukan tiap 15–30 menit.",
      referensi: "Buku Bagan MTBS / Manajemen Terpadu Balita Sakit; Kemenkes Lintas Diare Anak.",
      linkAlatTerkait: {
        label: "Kalkulator Cairan & Rehidrasi Diare",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj3-soal-10",
      nomor: 10,
      subdivisi: "infeksi-tropis",
      subdivisiLabel: "Infeksi Tropis",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki usia 7 tahun dibawa ke IGD oleh orang tuanya karena diare sejak 3 hari yang lalu. Diare terus-menerus keluar dan warna diare seperti cucian beras. Sejak kemarin anak tampak mengantuk dan lemas. Pemeriksaan fisik didapatkan tekanan darah 120/80 mmHg, nadi 115 kali/menit, frekuensi napas 19 kali/menit dan suhu 38,8 °C, serta turgor kulit kembali sangat lambat.",
      pertanyaan: "Apakah tatalaksana definitif pada kasus di atas?",
      opsi: [
        { id: "a", teks: "metronidazol" },
        { id: "b", teks: "Cotrimoxazole" },
        { id: "c", teks: "kloramfenikol" },
        { id: "d", teks: "tetrasiklin" },
        { id: "e", teks: "azitromisin" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Diare masif cair menyerupai air cucian beras (rice water stool) dengan dehidrasi berat adalah tanda patognomonik Kolera (Vibrio cholerae). Selain resusitasi cairan segera, terapi antimikroba definitif lini pertama yang direkomendasikan WHO untuk kolera pada anak adalah Azitromisin dosis tunggal (20 mg/kgBB p.o., maks 1 g). Alternatif lain dapat berupa doksisiklin (pada usia tertentu) atau siprofloksasin.",
      referensi: "WHO Cholera Factsheet & Treatment Guidelines 2024; CDC Cholera Treatment.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj3-soal-11",
      nomor: 11,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak laki-laki usia 6 tahun dibawa ibunya ke RS karena sembelit sejak 6 bulan yang lalu. BAB jarang tiap 10 hari sekali. Tinjanya berbentuk pellet dan keras. Kadang-kadang disertai darah dalam tinjanya. Nafsu makan menurun dan badan terlihat kurus. Tampak anak selalu berusaha menahan BABnya. Anak tampak ketakutan bila mulai ingin BAB. Perut tampak membuncit dan teraba ada massa tinja yang keras pada perabaan abdomen. Pemeriksaan colok dubur anak merasa kesakitan dan rectum teraba dilatasi dengan banyaknya tinja yang keras.",
      pertanyaan: "Apakah diagnosis yang tepat pada kasus diatas?",
      opsi: [
        { id: "a", teks: "Fisura ani" },
        { id: "b", teks: "Ekoporesis" },
        { id: "c", teks: "Eneuresis" },
        { id: "d", teks: "Konstipasi" },
        { id: "e", teks: "Prolaps recti" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kriteria Roma IV untuk Konstipasi Fungsional terpenuhi: frekuensi defekasi < 2x/minggu, riwayat menahan tinja (withholding behavior), tinja keras/skibala, teraba massa feses di abdomen, serta ampula rekti melebar dan penuh feses saat colok dubur. Fisura ani merupakan komplikasi sekunder dari pasase skibala keras. Terapi mencakup disimpaksi feses (PEG/enema), laksatif rumatan, diet serat/cairan, dan toilet training.",
      referensi: "NASPGHAN / ESPGHAN Pediatric Functional Constipation Guidelines; Rome IV Pediatric Criteria.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Klinis Anak",
        href: "/preview/alur",
      },
    },
    {
      id: "pj3-soal-12",
      nomor: 12,
      subdivisi: "nefrologi",
      subdivisiLabel: "Nefrologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 6 tahun dibawa ke Puskesmas dengan keluhan bengkak di kelopak mata dan wajah sejak 1 minggu yang lalu. Pasien juga mengalami kencing berbuih dan keruh. Dari pemeriksaan didapatkan kesadaran compos mentis, tekanan darah 90/60 mmHg, nadi 100 kali/menit, laju nafas 20 kali/menit, suhu axilla 37 °C, Edema palpebra +/+. Pemeriksaan laboratorium didapatkan Hb 11 g/dL, leukosit 8000/µL, trombosit 160.000 /µL, albumin 1.5 g/dL, kolesterol total 240 g/dL, protein urin +3, eritrosit +1, leukosit +1, oval fat bodies (+).",
      pertanyaan: "Apa diagnosis kasus tersebut ?",
      opsi: [
        { id: "a", teks: "ISK Atas" },
        { id: "b", teks: "GNAPS" },
        { id: "c", teks: "Sindroma nerotik sekunder" },
        { id: "d", teks: "Sindrom nefritis akut" },
        { id: "e", teks: "Sindroma nefrotik" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Trias klasik Sindroma Nefrotik: 1) Proteinuria masif (urin dipstick +3 atau >40 mg/m²/jam), 2) Hipoalbuminemia berat (albumin 1,5 g/dL, ambang <2,5 g/dL), 3) Edema anasarka/palpebra, disertai hiperkolesterolemia (>200 mg/dL) dan lipiduria (oval fat bodies). Pada anak usia 1–10 tahun tanpa hipertensi bermakna atau hematuria gross, penyebab primer tersering (85%) adalah Minimal Change Disease (MCD).",
      referensi: "Konsensus Tata Laksana Sindrom Nefrotik Idiopatik pada Anak IDAI 2012; KDIGO 2021 Clinical Practice Guideline.",
      linkAlatTerkait: {
        label: "Kalkulator eGFR & Klirens Ginjal Anak",
        href: "/preview/egfr",
      },
    },
    {
      id: "pj3-soal-13",
      nomor: 13,
      subdivisi: "nefrologi",
      subdivisiLabel: "Nefrologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak berusia 5 tahun dibawa ke poliklinik karena urin berwarna kemerahan sejak 3 hari yang lalu, disertai lemas, tidak nafsu makan, nyeri kepala, wajah sembab. Sebelumnya menderita infeksi tenggorokan tapi sudah sembuh. Pemeriksaan fisik didapatkan tekanan darah 140/80 mmHg, nadi 80 kali/menit, laju napas 22 kali/menit, suhu 36,6 °C. Edema preorbital. Pemeriksaan laboratorium didapatkan Hb 9 g/dL, dari hasil urinalisis didapatkan eritrosit +3, protein +1.",
      pertanyaan: "Apa diagnosis kasus tersebut ?",
      opsi: [
        { id: "a", teks: "Pielonefritis akut" },
        { id: "b", teks: "ISK" },
        { id: "c", teks: "Sindroma nefrotik" },
        { id: "d", teks: "Batu saluran kemih" },
        { id: "e", teks: "Glomerulonefritis akut" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Trias Sindroma Nefritik Akut (paling sering Glomerulonefritis Akut Pasca Streptokokus / GNAPS): hematuria makroskopik (urin kemerahan/coca-cola), hipertensi (140/80 mmHg pada anak 5 tahun), dan edema periorbital/oliguria dengan riwayat infeksi saluran napas atas (faringitis Streptococcus beta hemolyticus grup A) 1–2 minggu sebelumnya. Urinalisis menunjukkan hematuria nyata (+3) dengan proteinuria ringan-sedang (+1).",
      referensi: "Konsensus Glomerulonefritis Akut Pasca Streptokokus IDAI; Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Persentil Tekanan Darah Anak",
        href: "/preview/tekanan-darah",
      },
    },
    {
      id: "pj3-soal-14",
      nomor: 14,
      subdivisi: "nefrologi",
      subdivisiLabel: "Nefrologi",
      tingkatSKDI: "3A",
      vignette:
        "Anak laki-laki usia 7 tahun datang dengan keluhan bengkak pada kedua mata sejak 1 minggu ini. Pasien juga dikeluhkan kencing berwarna merah dan sedikit. Pemeriksaan fisik tekanan darah 130/80 mmHg, nadi 90 kali/menit, laju napas 30 kali/menit, suhu 36.60C, didapatkan edema palpebra. Pemeriksaan urinalisis didapatkan darah (+), protein (+), epitel crescent di glomerulus.",
      pertanyaan: "Apakah diagnosis pasien tersebut?",
      opsi: [
        { id: "a", teks: "GNAPS" },
        { id: "b", teks: "IgA nephropathy" },
        { id: "c", teks: "Rapidly Progressive glomerulonefritis" },
        { id: "d", teks: "Focal Segmental glomerulonefritis" },
        { id: "e", teks: "Membrano Proliferative glomerulonefritis" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Temuan histopatologis berupa formasi seluler bulan sabit (crescent) pada >50% glomerulus merupakan ciri khas Crescentic Glomerulonephritis yang secara klinis bermanifestasi sebagai Rapidly Progressive Glomerulonephritis (RPGN). RPGN ditandai dengan penurunan fungsi ginjal secara cepat (dalam hitungan hari hingga minggu) disertai sindrom nefritik akut dan memerlukan imunosupresi agresif untuk mencegah gagal ginjal stadium akhir.",
      referensi: "KDIGO Clinical Practice Guideline for Glomerular Diseases; Heptinstall's Pathology of the Kidney.",
      linkAlatTerkait: {
        label: "Kalkulator eGFR & Klirens Ginjal Anak",
        href: "/preview/egfr",
      },
    },
    {
      id: "pj3-soal-15",
      nomor: 15,
      subdivisi: "gawat-darurat",
      subdivisiLabel: "Gawat Darurat",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak laki-laki usia 10 tahun datang ke IGD dibawa orang tua nya dengan keluhan penurunan kesadaran disertai nyeri kepala hebat, gelisah, mual dan muntah sejak 2 jam sebelum masuk rumah sakit. Sebelumnya pasien sempat kejang 1 kali selama kurang lebih 3 menit. Riwayat demam disertai banyaknya luka koreng yang muncul pada tubuh pasien. Pemeriksaan fisik didapatkan kesadaran sopor, GCS 8, tekanan darah 190/120 mmHg, nadi 118 kali/menit, laju napas 26 kali/menit, suhu 37,3°C, didapatkan edema pretibial minimal. Pada pemeriksaan urin dipstick didapatkan BJ 1.035, eritrosit +4, protein +1.",
      pertanyaan: "Apakah diagnosis kasus di atas?",
      opsi: [
        { id: "a", teks: "Meningitis" },
        { id: "b", teks: "Ensefalitis" },
        { id: "c", teks: "Abses otak" },
        { id: "d", teks: "Hipertensi Ensefalopati" },
        { id: "e", teks: "Kejang Demam" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Krisis hipertensi emergensi pada anak (TD 190/120 mmHg) disertai kerusakan organ target neurologis akut (nyeri kepala hebat, penurunan kesadaran, muntah proyektil, kejang) menegakkan diagnosis Ensefalopati Hipertensif (sering berkaitan dengan Posterior Reversible Encephalopathy Syndrome / PRES). Riwayat pioderma/koreng (impetigo) dan hematuria mengindikasikan GNAPS sebagai etiologi dasar retensi natrium dan air yang memicu hipertensi berat.",
      referensi: "AAP Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children; Pediatric Critical Care Medicine.",
      linkAlatTerkait: {
        label: "Persentil Tekanan Darah Anak",
        href: "/preview/tekanan-darah",
      },
    },
    {
      id: "pj3-soal-16",
      nomor: 16,
      subdivisi: "nefrologi",
      subdivisiLabel: "Nefrologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan usia 8 tahun datang dengan keluhan nyeri perut sejak 1 hari yang lalu, sering mengompol dan nyeri saat kencing. Riwayat demam sejak 3 hari ini. Pemeriksaan fisik didapatkan tekanan darah 110/80 mmHg, nadi 82 kali/menit, frekuensi napas 28 kali/menit, suhu 37,9 °C. Pemeriksaan fisik didapatkan nyeri tekan pada suprapubis, ballotement ginjal (-). Hasil urinalisis didapatkan protein (+), leukosit 10-15/lbp, eritrosit 3-5/lbp, nitrit (+).",
      pertanyaan: "Apakah terapi yang tepat?",
      opsi: [
        { id: "a", teks: "Rawat jalan, kotrimoksazole oral 2 x 480 mg" },
        { id: "b", teks: "Rawat inap, cefotaxim intravena 2 x 500 mg" },
        { id: "c", teks: "Rawat jalan, prednison oral 60 mg/hari" },
        { id: "d", teks: "Rawat jalan, cefixime oral 100 mg/hari" },
        { id: "e", teks: "Rawat inap, cefixime oral 100 mg/hari" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Keluhan disuria, polakisuria/urgensi, nyeri suprapubik, leukosituria dan uji nitrit positif tanpa nyeri ketok CVA/ballotement ginjal sesuai dengan Infeksi Saluran Kemih (ISK) Bawah / Sistitis Akut. Karena hemodinamik stabil dan anak dapat minum oral, tatalaksana cukup rawat jalan dengan antibiotik oral seperti Kotrimoksazol (TMP-SMX) atau sefalosporin oral generasi 2/3 selama 5–7 hari.",
      referensi: "Konsensus Infeksi Saluran Kemih pada Anak IDAI; AAP Clinical Practice Guideline on UTI.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj3-soal-17",
      nomor: 17,
      subdivisi: "nefrologi",
      subdivisiLabel: "Nefrologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak usia 10 tahun datang dengan keluhan BAK berwarna kemerahan sejak 3 hari yg lalu. Riwayat nyeri tenggorokan 2 minggu yang lalu, kemudian sembuh sendiri. Pada pemeriksaan fisik didapatkan tekanan darah 140/90 mmHg, nadi 88 kali/menit, laju napas 26 kali/menit, suhu 36,7 °C, edema minimal pretibial. Pada pemeriksaan urin dipstick didapatkan BJ 1.035, eritrosit +3, protein +2.",
      pertanyaan: "Apakah etiologi kasus di atas?",
      opsi: [
        { id: "a", teks: "Retensi Na akibat GFR menurun" },
        { id: "b", teks: "Hipoalbuminemia akibat proteinuria masif" },
        { id: "c", teks: "Ekspansi cairan ekstravaskuler akibat proteinuria masif" },
        { id: "d", teks: "Deposit kompleks antigen-antibodi" },
        { id: "e", teks: "Tekanan onkotik menurun karena proteinuria" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Glomerulonefritis Akut Pasca Streptokokus (GNAPS) merupakan penyakit imunologis tipe III (immune-complex mediated). Antigen streptokokus nefritogenik (seperti SpeB dan NAPIr) berikatan dengan antibodi pejamu membentuk kompleks imun yang beredar lalu terdeposit di membran basalis glomerulus (subepitelial humps), memicu aktivasi komplemen kaskade alternatif, inflamasi glomerulus, hematuria, dan penurunan laju filtrasi glomerulus.",
      referensi: "Robbins & Cotran Pathologic Basis of Disease 10th ed.; Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj3-soal-18",
      nomor: 18,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan 10 tahun datang diantar oleh ibunya ke puskesmas dengan keluhan anak tampak kuning sejak 2 hari yang lalu. Kencing berwarna seperti air teh. Selain itu anak juga tampak lemas, mual muntah, dan nyeri perut. Teman satu kelasnya juga mengalami hal yang sama. Dari pemeriksaan fisik didapatkan Nadi 110 kali/menit, frekuensi napas 24 kali/menit, Suhu 37,5°C, sklera ikterik +/+, dan nyeri tekan hipokondrium kanan.",
      pertanyaan: "Apakah hasil pemeriksaan laboratorium yang dapat ditemukan pada pasien ini ?",
      opsi: [
        { id: "a", teks: "HBsAg (+)" },
        { id: "b", teks: "HBeAg (+)" },
        { id: "c", teks: "IgM-anti HAV (+)" },
        { id: "d", teks: "HBV antigen (+)" },
        { id: "e", teks: "Anti-HBc (+)" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Gejala ikterus akut, urin pekat seperti teh, nyeri perut kanan atas, demam subfebris, dan klaster kasus di sekolah (penularan fekal-oral) adalah gambaran klasik Hepatitis A Akut. Pemeriksaan serologis baku emas untuk mendeteksi infeksi akut Hepatitis A adalah ditemukannya antibodi IgM anti-HAV yang mulai terdeteksi sejak awal timbulnya gejala dan bertahan selama 3–6 bulan.",
      referensi: "WHO Hepatitis A Factsheet; Konsensus Nasional Penatalaksanaan Hepatitis Virus pada Anak IDAI.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj3-soal-19",
      nomor: 19,
      subdivisi: "gastrohepatologi",
      subdivisiLabel: "Gastrohepatologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak perempuan 4 tahun dibawa ibunya ke dokter dengan keluhan nyeri perut sejak 3 hari yang lalu. Keluhan disertai lemas mual dan muntah. Pasien juga dikeluhkan demam sejak 4 hari yang lalu. Pemeriksaan fisik didapatkan Nadi 78 kali/menit, laju napas 24 kali/menit, Suhu 38 °C, didapatkan sklera ikterik dan nyeri tekan pada regio hipokondrium kanan. Hasil laboratorium didapatkan Anti HAV (+), HBsAg (-), anti HBs (+), anti HBc (-).",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "Hepatitis A dan Hepatitis B" },
        { id: "b", teks: "Hepatitis A" },
        { id: "c", teks: "Hepatitis B" },
        { id: "d", teks: "Hepatitis A dan carrier Hepatitis B" },
        { id: "e", teks: "Hepatitis A dan pernah vaksin Hepatitis B" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Interpretasi serologi hepatitis:\n• Anti-HAV (+): menunjukkan infeksi virus hepatitis A.\n• HBsAg (-): tidak ada infeksi aktif hepatitis B saat ini.\n• Anti-HBs (+) bersama Anti-HBc (-): menandakan imunitas yang didapat dari vaksinasi Hepatitis B (bukan dari infeksi alami; infeksi alami akan membuat Anti-HBc juga positif).\nKesimpulan diagnosis yang paling tepat adalah Hepatitis A dan pernah vaksin Hepatitis B.",
      referensi: "CDC Interpretation of Hepatitis B Serologic Test Results; Pedoman Imunisasi IDAI.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj3-soal-20",
      nomor: 20,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 4 tahun dengan berat badan 10 kg di bawa ibunya ke IGD karena kejang seluruh tubuh saat di rumah. Kejang berlangsung sekitar 3 menit kemudian berhenti sendiri. Riwayat demam sejak 2 hari ini disertai batuk pilek. Di rumah, ibu pasien telah memberikan diazepam per rektal 1 kali dan sesampai di IGD pasien mengalami kejang kembali.",
      pertanyaan: "Apakah tatalaksana selanjutnya?",
      opsi: [
        { id: "a", teks: "Diazepam rektal" },
        { id: "b", teks: "Diazepam 0,2 mg/kg iv" },
        { id: "c", teks: "Fenobarbital 20 mg/kg iv" },
        { id: "d", teks: "Fenitoin 20 mg/kg iv" },
        { id: "e", teks: "Midazolam 0,2 mg/kg iv" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Berdasarkan algoritme penanganan kejang demam IDAI:\n• Bila anak kejang di rumah dan sudah diberi diazepam rektal 1 kali oleh orang tua, bila kejang masih berlanjut atau berulang saat tiba di fasilitas kesehatan dan akses IV belum terpasang, diazepam rektal kedua (5 mg untuk BB < 12 kg, 10 mg untuk BB ≥ 12 kg) dapat diberikan dengan jarak minimal 5 menit dari dosis pertama (maksimal 2 kali pemberian rektal). Jika akses IV sudah ada, diazepam 0,2–0,5 mg/kg IV perlahan merupakan pilihan.",
      referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI 2016; Rekomendasi Penanganan Status Epileptikus Anak IDAI.",
      linkAlatTerkait: {
        label: "Mode Darurat & Resusitasi Pediatri",
        href: "/preview/darurat",
      },
    },
    {
      id: "pj3-soal-21",
      nomor: 21,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak laki-laki, berusia 7 tahun, dibawa orang tuanya ke IGD RS karena tiba-tiba tidak bisa berjalan sejak 3 hari yang lalu. Dari anamnesis diketahui 1 minggu yang lalu pasien demam, disertai batuk, mual, muntah, dan sakit kepala. Riwayat trauma (-). Setelah tidak demam lagi, pasien tidak bisa berjalan. Pada pemeriksaan neurologis didapatkan kekuatan kaki kanan 5 dan kaki kiri 3. Sensibilitas kedua tungkai normal. Reflex fisiologis kaki kanan normal dan kaki kiri menurun.",
      pertanyaan: "Apakah diagnosis yang tepat?",
      opsi: [
        { id: "a", teks: "Polimiositis" },
        { id: "b", teks: "Poliomielitis" },
        { id: "c", teks: "Sindrom Guillain Barre" },
        { id: "d", teks: "Mielitis transversa" },
        { id: "e", teks: "Miastenia gravis" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Poliomielitis anterior akuta ditandai dengan paresis flaksid akut (Acute Flaccid Paralysis / AFP) yang asimetris (kaki kiri 3 vs kanan 5), penurunan refleks tendon pada ekstremitas yang terkena, sensibilitas intak (karena kerusakan murni di kornu anterior medula spinalis), dan diawali demam/gejala prodromal gastrointestinal-respiratorik. Sindrom Guillain-Barré biasanya menghasilkan kelemahan asenden yang simetris dengan hipoestesia tipe stocking-glove.",
      referensi: "WHO Polio Eradication Guidance; Nelson Textbook of Pediatrics Ch. 277.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Klinis Anak",
        href: "/preview/alur",
      },
    },
    {
      id: "pj3-soal-22",
      nomor: 22,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang anak berusia 2 tahun, datang diantar ibunya ke IGD dengan keluhan kejang 2 jam yang lalu. Kejang pada kedua tangan, kaki kaku dan kelonjotan. Kejang berlangsung selama kurang dari 5 menit dan terjadi 1 kali dalam sehari. Setelah kejang anak menangis. Sejak 2 hari yang lalu anak demam tinggi dan batuk pilek. Pasien belum pernah kejang sebelumnya. Pemeriksaan fisik tanda vital didapatkan nadi 112 kali/menit, laju napas 30 kali/menit, Suhu 39 °C, pemeriksaan neurologi tidak didapatkan kelainan.",
      pertanyaan: "Apakah diagnosis paling tepat?",
      opsi: [
        { id: "a", teks: "Ensefalitis" },
        { id: "b", teks: "Meningitis" },
        { id: "c", teks: "Epilepsi" },
        { id: "d", teks: "Kejang Demam Sederhana" },
        { id: "e", teks: "Kejang Demam Kompleks" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kriteria Kejang Demam Sederhana (Simple Febrile Seizure):\n1) Usia anak antara 6 bulan – 5 tahun (di sini usia 2 tahun).\n2) Kejang bertipe umum/generalisata (kedua tangan dan kaki kaku kelonjotan/tonik klonik).\n3) Durasi singkat < 15 menit (di sini < 5 menit).\n4) Frekuensi 1 kali dalam kurun waktu 24 jam.\n5) Tidak ada kelainan neurologis pascakejang (anak sadar dan menangis).\n6) Demam disebabkan oleh infeksi ekstrakranial (ISPA/batuk pilek).",
      referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI 2016; AAP Febrile Seizures Guidelines.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Klinis Anak",
        href: "/preview/alur",
      },
    },
    {
      id: "pj3-soal-23",
      nomor: 23,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak perempuan berusia 3 tahun dibawa ibunya ke UGD RS karena keluhan penurunan kesadaran sejak 1 hari ini. Riwayat demam sejak 1 minggu terakhir. Pada pemeriksaan tanda vital dijumpai kesadaran letargi, denyut nadi 130 kali/menit, frekuensi napas 30 kali/menit, suhu 38 °C, BB 15kg, TB 100cm, kaku kuduk (+). Pemeriksaan fisik lainnya dalam batas normal.",
      pertanyaan: "Apa pemeriksaan penunjang tepat untuk memegakkan diagnosis?",
      opsi: [
        { id: "a", teks: "Pemeriksaan darah dan urin rutin" },
        { id: "b", teks: "Pemeriksaan foto rontgen" },
        { id: "c", teks: "Pemeriksaan kadar elektrolit dan analisis gas darah" },
        { id: "d", teks: "Pemeriksaan lumbal pungsi" },
        { id: "e", teks: "Pemeriksaan CT scan kepala" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kombinasi demam, penurunan kesadaran (letargi), dan tanda rangsang meningeal positif (kaku kuduk +) sangat mencurigai infeksi sistem saraf pusat (Meningitis). Baku emas untuk menegakkan diagnosis meningitis dan mengidentifikasi agen penyebabnya (bakterial vs viral vs tuberkulosis) adalah analisis cairan serebrospinal (LCS) melalui Pungsi Lumbal (Lumbar Puncture), selama tidak ditemukan kontraindikasi peningkatan tekanan intrakranial fokal.",
      referensi: "Konsensus Infeksi Susunan Saraf Pusat pada Anak IDAI; Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Kalkulator GCS & Koma Pediatri",
        href: "/preview/gcs",
      },
    },
    {
      id: "pj3-soal-24",
      nomor: 24,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak berusia 7 tahun datang ke IGD dibawa oleh ibunya karena mengalami penurunan kesadaran sejak 1 hari ini. Sebelumnya pasien mengalami demam sejak 5 hari. Hasil pemeriksaan fisik didapatkan kesadaran somnolen, tekanan darah 90/60, nadi 110 kali/menit, laju napas 24 kali/menit, Suhu 39 °C, kaku kuduk (+). Dari pemeriksaan lumbal pungsi didapatkan neutrofil 80%, glukosa menurun, protein meningkat.",
      pertanyaan: "Apakah diagnosis pasien ini?",
      opsi: [
        { id: "a", teks: "Meningitis TB" },
        { id: "b", teks: "Meningitis bacterial" },
        { id: "c", teks: "Meningitis viral" },
        { id: "d", teks: "Perdarahan intrakranial" },
        { id: "e", teks: "Tumor serebri" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Karakteristik cairan serebrospinal (LCS) pada Meningitis Bakterial Akut (Purulenta):\n• Pleositosis dominan polimorfonuklear (neutrofil > 80%)\n• Glukosa LCS menurun tajam (< 40 mg/dL atau rasio LCS/serum < 0,4) karena dikonsumsi oleh bakteri dan leukosit\n• Kadar protein meningkat signifikan (> 100 mg/dL) akibat kerusakan sawar darah-otak.\n(Bandingkan dengan meningitis viral: limfosit dominan, glukosa normal; meningitis TB: limfosit dominan, glukosa sangat rendah, protein sangat tinggi).",
      referensi: "Pedoman Diagnosis dan Terapi Neurologi Anak IDAI; Infectious Diseases Society of America (IDSA).",
      linkAlatTerkait: {
        label: "Kalkulator GCS & Koma Pediatri",
        href: "/preview/gcs",
      },
    },
    {
      id: "pj3-soal-25",
      nomor: 25,
      subdivisi: "neurologi",
      subdivisiLabel: "Neurologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan usia 2 tahun mengalami kejang seluruh tubuh. Kejang diawali dengan demam. Keluhan ini sudah dialami pasien 4 kali dalam setahun. Di rumah sempat kejang kurang lebih 20 menit lalu dibawa ke IGD RS dan kejang sempat berhenti, sesampai di RS pasien kembali kejang dan perawat memberikan diazepam per rektal kemudian kejang berhenti. Saat dilakukan pemeriksaan fisik didapatkan BB 12 kg, tekanan darah 110/70 mmHg, nadi 128 kali/menit, frekuensi napas 20 kali/menit, suhu 38,9⁰C.",
      pertanyaan: "Apakah terapi profilaksis rumatan yang bisa diberikan kepada pasien?",
      opsi: [
        { id: "a", teks: "Diazepam oral 0,3 mg/kgBB/kali 3 kali sehari dalam 48 jam pertama demam" },
        { id: "b", teks: "Diazepam oral 0,3 mg/kgBB/kali 3 kali sehari dalam 24 jam pertama demam" },
        { id: "c", teks: "Diazepam rektal 5 mg suppositoria tiap kejang" },
        { id: "d", teks: "Diazepam rektal 5 mg suppositoria 3 kali sehari dalam 24 jam pertama" },
        { id: "e", teks: "Asam valproat 15-40 mg/kgBB/hari dibagi 2 dosis dalam 1 tahun" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Pasien memenuhi kriteria Kejang Demam Kompleks dengan indikasi profilaksis rumatan/kontinu: kejang lama (>15 menit, di sini 20 menit), berulang dalam satu episode demam, dan frekuensi sering (≥4 kali/tahun). Menurut rekomendasi IDAI, obat profilaksis kontinu pilihan utama adalah Asam Valproat 15–40 mg/kgBB/hari dibagi 2–3 dosis (atau fenobarbital 3–5 mg/kgBB/hari) yang diberikan secara kontinu selama 1 tahun bebas kejang, kemudian dihentikan bertahap (tapering off).",
      referensi: "Konsensus Penatalaksanaan Kejang Demam IDAI 2016; Pediatric Clinics of North America.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
  ],
};
