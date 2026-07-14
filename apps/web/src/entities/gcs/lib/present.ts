import {
  calculateGcs,
  EYE_OPTIONS,
  MOTOR_OPTIONS,
  VERBAL_OPTIONS,
  eyeMotorAgeGroup,
  verbalAgeGroup,
  eyeMotorAgeGroupLabel,
  verbalAgeGroupLabel,
  type GcsInput,
  type GcsResult,
} from "@tinyverse/clinical-core";
import type {
  AgeGroups,
  GcsComponentOptions,
  EyeMotorAgeGroup,
  VerbalAgeGroup,
} from "../model/types";

/**
 * Turunkan kelompok usia dari usia (bulan). Bila usia belum diisi/ tidak valid,
 * pakai default v17 (ge1 / gt5) supaya opsi tetap tampil dan bisa diubah manual.
 */
export function deriveAgeGroups(ageMonths: number | null): AgeGroups {
  if (ageMonths == null || !Number.isFinite(ageMonths) || ageMonths < 0) {
    return { eyeMotor: "ge1", verbal: "gt5" };
  }
  return {
    eyeMotor: eyeMotorAgeGroup(ageMonths),
    verbal: verbalAgeGroup(ageMonths),
  };
}

/** Opsi skor tiap komponen untuk kelompok usia aktif (dari tabel OPSI core). */
export function gcsOptionsFor(groups: AgeGroups): GcsComponentOptions {
  return {
    eye: EYE_OPTIONS[groups.eyeMotor],
    motor: MOTOR_OPTIONS[groups.eyeMotor],
    verbal: VERBAL_OPTIONS[groups.verbal],
  };
}

/** Bungkus perhitungan core (semua interpretasi teks berasal dari core). */
export function computeGcs(input: GcsInput): GcsResult {
  return calculateGcs(input);
}

export function eyeMotorLabel(group: EyeMotorAgeGroup): string {
  return eyeMotorAgeGroupLabel(group);
}

export function verbalLabel(group: VerbalAgeGroup): string {
  return verbalAgeGroupLabel(group);
}
