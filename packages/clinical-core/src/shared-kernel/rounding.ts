/**
 * Pembulatan klinis (shared-kernel). Semua fungsi PURE.
 * Penting untuk dosing yang aman & konsisten.
 */

export function roundTo(value: number, decimals = 0): number {
	if (!Number.isFinite(value)) {
		throw new Error("roundTo: value harus berupa angka finite")
	}
	if (!Number.isInteger(decimals) || decimals < 0) {
		throw new Error("roundTo: decimals harus bilangan bulat >= 0")
	}
	const factor = 10 ** decimals
	// Koreksi EPSILON untuk mengurangi artefak floating-point (half-up).
	return Math.round((value + Number.EPSILON) * factor) / factor
}

export function roundToStep(value: number, step: number): number {
	if (!Number.isFinite(value)) {
		throw new Error("roundToStep: value harus finite")
	}
	if (!(step > 0)) {
		throw new Error("roundToStep: step harus > 0")
	}
	return roundTo(Math.round(value / step) * step, 10)
}

export function roundToSignificant(
	value: number,
	significantDigits: number,
): number {
	if (!Number.isFinite(value)) {
		throw new Error("roundToSignificant: value harus finite")
	}
	if (!Number.isInteger(significantDigits) || significantDigits < 1) {
		throw new Error("roundToSignificant: significantDigits harus bilangan bulat >= 1")
	}
	if (value === 0) {
		return 0
	}
	const magnitude = Math.ceil(Math.log10(Math.abs(value)))
	const power = significantDigits - magnitude
	const factor = 10 ** power
	return roundTo(Math.round(value * factor) / factor, 10)
}

export function clamp(value: number, min: number, max: number): number {
	if (min > max) {
		throw new Error("clamp: min harus <= max")
	}
	return Math.min(Math.max(value, min), max)
}
