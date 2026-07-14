import type {
  EyeMotorAgeGroup,
  VerbalAgeGroup,
  GcsOption,
  GcsResult,
} from "@tinyverse/clinical-core";

export type { EyeMotorAgeGroup, VerbalAgeGroup, GcsOption, GcsResult };

/** Kelompok usia aktif untuk komponen (Eye/Motor terpisah dari Verbal). */
export interface AgeGroups {
  eyeMotor: EyeMotorAgeGroup;
  verbal: VerbalAgeGroup;
}

/** Opsi skor per komponen sesuai kelompok usia aktif. */
export interface GcsComponentOptions {
  eye: ReadonlyArray<GcsOption>;
  motor: ReadonlyArray<GcsOption>;
  verbal: ReadonlyArray<GcsOption>;
}
