/**
 * Interpretasi hasil plotting — fungsi MURNI, port persis dari mesin v17
 * (public/growth-tool.html).
 *
 * Dua jalur berbeda, sesuai standar yang dipilih pengguna:
 *  - WHO  : Z-score terhadap 7 garis SD, kategori mengikuti Permenkes RI
 *           No. 2 Tahun 2020 tentang Standar Antropometri Anak.
 *  - CDC  : persen terhadap median/P50 (pendekatan Waterlow).
 *
 * Seluruh ambang batas, urutan perbandingan, dan teks status disalin apa
 * adanya. Perangkat lunak medis: satu pergeseran ambang mengubah diagnosis.
 */
import { TK_CDC_P50 } from "./chartConfig";
import { TK_ZSCORE_TABLES } from "./zscoreTables";
import {
  tkHitungZscoreNumerik,
  tkInterpolasiZscoreRow,
  tkUsiaDiLuarTabel,
  ZscoreTable,
} from "./zscore";
import {
  WHO_BBPB_MALE_45_110,
  WHO_BBPB_FEMALE_45_110,
  WHO_BBTB_MALE_65_120,
  WHO_BBTB_FEMALE_65_120,
} from "./bbpbTabel";

/**
 * Tabel BB/PB & BB/TB. Sumbu X-nya SENTIMETER, bukan bulan, sehingga tidak
 * ikut ke dalam TK_ZSCORE_TABLES yang seluruhnya berbasis umur. Kuncinya pun
 * tanpa kelompok umur: yang menentukan tabel adalah CARA UKUR, bukan umur.
 * Angkanya diimpor dari ./bbpbTabel, sumber yang sama dengan longitudinal.ts.
 */
const TK_TABEL_BBPBTB: Record<string, ZscoreTable> = {
  who_male_bbpb: WHO_BBPB_MALE_45_110,
  who_female_bbpb: WHO_BBPB_FEMALE_45_110,
  who_male_bbtb: WHO_BBTB_MALE_65_120,
  who_female_bbtb: WHO_BBTB_FEMALE_65_120,
};

/** Benar untuk indikator yang sumbu X-nya sentimeter. */
function tkIndikatorPanjang(indikator: string): boolean {
  return indikator === "bbpb" || indikator === "bbtb";
}

export interface HasilZscore {
  z: number;
  zonaLabel: string;
  rentang: string;
  statusGizi: string;
  statusColor: string;
  /**
   * Benar bila usia berada di luar rentang tabel rujukan, sehingga z-score
   * dihitung dari baris tepi terdekat (penjepitan v17), bukan dari baris tabel
   * untuk usia tersebut. Angka tetap ditampilkan, tetapi harus disertai
   * peringatan agar tidak dibaca sebagai nilai tabel.
   */
  diLuarTabel: boolean;
}

/** Interpretasi WHO berbasis Z-score. Mengembalikan null bila tabel tak tersedia. */
export function tkInterpretasiZscore(
  standar: string,
  kelamin: string,
  indikator: string,
  usiaGroupId: string,
  nilaiX: number,
  nilaiY: number,
): HasilZscore | null {
  // BB/PB & BB/TB memakai peta tersendiri karena nilaiX-nya sentimeter dan
  // pemilihan tabelnya tidak bergantung pada kelompok umur.
  const table = tkIndikatorPanjang(indikator)
    ? TK_TABEL_BBPBTB[`${standar}_${kelamin}_${indikator}`]
    : TK_ZSCORE_TABLES[`${standar}_${kelamin}_${indikator}_${usiaGroupId}`];
  if (!table) return null;

  const row = tkInterpolasiZscoreRow(table, nilaiX);
  if (!row) return null;

  const diLuarTabel = tkUsiaDiLuarTabel(table, nilaiX);

  const z = tkHitungZscoreNumerik(row, nilaiY);
  const zRounded = Math.round(z * 10) / 10;

  const sdLabels = [-3, -2, -1, 0, 1, 2, 3];
  const sdNames = ["-3 SD", "-2 SD", "-1 SD", "0 (median)", "+1 SD", "+2 SD", "+3 SD"];
  let zonaLabel = "";
  for (let i = 0; i < sdLabels.length - 1; i++) {
    const bawah = sdLabels[i];
    const atas = sdLabels[i + 1];
    if (bawah === undefined || atas === undefined) continue;
    if (z >= bawah && z < atas) {
      zonaLabel = `di antara ${sdNames[i]} dan ${sdNames[i + 1]}`;
      break;
    }
  }
  if (z < -3) zonaLabel = "di bawah -3 SD";
  if (z >= 3) zonaLabel = "di atas +3 SD";

  let statusGizi = "";
  let statusColor = "";
  if (indikator === "bbu") {
    if (z < -3) {
      statusGizi = "Berat Badan Sangat Kurang (Severe Underweight)";
      statusColor = "#B22222";
    } else if (z < -2) {
      statusGizi = "Berat Badan Kurang (Underweight)";
      statusColor = "#E06000";
    } else if (z <= 2) {
      statusGizi = "Berat Badan Normal";
      statusColor = "#1A7A1A";
    } else {
      statusGizi = "Berat Badan Lebih";
      statusColor = "#E06000";
    }
  } else if (indikator === "tbu") {
    if (z < -3) {
      statusGizi = "Sangat Pendek (Severely Stunted)";
      statusColor = "#B22222";
    } else if (z < -2) {
      statusGizi = "Pendek (Stunted)";
      statusColor = "#E06000";
    } else if (z <= 3) {
      statusGizi = "Normal";
      statusColor = "#1A7A1A";
    } else {
      statusGizi = "Tinggi";
      statusColor = "#1565C0";
    }
  } else if (indikator === "imtu" || tkIndikatorPanjang(indikator)) {
    // Permenkes RI No. 2 Tahun 2020. Ambang BB/PB dan BB/TB memang identik
    // dengan IMT/U pada standar ini, jadi sengaja memakai satu cabang yang
    // sama agar tidak ada dua daftar ambang yang bisa berbeda diam-diam.
    if (z < -3) {
      statusGizi = "Gizi Buruk (Severely Wasted)";
      statusColor = "#B22222";
    } else if (z < -2) {
      statusGizi = "Gizi Kurang (Wasted)";
      statusColor = "#E06000";
    } else if (z <= 1) {
      statusGizi = "Gizi Baik (Normal)";
      statusColor = "#1A7A1A";
    } else if (z <= 2) {
      statusGizi = "Berisiko Gizi Lebih (Possible Risk of Overweight)";
      statusColor = "#D98B00";
    } else if (z <= 3) {
      statusGizi = "Gizi Lebih (Overweight)";
      statusColor = "#E06000";
    } else {
      statusGizi = "Obesitas (Obese)";
      statusColor = "#B22222";
    }
  }

  let rentang = "";
  if (indikator === "bbu") {
    if (z < -3) rentang = "< \u22123 SD";
    else if (z < -2) rentang = "\u22123 SD s/d < \u22122 SD";
    else if (z <= 2) rentang = "\u22122 SD s/d +2 SD";
    else rentang = "> +2 SD";
  } else if (indikator === "tbu") {
    if (z < -3) rentang = "< \u22123 SD";
    else if (z < -2) rentang = "\u22123 SD s/d < \u22122 SD";
    else if (z <= 3) rentang = "\u22122 SD s/d +3 SD";
    else rentang = "> +3 SD";
  } else if (indikator === "imtu" || tkIndikatorPanjang(indikator)) {
    if (z < -3) rentang = "< \u22123 SD";
    else if (z < -2) rentang = "\u22123 SD s/d < \u22122 SD";
    else if (z <= 1) rentang = "\u22122 SD s/d +1 SD";
    else if (z <= 2) rentang = "> +1 SD s/d +2 SD";
    else if (z <= 3) rentang = "> +2 SD s/d +3 SD";
    else rentang = "> +3 SD";
  }

  return { z: zRounded, zonaLabel, rentang, statusGizi, statusColor, diLuarTabel };
}

/* ===================== Jalur CDC — % median / Waterlow ===================== */

function tkInterpLinear(xs: number[], ys: number[], x: number): number | null {
  if (!Array.isArray(xs) || !Array.isArray(ys) || !xs.length || xs.length !== ys.length || !isFinite(x))
    return null;
  const x0 = xs[0];
  const xN = xs[xs.length - 1];
  const y0 = ys[0];
  const yN = ys[ys.length - 1];
  if (x0 === undefined || xN === undefined || y0 === undefined || yN === undefined) return null;
  if (x <= x0) return y0;
  if (x >= xN) return yN;
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i];
    const xb = xs[i + 1];
    const ya = ys[i];
    const yb = ys[i + 1];
    if (xa === undefined || xb === undefined || ya === undefined || yb === undefined) continue;
    if (x >= xa && x <= xb) {
      const f = (x - xa) / (xb - xa);
      return ya + f * (yb - ya);
    }
  }
  return null;
}

function tkCdcMedianByAge(kelamin: string, field: "weight" | "height", usiaBulan: number) {
  const ref = TK_CDC_P50[kelamin];
  if (!ref || !ref[field]) return null;
  return tkInterpLinear(ref.age, ref[field], usiaBulan);
}

function tkCdcCariUsiaTinggiDariP50(kelamin: string, tinggiCm: number) {
  const ref = TK_CDC_P50[kelamin];
  if (!ref || !isFinite(tinggiCm)) return null;
  const h = ref.height;
  const age = ref.age;
  if (!Array.isArray(h) || !Array.isArray(age) || h.length !== age.length) return null;

  const h0 = h[0];
  const hN = h[h.length - 1];
  const age0 = age[0];
  const ageN = age[age.length - 1];
  if (h0 === undefined || hN === undefined || age0 === undefined || ageN === undefined) return null;

  if (tinggiCm <= h0) return { usiaTinggi: age0, diLuarRentang: true };
  if (tinggiCm >= hN) return { usiaTinggi: ageN, diLuarRentang: true };

  for (let i = 0; i < h.length - 1; i++) {
    const ha = h[i];
    const hb = h[i + 1];
    const aa = age[i];
    const ab = age[i + 1];
    if (ha === undefined || hb === undefined || aa === undefined || ab === undefined) continue;
    if (tinggiCm >= ha && tinggiCm <= hb) {
      const f = (tinggiCm - ha) / (hb - ha);
      return { usiaTinggi: aa + f * (ab - aa), diLuarRentang: false };
    }
  }
  return null;
}

function tkCdcBbIdealBerdasarkanTinggi(kelamin: string, tinggiCm: number) {
  const ref = TK_CDC_P50[kelamin];
  const usiaObj = tkCdcCariUsiaTinggiDariP50(kelamin, tinggiCm);
  if (!ref || !usiaObj) return null;

  const bbIdeal = tkInterpLinear(ref.age, ref.weight, usiaObj.usiaTinggi);
  const tbMedianDiUsiaTinggi = tkInterpLinear(ref.age, ref.height, usiaObj.usiaTinggi);
  if (!bbIdeal) return null;
  return {
    bbIdeal,
    usiaTinggi: usiaObj.usiaTinggi,
    tbMedianDiUsiaTinggi,
    diLuarRentang: usiaObj.diLuarRentang,
  };
}

function tkCdcKategoriPercentMedian(indikator: string, persenMedian: number) {
  let status = "";
  let color = "#1A7A1A";
  let posisi = "% terhadap median/P50";
  if (indikator === "bbu") {
    if (persenMedian < 60) {
      posisi = "<60% dari P50";
      status = "Gizi buruk";
      color = "#B22222";
    } else if (persenMedian < 80) {
      posisi = "60–80% dari P50";
      status = "Gizi kurang";
      color = "#E06000";
    } else if (persenMedian <= 120) {
      posisi = "80–120% dari P50";
      status = "Gizi baik";
      color = "#1A7A1A";
    } else {
      posisi = ">120% dari P50";
      status = "Di atas rentang gizi baik";
      color = "#D98B00";
    }
  } else if (indikator === "tbu") {
    if (persenMedian < 70) {
      posisi = "<70% dari P50";
      status = "Tinggi badan sangat kurang";
      color = "#B22222";
    } else if (persenMedian < 90) {
      posisi = "70–90% dari P50";
      status = "Tinggi badan kurang";
      color = "#E06000";
    } else if (persenMedian <= 110) {
      posisi = "90–110% dari P50";
      status = "Tinggi badan normal/baik";
      color = "#1A7A1A";
    } else {
      posisi = ">110% dari P50";
      status = "Tinggi badan di atas rentang normal/baik";
      color = "#1565C0";
    }
  }
  return { posisi, status, color };
}

export interface HasilCdcPersentil {
  judul: string;
  median: number;
  unit: string;
  pctMedian: number;
  posisi: string;
  status: string;
  color: string;
}

export function tkInterpretasiCdcPercentile(
  kelamin: string,
  indikator: string,
  usiaBulan: number,
  nilai: number,
): HasilCdcPersentil | null {
  const field = indikator === "tbu" ? "height" : "weight";
  const median = tkCdcMedianByAge(kelamin, field, usiaBulan);
  if (!median || !isFinite(nilai)) return null;
  const pctMedian = (nilai / median) * 100;
  const kat = tkCdcKategoriPercentMedian(indikator, pctMedian);
  const judul = indikator === "tbu" ? "TB/U CDC" : "BB/U CDC";
  const unit = indikator === "tbu" ? "cm" : "kg";
  return { judul, median, unit, pctMedian, posisi: kat.posisi, status: kat.status, color: kat.color };
}

export interface HasilCdcBbtb {
  judul: "BB/TB CDC — % median";
  standar: number;
  usiaTinggi: number;
  tbMedianDiUsiaTinggi: number | null;
  diLuarRentang: boolean;
  pct: number;
  status: string;
  color: string;
}

export function tkInterpretasiCdcBbtb(
  kelamin: string,
  beratKg: number,
  tinggiCm: number,
): HasilCdcBbtb | null {
  if (!isFinite(beratKg) || !isFinite(tinggiCm)) return null;
  const ideal = tkCdcBbIdealBerdasarkanTinggi(kelamin, tinggiCm);
  if (!ideal) return null;
  const pct = (beratKg / ideal.bbIdeal) * 100;
  let status = "";
  let color = "#1A7A1A";
  if (pct < 70) {
    status = "Gizi buruk";
    color = "#B22222";
  } else if (pct < 90) {
    status = "Gizi kurang";
    color = "#E06000";
  } else if (pct <= 110) {
    status = "Gizi baik";
    color = "#1A7A1A";
  } else if (pct <= 120) {
    status = "Gizi lebih / overweight";
    color = "#D98B00";
  } else {
    status = "Obesitas";
    color = "#E06000";
  }
  return {
    judul: "BB/TB CDC — % median",
    standar: ideal.bbIdeal,
    usiaTinggi: ideal.usiaTinggi,
    tbMedianDiUsiaTinggi: ideal.tbMedianDiUsiaTinggi,
    diLuarRentang: ideal.diLuarRentang,
    pct,
    status,
    color,
  };
}

/**
 * Prediksi tinggi dewasa (Mid-Parental Height, rumus Tanner).
 * (tinggi ayah + tinggi ibu ± 13) ÷ 2, rentang target ± 8,5 cm.
 */
export function hitungMPH(ayahCm: number, ibuCm: number, kelamin: string) {
  if (!isFinite(ayahCm) || !isFinite(ibuCm)) return null;
  const mph = kelamin === "female" ? (ayahCm + ibuCm - 13) / 2 : (ayahCm + ibuCm + 13) / 2;
  return { mph, lo: mph - 8.5, hi: mph + 8.5 };
}
