/**
 * Penentu tampilan pengingat masa langganan.
 *
 * Fungsi di berkas ini MURNI: tidak menyentuh Firestore, cookie, jam sistem,
 * maupun localStorage. Waktu sekarang selalu dititipkan dari luar sebagai
 * parameter.
 *
 * WHY: pengingat menyangkut uang dan kepercayaan. Pengingat yang muncul terlalu
 * dini terasa seperti berjualan, dan yang muncul terlambat membuat pelanggan
 * kehilangan akses tanpa peringatan. Karena murni, seluruh kasus pinggirnya
 * bisa dibuktikan lewat uji otomatis tanpa perlu menunggu tanggal tertentu.
 *
 * Berkas ini TIDAK pernah menentukan boleh atau tidaknya seseorang memakai
 * fitur berbayar. Keputusan itu tetap milik `hitungEntitlement` di
 * @tinyverse/billing dan gerbang Server Component di /preview. Di sini hanya
 * soal apa yang ditampilkan.
 */

/** Jenis pengingat; menentukan warna dan nada kalimatnya. */
export type NadaPengingat = "peringatan" | "berakhir";

export type Pengingat = {
  nada: NadaPengingat;
  judul: string;
  pesan: string;
  /** Sisa hari yang dibulatkan ke atas; 0 bila sudah berakhir. */
  sisaHari: number;
  /**
   * Penanda untuk mengingat bahwa pengguna sudah menutup spanduk ini.
   * Mengandung tanggal, sehingga spanduk yang ditutup hari ini akan muncul
   * kembali besok. Pengguna yang sedang memeriksa pasien boleh menyingkirkan
   * pita ini, tetapi tidak boleh membungkamnya selamanya.
   */
  kunci: string;
};

/** Bagian dari Entitlement yang benar-benar dibutuhkan pengingat. */
export type SumberPengingat = {
  status: "belum" | "aktif" | "kedaluwarsa";
  berakhirPada: string | null;
};

/** Pengingat mulai tampil ketika sisa masa aktif tinggal sekian hari. */
export const BATAS_HARI_PENGINGAT = 7;

const MS_PER_HARI = 86_400_000;

/**
 * Sisa hari menuju `berakhir`, dibulatkan KE ATAS.
 *
 * Pembulatan ke atas dipilih supaya sisa 4 jam tetap dibaca sebagai "1 hari",
 * bukan "0 hari". Membulatkan ke bawah akan menampilkan angka nol pada hari
 * terakhir, dan angka nol terbaca seperti sudah berakhir padahal belum.
 *
 * Mengembalikan null bila salah satu tanggal tidak bisa dibaca. Tanggal rusak
 * lebih baik berujung tanpa pengingat daripada pengingat dengan angka ngawur.
 */
export function sisaHariSampai(
  sekarang: string,
  berakhir: string
): number | null {
  const mulaiMs = Date.parse(sekarang);
  const akhirMs = Date.parse(berakhir);
  if (!Number.isFinite(mulaiMs) || !Number.isFinite(akhirMs)) return null;
  return Math.ceil((akhirMs - mulaiMs) / MS_PER_HARI);
}

function kunciTutup(nada: NadaPengingat, sekarang: string): string {
  return `tv-spanduk-langganan__${nada}__${sekarang.slice(0, 10)}`;
}

/**
 * Tentukan spanduk apa yang perlu ditampilkan, atau null bila tidak ada.
 *
 * Pengguna yang belum pernah berlangganan sengaja TIDAK diberi spanduk. Mereka
 * sudah bertemu halaman penawaran setiap kali membuka alat klinis; menambah
 * pita di setiap halaman hanya akan terasa seperti iklan.
 */
export function hitungPengingat(
  sumber: SumberPengingat,
  sekarang: string
): Pengingat | null {
  if (sumber.status === "belum") return null;

  if (sumber.status === "kedaluwarsa") {
    return {
      nada: "berakhir",
      judul: "Masa langganan Anda telah berakhir",
      pesan:
        "Perpanjang untuk membuka kembali seluruh alat klinis. Data pasien yang sudah Anda simpan tetap utuh.",
      sisaHari: 0,
      kunci: kunciTutup("berakhir", sekarang),
    };
  }

  if (!sumber.berakhirPada) return null;

  const hari = sisaHariSampai(sekarang, sumber.berakhirPada);
  if (hari === null) return null;
  if (hari > BATAS_HARI_PENGINGAT) return null;

  /* Jam server dan jam penyimpanan bisa berselisih beberapa detik, sehingga
     langganan yang masih berstatus aktif kadang menghasilkan angka nol atau
     minus. Ditahan di angka 1 agar kalimatnya tetap masuk akal. */
  const sisa = Math.max(1, hari);

  return {
    nada: "peringatan",
    judul:
      sisa === 1
        ? "Langganan berakhir kurang dari 24 jam lagi"
        : `Langganan berakhir ${sisa} hari lagi`,
    pesan:
      "Perpanjang sekarang agar alat klinis tidak terputus saat Anda sedang membutuhkannya.",
    sisaHari: sisa,
    kunci: kunciTutup("peringatan", sekarang),
  };
}
