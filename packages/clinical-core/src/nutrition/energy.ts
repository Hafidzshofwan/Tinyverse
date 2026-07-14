import type {
  CalorieProteinInput,
  CalorieProteinResult,
  RdaPerAge,
} from "./types";
import { assertValidWeightKg, assertValidAgeMonths } from "./guards";

// Estimasi energi rumatan Holliday-Segar (kkal/hari).
// Sengaja disalin lokal agar bounded context Nutrisi mandiri; nilainya wajib
// identik dengan fluids.maintenanceFluids & burns (100/50/20 per kg).
export function maintenanceEnergyKcalPerDay(weightKg: number): number {
  return weightKg <= 10
    ? 100 * weightKg
    : weightKg <= 20
      ? 1000 + 50 * (weightKg - 10)
      : 1500 + 20 * (weightKg - 20);
}

// RDA per kelompok usia (port verbatim dari v17 nutKalori).
export function rdaPerAge(ageMonths: number | null): RdaPerAge | null {
  if (ageMonths == null) return null;
  if (ageMonths < 12)
    return { kcalPerKg: 100, proteinGPerKg: ageMonths < 6 ? 1.52 : 1.2 };
  if (ageMonths < 48) return { kcalPerKg: 80, proteinGPerKg: 1.05 };
  if (ageMonths < 72) return { kcalPerKg: 70, proteinGPerKg: 0.95 };
  if (ageMonths < 108) return { kcalPerKg: 62, proteinGPerKg: 0.95 };
  return { kcalPerKg: 40, proteinGPerKg: 0.85 };
}

export function calculateCalorieProtein(
  input: CalorieProteinInput,
): CalorieProteinResult {
  const { weightKg, ageMonths } = input;
  assertValidWeightKg(weightKg);
  assertValidAgeMonths(ageMonths);
  const maintenance = maintenanceEnergyKcalPerDay(weightKg);
  const rda = rdaPerAge(ageMonths);
  return {
    weightKg,
    ageMonths,
    maintenanceEnergyKcalPerDay: maintenance,
    ageBased: rda != null,
    rdaKcalPerKg: rda ? rda.kcalPerKg : null,
    rdaKcalPerDay: rda ? rda.kcalPerKg * weightKg : null,
    proteinGPerKg: rda ? rda.proteinGPerKg : null,
    proteinGPerDay: rda ? rda.proteinGPerKg * weightKg : null,
  };
}
