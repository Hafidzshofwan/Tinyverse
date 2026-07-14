import { describe, it, expect } from "vitest";
import {
  calculateCalorieProtein,
  calculateFormulaFeed,
  maintenanceEnergyKcalPerDay,
  rdaPerAge,
  formulaVolumeFromWeightMl,
} from "./index";
import { CALPRO_GOLDEN, FORMULA_GOLDEN } from "./__fixtures__/nutrition.golden";

describe("nutrition - kalori & protein (golden v17)", () => {
  for (const g of CALPRO_GOLDEN) {
    it(`bb=${g.weightKg} m=${g.ageMonths}`, () => {
      const r = calculateCalorieProtein({
        weightKg: g.weightKg,
        ageMonths: g.ageMonths,
      });
      expect(r.maintenanceEnergyKcalPerDay).toBe(g.maintenanceEnergyKcalPerDay);
      expect(r.rdaKcalPerKg).toBe(g.rdaKcalPerKg);
      expect(r.rdaKcalPerDay).toBe(g.rdaKcalPerDay);
      expect(r.proteinGPerKg).toBe(g.proteinGPerKg);
      expect(r.proteinGPerDay).toBe(g.proteinGPerDay);
    });
  }
});

describe("nutrition - susu formula (golden v17)", () => {
  for (const g of FORMULA_GOLDEN) {
    it(`v=${g.totalVolumeMl} f=${g.feedsPerDay} c=${g.concentrationKcalPerMl}`, () => {
      const r = calculateFormulaFeed({
        totalVolumeMlPerDay: g.totalVolumeMl,
        feedsPerDay: g.feedsPerDay,
        concentrationKcalPerMl: g.concentrationKcalPerMl,
      });
      expect(r.concentrationKcalPerMl).toBe(g.expected.concentrationKcalPerMl);
      expect(r.totalKcalPerDay).toBe(g.expected.totalKcalPerDay);
      expect(r.scoops).toBe(g.expected.scoops);
      expect(r.waterMl).toBe(g.expected.waterMl);
      expect(r.perFeed).toEqual(g.expected.perFeed);
    });
  }
});

describe("nutrition - guards & helpers", () => {
  it("tolak berat <= 0", () => {
    expect(() =>
      calculateCalorieProtein({ weightKg: 0, ageMonths: 12 }),
    ).toThrow();
  });
  it("tolak usia negatif", () => {
    expect(() =>
      calculateCalorieProtein({ weightKg: 10, ageMonths: -1 }),
    ).toThrow();
  });
  it("tolak volume susu <= 0", () => {
    expect(() => calculateFormulaFeed({ totalVolumeMlPerDay: 0 })).toThrow();
  });
  it("Holliday-Segar patokan", () => {
    expect(maintenanceEnergyKcalPerDay(10)).toBe(1000);
    expect(maintenanceEnergyKcalPerDay(20)).toBe(1500);
    expect(maintenanceEnergyKcalPerDay(25)).toBe(1600);
  });
  it("volume formula dari berat = 150 mL/kg (dibulatkan)", () => {
    expect(formulaVolumeFromWeightMl(8)).toBe(1200);
  });
  it("rdaPerAge null saat usia null", () => {
    expect(rdaPerAge(null)).toBeNull();
  });
});
