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

function maintenanceRincian(weightKg: number): string[] {
  const rincian: string[] = [];
  if (weightKg <= 10) {
    rincian.push(
      `${bulat0(weightKg)} kg × 100 mL = ${bulat0(weightKg * 100)} mL`,
    );
  } else if (weightKg <= 20) {
    rincian.push(`10 kg × 100 mL = 1000 mL`);
    rincian.push(
      `${bulat0(weightKg - 10)} kg × 50 mL = ${bulat0((weightKg - 10) * 50)} mL`,
    );
  } else {
    rincian.push(`10 kg × 100 mL = 1000 mL`);
    rincian.push(`10 kg × 50 mL = 500 mL`);
    rincian.push(
      `${bulat0(weightKg - 20)} kg × 20 mL = ${bulat0((weightKg - 20) * 20)} mL`,
    );
  }
  return rincian;
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

  const empty: BurnView = {
    rows: [],
    tbsaPercent: 0,
    selectedCount: areas.length,
    error: null,
    chart: null,
    areas: [],
    parkland: 0,
    first8h: 0,
    next16h: 0,
    maintenance: 0,
    maintenanceRincian: [],
    total24h: 0,
    urineMin: 0,
    urineMax: 0,
    urineLabel: "",
    weightKg: 0,
  };

  if (ageTrim === "" || weightTrim === "") {
    return empty;
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
      chart: r.chart,
      areas: r.contributions.map((c) => ({
        label: c.label,
        percent: c.percent,
      })),
      parkland: r.parklandMlPer24h,
      first8h: r.first8hMl,
      next16h: r.next16hMl,
      maintenance: r.maintenanceMlPerDay,
      maintenanceRincian: maintenanceRincian(r.weightKg),
      total24h: r.total24hMl,
      urineMin: r.urineTargetMinMlPerHour,
      urineMax: r.urineTargetMaxMlPerHour,
      urineLabel: r.urineTargetLabel,
      weightKg: r.weightKg,
    };
  } catch (e) {
    const pesan = e instanceof Error ? e.message : "Input tidak valid.";
    return { ...empty, error: pesan };
  }
}
