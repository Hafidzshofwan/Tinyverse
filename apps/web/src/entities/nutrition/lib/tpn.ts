/*
 * Kalkulator TPN (Total Parenteral Nutrition) neonatus - GIR, asam amino, lipid.
 * Sumber acuan:
 * - ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Carbohydrates (Clinical Nutrition 37, 2018) R5.4
 * - ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Amino acids (Clinical Nutrition 37, 2018) R3.1-R3.4
 * - ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Lipids (Clinical Nutrition 37, 2018) R4.3, R4.5, R4.6
 * Kalkulator ini estimasi edukatif, bukan pengganti penilaian klinis.
 */

export type TpnCategory = "preterm" | "term";

export interface NeonatalTpnInput {
  weightKg: number;
  category: TpnCategory;
  dayOfLife: number;
  fluidVolumeMlPerKgPerDay: number;
  dextrosePercent: number;
  aminoAcidGPerKgPerDay: number;
  lipidGPerKgPerDay: number;
}

export type RangeStatus = "rendah" | "dalam-rentang" | "tinggi";

export interface RangeCheck {
  min: number | null;
  max: number | null;
  status: RangeStatus;
}

export interface NeonatalTpnResult {
  weightKg: number;
  totalVolumeMlPerDay: number;
  girMgKgMin: number;
  girRange: RangeCheck;
  dextroseGPerDay: number;
  dextroseKcalPerDay: number;
  aminoAcidGPerDay: number;
  aminoAcidKcalPerDay: number;
  aminoAcidRange: RangeCheck;
  lipidGPerDay: number;
  lipidKcalPerDay: number;
  lipidMaxGPerKgPerDay: number;
  lipidStatus: RangeStatus;
  nonProteinKcalPerDay: number;
  lipidPercentOfNonProteinKcal: number;
  lipidRatioStatus: RangeStatus;
  totalKcalPerDay: number;
  totalKcalPerKgPerDay: number;
}

function girRangeFor(category: TpnCategory, dayOfLife: number): { min: number; max: number } {
  const isDay1 = dayOfLife <= 1;
  if (category === "preterm") {
    return isDay1 ? { min: 4, max: 8 } : { min: 8, max: 10 };
  }
  return isDay1 ? { min: 2.5, max: 5 } : { min: 5, max: 10 };
}

function aminoAcidRangeFor(category: TpnCategory, dayOfLife: number): { min: number; max: number | null } {
  if (category === "preterm") {
    return dayOfLife <= 1 ? { min: 1.5, max: null } : { min: 2.5, max: 3.5 };
  }
  return { min: 1.5, max: 3.0 };
}

function statusFromRange(value: number, min: number | null, max: number | null): RangeStatus {
  if (min != null && value < min) return "rendah";
  if (max != null && value > max) return "tinggi";
  return "dalam-rentang";
}

const LIPID_MAX_G_PER_KG_PER_DAY = 4; // R4.3 - berlaku preterm & term
const KCAL_PER_G_DEXTROSE = 3.4;
const KCAL_PER_G_AMINO_ACID = 4;
const KCAL_PER_G_LIPID_20PCT = 10; // ILE 20% = 2 kkal/mL = 10 kkal/g

/**
 * Menghitung hari ke- (day of life) dari Tanggal Lahir dan Tanggal Saat Ini.
 * Tanggal lahir dihitung sebagai hari ke-1 (konvensi neonatologi).
 */
export function calculateDayOfLife(
  birthDateIso: string,
  referenceDateIso: string,
): number {
  const birth = new Date(`${birthDateIso}T00:00:00`);
  const reference = new Date(`${referenceDateIso}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
    throw new Error("Tanggal Lahir / Tanggal Saat Ini tidak valid.");
  }
  const diffDays = Math.round((reference.getTime() - birth.getTime()) / 86400000);
  if (diffDays < 0) {
    throw new Error("Tanggal Saat Ini tidak boleh sebelum Tanggal Lahir.");
  }
  return diffDays + 1;
}

/**
 * Usia koreksi / postmenstrual age (minggu) untuk bayi preterm:
 * usia kehamilan saat lahir + (hari ke- - 1) hari yang sudah dijalani.
 */
export function postmenstrualAgeWeeks(
  gestationalAgeAtBirthWeeks: number,
  dayOfLife: number,
): number {
  return gestationalAgeAtBirthWeeks + (dayOfLife - 1) / 7;
}

export function calculateNeonatalTpn(input: NeonatalTpnInput): NeonatalTpnResult {
  const {
    weightKg,
    category,
    dayOfLife,
    fluidVolumeMlPerKgPerDay,
    dextrosePercent,
    aminoAcidGPerKgPerDay,
    lipidGPerKgPerDay,
  } = input;

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Berat badan harus lebih dari 0.");
  }
  if (!Number.isFinite(fluidVolumeMlPerKgPerDay) || fluidVolumeMlPerKgPerDay <= 0) {
    throw new Error("Volume cairan harus lebih dari 0.");
  }
  if (!Number.isFinite(dextrosePercent) || dextrosePercent <= 0) {
    throw new Error("Konsentrasi dekstrosa harus lebih dari 0.");
  }
  if (!Number.isFinite(aminoAcidGPerKgPerDay) || aminoAcidGPerKgPerDay < 0) {
    throw new Error("Dosis asam amino tidak valid.");
  }
  if (!Number.isFinite(lipidGPerKgPerDay) || lipidGPerKgPerDay < 0) {
    throw new Error("Dosis lipid tidak valid.");
  }

  const totalVolumeMlPerDay = fluidVolumeMlPerKgPerDay * weightKg;

  // GIR (mg/kg/menit) = dekstrosa% x volume(mL/kg/hari) / 144
  const girMgKgMin = (dextrosePercent * fluidVolumeMlPerKgPerDay) / 144;
  const girBand = girRangeFor(category, dayOfLife);
  const girRange: RangeCheck = {
    min: girBand.min,
    max: girBand.max,
    status: statusFromRange(girMgKgMin, girBand.min, girBand.max),
  };

  const dextroseGPerDay = (totalVolumeMlPerDay * dextrosePercent) / 100;
  const dextroseKcalPerDay = dextroseGPerDay * KCAL_PER_G_DEXTROSE;

  const aminoAcidGPerDay = aminoAcidGPerKgPerDay * weightKg;
  const aminoAcidKcalPerDay = aminoAcidGPerDay * KCAL_PER_G_AMINO_ACID;
  const aaBand = aminoAcidRangeFor(category, dayOfLife);
  const aminoAcidRange: RangeCheck = {
    min: aaBand.min,
    max: aaBand.max,
    status: statusFromRange(aminoAcidGPerKgPerDay, aaBand.min, aaBand.max),
  };

  const lipidGPerDay = lipidGPerKgPerDay * weightKg;
  const lipidKcalPerDay = lipidGPerDay * KCAL_PER_G_LIPID_20PCT;
  const lipidStatus: RangeStatus = statusFromRange(
    lipidGPerKgPerDay,
    0,
    LIPID_MAX_G_PER_KG_PER_DAY,
  );

  const nonProteinKcalPerDay = dextroseKcalPerDay + lipidKcalPerDay;
  const lipidPercentOfNonProteinKcal =
    nonProteinKcalPerDay > 0 ? (lipidKcalPerDay / nonProteinKcalPerDay) * 100 : 0;
  const lipidRatioStatus: RangeStatus =
    lipidKcalPerDay <= 0
      ? "rendah"
      : statusFromRange(lipidPercentOfNonProteinKcal, 25, 50);

  const totalKcalPerDay = nonProteinKcalPerDay + aminoAcidKcalPerDay;
  const totalKcalPerKgPerDay = totalKcalPerDay / weightKg;

  return {
    weightKg,
    totalVolumeMlPerDay,
    girMgKgMin,
    girRange,
    dextroseGPerDay,
    dextroseKcalPerDay,
    aminoAcidGPerDay,
    aminoAcidKcalPerDay,
    aminoAcidRange,
    lipidGPerDay,
    lipidKcalPerDay,
    lipidMaxGPerKgPerDay: LIPID_MAX_G_PER_KG_PER_DAY,
    lipidStatus,
    nonProteinKcalPerDay,
    lipidPercentOfNonProteinKcal,
    lipidRatioStatus,
    totalKcalPerDay,
    totalKcalPerKgPerDay,
  };
}
