export type BandId = "neo" | "bayi" | "balita" | "anak" | "remaja";

export interface Band {
  id: BandId;
  label: string;
  min: number;
  max: number;
}

export interface LabRef {
  key: string;
  name: string;
  unit: string;
  r: Record<BandId, readonly [number, number]>;
}

/** Satu baris hasil interpretasi (kelas warna dx-* + konten HTML statis). */
export interface DxLine {
  cls: "dx-ok" | "dx-low" | "dx-high" | "dx-warn" | "dx-neutral";
  html: string;
}

export interface RefRow {
  name: string;
  range: string;
  unit: string;
}
