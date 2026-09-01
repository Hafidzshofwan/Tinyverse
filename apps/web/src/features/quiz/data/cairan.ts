import type { KuisModul } from "../types";

export const kuisCairan: KuisModul = {
  modulId: "cairan",
  judul: "Terapi Cairan",
  deskripsi: "Uji pemahaman tentang rehidrasi, rumatan, dan terapi cairan pediatrik",
  icon: "💧",
  soal: [
    {
      id: "ca-01",
      pertanyaan:
        "Berdasarkan rumus Holliday–Segar, berapa kebutuhan cairan rumatan harian untuk anak dengan berat badan 25 kg?",
      opsi: [
        { id: "a", teks: "1.400 mL/hari" },
        { id: "b", teks: "1.600 mL/hari" },
        { id: "c", teks: "1.900 mL/hari" },
        { id: "d", teks: "2.200 mL/hari" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Holliday–Segar: 10 kg pertama × 100 mL = 1.000 mL; 10 kg berikutnya × 50 mL = 500 mL; 5 kg sisanya × 20 mL = 100 mL. Total = 1.600 mL/hari. Dalam satuan mL/jam: 65 mL/jam. Alternatif: untuk BB >20 kg, rumus sederhana = 1.500 + (20 × (BB − 20)) = 1.500 + 100 = 1.600 mL.",
      referensi: "Holliday MA & Segar WE, Pediatrics 1957",
    },
    {
      id: "ca-02",
      pertanyaan:
        "Anak 18 bulan BB 10 kg datang dengan diare cair 6×/hari, minum masih mau, tidak ada tanda dehidrasi. Tatalaksana WHO Rencana A yang benar adalah…",
      opsi: [
        { id: "a", teks: "Rawat inap, pasang infus NaCl 0,9% 100 mL/kgBB dalam 3 jam" },
        { id: "b", teks: "Berikan oralit 75 mL/kgBB di fasilitas kesehatan selama 3–4 jam, observasi ketat" },
        { id: "c", teks: "Berikan oralit 50–100 mL setelah setiap BAB di rumah, ASI/makan tetap dilanjutkan" },
        { id: "d", teks: "Puasakan 4 jam, lalu berikan oralit bertahap 10 mL/kgBB/jam" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "WHO Rencana A (tanpa dehidrasi): terapi di rumah. Anak <2 tahun: 50–100 mL oralit setelah tiap BAB cair. Anak ≥2 tahun: 100–200 mL. ASI dan makanan tetap diteruskan tanpa pembatasan. Pasien kembali ke fasilitas jika tanda dehidrasi muncul atau kondisi memburuk. Rencana B (75 mL/kgBB/3 jam) untuk dehidrasi ringan–sedang.",
      referensi: "WHO/UNICEF, Clinical Management of Acute Diarrhoea 2004; IDAI 2019",
    },
    {
      id: "ca-03",
      pertanyaan:
        "Anak 2 tahun BB 12 kg datang dengan diare, mata cekung, haus berlebihan, dan turgor kulit kembali lambat. Berapa volume dan durasi rehidrasi oral WHO Rencana B?",
      opsi: [
        { id: "a", teks: "600 mL oralit dalam 2 jam" },
        { id: "b", teks: "900 mL oralit dalam 3–4 jam" },
        { id: "c", teks: "1.200 mL oralit dalam 6 jam" },
        { id: "d", teks: "Infus RL 30 mL/kgBB dalam 30 menit, lanjut 70 mL/kgBB dalam 2,5 jam" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Rencana B: 75 mL/kgBB dalam 3–4 jam di fasilitas. Untuk BB 12 kg: 75 × 12 = 900 mL oralit dalam 3–4 jam. Setelah selesai, evaluasi ulang: membaik → Rencana A, masih dehidrasi → ulangi Rencana B, memburuk/tidak bisa minum → Rencana C (infus). Pilihan (d) adalah Rencana C untuk anak >1 tahun.",
      referensi: "WHO, Pocket Book of Hospital Care for Children 2013; IDAI 2019",
    },
    {
      id: "ca-04",
      pertanyaan:
        "Bayi 8 bulan BB 7 kg dengan diare berat, letargis, tidak mampu minum, turgor sangat buruk. Berdasarkan WHO Rencana C, pilihan cairan dan regimen yang PALING TEPAT untuk bayi <12 bulan adalah…",
      opsi: [
        { id: "a", teks: "Dextrose 5% dalam NaCl 0,9%, 100 mL/kgBB dalam 3 jam" },
        { id: "b", teks: "Ringer Laktat 30 mL/kgBB dalam 1 jam, lanjut 70 mL/kgBB dalam 5 jam" },
        { id: "c", teks: "Ringer Laktat 30 mL/kgBB dalam 30 menit, lanjut 70 mL/kgBB dalam 2,5 jam" },
        { id: "d", teks: "NaCl 0,9% bolus 20 mL/kgBB dalam 20 menit, ulangi 3× bila belum membaik" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Rencana C bayi <12 bulan: RL (atau NaCl 0,9%) 30 mL/kgBB dalam 1 jam pertama, lanjut 70 mL/kgBB dalam 5 jam → total 100 mL/kgBB dalam 6 jam. Anak ≥12 bulan: 30 mL/kgBB dalam 30 menit, lanjut 70 mL/kgBB dalam 2,5 jam (total 3 jam). Evaluasi setiap 15–30 menit; jika belum membaik, percepat tetesan.",
      referensi: "WHO, Pocket Book of Hospital Care for Children 2013",
    },
    {
      id: "ca-05",
      pertanyaan:
        "Anak 5 tahun pasca-operasi appendektomi, tidak bisa minum oral, memerlukan cairan rumatan IV. Berdasarkan rekomendasi terkini (WHO/NICE/AAP), pilihan cairan rumatan yang PALING AMAN adalah…",
      opsi: [
        { id: "a", teks: "Dextrose 5% dalam NaCl 0,225% (D5 ¼ NS) — cairan hipotonik standar" },
        { id: "b", teks: "Dextrose 5% dalam NaCl 0,45% (D5 ½ NS)" },
        { id: "c", teks: "Ringer Laktat atau NaCl 0,9% (cairan isotonis) ± dextrose" },
        { id: "d", teks: "NaCl 3% hipertonik untuk mencegah pembengkakan" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "Panduan terkini (WHO 2006, NICE 2015, AAP 2018) merekomendasikan cairan isotonis (NaCl 0,9% atau RL) sebagai cairan rumatan IV pada anak untuk mencegah hiponatremia iatrogenik yang dapat menyebabkan edema serebral. Cairan hipotonik (D5 ¼NS atau D5 ½NS) tidak lagi dianjurkan. Dextrose ditambahkan bila diperlukan kalori (mis. D5 dalam RL atau dalam NS). NaCl 3% hanya untuk koreksi hiponatremia simtomatis.",
      referensi: "NICE NG29 2015; PAHO/WHO 2006; AAP Pediatrics 2018",
    },
    {
      id: "ca-06",
      pertanyaan:
        "Anak 20 kg mengalami luka bakar 40% TBSA (total body surface area). Berapa volume cairan total yang diberikan dalam 24 jam pertama menurut formula Parkland?",
      opsi: [
        { id: "a", teks: "1.600 mL Ringer Laktat" },
        { id: "b", teks: "2.400 mL Ringer Laktat" },
        { id: "c", teks: "3.200 mL Ringer Laktat" },
        { id: "d", teks: "4.000 mL Ringer Laktat" },
      ],
      jawabanBenar: "c",
      penjelasan:
        "Formula Parkland: 4 mL × kgBB × % TBSA = 4 × 20 × 40 = 3.200 mL Ringer Laktat dalam 24 jam pertama. Pembagian: 50% (1.600 mL) dalam 8 jam pertama sejak waktu luka bakar; 50% sisanya (1.600 mL) dalam 16 jam berikutnya. Volume ini TIDAK termasuk cairan rumatan. Pantau diuresis target 0,5–1 mL/kgBB/jam.",
      referensi: "Baxter CR, Surg Clin North Am 1978; IDAI Buku Ajar Bedah Anak",
    },
    {
      id: "ca-07",
      pertanyaan:
        "Set infus makro memiliki faktor tetes 20 gtt/mL. Dokter menginstruksikan cairan 1.200 mL dalam 8 jam. Berapa tetes per menit yang harus diatur?",
      opsi: [
        { id: "a", teks: "25 gtt/menit" },
        { id: "b", teks: "50 gtt/menit" },
        { id: "c", teks: "75 gtt/menit" },
        { id: "d", teks: "100 gtt/menit" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Rumus faktor tetes: tetes/menit = (Volume mL × faktor tetes) ÷ (durasi jam × 60 menit). = (1.200 × 20) ÷ (8 × 60) = 24.000 ÷ 480 = 50 gtt/menit. Catatan: set makro (dewasa) = 20 gtt/mL; set mikro (pediatri) = 60 gtt/mL. Untuk bayi gunakan set mikro atau syringe pump agar lebih presisi.",
      referensi: "IDAI Pedoman Praktis Terapi Cairan 2018",
    },
    {
      id: "ca-08",
      pertanyaan:
        "Anak 4 tahun dengan diare dan demam tinggi, kadar Na+ serum 162 mEq/L (hipernatremia). Kecepatan koreksi natrium yang AMAN adalah…",
      opsi: [
        { id: "a", teks: "Turunkan Na+ secepat mungkin ke normal dalam 6 jam dengan cairan hipotonik" },
        { id: "b", teks: "Turunkan Na+ ≤0,5 mEq/L/jam atau ≤10–12 mEq/L per 24 jam" },
        { id: "c", teks: "Turunkan Na+ 1–2 mEq/L/jam, target normal dalam 12 jam" },
        { id: "d", teks: "Tidak perlu koreksi khusus, cukup berikan cairan bebas oral" },
      ],
      jawabanBenar: "b",
      penjelasan:
        "Koreksi hipernatremia yang terlalu cepat menyebabkan osmotic shift ke dalam sel otak → edema serebral → kejang bahkan herniasi. Target aman: penurunan Na+ tidak lebih dari 10–12 mEq/L per hari (≈0,5 mEq/L/jam). Gunakan cairan hipotonik (mis. D5 ¼NS atau RL) secara bertahap dengan pemantauan elektrolit tiap 4–6 jam. Total durasi koreksi biasanya 48–72 jam.",
      referensi: "Moritz ML & Ayus JC, Pediatrics 2020; Nelson Textbook 21st ed.",
    },
  ],
};
