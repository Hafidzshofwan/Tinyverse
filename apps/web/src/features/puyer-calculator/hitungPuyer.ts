export interface PuyerInput {
  /** Dosis obat yang diinginkan untuk sekali minum (mg). */
  dosisPerKaliMg: number;
  /** Kekuatan satu tablet yang tersedia (mg per tablet). */
  kekuatanTabletMg: number;
  /** Berapa kali obat diberikan dalam sehari (bilangan bulat). */
  frekuensiPerHari: number;
  /** Lama pemberian dalam hari (bilangan bulat). */
  jumlahHari: number;
}

export interface PuyerResult {
  /** Total bungkus yang harus dibuat = frekuensi x hari. */
  totalBungkus: number;
  /** Tablet yang masuk ke tiap bungkus = dosis / kekuatan tablet. */
  tabletPerBungkus: number;
  /** Total tablet yang perlu digerus = tabletPerBungkus x totalBungkus. */
  totalTablet: number;
  /** Peringatan non-fatal untuk membantu pengguna memeriksa hasil. */
  peringatan: string[];
}

function bulatkan(nilai: number, desimal = 3): number {
  const faktor = 10 ** desimal;
  return Math.round(nilai * faktor) / faktor;
}

function kelipatanDari(nilai: number, langkah: number): boolean {
  const rasio = nilai / langkah;
  return Math.abs(rasio - Math.round(rasio)) < 1e-9;
}

/**
 * Fungsi murni: menghitung kebutuhan tablet dan pembagian bungkus untuk
 * peracikan puyer. Tidak melakukan rekomendasi dosis; dosis target adalah
 * input dari pengguna (klinisi). Deterministik dan bebas efek samping.
 */
export function hitungPuyer(input: PuyerInput): PuyerResult {
  const { dosisPerKaliMg, kekuatanTabletMg, frekuensiPerHari, jumlahHari } = input;

  const semua = [dosisPerKaliMg, kekuatanTabletMg, frekuensiPerHari, jumlahHari];
  if (!semua.every((v) => Number.isFinite(v))) {
    throw new Error("Semua nilai harus berupa angka.");
  }
  if (dosisPerKaliMg <= 0) {
    throw new Error("Dosis per kali harus lebih dari 0 mg.");
  }
  if (kekuatanTabletMg <= 0) {
    throw new Error("Kekuatan tablet harus lebih dari 0 mg.");
  }
  if (frekuensiPerHari <= 0 || !Number.isInteger(frekuensiPerHari)) {
    throw new Error("Frekuensi per hari harus bilangan bulat lebih dari 0.");
  }
  if (jumlahHari <= 0 || !Number.isInteger(jumlahHari)) {
    throw new Error("Lama pemberian harus bilangan bulat hari lebih dari 0.");
  }

  const totalBungkus = frekuensiPerHari * jumlahHari;
  const tabletPerBungkus = bulatkan(dosisPerKaliMg / kekuatanTabletMg);
  const totalTablet = bulatkan(tabletPerBungkus * totalBungkus);

  const peringatan: string[] = [];
  if (!kelipatanDari(totalTablet, 0.5)) {
    peringatan.push(
      `Total tablet (${totalTablet}) bukan kelipatan 0,5 sehingga sulit dibagi rata. Pertimbangkan menyesuaikan dosis atau memilih kekuatan tablet lain.`
    );
  }
  if (tabletPerBungkus > 4) {
    peringatan.push(
      `Tablet per bungkus tergolong tinggi (${tabletPerBungkus}). Periksa kembali kekuatan tablet yang dipilih.`
    );
  }
  if (dosisPerKaliMg > kekuatanTabletMg * 10) {
    peringatan.push(
      "Dosis per kali jauh lebih besar dari satu tablet. Pastikan satuan sudah benar (mg)."
    );
  }

  return { totalBungkus, tabletPerBungkus, totalTablet, peringatan };
}
