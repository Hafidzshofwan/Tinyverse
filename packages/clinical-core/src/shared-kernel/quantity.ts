/**
 * Quantity: nilai + satuan yang aman antar-dimensi (shared-kernel).
 * Mencegah operasi lintas dimensi (mis. massa + volume) lewat tipe.
 */

import type { MassUnit, VolumeUnit, TimeUnit } from "./units"
import { convertMass, convertVolume, convertTime } from "./units"

export type Dimension = "mass" | "volume" | "time"

export type UnitOf<D extends Dimension> = D extends "mass"
	? MassUnit
	: D extends "volume"
		? VolumeUnit
		: D extends "time"
			? TimeUnit
			: never

export interface Quantity<D extends Dimension = Dimension> {
	readonly value: number
	readonly unit: UnitOf<D>
	readonly dimension: D
}

function assertFinite(value: number): void {
	if (!Number.isFinite(value)) {
		throw new Error("Quantity: value harus berupa angka finite")
	}
}

export function mass(value: number, unit: MassUnit): Quantity<"mass"> {
	assertFinite(value)
	return { value, unit, dimension: "mass" }
}

export function volume(value: number, unit: VolumeUnit): Quantity<"volume"> {
	assertFinite(value)
	return { value, unit, dimension: "volume" }
}

export function time(value: number, unit: TimeUnit): Quantity<"time"> {
	assertFinite(value)
	return { value, unit, dimension: "time" }
}

export function toUnit<D extends Dimension>(
	quantity: Quantity<D>,
	unit: UnitOf<D>,
): Quantity<D> {
	let converted: number
	switch (quantity.dimension) {
		case "mass":
			converted = convertMass(
				quantity.value,
				quantity.unit as unknown as MassUnit,
				unit as unknown as MassUnit,
			)
			break
		case "volume":
			converted = convertVolume(
				quantity.value,
				quantity.unit as unknown as VolumeUnit,
				unit as unknown as VolumeUnit,
			)
			break
		case "time":
			converted = convertTime(
				quantity.value,
				quantity.unit as unknown as TimeUnit,
				unit as unknown as TimeUnit,
			)
			break
		default:
			throw new Error("Quantity: dimensi tidak dikenal")
	}
	return { value: converted, unit, dimension: quantity.dimension }
}

export function add<D extends Dimension>(
	a: Quantity<D>,
	b: Quantity<D>,
): Quantity<D> {
	const bInA = toUnit(b, a.unit)
	return { value: a.value + bInA.value, unit: a.unit, dimension: a.dimension }
}

export function subtract<D extends Dimension>(
	a: Quantity<D>,
	b: Quantity<D>,
): Quantity<D> {
	const bInA = toUnit(b, a.unit)
	return { value: a.value - bInA.value, unit: a.unit, dimension: a.dimension }
}
