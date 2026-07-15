export interface NavItem {
  slug: string;
  label: string;
  icon: string;
  href: string;
  built: boolean;
  emergency?: boolean;
}

export interface NavGroup {
  title: string;
  items: ReadonlyArray<NavItem>;
}

export interface FiturMeta {
  href: string;
  label: string;
  icon: string;
  desc: string;
}

// Struktur menu meniru v17 (12 menu, 7 grup). Menu yang belum jadi tetap
// diberi tanda "Segera" (built: false) dengan halaman placeholder terstruktur.
export const NAV_GROUPS: ReadonlyArray<NavGroup> = [
  {
    title: "Utama",
    items: [
      { slug: "beranda", label: "Beranda", icon: "\uD83C\uDFE0", href: "/", built: true },
    ],
  },
  {
    title: "Emergency",
    items: [
      {
        slug: "darurat",
        label: "Mode Darurat",
        icon: "\uD83D\uDEA8",
        href: "/preview/darurat",
        built: true,
        emergency: true,
      },
      {
        slug: "alur",
        label: "Alur Tata Laksana",
        icon: "\uD83E\uDDED",
        href: "/preview/alur",
        built: true,
      },
    ],
  },
  {
    title: "Kalkulator Klinis",
    items: [
      { slug: "dosis", label: "Dosis Obat", icon: "\uD83D\uDC8A", href: "/preview/dosing", built: true },
      { slug: "cairan", label: "Terapi Cairan", icon: "\uD83D\uDCA7", href: "/preview/fluids", built: true },
      { slug: "puyer", label: "Racik Puyer", icon: "\u2697\uFE0F", href: "/preview/puyer", built: true },
    ],
  },
  {
    title: "Pemantauan Klinis",
    items: [
      { slug: "tumbuh-kembang", label: "Tumbuh Kembang", icon: "\uD83D\uDCC8", href: "/preview/pertumbuhan", built: true },
      { slug: "skoring", label: "Skoring Klinis", icon: "\uD83E\uDDEE", href: "/preview/skoring", built: true },
    ],
  },
  {
    title: "Diagnostik & Gizi",
    items: [
      { slug: "lab", label: "Interpretasi Lab", icon: "\uD83D\uDD2C", href: "/preview/lab", built: true },
      { slug: "nutrisi", label: "Kalkulator Nutrisi", icon: "\uD83C\uDF4E", href: "/preview/nutrisi", built: true },
    ],
  },
  {
    title: "Referensi",
    items: [
      { slug: "protokol", label: "Guideline", icon: "\uD83E\uDE7A", href: "/preview/guideline", built: true },
      { slug: "imunisasi", label: "Jadwal Imunisasi", icon: "\uD83D\uDCC5", href: "/preview/imunisasi", built: true },
    ],
  },
  {
    title: "Dokumentasi",
    items: [
      { slug: "ringkasan", label: "Ringkasan Klinis", icon: "\uD83D\uDCC4", href: "/preview/ringkasan", built: true },
    ],
  },
];

// Deskripsi singkat tiap fitur (dipakai kartu Quick Access & Favorit).
const DESKRIPSI: Record<string, string> = {
  "/preview/darurat": "Rujukan cepat dosis dan langkah resusitasi anak.",
  "/preview/alur": "Alur interaktif tata laksana kegawatan anak (Fase A: serangan asma).",
  "/preview/dosing": "Dosis obat anak berdasarkan berat badan atau usia.",
  "/preview/fluids": "Rumatan, rehidrasi diare, luka bakar, dan faktor tetes.",
  "/preview/puyer": "Hitung tablet yang digerus dan pembagian bungkus.",
  "/preview/pertumbuhan": "Kurva pertumbuhan dan penilaian status gizi anak.",
  "/preview/skoring": "8 skor klinis anak (dehidrasi, croup, GCS, dan lainnya).",
  "/preview/lab": "Interpretasi hasil lab, termasuk analisis gas darah (AGD).",
  "/preview/nutrisi": "Kebutuhan kalori, protein, dan takaran susu.",
  "/preview/guideline": "Panduan tata laksana penyakit anak tersering.",
  "/preview/imunisasi": "Jadwal imunisasi anak sesuai usia dan bantuan jadwal kejar (catch-up).",
  "/preview/ringkasan": "Kumpulkan poin klinis dari berbagai alat jadi satu catatan siap salin.",
};

// Daftar fitur yang SUDAH jadi (selain Beranda). Ini sumber tunggal untuk Quick
// Access & Favorit di beranda. Urutan Quick Access ditentukan SISTEM berdasarkan
// seberapa sering fitur dibuka (lihat shared/lib/personalisasi.ts). GCS & AGD
// bukan menu tersendiri (bagian dari Skoring & Lab) sehingga tidak muncul di
// Quick Access.
export const FITUR_TERSEDIA: ReadonlyArray<FiturMeta> = NAV_GROUPS.flatMap(
  (g) => g.items,
)
  .filter((it) => it.built && it.slug !== "beranda")
  .map((it) => ({
    href: it.href,
    label: it.label,
    icon: it.icon,
    desc: DESKRIPSI[it.href] ?? "",
  }));
