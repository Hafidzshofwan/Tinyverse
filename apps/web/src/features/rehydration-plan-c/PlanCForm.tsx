"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { viewPlanC, type PlanCAgeCategory } from "../../entities/fluid"
import { NumberField, ResultList, type ResultRow } from "../../shared/ui"

const wrapStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 14 }
const groupStyle: CSSProperties = { display: "flex", gap: 8 }

function toggleStyle(active: boolean): CSSProperties {
	return {
		flex: 1,
		padding: "8px 12px",
		fontSize: 14,
		borderRadius: 10,
		cursor: "pointer",
		fontWeight: 600,
		border: "1px solid var(--etail-line)",
		background: active ? "var(--biru)" : "var(--putih)",
		color: active ? "var(--putih)" : "var(--teks)",
	}
}

const AGE_OPTIONS: ReadonlyArray<{ id: PlanCAgeCategory; label: string }> = [
	{ id: "bayi", label: "Bayi (di bawah 1 th)" },
	{ id: "anak", label: "Anak (1 th ke atas)" },
]

/** Feature: rehidrasi Rencana C (tahap 30 lalu 70 mL/kg, timing per usia). */
export function PlanCForm() {
	const [weight, setWeight] = useState("")
	const [age, setAge] = useState<PlanCAgeCategory>("bayi")
	let rows: ResultRow[] = []
	let error: string | null = null
	if (weight.trim() !== "") {
		try {
			rows = viewPlanC(Number(weight), age).rows
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
			<div role="group" aria-label="Kategori usia" style={groupStyle}>
				{AGE_OPTIONS.map((opt) => (
					<button
						key={opt.id}
						type="button"
						onClick={() => setAge(opt.id)}
						style={toggleStyle(age === opt.id)}
					>
						{opt.label}
					</button>
				))}
			</div>
			<ResultList rows={rows} error={error} />
		</div>
	)
}
