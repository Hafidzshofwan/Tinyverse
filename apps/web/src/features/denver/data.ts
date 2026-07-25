export type DenverSector = "personal-social" | "fine-motor-adaptive" | "language" | "gross-motor";

export interface DenverSectorInfo {
  id: DenverSector;
  nama: string;
  emoji: string;
  warna: string;
  bgWarna: string;
}

export const DENVER_SECTORS: Record<DenverSector, DenverSectorInfo> = {
  "personal-social": {
    id: "personal-social",
    nama: "Personal Sosial",
    emoji: "🤝",
    warna: "#2563EB",
    bgWarna: "#EFF6FF",
  },
  "fine-motor-adaptive": {
    id: "fine-motor-adaptive",
    nama: "Motorik Halus Adaptif",
    emoji: "🎨",
    warna: "#D97706",
    bgWarna: "#FEF3C7",
  },
  language: {
    id: "language",
    nama: "Bahasa & Bicara",
    emoji: "🗣️",
    warna: "#059669",
    bgWarna: "#ECFDF5",
  },
  "gross-motor": {
    id: "gross-motor",
    nama: "Motorik Kasar",
    emoji: "🏃",
    warna: "#7C3AED",
    bgWarna: "#F5F3FF",
  },
};

export interface DenverItem {
  id: string;
  sektor: DenverSector;
  namaIndo: string;
  p25: number; // usia dalam bulan (25% anak lulus)
  p50: number; // usia dalam bulan (50% anak lulus)
  p75: number; // usia dalam bulan (75% anak lulus)
  p90: number; // usia dalam bulan (90% anak lulus)
  petunjuk?: string;
  tipe?: "langsung" | "laporan" | "keduanya";
}

export type DenverItemResult = "pass" | "fail" | "refusal" | "no-opportunity" | null;

export interface DenverEvaluation {
  item: DenverItem;
  result: DenverItemResult;
  isDelay: boolean;
  isCaution: boolean;
  statusLabel: "normal" | "caution" | "delay" | "advanced" | "untested";
}

export interface DenverOverallResult {
  totalItemDiuji: number;
  totalPass: number;
  totalFail: number;
  totalRefusal: number;
  totalNoOpportunity: number;
  cautionsCount: number;
  delaysCount: number;
  kategori: "normal" | "suspect" | "untestable";
  labelKategori: string;
  penjelasan: string;
  saranKlinis: string;
  evaluasiList: DenverEvaluation[];
}

/**
 * ⚠️ CATATAN PENTING — BACA SEBELUM MENGUBAH DATA DI BAWAH INI:
 *
 * 1. CAKUPAN ITEM: Modul ini berisi 68 item (bukan 125 item seperti Denver II
 *    resmi/lengkap terbitan Frankenburg & Dodds, 1992). Ini adalah adaptasi/
 *    versi ringkas, dipilih untuk mewakili tiap sektor, BUKAN salinan penuh
 *    instrumen resmi.
 *
 * 2. SUMBER ANGKA PERSENTIL (p25/p50/p75/p90): Tabel usia-persentil asli
 *    Denver II adalah produk komersial berlisensi (kit fisik terbitan Denver
 *    Developmental Materials, Inc.) dan TIDAK dipublikasikan bebas di
 *    internet. Angka-angka di bawah ini adalah ESTIMASI/ADAPTASI klinis
 *    berdasarkan pengetahuan milestone pediatri umum (textbook-level),
 *    BUKAN salinan presisi dari kit resmi berlisensi.
 *
 * 3. IMPLIKASI: Jangan mengklaim modul ini "sesuai standar Denver II resmi"
 *    di teks/UI manapun. Jika di kemudian hari tersedia akses ke kit Denver
 *    II asli/berlisensi, angka-angka ini sebaiknya diverifikasi ulang dan
 *    diganti dengan nilai resmi.
 */
export const DENVER_ITEMS: DenverItem[] = [
  // ==========================================
  // 1. PERSONAL SOSIAL (Personal-Social)
  // ==========================================
  {
    id: "ps-1",
    sektor: "personal-social",
    namaIndo: "Menatap Wajah",
    p25: 0.2,
    p50: 0.5,
    p75: 1.0,
    p90: 1.5,
    petunjuk: "Pemeriksa menatap wajah bayi dari jarak ±20 cm tanpa bersuara.",
    tipe: "langsung",
  },
  {
    id: "ps-2",
    sektor: "personal-social",
    namaIndo: "Merespons Senyuman",
    p25: 0.5,
    p50: 1.0,
    p75: 1.5,
    p90: 2.0,
    petunjuk: "Tersenyumlah dan ajak bicara bayi, perhatikan apakah ia tersenyum kembali.",
    tipe: "langsung",
  },
  {
    id: "ps-3",
    sektor: "personal-social",
    namaIndo: "Senyum Spontan",
    p25: 0.5,
    p50: 1.2,
    p75: 1.8,
    p90: 2.2,
    petunjuk: "Orang tua melaporkan bayi tersenyum tanpa rangsangan sentuhan/suara.",
    tipe: "laporan",
  },
  {
    id: "ps-4",
    sektor: "personal-social",
    namaIndo: "Mengamati Tangan Sendiri",
    p25: 1.5,
    p50: 2.5,
    p75: 3.5,
    p90: 4.2,
    petunjuk: "Bayi memandangi jari/tangannya sendiri selama beberapa detik.",
    tipe: "keduanya",
  },
  {
    id: "ps-5",
    sektor: "personal-social",
    namaIndo: "Berusaha Menggapai Mainan",
    p25: 2.5,
    p50: 3.8,
    p75: 4.8,
    p90: 5.5,
    petunjuk: "Letakkan mainan menarik di luar jangkauan dekat, amati respons bayi.",
    tipe: "langsung",
  },
  {
    id: "ps-6",
    sektor: "personal-social",
    namaIndo: "Makan Biskuit/Kue Sendiri",
    p25: 4.2,
    p50: 5.5,
    p75: 6.8,
    p90: 8.0,
    petunjuk: "Bayi memasukkan potongan biskuit/kue kering ke dalam mulutnya sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-7",
    sektor: "personal-social",
    namaIndo: "Main 'Cilukba' (Peek-a-boo)",
    p25: 5.5,
    p50: 7.0,
    p75: 8.5,
    p90: 10.0,
    petunjuk: "Pemeriksa/orang tua bersembunyi di balik kain lalu muncul, amati reaksi anak.",
    tipe: "langsung",
  },
  {
    id: "ps-9",
    sektor: "personal-social",
    namaIndo: "Tepuk Tangan",
    p25: 7.0,
    p50: 8.8,
    p75: 10.5,
    p90: 12.5,
    petunjuk: "Anak bertepuk tangan menirukan atau secara mandiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-8",
    sektor: "personal-social",
    // Catatan: p50/p90 dinaikkan dari nilai sebelumnya (8.2 / 12.0) mengikuti
    // audit plausibilitas — pengetahuan milestone pediatri umum menempatkan
    // "dadah" sedikit lebih lambat (p50 ~10 bln, p90 ~14-15 bln). Ini estimasi
    // klinis, bukan angka resmi Denver II (lihat catatan sumber di atas).
    // Dipindah setelah "ps-9" agar urutan tampilan tetap naik sesuai usia
    // (id tidak diubah karena tidak memengaruhi logika skor).
    namaIndo: "Melambaikan Tangan (Dadah)",
    p25: 7.0,
    p50: 10.0,
    p75: 12.0,
    p90: 14.5,
    petunjuk: "Anak melambaikan tangan saat berpisah atau diminta.",
    tipe: "keduanya",
  },
  {
    id: "ps-10",
    sektor: "personal-social",
    namaIndo: "Minum dari Cangkir/Gelas",
    p25: 9.0,
    p50: 11.5,
    p75: 13.5,
    p90: 16.0,
    petunjuk: "Anak memegang cangkir dan minum tanpa banyak tumpah.",
    tipe: "keduanya",
  },
  {
    id: "ps-11",
    sektor: "personal-social",
    namaIndo: "Menirukan Kegiatan Rumah Tangga",
    p25: 10.5,
    p50: 13.0,
    p75: 16.0,
    p90: 19.0,
    petunjuk: "Menyapu, menyelonjor, atau mengelap meja menirukan orang tua.",
    tipe: "laporan",
  },
  {
    id: "ps-12",
    sektor: "personal-social",
    namaIndo: "Menggunakan Sendok/Garpu",
    p25: 12.5,
    p50: 15.5,
    p75: 18.5,
    p90: 22.0,
    petunjuk: "Makan sendiri dengan sendok walau sesekali tumpah.",
    tipe: "keduanya",
  },
  {
    id: "ps-13",
    sektor: "personal-social",
    namaIndo: "Melepas Pakaian Sederhana",
    p25: 14.0,
    p50: 18.0,
    p75: 22.0,
    p90: 26.0,
    petunjuk: "Melepas topi, kaos kaki, atau celana sendiri.",
    tipe: "laporan",
  },
  {
    id: "ps-14",
    sektor: "personal-social",
    namaIndo: "Menggosok Gigi dengan Bantuan",
    p25: 18.0,
    p50: 23.0,
    p75: 28.0,
    p90: 34.0,
    petunjuk: "Memegang sikat gigi dan menggosok gigi sendiri dengan bantuan pengawasan.",
    tipe: "laporan",
  },
  {
    id: "ps-15",
    sektor: "personal-social",
    namaIndo: "Mengenakan Baju Mandiri",
    p25: 32.0,
    p50: 42.0,
    p75: 50.0,
    p90: 60.0,
    petunjuk: "Mengenakan T-shirt atau celana tanpa dibantu (kecuali mengancing/menali).",
    tipe: "keduanya",
  },
  {
    id: "ps-16",
    sektor: "personal-social",
    namaIndo: "Bermain Kartu / Peraturan Kelompok",
    p25: 36.0,
    p50: 46.0,
    p75: 56.0,
    p90: 66.0,
    petunjuk: "Dapat bermain ular tangga/petak umpet mengikuti aturan.",
    tipe: "laporan",
  },

  // ==========================================
  // 2. MOTORIK HALUS ADAPTIF (Fine Motor-Adaptive)
  // ==========================================
  {
    id: "fm-1",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti ke Garis Tengah",
    p25: 0.1,
    p50: 0.3,
    p75: 0.8,
    p90: 1.2,
    petunjuk: "Gerakkan mainan dari samping ke arah tengah mata bayi.",
    tipe: "langsung",
  },
  {
    id: "fm-2",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti Melewati Garis Tengah",
    p25: 0.5,
    p50: 1.2,
    p75: 1.8,
    p90: 2.5,
    petunjuk: "Gerakkan benda melintasi garis tengah wajah bayi.",
    tipe: "langsung",
  },
  {
    id: "fm-3",
    sektor: "fine-motor-adaptive",
    namaIndo: "Pegang Rincian / Mainan",
    p25: 1.0,
    p50: 2.0,
    p75: 3.2,
    p90: 3.8,
    petunjuk: "Sentuhkan mainan di punggung jari bayi, amati jika ia menggenggamnya.",
    tipe: "langsung",
  },
  {
    id: "fm-4",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti Gerakan 180 Derajat",
    p25: 1.2,
    p50: 2.2,
    p75: 3.2,
    p90: 4.0,
    petunjuk: "Gerakkan benang merah melingkar 180 derajat di atas mata bayi.",
    tipe: "langsung",
  },
  {
    id: "fm-5",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meraih Benda Dalam Jangkauan",
    p25: 2.5,
    p50: 3.8,
    p75: 4.8,
    p90: 5.5,
    petunjuk: "Anak mengulurkan tangan untuk mengambil mainan.",
    tipe: "langsung",
  },
  {
    id: "fm-6",
    sektor: "fine-motor-adaptive",
    namaIndo: "Pindahkan Kubus Antar Tangan",
    p25: 4.5,
    p50: 5.8,
    p75: 6.8,
    p90: 7.8,
    petunjuk: "Anak memindahkan kubus dari tangan kanan ke tangan kiri atau sebaliknya.",
    tipe: "langsung",
  },
  {
    id: "fm-7",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengambil Kismis (Gerakan Miring)",
    p25: 5.0,
    p50: 6.5,
    p75: 8.0,
    p90: 9.5,
    petunjuk: "Mengambil benda kecil seperti kismis dengan telapak tangan/jari miring.",
    tipe: "langsung",
  },
  {
    id: "fm-8",
    sektor: "fine-motor-adaptive",
    namaIndo: "Jepit Kismis (Ibu Jari & Telunjuk / Pincer Grasp)",
    p25: 7.5,
    p50: 9.2,
    p75: 10.8,
    p90: 12.0,
    petunjuk: "Mengambil kismis secara rapi menggunakan ujung ibu jari dan telunjuk.",
    tipe: "langsung",
  },
  {
    id: "fm-9",
    sektor: "fine-motor-adaptive",
    namaIndo: "Benturkan 2 Kubus",
    p25: 8.0,
    p50: 9.8,
    p75: 11.5,
    p90: 13.0,
    petunjuk: "Memegang 2 kubus dan menepukkan keduanya bersama-sama.",
    tipe: "langsung",
  },
  {
    id: "fm-10",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menumpuk 2 Kubus",
    p25: 13.0,
    p50: 15.0,
    p75: 18.0,
    p90: 20.0,
    petunjuk: "Menumpuk 1 kubus di atas kubus lainnya tanpa jatuh.",
    tipe: "langsung",
  },
  {
    id: "fm-11",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencoret-coret Kertas",
    p25: 13.0,
    p50: 16.0,
    p75: 19.0,
    p90: 22.0,
    petunjuk: "Diberi pensil dan kertas, anak mencoret secara spontan.",
    tipe: "langsung",
  },
  {
    id: "fm-12",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menumpuk 4 Kubus",
    p25: 16.0,
    p50: 19.0,
    p75: 22.0,
    p90: 25.0,
    petunjuk: "Menumpuk 4 kubus ke atas secara seimbang.",
    tipe: "langsung",
  },
  {
    id: "fm-14",
    sektor: "fine-motor-adaptive",
    // Catatan: dipindah sebelum "fm-13" agar urutan tampilan p50 tetap naik
    // (26 sebelum 27). Id tidak diubah karena tidak memengaruhi logika skor.
    namaIndo: "Menumpuk 6 Kubus",
    p25: 22.0,
    p50: 26.0,
    p75: 30.0,
    p90: 36.0,
    petunjuk: "Menumpuk 6 kubus kayu kecil secara tegak lurus.",
    tipe: "langsung",
  },
  {
    id: "fm-13",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meniru Garis Vertikal",
    p25: 22.0,
    p50: 27.0,
    p75: 32.0,
    p90: 38.0,
    petunjuk: "Pemeriksa mencontohkan garis tegak, anak menirukan garis tegak ≥2.5 cm.",
    tipe: "langsung",
  },
  {
    id: "fm-15",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meniru Lingkaran",
    p25: 32.0,
    p50: 38.0,
    p75: 44.0,
    p90: 50.0,
    petunjuk: "Tanpa membantu, anak menggambar bentuk tertutup mirip lingkaran.",
    tipe: "langsung",
  },
  {
    id: "fm-16",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meniru Gambar Silang (+)",
    p25: 38.0,
    p50: 45.0,
    p75: 52.0,
    p90: 58.0,
    petunjuk: "Meniru tanda tambah (+) dengan 2 garis berpotongan lurus.",
    tipe: "langsung",
  },
  {
    id: "fm-17",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menggambar Orang 3 Bagian Tubuh",
    p25: 42.0,
    p50: 50.0,
    p75: 58.0,
    p90: 66.0,
    petunjuk: "Menggambar manusia dengan sedikitnya 3 bagian tubuh (kepala, badan, kaki/tangan).",
    tipe: "langsung",
  },
  {
    id: "fm-18",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meniru Gambar Persegi/Kotak",
    p25: 50.0,
    p50: 58.0,
    p75: 66.0,
    p90: 72.0,
    petunjuk: "Menggambar kotak 4 sudut bersudut agak tegak lurus.",
    tipe: "langsung",
  },

  // ==========================================
  // 3. BAHASA & BICARA (Language)
  // ==========================================
  {
    id: "lg-1",
    sektor: "language",
    namaIndo: "Bereaksi Terhadap Suara Bel",
    p25: 0.1,
    p50: 0.3,
    p75: 0.8,
    p90: 1.2,
    petunjuk: "Kerdipkan mata, kaget, atau berubah gerakan saat bel dibunyikan di dekatnya.",
    tipe: "langsung",
  },
  {
    id: "lg-2",
    sektor: "language",
    namaIndo: "Vokalisasi Vokal ('oo' / 'ah')",
    p25: 0.5,
    p50: 1.2,
    p75: 2.0,
    p90: 2.5,
    petunjuk: "Mengeluarkan suara vokal lembut (cooing) selain suara menangis.",
    tipe: "keduanya",
  },
  {
    id: "lg-3",
    sektor: "language",
    namaIndo: "Tertawa Keras",
    p25: 1.5,
    p50: 2.5,
    p75: 3.8,
    p90: 4.5,
    petunjuk: "Tertawa bersuara keras spontan.",
    tipe: "keduanya",
  },
  {
    id: "lg-4",
    sektor: "language",
    namaIndo: "Berteriak / Memekik Gembira",
    p25: 2.0,
    p50: 3.5,
    p75: 4.8,
    p90: 5.8,
    petunjuk: "Memekik gembira bernada tinggi.",
    tipe: "laporan",
  },
  {
    id: "lg-5",
    sektor: "language",
    namaIndo: "Menoleh ke Arah Suara",
    p25: 2.5,
    p50: 4.0,
    p75: 5.5,
    p90: 6.8,
    petunjuk: "Menolehkan kepala lurus ke arah datangnya suara bisikan atau gemerincing.",
    tipe: "langsung",
  },
  {
    id: "lg-6",
    sektor: "language",
    namaIndo: "Mengoceh Kombinasi Silabel (Mama/Dada Non-Spesifik)",
    p25: 5.0,
    p50: 6.8,
    p75: 8.5,
    p90: 10.0,
    petunjuk: "Mengucapkan 'ma-ma', 'da-da', 'ba-ba' tanpa bermakna khusus.",
    tipe: "keduanya",
  },
  {
    id: "lg-7",
    sektor: "language",
    namaIndo: "Menyebut Mama/Papa Spesifik",
    p25: 8.0,
    p50: 10.5,
    p75: 12.5,
    p90: 14.5,
    petunjuk: "Memanggil 'mama' tepat kepada ibu, atau 'papa' tepat kepada ayah.",
    tipe: "laporan",
  },
  {
    id: "lg-8",
    sektor: "language",
    namaIndo: "Mengucapkan 1 Kata Bermakna",
    p25: 10.0,
    p50: 12.5,
    p75: 15.0,
    p90: 18.0,
    petunjuk: "Menyebutkan 1 kata jelas selain mama/papa (misal: 'cucu', 'mam', 'bola').",
    tipe: "laporan",
  },
  {
    id: "lg-9",
    sektor: "language",
    namaIndo: "Mengucapkan 3-6 Kata Bermakna",
    p25: 13.0,
    p50: 16.0,
    p75: 19.0,
    p90: 23.0,
    petunjuk: "Menguasai 3 sampai 6 kata dengan arti yang konsisten.",
    tipe: "laporan",
  },
  {
    id: "lg-10",
    sektor: "language",
    namaIndo: "Menunjuk 1 Gambar dari Buku",
    p25: 15.0,
    p50: 18.0,
    p75: 22.0,
    p90: 26.0,
    petunjuk: "Tunjukkan gambar hewan/benda, anak mampu menunjuk sesuai pertanyaan.",
    tipe: "langsung",
  },
  {
    id: "lg-11",
    sektor: "language",
    namaIndo: "Menunjuk 2-4 Bagian Tubuh",
    p25: 16.0,
    p50: 20.0,
    p75: 24.0,
    p90: 29.0,
    petunjuk: "Menunjuk rambut, mata, hidung, mulut, atau tangan saat diminta.",
    tipe: "langsung",
  },
  {
    id: "lg-12",
    sektor: "language",
    namaIndo: "Menggabungkan 2 Kata Berbeda",
    p25: 18.0,
    p50: 22.0,
    p75: 26.0,
    p90: 32.0,
    petunjuk: "Kalimat 2 kata seperti 'minta minum', 'main bola' (bukan kata majemuk).",
    tipe: "laporan",
  },
  {
    id: "lg-13",
    sektor: "language",
    namaIndo: "Menyebutkan 1 Warna",
    p25: 30.0,
    p50: 36.0,
    p75: 42.0,
    p90: 48.0,
    petunjuk: "Dapat menunjuk dan menyebut 1 warna dasar dengan benar (merah/biru/kuning).",
    tipe: "langsung",
  },
  {
    id: "lg-14",
    sektor: "language",
    namaIndo: "Memahami 2 Kata Depan (Di Atas / Di Bawah)",
    p25: 36.0,
    p50: 42.0,
    p75: 48.0,
    p90: 55.0,
    petunjuk: "Meletakkan kubus 'di atas meja' dan 'di bawah kursi' sesuai perintah.",
    tipe: "langsung",
  },
  {
    id: "lg-15",
    sektor: "language",
    namaIndo: "Menyebutkan 4 Warna",
    p25: 42.0,
    p50: 48.0,
    p75: 54.0,
    p90: 60.0,
    petunjuk: "Menyebut 4 warna dasar (merah, biru, hijau, kuning) dengan tepat.",
    tipe: "langsung",
  },
  {
    id: "lg-16",
    sektor: "language",
    namaIndo: "Mengartikan 5 Kata",
    p25: 48.0,
    p50: 56.0,
    p75: 62.0,
    p90: 70.0,
    petunjuk: "Menjelaskan kegunaan/bentuk/kategori dari bola, rumah, pisang, dll.",
    tipe: "langsung",
  },

  // ==========================================
  // 4. MOTORIK KASAR (Gross Motor)
  // ==========================================
  {
    id: "gm-1",
    sektor: "gross-motor",
    namaIndo: "Gerakan Simetris Lengan & Tungkai",
    p25: 0.1,
    p50: 0.3,
    p75: 0.8,
    p90: 1.2,
    petunjuk: "Posisi terlentang, kedua tangan dan kaki bergerak aktif serentak.",
    tipe: "langsung",
  },
  {
    id: "gm-2",
    sektor: "gross-motor",
    namaIndo: "Mengangkat Kepala 45° saat Tengkurap",
    p25: 0.5,
    p50: 1.2,
    p75: 2.0,
    p90: 2.5,
    petunjuk: "Saat tengkurap di alas datar, mengangkat kepala membentuk sudut 45 derajat.",
    tipe: "langsung",
  },
  {
    id: "gm-3",
    sektor: "gross-motor",
    namaIndo: "Mengangkat Kepala 90° Tegak",
    p25: 1.2,
    p50: 2.0,
    p75: 2.8,
    p90: 3.5,
    petunjuk: "Mengangkat kepala tegak 90 derajat saat tengkurap.",
    tipe: "langsung",
  },
  {
    id: "gm-4",
    sektor: "gross-motor",
    namaIndo: "Bertumpu Pada Dada / Lengan",
    p25: 2.0,
    p50: 3.2,
    p75: 4.2,
    p90: 5.0,
    petunjuk: "Mengangkat dada disangga dengan kedua lengan bawah.",
    tipe: "langsung",
  },
  {
    id: "gm-5",
    sektor: "gross-motor",
    namaIndo: "Berbalik (Terlentang ke Tengkurap / Sebaliknya)",
    p25: 2.5,
    p50: 4.0,
    p75: 5.2,
    p90: 6.2,
    petunjuk: "Berguling penuh sedikitnya 2 kali berturut-turut.",
    tipe: "keduanya",
  },
  {
    id: "gm-6",
    sektor: "gross-motor",
    namaIndo: "Duduk Tanpa Pegangan (Mandiri)",
    p25: 5.0,
    p50: 6.2,
    p75: 7.5,
    p90: 8.8,
    petunjuk: "Duduk tegak di lantai tanpa disangga bantal atau disangga tangan selama ≥60 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-7",
    sektor: "gross-motor",
    namaIndo: "Berdiri Berpegangan",
    p25: 6.5,
    p50: 8.0,
    p75: 9.5,
    p90: 11.0,
    petunjuk: "Berdiri sambil berpegangan pada perabot/kursi selama ≥30 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-8",
    sektor: "gross-motor",
    namaIndo: "Bangkit untuk Berdiri Dari Posisi Duduk",
    p25: 7.5,
    p50: 9.5,
    p75: 11.5,
    p90: 13.5,
    petunjuk: "Menarik tubuhnya sendiri ke posisi berdiri menggunakan boks/kursi.",
    tipe: "langsung",
  },
  {
    id: "gm-9",
    sektor: "gross-motor",
    namaIndo: "Berdiri Mandiri Sebentar (≥2 Detik)",
    p25: 9.5,
    p50: 11.5,
    p75: 13.0,
    p90: 14.5,
    petunjuk: "Melepas pegangan dan berdiri tegak stabil sekurangnya 2 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-10",
    sektor: "gross-motor",
    namaIndo: "Berjalan dengan Baik (Lancar)",
    p25: 11.0,
    p50: 12.5,
    p75: 14.5,
    p90: 16.5,
    petunjuk: "Melangkah sepanjang ruangan tanpa jatuh atau terhuyung-huyung.",
    tipe: "langsung",
  },
  {
    id: "gm-11",
    sektor: "gross-motor",
    namaIndo: "Berjalan Mundur",
    p25: 12.5,
    p50: 15.0,
    p75: 17.5,
    p90: 20.0,
    petunjuk: "Melangkah mundur sedikitnya 5 langkah tanpa kehilangan keseimbangan.",
    tipe: "langsung",
  },
  {
    id: "gm-12",
    sektor: "gross-motor",
    namaIndo: "Lari Tanpa Terjatuh",
    p25: 14.0,
    p50: 17.0,
    p75: 20.0,
    p90: 24.0,
    petunjuk: "Berlari dengan lancar tanpa mudah tersandung.",
    tipe: "keduanya",
  },
  {
    id: "gm-13",
    sektor: "gross-motor",
    namaIndo: "Menendang Bola ke Depan",
    p25: 16.0,
    p50: 20.0,
    p75: 24.0,
    p90: 28.0,
    petunjuk: "Mengayunkan kaki menendang bola tanpa berpegangan.",
    tipe: "langsung",
  },
  {
    id: "gm-14",
    sektor: "gross-motor",
    namaIndo: "Melompat Kedua Kaki Terangkat",
    p25: 20.0,
    p50: 25.0,
    p75: 30.0,
    p90: 36.0,
    petunjuk: "Melompat di tempat dengan kedua kaki lepas dari lantai bersamaan.",
    tipe: "langsung",
  },
  {
    id: "gm-15",
    sektor: "gross-motor",
    namaIndo: "Melempar Bola ke Atas/Depan",
    p25: 22.0,
    p50: 28.0,
    p75: 34.0,
    p90: 40.0,
    petunjuk: "Melempar bola ke arah pemeriksa dari jarak 1.5 meter.",
    tipe: "langsung",
  },
  {
    id: "gm-16",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki Keseimbangan 1 Detik",
    p25: 28.0,
    p50: 35.0,
    p75: 42.0,
    p90: 48.0,
    petunjuk: "Mengangkat 1 kaki dan bertahan sekurangnya 1 detik tanpa pegangan.",
    tipe: "langsung",
  },
  {
    id: "gm-17",
    sektor: "gross-motor",
    namaIndo: "Melompat Dengan 1 Kaki",
    p25: 36.0,
    p50: 44.0,
    p75: 52.0,
    p90: 60.0,
    petunjuk: "Melompat 2-3 kali berturut-turut bertumpu pada 1 kaki.",
    tipe: "langsung",
  },
  {
    id: "gm-18",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki Keseimbangan 5 Detik",
    p25: 45.0,
    p50: 54.0,
    p75: 62.0,
    p90: 70.0,
    petunjuk: "Berdiri pada 1 kaki selama 5 detik penuh secara seimbang.",
    tipe: "langsung",
  },
];

/**
 * Filter item Denver II yang perlu diuji berdasarkan garis usia anak dalam bulan
 */
export function getDenverItemsForAge(ageMonths: number): DenverItem[] {
  // Ambil item yang p25 <= (ageMonths + 6) DAN p90 >= (ageMonths - 12)
  // Ini memastikan mencakup item yang memotong garis usia, item maju di kanan, serta item dasar di kiri
  return DENVER_ITEMS.filter(
    (item) => item.p25 <= ageMonths + 8 && item.p90 >= ageMonths - 14
  );
}

/**
 * Kalkulasi usia eksak dalam bulan berdasarkan Tgl Lahir dan Tgl Tes
 * serta koreksi prematuritas jika usia < 24 bulan & prematur < 37 minggu
 */
export function hitungUsiaDenver(
  tglLahir: string,
  tglTes: string,
  mingguPrematur: number = 0 // 0 jika cukup bulan
): {
  usiaBulanEksak: number;
  usiaTahun: number;
  sisaBulan: number;
  sisaHari: number;
  koreksiPrematur: boolean;
  usiaBulanKoreksi: number;
} {
  const birth = new Date(tglLahir);
  const test = new Date(tglTes);

  if (isNaN(birth.getTime()) || isNaN(test.getTime())) {
    return {
      usiaBulanEksak: 0,
      usiaTahun: 0,
      sisaBulan: 0,
      sisaHari: 0,
      koreksiPrematur: false,
      usiaBulanKoreksi: 0,
    };
  }

  let y = test.getFullYear() - birth.getFullYear();
  let m = test.getMonth() - birth.getMonth();
  let d = test.getDate() - birth.getDate();

  if (d < 0) {
    m -= 1;
    // estimasi hari dalam bulan sebelumnya
    const prevMonth = new Date(test.getFullYear(), test.getMonth(), 0);
    d += prevMonth.getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  const rawBulan = y * 12 + m + d / 30.4375;

  // Koreksi prematuritas: Jika lahir < 37 minggu dan usia aktual < 24 bulan
  // Beda minggu = 40 - mingguPrematur. (1 minggu = 7/30.4375 bulan)
  let applyKoreksi = false;
  let bulanKoreksi = rawBulan;

  if (mingguPrematur > 0 && mingguPrematur < 37 && rawBulan < 24) {
    applyKoreksi = true;
    const selisihMinggu = 40 - mingguPrematur;
    const selisihBulan = (selisihMinggu * 7) / 30.4375;
    bulanKoreksi = Math.max(0, rawBulan - selisihBulan);
  }

  return {
    usiaBulanEksak: Number(rawBulan.toFixed(2)),
    usiaTahun: y,
    sisaBulan: m,
    sisaHari: d,
    koreksiPrematur: applyKoreksi,
    usiaBulanKoreksi: Number(bulanKoreksi.toFixed(2)),
  };
}

/**
 * Hitung hasil skrining Denver II berdasarkan jawaban per item
 */
export function hitungDenver(
  items: DenverItem[],
  jawaban: Record<string, DenverItemResult>,
  usiaBulan: number
): DenverOverallResult {
  const evaluasiList: DenverEvaluation[] = [];

  let totalPass = 0;
  let totalFail = 0;
  let totalRefusal = 0;
  let totalNoOpportunity = 0;
  let cautionsCount = 0;
  let delaysCount = 0;

  let refusalThatWouldBeDelay = 0;

  for (const item of items) {
    const res = jawaban[item.id] || null;

    if (res === "pass") totalPass++;
    else if (res === "fail") totalFail++;
    else if (res === "refusal") totalRefusal++;
    else if (res === "no-opportunity") totalNoOpportunity++;

    // Tentukan status keterlambatan (Delay) dan peringatan (Caution)
    // Delay: Garis usia secara keseluruhan berada di sebelah KANAN p90 (usiaBulan > p90)
    // DAN hasil = fail atau refusal
    const isDelayEligible = usiaBulan > item.p90;
    const isCautionEligible = usiaBulan >= item.p75 && usiaBulan <= item.p90;

    let isDelay = false;
    let isCaution = false;
    let statusLabel: DenverEvaluation["statusLabel"] = "normal";

    if (res === "fail") {
      if (isDelayEligible) {
        isDelay = true;
        delaysCount++;
        statusLabel = "delay";
      } else if (isCautionEligible) {
        isCaution = true;
        cautionsCount++;
        statusLabel = "caution";
      } else {
        statusLabel = "normal";
      }
    } else if (res === "refusal") {
      if (isDelayEligible) {
        refusalThatWouldBeDelay++;
        statusLabel = "untested";
      } else if (isCautionEligible) {
        statusLabel = "untested";
      }
    } else if (res === "pass") {
      if (item.p25 > usiaBulan) {
        statusLabel = "advanced"; // Lulus item di kanan garis usia
      } else {
        statusLabel = "normal";
      }
    }

    evaluasiList.push({
      item,
      result: res,
      isDelay,
      isCaution,
      statusLabel,
    });
  }

  const totalDiuji = Object.keys(jawaban).filter((k) => jawaban[k] !== null).length;

  // Klasifikasi Akhir Denver II
  let kategori: "normal" | "suspect" | "untestable" = "normal";
  let labelKategori = "NORMAL (Sesuai Usia)";
  let penjelasan = "";
  let saranKlinis = "";

  if (refusalThatWouldBeDelay >= 1 || (totalRefusal >= 3 && totalDiuji > 5)) {
    kategori = "untestable";
    labelKategori = "TIDAK DAPAT DIUJI (Untestable)";
    penjelasan = `Anak menolak (${totalRefusal} item) pada item-item tes kunci yang memotong garis usia.`;
    saranKlinis =
      "Jadwalkan uji ulang (re-test) dalam 1-2 minggu ke depan ketika kondisi anak dalam keadaan tenang, sehat, dan kooperatif.";
  } else if (delaysCount >= 1 || cautionsCount >= 2) {
    kategori = "suspect";
    labelKategori = "MERAGUKAN / SUSPEK (Suspect)";
    penjelasan = `Ditemukan ${delaysCount} item Keterlambatan (Delay) dan ${cautionsCount} item Peringatan (Caution).`;
    saranKlinis =
      "Disarankan melakukan konsultasi / rujukan ke Poliklinik Tumbuh Kembang / Dokter Spesialis Anak untuk evaluasi diagnostik komprehensif. Lakukan pula stimulasi intensif pada sektor yang mengalami keterlambatan.";
  } else {
    kategori = "normal";
    labelKategori = "NORMAL (Sesuai Usia)";
    penjelasan = `Tidak ditemukan keterlambatan (0 Delay) dan maksimal 1 Caution (${cautionsCount} Caution). Perkembangan anak sesuai tahapan usianya.`;
    saranKlinis =
      "Pertahankan stimulasi tumbuh kembang rutin sesuai tahapan usia di rumah. Lakukan skrining perkembangan berkala berikutnya.";
  }

  return {
    totalItemDiuji: totalDiuji,
    totalPass,
    totalFail,
    totalRefusal,
    totalNoOpportunity,
    cautionsCount,
    delaysCount,
    kategori,
    labelKategori,
    penjelasan,
    saranKlinis,
    evaluasiList,
  };
}
