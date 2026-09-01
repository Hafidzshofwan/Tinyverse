import type { KuisModul } from "../types";

export const kuisNeonatus: KuisModul = {
  modulId: "neonatus",
  judul: "Tools Neonatus",
  deskripsi: "Uji pemahaman tentang TPN neonatus, GIR, dan bilirubin neonatal",
  icon: "👶",
  soal: [
    {
      id: "ne-01",
      pertanyaan:
        "Bayi prematur 28 minggu, berat lahir 1 kg, mendapat infus Dextrose 10% dengan kecepatan 3 mL/jam. Berapa GIR (Glucose Infusion Rate) bayi tersebut dalam mg/kgBB/menit?",
      opsi: [
        { id: "a", teks: "2 mg/kgBB/menit" },
        { id: "b", teks: "5 mg/kgBB/menit" },
        { id: "c", teks: "8 mg/kgBB/menit" },
        { id: "d", teks: "10 mg/kgBB/menit" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "GIR (mg/kgBB/menit) = (kecepatan mL/jam × konsentrasi %) ÷ (BB kg × 6). = (3 × 10) ÷ (1 × 6) = 30 ÷ 6 = 5 mg/kgBB/menit. Target GIR awal neonatus cukup bulan: 4–6 mg/kgBB/menit. Preterm hari pertama mulai dari 4 mg/kgBB/menit, naik bertahap 1–2 mg/kgBB/menit per hari. GIR >12 berisiko hiperglikemia.",
      referensi: "ESPGHAN/ESPEN/ESPR Parenteral Nutrition Guidelines 2018",
    },
    {
      id: "ne-02",
      pertanyaan:
        "Pada TPN neonatus prematur (<32 minggu), dosis awal asam amino yang direkomendasikan sejak hari pertama kehidupan adalah…",
      opsi: [
        { id: "a", teks: "0,5 g/kgBB/hari — mulai sangat rendah dan naikkan perlahan" },
        { id: "b", teks: "1,5–2,0 g/kgBB/hari — pemberian dini untuk mencegah katabolisme" },
        { id: "c", teks: "3,0–4,0 g/kgBB/hari langsung sejak hari pertama" },
        { id: "d", teks: "Tunda hingga hari ke-3 agar ginjal siap memetabolisme" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "ESPGHAN 2018 merekomendasikan 'early aggressive amino acid': mulai 1,5–2 g/kgBB/hari sejak hari pertama, naik 0,5–1 g/kgBB/hari hingga target 3,5–4 g/kgBB/hari untuk preterm. Pemberian dini mencegah nitrogen balance negatif dan katabolisme otot. Pemantauan: BUN, kreatinin, dan amonia berkala untuk deteksi toleransi.",
      referensi: "Embleton ND et al., ESPGHAN Guidelines, J Pediatr Gastroenterol 2018",
    },
    {
      id: "ne-03",
      pertanyaan:
        "Kapan emulsi lipid intravena sebaiknya dimulai pada neonatus prematur dalam program TPN?",
      opsi: [
        { id: "a", teks: "Hari ke-3 atau ke-4, setelah kadar glukosa darah stabil" },
        { id: "b", teks: "Hari ke-1 hingga hari ke-2, mulai 0,5–1 g/kgBB/hari" },
        { id: "c", teks: "Hanya jika bayi tidak mendapat enteral minimal setelah 2 minggu" },
        { id: "d", teks: "Saat bilirubin total di bawah ambang fototerapi" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Lipid intravena direkomendasikan mulai hari ke-1 hingga ke-2, dosis 0,5–1 g/kgBB/hari. Naikkan 0,5–1 g/kgBB/hari hingga target 3 g/kgBB/hari (preterm) atau 3–4 g/kgBB/hari (term). Lipid dini penting untuk asam lemak esensial (mencegah defisiensi), sebagai sumber kalori, dan mendukung perkembangan otak preterm. Pantau trigliserida serum; pertahankan <200–250 mg/dL.",
      referensi: "Koletzko B et al., ESPGHAN/ESPEN Guidelines 2018",
    },
    {
      id: "ne-04",
      pertanyaan:
        "Bayi usia gestasi 36 minggu, lahir tanpa komplikasi, usia 30 jam, bilirubin total 13,5 mg/dL, tidak ada faktor risiko neurotoksisitas. Berdasarkan panduan AAP (nomogram Bhutani), tindakan yang paling tepat adalah…",
      opsi: [
        { id: "a", teks: "Tidak perlu tindakan apapun, bilirubin masih jauh di bawah batas" },
        { id: "b", teks: "Pantau ulang bilirubin dalam 12–24 jam, belum perlu fototerapi" },
        { id: "c", teks: "Mulai fototerapi segera karena bilirubin sudah mencapai ambang untuk usia gestasi dan jam ini" },
        { id: "d", teks: "Siapkan transfusi tukar karena kadar sudah berbahaya" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "Pada nomogram AAP 2004, bayi 36 minggu tanpa faktor risiko (medium risk), usia 30 jam: ambang fototerapi ≈13–14 mg/dL. Kadar 13,5 mg/dL sudah melampaui atau berada di batas ambang → mulai fototerapi. Jika ada faktor risiko (G6PD, isoimunisasi, asfiksia, dll.) ambang lebih rendah ±2–3 mg/dL. Evaluasi respons fototerapi setelah 4–6 jam.",
      referensi: "AAP Clinical Practice Guideline, Pediatrics 2004 & Update 2022",
    },
    {
      id: "ne-05",
      pertanyaan:
        "Manakah yang BUKAN termasuk faktor risiko neurotoksisitas bilirubin sehingga menurunkan ambang batas fototerapi/transfusi tukar?",
      opsi: [
        { id: "a", teks: "Defisiensi G6PD (glucose-6-phosphate dehydrogenase)" },
        { id: "b", teks: "Isoimunisasi (inkompatibilitas golongan darah Rh atau ABO)" },
        { id: "c", teks: "Berat lahir >4.000 gram (makrosomia)" },
        { id: "d", teks: "Asidosis metabolik dan hipoalbuminemia (<3 g/dL)" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "Faktor risiko neurotoksisitas bilirubin yang MENURUNKAN ambang intervensi: isoimunisasi (hemolisis percepat), defisiensi G6PD, asfiksia, sepsis, asidosis, hipotermia, hipoalbuminemia (<3 g/dL), dan obat yang kompetitif dengan ikatan bilirubin–albumin. Makrosomia (BB >4.000 g) BUKAN faktor risiko neurotoksisitas bilirubin.",
      referensi: "AAP Pediatrics 2022; IDAI Neonatologi 2022",
    },
    {
      id: "ne-06",
      pertanyaan:
        "Bayi prematur 34 minggu dengan hiperbilirubinemia berat. Indikasi utama transfusi tukar (exchange transfusion) adalah…",
      opsi: [
        { id: "a", teks: "Bilirubin total melebihi ambang fototerapi lebih dari 24 jam" },
        { id: "b", teks: "Bilirubin total mencapai atau melebihi ambang transfusi tukar, ATAU tanda ensefalopati bilirubin akut" },
        { id: "c", teks: "Bilirubin direk >2 mg/dL yang menandakan kolestasis berat" },
        { id: "d", teks: "Fototerapi intensif gagal menurunkan bilirubin dalam 2 jam pertama" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Transfusi tukar diindikasikan jika: (1) Bilirubin total mencapai ambang sesuai nomogram berdasarkan usia gestasi + jam usia + faktor risiko, atau (2) Tanda ensefalopati bilirubin akut: hipertonia, opistotonos, retrocollis, high-pitched cry, demam — bahkan jika bilirubin belum mencapai ambang. Transfusi tukar mengganti ~85% volume darah bayi. Fototerapi gagal di 2 jam pertama BUKAN indikasi langsung; butuh evaluasi lebih lanjut.",
      referensi: "AAP Pediatrics 2022; IDAI Panduan Hiperbilirubinemia Neonatus 2022",
    },
    {
      id: "ne-07",
      pertanyaan:
        "GIR (Glucose Infusion Rate) fisiologis pada neonatus cukup bulan yang mencerminkan produksi glukosa hepatik endogen adalah…",
      opsi: [
        { id: "a", teks: "1–2 mg/kgBB/menit" },
        { id: "b", teks: "4–6 mg/kgBB/menit" },
        { id: "c", teks: "8–10 mg/kgBB/menit" },
        { id: "d", teks: "12–15 mg/kgBB/menit" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Produksi glukosa hepatik endogen pada neonatus cukup bulan ≈4–6 mg/kgBB/menit — ini menjadi target GIR awal TPN. Bayi prematur mulai 2–4 mg/kgBB/menit karena risiko hiperglikemia. GIR <4 dapat menyebabkan hipoglikemia; GIR >8 berisiko hiperglikemia terutama pada preterm (kapasitas fosforilasi oksidatif terbatas). Sesuaikan GIR berdasarkan monitoring glukosa darah serial.",
      referensi: "Hay WW, Pediatrics Rev 2018; ESPGHAN 2018",
    },
    {
      id: "ne-08",
      pertanyaan:
        "Ambang batas bilirubin direk (terkonjugasi) yang menunjukkan kolestasis neonatus dan memerlukan evaluasi lanjutan adalah…",
      opsi: [
        { id: "a", teks: "Bilirubin direk >0,3 mg/dL kapanpun" },
        { id: "b", teks: "Bilirubin direk >1 mg/dL, ATAU >20% dari bilirubin total jika total <5 mg/dL" },
        { id: "c", teks: "Bilirubin direk >3 mg/dL pada usia >2 minggu" },
        { id: "d", teks: "Bilirubin direk >5 mg/dL dengan ikterus klinis" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Kolestasis neonatus: bilirubin direk >1 mg/dL ATAU >20% dari bilirubin total (jika total <5 mg/dL). Evaluasi wajib pada semua bayi ikterus usia >2 minggu (atau >3 minggu jika ASI eksklusif). Penyebab meliputi atresia bilier (emergensi — operasi Kasai sebelum usia 60 hari!), hepatitis neonatal, kolestasis terkait TPN, defisiensi α1-antitripsin. Waspadai feses acholic (putih/pucat) sebagai tanda obstruksi bilier.",
      referensi: "NASPGHAN/ESPGHAN Joint Guidelines, J Pediatr Gastroenterol 2017",
    },
  ],
};
