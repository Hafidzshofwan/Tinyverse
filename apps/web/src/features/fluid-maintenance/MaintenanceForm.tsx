"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { viewMaintenance } from "../../entities/fluid"
import { NumberField, ResultList, type ResultRow } from "../../shared/ui"

const wrapStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 14 }

/** Feature: kalkulator cairan rumatan (Holliday–Segar). */
export function MaintenanceForm() {
	const [weight, setWeight] = useState("")
	let rows: ResultRow[] = []
	let error: string | null = null
	if (weight.trim() !== "") {
		try {
			rows = viewMaintenance(Number(weight)).rows
		} catch (e) {
			error = e instanceof Error ? e.message : "Input tidak valid"
		}
	}
	return (
		<div style={wrapStyle}>
			<NumberField
				label="Berat badan"
				value={weight}
				onValueChange={setWeight}
				placeholder="mis. 12.5"
				suffix="kg"
			/>
			<ResultList rows={rows} error={error} />
		</div>
	)
}
