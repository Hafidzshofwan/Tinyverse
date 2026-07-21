import type { Band, BandId, LabRef, RefRow } from "../model/types";

// Kelompok usia (bulan). Port verbatim dari Tinyverse v17 (lab-tool).
export const BANDS: readonly Band[] = [
  { id: "neo", label: "Neonatus (0\u20131 bln)", min: 0, max: 1 },
  { id: "bayi", label: "Bayi (1\u201312 bln)", min: 1, max: 12 },
  { id: "balita", label: "Balita (1\u20135 th)", min: 12, max: 72 },
  { id: "anak", label: "Anak (6\u201312 th)", min: 72, max: 156 },
  { id: "remaja", label: "Remaja (>12 th)", min: 156, max: 1e9 },
];

// Rentang mengacu Harriet Lane Handbook & AAP/ACCP Pediatric Reference Values;
// ambang anemia mengikuti WHO 2024. Port verbatim dari v17.
export const LAB: readonly LabRef[] = [
  { key: "hb", name: "Hemoglobin", unit: "g/dL", r: { neo: [14, 24], bayi: [10.5, 14], balita: [11.5, 14.5], anak: [11.5, 15.5], remaja: [12, 16] } },
  { key: "ht", name: "Hematokrit", unit: "%", r: { neo: [44, 70], bayi: [32, 42], balita: [33, 43], anak: [34, 45], remaja: [36, 49] } },
  { key: "leuko", name: "Leukosit", unit: "\u00d710\u00b3/\u00b5L", r: { neo: [9, 34], bayi: [6, 17], balita: [5, 15.5], anak: [4.5, 13.5], remaja: [4.5, 11] } },
  { key: "trombo", name: "Trombosit", unit: "\u00d710\u00b3/\u00b5L", r: { neo: [150, 450], bayi: [150, 450], balita: [150, 450], anak: [150, 450], remaja: [150, 450] } },
  { key: "mcv", name: "MCV", unit: "fL", r: { neo: [95, 115], bayi: [72, 88], balita: [76, 90], anak: [77, 95], remaja: [78, 98] } },
  { key: "na", name: "Natrium", unit: "mmol/L", r: { neo: [133, 146], bayi: [135, 145], balita: [135, 145], anak: [135, 145], remaja: [135, 145] } },
  { key: "k", name: "Kalium", unit: "mmol/L", r: { neo: [3.7, 5.9], bayi: [3.4, 5.6], balita: [3.5, 5.1], anak: [3.5, 5.1], remaja: [3.5, 5.1] } },
  { key: "cl", name: "Klorida", unit: "mmol/L", r: { neo: [98, 113], bayi: [98, 107], balita: [98, 107], anak: [98, 107], remaja: [98, 107] } },
  { key: "ca", name: "Kalsium total", unit: "mg/dL", r: { neo: [9, 10.6], bayi: [9, 11], balita: [9, 10.5], anak: [8.8, 10.8], remaja: [8.4, 10.2] } },
  { key: "glu", name: "Glukosa (puasa)", unit: "mg/dL", r: { neo: [40, 90], bayi: [60, 100], balita: [70, 100], anak: [70, 100], remaja: [70, 105] } },
  { key: "ureum", name: "Ureum (BUN)", unit: "mg/dL", r: { neo: [3, 25], bayi: [5, 18], balita: [5, 18], anak: [7, 18], remaja: [7, 20] } },
  { key: "creat", name: "Kreatinin", unit: "mg/dL", r: { neo: [0.3, 1.0], bayi: [0.2, 0.4], balita: [0.3, 0.7], anak: [0.5, 0.8], remaja: [0.5, 1.0] } },
  { key: "crp", name: "CRP", unit: "mg/L", r: { neo: [0, 5], bayi: [0, 5], balita: [0, 5], anak: [0, 5], remaja: [0, 5] } },
];

/** Format angka (port dari fungsi f() v17): d desimal, default 1. */
export function fmt(n: number | null, d = 1): string {
  if (n == null || !isFinite(n)) return "\u2013";
  const p = Math.pow(10, d);
  return String(Math.round(n * p) / p);
}

/** Escape HTML (port dari esc() v17). */
export function esc(s: string): string {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function bandFromMonths(m: number | null | undefined): BandId | null {
  if (m == null || !isFinite(m)) return null;
  for (const b of BANDS) if (m >= b.min && m < b.max) return b.id;
  return "remaja";
}

export function bandLabel(id: string): string {
  const b = BANDS.find((x) => x.id === id);
  return b ? b.label : id;
}

export function labByKey(k: string): LabRef | null {
  return LAB.find((t) => t.key === k) ?? null;
}

/** Baris tabel nilai rujukan untuk band tertentu (port renderRefTable). */
export function refTableRows(band: BandId): RefRow[] {
  return LAB.map((t) => {
    const r = t.r[band];
    return { name: t.name, range: fmt(r[0], 2) + " \u2013 " + fmt(r[1], 2), unit: t.unit };
  });
}
