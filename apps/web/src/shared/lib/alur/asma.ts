import type { Alur } from "./tipe";

const KRITERIA: string[] = [
  "Ringan\u2013Sedang: tidak gelisah, bicara kalimat, retraksi minimal, SpO\u2082 92\u201395%.",
  "Berat: gelisah, bicara kata, retraksi jelas, SpO\u2082 <92%.",
  "Ancaman henti napas: letargi, suara napas tak terdengar.",
];

export const ASMA: Alur = {
  id: "asma",
  nama: "Serangan Asma",
  sumber: "Pedoman Nasional Asma Anak, IDAI 2022 (Gbr 6.1 FKTP, Gbr 6.2 RS, Lampiran 1)",
  mulai: { fktp: "f-nilai", rs: "r-nilai" },
  layar: {
    // ===== FKTP =====
    "f-nilai": {
      id: "f-nilai",
      judul: "Nilai derajat serangan (FKTP)",
      konten: [
        { jenis: "teks", teks: "Nilai derajat serangan dan cari riwayat asma risiko tinggi." },
        { jenis: "poin", poin: KRITERIA },
      ],
      tombol: [
        { label: "Ringan\u2013Sedang", tujuan: "f-rs", nada: "utama" },
        { label: "Berat", tujuan: "f-rujuk", nada: "bahaya" },
        { label: "Ancaman henti napas", tujuan: "f-rujuk", nada: "bahaya" },
      ],
    },
    "f-rs": {
      id: "f-rs",
      judul: "Tata laksana Ringan\u2013Sedang (FKTP)",
      derajat: "ringan-sedang",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "oksigen" },
        { jenis: "dosis", obatId: "salbutamolMDI" },
        { jenis: "dosis", obatId: "salbutamolNeb" },
        {
          jenis: "poin",
          poin: [
            "SABA dapat diulang sampai 3\u00d7 tiap 20 menit dalam 1 jam.",
            "Pada pemberian ke-3, pertimbangkan kombinasi SABA + ipratropium bromida.",
          ],
        },
        { jenis: "dosis", obatId: "ipratropium" },
        { jenis: "dosis", obatId: "prednison" },
        {
          jenis: "poin",
          poin: [
            "Steroid oral selama 3\u20135 hari (tanpa tapering). Bila tidak memungkinkan oral, berikan IV.",
            "Pilihan steroid lain (Lampiran 1, Tabel 1): metilprednisolon / deksametason / hidrokortison.",
          ],
        },
      ],
      tombol: [{ label: "Lanjut: nilai respons dalam 1 jam", tujuan: "f-eval", nada: "utama" }],
    },
    "f-eval": {
      id: "f-eval",
      judul: "Nilai respons terapi (FKTP)",
      timerMenit: 60,
      konten: [
        {
          jenis: "teks",
          teks: "Lanjutkan SABA jika diperlukan. Nilai respons dalam 1 jam berikutnya (atau lebih cepat bila perlu).",
        },
      ],
      tombol: [
        { label: "Membaik", tujuan: "f-pulang", nada: "utama" },
        { label: "Memburuk / tidak respons", tujuan: "f-rujuk", nada: "bahaya" },
      ],
    },
    "f-pulang": {
      id: "f-pulang",
      judul: "Membaik \u2014 siapkan rawat jalan",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Sebelum dipulangkan: gejala membaik, SpO\u2082 >94% (udara kamar), PEF membaik 60\u201380% nilai prediksi/terbaik.",
          ],
        },
        {
          jenis: "poin",
          poin: [
            "Obat pereda: lanjut sampai gejala reda.",
            "Obat pengendali: dimulai / dinaikkan sesuai derajat kekerapan asma.",
            "Steroid oral: lanjutkan hingga 3\u20135 hari.",
            "Kunjungan ulang dalam 3\u20135 hari.",
          ],
        },
      ],
      tombol: [],
    },
    "f-rujuk": {
      id: "f-rujuk",
      judul: "Rujuk ke rumah sakit",
      nada: "bahaya",
      ringkasan: true,
      konten: [
        { jenis: "peringatan", teks: "Rujuk ke rumah sakit. Sambil menunggu, lakukan terapi berikut:" },
        { jenis: "dosis", obatId: "oksigen" },
        { jenis: "poin", poin: ["Nebulisasi SABA + ipratropium bromida."] },
        { jenis: "dosis", obatId: "ipratropium" },
        { jenis: "dosis", obatId: "metilprednisolonIV" },
        {
          jenis: "poin",
          poin: ["Kortikosteroid sistemik 1\u20132 mg/kgBB/hari (maks 40 mg) \u2014 IV bila tidak dapat oral."],
        },
      ],
      tombol: [{ label: "Lihat alur Rumah Sakit", tujuan: "r-nilai", nada: "biasa" }],
    },

    // ===== RUMAH SAKIT =====
    "r-nilai": {
      id: "r-nilai",
      judul: "Nilai derajat serangan (Rumah Sakit)",
      konten: [
        { jenis: "teks", teks: "Nilai derajat serangan dan cari riwayat asma risiko tinggi." },
        { jenis: "poin", poin: KRITERIA },
      ],
      tombol: [
        { label: "Ringan\u2013Sedang", tujuan: "r-rs", nada: "utama" },
        { label: "Berat", tujuan: "r-berat", nada: "bahaya" },
        { label: "Ancaman henti napas", tujuan: "r-ancaman", nada: "bahaya" },
      ],
    },
    "r-rs": {
      id: "r-rs",
      judul: "Tata laksana Ringan\u2013Sedang (RS)",
      derajat: "ringan-sedang",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "oksigen" },
        { jenis: "dosis", obatId: "salbutamolNeb" },
        {
          jenis: "poin",
          poin: ["SABA inhaler atau nebulizer.", "Pertimbangkan ipratropium bromida bila SABA tidak respons."],
        },
        { jenis: "dosis", obatId: "ipratropium" },
        { jenis: "dosis", obatId: "prednison" },
        { jenis: "poin", poin: ["Kortikosteroid sistemik oral/IV, atau kortikosteroid inhalasi dosis tinggi."] },
        { jenis: "dosis", obatId: "kiDosisTinggi" },
      ],
      tombol: [
        { label: "Nilai berkala (spirometri/PEF 1 jam)", tujuan: "r-eval", nada: "utama" },
        { label: "Jika memburuk", tujuan: "r-berat", nada: "bahaya" },
      ],
    },
    "r-berat": {
      id: "r-berat",
      judul: "Tata laksana Berat (RS)",
      derajat: "berat",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "oksigen" },
        { jenis: "dosis", obatId: "salbutamolNeb" },
        { jenis: "dosis", obatId: "ipratropium" },
        { jenis: "dosis", obatId: "metilprednisolonIV" },
        {
          jenis: "poin",
          poin: [
            "Kortikosteroid sistemik IV.",
            "Pertimbangkan kortikosteroid inhalasi dosis tinggi.",
            "Jika tidak respons, pertimbangkan aminofilin dan/atau MgSO\u2084 IV.",
          ],
        },
        { jenis: "dosis", obatId: "kiDosisTinggi" },
        { jenis: "dosis", obatId: "aminofilin" },
        { jenis: "dosis", obatId: "mgso4" },
      ],
      tombol: [
        { label: "Nilai berkala (spirometri/PEF 1 jam)", tujuan: "r-eval", nada: "utama" },
        { label: "Jika memburuk", tujuan: "r-ancaman", nada: "bahaya" },
      ],
    },
    "r-ancaman": {
      id: "r-ancaman",
      judul: "Ancaman henti napas (RS) \u2014 siapkan ICU",
      derajat: "ancaman",
      nada: "bahaya",
      ringkasan: true,
      konten: [
        { jenis: "peringatan", teks: "Siapkan perawatan ICU. Siapkan intubasi bila diperlukan." },
        { jenis: "dosis", obatId: "oksigen" },
        { jenis: "poin", poin: ["Nebulisasi SABA + ipratropium bromida."] },
        { jenis: "dosis", obatId: "ipratropium" },
        { jenis: "dosis", obatId: "metilprednisolonIV" },
        { jenis: "dosis", obatId: "kiDosisTinggi" },
        { jenis: "dosis", obatId: "aminofilin" },
        { jenis: "dosis", obatId: "mgso4" },
      ],
      tombol: [{ label: "Nilai berkala (spirometri/PEF 1 jam)", tujuan: "r-eval", nada: "utama" }],
    },
    "r-eval": {
      id: "r-eval",
      judul: "Nilai kondisi klinis (RS)",
      timerMenit: 60,
      konten: [
        {
          jenis: "teks",
          teks: "Nilai kondisi klinis secara berkala. Periksa spirometri/PEF 1 jam setelah terapi awal.",
        },
      ],
      tombol: [
        { label: "FEV1/PEF 60\u201380% + ada perbaikan (Sedang)", tujuan: "r-pulang", nada: "utama" },
        { label: "FEV1/PEF <60% + tidak ada perbaikan (Berat)", tujuan: "r-berat", nada: "bahaya" },
      ],
    },
    "r-pulang": {
      id: "r-pulang",
      judul: "Sedang \u2014 pertimbangkan rawat jalan",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Ada perbaikan gejala dengan FEV1/PEF 60\u201380%.",
            "Pertimbangkan rawat jalan.",
            "Obat pengendali dimulai/dinaikkan; steroid oral 3\u20135 hari; kontrol 3\u20135 hari.",
          ],
        },
      ],
      tombol: [],
    },
  },
};
