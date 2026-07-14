"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { viewDrip, type DripType } from "../../entities/fluid"
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

const DRIP_TYPES: ReadonlyArray<{ id: DripType; label: string }> = [
	{ id: "makro", label: "Makro (20 gtt/mL)" },
	{ id: "mikro", label: "Mikro (60 gtt/mL)" },
]

/** Feature: kalkulator laju tetes infus (makro/mikro). */
export function DripForm() {
	const [volume, setVolume] = useState("")
	const [hours, setHours] = useState("")
	const [dripType, setDripType] = useState<DripType>("makro")
	let rows: ResultRow[] = []
	let error: string | null = null
	if (volume.trim() !== "" && hours.trim() !== "") {
		try {
			rows = viewDrip(Number(volume), Number(hours), dripType).rows
		} catch (e) {
			error = e instanceof Error ? e.message : "Input tidak valid"
		}
	}
	return (
		<div style={wrapStyle}>
			<NumberField
				label="Volume cairan"
				value={volume}
				onValueChange={setVolume}
				placeholder="mis. 500"
				suffix="mL"
			/>
			<NumberField
				label="Lama pemberian"
				value={hours}
				onValueChange={setHours}
				placeholder="mis. 8"
				suffix="jam"
			/>
			<div role="group" aria-label="Jenis drip" style={groupStyle}>
				{DRIP_TYPES.map((opt) => (
					<button
						key={opt.id}
						type="button"
						onClick={() => setDripType(opt.id)}
						style={toggleStyle(dripType === opt.id)}
					>
						{opt.label}
					</button>
				))}
			</div>
			<ResultList rows={rows} error={error} />
		</div>
	)
}
