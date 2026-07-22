export type PatSide = "normal" | "abnormal" | null;

export interface PatState {
  appearance: PatSide;
  breathing: PatSide;
  circulation: PatSide;
}

export type Lvl = "stabil" | "waspada" | "kritis";

export interface PatResult {
  kat: string;
  lvl: Lvl;
  saran: string;
}

export interface PalsInput {
  bb: number | null;
  ub: number | null;
}

export interface PalsResult {
  hasBb: boolean;
  epi: string;
  epiET: string;
  defib: string;
  kardio: string;
  d10: string;
  d25: string;
  ettC: string;
  ettU: string;
  ettDepth: string;
  suction: string;
  blade: string;
}

export type GcsAgeEM = "lt1" | "ge1";
export type GcsAgeV = "lt2" | "2to5" | "gt5";
export type GcsKomp = "eye" | "motor" | "verbal";

export interface GcsOption {
  s: number;
  t: string;
}

export interface GcsState {
  ageEM: GcsAgeEM;
  ageV: GcsAgeV;
  eye: number | null;
  motor: number | null;
  verbal: number | null;
  tube: boolean;
  manualEM: boolean;
  manualV: boolean;
}

export interface GcsResult {
  lengkap: boolean;
  skorTeks: string;
  total?: number;
  lvl?: Lvl;
  kat?: string;
  saran?: string;
  totTeks?: string;
}

export interface ResusLogItem {
  jam: string;
  teks: string;
  t: number;
}
