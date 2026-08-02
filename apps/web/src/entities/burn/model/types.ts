import type { BurnMechanism, DripType } from "@tinyverse/clinical-core";

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

/** Pilihan tambahan yang hanya dipakai oleh perhitungan kerangka ATLS. */
export interface BurnAtlsOptions {
  mekanisme?: BurnMechanism;
  /** Jam sejak KEJADIAN (jam nol), sebagai teks dari input. */
  jamSejakKejadian?: string;
  /** Cairan yang sudah masuk sebelum tiba (mL), sebagai teks dari input. */
  praRsMl?: string;
  dripType?: DripType;
}

/**
 * Hasil resusitasi kerangka ATLS siap render.
 * Dibedakan tegas dari blok Parkland lama agar keduanya tidak tertukar.
 */
export interface BurnAtlsView {
  faktor: number;
  faktorAlasan: string;
  mekanisme: BurnMechanism;
  total24h: number;
  fase1Ml: number;
  fase2Ml: number;
  jamSejakKejadian: number;
  sisaJamFase1: number;
  fase1Terlewat: boolean;
  praRsMl: number;
  fase1SisaMl: number;
  fase1LajuMlPerJam: number;
  fase2LajuMlPerJam: number;
  rumatanBerlaku: boolean;
  rumatanMlPerJam: number;
  rumatanRincian: string;
  urinMin: number;
  urinMax: number;
  urinLabel: string;
  batasCreepMlPerJam: number;
  melampauiCreep: boolean;
  /** Faktor tetes set infus yang dipilih (tetes per mL). */
  faktorTetes: number;
  dripLabel: string;
  /** Tetes per menit untuk fase pertama; null bila volume nol. */
  tetesFase1: number | null;
  tetesFase2: number | null;
  tetesRumatan: number | null;
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
  /** Blok ATLS. null bila input belum lengkap atau %TBSA masih nol. */
  atls: BurnAtlsView | null;
}
