/**
 * Pemetaan nilai klinis → posisi titik pada gambar chart — fungsi MURNI,
 * port persis dari mesin v17 (public/growth-tool.html).
 *
 * WHY: inilah inti "kalibrasi plotting". Rumusnya tidak boleh berubah sedikit
 * pun, karena posisi titik pasien di atas gambar kurva bergantung penuh pada
 * perhitungan ini. Hasil dinyatakan dalam PERSEN terhadap ukuran gambar (bukan
 * piksel), sehingga titik tetap presisi pada ukuran layar berapa pun.
 */
import type { Kalibrasi } from "./chartConfig";

export interface TitikPlot {
  leftPercent: number;
  topPercent: number;
  /** Tepi kanan area kurva (persen lebar gambar). */
  sumbuKananPersen: number;
  /** Tepi kiri area kurva / sumbu Y. */
  sumbuKiriPersen: number;
  /** Tepi bawah area kurva / sumbu X. */
  sumbuBawahPersen: number;
  /** Baris tick bulan (khusus chart CDC); jatuh ke tepi bawah bila tak ada. */
  sumbuUsiaPersen: number;
  /** Tepi atas area kurva. */
  sumbuAtasPersen: number;
  diLuarBatasX: boolean;
  diLuarBatasY: boolean;
}

/**
 * Hitung posisi titik pasien pada gambar chart.
 *
 * Nilai di luar rentang chart di-clamp ke tepi terdekat (perilaku v17), tetapi
 * tetap ditandai lewat `diLuarBatasX` / `diLuarBatasY` agar UI dapat memberi
 * peringatan bahwa titik digambar pada batas, bukan pada nilai sebenarnya.
 */
export function tkHitungKoordinatTitik(
  calibration: Kalibrasi,
  nilaiX: number,
  nilaiY: number,
): TitikPlot {
  const { imgWidth, imgHeight, plot, xRange, yRange } = calibration;

  const xClamped = Math.min(Math.max(nilaiX, xRange[0]), xRange[1]);
  const yClamped = Math.min(Math.max(nilaiY, yRange[0]), yRange[1]);

  const rasioX = (xClamped - xRange[0]) / (xRange[1] - xRange[0]);
  const rasioY = (yClamped - yRange[0]) / (yRange[1] - yRange[0]);

  const pxX = plot.x0 + rasioX * (plot.x1 - plot.x0);
  const pxY = plot.y0 + (1 - rasioY) * (plot.y1 - plot.y0); // y0 = nilai tertinggi

  const usiaLineY =
    typeof calibration.usiaLineY === "number" && isFinite(calibration.usiaLineY)
      ? calibration.usiaLineY
      : plot.y1;

  return {
    leftPercent: (pxX / imgWidth) * 100,
    topPercent: (pxY / imgHeight) * 100,
    sumbuKananPersen: (plot.x1 / imgWidth) * 100,
    sumbuKiriPersen: (plot.x0 / imgWidth) * 100,
    sumbuBawahPersen: (plot.y1 / imgHeight) * 100,
    sumbuUsiaPersen: (usiaLineY / imgHeight) * 100,
    sumbuAtasPersen: (plot.y0 / imgHeight) * 100,
    diLuarBatasX: nilaiX < xRange[0] || nilaiX > xRange[1],
    diLuarBatasY: nilaiY < yRange[0] || nilaiY > yRange[1],
  };
}

/** Pastikan sebuah kalibrasi layak dipakai (tidak nol/terbalik/kosong). */
export function tkKalibrasiValid(cal: Kalibrasi | undefined | null): cal is Kalibrasi {
  return !!(
    cal &&
    cal.plot &&
    cal.plot.x1 !== cal.plot.x0 &&
    cal.plot.y1 !== cal.plot.y0 &&
    Array.isArray(cal.xRange) &&
    Array.isArray(cal.yRange) &&
    isFinite(cal.xRange[0]) &&
    isFinite(cal.xRange[1]) &&
    isFinite(cal.yRange[0]) &&
    isFinite(cal.yRange[1]) &&
    cal.xRange[1] !== cal.xRange[0] &&
    cal.yRange[1] !== cal.yRange[0]
  );
}

/**
 * Tentukan ke arah mana garis bantu horizontal ditarik.
 *
 * WHY: pada chart v17, sumbu berat berada di tepi KANAN sedangkan sumbu tinggi
 * di tepi KIRI; khusus tinggi di atas 166 cm skalanya pindah ke kanan. Aturan
 * ini disalin apa adanya agar garis bantu menunjuk ke sumbu yang benar.
 */
export function tkTargetGarisHorizontal(
  titik: TitikPlot,
  yLabel: string,
  yUnit: string,
  nilai: number,
): number {
  const labelLower = String(yLabel || "").toLowerCase();
  const unitLower = String(yUnit || "").toLowerCase();
  const isBerat = labelLower.includes("berat") || unitLower === "kg";
  const isTinggiLebih166 =
    (labelLower.includes("tinggi") || unitLower === "cm") && Number(nilai) > 166;
  return isBerat || isTinggiLebih166 ? titik.sumbuKananPersen : titik.sumbuKiriPersen;
}
