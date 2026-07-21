export interface DisplayRow {
  label: string;
  value: string;
}

export interface PlanCStage {
  volumeMl: number;
  mlPerHour: number;
  hours: number;
  mlPerKg: number;
}

export interface FluidView {
  rows: DisplayRow[];
  rincian?: DisplayRow[];
  error: string | null;
  total?: number;
  duration?: number;
  totalHours?: number;
  stage1?: PlanCStage;
  stage2?: PlanCStage;
}
