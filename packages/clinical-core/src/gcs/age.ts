// GCS bounded context — derivasi kelompok usia dari usia (bulan).
// Port setia dari v17 (deriveAge / labelEM / labelV).

import type { EyeMotorAgeGroup, VerbalAgeGroup } from "./types"
import { assertValidAgeMonths } from "./guards"

/** Eye & Motor: < 12 bulan → "lt1", selain itu "ge1". */
export function eyeMotorAgeGroup(ageMonths: number): EyeMotorAgeGroup {
	assertValidAgeMonths(ageMonths)
	return ageMonths < 12 ? "lt1" : "ge1"
}

/** Verbal: < 24 bln → "lt2"; <= 60 bln → "2to5"; selain itu "gt5". */
export function verbalAgeGroup(ageMonths: number): VerbalAgeGroup {
	assertValidAgeMonths(ageMonths)
	if (ageMonths < 24) return "lt2"
	if (ageMonths <= 60) return "2to5"
	return "gt5"
}

/** Label kelompok usia Eye/Motor (teks v17). */
export function eyeMotorAgeGroupLabel(group: EyeMotorAgeGroup): string {
	return group === "lt1" ? "<1 tahun" : ">1 tahun"
}

/** Label kelompok usia Verbal (teks v17). */
export function verbalAgeGroupLabel(group: VerbalAgeGroup): string {
	if (group === "lt2") return "<2 tahun"
	if (group === "2to5") return "2\u20135 tahun"
	return ">5 tahun"
}
