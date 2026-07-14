"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { viewPlanB } from "../../entities/fluid"
import { NumberField, ResultList, type ResultRow } from "../../shared/ui"

const wrapStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 14 }

/** Feature: rehidrasi Rencana B (75 mL/kg dalam 3 jam). */
export function PlanBForm() {
	const [weight, setWeight] = useState("")
	let rows: ResultRow[] = []
	let error: string | null = null
	if (weight.trim() !== "") {
		try {
			rows = viewPlanB(Number(weight)).rows
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
				placeholder="mis. 8"
				suffix="kg"
			/>
			<ResultList rows={rows} error={error} />
		</div>
	)
}
