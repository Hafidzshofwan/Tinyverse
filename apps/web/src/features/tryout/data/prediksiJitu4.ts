import type { PaketTryOut } from "../types";

export const PAKET_PREDIKSI_JITU_4: PaketTryOut = {
  id: "drill-pediatri-prediksi-jitu-4",
  slug: "drill-pediatri-prediksi-jitu-4",
  judul: "Try Out UKNPDPD Pediatri — Paket 4 (Prediksi Jitu 25 Soal)",
  deskripsi:
    "Hematologi, Endokrinologi, Imunisasi Anak, dan Penyakit Infeksi Imunologis",
  durasiMenit: 25,
  passingGradePersen: 66,
  kategori: "uknpdpd",
  kategoriLabel: "Prediksi Jitu UKNPDPD",
  badge: "25 Soal / 25 Menit",
  daftarSoal: [
    {
      id: "pj4-soal-01",
      nomor: 1,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak laki-laki usia 12 tahun datang dibawa ibunya dengan keluhan lemas dan lesu. Pasien juga sering merasa demam yang naik turun sejak 1 minggu ini. Pada pemeriksaan fisik ditemukan konjungtiva anemis, tidak ada organomegali. Pada pemeriksaan laboratorium didapatkan Hb 7 g/dL, MCV 95 fl, MCH 36 pg, MCHC 40 g/dL, leukosit 2500/mm³, trombosit 78.000/mm³.",
      pertanyaan: "Apakah kemungkinan diagnosis pasien ini?",
      opsi: [
        { id: "a", teks: "Anemia makrositik" },
        { id: "b", teks: "Anemia megaloblastik" },
        { id: "c", teks: "Anemia defisiensi besi" },
        { id: "d", teks: "Anemia penyakit kronik" },
        { id: "e", teks: "Anemia aplastik" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Temuan utama adalah pansitopenia: penurunan ketiga lini sel darah (anemia Hb 7 g/dL, leukopenia 2.500/mm³, dan trombositopenia 78.000/mm³) dengan indeks eritrosit normositik normokromik (MCV 95 fL masih dalam rentang normositik anak) dan tanpa disertai organomegali (hepatosplenomegali negatif, limfadenopati negatif). Pola klinis dan laboratoris ini khas untuk kegagalan sumsum tulang (Anemia Aplastik). Baku emas diagnostik adalah biopsi/aspirasi sumsum tulang yang menunjukkan hiposelularitas berat digantikan jaringan lemak.",
      referensi: "Nelson Textbook of Pediatrics 22nd ed.; American Society of Hematology (ASH).",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-02",
      nomor: 2,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3B",
      vignette:
        "Anak perempuan usia 8 tahun dibawa ke Poliklinik RS dengan keluhan tampak pucat sejak 1 minggu yang lalu. Tidak ada keluhan demam atau keluhan lainnya. Dari hasil pemeriksaan fisik didapatkan konjungtiva anemis, hepatosplenomegali (-). Hasil laboratorium didapatkan Hb 6 g/dL, MCV 98, MCH 30, MCHC 35, leukosit 1.100/µL, trombosit 30.000/µL. Pasien dua minggu yang lalu mengalami diare dan minum kotrimoksazol.",
      pertanyaan: "Apakah gold standar terapi untuk pasien?",
      opsi: [
        { id: "a", teks: "Transfusi PRC" },
        { id: "b", teks: "Injeksi steroid" },
        { id: "c", teks: "Antibiotik" },
        { id: "d", teks: "Transplantasi Sumsum tulang" },
        { id: "e", teks: "Suplementasi As. Folat, Vit B12, dan Fe" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Pansitopenia berat (Hb 6 g/dL, leukopenia 1.100/µL, trombositopenia 30.000/µL) tanpa hepatosplenomegali pasca konsumsi kotrimoksazol (sulfonamid berpotensi memicu supresi sumsum tulang idiosinkratik) mengarah pada Anemia Aplastik Berat (Severe Aplastic Anemia / SAA). Terapi kuratif definitif baku emas (gold standard) untuk anak dengan SAA adalah Transplantasi Sumsum Tulang / Transplantasi Sel Punca Hematopoietik (Hematopoietic Stem Cell Transplantation / HSCT) dari saudara kandung berdonor identik HLA.",
      referensi: "British Society for Haematology Guidelines; Nelson Textbook of Pediatrics Ch. 488.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-03",
      nomor: 3,
      subdivisi: "neonatologi",
      subdivisiLabel: "Neonatologi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi baru lahir 5 jam yang lalu dirujuk oleh bidan ke RS karena tampak pucat dan ikterik. Riwayat persalinan normal pervaginam, usia kehamilan cukup bulan, BBL 2.800 gram, AS 8-9. Pemeriksaan tanda vital dalam batas normal, didapatkan anemis dan ikterus kramer IV. Pemeriksaan laboratorium darah lengkap didapatkan Hb 8,7 g/dL, Ht 28%, Eritrosit 2.400.000/µL, Leukosit 9.200/µL, Trombosit 160.000/µL. Ibu pasien memiliki golongan darah A rhesus positif dan bayi B rhesus negatif.",
      pertanyaan: "Apakah diagnosis pasien ini?",
      opsi: [
        { id: "a", teks: "Anemia" },
        { id: "b", teks: "asfiksia neonatorum" },
        { id: "c", teks: "Sepsis neonatorum" },
        { id: "d", teks: "Inkompatibilitas Rhesus" },
        { id: "e", teks: "Inkompatibilitas ABO" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Timbulnya ikterus patologis dini (< 24 jam pertama kehidupan, di sini usia 5 jam) disertai anemia hemolitik (Hb 8,7 g/dL) pada bayi baru lahir dengan ibu bergolongan darah A (memiliki antibodi anti-B alami dalam serum) dan bayi bergolongan darah B merupakan gambaran klasik Inkompatibilitas ABO. Isoimunisasi ABO dapat terjadi pada kehamilan pertama karena antibodi anti-A dan anti-B sudah terbentuk sebelumnya di tubuh ibu.",
      referensi: "AAP Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation; IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Bilirubin & Fototerapi Neonatus",
        href: "/preview/bilirubin",
      },
    },
    {
      id: "pj4-soal-04",
      nomor: 4,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3B",
      vignette:
        "Anak perempuan 6 tahun, dibawa berobat ke Poli Anak dengan keluhan pucat sejak 5 bulan yang lalu. Keluhan disertai pusing dan lemah. Terkadang tampak mata dan tubuh menguning yang hilang timbul. Pada pemeriksaan fisik didapatkan tanda vital normal, konjungtiva pucat dan sklera ikterik. Hepar teraba 2 cm di bawah arcus costa, sedangkan lien teraba pada Schüffner 3. Pada pemeriksaan laboratorium diperoleh Hb 8,9 g/dL, MCV 88 fL, MCH 29 pg, kemudian dilakukan tes untuk mengambil darah pasien dan diteteskan oleh suatu reagen dengan hasil darah menggumpal pada suhu >37 °C.",
      pertanyaan: "Tatalaksana yang tepat pada pasien ini?",
      opsi: [
        { id: "a", teks: "Transfusi PRC" },
        { id: "b", teks: "Pemberian preparat besi" },
        { id: "c", teks: "Pemberian kortikosteroid" },
        { id: "d", teks: "Splenektomi" },
        { id: "e", teks: "Memberi suasana hangatpada pasien" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Anemia normositik normokromik (MCV 88 fL), ikterus hemolitik fluktuatif, splenomegali (Schüffner 3), dan direct antiglobulin test (Coombs test) positif / aglutinasi pada suhu tubuh (>37°C) mengonfirmasi Anemia Hemolitik Autoimun Tipe Hangat (Warm Autoimmune Hemolytic Anemia / Warm AIHA). Terapi lini pertama untuk warm AIHA pada anak adalah Kortikosteroid sistemik (Prednison 2 mg/kgBB/hari atau metilprednisolon IV) untuk menekan produksi autoantibodi IgG dan klirens eritrosit oleh makrofag limpa.",
      referensi: "The First International Consensus on the Diagnosis and Treatment of Autoimmune Hemolytic Anemia in Children; Blood 2020.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj4-soal-05",
      nomor: 5,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan umur 2 tahun diantar ibunya ke Puskesmas dengan keluhan pucat sejak 1,5 bulan. Selain itu anak juga dikeluhkan sering lemas dan lelah terutama setelah aktivitas. Riwayat anak sulit makan dan tidak suka minum susu. Pada pemeriksaan fisik didapatkan konjungtiva pucat, atrofi papil lidah dan keilitis angularis. Hasil laboratorium darah lengkap didapatkan Hb 7,8 g/dL, Leukosit 7.000/µL, Trombosit 350.000/µL, MCV 70%, MCH 18% dan MCHC 26%.",
      pertanyaan: "Apakah tatalaksana yang tepat?",
      opsi: [
        { id: "a", teks: "Tambahkan susu formula atau MPASI yang difortifikasi dengan Fe" },
        { id: "b", teks: "Ferrous sulfat + vitamin C selama minimal 1 bulan" },
        { id: "c", teks: "Rujuk ke RS" },
        { id: "d", teks: "Transfusi PRC 10 ml/kgBB" },
        { id: "e", teks: "Ferrous sulfat + vitamin C sampai 2 bulan setelah Hb normal" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Anemia mikrositik hipokromik (MCV 70 fL, MCH 18 pg) disertai tanda klinis defisiensi besi (atrofi papil lidah, keilitis angularis, riwayat asupan buruk) mengarahkan pada Anemia Defisiensi Besi (ADB). Terapi medikamentosa adalah pemberian preparat besi oral (Ferrous sulfat / besi elemental 3–6 mg/kgBB/hari) bersama vitamin C untuk meningkatkan absorpsi. Lama terapi diteruskan hingga 2–3 bulan setelah kadar Hb normal guna mengisi kembali cadangan besi tubuh (depot feritin).",
      referensi: "Rekomendasi Diagnosis dan Pencegahan Anemia Defisiensi Besi IDAI 2011; WHO Guidelines on Iron Supplementation.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj4-soal-06",
      nomor: 6,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3A",
      vignette:
        "Seorang anak laki-laki usia 4 tahun didiagnosis mengalami Epilepsi oleh dokter sejak 6 bulan yang lalu. Anak rutin konsumsi obat anti kejang sebagai bentuk pengobatan epilepsi selama 6 bulan ini. Namun beberapa minggu terakhir mulai muncul keluhan lemas dan sering pucat.",
      pertanyaan: "Apakah kelainan morfologi darah tepi yang didapatkan pada pasien ini?",
      opsi: [
        { id: "a", teks: "Gambaran makrositik normokromik" },
        { id: "b", teks: "Gambaran normositik normokromik" },
        { id: "c", teks: "Gambaran normositik hipokromik" },
        { id: "d", teks: "Gambaran terdapat ring sideroblastic" },
        { id: "e", teks: "Gambaran mikrositik hypokromik" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Beberapa Obat Anti-Epilepsi (OAE), terutama fenitoin, fenobarbital, dan karbamazepin, mengganggu absorpsi dan metabolisme asam folat di usus halus serta meningkatkan katabolismenya di hepar. Defisiensi asam folat akibat OAE jangka panjang menyebabkan gangguan sintesis DNA eritroblas di sumsum tulang, menghasilkan gambaran Anemia Megaloblastik dengan morfologi eritrosit makrositik normokromik (MCV > 100 fL) dan hipersegmentasi neutrofil pada apusan darah tepi.",
      referensi: "Nelson Textbook of Pediatrics; Epilepsy & Behavior Clinical Therapeutics.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-07",
      nomor: 7,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak perempuan umur 11 tahun dibawa ibunya ke poliklinik karena keluhan sering lemas dan mudah lelah sejak 1 bulan yang lalu. Ibu pasien juga mengeluhkan anaknya tampak pucat. Riwayat pasien pernah mengalami keluhan serupa saat masih kecil dan mendapatkan transfusi darah. Pemeriksaan tanda vital tekanan darah 110/70 mmHg, nadi 88 kali/menit, laju napas 24 kali/menit, suhu 36,5 °C. Pemeriksaan fisik konjungtiva anemis (+), splenomegali (+). Hasil laboratorium darah lengkap didapatkan Hb 7,8 g/dL, leukosit 4800/mm³, trombosit 188.000/mm³, hapusan darah tepi didapatkan anemia hipokromik mikrositik. Dilakukan pemeriksaan Hb elektroforesis didapat hasil HbA, HbF dan HbA2 turun, HbBart (+).",
      pertanyaan: "Apakah diagnosis pasien tersebut?",
      opsi: [
        { id: "a", teks: "Talasemia alfa mayor" },
        { id: "b", teks: "Talasemia alfa minor" },
        { id: "c", teks: "Talasemia beta minor" },
        { id: "d", teks: "Talasemia beta intermediet" },
        { id: "e", teks: "Talasemia beta mayor" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Pada elektroforesis hemoglobin, ditemukannya Hb Bart (tetramer rantai gamma: γ4) menandakan defisiensi pembentukan rantai globin alfa (Alpha-Thalassemia spectrum). Karena rantai alfa juga merupakan komponen dari HbA (α2β2), HbA2 (α2δ2), dan HbF (α2γ2), penurunan seluruh fraksi tersebut disertai Hb Bart positif khas untuk defisiensi sintesis alfa yang bermakna. Kunci soal merujuk pada Talasemia Alfa Mayor.",
      referensi: "Thalassemia International Federation (TIF) Guidelines; Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-08",
      nomor: 8,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 3 tahun datang dengan keluhan muncul bercak kemerahan di tubuh dan tangan sejak 2 hari yang lalu. Riwayat 2 minggu sebelumnya pasien demam, batuk, pilek selama 3 hari namun saat ini sudah sembuh. Tekanan darah 100/70 mmHg, nadi 90 kali/menit, laju napas 28 kali/menit, suhu 36 °C. Pemeriksaan fisik didapatkan petekie di tubuh dan ekstremitas, lain-lain dalam batas normal. Pemeriksaan laboratorium didapatkan Hb 12,6 g/dL, Leukosit 8000 sel/mm³, Trombosit 30.000 sel/mm³.",
      pertanyaan: "Apakah kemungkinan diagnosis pasien?",
      opsi: [
        { id: "a", teks: "DIC" },
        { id: "b", teks: "ITP" },
        { id: "c", teks: "Hemofilia" },
        { id: "d", teks: "Von willebrand disease" },
        { id: "e", teks: "Talasemia" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Trombositopenia terisolasi (trombosit 30.000/µL dengan Hb dan leukosit normal), manifestasi perdarahan kutaneus berupa petekie/purpura tanpa hepatosplenomegali atau limfadenopati, didahului oleh riwayat infeksi virus (ISPA) 1–3 minggu sebelumnya merupakan gambaran klasik Immune Thrombocytopenic Purpura (ITP) akut pada anak.",
      referensi: "American Society of Hematology (ASH) 2019 Guidelines for Immune Thrombocytopenia; IDAI Rekomendasi ITP.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-09",
      nomor: 9,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3A",
      vignette:
        "Anak laki-laki berusia 3 tahun dibawa orang tuanya ke IGD RS dengan keluhan bengkak dan nyeri pada lutut kanan. Hal ini dirasakan secara mendadak, riwayat jatuh dan terbentur disangkal. Sebelumnya, orang tua sering menemukan lebam di tubuh anak. Riwayat kakek pernah mengalami hal serupa. Pada pemeriksaan fisik didapatkan edema yang teraba hangat, kemerahan, nyeri tekan, dan nyeri gerak pada lutut kanan. Dari hasil pemeriksaan laboratorium didapatkan Hb 11 g/dL, Leukosit 9.200/µL, Trombosit 265.000/µL, Bleeding Time normal, Clotting Time memanjang, PT normal, aPTT memanjang, F. VIII normal, dan F. IX menurun.",
      pertanyaan: "Apakah diagnosis anak tersebut?",
      opsi: [
        { id: "a", teks: "Hemofilia A sedang" },
        { id: "b", teks: "Hemofilia A berat" },
        { id: "c", teks: "Hemofilia B ringan" },
        { id: "d", teks: "Hemofilia B sedang" },
        { id: "e", teks: "Hemofilia B berat" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Penurunan Faktor IX (Christmas Factor) menegakkan diagnosis Hemofilia B (Christmas Disease, X-linked recessive). Hemartrosis spontan (perdarahan sendi mendadak tanpa trauma jelas) dan hematoma subkutan berulang merupakan karakteristik klinis utama dari Hemofilia Derajat Berat (kadar aktivitas faktor pembekuan < 1%).",
      referensi: "World Federation of Hemophilia (WFH) Guidelines for the Management of Hemophilia 3rd ed.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-10",
      nomor: 10,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3B",
      vignette:
        "Anak laki-laki usia 9 tahun dibawa ke IGD RS karena mengeluhkan perdarahan tidak berhenti pada lutut setelah terjatuh dari sepeda. Dari anamnesis didapatkan bahwa pasien sering mengalami hal serupa dan setiap luka, perdarahan lama baru berhenti. Riwayat penyakit yang sama pada keluarga ada, yaitu paman pasien. Pada pemeriksaan fisik didapatkan perdarahan aktif. Pada pemeriksaan darah menunjukkan hasil clotting time memanjang serta pemanjangan APTT.",
      pertanyaan: "Apakah terapi yang tepat pada pasien tersebut?",
      opsi: [
        { id: "a", teks: "Asam Traneksamat" },
        { id: "b", teks: "Efedrin" },
        { id: "c", teks: "Transfusi darah" },
        { id: "d", teks: "Transfusi Faktor Pembekuan" },
        { id: "e", teks: "Transfusi FFP" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Kecurigaan hemofilia (riwayat perdarahan sukar berhenti pada anak laki-laki dengan transmisi maternal/X-linked, aPTT memanjang, perdarahan sendi/jaringan lunak) dengan episode perdarahan aktif membutuhkan terapi pengganti definitif yaitu Konsentrat Faktor Pembekuan (Factor Replacement Therapy, baik Faktor VIII untuk hemofilia A atau Faktor IX untuk hemofilia B) guna mencapai hemostasis cepat dan mencegah artropati hemofilik.",
      referensi: "WFH Guidelines for the Management of Hemophilia; Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Mode Darurat & Resusitasi Pediatri",
        href: "/preview/darurat",
      },
    },
    {
      id: "pj4-soal-11",
      nomor: 11,
      subdivisi: "alergi-imunologi",
      subdivisiLabel: "Alergi & Imunologi",
      tingkatSKDI: "3B",
      vignette:
        "Anak perempuan usia 10 tahun dibawa ibunya ke poli anak dengan keluhan muncul bintik-bintik kemerahan di kedua kaki sejak 3 hari yang lalu. Keluhan disertai dengan nyeri sendi, BAK berwarna kemerahan, dan BAB hitam. Riwayat sebelumnya pasien mengalami batuk dan pilek. Pasien pernah mengalami keluhan serupa 6 bulan yang lalu namun keluhan saat ini lebih berat. Pada pemeriksaan fisik didapatkan palpable purpura dan makula eritematosus pada kedua ekstremitas bawah. Hasil lab: Hb 12 g/dL, Ht 36%, Leukosit 4700/mm³, Trombosit 170.000/mm³, peningkatan laju endap darah, dan peningkatan kadar IgA dalam darah.",
      pertanyaan: "Apakah diagnosis yang paling mungkin pada pasien?",
      opsi: [
        { id: "a", teks: "Immune thrombocytopenic purpura" },
        { id: "b", teks: "Arteritis Takayasu" },
        { id: "c", teks: "Henoch-schonlein Purpura" },
        { id: "d", teks: "Granulomatosis with Polyangiitis" },
        { id: "e", teks: "Polyarteritis Nodosa" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Tetrad klinis klasik Vaskulitis IgA / Henoch-Schönlein Purpura (HSP): 1) Palpable purpura terutama pada ekstremitas bawah dan bokong tanpa trombositopenia (trombosit normal 170.000/mm³), 2) Artritis/artralgia sendi perifer, 3) Keterlibatan gastrointestinal (nyeri perut, melena/BAB hitam), dan 4) Keterlibatan renal (hematuria/nefritis IgA), didahului ISPA dan disertai peningkatan kadar IgA serum.",
      referensi: "EULAR/PRINTO/PRES Criteria for IgA Vasculitis (Henoch-Schönlein Purpura); Nelson Textbook of Pediatrics.",
      linkAlatTerkait: {
        label: "Alur Tatalaksana Klinis Anak",
        href: "/preview/alur",
      },
    },
    {
      id: "pj4-soal-12",
      nomor: 12,
      subdivisi: "gawat-darurat",
      subdivisiLabel: "Gawat Darurat",
      tingkatSKDI: "3B",
      vignette:
        "Seorang laki-laki usia 16 tahun baru saja menjalani operasi laparotomi akibat appendicitis perforasi. Selang 2 hari post-operasi, pasien mengalami pendarahan hebat melalui selang NGT disertai luka bernanah di sekitar bekas jahitan. Pemeriksaan fisik menunjukkan kesadaran letargi, tekanan darah 90/60 mmHg, nadi 120 kali/menit teraba lemah, laju napas 24 kali/menit, suhu 37,9°C. Pasien juga menjadi oliguria dalam beberapa jam terakhir. Berdasarkan hasil lab diperoleh Hb 7.0 g/dL, leukosit 28.000/mm³, trombosit 90.000/mm³, Bleeding Time memanjang.",
      pertanyaan: "Apakah pemeriksaan yang harus dilengkapi untuk menegakkan diagnosis penyakit di atas?",
      opsi: [
        { id: "a", teks: "Fibrinogen level, PT, D-dimer" },
        { id: "b", teks: "Prothrombin level, APTT, D-dimer" },
        { id: "c", teks: "Fibrinogen level, leukosit, D-dimer" },
        { id: "d", teks: "PT, D-dimer" },
        { id: "e", teks: "Leukosit, fibrinogen level, PT, thrombin time" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Sepsis intraabdominal pasca-laparotomi dengan perdarahan masif NGT, syok, oliguria, dan trombositopenia konsumtif mengarah pada Disseminated Intravascular Coagulation (DIC). Menurut kriteria International Society on Thrombosis and Haemostasis (ISTH) scoring system for overt DIC, pemeriksaan kunci koagulasi yang harus diperiksa meliputi: jumlah trombosit, penanda degradasi fibrin (D-dimer / FDP), pemanjangan waktu protrombin (PT / INR), dan kadar fibrinogen plasma (hipofibrinogenemia).",
      referensi: "ISTH Diagnostic Scoring System for Disseminated Intravascular Coagulation; Surviving Sepsis Campaign.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-13",
      nomor: 13,
      subdivisi: "hematologi",
      subdivisiLabel: "Hematologi",
      tingkatSKDI: "3A",
      vignette:
        "Seorang anak perempuan berusia 5 tahun datang bersama ibunya ke Puskesmas dengan keluhan tampak pucat sejak 1 bulan yang lalu. Anak juga dikeluhkan sering demam, sering muncul lebam-lebam di tubuh, dan sering mimisan. Pada pemeriksaan fisik ditemukan konjungtiva anemis, hepatomegali dan petechiae pada ekstremitas. Pemeriksaan laboratorium didapatkan Hb 8,7 g/dL, Ht 26%, Leukosit 82.000/µL, Trombosit 98.000/µL.",
      pertanyaan: "Apakah diagnosis anak tersebut?",
      opsi: [
        { id: "a", teks: "Leukemia limfositik akut" },
        { id: "b", teks: "Leukemia myeloblastik akut" },
        { id: "c", teks: "Leukemia limfositik kronis" },
        { id: "d", teks: "Leukemia myeloblastik kronis" },
        { id: "e", teks: "Anemia aplastik" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Pucat progresif (anemia), demam berulang (akibat granulositopenia), manifestasi perdarahan (trombositopenia: lebam dan mimisan), organomegali (hepatomegali), dan hiperleukositosis (leukosit 82.000/µL) pada anak balita (puncak insiden usia 2–5 tahun) merupakan manifestasi klasik Leukemia Limfoblastik Akut / Leukemia Limfositik Akut (Acute Lymphoblastic Leukemia / ALL), yang mencakup >75% seluruh kasus leukemia anak.",
      referensi: "NCI Childhood Acute Lymphoblastic Leukemia; IDAI Buku Ajar Hematologi Onkologi Anak.",
      linkAlatTerkait: {
        label: "Panel Interpretasi Lab Pediatri",
        href: "/preview/lab",
      },
    },
    {
      id: "pj4-soal-14",
      nomor: 14,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 6 tahun datang ke dokter dengan keluhan sering lemas sejak 2 minggu. Keluhan disertai sering berkemih, cepat haus dan lapar serta berat badan turun sejak 1 bulan ini. Pemeriksaan tanda vital didapatkan tekanan darah 100/70 mmHg, Nadi 100 kali/menit, Laju Napas 24 kali/menit, Suhu 36°C. Pemeriksaan fisik dalam batas normal. Hasil laboratorium GDS 312 mg/dL, islet cell antibody (+), insulin antibody (+).",
      pertanyaan: "Apakah diagnosis yang tepat ?",
      opsi: [
        { id: "a", teks: "DM Tipe 1" },
        { id: "b", teks: "DM Tipe 2" },
        { id: "c", teks: "Diabetes Insipidus" },
        { id: "d", teks: "KAD" },
        { id: "e", teks: "HHS" },
      ],
      jawabanBenar: "a",
      pembahasan:
        "Trias diabetes (poliuria, polidipsia, polifagia) disertai penurunan berat badan nyata, kadar glukosa darah sewaktu > 200 mg/dL (GDS 312 mg/dL), dan adanya autoantibodi spesifik sel beta pankreas (Islet Cell Cytoplasmic Autoantibodies / ICA dan Anti-Insulin Autoantibodies / IAA positif) menegakkan diagnosis Diabetes Melitus Tipe 1 yang dimediasi autoimun (Autoimmune Type 1 DM). Belum ada tanda asidosis metabolik/KAD pada saat ini.",
      referensi: "ISPAD Clinical Practice Consensus Guidelines 2022: Definition, epidemiology, and classification of diabetes in children and adolescents; IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj4-soal-15",
      nomor: 15,
      subdivisi: "gawat-darurat",
      subdivisiLabel: "Gawat Darurat",
      tingkatSKDI: "3B",
      vignette:
        "Seorang anak perempuan usia 14 tahun, berat badan 40 kg, datang ke instalasi gawat darurat dengan keluhan utama lemas yang memberat sejak 1 minggu sebelum masuk rumah sakit. Pasien mengalami penurunan berat badan 5 kg dalam 1 bulan, banyak minum, dan banyak berkemih. Riwayat penyakit dahulu dan keluarga diabetes disangkal. Pasien tampak sakit berat, tampak sesak, pernapasan Kussmaul, kesadaran apatis, pemeriksaan fisis lain dalam batas normal. Leukosit 24.800/mm³; gula darah sewaktu (GDS) 628 mg/dL; pH 7,139; HCO3 4,6 mmol/L; Keton urin +2; HbA1C > 15,0.",
      pertanyaan: "Apakah tatalaksana awal yang tepat?",
      opsi: [
        { id: "a", teks: "Infus D5% 10 -- 20 cc per kg bb dalam 1 jam pertama" },
        { id: "b", teks: "Infus D10% 10 -- 20 cc per kg bb dalam 1 jam pertama" },
        { id: "c", teks: "Infus NaCl 3% 10 -- 20 cc per kg bb dalam 1 jam pertama" },
        { id: "d", teks: "Rehidrasi RL 10 -- 20 cc per kg bb dalam 1 jam pertama" },
        { id: "e", teks: "Insulin bolus 10 -- 20 cc per kg bb dalam 1 jam pertama" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Pasien mengalami Ketoasidosis Diabetik (KAD) Berat: hiperglikemia (GDS 628 mg/dL), asidosis metabolik berat (pH < 7,15 yaitu 7,139; bikarbonat serum < 5 mmol/L yaitu 4,6 mmol/L), ketonuria +2, dan napas Kussmaul. Berdasarkan pedoman ISPAD dan IDAI, langkah pertama tata laksana KAD adalah Resusitasi Cairan Awal menggunakan kristaloid isotonik (Ringer Laktat atau NaCl 0,9%) sebanyak 10–20 mL/kgBB dalam 1 jam pertama untuk memulihkan perfusi intravaskular. Insulin bolus IV dilarang karena dapat memicu kolaps sirkulasi dan edema serebri.",
      referensi: "ISPAD Clinical Practice Consensus Guidelines 2022: Diabetic ketoacidosis and hyperglycemic hyperosmolar state; UKK Endokrinologi IDAI.",
      linkAlatTerkait: {
        label: "Kalkulator Cairan & Rehidrasi",
        href: "/preview/fluids",
      },
    },
    {
      id: "pj4-soal-16",
      nomor: 16,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Anak perempuan usia 5 tahun datang ke poliklinik diantar oleh orang tuanya dikeluhkan anak tampak lebih kecil dan lebih pendek dari teman seusianya. Pasien belum sekolah karena belum lancar berbicara. Tanda vital didapatkan nadi 90 kali/menit, respirasi 22 kali/menit, suhu 36,8°C. Pemeriksaan fisik didapatkan lidah besar dan benjolan pada perut.",
      pertanyaan: "Apakah kemungkinan diagnosis anak tersebut?",
      opsi: [
        { id: "a", teks: "Gigantisme" },
        { id: "b", teks: "Akromegali" },
        { id: "c", teks: "Hipotiroidisme kongenital" },
        { id: "d", teks: "Dwarfisme" },
        { id: "e", teks: "Gizi buruk" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Gambaran perawakan pendek (stunting/short stature), retardasi mental/keterlambatan bicara dan perkembangan motorik, makroglosia (lidah besar dan menjulur), serta hernia umbilikalis (benjolan di perut) merupakan manifestasi klasik Hipotiroidisme Kongenital yang tidak terdiagnosis dan tidak diobati sejak masa bayi.",
      referensi: "American Academy of Pediatrics (AAP) Congenital Hypothyroidism Guidelines; Permenkes Skrining Hipotiroid Kongenital.",
      linkAlatTerkait: {
        label: "Kurva Pertumbuhan & Tumbuh Kembang",
        href: "/preview/pertumbuhan",
      },
    },
    {
      id: "pj4-soal-17",
      nomor: 17,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi laki-laki umur 1 bulan dibawa ibunya ke dokter dengan keluhan lemas, bayi juga tidak kuat menetek. Riwayat lahir normal pervaginam, usia kehamilan 43 minggu, BBL 3000 gram. Pemeriksaan fisik kesadaran compos mentis, nadi 150 kali/menit, laju napas 40 kali/menit, suhu 36 °C, didapatkan makroglosia, dan hernia umbilical.",
      pertanyaan: "Kapan pemberian terapi terbaik dimulai, sehingga komplikasi dapat dicegah?",
      opsi: [
        { id: "a", teks: "Segera setelah lahir" },
        { id: "b", teks: "Sebelum usia 1 minggu" },
        { id: "c", teks: "Sebelum usia 2 minggu" },
        { id: "d", teks: "Sebelum usia 1 bulan" },
        { id: "e", teks: "Sebelum usia 2 bulan" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pada Hipotiroidisme Kongenital (HK), inisiasi substitusi hormon levotiroksin (L-T4 dosis 10–15 µg/kgBB/hari) paling baik dan idealnya dimulai sebelum usia 2 minggu (atau selambat-lambatnya sebelum hari ke-14 kehidupan) untuk mencegah kerusakan neuron otak yang ireversibel serta menjamin perkembangan inteligensi (IQ) dan pertumbuhan linier yang optimal.",
      referensi: "AAP / ESPE Consensus Guidelines on Screening and Management of Congenital Hypothyroidism; Pedoman Skrining Hipotiroid Kongenital Kemenkes RI.",
      linkAlatTerkait: {
        label: "Kalkulator Dosis Obat Pediatri",
        href: "/preview/dosing",
      },
    },
    {
      id: "pj4-soal-18",
      nomor: 18,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi laki-laki umur 1 bulan dibawa ibunya ke dokter dengan keluhan lemas, bayi juga tidak kuat menetek. Riwayat lahir normal pervaginam, usia kehamilan 43 minggu, BBL 3000 gram. Pemeriksaan fisik kesadaran compos mentis, nadi 150 kali/menit, laju napas 40 kali/menit, suhu 36 °C, didapatkan makroglosia, dan hernia umbilical.",
      pertanyaan: "Edukasi apa yang perlu disampaikan pada orang tua pasien?",
      opsi: [
        { id: "a", teks: "Penyebab hipotiroid kongenital" },
        { id: "b", teks: "Pentingnya diagnosis dan terapi dini guna mencegah hambatan tumbuh kembang" },
        { id: "c", teks: "Pentingnya minum obat teratur sesuai jadwal" },
        { id: "d", teks: "Tidak menghentikan pengobatan tanpa instruksi dokter" },
        { id: "e", teks: "Semua benar" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Edukasi komprehensif bagi orang tua pasien hipotiroid kongenital mencakup: 1) Pemahaman mengenai etiologi kelainan tiroid, 2) Urgensi pengobatan dini untuk mencegah retardasi mental permanen, 3) Kepatuhan pemberian tablet levotiroksin setiap hari (digerus dan diminumkan dengan sedikit ASI/air sebelum minum susu), serta 4) Peringatan keras untuk tidak menghentikan pengobatan secara mandiri tanpa pemantauan berkala kadar TSH dan FT4.",
      referensi: "Buku Panduan Praktik Klinis Ikatan Dokter Anak Indonesia (IDAI) — Hipotiroid Kongenital.",
      linkAlatTerkait: {
        label: "Kurva Pertumbuhan & Tumbuh Kembang",
        href: "/preview/pertumbuhan",
      },
    },
    {
      id: "pj4-soal-19",
      nomor: 19,
      subdivisi: "endokrinologi",
      subdivisiLabel: "Endokrinologi",
      tingkatSKDI: "3B",
      vignette:
        "Anak perempuan usia 6 tahun datang ke RS diantar ibunya dengan keluhan payudara membesar lebih besar dari ukuran biasa. Tumbuh rambut kemaluan sejak 1 bulan yang lalu. Pemeriksaan maturitas seksual didapatkan M2, P1. Saat dilakukan pemeriksaan didapatkan kadar LH meningkat.",
      pertanyaan: "Apakah diagnosis yang tepat untuk pasien tersebut?",
      opsi: [
        { id: "a", teks: "Pubertas inisial" },
        { id: "b", teks: "Pubertas prekoks dependent GnRH" },
        { id: "c", teks: "Pubertas prekoks independent GnRH" },
        { id: "d", teks: "Pubertas prekoks perifer" },
        { id: "e", teks: "Precocial pseudopuberty" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Timbulnya tanda seks sekunder (telarke Tanner M2 dan pubarke P1) sebelum usia 8 tahun pada anak perempuan menandakan Pubertas Prekoks. Kadar Luteinizing Hormone (LH) yang meningkat (kadar basal pubertal atau respons pubertal terhadap stimulasi GnRH) membuktikan adanya aktivasi prematur aksis hipotalamus-hipofisis-gonad (Hypothalamic-Pituitary-Gonadal / HPG axis). Kondisi ini didefinisikan sebagai Pubertas Prekoks Sentral (GnRH-Dependent Precocious Puberty).",
      referensi: "Consensus Statement on the Use of Gonadotropin-Releasing Hormone Analogs in Children; European Society for Paediatric Endocrinology (ESPE); UKK Endokrinologi IDAI.",
      linkAlatTerkait: {
        label: "Kurva Pertumbuhan & Tumbuh Kembang",
        href: "/preview/pertumbuhan",
      },
    },
    {
      id: "pj4-soal-20",
      nomor: 20,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi laki laki usia 3 bulan, dibawa ke dokter oleh ibunya dengan keluhan berak encer kekuningan disertai demam sejak 4 hari yang lalu. Frekuensi berak 3-4 kali/hari tanpa darah maupun lendir. Berak menyemprot disertai pantat merah dan bau asam. Bayi saat ini mendapat ASI eksklusif. Tidak terdapat riwayat pemberian susu formula. Pemeriksaan fisik nadi 140 kali/menit, frekuensi napas 30 kali/menit, suhu 38,3 °C, didapatkan perut kembung, bising usus meningkat, eritema perianal, tidak didapatkan tanda dehidrasi.",
      pertanyaan: "Imunisasi apakah yang dapat diberikan untuk mencegah penyakit tersebut dan kapan waktu imunisasi dapat mulai diberikan?",
      opsi: [
        { id: "a", teks: "PCV, usia 6-8 minggu" },
        { id: "b", teks: "Rotavirus, usia 2-4 minggu" },
        { id: "c", teks: "Pentavalen, usia 8-12 minggu" },
        { id: "d", teks: "PCV, usia 8-12 minggu" },
        { id: "e", teks: "Rotavirus, usia 6-12 minggu" },
      ],
      jawabanBenar: "e",
      pembahasan:
        "Diare cair kekuningan menyemprot berbau asam dengan eritema perianal pada bayi sangat khas disebabkan oleh Rotavirus. Vaksin Rotavirus (RV) diberikan secara oral untuk mencegah diare dehidrasi berat akibat rotavirus. Berdasarkan Jadwal Imunisasi IDAI 2024 dan rekomendasi global, dosis pertama vaksin Rotavirus mulai dapat diberikan sejak usia 6 minggu hingga maksimal usia 12 minggu (interval pemberian minimal 4 minggu antar dosis).",
      referensi: "Jadwal Imunisasi Anak Usia 0–18 Tahun Rekomendasi IDAI 2024; WHO Position Paper on Rotavirus Vaccines.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj4-soal-21",
      nomor: 21,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 18 bulan datang dengan keluhan bengkak di kedua pipi di depan telinga sejak 3 hari disertai demam. Dari pemeriksaan fisik didapatkan nadi 104 kali/menit, laju napas 22 kali/menit, suhu 37,9°C, benjolan di daerah preaurikular hingga submandibula dextra dan sinistra, teraba lunak dan nyeri tekan. Imunisasi terakhir anak saat berusia 4 bulan berupa Pentavalen dan Polio.",
      pertanyaan: "Kapan pemberian imunisasi untuk mencegah penyakit tersebut dapat mulai diberikan?",
      opsi: [
        { id: "a", teks: "Usia 0 bulan" },
        { id: "b", teks: "Usia 1 bulan" },
        { id: "c", teks: "Usia 9 bulan" },
        { id: "d", teks: "Usia 12 bulan" },
        { id: "e", teks: "Usia 20 bulan" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Gejala parotitis bilateral (pembengkakan kelenjar parotis di preaurikular hingga submandibula) disertai demam mengarah pada Gondongan (Mumps/Parotitis Epidemika). Penyakit ini dicegah dengan vaksin MMR (Measles, Mumps, Rubella). Sesuai Rekomendasi Jadwal Imunisasi IDAI, vaksin MMR dapat mulai diberikan sejak usia 12 bulan (atau bila menggunakan MR dimulai usia 9 bulan, lalu MMR diberikan pada usia 15–18 bulan atau saat booster).",
      referensi: "Jadwal Imunisasi Anak IDAI 2024; Pedoman Program Imunisasi Nasional Kemenkes RI.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj4-soal-22",
      nomor: 22,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Bayi berusia 2 bulan dibawa ke puskesmas oleh ibunya karena ingin imunisasi BCG. Menurut ibunya anaknya terlambat imunisasi karena demam setiap kali akan imunisasi. Pada pemeriksaan fisik didapatkan tanda vital dalam batas normal. BB 4 kg.",
      pertanyaan: "Apa tindakan yang tepat pada kasus tersebut?",
      opsi: [
        { id: "a", teks: "Tunda imunisasi BCG" },
        { id: "b", teks: "Segera berikan imunisasi BCG" },
        { id: "c", teks: "Tidak perlu imunisasi BCG" },
        { id: "d", teks: "Tes mantoux" },
        { id: "e", teks: "Periksa Darah Lengkap" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Menurut Rekomendasi Jadwal Imunisasi IDAI 2024 dan Kemenkes RI, vaksin BCG diberikan segera setelah lahir hingga usia sebelum 3 bulan (0–2 bulan). Pada bayi usia 2 bulan yang sehat dan tidak demam pada saat pemeriksaan fisik, vaksin BCG dapat segera diberikan secara intradermal (0,05 mL) tanpa perlu dilakukan uji tuberkulin (uji Mantoux) terlebih dahulu. Uji Mantoux baru diindikasikan bila usia bayi sudah mencapai 3 bulan atau lebih sebelum pemberian BCG.",
      referensi: "Petunjuk Teknis Pelayanan Imunisasi Anak Kemenkes RI; Rekomendasi Imunisasi IDAI 2024.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj4-soal-23",
      nomor: 23,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki usia 18 bulan dibawa ibunya ke Puskesmas untuk imunisasi. Saat ini anak dalam keadaan sehat, rutin mengikuti posyandu dekat rumah. Anak sudah mendapatkan imunisasi dasar lengkap.",
      pertanyaan: "Booster imunisasi apakah yang tidak dapat diberikan pada anak tersebut?",
      opsi: [
        { id: "a", teks: "Polio, MR" },
        { id: "b", teks: "MR, HiB" },
        { id: "c", teks: "Dengue, Tifoid" },
        { id: "d", teks: "Polio, Hep.B" },
        { id: "e", teks: "Polio, DPT" },
      ],
      jawabanBenar: "c",
      pembahasan:
        "Pada usia 18 bulan, vaksin lanjutan (booster) yang direkomendasikan adalah DPT-HB-Hib ke-4 dan Campak-Rubella (MR) ke-2, serta Polio. Sebaliknya, vaksin Tifoid polisakarida baru dapat diberikan mulai usia minimal 24 bulan (2 tahun) dan diulang setiap 3 tahun. Vaksin Dengue (tetravalen/chimeric) baru diberikan mulai usia 6 tahun (atau 9 tahun tergantung jenis sediaan vaksin). Oleh karena itu, vaksin Dengue dan Tifoid TIDAK DAPAT diberikan pada anak usia 18 bulan.",
      referensi: "Jadwal Imunisasi Anak Usia 0–18 Tahun IDAI 2024; WHO Immunization Schedules.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj4-soal-24",
      nomor: 24,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Anak laki-laki berusia 5 tahun dibawa ke dokter karena keluhan kaki kanan tiba-tiba lemah sejak 1 hari ini. Riwayat pasien mengalami demam dan diare dua minggu yang lalu namun saat ini sudah sembuh. Pemeriksaan fisik didapatkan hipotonia pada ekstremitas kanan bawah serta penurunan refleks tendon, sensorik normal. Riwayat pasien tidak pernah diimunisasi sebelumnya karena terdiagnosis HIV (+) dan sering mengalami sariawan berulang sehingga orang tua takut anaknya sakit jika diimunisasi.",
      pertanyaan: "Apa vaksin yang sebenarnya dapat diberikan untuk pencegahan penyakit di atas?",
      opsi: [
        { id: "a", teks: "OPV" },
        { id: "b", teks: "IPV" },
        { id: "c", teks: "MMR" },
        { id: "d", teks: "BCG" },
        { id: "e", teks: "Varicella" },
      ],
      jawabanBenar: "b",
      pembahasan:
        "Poliomielitis (paresis flaksid akut asimetris pasca-infeksi enterovirus polio) dapat dicegah dengan vaksin polio. Pada anak yang mengalami imunodefisiensi primer atau sekunder (termasuk HIV positif), vaksin hidup yang dilemahkan seperti Oral Polio Vaccine (OPV) merupakan kontraindikasi absolut karena risiko VAPP (Vaccine-Associated Paralytic Poliomyelitis). Sebaliknya, Inactivated Poliovirus Vaccine (IPV) adalah vaksin virus mati (inaktif) yang aman dan sangat direkomendasikan untuk pasien HIV.",
      referensi: "WHO Position Paper on Polio Vaccines; CDC Guidelines for Vaccinating Persons with Immunodeficiencies; IDAI.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
    {
      id: "pj4-soal-25",
      nomor: 25,
      subdivisi: "imunisasi",
      subdivisiLabel: "Imunisasi",
      tingkatSKDI: "4A",
      vignette:
        "Seorang bayi lahir normal per vaginam dengan AS 7-9, cukup bulan, BBL 3000 gram. Pemeriksaan fisik bayi dalam batas normal. Status HBsAg ibu belum diketahui karena ibu tidak pernah ANC dan saat datang sudah pembukaan lengkap sehingga harus segera dipimpin persalinannya.",
      pertanyaan: "Apa tindakan imunisasi yang diberikan kepada bayi?",
      opsi: [
        { id: "a", teks: "Memberikan vaksin hepatitis B saja" },
        { id: "b", teks: "Memberikan imunoglobulin hepatitis B saja" },
        { id: "c", teks: "Memberikan vaksin dan imunoglobulin hepatitis B" },
        { id: "d", teks: "Memberikan vaksin hepatitis B, cek HBsAg ibu, jika positif berikan immunoglobulin dalam 7 hari" },
        { id: "e", teks: "Memberikan vaksin hepatitis B saat status HBsAg ibu sudah diketahui" },
      ],
      jawabanBenar: "d",
      pembahasan:
        "Berdasarkan pedoman CDC dan IDAI untuk neonatus dengan status HBsAg ibu yang belum diketahui saat lahir:\n1) Segera berikan dosis monovalen vaksin Hepatitis B (HepB-0) dalam waktu < 12 jam setelah lahir.\n2) Segera periksa status HBsAg darah ibu sesegera mungkin.\n3) Jika hasil HBsAg ibu terbukti positif, berikan Hepatitis B Immune Globulin (HBIG) pada bayi sesegera mungkin, paling lambat dalam waktu 7 hari setelah lahir.",
      referensi: "CDC Prevention of Hepatitis B Virus Infection in the United States; Rekomendasi IDAI Profilaksis Transmisi Vertikal Hepatitis B.",
      linkAlatTerkait: {
        label: "Jadwal Imunisasi Anak (IDAI)",
        href: "/preview/imunisasi",
      },
    },
  ],
};
