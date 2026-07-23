import type { ChartConfig, ChartKey } from "../model/types";

/**
 * Dua halaman bagan IDAI 2024 (port 1:1 dari CHARTS di imunisasi-tool.html).
 * Gambar tetap dipakai dari public/assets/images/ (tidak diubah ke SVG).
 */
export const CHARTS: Record<ChartKey, ChartConfig> = {
  jadwal: {
    title: "Bagan Jadwal Imunisasi IDAI 2024",
    src: "/assets/images/jadwal-imunisasi-idai-2024.jpg",
    alt: "Bagan Jadwal Imunisasi Anak Usia 0-18 Tahun Rekomendasi IDAI 2024",
  },
  keterangan: {
    title: "Keterangan Vaksin - IDAI 2024",
    src: "/assets/images/keterangan-imunisasi-idai-2024.jpg",
    alt: "Keterangan tiap vaksin, Rekomendasi IDAI 2024",
  },
};
