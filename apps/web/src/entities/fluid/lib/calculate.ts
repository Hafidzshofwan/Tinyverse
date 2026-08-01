import {
  DRIP_LABEL,
  DRIP_OPTIONS,
  dripRate,
  maintenanceFluids,
  rehydrationPlanB,
  rehydrationPlanC,
  type DripOption,
  type DripType,
  type PlanCAgeCategory,
} from "@tinyverse/clinical-core";
import type { DisplayRow, FluidView } from "../model/types";

// Re-export tipe domain agar layer di atas (features) tidak mengimpor langsung dari package.
export type { DripOption, DripType, PlanCAgeCategory };
// Re-export tabel drip set agar UI memakai label & faktor tetes yang sama dengan domain.
export { DRIP_LABEL, DRIP_OPTIONS };

function displayRows(rows: DisplayRow[], rincian?: DisplayRow[]): FluidView {
  return { rows, rincian, error: null };
}

function failure(error: string): FluidView {
  return { rows: [], rincian: [], error };
}

/**
 * Adapter entity Fluid: memanggil pure functions clinical-core (P5) dan
 * memformat hasilnya untuk tampilan. Pembulatan tampilan (toFixed) HIDUP di sini
 * (lapisan UI), sesuai keputusan arsitektur P5 — domain tetap mengembalikan angka eksak.
 */
export function viewMaintenance(weightKg: number): FluidView {
  try {
    const r = maintenanceFluids(weightKg);
    const rincian: DisplayRow[] = [];
    if (weightKg <= 10) {
      rincian.push({
        label: "10 kg pertama",
        value: `${weightKg.toFixed(1)} kg × 100 mL/kg = ${r.totalMlPerDay.toFixed(0)} mL`,
      });
    } else if (weightKg <= 20) {
      rincian.push({
        label: "10 kg pertama",
        value: `10 kg × 100 mL/kg = 1000 mL`,
      });
      rincian.push({
        label: "10 kg berikutnya",
        value: `${(weightKg - 10).toFixed(1)} kg × 50 mL/kg = ${(weightKg - 10) * 50} mL`,
      });
    } else {
      rincian.push({
        label: "10 kg pertama",
        value: `10 kg × 100 mL/kg = 1000 mL`,
      });
      rincian.push({
        label: "10 kg kedua",
        value: `10 kg × 50 mL/kg = 500 mL`,
      });
      rincian.push({
        label: "> 20 kg",
        value: `${(weightKg - 20).toFixed(1)} kg × 20 mL/kg = ${(weightKg - 20) * 20} mL`,
      });
    }
    return displayRows(
      [
        {
          label: "Kebutuhan per hari",
          value: `${r.totalMlPerDay.toFixed(0)} ml/hari`,
        },
        {
          label: "Setara per jam",
          value: `≈ ${r.mlPerHour.toFixed(1)} ml/jam`,
        },
      ],
      rincian,
    );
  } catch (e) {
    return failure(e instanceof Error ? e.message : "Perhitungan gagal");
  }
}

export function viewDrip(
  volumeMl: number,
  hours: number,
  dripType: DripType,
): FluidView {
  try {
    const r = dripRate(volumeMl, hours, dripType);
    const minutes = hours * 60;
    const dripLabel = DRIP_LABEL[dripType];
    const rincian: DisplayRow[] = [
      { label: "Volume cairan", value: `${volumeMl.toFixed(0)} mL` },
      {
        label: "Lama pemberian",
        value: `${hours.toFixed(1)} jam (${minutes.toFixed(0)} menit)`,
      },
      { label: "Drip set", value: `${dripLabel} (${r.dropFactor} tetes/mL)` },
      {
        label: "Rumus",
        value: `${volumeMl.toFixed(0)} × ${r.dropFactor} ÷ ${minutes.toFixed(0)} = ${r.gttPerMinRaw.toFixed(1)} tetes/menit`,
      },
    ];
    return displayRows(
      [
        { label: "Laju tetesan", value: `${r.gttPerMin} tetes/menit` },
        { label: "Setara laju", value: `≈ ${r.mlPerHour.toFixed(1)} ml/jam` },
      ],
      rincian,
    );
  } catch (e) {
    return failure(e instanceof Error ? e.message : "Perhitungan gagal");
  }
}

export function viewPlanB(weightKg: number): FluidView {
  try {
    const r = rehydrationPlanB(weightKg);
    const rincian: DisplayRow[] = [
      {
        label: "Dosis total",
        value: `75 mL/kg × ${weightKg.toFixed(1)} kg = ${r.totalMl.toFixed(0)} mL`,
      },
      {
        label: "Laju",
        value: `${r.totalMl.toFixed(0)} mL ÷ ${r.overHours} jam = ${r.mlPerHour.toFixed(1)} mL/jam`,
      },
      { label: "Durasi", value: `${r.overHours} jam` },
    ];
    return {
      rows: [
        { label: "Total cairan", value: `${r.totalMl.toFixed(0)} mL` },
        { label: "Laju", value: `≈ ${r.mlPerHour.toFixed(1)} mL/jam` },
      ],
      rincian,
      error: null,
      total: r.totalMl,
      duration: r.overHours,
    };
  } catch (e) {
    return failure(e instanceof Error ? e.message : "Perhitungan gagal");
  }
}

export function viewPlanC(
  weightKg: number,
  ageCategory: PlanCAgeCategory,
): FluidView {
  try {
    const r = rehydrationPlanC(weightKg, ageCategory);
    const rincian: DisplayRow[] = [
      {
        label: "Tahap 1",
        value: `${r.stage1.mlPerKg} mL/kg × ${weightKg.toFixed(1)} kg = ${r.stage1.volumeMl.toFixed(0)} mL / ${r.stage1.hours} jam`,
      },
      {
        label: "Tahap 2",
        value: `${r.stage2.mlPerKg} mL/kg × ${weightKg.toFixed(1)} kg = ${r.stage2.volumeMl.toFixed(0)} mL / ${r.stage2.hours} jam`,
      },
      {
        label: "Total",
        value: `${weightKg.toFixed(1)} kg × 100 mL/kg = ${r.totalMl.toFixed(0)} mL, diberikan dalam ${r.totalHours} jam (${r.stage1.hours} jam + ${r.stage2.hours} jam)`,
      },
    ];
    return {
      rows: [
        { label: "Total cairan", value: `${r.totalMl.toFixed(0)} mL` },
        { label: "Total waktu", value: `${r.totalHours} jam` },
      ],
      rincian,
      error: null,
      total: r.totalMl,
      totalHours: r.totalHours,
      stage1: {
        volumeMl: r.stage1.volumeMl,
        mlPerHour: r.stage1.mlPerHour,
        hours: r.stage1.hours,
        mlPerKg: r.stage1.mlPerKg,
      },
      stage2: {
        volumeMl: r.stage2.volumeMl,
        mlPerHour: r.stage2.mlPerHour,
        hours: r.stage2.hours,
        mlPerKg: r.stage2.mlPerKg,
      },
    };
  } catch (e) {
    return failure(e instanceof Error ? e.message : "Perhitungan gagal");
  }
}
