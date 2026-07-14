import {
  calculateCalorieProtein,
  calculateFormulaFeed,
  formulaVolumeFromWeightMl,
} from "@tinyverse/clinical-core";
import type {
  CalorieProteinResult,
  FormulaFeedResult,
} from "@tinyverse/clinical-core";

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
