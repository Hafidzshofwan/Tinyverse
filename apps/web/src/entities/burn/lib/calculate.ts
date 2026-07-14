import {
  calculateBurnResuscitation,
  type BurnArea,
} from "@tinyverse/clinical-core";
import type { BurnView, DisplayRow } from "../model/types";

function bulat0(n: number): string {
  return Math.round(n).toString();
}

function bulat1(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

/**
 * Adapter lapisan entity: membungkus calculateBurnResuscitation (clinical-core)
 * menjadi baris tampilan siap-render. Pembulatan tampilan (mL bulat, %TBSA 1
 * desimal) hidup DI SINI, bukan di core (core tetap murni, angka mentah).
 */
export function viewBurn(
  areas: ReadonlyArray<BurnArea>,
  ageInput: string,
  weightInput: string,
): BurnView {
  const ageTrim = ageInput.trim();
  const weightTrim = weightInput.trim();

  // Input belum lengkap → placeholder (bukan error).
  if (ageTrim === "" || weightTrim === "") {
    return {
      rows: [],
      tbsaPercent: 0,
      selectedCount: areas.length,
      error: null,
    };
  }

  const ageYears = Number(ageTrim);
  const weightKg = Number(weightTrim);

  try {
    const r = calculateBurnResuscitation(areas, ageYears, weightKg);
    const rows: DisplayRow[] = [
      { label: "Chart Lund-Browder", value: r.chart.label },
      { label: "Luas luka (%TBSA)", value: `${bulat1(r.tbsaPercent)}%` },
      { label: "Parkland (24 jam)", value: `${bulat0(r.parklandMlPer24h)} mL` },
      { label: "Cairan pilihan", value: "Ringer Laktat (RL) hangat" },
      { label: "8 jam pertama", value: `${bulat0(r.first8hMl)} mL` },
      { label: "16 jam berikutnya", value: `${bulat0(r.next16hMl)} mL` },
      {
        label: "Rumatan (Holliday–Segar)",
        value: `${bulat0(r.maintenanceMlPerDay)} mL/hari`,
      },
      { label: "Total 24 jam pertama", value: `${bulat0(r.total24hMl)} mL` },
      {
        label: "Target produksi urin",
        value: `${r.urineTargetLabel} (${bulat1(
          r.urineTargetMinMlPerHour,
        )}–${bulat1(r.urineTargetMaxMlPerHour)} mL/jam)`,
      },
    ];
    return {
      rows,
      tbsaPercent: r.tbsaPercent,
      selectedCount: areas.length,
      error: null,
    };
  } catch (e) {
    const pesan = e instanceof Error ? e.message : "Input tidak valid.";
    return {
      rows: [],
      tbsaPercent: 0,
      selectedCount: areas.length,
      error: pesan,
    };
  }
}
