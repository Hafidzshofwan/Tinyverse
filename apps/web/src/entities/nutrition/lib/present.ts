import {
  calculateCalorieProtein,
  calculateFormulaFeed,
  formulaVolumeFromWeightMl,
} from "@tinyverse/clinical-core";
import type {
  CalorieProteinResult,
  FormulaFeedResult,
} from "@tinyverse/clinical-core";
import {
  calculateNeonatalTpn,
  calculateDayOfLife,
  postmenstrualAgeWeeks,
} from "./tpn";
import type { NeonatalTpnInput, NeonatalTpnResult } from "./tpn";

export { calculateDayOfLife, postmenstrualAgeWeeks };

// Pembulatan tampilan (UI-only). Core tetap mengembalikan angka eksak.
export function fmt(n: number | null | undefined, d = 0): string {
  if (n == null || !Number.isFinite(n)) return "–";
  const p = Math.pow(10, d);
  return String(Math.round(n * p) / p);
}

export function parseNum(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export interface CalProOutcome {
  error: string | null;
  result: CalorieProteinResult | null;
}

export function computeCalorieProtein(
  weightKg: number | null,
  ageMonths: number | null,
): CalProOutcome {
  if (weightKg == null) return { error: "Isi berat badan.", result: null };
  try {
    return {
      error: null,
      result: calculateCalorieProtein({ weightKg, ageMonths }),
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Input tidak valid.",
      result: null,
    };
  }
}

export interface FormulaOutcome {
  error: string | null;
  result: FormulaFeedResult | null;
}

export function computeFormula(
  totalVolumeMlPerDay: number | null,
  feedsPerDay: number | null,
  concentrationKcalPerMl: number | null,
): FormulaOutcome {
  if (totalVolumeMlPerDay == null)
    return { error: "Isi total volume susu / hari.", result: null };
  try {
    return {
      error: null,
      result: calculateFormulaFeed({
        totalVolumeMlPerDay,
        feedsPerDay,
        concentrationKcalPerMl,
      }),
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Input tidak valid.",
      result: null,
    };
  }
}

export function autoFormulaVolume(weightKg: number | null): number | null {
  if (weightKg == null) return null;
  return formulaVolumeFromWeightMl(weightKg);
}

export interface NeonatalTpnOutcome {
  error: string | null;
  result: NeonatalTpnResult | null;
}

export function computeNeonatalTpn(
  input: Partial<NeonatalTpnInput>,
): NeonatalTpnOutcome {
  if (input.weightKg == null) return { error: "Isi berat badan.", result: null };
  if (input.dayOfLife == null)
    return { error: "Isi Tanggal Lahir & Tanggal Saat Ini.", result: null };
  if (input.fluidVolumeMlPerKgPerDay == null)
    return { error: "Isi volume cairan.", result: null };
  if (input.dextrosePercent == null)
    return { error: "Isi konsentrasi dekstrosa.", result: null };
  if (input.aminoAcidGPerKgPerDay == null)
    return { error: "Isi dosis asam amino.", result: null };
  if (input.lipidGPerKgPerDay == null)
    return { error: "Isi dosis lipid.", result: null };
  try {
    return {
      error: null,
      result: calculateNeonatalTpn({
        weightKg: input.weightKg,
        category: input.category ?? "preterm",
        dayOfLife: input.dayOfLife,
        fluidVolumeMlPerKgPerDay: input.fluidVolumeMlPerKgPerDay,
        dextrosePercent: input.dextrosePercent,
        aminoAcidGPerKgPerDay: input.aminoAcidGPerKgPerDay,
        lipidGPerKgPerDay: input.lipidGPerKgPerDay,
      }),
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Input tidak valid.",
      result: null,
    };
  }
}
