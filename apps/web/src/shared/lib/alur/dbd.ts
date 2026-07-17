import type { Alur } from "./tipe";

// Sumber: PNPK Diagnosis & Tata Laksana Infeksi Dengue pada Anak, Kemenkes RI 2021
// (mengadopsi algoritma WHO Dengue Guidelines 2009, Gambar 6–12).
// Model alur: tanpaSetting — satu triase langsung membagi ke Grup A / B / C.
// Grup C (dengue berat/syok): Gambar 11 (syok terkompensasi) & Gambar 12 (syok hipotensi).

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

const MAKS_RESUS =
  "Total resusitasi cairan kristaloid/koloid maksimal 20–40 ml/kgBB, atau 40–60 ml/kgBB pada fasilitas dengan alat pemantauan hemodinamik.";

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
      gambarAlur: {
        src: "/assets/alur/dbd-utama.png",
        keterangan:
          "Gambar 6 — Alur penilaian & klasifikasi dengue (Grup A/B/C).",
        toggle: true,
      },
      konten: [
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
        {
          label: "Grup A — tidak ada warning sign",
          tujuan: "grup-a",
          nada: "utama",
        },
        {
          label: "Grup B — warning sign / kondisi penyerta",
          tujuan: "grup-b",
          nada: "utama",
        },
        {
          label:
            "Grup C — dengue berat (syok / perdarahan berat / gagal organ)",
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
      gambarAlur: {
        src: "/assets/alur/dbd-grup-a.png",
        keterangan: "Gambar 7 — Alur Grup A: rawat jalan.",
      },
      konten: [
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
        {
          label: "Dengan warning sign (tidak syok)",
          tujuan: "grup-b-warning",
          nada: "utama",
        },
      ],
    },

    // ===== GRUP B1 — KONDISI PENYERTA (Gambar 8) =====
    "grup-b-penyerta": {
      id: "grup-b-penyerta",
      judul: "Grup B — Kondisi Penyerta (tanpa warning sign)",
      nada: "waspada",
      ringkasan: true,
      gambarAlur: {
        src: "/assets/alur/dbd-grup-b-penyerta.png",
        keterangan:
          "Gambar 8 — Alur Grup B: kondisi penyerta tanpa warning sign.",
      },
      konten: [
        {
          jenis: "teks",
          teks: "Kondisi pasien yang memerlukan perawatan dini:",
        },
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
      gambarAlur: {
        src: "/assets/alur/dbd-grup-b-warning-1.png",
        keterangan:
          "Gambar 9 — Alur Grup B: warning signs, tidak syok (tata laksana cairan).",
      },
      konten: [
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
        {
          label: "Ya — asupan cairan oral adekuat",
          tujuan: "grup-b-warning-oral",
          nada: "utama",
        },
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
        {
          jenis: "teks",
          teks: "Berikan cairan kristaloid isotonis dengan cara:",
        },
        { jenis: "dosis", obatId: "kristaloid5_7" },
        { jenis: "dosis", obatId: "kristaloid3_5" },
        {
          jenis: "poin",
          poin: [
            "Cek kembali Ht dan periksa ulang status klinis pasien.",
            MAGIC_TOUCH,
          ],
        },
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
        {
          jenis: "teks",
          teks: "Klinis stabil dan tidak ada perubahan atau perubahan Ht minimal:",
        },
        { jenis: "dosis", obatId: "kristaloid2_3" },
        {
          jenis: "poin",
          poin: [
            "Cek kembali Ht.",
            "Periksa ulang status klinis pasien.",
            MAGIC_TOUCH,
          ],
        },
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
      gambarAlur: {
        src: "/assets/alur/dbd-grup-b-warning-2.png",
        keterangan:
          "Gambar 10 — Alur Grup B: warning signs, tidak membaik setelah cairan pertama.",
      },
      konten: [
        {
          jenis: "teks",
          teks: "Perbarui tanda vital & perhatikan peningkatan Ht secara cepat. Bila Ht meningkat, naikkan kristaloid isotonis:",
        },
        { jenis: "dosis", obatId: "kristaloid5_10" },
        {
          jenis: "poin",
          poin: [
            "Cek kembali Ht dan periksa ulang status klinis pasien.",
            MAGIC_TOUCH,
          ],
        },
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

    // ===== GRUP C — DENGUE BERAT / SYOK (Gambar 11 & 12) =====
    "grup-c": {
      id: "grup-c",
      judul: "Grup C — Manajemen Darurat (Dengue Berat)",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Dengue berat: syok (DSS), perdarahan berat, atau gangguan organ berat. Butuh resusitasi cairan segera & perawatan di fasilitas yang memadai.",
        },
        { jenis: "teks", teks: "Langkah awal saat pasien masuk rumah sakit:" },
        {
          jenis: "poin",
          poin: [
            "Lakukan penilaian A-B-C (airway, breathing, circulation) dan berikan oksigenasi.",
            "Tentukan hematokrit (Ht) dasar dan periksa fungsi organ.",
            "Pantau ketat balans cairan masuk & keluar.",
            "Periksa status hemodinamik secara berkala.",
          ],
        },
        { jenis: "poin", poin: [MAGIC_TOUCH] },
        { jenis: "peringatan", teks: MAKS_RESUS },
        {
          jenis: "teks",
          teks: "Pilih derajat syok pasien untuk melihat algoritme resusitasi cairan:",
        },
      ],
      tombol: [
        {
          label: "Syok terkompensasi (tekanan darah masih terukur)",
          tujuan: "grup-c-terkompensasi",
          nada: "bahaya",
        },
        {
          label: "Syok hipotensi (tekanan darah tidak terukur)",
          tujuan: "grup-c-hipotensif",
          nada: "bahaya",
        },
      ],
    },

    // ----- Gambar 11: Syok terkompensasi -----
    "grup-c-terkompensasi": {
      id: "grup-c-terkompensasi",
      judul: "Syok Terkompensasi — Resusitasi (Kotak A)",
      nada: "bahaya",
      timerMenit: 60,
      gambarAlur: {
        src: "/assets/alur/dbd-grup-c-terkompensasi.png",
        keterangan:
          "Gambar 11 — Grup C: tata laksana emergensi syok terkompensasi.",
        toggle: true,
      },
      konten: [
        {
          jenis: "poin",
          poin: [
            "Tentukan Ht dasar & fungsi organ.",
            "Pantau balans cairan masuk & keluar.",
            "Periksa status hemodinamik tiap 1 jam.",
          ],
        },
        {
          jenis: "teks",
          teks: "Pasien dalam syok terkompensasi. Mulai resusitasi cairan:",
        },
        { jenis: "dosis", obatId: "bolusKristaloid10" },
        {
          jenis: "poin",
          poin: ["Periksa ulang status klinis pasien.", MAGIC_TOUCH],
        },
        { jenis: "peringatan", teks: MAKS_RESUS },
        { jenis: "teks", teks: "Apakah status hemodinamik membaik?" },
      ],
      tombol: [
        {
          label: "Ya — hemodinamik membaik (Kotak B)",
          tujuan: "grup-c-terkompensasi-membaik",
          nada: "utama",
        },
        {
          label: "Tidak — hemodinamik tidak membaik (Kotak C)",
          tujuan: "grup-c-terkompensasi-tidak-membaik",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-terkompensasi-membaik": {
      id: "grup-c-terkompensasi-membaik",
      judul: "Kotak B — Hemodinamik membaik, sapih cairan",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "teks",
          teks: "Kurangi cairan kristaloid isotonis secara bertahap. Periksa ulang status klinis sebelum tiap penurunan:",
        },
        { jenis: "dosis", obatId: "kristaloid5_7" },
        { jenis: "dosis", obatId: "kristaloid3_5" },
        { jenis: "dosis", obatId: "kristaloid2_3" },
        {
          jenis: "teks",
          teks: "Jika cairan masuk & output urin adekuat serta Ht mendekati normal tetapi klinis stabil, hentikan cairan kristaloid isotonis. Lanjutkan pemantauan sampai fase kritis terlewati.",
        },
      ],
      tombol: [],
    },
    "grup-c-terkompensasi-tidak-membaik": {
      id: "grup-c-terkompensasi-tidak-membaik",
      judul: "Kotak C — Tidak membaik, periksa ulang Ht",
      nada: "bahaya",
      konten: [
        {
          jenis: "teks",
          teks: "Periksa ulang hematokrit (Ht), lalu tentukan langkah sesuai hasilnya:",
        },
      ],
      tombol: [
        {
          label: "Ht meningkat",
          tujuan: "grup-c-terkompensasi-ht-naik",
          nada: "bahaya",
        },
        {
          label: "Ht menurun",
          tujuan: "grup-c-terkompensasi-ht-turun",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-terkompensasi-ht-naik": {
      id: "grup-c-terkompensasi-ht-naik",
      judul: "Ht meningkat — bolus kedua / koloid",
      nada: "bahaya",
      timerMenit: 60,
      konten: [
        {
          jenis: "teks",
          teks: "Ht meningkat menandakan kebocoran plasma berlanjut. Berikan bolus cairan berikutnya:",
        },
        { jenis: "dosis", obatId: "bolusKristaloidKoloid10_20" },
        {
          jenis: "poin",
          poin: ["Periksa ulang status klinis pasien.", MAGIC_TOUCH],
        },
        { jenis: "peringatan", teks: MAKS_RESUS },
        { jenis: "teks", teks: "Apakah status klinis membaik?" },
      ],
      tombol: [
        {
          label: "Membaik → sapih cairan (Kotak B)",
          tujuan: "grup-c-terkompensasi-membaik",
          nada: "utama",
        },
        {
          label: "Tidak membaik → ulangi Kotak C",
          tujuan: "grup-c-terkompensasi-tidak-membaik",
          nada: "bahaya",
        },
        {
          label: "Berkembang jadi syok hipotensi (Gambar 12)",
          tujuan: "grup-c-hipotensif",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-terkompensasi-ht-turun": {
      id: "grup-c-terkompensasi-ht-turun",
      judul: "Ht menurun — pertimbangkan transfusi",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Ht menurun pada syok yang belum teratasi menandakan perdarahan. Berikan transfusi segera:",
        },
        { jenis: "dosis", obatId: "transfusiPRC5_10" },
        { jenis: "dosis", obatId: "transfusiWRC10_20" },
        {
          jenis: "teks",
          teks: "Setelah transfusi, nilai ulang dan lanjutkan resusitasi (kembali ke Kotak A).",
        },
      ],
      tombol: [
        {
          label: "Kembali ke resusitasi (Kotak A)",
          tujuan: "grup-c-terkompensasi",
          nada: "utama",
        },
      ],
    },

    // ----- Gambar 12: Syok hipotensi -----
    "grup-c-hipotensif": {
      id: "grup-c-hipotensif",
      judul: "Syok Hipotensi — Resusitasi cepat",
      nada: "bahaya",
      timerMenit: 15,
      gambarAlur: {
        src: "/assets/alur/dbd-grup-c-hipotensif.png",
        keterangan:
          "Gambar 12 — Grup C: algoritme manajemen cairan pada syok hipotensi.",
        toggle: true,
      },
      konten: [
        {
          jenis: "poin",
          poin: [
            "Tentukan Ht dasar & fungsi organ.",
            "Pantau balans cairan masuk & keluar.",
            "Periksa status hemodinamik tiap 15 menit.",
          ],
        },
        {
          jenis: "teks",
          teks: "Pasien dalam syok hipotensi. Berikan bolus cairan cepat:",
        },
        { jenis: "dosis", obatId: "bolusKristaloidKoloid20" },
        {
          jenis: "poin",
          poin: ["Periksa ulang status klinis pasien.", MAGIC_TOUCH],
        },
        { jenis: "peringatan", teks: MAKS_RESUS },
        { jenis: "teks", teks: "Apakah status hemodinamik membaik?" },
      ],
      tombol: [
        {
          label: "Ya — hemodinamik membaik (Kotak A)",
          tujuan: "grup-c-hipotensif-membaik",
          nada: "utama",
        },
        {
          label: "Tidak — hemodinamik tidak membaik (Kotak C)",
          tujuan: "grup-c-hipotensif-tidak-membaik",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-hipotensif-membaik": {
      id: "grup-c-hipotensif-membaik",
      judul: "Kotak A → B — Lanjutkan & sapih cairan",
      nada: "baik",
      ringkasan: true,
      timerMenit: 60,
      konten: [
        {
          jenis: "teks",
          teks: "Lanjutkan dengan kristaloid isotonis atau koloid:",
        },
        { jenis: "dosis", obatId: "bolusKristaloid10" },
        {
          jenis: "teks",
          teks: "Jika status klinis membaik, masuk Kotak B — kurangi cairan kristaloid isotonis secara bertahap:",
        },
        { jenis: "dosis", obatId: "kristaloid5_7" },
        { jenis: "dosis", obatId: "kristaloid3_5" },
        { jenis: "dosis", obatId: "kristaloid2_3" },
        {
          jenis: "teks",
          teks: "Jika cairan masuk & output urin adekuat serta Ht mendekati normal, hentikan cairan. Lanjutkan pemantauan sampai fase kritis terlewati.",
        },
      ],
      tombol: [],
    },
    "grup-c-hipotensif-tidak-membaik": {
      id: "grup-c-hipotensif-tidak-membaik",
      judul: "Kotak C — Tidak membaik, periksa ulang Ht",
      nada: "bahaya",
      konten: [
        {
          jenis: "teks",
          teks: "Periksa ulang hematokrit (Ht), lalu tentukan langkah sesuai hasilnya:",
        },
      ],
      tombol: [
        {
          label: "Ht meningkat",
          tujuan: "grup-c-hipotensif-ht-naik",
          nada: "bahaya",
        },
        {
          label: "Ht menurun",
          tujuan: "grup-c-hipotensif-ht-turun",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-hipotensif-ht-naik": {
      id: "grup-c-hipotensif-ht-naik",
      judul: "Ht meningkat — berikan koloid",
      nada: "bahaya",
      konten: [
        {
          jenis: "teks",
          teks: "Ht meningkat: berikan koloid sebagai bolus kedua.",
        },
        { jenis: "dosis", obatId: "koloid10_20" },
        { jenis: "peringatan", teks: MAKS_RESUS },
        {
          jenis: "poin",
          poin: ["Periksa ulang status klinis pasien.", MAGIC_TOUCH],
        },
        { jenis: "teks", teks: "Apakah status klinis membaik?" },
      ],
      tombol: [
        {
          label: "Klinis membaik",
          tujuan: "grup-c-hipotensif-ht-naik-membaik",
          nada: "utama",
        },
        {
          label: "Klinis tidak membaik",
          tujuan: "grup-c-hipotensif-refrakter",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-hipotensif-ht-naik-membaik": {
      id: "grup-c-hipotensif-ht-naik-membaik",
      judul: "Klinis membaik — sapih koloid",
      nada: "baik",
      ringkasan: true,
      konten: [
        { jenis: "teks", teks: "Kurangi koloid secara bertahap:" },
        { jenis: "dosis", obatId: "koloid7_10" },
        {
          jenis: "teks",
          teks: "Jika perbaikan berlanjut, lanjutkan penyapihan cairan seperti Kotak B.",
        },
      ],
      tombol: [
        {
          label: "Lanjut ke penyapihan (Kotak B)",
          tujuan: "grup-c-hipotensif-membaik",
          nada: "utama",
        },
      ],
    },
    "grup-c-hipotensif-refrakter": {
      id: "grup-c-hipotensif-refrakter",
      judul: "Syok belum teratasi — Rangkuman (Gambar 13)",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Status klinis belum membaik setelah koloid. Periksa ulang Ht dan status klinis, lalu kembali ke Kotak C. Ikuti rangkuman tatalaksana severe dengue (Gambar 13).",
        },
        {
          jenis: "poin",
          poin: [
            "Evaluasi perdarahan tersembunyi (mis. rectal toucher, lingkar perut bertambah); bila ada tanda perdarahan lakukan cross-match dan transfusi darah.",
            "Nilai tanda kelebihan cairan (edema, distres napas, JVP meningkat, ronki/B-lines).",
            "Bila syok/hipotensi menetap setelah cairan optimal, mulai vasoaktif/inotropik (Gambar 14): dobutamin 5–10 mcg/kgBB/menit atau epinefrin 0,05–0,3 mcg/kgBB/menit; tambahkan norepinefrin 0,05–0,3 mcg/kgBB/menit bila hipotensi.",
            "Pertimbangkan rawat intensif dan pemantauan hemodinamik.",
          ],
        },
      ],
      tombol: [
        {
          label: "Kembali ke Kotak C",
          tujuan: "grup-c-hipotensif-tidak-membaik",
          nada: "bahaya",
        },
      ],
    },
    "grup-c-hipotensif-ht-turun": {
      id: "grup-c-hipotensif-ht-turun",
      judul: "Ht menurun — transfusi",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Ht menurun pada syok yang belum teratasi menandakan perdarahan. Berikan transfusi segera:",
        },
        { jenis: "dosis", obatId: "transfusiPRC5_10" },
        { jenis: "dosis", obatId: "transfusiWholeBlood10_20" },
        {
          jenis: "teks",
          teks: "Setelah transfusi, nilai ulang dan lanjutkan resusitasi (kembali ke Kotak A).",
        },
      ],
      tombol: [
        {
          label: "Kembali ke resusitasi (Kotak A)",
          tujuan: "grup-c-hipotensif-membaik",
          nada: "utama",
        },
      ],
    },
  },
};
