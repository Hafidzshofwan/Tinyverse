export interface DisplayRow {
  label: string;
  value: string;
}

export interface DosingView {
  rows: ReadonlyArray<DisplayRow>;
  peringatan: ReadonlyArray<string>;
  error: string | null;
}
