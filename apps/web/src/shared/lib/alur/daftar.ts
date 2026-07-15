import type { Alur, Setting } from "./tipe";
import { ASMA } from "./asma";

export type Kondisi = {
  id: string;
  nama: string;
  ikon: string;
  ringkas: string;
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
    alur: ASMA,
    bagan: {
      fktp: "/assets/alur/asma-fktp.png",
      rs: "/assets/alur/asma-rs.png",
    },
    tersedia: true,
  },
];
