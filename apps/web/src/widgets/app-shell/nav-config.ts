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
  slug: string;
  href: string;
  label: string;
  icon: string;
  desc: string;
  detail: string;
}

// Struktur menu meniru v17 (12 menu, 7 grup). Menu yang belum jadi tetap
// diberi tanda "Segera" (built: false) dengan halaman placeholder terstruktur.
export const NAV_GROUPS: ReadonlyArray<NavGroup> = [
  {
    title: "Utama",
    items: [
      { slug: "beranda", label: "Beranda", icon: "\uD83C\uDFE0", href: "/", built: true },
      { slug: "ai-assistant", label: "Asisten AI", icon: "🤖", href: "/preview/ai-assistant", built: true },
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
      // Dosis Obat dan Racik Puyer digabung menjadi satu menu dua tab agar
      // sidebar tidak memanjang. Rute lama tetap hidup sebagai pengalih.
      { slug: "obat", label: "Obat & Puyer", icon: "\uD83D\uDC8A", href: "/preview/obat", built: true },
      { slug: "cairan", label: "Terapi Cairan", icon: "\uD83D\uDCA7", href: "/preview/fluids", built: true },
    ],
  },
  {
    title: "Pemantauan Klinis",
    items: [
      { slug: "tumbuh-kembang", label: "Tumbuh Kembang", icon: "📊", href: "/preview/pertumbuhan", built: true },
      { slug: "skoring", label: "Skoring Klinis", icon: "\uD83E\uDDEE", href: "/preview/skoring", built: true },
      { slug: "tekanan-darah", label: "Tekanan Darah", icon: "\uD83E\uDEC0", href: "/preview/tekanan-darah", built: true },
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
  "/preview/ai-assistant": "Asisten AI terpusat yang memahami seluruh fitur, panduan, dan kalkulator Tinyverse.",
  "/preview/darurat": "Rujukan cepat dosis dan langkah resusitasi anak.",
  "/preview/alur": "Alur interaktif tata laksana kegawatan anak (Fase A: serangan asma).",
  "/preview/obat": "Dosis obat anak per berat badan atau usia, plus racikan puyer.",
  "/preview/dosing": "Dosis obat anak berdasarkan berat badan atau usia.",
  "/preview/fluids": "Rumatan, rehidrasi diare, luka bakar, dan faktor tetes.",
  "/preview/puyer": "Hitung tablet yang digerus dan pembagian bungkus.",
  "/preview/pertumbuhan": "Kurva pertumbuhan dan penilaian status gizi anak.",
  "/preview/skoring": "8 skor klinis anak (dehidrasi, croup, GCS, dan lainnya).",
  "/preview/tekanan-darah": "Kategori tekanan darah anak berdasarkan persentil AAP 2017.",
  "/preview/lab": "Interpretasi hasil lab, termasuk analisis gas darah (AGD).",
  "/preview/nutrisi": "Kebutuhan kalori, protein, dan takaran susu.",
  "/preview/guideline": "Panduan tata laksana penyakit anak tersering.",
  "/preview/imunisasi": "Jadwal imunisasi anak sesuai usia dan bantuan jadwal kejar (catch-up).",
  "/preview/ringkasan": "Kumpulkan poin klinis dari berbagai alat jadi satu catatan siap salin.",
};

// Deskripsi mendalam fungsi alat untuk tooltip hover.
const DETAIL_DESKRIPSI: Record<string, string> = {
  "/preview/ai-assistant": "Asisten AI Co-Pilot terpusat: Tanyakan dosis obat pediatrik, protokol klinis, interpretasi lab, atau panduan penggunaan kalkulator Tinyverse secara instan.",
  "/preview/darurat": "Rujukan resusitasi darurat pediatrik: Dosis obat emergensi, ukuran ETT, kedalaman kompresi, energi defibrilasi, serta timer algoritma RJP/CPR real-time.",
  "/preview/alur": "Algoritma interaktif tata laksana kegawatan: Panduan langkah-demi-langkah visual untuk penanganan serangan asma akut, kejang, syok, dan kondisi darurat anak.",
  "/preview/obat": "Dua alat obat dalam satu menu: Tab Dosis Obat menghitung dosis mg/kgBB/hari atau rentang usia, frekuensi pemberian, dan batas dosis maksimum. Tab Racik Puyer menghitung konversi tablet yang digerus, penyesuaian dosis puyer dan sirup, serta pembagian bungkus.",
  "/preview/dosing": "Kalkulator presisi dosis obat anak: Dosis mg/kgBB/hari atau rentang usia, rekomendasi frekuensi pemberian, serta batas dosis maksimum aman.",
  "/preview/fluids": "Kalkulator terapi cairan komprehensif: Kebutuhan rumatan Holliday-Segar, rehidrasi diare WHO, rumus luka bakar Parkland, & perhitungan kecepatan tetesan infus.",
  "/preview/puyer": "Kalkulator racik puyer pediatri: Hitung konversi tablet utuh yang digerus, penyesuaian dosis puyer & sirup, serta estimasi pembagian bungkus obat.",
  "/preview/pertumbuhan": "Pemantauan tumbuh kembang anak: Grafik kurva pertumbuhan WHO (0-5 thn) & CDC (2-20 thn), Z-score BB/U, TB/U, IMT/U, serta skrining perkembangan KPSP, Denver II, & M-CHAT-R.",
  "/preview/skoring": "8 kalkulator skoring klinis pediatrik: Dehidrasi WHO/CDD, Downes/Westley Croup, Pediatric GCS, Skoring TB Anak, APGAR, Skor Nyeri FLACC, & PEWS.",
  "/preview/tekanan-darah": "Kalkulator persentil tekanan darah anak: Klasifikasi Normal, Elevated BP, Stage 1, dan Stage 2 HTN range menurut AAP 2017 memakai Table 4/5 untuk usia 1 sampai kurang dari 13 tahun dan cut-off absolut Table 3 untuk usia 13 tahun ke atas.",
  "/preview/lab": "Interpretasi laboratorium & AGD: Analisis Gas Darah (AGD) otomatis dengan evaluasi kompensasi asam-basa, serta nilai rujukan hematologi & kimia darah anak.",
  "/preview/nutrisi": "Kalkulator nutrisi & kecukupan gizi: Hitung Angka Kecukupan Gizi (AKG), kebutuhan kalori & protein anak, takaran susu, serta kebutuhan enteral/parenteral.",
  "/preview/guideline": "Panduan klinis & protokol resmi: Ringkasan praktis alur diagnosa dan tata laksana penyakit anak tersering berdasarkan rekomendasi IDAI dan WHO.",
  "/preview/imunisasi": "Jadwal & panduan imunisasi IDAI: Tabel jadwal imunisasi anak sesuai rekomendasi IDAI terbaru beserta rekomendasi jadwal kejar (Catch-Up Vaccine).",
  "/preview/ringkasan": "Generator ringkasan medis & SOAP: Otomatisasi kompilasi data pemeriksaan, perhitungan dosis, dan catatan klinis menjadi resume medis SOAP siap cetak/salin.",
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
    slug: it.slug,
    href: it.href,
    label: it.label,
    icon: it.icon,
    desc: DESKRIPSI[it.href] ?? "",
    detail: DETAIL_DESKRIPSI[it.href] ?? DESKRIPSI[it.href] ?? "",
  }));
