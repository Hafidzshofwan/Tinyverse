import type { Alur } from "./tipe";

// Sumber: PNPK Diagnosis & Tata Laksana Infeksi Dengue pada Anak, Kemenkes RI 2021
// (mengadopsi algoritma WHO Dengue Guidelines 2009, Gambar 6–10).
// Model alur: tanpaSetting — satu triase langsung membagi ke Grup A / B / C.
// Grup C (dengue berat / syok) menyusul pada tahap berikutnya.

const WARNING_SIGNS: string[] = [
  "Nyeri abdomen berat atau nyeri tekan.",
  "Muntah terus-menerus.",
  "Perdarahan mukosa.",
  "Pembesaran hepar >2 cm.",
  "Akumulasi cairan klinis (asites / efusi pleura).",
  "Letargi atau gelisah.",
  "Peningkatan Ht bersamaan dengan penurunan cepat jumlah trombosit.",
];

const MAGIC_TOUCH =
  "Nilai ulang status hemodinamik — \u201c5-in-1 magic touch\u201d (CCTV-R): warna (colour), capillary refill time, suhu akral (temperature), volume nadi, laju nadi (rate), dan volume urin.";

export const DBD: Alur = {
  id: "dbd",
  nama: "Demam Berdarah Dengue",
  sumber:
    "PNPK Diagnosis & Tata Laksana Infeksi Dengue pada Anak, Kemenkes RI 2021 (algoritma WHO 2009, Gambar 6\u201310)",
  tanpaSetting: true,
  mulai: { fktp: "penilaian", rs: "penilaian" },
  layar: {
    // ===== ALUR UTAMA — PENILAIAN & KLASIFIKASI (Gambar 6) =====
    penilaian: {
      id: "penilaian",
      judul: "Penilaian & Klasifikasi",
      nada: "waspada",
      konten: [
        {
          jenis: "gambar",
          src: "/assets/alur/dbd-utama.png",
          keterangan: "Gambar 6 — Alur penilaian & klasifikasi dengue (Grup A/B/C).",
        },
        {
          jenis: "teks",
          teks: "Diagnosis — tinggal di / bepergian ke area endemik disertai demam dan dua kriteria berikut:",
        },
        {
          jenis: "poin",
          poin: [
            "Mual dan muntah.",
            "Ruam.",
            "Nyeri dan pegal (nyeri kepala, nyeri mata, pegal otot, atau nyeri sendi).",
            "Tanda bahaya.",
            "Positif tes turniket.",
            "Leukopenia.",
          ],
        },
        { jenis: "teks", teks: "Warning signs yang harus dinilai:" },
        { jenis: "poin", poin: WARNING_SIGNS },
        {
          jenis: "teks",
          teks: "Tentukan klasifikasi pasien untuk menentukan tata laksana:",
        },
      ],
      tombol: [
        { label: "Grup A — tidak ada warning sign", tujuan: "grup-a", nada: "utama" },
        { label: "Grup B — warning sign / kondisi penyerta", tujuan: "grup-b", nada: "utama" },
        {
          label: "Grup C — dengue berat (syok / perdarahan berat / gagal organ)",
          tujuan: "grup-c",
          nada: "bahaya",
        },
      ],
    },

    // ===== GRUP A — RAWAT JALAN (Gambar 7) =====
    "grup-a": {
      id: "grup-a",
      judul: "Grup A — Rawat Jalan",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "gambar",
          src: "/assets/alur/dbd-grup-a.png",
          keterangan: "Gambar 7 — Alur Grup A: rawat jalan.",
        },
        {
          jenis: "teks",
          teks: "Boleh rawat jalan bila pasien masih dapat \u201cminum cukup untuk berkemih cukup\u201d dan memenuhi SELURUH kriteria:",
        },
        {
          jenis: "poin",
          poin: [
            "Intake: mendapatkan volume asupan oral yang adekuat.",
            "Output: buang air kecil setidaknya sekali dalam 4\u20136 jam.",
            "Tidak ada warning signs.",
            "Hematokrit dan status hemodinamik stabil.",
            "Tidak ada kondisi penyerta lainnya.",
          ],
        },
        { jenis: "teks", teks: "Terapi suportif di rumah:" },
        { jenis: "dosis", obatId: "parasetamol" },
        {
          jenis: "poin",
          poin: [
            "Cairan oral cukup: oralit, jus buah, air, sup, ASI/susu.",
            "Hindari NSAID / aspirin / ibuprofen — meningkatkan risiko perdarahan.",
            "Kompres hangat & istirahat cukup.",
          ],
        },
        { jenis: "teks", teks: "Berikan pedoman sebelum pasien pulang:" },
        {
          jenis: "poin",
          poin: [
            "Follow up setiap hari.",
            "Lakukan pemeriksaan darah lengkap berulang (Hb/Ht/trombosit).",
            "Identifikasi awal warning signs.",
          ],
        },
        {
          jenis: "peringatan",
          teks: "Segera kembali bila muncul warning sign: nyeri perut hebat, muntah terus-menerus, perdarahan, lemas/gelisah, akral dingin, atau tidak berkemih dalam 4\u20136 jam.",
        },
      ],
      tombol: [],
    },

    // ===== GRUP B — RAWAT INAP (1 layar, 2 tombol) =====
    "grup-b": {
      id: "grup-b",
      judul: "Grup B — Rawat Inap / Observasi",
      nada: "waspada",
      konten: [
        {
          jenis: "teks",
          teks: "Pasien Grup B memerlukan rawat inap. Pilih kategori pasien untuk melihat tata laksana cairannya:",
        },
      ],
      tombol: [
        {
          label: "Kondisi penyerta (tanpa warning sign)",
          tujuan: "grup-b-penyerta",
          nada: "utama",
        },
        { label: "Dengan warning sign (tidak syok)", tujuan: "grup-b-warning", nada: "utama" },
      ],
    },

    // ===== GRUP B1 — KONDISI PENYERTA (Gambar 8) =====
    "grup-b-penyerta": {
      id: "grup-b-penyerta",
      judul: "Grup B — Kondisi Penyerta (tanpa warning sign)",
      nada: "waspada",
      ringkasan: true,
      konten: [
        {
          jenis: "gambar",
          src: "/assets/alur/dbd-grup-b-penyerta.png",
          keterangan: "Gambar 8 — Alur Grup B: kondisi penyerta tanpa warning sign.",
        },
        { jenis: "teks", teks: "Kondisi pasien yang memerlukan perawatan dini:" },
        {
          jenis: "poin",
          poin: [
            "Bayi.",
            "Diabetes melitus.",
            "Penyakit jantung kongenital / gagal jantung.",
            "Kelainan hati kronik.",
            "Gagal ginjal kronik.",
            "Penyakit paru kronik.",
            "Penyakit hemolitik (defisiensi G6PD, talasemia).",
            "Kondisi sosial buruk (tinggal sendiri, tidak ada transportasi).",
          ],
        },
        {
          jenis: "peringatan",
          teks: "Masuk perawatan secara dini (pada fase demam). Monitor hematokrit, glukosa, dan tekanan darah.",
        },
        { jenis: "teks", teks: "Terapi cairan:" },
        {
          jenis: "poin",
          poin: [
            "Anjurkan pemberian cairan oral.",
            "Jika cairan oral tidak dapat ditoleransi, mulai cairan IV (NaCl 0,9% atau Ringer laktat) dengan atau tanpa dekstrosa pada kecepatan rumatan.",
            "Jika pasien dapat minum oral setelah beberapa jam cairan IV, kurangi cairan IV secara bertahap untuk menghindari kelebihan cairan.",
          ],
        },
        { jenis: "teks", teks: "Monitor:" },
        {
          jenis: "poin",
          poin: [
            "Pola suhu, terutama saat awal penurunan suhu yang mencapai normal.",
            "Status hidrasi: intake oral, cairan IV, output urin dan muntah.",
            "Kadar hematokrit, jumlah leukosit, dan trombosit.",
          ],
        },
      ],
      tombol: [],
    },

    // ===== GRUP B2 — WARNING SIGNS, TIDAK SYOK (Gambar 9) =====
    "grup-b-warning": {
      id: "grup-b-warning",
      judul: "Grup B — Warning Signs (tidak syok)",
      nada: "waspada",
      konten: [
        {
          jenis: "gambar",
          src: "/assets/alur/dbd-grup-b-warning-1.png",
          keterangan: "Gambar 9 — Alur Grup B: warning signs, tidak syok (tata laksana cairan).",
        },
        {
          jenis: "poin",
          poin: [
            "Pemeriksaan awal darah lengkap (Ht dasar).",
            "Monitor balans cairan masuk & keluar, serta motivasi asupan cairan per oral.",
            "Monitor tanda vital setiap 4 jam atau lebih sering.",
          ],
        },
        { jenis: "poin", poin: [MAGIC_TOUCH] },
        { jenis: "teks", teks: "Apakah asupan cairan oral pada pasien cukup?" },
      ],
      tombol: [
        { label: "Ya — asupan cairan oral adekuat", tujuan: "grup-b-warning-oral", nada: "utama" },
        {
          label: "Tidak — asupan oral tidak adekuat",
          tujuan: "grup-b-warning-iv",
          nada: "utama",
        },
      ],
    },
    "grup-b-warning-oral": {
      id: "grup-b-warning-oral",
      judul: "Asupan cairan oral adekuat",
      nada: "waspada",
      konten: [
        {
          jenis: "poin",
          poin: [
            "Lanjutkan monitoring tanda vital.",
            "Observasi awal tanda syok.",
            "Observasi warning signs dari dengue berat.",
          ],
        },
      ],
      tombol: [
        {
          label: "Asupan oral menurun / muncul warning sign → mulai cairan IV",
          tujuan: "grup-b-warning-iv",
          nada: "utama",
        },
      ],
    },
    "grup-b-warning-iv": {
      id: "grup-b-warning-iv",
      judul: "Cairan kristaloid intravena",
      nada: "waspada",
      timerMenit: 120,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Cek hematokrit (Ht).",
            "Beri cairan kristaloid intravena (Normal saline / Ringer laktat).",
          ],
        },
        { jenis: "teks", teks: "Berikan cairan kristaloid isotonis dengan cara:" },
        { jenis: "dosis", obatId: "kristaloid5_7" },
        { jenis: "dosis", obatId: "kristaloid3_5" },
        { jenis: "poin", poin: ["Cek kembali Ht dan periksa ulang status klinis pasien.", MAGIC_TOUCH] },
      ],
      tombol: [
        {
          label: "Klinis stabil & Ht tanpa perubahan / minimal",
          tujuan: "grup-b-warning-stabil",
          nada: "utama",
        },
        {
          label: "Tidak membaik / Ht meningkat",
          tujuan: "grup-b-warning-tidak-membaik",
          nada: "bahaya",
        },
      ],
    },
    "grup-b-warning-stabil": {
      id: "grup-b-warning-stabil",
      judul: "Klinis stabil — rumatan & penyapihan cairan",
      nada: "baik",
      ringkasan: true,
      timerMenit: 240,
      konten: [
        { jenis: "teks", teks: "Klinis stabil dan tidak ada perubahan atau perubahan Ht minimal:" },
        { jenis: "dosis", obatId: "kristaloid2_3" },
        { jenis: "poin", poin: ["Cek kembali Ht.", "Periksa ulang status klinis pasien.", MAGIC_TOUCH] },
        {
          jenis: "teks",
          teks: "Jika cairan masuk & output urin adekuat, hematokrit turun mendekati normal (atau sedikit di bawah normal) tetapi klinis stabil, maka:",
        },
        {
          jenis: "poin",
          poin: [
            "Kurangi cairan kristaloid isotonis.",
            "Lanjutkan pemantauan sampai fase kritis terlewati.",
            "Hentikan IVFD dalam 24\u201348 jam.",
          ],
        },
      ],
      tombol: [],
    },
    "grup-b-warning-tidak-membaik": {
      id: "grup-b-warning-tidak-membaik",
      judul: "Tidak membaik setelah cairan pertama",
      nada: "bahaya",
      timerMenit: 120,
      konten: [
        {
          jenis: "gambar",
          src: "/assets/alur/dbd-grup-b-warning-2.png",
          keterangan: "Gambar 10 — Alur Grup B: warning signs, tidak membaik setelah cairan pertama.",
        },
        {
          jenis: "teks",
          teks: "Perbarui tanda vital & perhatikan peningkatan Ht secara cepat. Bila Ht meningkat, naikkan kristaloid isotonis:",
        },
        { jenis: "dosis", obatId: "kristaloid5_10" },
        { jenis: "poin", poin: ["Cek kembali Ht dan periksa ulang status klinis pasien.", MAGIC_TOUCH] },
        { jenis: "teks", teks: "Apakah pasien membaik?" },
      ],
      tombol: [
        {
          label: "Membaik → sapih cairan bertahap",
          tujuan: "grup-b-warning-membaik",
          nada: "utama",
        },
        {
          label: "Berkembang menjadi syok terkompensasi / hipotensi → Grup C",
          tujuan: "grup-c",
          nada: "bahaya",
        },
      ],
    },
    "grup-b-warning-membaik": {
      id: "grup-b-warning-membaik",
      judul: "Membaik — penyapihan cairan bertahap",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "teks",
          teks: "Kurangi cairan kristaloid isotonis secara bertahap. Periksa ulang status klinis sebelum tiap penurunan:",
        },
        { jenis: "dosis", obatId: "kristaloid5_10" },
        { jenis: "dosis", obatId: "kristaloid3_5" },
        { jenis: "dosis", obatId: "kristaloid2_3" },
        {
          jenis: "poin",
          poin: [
            "Lanjutkan pemantauan sampai fase kritis terlewati.",
            "Hentikan IVFD dalam 24\u201348 jam.",
          ],
        },
      ],
      tombol: [],
    },

    // ===== GRUP C — PLACEHOLDER (menyusul) =====
    "grup-c": {
      id: "grup-c",
      judul: "Grup C — Dengue Berat",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Grup C (dengue berat: syok/DSS, perdarahan berat, atau gagal organ) memerlukan manajemen darurat & resusitasi cairan.",
        },
        {
          jenis: "teks",
          teks: "Alur tata laksana Grup C sedang disiapkan dan akan ditambahkan pada tahap berikutnya.",
        },
      ],
      tombol: [],
    },
  },
};
