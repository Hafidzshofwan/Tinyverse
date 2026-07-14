/**
 * Perhitungan umur pediatrik (shared-kernel). Semua fungsi PURE.
 * Memakai UTC agar deterministik (tidak terpengaruh zona waktu / DST).
 */

export type AgeBand = "neonate" | "infant" | "child" | "adolescent"

function assertOrder(birth: Date, ref: Date): void {
	if (ref.getTime() < birth.getTime()) {
		throw new Error("age: tanggal referensi tidak boleh sebelum tanggal lahir")
	}
}

function utcMidnight(d: Date): number {
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export function ageInDays(birth: Date, ref: Date): number {
	assertOrder(birth, ref)
	return Math.floor((utcMidnight(ref) - utcMidnight(birth)) / 86_400_000)
}

export function ageInMonths(birth: Date, ref: Date): number {
	assertOrder(birth, ref)
	let months =
		(ref.getUTCFullYear() - birth.getUTCFullYear()) * 12 +
		(ref.getUTCMonth() - birth.getUTCMonth())
	if (ref.getUTCDate() < birth.getUTCDate()) {
		months--
	}
	return months
}

export function ageInYears(birth: Date, ref: Date): number {
	assertOrder(birth, ref)
	let years = ref.getUTCFullYear() - birth.getUTCFullYear()
	const monthDiff = ref.getUTCMonth() - birth.getUTCMonth()
	if (monthDiff < 0 || (monthDiff === 0 && ref.getUTCDate() < birth.getUTCDate())) {
		years--
	}
	return years
}

export function ageBand(birth: Date, ref: Date): AgeBand {
	if (ageInDays(birth, ref) < 28) {
		return "neonate"
	}
	const years = ageInYears(birth, ref)
	if (years < 1) {
		return "infant"
	}
	if (years < 12) {
		return "child"
	}
	return "adolescent"
}
