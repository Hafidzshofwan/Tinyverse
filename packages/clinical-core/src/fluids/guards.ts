// Fluids bounded context — input guards. Pure functions harus menolak input tidak valid.

export function assertPositiveWeight(weightKg: number): void {
	if (typeof weightKg !== "number" || !Number.isFinite(weightKg) || weightKg <= 0) {
		throw new Error(`Berat badan tidak valid: ${weightKg}. Harus angka lebih dari 0 kg.`)
	}
}

export function assertPositive(value: number, name: string): void {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		throw new Error(`${name} tidak valid: ${value}. Harus angka lebih dari 0.`)
	}
}
