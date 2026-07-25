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
 * DATABASE 125 ITEM DENVER II RESMI (Frankenburg & Dodds 1990/1992 - Bahasa Indonesia)
 * Terkalibrasi secara presisi sesuai Koordinat & Persentil Grafik Denver II Kemenkes RI / DDST II.
 */
export const DENVER_ITEMS: DenverItem[] = [
  // ==========================================
  // 1. PERSONAL SOSIAL (25 Item)
  // ==========================================
  {
    id: "ps-01",
    sektor: "personal-social",
    namaIndo: "Menatap Muka",
    p25: 0.0,
    p50: 0.1,
    p75: 1.0,
    p90: 1.5,
    petunjuk: "Anak memandang wajah pemeriksa atau ibu saat didekati (jarak ~30 cm).",
    tipe: "keduanya",
  },
  {
    id: "ps-02",
    sektor: "personal-social",
    namaIndo: "Membalas Senyum Pemeriksa",
    p25: 0.5,
    p50: 1.5,
    p75: 2.0,
    p90: 2.2,
    petunjuk: "Pemeriksa tersenyum & bicara pada anak. Anak membalas tersenyum.",
    tipe: "langsung",
  },
  {
    id: "ps-03",
    sektor: "personal-social",
    namaIndo: "Tersenyum Spontan",
    p25: 0.8,
    p50: 1.5,
    p75: 2.2,
    p90: 3.0,
    petunjuk: "Anak tersenyum sendiri tanpa perlu rangsangan langsung fisik/suara.",
    tipe: "keduanya",
  },
  {
    id: "ps-04",
    sektor: "personal-social",
    namaIndo: "Mengamati Tangan Sendiri",
    p25: 1.5,
    p50: 2.5,
    p75: 3.5,
    p90: 4.2,
    petunjuk: "Anak memandangi jarinya atau tangannya sendiri selama beberapa detik.",
    tipe: "keduanya",
  },
  {
    id: "ps-05",
    sektor: "personal-social",
    namaIndo: "Berusaha Mencapai Mainan",
    p25: 3.3,
    p50: 4.5,
    p75: 5.5,
    p90: 6.2,
    petunjuk: "Anak mengulurkan tangan/tubuh berusaha mengambil mainan di luar jangkauannya.",
    tipe: "langsung",
  },
  {
    id: "ps-06",
    sektor: "personal-social",
    namaIndo: "Makan Sendiri (Biskuit/Roti)",
    p25: 4.5,
    p50: 6.0,
    p75: 7.5,
    p90: 8.5,
    petunjuk: "Anak memegang dan memasukkan biskuit/makanan kering ke mulutnya sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-07",
    sektor: "personal-social",
    namaIndo: "Tepuk Tangan",
    p25: 6.0,
    p50: 8.0,
    p75: 9.5,
    p90: 11.0,
    petunjuk: "Anak bertepuk tangan sendiri atau menirukan gerakan tepuk tangan.",
    tipe: "keduanya",
  },
  {
    id: "ps-08",
    sektor: "personal-social",
    namaIndo: "Daag-Daag Dengan Tangan",
    p25: 6.2,
    p50: 8.2,
    p75: 10.0,
    p90: 12.0,
    petunjuk: "Anak melambaikan tangan saat seseorang pamit atau berpisah.",
    tipe: "keduanya",
  },
  {
    id: "ps-09",
    sektor: "personal-social",
    namaIndo: "Menyatakan Keinginan",
    p25: 6.8,
    p50: 9.0,
    p75: 11.5,
    p90: 14.0,
    petunjuk: "Anak menunjukkan apa yang diinginkannya tanpa menangis (menunjuk/bersuara).",
    tipe: "keduanya",
  },
  {
    id: "ps-10",
    sektor: "personal-social",
    namaIndo: "Main Bola Dgn Pemeriksa",
    p25: 7.5,
    p50: 10.0,
    p75: 13.0,
    p90: 16.0,
    petunjuk: "Anak menggelindingkan atau melempar bola kembali ke pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "ps-11",
    sektor: "personal-social",
    namaIndo: "Menirukan Kegiatan Rumah Tangga",
    p25: 8.0,
    p50: 11.0,
    p75: 13.5,
    p90: 16.0,
    petunjuk: "Anak meniru menyapu, mengelap, atau memegang telepon seperti orang dewasa.",
    tipe: "keduanya",
  },
  {
    id: "ps-12",
    sektor: "personal-social",
    namaIndo: "Minum Dengan Cangkir",
    p25: 9.0,
    p50: 12.0,
    p75: 14.5,
    p90: 17.0,
    petunjuk: "Anak memegang cangkir/gelas dan minum tanpa banyak tumpah.",
    tipe: "keduanya",
  },
  {
    id: "ps-13",
    sektor: "personal-social",
    namaIndo: "Membantu Di Rumah",
    p25: 11.0,
    p50: 14.0,
    p75: 17.0,
    p90: 20.0,
    petunjuk: "Anak membantu merapikan mainan atau mengambil barang sesuai instruksi.",
    tipe: "keduanya",
  },
  {
    id: "ps-14",
    sektor: "personal-social",
    namaIndo: "Menggunakan Sendok / Garpu",
    p25: 12.0,
    p50: 15.0,
    p75: 18.0,
    p90: 21.0,
    petunjuk: "Anak menyuap makanan ke mulut dengan sendok/garpu tanpa banyak tumpah.",
    tipe: "keduanya",
  },
  {
    id: "ps-15",
    sektor: "personal-social",
    namaIndo: "Membuka Pakaian",
    p25: 13.5,
    p50: 17.0,
    p75: 20.0,
    p90: 24.0,
    petunjuk: "Anak melepas sepatu, kaus kaki, atau celana sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-16",
    sektor: "personal-social",
    namaIndo: "Menyuapi Boneka",
    p25: 14.5,
    p50: 18.0,
    p75: 21.0,
    p90: 25.0,
    petunjuk: "Anak menyuapkan mainan/sendok ke mulut boneka atau orang lain.",
    tipe: "keduanya",
  },
  {
    id: "ps-17",
    sektor: "personal-social",
    namaIndo: "Memakai Baju",
    p25: 18.0,
    p50: 22.0,
    p75: 27.0,
    p90: 33.0,
    petunjuk: "Anak membantu memakai baju atau memakai pakaian sederhana sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-18",
    sektor: "personal-social",
    namaIndo: "Gosok Gigi Dengan Bantuan",
    p25: 19.0,
    p50: 24.0,
    p75: 30.0,
    p90: 38.0,
    petunjuk: "Anak menggosok gigi sendiri dengan bimbingan/bantuan orang tua.",
    tipe: "keduanya",
  },
  {
    id: "ps-19",
    sektor: "personal-social",
    namaIndo: "Cuci & Mengeringkan Tangan",
    p25: 21.0,
    p50: 27.0,
    p75: 34.0,
    p90: 42.0,
    petunjuk: "Anak mencuci tangan pakai sabun dan mengeringkannya dengan handuk sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-20",
    sektor: "personal-social",
    namaIndo: "Menyebut Nama Teman",
    p25: 25.0,
    p50: 32.0,
    p75: 40.0,
    p90: 48.0,
    petunjuk: "Anak dapat menyebutkan nama minimal 1 teman sebayanya.",
    tipe: "keduanya",
  },
  {
    id: "ps-21",
    sektor: "personal-social",
    namaIndo: "Memakai T-Shirt",
    p25: 28.0,
    p50: 36.0,
    p75: 44.0,
    p90: 52.0,
    petunjuk: "Anak memasukkan kepala dan lengan ke kaus T-Shirt sendiri.",
    tipe: "keduanya",
  },
  {
    id: "ps-22",
    sektor: "personal-social",
    namaIndo: "Berpakaian Tanpa Bantuan",
    p25: 34.0,
    p50: 42.0,
    p75: 52.0,
    p90: 60.0,
    petunjuk: "Anak berpakaian lengkap (termasuk kancing/resleting jika ada) tanpa dibantu.",
    tipe: "keduanya",
  },
  {
    id: "ps-23",
    sektor: "personal-social",
    namaIndo: "Gosok Gigi Tanpa Bantuan",
    p25: 33.0,
    p50: 43.0,
    p75: 54.0,
    p90: 63.0,
    petunjuk: "Anak menyikat gigi dengan bersih tanpa perlu dibantu atau diawasi ketat.",
    tipe: "keduanya",
  },
  {
    id: "ps-24",
    sektor: "personal-social",
    namaIndo: "Bermain Ular Tangga / Kartu",
    p25: 36.0,
    p50: 48.0,
    p75: 58.0,
    p90: 68.0,
    petunjuk: "Anak mengerti aturan permainan giliran seperti ular tangga atau kartu sederhana.",
    tipe: "keduanya",
  },
  {
    id: "ps-25",
    sektor: "personal-social",
    namaIndo: "Mengambil Makan Sendiri",
    p25: 42.0,
    p50: 52.0,
    p75: 63.0,
    p90: 72.0,
    petunjuk: "Anak mengambil nasi/lauk sendiri ke piringnya saat jam makan.",
    tipe: "keduanya",
  },

  // ==========================================
  // 2. ADAPTIF - MOTORIK HALUS (28 Item)
  // ==========================================
  {
    id: "fm-01",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti Ke Garis Tengah",
    p25: 0.1,
    p50: 0.8,
    p75: 1.5,
    p90: 2.2,
    petunjuk: "Anak mengikuti gerak benda merah dari samping menuju garis tengah tubuh.",
    tipe: "langsung",
  },
  {
    id: "fm-02",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti Lewat Garis Tengah",
    p25: 0.5,
    p50: 1.5,
    p75: 2.5,
    p90: 3.2,
    petunjuk: "Mata dan kepala anak mengikuti gerak benda melintasi garis tengah tubuh.",
    tipe: "langsung",
  },
  {
    id: "fm-03",
    sektor: "fine-motor-adaptive",
    namaIndo: "Memegang Icik-Icik",
    p25: 1.0,
    p50: 2.0,
    p75: 3.2,
    p90: 3.8,
    petunjuk: "Anak menggenggam icik-icik (rattle) selama beberapa detik saat disentuhkan.",
    tipe: "langsung",
  },
  {
    id: "fm-04",
    sektor: "fine-motor-adaptive",
    namaIndo: "Tangan Bersentuhan",
    p25: 1.5,
    p50: 2.8,
    p75: 3.8,
    p90: 4.5,
    petunjuk: "Anak membawa kedua tangannya saling bersentuhan di tengah dada.",
    tipe: "langsung",
  },
  {
    id: "fm-05",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengikuti 180°",
    p25: 1.8,
    p50: 2.8,
    p75: 4.0,
    p90: 5.0,
    petunjuk: "Anak mengikuti gerak benda busur 180 derajat dari satu sisi ke sisi lain.",
    tipe: "langsung",
  },
  {
    id: "fm-06",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengamati Manik-Manik",
    p25: 2.5,
    p50: 3.8,
    p75: 5.0,
    p90: 5.8,
    petunjuk: "Anak melihat manik-manik/benda kecil yang diletakkan di meja depan matanya.",
    tipe: "langsung",
  },
  {
    id: "fm-07",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meraih Benda",
    p25: 3.2,
    p50: 4.5,
    p75: 5.5,
    p90: 6.2,
    petunjuk: "Anak mengulurkan tangan dan berusaha memegang benda di depannya.",
    tipe: "langsung",
  },
  {
    id: "fm-08",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencari Benang",
    p25: 4.2,
    p50: 5.5,
    p75: 6.8,
    p90: 7.8,
    petunjuk: "Anak mencari arah jatuhnya gulungan benang wol yang dijatuhkan.",
    tipe: "langsung",
  },
  {
    id: "fm-09",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menggaruk Manik-Manik",
    p25: 4.5,
    p50: 6.0,
    p75: 7.2,
    p90: 8.2,
    petunjuk: "Anak mengambil manik-manik dengan seluruh jemari tangan (raking motion).",
    tipe: "langsung",
  },
  {
    id: "fm-10",
    sektor: "fine-motor-adaptive",
    namaIndo: "Memindahkan Kubus",
    p25: 4.8,
    p50: 6.2,
    p75: 7.5,
    p90: 8.5,
    petunjuk: "Anak memindahkan kubus kayu dari satu tangan ke tangan lainnya.",
    tipe: "langsung",
  },
  {
    id: "fm-11",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mengambil 7 Kubus",
    p25: 5.0,
    p50: 6.8,
    p75: 8.2,
    p90: 9.5,
    petunjuk: "Anak mengambil dan memegang kubus-kubus kecil berturut-turut.",
    tipe: "langsung",
  },
  {
    id: "fm-12",
    sektor: "fine-motor-adaptive",
    namaIndo: "Memegang Dgn Ibu Jari Dan Jari",
    p25: 6.5,
    p50: 8.0,
    p75: 9.5,
    p90: 11.0,
    petunjuk: "Anak menjepit manik-manik dengan ujung ibu jari dan jari telunjuk (pincer grasp).",
    tipe: "langsung",
  },
  {
    id: "fm-13",
    sektor: "fine-motor-adaptive",
    namaIndo: "Membenturkan 2 Kubus",
    p25: 7.0,
    p50: 9.0,
    p75: 11.0,
    p90: 12.5,
    petunjuk: "Anak memegang 2 kubus di kedua tangan dan membenturkannya satu sama lain.",
    tipe: "langsung",
  },
  {
    id: "fm-14",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menaruh Kubus Di Cangkir",
    p25: 8.0,
    p50: 10.0,
    p75: 12.0,
    p90: 14.0,
    petunjuk: "Anak memasukkan kubus kayu ke dalam cangkir/gelas plastik.",
    tipe: "langsung",
  },
  {
    id: "fm-15",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencorat-Coret",
    p25: 11.0,
    p50: 14.0,
    p75: 17.0,
    p90: 20.0,
    petunjuk: "Anak menggoreskan pensil/krayon di kertas membentuk coretan.",
    tipe: "langsung",
  },
  {
    id: "fm-16",
    sektor: "fine-motor-adaptive",
    namaIndo: "Ambil Manik Ditunjukkan",
    p25: 11.5,
    p50: 15.0,
    p75: 18.0,
    p90: 22.0,
    petunjuk: "Anak mengambil manik-manik tepat saat diperintahkan/ditunjukkan.",
    tipe: "langsung",
  },
  {
    id: "fm-17",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menara Dari 2 Kubus",
    p25: 12.0,
    p50: 16.0,
    p75: 19.0,
    p90: 23.0,
    petunjuk: "Anak menumpuk 2 kubus kayu secara seimbang tanpa jatuh.",
    tipe: "langsung",
  },
  {
    id: "fm-18",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menara Dari 4 Kubus",
    p25: 15.0,
    p50: 19.0,
    p75: 23.0,
    p90: 28.0,
    petunjuk: "Anak menumpuk 4 kubus kayu secara bertingkat.",
    tipe: "langsung",
  },
  {
    id: "fm-19",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menara Dari 6 Kubus",
    p25: 18.0,
    p50: 23.0,
    p75: 29.0,
    p90: 35.0,
    petunjuk: "Anak menumpuk 6 kubus kayu ke atas tanpa roboh.",
    tipe: "langsung",
  },
  {
    id: "fm-20",
    sektor: "fine-motor-adaptive",
    namaIndo: "Meniru Garis Vertikal",
    p25: 18.0,
    p50: 24.0,
    p75: 30.0,
    p90: 36.0,
    petunjuk: "Anak menggambar garis lurus vertikal menirukan contoh contoh pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "fm-21",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menggoyangkan Ibu Jari",
    p25: 22.0,
    p50: 29.0,
    p75: 36.0,
    p90: 44.0,
    petunjuk: "Anak mengepalkan tangan lalu menggoyangkan ibu jarinya.",
    tipe: "langsung",
  },
  {
    id: "fm-22",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencontoh Lingkaran (O)",
    p25: 27.0,
    p50: 34.0,
    p75: 42.0,
    p90: 50.0,
    petunjuk: "Anak menggambar bentuk lingkaran yang tertutup mencontoh gambar O.",
    tipe: "langsung",
  },
  {
    id: "fm-23",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menggambar Orang 3 Bagian",
    p25: 33.0,
    p50: 42.0,
    p75: 50.0,
    p90: 58.0,
    petunjuk: "Anak menggambar sosok manusia dengan minimal 3 bagian tubuh (mis. kepala, mata, kaki).",
    tipe: "langsung",
  },
  {
    id: "fm-24",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencontoh Tanda Plus (+)",
    p25: 33.0,
    p50: 42.0,
    p75: 51.0,
    p90: 59.0,
    petunjuk: "Anak menggambar dua garis silang tegak lurus mencontoh (+).",
    tipe: "langsung",
  },
  {
    id: "fm-25",
    sektor: "fine-motor-adaptive",
    namaIndo: "Memilih Garis Yang Lebih Panjang",
    p25: 32.0,
    p50: 40.0,
    p75: 49.0,
    p90: 57.0,
    petunjuk: "Anak menunjuk garis mana yang lebih panjang dari 2 garis paralel.",
    tipe: "langsung",
  },
  {
    id: "fm-26",
    sektor: "fine-motor-adaptive",
    namaIndo: "Menggambar Orang 6 Bagian",
    p25: 42.0,
    p50: 51.0,
    p75: 60.0,
    p90: 70.0,
    petunjuk: "Anak menggambar manusia dengan minimal 6 bagian tubuh jelas.",
    tipe: "langsung",
  },
  {
    id: "fm-27",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencontoh Persegi Ditunjukkan",
    p25: 40.0,
    p50: 50.0,
    p75: 59.0,
    p90: 68.0,
    petunjuk: "Anak menggambar bentuk persegi setelah dicontohkan cara membuatnya oleh pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "fm-28",
    sektor: "fine-motor-adaptive",
    namaIndo: "Mencontoh Persegi (Tanpa Ditunjukkan)",
    p25: 46.0,
    p50: 56.0,
    p75: 65.0,
    p90: 72.0,
    petunjuk: "Anak mencontoh gambar persegi langsung tanpa peragaan pemeriksa.",
    tipe: "langsung",
  },

  // ==========================================
  // 3. BAHASA & BICARA (39 Item)
  // ==========================================
  {
    id: "lang-01",
    sektor: "language",
    namaIndo: "Bereaksi Thd Bel",
    p25: 0.1,
    p50: 0.5,
    p75: 1.2,
    p90: 2.0,
    petunjuk: "Anak menunjukkan gerakan kaget, berkedip, atau perubahan napas saat bel dibunyikan.",
    tipe: "langsung",
  },
  {
    id: "lang-02",
    sektor: "language",
    namaIndo: "Bersuara",
    p25: 0.2,
    p50: 1.0,
    p75: 1.8,
    p90: 2.5,
    petunjuk: "Anak mengeluarkan bunyi-bunyi vokal selain tangisan.",
    tipe: "keduanya",
  },
  {
    id: "lang-03",
    sektor: "language",
    namaIndo: "Vokal Ooo / Aah",
    p25: 0.5,
    p50: 1.5,
    p75: 2.2,
    p90: 3.0,
    petunjuk: "Anak meracik suara vokal panjang gembira seperti 'oooh', 'aaah', 'guuu'.",
    tipe: "keduanya",
  },
  {
    id: "lang-04",
    sektor: "language",
    namaIndo: "Tertawa",
    p25: 1.2,
    p50: 2.2,
    p75: 3.2,
    p90: 4.0,
    petunjuk: "Anak tertawa terbahak-bahak atau bersuara keras saat diajak bercanda.",
    tipe: "keduanya",
  },
  {
    id: "lang-05",
    sektor: "language",
    namaIndo: "Berteriak",
    p25: 1.5,
    p50: 2.8,
    p75: 4.0,
    p90: 5.0,
    petunjuk: "Anak mengeluarkan suara teriakan tinggi gembira.",
    tipe: "keduanya",
  },
  {
    id: "lang-06",
    sektor: "language",
    namaIndo: "Menoleh Ke Bunyi Icik-Icik",
    p25: 2.5,
    p50: 3.8,
    p75: 5.0,
    p90: 6.0,
    petunjuk: "Anak menolehkan mata/kepala ke sumber bunyi icik-icik di sampingnya.",
    tipe: "langsung",
  },
  {
    id: "lang-07",
    sektor: "language",
    namaIndo: "Menoleh Ke Arah Suara",
    p25: 3.2,
    p50: 4.5,
    p75: 5.8,
    p90: 7.0,
    petunjuk: "Anak memalingkan muka langsung ke arah orang yang sedang berbicara.",
    tipe: "langsung",
  },
  {
    id: "lang-08",
    sektor: "language",
    namaIndo: "Satu Silabel",
    p25: 4.0,
    p50: 5.5,
    p75: 7.0,
    p90: 8.0,
    petunjuk: "Anak mengucapkan 1 suku kata konsonan-vokal (mis. 'ba', 'da', 'ma').",
    tipe: "keduanya",
  },
  {
    id: "lang-09",
    sektor: "language",
    namaIndo: "Meniru Bunyi Kata-Kata",
    p25: 5.0,
    p50: 6.5,
    p75: 8.0,
    p90: 9.5,
    petunjuk: "Anak berusaha menirukan irama atau bunyi kata yang diucapkan orang dewasa.",
    tipe: "keduanya",
  },
  {
    id: "lang-10",
    sektor: "language",
    namaIndo: "Kombinasi Silabel",
    p25: 5.5,
    p50: 7.0,
    p75: 8.5,
    p90: 10.0,
    petunjuk: "Anak mengulang suku kata berbeda (mis. 'ba-da', 'ga-ma').",
    tipe: "keduanya",
  },
  {
    id: "lang-11",
    sektor: "language",
    namaIndo: "Mengoceh (Babbles)",
    p25: 5.5,
    p50: 7.2,
    p75: 9.0,
    p90: 10.5,
    petunjuk: "Anak mengoceh panjang dengan intonasi seperti berbicara.",
    tipe: "keduanya",
  },
  {
    id: "lang-12",
    sektor: "language",
    namaIndo: "Papa / Mama Tidak Spesifik",
    p25: 6.0,
    p50: 7.8,
    p75: 9.5,
    p90: 11.5,
    petunjuk: "Anak mengucapkan 'pa-pa' atau 'ma-ma' tanpa ditujukan khusus ke ortunya.",
    tipe: "keduanya",
  },
  {
    id: "lang-13",
    sektor: "language",
    namaIndo: "Papa / Mama Spesifik",
    p25: 8.0,
    p50: 10.0,
    p75: 12.5,
    p90: 14.5,
    petunjuk: "Anak memanggil 'Papa' khusus ke ayah atau 'Mama' khusus ke ibu.",
    tipe: "keduanya",
  },
  {
    id: "lang-14",
    sektor: "language",
    namaIndo: "Menyebut 1 Kata Berarti",
    p25: 10.0,
    p50: 12.5,
    p75: 15.0,
    p90: 17.5,
    petunjuk: "Anak memiliki 1 kata spesifik selain mama/papa (mis. 'cucu', 'mew', 'mimi').",
    tipe: "keduanya",
  },
  {
    id: "lang-15",
    sektor: "language",
    namaIndo: "Menyebut 2 Kata Berarti",
    p25: 11.5,
    p50: 14.5,
    p75: 17.5,
    p90: 20.5,
    petunjuk: "Anak menguasai kosakata minimal 2 kata yang jelas artinya.",
    tipe: "keduanya",
  },
  {
    id: "lang-16",
    sektor: "language",
    namaIndo: "Menyebut 3 Kata Berarti",
    p25: 12.5,
    p50: 15.5,
    p75: 19.0,
    p90: 22.5,
    petunjuk: "Anak menguasai kosakata minimal 3 kata bermakna.",
    tipe: "keduanya",
  },
  {
    id: "lang-17",
    sektor: "language",
    namaIndo: "Menyebut 6 Kata Berarti",
    p25: 14.5,
    p50: 18.0,
    p75: 21.5,
    p90: 25.5,
    petunjuk: "Anak mengucapkan minimal 6 kata tunggal bermakna.",
    tipe: "keduanya",
  },
  {
    id: "lang-18",
    sektor: "language",
    namaIndo: "Menunjuk 2 Gambar",
    p25: 15.0,
    p50: 19.0,
    p75: 23.0,
    p90: 27.0,
    petunjuk: "Anak menunjuk 2 gambar objek yang disebutkan (mis. kucing, burung, kuda).",
    tipe: "langsung",
  },
  {
    id: "lang-19",
    sektor: "language",
    namaIndo: "Kombinasi Kata",
    p25: 16.0,
    p50: 20.5,
    p75: 24.5,
    p90: 29.0,
    petunjuk: "Anak menggabungkan 2 kata menjadi kalimat sederhana (mis. 'mau minum', 'papa pergi').",
    tipe: "keduanya",
  },
  {
    id: "lang-20",
    sektor: "language",
    namaIndo: "Menyebut 1 Gambar",
    p25: 16.5,
    p50: 21.0,
    p75: 25.5,
    p90: 30.0,
    petunjuk: "Anak menyebut nama benda/hewan pada gambar yang ditunjuk pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "lang-21",
    sektor: "language",
    namaIndo: "Menunjuk 6 Bagian Badan",
    p25: 17.5,
    p50: 22.5,
    p75: 27.0,
    p90: 32.0,
    petunjuk: "Anak menunjuk minimal 6 anggota tubuhnya sendiri saat ditanya (mata, hidung, kaki, dll).",
    tipe: "langsung",
  },
  {
    id: "lang-22",
    sektor: "language",
    namaIndo: "Menunjuk 4 Gambar",
    p25: 19.0,
    p50: 24.0,
    p75: 29.0,
    p90: 35.0,
    petunjuk: "Anak menunjuk dengan tepat 4 gambar objek saat diminta.",
    tipe: "langsung",
  },
  {
    id: "lang-23",
    sektor: "language",
    namaIndo: "Bicara Dengan Dimengerti (Sebagian)",
    p25: 19.5,
    p50: 24.5,
    p75: 30.0,
    p90: 36.0,
    petunjuk: "Ucapan anak dapat dipahami minimal setengahnya oleh orang yang tidak dikenal.",
    tipe: "keduanya",
  },
  {
    id: "lang-24",
    sektor: "language",
    namaIndo: "Menyebut 4 Gambar",
    p25: 21.0,
    p50: 26.5,
    p75: 32.0,
    p90: 38.0,
    petunjuk: "Anak menyebut nama 4 objek gambar yang ditunjukkan pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "lang-25",
    sektor: "language",
    namaIndo: "Mengetahui 2 Kegiatan",
    p25: 23.0,
    p50: 29.0,
    p75: 35.0,
    p90: 42.0,
    petunjuk: "Anak menjawab fungsi kegiatan (mis. 'apa yang dilakukan kalau lapar/mengantuk').",
    tipe: "langsung",
  },
  {
    id: "lang-26",
    sektor: "language",
    namaIndo: "Mengerti 2 Kata Sifat",
    p25: 25.0,
    p50: 31.0,
    p75: 38.0,
    p90: 45.0,
    petunjuk: "Anak memahami lawan kata sifat (dingin, panas, lelah, lapar).",
    tipe: "langsung",
  },
  {
    id: "lang-27",
    sektor: "language",
    namaIndo: "Menyebut 1 Warna",
    p25: 26.0,
    p50: 32.5,
    p75: 39.0,
    p90: 46.0,
    petunjuk: "Anak mampu menyebut nama 1 warna balok/kertas dengan tepat.",
    tipe: "langsung",
  },
  {
    id: "lang-28",
    sektor: "language",
    namaIndo: "Kegunaan 2 Benda",
    p25: 27.0,
    p50: 34.0,
    p75: 41.0,
    p90: 48.0,
    petunjuk: "Anak menjelaskan fungsi 2 benda sehari-hari (mis. cangkir untuk minum, pensil untuk menulis).",
    tipe: "langsung",
  },
  {
    id: "lang-29",
    sektor: "language",
    namaIndo: "Menghitung 1 Kubus",
    p25: 28.0,
    p50: 35.0,
    p75: 42.0,
    p90: 50.0,
    petunjuk: "Anak mengambil atau menunjuk tepat 1 kubus saat diminta 'berikan satu'.",
    tipe: "langsung",
  },
  {
    id: "lang-30",
    sektor: "language",
    namaIndo: "Kegunaan 3 Benda",
    p25: 29.0,
    p50: 36.5,
    p75: 44.0,
    p90: 52.0,
    petunjuk: "Anak menjelaskan kegunaan minimal 3 benda umum.",
    tipe: "langsung",
  },
  {
    id: "lang-31",
    sektor: "language",
    namaIndo: "Mengetahui 4 Kegiatan",
    p25: 30.0,
    p50: 38.0,
    p75: 46.0,
    p90: 54.0,
    petunjuk: "Anak menjawab pertanyaan fungsi 4 kegiatan sehari-hari.",
    tipe: "langsung",
  },
  {
    id: "lang-32",
    sektor: "language",
    namaIndo: "Bicara Semua Dimengerti",
    p25: 30.5,
    p50: 38.5,
    p75: 46.5,
    p90: 55.0,
    petunjuk: "Seluruh kata dan perkataan anak mudah dipahami orang asing tanpa kebingungan.",
    tipe: "keduanya",
  },
  {
    id: "lang-33",
    sektor: "language",
    namaIndo: "Mengerti 4 Kata Depan",
    p25: 31.0,
    p50: 39.0,
    p75: 47.0,
    p90: 56.0,
    petunjuk: "Anak menaruh kubus sesuai perintah kata depan: 'di atas', 'di bawah', 'di depan', 'di belakang'.",
    tipe: "langsung",
  },
  {
    id: "lang-34",
    sektor: "language",
    namaIndo: "Menyebut 4 Warna",
    p25: 32.0,
    p50: 41.0,
    p75: 49.0,
    p90: 58.0,
    petunjuk: "Anak dapat menyebutkan dengan benar 4 warna dasar (merah, kuning, hijau, biru).",
    tipe: "langsung",
  },
  {
    id: "lang-35",
    sektor: "language",
    namaIndo: "Mengerti 5 Kata Sifat / Benda",
    p25: 33.0,
    p50: 42.0,
    p75: 51.0,
    p90: 60.0,
    petunjuk: "Anak menjelaskan makna atau fungsi 5 kata umum.",
    tipe: "langsung",
  },
  {
    id: "lang-36",
    sektor: "language",
    namaIndo: "Mengetahui 3 Kata Sifat",
    p25: 34.0,
    p50: 43.0,
    p75: 52.0,
    p90: 61.0,
    petunjuk: "Anak merespons pertanyaan tentang 3 kondisi fisik/perasaan.",
    tipe: "langsung",
  },
  {
    id: "lang-37",
    sektor: "language",
    namaIndo: "Menghitung 5 Kubus",
    p25: 38.0,
    p50: 47.0,
    p75: 56.0,
    p90: 65.0,
    petunjuk: "Anak menghitung keras 5 kubus secara berurutan dan benar.",
    tipe: "langsung",
  },
  {
    id: "lang-38",
    sektor: "language",
    namaIndo: "Berlawanan 2 (Lawan Kata)",
    p25: 39.0,
    p50: 48.0,
    p75: 57.0,
    p90: 66.0,
    petunjuk: "Anak melengkapi kalimat lawan kata (mis. 'Kuda itu besar, tikus itu...').",
    tipe: "langsung",
  },
  {
    id: "lang-39",
    sektor: "language",
    namaIndo: "Mengartikan 7 Kata",
    p25: 42.0,
    p50: 52.0,
    p75: 62.0,
    p90: 72.0,
    petunjuk: "Anak dapat memberikan arti/deskripsi sederhana untuk 7 kata dasar.",
    tipe: "langsung",
  },

  // ==========================================
  // 4. MOTORIK KASAR (33 Item)
  // ==========================================
  {
    id: "gm-01",
    sektor: "gross-motor",
    namaIndo: "Gerakan Seimbang Lengan & Kaki",
    p25: 0.1,
    p50: 0.5,
    p75: 1.2,
    p90: 2.0,
    petunjuk: "Bayi menggerakkan kedua lengan dan kedua kakinya secara aktif dan seimbang saat telentang.",
    tipe: "langsung",
  },
  {
    id: "gm-02",
    sektor: "gross-motor",
    namaIndo: "Mengangkat Kepala Sebentar",
    p25: 0.2,
    p50: 1.0,
    p75: 1.8,
    p90: 2.5,
    petunjuk: "Saat tengkurap, bayi mengangkat dagu/kepalanya sesaat dari permukaan meja.",
    tipe: "langsung",
  },
  {
    id: "gm-03",
    sektor: "gross-motor",
    namaIndo: "Kepala Terangkat 45°",
    p25: 0.5,
    p50: 1.5,
    p75: 2.5,
    p90: 3.2,
    petunjuk: "Saat tengkurap, bayi mampu mengangkat kepala membentuk sudut 45 derajat.",
    tipe: "langsung",
  },
  {
    id: "gm-04",
    sektor: "gross-motor",
    namaIndo: "Kepala Terangkat 90°",
    p25: 1.2,
    p50: 2.2,
    p75: 3.2,
    p90: 4.0,
    petunjuk: "Saat tengkurap, bayi mengangkat kepala dan dada hingga tegak lurus 90 derajat.",
    tipe: "langsung",
  },
  {
    id: "gm-05",
    sektor: "gross-motor",
    namaIndo: "Duduk Kepala Tegak",
    p25: 1.5,
    p50: 2.8,
    p75: 3.8,
    p90: 4.5,
    petunjuk: "Saat didudukkan, kepala bayi tegak dan stabil tanpa terkulai.",
    tipe: "langsung",
  },
  {
    id: "gm-06",
    sektor: "gross-motor",
    namaIndo: "Menumpu Beban Pada Kaki",
    p25: 2.0,
    p50: 3.2,
    p75: 4.5,
    p90: 5.5,
    petunjuk: "Saat dipegang berdiri, bayi menopang sebagian berat tubuhnya pada kedua kaki.",
    tipe: "langsung",
  },
  {
    id: "gm-07",
    sektor: "gross-motor",
    namaIndo: "Dada Terangkat Menumpu Lengan",
    p25: 2.2,
    p50: 3.5,
    p75: 4.8,
    p90: 5.8,
    petunjuk: "Saat tengkurap, bayi mengangkat dada menopang diri pada kedua lengan depan.",
    tipe: "langsung",
  },
  {
    id: "gm-08",
    sektor: "gross-motor",
    namaIndo: "Membalik (Tengkurap / Telentang)",
    p25: 2.5,
    p50: 4.0,
    p75: 5.2,
    p90: 6.2,
    petunjuk: "Bayi berguling dari tengkurap ke telentang atau sebaliknya.",
    tipe: "keduanya",
  },
  {
    id: "gm-09",
    sektor: "gross-motor",
    namaIndo: "Bangkit Kepala Tegak (Pull to Sit)",
    p25: 3.2,
    p50: 4.5,
    p75: 5.8,
    p90: 6.8,
    petunjuk: "Saat ditarik duduk dari posisi telentang, kepala tidak tertinggal di belakang.",
    tipe: "langsung",
  },
  {
    id: "gm-10",
    sektor: "gross-motor",
    namaIndo: "Duduk Tanpa Pegangan",
    p25: 5.0,
    p50: 6.2,
    p75: 7.5,
    p90: 8.8,
    petunjuk: "Anak duduk stabil tanpa ditopang tangan atau disangga bantal.",
    tipe: "langsung",
  },
  {
    id: "gm-11",
    sektor: "gross-motor",
    namaIndo: "Berdiri Dengan Pegangan",
    p25: 6.0,
    p50: 7.5,
    p75: 9.2,
    p90: 10.5,
    petunjuk: "Anak berdiri berpegangan pada perabot atau tangan orang tua.",
    tipe: "langsung",
  },
  {
    id: "gm-12",
    sektor: "gross-motor",
    namaIndo: "Bangkit Untuk Berdiri",
    p25: 6.8,
    p50: 8.5,
    p75: 10.2,
    p90: 12.0,
    petunjuk: "Anak merambat memegang perabot berdiri sendiri dari posisi duduk.",
    tipe: "langsung",
  },
  {
    id: "gm-13",
    sektor: "gross-motor",
    namaIndo: "Bangkit Terus Duduk",
    p25: 7.0,
    p50: 8.8,
    p75: 10.8,
    p90: 12.5,
    petunjuk: "Anak mampu bangun sendiri dari posisi tidur menjadi duduk tegak.",
    tipe: "langsung",
  },
  {
    id: "gm-14",
    sektor: "gross-motor",
    namaIndo: "Berdiri Tanpa Pegangan 2 Detik",
    p25: 8.8,
    p50: 10.8,
    p75: 12.8,
    p90: 14.0,
    petunjuk: "Anak berdiri tegak lepas tangan minimal selama 2 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-15",
    sektor: "gross-motor",
    namaIndo: "Berdiri Sendiri Dengan Mandiri",
    p25: 10.0,
    p50: 11.8,
    p75: 13.8,
    p90: 15.0,
    petunjuk: "Anak berdiri seimbang mandiri tanpa bantuan berulang kali.",
    tipe: "langsung",
  },
  {
    id: "gm-16",
    sektor: "gross-motor",
    namaIndo: "Membungkuk Kmd Berdiri Kembali",
    p25: 10.8,
    p50: 12.8,
    p75: 14.8,
    p90: 16.5,
    petunjuk: "Anak membungkuk mengambil mainan di lantai lalu berdiri kembali tanpa jatuh.",
    tipe: "langsung",
  },
  {
    id: "gm-17",
    sektor: "gross-motor",
    namaIndo: "Berjalan Dengan Baik",
    p25: 11.2,
    p50: 13.2,
    p75: 15.2,
    p90: 17.0,
    petunjuk: "Anak berjalan lancar seimbang tanpa terjatuh atau sempoyongan.",
    tipe: "langsung",
  },
  {
    id: "gm-18",
    sektor: "gross-motor",
    namaIndo: "Berjalan Mundur",
    p25: 12.5,
    p50: 15.0,
    p75: 17.5,
    p90: 20.0,
    petunjuk: "Anak mampu berjalan mundur 2-3 langkah tanpa kehilangan keseimbangan.",
    tipe: "langsung",
  },
  {
    id: "gm-19",
    sektor: "gross-motor",
    namaIndo: "Lari Berlari",
    p25: 13.5,
    p50: 16.5,
    p75: 19.5,
    p90: 22.5,
    petunjuk: "Anak berlari tanpa terjatuh kaku.",
    tipe: "langsung",
  },
  {
    id: "gm-20",
    sektor: "gross-motor",
    namaIndo: "Berjalan Naik Tangga",
    p25: 14.0,
    p50: 17.5,
    p75: 21.0,
    p90: 25.0,
    petunjuk: "Anak berjalan menaiki anak tangga (boleh berpegangan pada dinding/railing).",
    tipe: "keduanya",
  },
  {
    id: "gm-21",
    sektor: "gross-motor",
    namaIndo: "Menendang Bola Ke Depan",
    p25: 15.0,
    p50: 18.5,
    p75: 22.5,
    p90: 26.0,
    petunjuk: "Anak mengayunkan kaki menendang bola ke depan tanpa terjatuh.",
    tipe: "langsung",
  },
  {
    id: "gm-22",
    sektor: "gross-motor",
    namaIndo: "Melompat Kedua Kaki",
    p25: 16.0,
    p50: 20.0,
    p75: 24.0,
    p90: 28.0,
    petunjuk: "Anak melompat dengan kedua kaki terangkat bersamaan dari lantai.",
    tipe: "langsung",
  },
  {
    id: "gm-23",
    sektor: "gross-motor",
    namaIndo: "Melempar Bola Lengan Ke Atas",
    p25: 17.0,
    p50: 21.0,
    p75: 25.5,
    p90: 30.0,
    petunjuk: "Anak melempar bola kecil dengan ayunan lengan dari atas bahu ke arah pemeriksa.",
    tipe: "langsung",
  },
  {
    id: "gm-24",
    sektor: "gross-motor",
    namaIndo: "Loncat Jauh Ke Depan",
    p25: 21.0,
    p50: 27.0,
    p75: 33.0,
    p90: 39.0,
    petunjuk: "Anak meloncat ke depan mendarat dengan dua kaki melompati kertas.",
    tipe: "langsung",
  },
  {
    id: "gm-25",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 1 Detik",
    p25: 22.0,
    p50: 28.0,
    p75: 34.0,
    p90: 41.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama minimal 1 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-26",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 2 Detik",
    p25: 26.0,
    p50: 33.0,
    p75: 40.0,
    p90: 48.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama minimal 2 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-27",
    sektor: "gross-motor",
    namaIndo: "Melompat Dengan 1 Kaki",
    p25: 30.0,
    p50: 38.0,
    p75: 46.0,
    p90: 54.0,
    petunjuk: "Anak melompat-lompat (engklek) pada 1 kaki minimal 1-2 kali lompatan.",
    tipe: "langsung",
  },
  {
    id: "gm-28",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 3 Detik",
    p25: 32.0,
    p50: 40.0,
    p75: 48.0,
    p90: 56.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama minimal 3 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-29",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 4 Detik",
    p25: 34.0,
    p50: 43.0,
    p75: 51.0,
    p90: 60.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama minimal 4 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-30",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 5 Detik",
    p25: 36.0,
    p50: 45.0,
    p75: 54.0,
    p90: 63.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama minimal 5 detik.",
    tipe: "langsung",
  },
  {
    id: "gm-31",
    sektor: "gross-motor",
    namaIndo: "Berjalan Tumit Ke Jari Kaki",
    p25: 38.0,
    p50: 48.0,
    p75: 58.0,
    p90: 68.0,
    petunjuk: "Anak berjalan lurus dengan meletakkan tumit tepat menyentuh jari kaki belakang (tandem walking).",
    tipe: "langsung",
  },
  {
    id: "gm-32",
    sektor: "gross-motor",
    namaIndo: "Berdiri 1 Kaki 6 Detik",
    p25: 42.0,
    p50: 52.0,
    p75: 62.0,
    p90: 72.0,
    petunjuk: "Anak berdiri seimbang pada 1 kaki selama 6 detik penuh.",
    tipe: "langsung",
  },
  {
    id: "gm-33",
    sektor: "gross-motor",
    namaIndo: "Duduk Tanpa Pegangan / Bangkit Duduk Mandiri",
    p25: 3.5,
    p50: 5.0,
    p75: 6.5,
    p90: 8.0,
    petunjuk: "Anak dapat menyangga kepala dan tubuh saat didudukkan secara stabil.",
    tipe: "langsung",
  },
];

/**
 * Filter item Denver II yang perlu diuji berdasarkan garis usia anak dalam bulan
 */
export function getDenverItemsForAge(ageMonths: number): DenverItem[] {
  // Ambil item yang p25 <= (ageMonths + 8) DAN p90 >= (ageMonths - 14)
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
    const prevMonth = new Date(test.getFullYear(), test.getMonth(), 0);
    d += prevMonth.getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  const rawBulan = y * 12 + m + d / 30.4375;

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
        statusLabel = "advanced";
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
