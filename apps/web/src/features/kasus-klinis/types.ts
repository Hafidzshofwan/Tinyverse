// ─── Tipe data Fitur 2: Pembelajaran Berbasis Kasus ───────────────────────

export type TipeInput = "mcq" | "numerik" | "info";

export type OpsiKasus = {
  id: string;
  teks: string;
};

export type LangkahKasus = {
  id: string;
  judul: string;
  narasi: string;
  pertanyaan?: string;
  tipeInput: TipeInput;
  opsi?: OpsiKasus[];
  jawabanBenar?: string | number;
  toleransi?: number;        // untuk numerik: ± toleransi dianggap benar
  penjelasan: string;
  linkKalkulator?: { label: string; href: string };
};

export type KategoriKasus =
  | "dehidrasi"
  | "neonatus"
  | "respirasi"
  | "tumbuh-kembang"
  | "neurologi"
  | "farmakologi";

export type TingkatKesulitan = "dasar" | "menengah" | "lanjut";

export type Kasus = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: KategoriKasus;
  tingkat: TingkatKesulitan;
  langkah: LangkahKasus[];
  referensi: string[];
};

// Riwayat localStorage
export type RiwayatKasus = {
  kasusId: string;
  selesai: boolean;
  tanggal: string;
};
