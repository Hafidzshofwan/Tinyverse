import type {
  FormulaFeedInput,
  FormulaFeedResult,
  FormulaPerFeed,
} from "./types";
import {
  DEFAULT_FORMULA_CONCENTRATION_KCAL_PER_ML,
  FORMULA_ML_PER_SCOOP,
  FORMULA_ML_PER_KG_PER_DAY,
} from "./types";
import { assertValidVolumeMl } from "./guards";

// Isi otomatis 150 mL/kg/hari dari berat (port verbatim fmIsiKg).
export function formulaVolumeFromWeightMl(weightKg: number): number {
  return Math.round(FORMULA_ML_PER_KG_PER_DAY * weightKg);
}

// Persiapan susu formula (port verbatim v17 fmHitung).
export function calculateFormulaFeed(
  input: FormulaFeedInput,
): FormulaFeedResult {
  const { totalVolumeMlPerDay } = input;
  const feedsPerDay = input.feedsPerDay ?? null;
  const rawConc = input.concentrationKcalPerMl ?? null;
  assertValidVolumeMl(totalVolumeMlPerDay);
  const conc =
    rawConc == null || rawConc === 0
      ? DEFAULT_FORMULA_CONCENTRATION_KCAL_PER_ML
      : rawConc;
  const scoops = Math.round(totalVolumeMlPerDay / FORMULA_ML_PER_SCOOP);
  const waterMl = scoops * FORMULA_ML_PER_SCOOP;
  const totalKcalPerDay = totalVolumeMlPerDay * conc;
  let perFeed: FormulaPerFeed | null = null;
  if (feedsPerDay != null && feedsPerDay > 0) {
    const volumeMl = totalVolumeMlPerDay / feedsPerDay;
    const perScoops = Math.round(volumeMl / FORMULA_ML_PER_SCOOP);
    perFeed = {
      volumeMl,
      scoops: perScoops,
      waterMl: perScoops * FORMULA_ML_PER_SCOOP,
    };
  }
  return {
    totalVolumeMl: totalVolumeMlPerDay,
    concentrationKcalPerMl: conc,
    totalKcalPerDay,
    scoops,
    waterMl,
    perFeed,
  };
}
