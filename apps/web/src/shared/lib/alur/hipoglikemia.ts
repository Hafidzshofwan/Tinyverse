import type { Alur } from "./tipe";

// Sumber: PNPK Tata Laksana Diabetes Melitus pada Anak, Kemenkes 2024.
// Alur ini adaptasi teks (bukan reproduksi gambar asli) untuk kegawatan
// hipoglikemia anak: jalur "anak sadar" dan "anak tidak sadar".
export const HIPOGLIKEMIA: Alur = {
  id: "hipoglikemia",
  nama: "Hipoglikemia",
  sumber: "PNPK Tata Laksana Diabetes Melitus pada Anak, Kemenkes 2024",
  tanpaSetting: true,
  mulai: { fktp: "konfirmasi", rs: "konfirmasi" },
  layar: {
    konfirmasi: {
      id: "konfirmasi",
      judul: "Konfirmasi hipoglikemia",
      nada: "waspada",
      konten: [
        {
          jenis: "teks",
          teks: "Hipoglikemia bila glukosa darah \u226470 mg/dL atau terdapat gejala hipoglikemia. Nilai kesadaran & kemampuan menelan anak.",
        },
      ],
      tombol: [
        {
          label: "Anak sadar (dapat menelan)",
          tujuan: "s-oral",
          nada: "utama",
        },
        {
          label: "Anak tidak sadar / kesadaran menurun",
          tujuan: "t-awal",
          nada: "bahaya",
        },
      ],
    },

    // ===== JALUR ANAK SADAR =====
    "s-oral": {
      id: "s-oral",
      judul: "Anak sadar \u00b7 Berikan glukosa oral",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "glukosaOral" },
        {
          jenis: "poin",
          poin: [
            "Contoh: larutan glukosa 40% 2,5 mL/kgBB.",
            "Tablet glukosa (sesuai usia).",
            "Madu / gula dilarutkan dalam air (bila usia >1 tahun).",
          ],
        },
      ],
      tombol: [
        {
          label: "Evaluasi ulang GD (10\u201315 menit)",
          tujuan: "s-eval1",
          nada: "utama",
        },
      ],
    },
    "s-eval1": {
      id: "s-eval1",
      judul: "Evaluasi ulang glukosa darah",
      timerMenit: 15,
      konten: [
        {
          jenis: "teks",
          teks: "Periksa glukosa darah 10\u201315 menit setelah pemberian. Glukosa darah masih <70 mg/dL?",
        },
      ],
      tombol: [
        { label: "Ya, masih <70 mg/dL", tujuan: "s-ulang", nada: "utama" },
        {
          label: "Tidak, sudah \u226570 mg/dL",
          tujuan: "s-observasi",
          nada: "biasa",
        },
      ],
    },
    "s-ulang": {
      id: "s-ulang",
      judul: "Ulangi pemberian glukosa oral",
      nada: "waspada",
      konten: [{ jenis: "dosis", obatId: "glukosaOral" }],
      tombol: [
        {
          label: "Evaluasi ulang GD (10\u201315 menit)",
          tujuan: "s-eval2",
          nada: "utama",
        },
      ],
    },
    "s-eval2": {
      id: "s-eval2",
      judul: "Evaluasi ulang glukosa darah",
      timerMenit: 15,
      konten: [{ jenis: "teks", teks: "Glukosa darah masih <70 mg/dL?" }],
      tombol: [
        {
          label: "Ya, masih <70 mg/dL \u2014 terapi intravena",
          tujuan: "s-iv",
          nada: "bahaya",
        },
        {
          label: "Tidak, sudah \u226570 mg/dL",
          tujuan: "s-makan",
          nada: "biasa",
        },
      ],
    },
    "s-iv": {
      id: "s-iv",
      judul: "Pertimbangkan terapi intravena",
      nada: "bahaya",
      ringkasan: true,
      konten: [
        {
          jenis: "peringatan",
          teks: "Glukosa oral gagal menaikkan glukosa darah \u2014 alihkan ke terapi intravena.",
        },
        { jenis: "dosis", obatId: "dekstrosaBolus" },
        {
          jenis: "teks",
          teks: "Lalu lanjutkan dengan infus dekstrosa sesuai kebutuhan.",
        },
      ],
      tombol: [
        {
          label: "Lanjutkan infus dekstrosa & cari penyebab",
          tujuan: "t-infus",
          nada: "utama",
        },
      ],
    },
    "s-observasi": {
      id: "s-observasi",
      judul: "Observasi",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Pantau glukosa darah secara berkala.",
            "Cari dan atasi penyebab hipoglikemia.",
            "Edukasi orang tua mengenai pencegahan hipoglikemia.",
          ],
        },
      ],
      tombol: [],
    },
    "s-makan": {
      id: "s-makan",
      judul: "Lanjutkan makanan sesuai usia",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Berikan makanan mengandung karbohidrat kompleks.",
            "Pantau glukosa darah & cari penyebab hipoglikemia.",
          ],
        },
      ],
      tombol: [],
    },

    // ===== JALUR ANAK TIDAK SADAR =====
    "t-awal": {
      id: "t-awal",
      judul: "Anak tidak sadar \u00b7 Terapi awal",
      nada: "bahaya",
      ringkasan: true,
      konten: [
        {
          jenis: "peringatan",
          teks: "JANGAN berikan makanan / minuman melalui mulut (risiko aspirasi).",
        },
        { jenis: "teks", teks: "Terapi awal \u2014 pilih salah satu:" },
        { jenis: "dosis", obatId: "dekstrosaBolus" },
        { jenis: "teks", teks: "ATAU (bila akses IV belum tersedia)" },
        { jenis: "dosis", obatId: "glukagon" },
        {
          jenis: "poin",
          poin: ["Monitor glukosa darah setiap 10\u201315 menit."],
        },
      ],
      tombol: [
        {
          label: "Evaluasi ulang GD (10\u201315 menit)",
          tujuan: "t-eval",
          nada: "utama",
        },
      ],
    },
    "t-eval": {
      id: "t-eval",
      judul: "Evaluasi ulang glukosa darah",
      timerMenit: 15,
      konten: [{ jenis: "teks", teks: "Glukosa darah masih <70 mg/dL?" }],
      tombol: [
        { label: "Ya, masih <70 mg/dL", tujuan: "t-ulang", nada: "bahaya" },
        {
          label: "Tidak, sudah \u226570 mg/dL",
          tujuan: "t-makan",
          nada: "utama",
        },
      ],
    },
    "t-ulang": {
      id: "t-ulang",
      judul: "Ulangi Dekstrosa 10%",
      nada: "waspada",
      konten: [
        {
          jenis: "teks",
          teks: "Bila akses IV tersedia, ulangi bolus dekstrosa:",
        },
        { jenis: "dosis", obatId: "dekstrosaBolus" },
      ],
      tombol: [
        {
          label: "Lanjutkan infus dekstrosa",
          tujuan: "t-infus",
          nada: "utama",
        },
      ],
    },
    "t-infus": {
      id: "t-infus",
      judul: "Lanjutkan infus dekstrosa & cari penyebab",
      nada: "waspada",
      ringkasan: true,
      konten: [
        { jenis: "dosis", obatId: "dekstrosaInfus" },
        {
          jenis: "teks",
          teks: "Sesuaikan laju infus dengan kebutuhan & hasil glukosa darah.",
        },
        {
          jenis: "teks",
          teks: "Cari dan atasi penyebab hipoglikemia persisten:",
        },
        {
          jenis: "poin",
          poin: [
            "Asupan kurang / puasa.",
            "Infeksi (sepsis).",
            "Muntah / diare.",
            "Kesalahan dosis insulin / obat.",
            "Kelainan metabolik.",
            "Gangguan hormonal (mis. insufisiensi adrenal, defisiensi hormon pertumbuhan).",
          ],
        },
      ],
      tombol: [
        {
          label: "GD stabil \u2014 lanjutkan makanan sesuai usia",
          tujuan: "t-makan",
          nada: "utama",
        },
      ],
    },
    "t-makan": {
      id: "t-makan",
      judul: "Lanjutkan makanan sesuai usia",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Berikan makanan sesuai usia setelah anak sadar penuh & dapat menelan dengan baik.",
            "Utamakan karbohidrat kompleks.",
          ],
        },
      ],
      tombol: [
        { label: "Observasi & edukasi", tujuan: "t-observasi", nada: "utama" },
      ],
    },
    "t-observasi": {
      id: "t-observasi",
      judul: "Observasi & edukasi",
      nada: "baik",
      ringkasan: true,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Pantau glukosa darah secara berkala.",
            "Edukasi orang tua mengenai pencegahan hipoglikemia.",
            "Evaluasi regimen terapi (jika anak dengan diabetes melitus).",
          ],
        },
      ],
      tombol: [],
    },
  },
};
