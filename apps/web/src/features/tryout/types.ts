export type SubdivisiSKDI =
  | "neonatologi"
  | "respirologi"
  | "gastrohepatologi"
  | "neurologi"
  | "infeksi-tropis"
  | "kardiologi"
  | "tumbuh-kembang"
  | "nutrisi-metabolik"
  | "endokrinologi"
  | "alergi-imunologi"
  | "nefrologi"
  | "gawat-darurat";

export type OpsiId = "a" | "b" | "c" | "d" | "e";

export interface OpsiJawaban {
  id: OpsiId;
  teks: string;
}

export interface SoalTryOut {
  id: string;
  nomor: number;
  subdivisi: SubdivisiSKDI;
  subdivisiLabel: string;
  tingkatSKDI: "4A" | "3B" | "3A";
  vignette: string;
  pertanyaan: string;
  opsi: OpsiJawaban[];
  jawabanBenar: OpsiId;
  pembahasan: string;
  referensi?: string;
  linkAlatTerkait?: {
    label: string;
    href: string;
    iconSlug?: string;
  };
}

export interface PaketTryOut {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  durasiMenit: number;
  passingGradePersen: number;
  kategori: "ukmppd" | "stase-anak" | "mini-cbt";
  kategoriLabel: string;
  badge: string;
  daftarSoal: SoalTryOut[];
}

export interface StatusJawabanUser {
  pilihan: OpsiId | null;
  raguRagu: boolean;
}

export interface SubdivisiScore {
  subdivisi: SubdivisiSKDI;
  label: string;
  total: number;
  benar: number;
  persen: number;
}

export interface HasilTryOut {
  paketId: string;
  tanggalISO: string;
  totalSoal: number;
  jumlahBenar: number;
  jumlahSalah: number;
  jumlahKosong: number;
  skorPersen: number;
  lulus: boolean;
  durasiDetikDigunakan: number;
  rincianSubdivisi: SubdivisiScore[];
  jawabanUser: Record<number, StatusJawabanUser>;
}
