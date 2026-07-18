import type { Alur, Setting } from "./tipe";
import { ASMA } from "./asma";
import { KEJANG } from "./kejang";
import { DBD } from "./dbd";
import { HIPOGLIKEMIA } from "./hipoglikemia";
import { KAD } from "./kad";

// Metadata kategori untuk mengelompokkan kondisi pada tampilan daftar (grid).
export type KategoriMeta = {
  id: string;
  nama: string;
  ikon: string;
  warna: string;
  warnaLembut: string;
};

// Urutan di sini menentukan urutan tampil kategori pada halaman daftar.
export const KATEGORI_ALUR: KategoriMeta[] = [
  {
    id: "respirasi",
    nama: "Respirasi",
    ikon: "\uD83E\uDEC1",
    warna: "#1c7c54",
    warnaLembut: "rgba(28, 124, 84, 0.12)",
  },
  {
    id: "neurologi",
    nama: "Kegawatan Neurologi",
    ikon: "\uD83E\uDDE0",
    warna: "#7a3ec0",
    warnaLembut: "rgba(122, 62, 192, 0.12)",
  },
  {
    id: "metabolik",
    nama: "Metabolik & Endokrin",
    ikon: "\uD83E\uDE78",
    warna: "#c9761a",
    warnaLembut: "rgba(201, 118, 26, 0.12)",
  },
  {
    id: "infeksi",
    nama: "Penyakit Infeksi & Tropis",
    ikon: "\uD83E\uDD9F",
    warna: "#0f766e",
    warnaLembut: "rgba(15, 118, 110, 0.12)",
  },
];

export type Kondisi = {
  id: string;
  nama: string;
  ikon: string;
  ringkas: string;
  kategori: string;
  alur: Alur;
  bagan?: Partial<Record<Setting, string>>;
  tersedia: boolean;
};

// Daftar kondisi. Tambahkan entri baru di sini untuk menambah alur.
export const DAFTAR_KONDISI: Kondisi[] = [
  {
    id: "asma",
    nama: "Serangan Asma",
    ikon: "\uD83E\uDEC1",
    ringkas: "Tata laksana serangan asma anak \u2014 FKTP & Rumah Sakit.",
    kategori: "respirasi",
    alur: ASMA,
    bagan: {
      fktp: "/assets/alur/asma-fktp.png",
      rs: "/assets/alur/asma-rs.png",
    },
    tersedia: true,
  },
  {
    id: "kejang-demam",
    nama: "Kejang Demam",
    ikon: "\uD83C\uDF21\uFE0F",
    ringkas:
      "Tata laksana kejang akut & status epileptikus anak \u2014 algoritma bertahap sesuai waktu.",
    kategori: "neurologi",
    alur: KEJANG,
    bagan: {
      fktp: "/assets/alur/kejang-demam.png",
      rs: "/assets/alur/kejang-demam.png",
    },
    tersedia: true,
  },
  {
    id: "dbd",
    nama: "Demam Berdarah Dengue",
    ikon: "\uD83E\uDE78",
    ringkas:
      "Klasifikasi & tata laksana infeksi dengue anak \u2014 Grup A, B, C.",
    kategori: "infeksi",
    alur: DBD,
    tersedia: true,
  },
  {
    id: "hipoglikemia",
    nama: "Hipoglikemia",
    ikon: "\uD83C\uDF6C",
    ringkas:
      "Tata laksana kegawatan hipoglikemia anak \u2014 jalur anak sadar & tidak sadar.",
    kategori: "metabolik",
    alur: HIPOGLIKEMIA,
    tersedia: true,
  },
  {
    id: "kad",
    nama: "Ketoasidosis Diabetik (KAD)",
    ikon: "\u2697\uFE0F",
    ringkas:
      "Tata laksana KAD anak \u2014 resusitasi cairan, insulin, koreksi elektrolit & pemantauan.",
    kategori: "metabolik",
    alur: KAD,
    tersedia: true,
  },
];
