export type Setting = "fktp" | "rs";
export type Derajat = "ringan-sedang" | "berat" | "ancaman";

export type Pasien = {
  nama?: string;
  bb?: number | null;
  usiaBulan?: number | null;
};

export type BlokKonten =
  | { jenis: "teks"; teks: string }
  | { jenis: "poin"; poin: string[] }
  | { jenis: "dosis"; obatId: string }
  | { jenis: "peringatan"; teks: string };

export type Nada = "utama" | "bahaya" | "biasa";

export type Tombol = {
  label: string;
  tujuan: string;
  nada?: Nada;
};

export type Layar = {
  id: string;
  judul: string;
  derajat?: Derajat;
  nada?: "baik" | "waspada" | "bahaya";
  timerMenit?: number;
  konten: BlokKonten[];
  tombol: Tombol[];
  gambarAlur?: { src: string; keterangan?: string; toggle?: boolean };
  ringkasan?: boolean;
};

export type Alur = {
  id: string;
  nama: string;
  sumber: string;
  mulai: Record<Setting, string>;
  tanpaSetting?: boolean;
  layar: Record<string, Layar>;
};
