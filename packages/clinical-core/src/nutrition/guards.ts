export function assertValidWeightKg(weightKg: number): void {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Berat badan harus lebih dari 0 kg.");
  }
}

export function assertValidAgeMonths(ageMonths: number | null): void {
  if (ageMonths == null) return;
  if (!Number.isFinite(ageMonths) || ageMonths < 0) {
    throw new Error("Usia (bulan) tidak boleh negatif.");
  }
}

export function assertValidVolumeMl(volumeMl: number): void {
  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    throw new Error("Total volume susu harus lebih dari 0 mL.");
  }
}
