export interface CalorieProteinInput {
  weightKg: number;
  ageMonths: number | null;
}

export interface RdaPerAge {
  kcalPerKg: number;
  proteinGPerKg: number;
}

export interface CalorieProteinResult {
  weightKg: number;
  ageMonths: number | null;
  maintenanceEnergyKcalPerDay: number;
  ageBased: boolean;
  rdaKcalPerKg: number | null;
  rdaKcalPerDay: number | null;
  proteinGPerKg: number | null;
  proteinGPerDay: number | null;
}

export interface FormulaFeedInput {
  totalVolumeMlPerDay: number;
  feedsPerDay?: number | null;
  concentrationKcalPerMl?: number | null;
}

export interface FormulaPerFeed {
  volumeMl: number;
  scoops: number;
  waterMl: number;
}

export interface FormulaFeedResult {
  totalVolumeMl: number;
  concentrationKcalPerMl: number;
  totalKcalPerDay: number;
  scoops: number;
  waterMl: number;
  perFeed: FormulaPerFeed | null;
}

export const DEFAULT_FORMULA_CONCENTRATION_KCAL_PER_ML = 0.67;
export const FORMULA_ML_PER_SCOOP = 60;
export const FORMULA_ML_PER_KG_PER_DAY = 150;
