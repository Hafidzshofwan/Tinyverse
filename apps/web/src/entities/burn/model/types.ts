export interface DisplayRow {
  label: string;
  value: string;
}

export interface BurnChart {
  label: string;
  A: number;
  B: number;
  C: number;
}

export interface BurnAreaDetail {
  label: string;
  percent: number;
}

export interface BurnView {
  rows: ReadonlyArray<DisplayRow>;
  tbsaPercent: number;
  selectedCount: number;
  error: string | null;
  chart: BurnChart | null;
  areas: ReadonlyArray<BurnAreaDetail>;
  parkland: number;
  first8h: number;
  next16h: number;
  maintenance: number;
  maintenanceRincian: string[];
  total24h: number;
  urineMin: number;
  urineMax: number;
  urineLabel: string;
  weightKg: number;
}
