// ─── Tipe data untuk fitur Uji Pemahaman ───────────────────────────────────

export type OpsiJawaban = {
  id: string;   // "a" | "b" | "c" | "d"
  teks: string;
};

export type SoalKuis = {
  id: string;
  pertanyaan: string;
  opsi: OpsiJawaban[];
  jawabanBenar: string;   // id opsi yang benar
  penjelasan: string;     // ditampilkan setelah submit
  referensi?: string;     // mis. "IDAI 2023" atau "AAP 2022"
  divisi?: string;        // divisi pediatri, mis. "Respirologi", "Neonatologi", "Gastrohepatologi"
};

export type StatistikDivisiKuis = {
  divisi: string;
  total: number;
  benar: number;
  salah: number;
  persentase: number;
  status: "bagus" | "cukup" | "kurang";
  saranEvaluasi: string;
};

export type KuisModul = {
  modulId: string;        // slug unik, mis. "skoring" | "cairan" | "neonatus"
  judul: string;
  deskripsi: string;
  icon: string;           // emoji
  soal: SoalKuis[];
};

// ─── Tipe untuk penyimpanan riwayat localStorage ───────────────────────────

export type HasilKuis = {
  modulId: string;
  skor: number;           // jumlah jawaban benar
  total: number;          // total soal
  persentase: number;     // 0-100
  tanggal: string;        // ISO 8601
};

// ─── Fase tampilan quiz runner ──────────────────────────────────────────────

export type FaseKuis = "pilih-modul" | "kuis" | "hasil";
