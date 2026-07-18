import type { Alur } from "./tipe";

// Sumber: Pedoman Pelayanan Medis, IDAI 2022.
// Alur ini adaptasi teks (bukan reproduksi gambar asli) untuk kegawatan
// Ketoasidosis Diabetik (KAD) pada anak.
export const KAD: Alur = {
  id: "kad",
  nama: "Ketoasidosis Diabetik (KAD)",
  sumber: "Pedoman Pelayanan Medis, IDAI 2022",
  tanpaSetting: true,
  mulai: { fktp: "konfirmasi", rs: "konfirmasi" },
  layar: {
    konfirmasi: {
      id: "konfirmasi",
      judul: "Konfirmasi Ketoasidosis Diabetikum",
      nada: "waspada",
      konten: [
        { jenis: "teks", teks: "Trias diagnosis KAD:" },
        {
          jenis: "poin",
          poin: [
            "Hiperglikemia: GDS >200 mg/dL.",
            "Asidosis: pH <7,3 ATAU HCO\u2083\u207b <15 mmol/L.",
            "Ketonemia / ketonuria.",
          ],
        },
        { jenis: "teks", teks: "Konteks klinis pendukung:" },
        {
          jenis: "poin",
          poin: [
            "Poliuria, polidipsi, berat badan turun.",
            "Napas Kussmaul, muntah / nyeri perut.",
            "Penurunan kesadaran; faktor presipitasi (infeksi / demam).",
            "Riwayat kepatuhan insulin (DM lama).",
            "Derajat dehidrasi: \u22645% / 6\u201310% / >10% (dengan / tanpa syok).",
          ],
        },
      ],
      tombol: [
        {
          label: "Lanjut: Resusitasi cairan",
          tujuan: "resusitasi",
          nada: "utama",
        },
      ],
    },

    resusitasi: {
      id: "resusitasi",
      judul: "1 \u00b7 Resusitasi cairan",
      nada: "waspada",
      konten: [
        {
          jenis: "teks",
          teks: "Nilai lebih dulu: apakah ada renjatan / syok?",
        },
      ],
      tombol: [
        { label: "Ya, ada syok", tujuan: "r-syok", nada: "bahaya" },
        { label: "Tidak ada syok", tujuan: "r-rehidrasi", nada: "utama" },
      ],
    },
    "r-syok": {
      id: "r-syok",
      judul: "Resusitasi cairan \u00b7 Ada syok",
      nada: "bahaya",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "naclBolusKad" },
        {
          jenis: "poin",
          poin: [
            "Ulang bolus sampai renjatan teratasi.",
            "Kurangi total cairan rehidrasi dengan volume yang sudah dipakai untuk atasi syok.",
          ],
        },
      ],
      tombol: [
        {
          label: "Syok teratasi \u2014 mulai rehidrasi 48 jam",
          tujuan: "r-rehidrasi",
          nada: "utama",
        },
      ],
    },
    "r-rehidrasi": {
      id: "r-rehidrasi",
      judul: "Resusitasi cairan \u00b7 Rehidrasi 48 jam",
      ringkasan: true,
      konten: [
        {
          jenis: "teks",
          teks: "Hitung kebutuhan cairan untuk 48 jam (defisit + rumatan).",
        },
        { jenis: "teks", teks: "Rumus kebutuhan cairan KAD:" },
        {
          jenis: "poin",
          poin: [
            "1. Derajat dehidrasi = \u2026% (A).",
            "2. Defisit cairan = A \u00d7 BB(kg) \u00d7 1000 = B mL.",
            "3. Kebutuhan rumatan 48 jam = C mL.",
            "4. Total 48 jam = (B + C) mL.",
            "5. Tetesan/jam = (B + C) \u00f7 48 = \u2026 mL/jam.",
          ],
        },
        { jenis: "teks", teks: "Rumatan/hari (Holliday-Segar):" },
        {
          jenis: "poin",
          poin: [
            "3\u201310 kg \u2192 100 mL/kg.",
            ">10\u201320 kg \u2192 1000 mL + 50 mL/kg tiap kg >10.",
            ">20 kg \u2192 1500 mL + 20 mL/kg tiap kg >20.",
          ],
        },
        { jenis: "teks", teks: "Kebutuhan cairan rehidrasi (24 jam):" },
        {
          jenis: "poin",
          poin: [
            "Bayi \u2014 ringan 5%: 50 mL/kg/hari; sedang 10%: 100 mL/kg/hari; berat 15%: 150 mL/kg/hari.",
            "Anak \u2014 ringan 3%: 30 mL/kg/hari; sedang 6%: 60 mL/kg/hari; berat 9%: 90 mL/kg/hari.",
          ],
        },
        {
          jenis: "peringatan",
          teks: "Maks. 4 L/m\u00b2/hari (risiko edema otak). Balans cairan tiap 4 jam; pasang kateter urin bila kesadaran menurun.",
        },
        {
          jenis: "poin",
          poin: [
            "Bila GD 250\u2013300 mg/dL \u2192 tambahkan dekstrosa 5% (1:1 dengan NaCl 0,9%); bila perlu D10/D12,5% \u2192 \u201ctwo-bag system\u201d untuk cegah hipoglikemia.",
          ],
        },
      ],
      tombol: [{ label: "Lanjut: Insulin", tujuan: "insulin", nada: "utama" }],
    },

    insulin: {
      id: "insulin",
      judul: "2 \u00b7 Insulin",
      ringkasan: true,
      konten: [
        {
          jenis: "peringatan",
          teks: "Mulai insulin SETELAH syok teratasi & resusitasi cairan dimulai.",
        },
        { jenis: "dosis", obatId: "insulinReguler" },
        {
          jenis: "poin",
          poin: [
            "Jalur IV terpisah dari cairan.",
            "Penurunan GD \u2264100 mg/dL/jam; pertahankan GD 200\u2013250 mg/dL.",
            "Pertahankan sampai KAD teratasi; jangan hentikan mendadak (turunkan bertahap, mis. 0,05 U/kgBB/jam).",
          ],
        },
      ],
      tombol: [
        {
          label: "Lanjut: Koreksi asam-basa & elektrolit",
          tujuan: "koreksi",
          nada: "utama",
        },
      ],
    },

    koreksi: {
      id: "koreksi",
      judul: "3 \u00b7 Koreksi asam-basa & elektrolit",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "kaliumKad" },
        { jenis: "dosis", obatId: "bikarbonatKad" },
        {
          jenis: "teks",
          teks: "Natrium terkoreksi = Na\u207a terukur + [1,6 \u00d7 (GD \u2212 100)/100].",
        },
        {
          jenis: "poin",
          poin: [
            "Na terkoreksi <125 mEq/L \u2192 koreksi natrium.",
            "Na terkoreksi >150 mEq/L \u2192 rehidrasi dalam >48 jam.",
          ],
        },
      ],
      tombol: [
        {
          label: "Lanjut: Pemantauan berkala",
          tujuan: "pantau",
          nada: "utama",
        },
      ],
    },

    pantau: {
      id: "pantau",
      judul: "4 \u00b7 Pemantauan berkala",
      konten: [
        {
          jenis: "poin",
          poin: [
            "TTV (GCS, nadi, napas, TD, suhu) tiap jam.",
            "GD kapiler tiap jam (konfirmasi GD vena).",
            "AGD, elektrolit, keton, ureum tiap 2\u20134 jam.",
            "Balans cairan tiap 4 jam.",
          ],
        },
        {
          jenis: "teks",
          teks: "Kriteria KAD teratasi: pH >7,30 \u00b7 HCO\u2083\u207b >15 mmol/L \u00b7 anion gap menurun. KAD sudah teratasi?",
        },
      ],
      tombol: [
        { label: "Ya, KAD teratasi", tujuan: "teratasi", nada: "utama" },
        { label: "Belum teratasi", tujuan: "belum", nada: "bahaya" },
      ],
    },
    teratasi: {
      id: "teratasi",
      judul: "KAD teratasi \u00b7 Turunkan insulin bertahap",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Turunkan insulin bertahap (mis. 0,05 U/kgBB/jam).",
            "JANGAN hentikan insulin mendadak.",
            "Transisi ke insulin subkutan bila anak sadar & dapat makan/minum.",
          ],
        },
      ],
      tombol: [],
    },
    belum: {
      id: "belum",
      judul: "KAD belum teratasi \u00b7 Lanjutkan insulin",
      nada: "waspada",
      konten: [
        {
          jenis: "poin",
          poin: [
            "Lanjutkan insulin 0,1 U/kgBB/jam + koreksi cairan/elektrolit.",
            "Evaluasi ulang penyebab & respons terapi.",
          ],
        },
      ],
      tombol: [
        { label: "Evaluasi ulang pemantauan", tujuan: "pantau", nada: "utama" },
      ],
    },
  },
};
