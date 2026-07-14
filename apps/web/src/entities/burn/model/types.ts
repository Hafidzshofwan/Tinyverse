export interface DisplayRow {
  label: string;
  value: string;
}

export interface BurnView {
  rows: ReadonlyArray<DisplayRow>;
  tbsaPercent: number;
  selectedCount: number;
  error: string | null;
}
