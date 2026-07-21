export interface DisplayRow {
	label: string
	value: string
}

export interface FluidView {
	rows: DisplayRow[]
	error: string | null
	total?: number
	duration?: number
}
