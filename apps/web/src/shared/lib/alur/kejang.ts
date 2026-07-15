import type { Alur } from "./tipe";

export const KEJANG: Alur = {
  id: "kejang-demam",
  nama: "Kejang Demam",
  sumber:
    "Konsensus Penatalaksanaan Kejang Demam & Status Konvulsivus (Status Epileptikus), UKK Neurologi IDAI",
  tanpaSetting: true,
  mulai: { fktp: "stabilisasi", rs: "stabilisasi" },
  layar: {
    stabilisasi: {
      id: "stabilisasi",
      judul: "0\u20135 menit \u00b7 Stabilisasi awal",
      nada: "waspada",
      timerMenit: 5,
      konten: [
        {
          jenis: "poin",
          poin: [
            "Amankan jalan napas, pernapasan, sirkulasi (ABC).",
            "Beri oksigen; pasang monitor & pulse oximetry.",
            "Pasang akses IV; ambil darah (gula darah, elektrolit bila perlu).",
            "Cek gula darah \u2014 koreksi bila hipoglikemia.",
            "Ukur suhu; catat waktu mulai kejang.",
          ],
        },
        { jenis: "teks", teks: "Bila belum ada akses IV atau kejang terjadi di luar RS:" },
        { jenis: "dosis", obatId: "diazepamRektal" },
      ],
      tombol: [
        { label: "Kejang berlanjut \u2014 lanjut benzodiazepin", tujuan: "benzodiazepin", nada: "utama" },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    benzodiazepin: {
      id: "benzodiazepin",
      judul: "5\u201310 menit \u00b7 Benzodiazepin (lini pertama)",
      nada: "waspada",
      timerMenit: 5,
      konten: [
        { jenis: "teks", teks: "Bila akses IV tersedia \u2014 pilih salah satu:" },
        { jenis: "dosis", obatId: "diazepamIV" },
        { jenis: "teks", teks: "ATAU (bila IV belum tersedia)" },
        { jenis: "dosis", obatId: "midazolamIMBuccal" },
        {
          jenis: "peringatan",
          teks: "Benzodiazepin boleh diulang 1\u00d7 bila kejang belum berhenti dalam 5 menit.",
        },
      ],
      tombol: [
        { label: "Kejang berlanjut (>10 menit) \u2014 OAE lini kedua", tujuan: "lini2", nada: "utama" },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    lini2: {
      id: "lini2",
      judul: "10\u201320 menit \u00b7 OAE lini kedua",
      nada: "waspada",
      konten: [
        {
          jenis: "teks",
          teks: "Status epileptikus established. Pilih salah satu obat antiepilepsi lini kedua:",
        },
      ],
      tombol: [
        { label: "Fenitoin IV", tujuan: "lini2-fenitoin", nada: "utama" },
        { label: "Fenobarbital IV", tujuan: "lini2-fenobarbital", nada: "utama" },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    "lini2-fenitoin": {
      id: "lini2-fenitoin",
      judul: "Lini kedua \u00b7 Fenitoin",
      nada: "waspada",
      timerMenit: 20,
      konten: [
        { jenis: "dosis", obatId: "fenitoin" },
        { jenis: "teks", teks: "Bila kejang belum teratasi, dapat diberi dosis tambahan:" },
        { jenis: "dosis", obatId: "fenitoinTambahan" },
      ],
      tombol: [
        {
          label: "Kejang berlanjut \u2014 crossover ke Fenobarbital",
          tujuan: "crossover-fenobarbital",
          nada: "utama",
        },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    "lini2-fenobarbital": {
      id: "lini2-fenobarbital",
      judul: "Lini kedua \u00b7 Fenobarbital",
      nada: "waspada",
      timerMenit: 20,
      konten: [
        { jenis: "dosis", obatId: "fenobarbital" },
        { jenis: "teks", teks: "Bila kejang belum teratasi, dapat diberi dosis tambahan:" },
        { jenis: "dosis", obatId: "fenobarbitalTambahan" },
      ],
      tombol: [
        {
          label: "Kejang berlanjut \u2014 crossover ke Fenitoin",
          tujuan: "crossover-fenitoin",
          nada: "utama",
        },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    "crossover-fenobarbital": {
      id: "crossover-fenobarbital",
      judul: "20\u201330 menit \u00b7 Crossover Fenobarbital",
      nada: "bahaya",
      timerMenit: 10,
      konten: [
        {
          jenis: "teks",
          teks: "Kejang belum teratasi dengan Fenitoin \u2014 beri obat lini kedua satunya:",
        },
        { jenis: "dosis", obatId: "fenobarbital" },
      ],
      tombol: [
        {
          label: "Kejang berlanjut (>30 menit) \u2014 status epileptikus refrakter",
          tujuan: "refrakter",
          nada: "bahaya",
        },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    "crossover-fenitoin": {
      id: "crossover-fenitoin",
      judul: "20\u201330 menit \u00b7 Crossover Fenitoin",
      nada: "bahaya",
      timerMenit: 10,
      konten: [
        {
          jenis: "teks",
          teks: "Kejang belum teratasi dengan Fenobarbital \u2014 beri obat lini kedua satunya:",
        },
        { jenis: "dosis", obatId: "fenitoin" },
      ],
      tombol: [
        {
          label: "Kejang berlanjut (>30 menit) \u2014 status epileptikus refrakter",
          tujuan: "refrakter",
          nada: "bahaya",
        },
        { label: "Kejang berhenti", tujuan: "berhenti", nada: "biasa" },
      ],
    },
    refrakter: {
      id: "refrakter",
      judul: ">30\u201360 menit \u00b7 Status epileptikus refrakter (ICU)",
      nada: "bahaya",
      konten: [
        {
          jenis: "peringatan",
          teks: "Rujuk/rawat ICU. Siapkan intubasi & ventilasi mekanik; pantau hemodinamik & EEG bila tersedia.",
        },
        { jenis: "teks", teks: "Pilih salah satu drip anestesi:" },
        { jenis: "dosis", obatId: "midazolamDrip" },
        { jenis: "teks", teks: "ATAU" },
        { jenis: "dosis", obatId: "propofolDrip" },
        { jenis: "teks", teks: "ATAU" },
        { jenis: "dosis", obatId: "pentobarbitalDrip" },
      ],
      tombol: [{ label: "Kejang berhenti \u2014 terapi rumatan", tujuan: "berhenti", nada: "utama" }],
    },
    berhenti: {
      id: "berhenti",
      judul: "Kejang berhenti \u2014 terapi rumatan",
      nada: "baik",
      ringkasan: true,
      konten: [
        { jenis: "teks", teks: "Bila kejang berhenti, pertimbangkan terapi rumatan:" },
        { jenis: "dosis", obatId: "rumatanFenitoin" },
        { jenis: "teks", teks: "ATAU" },
        { jenis: "dosis", obatId: "rumatanFenobarbital" },
        {
          jenis: "poin",
          poin: ["Cari & atasi penyebab kejang.", "Pantau kesadaran, tanda vital, dan efek samping obat."],
        },
      ],
      tombol: [],
    },
  },
};
