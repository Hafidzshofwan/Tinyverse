export type AbgSample = "arteri" | "vena" | "kapiler"

export interface AbgInput {
  ph: number
  pco2: number
  hco3: number
  sample?: AbgSample
  na?: number | null
  cl?: number | null
  po2?: number | null
  fio2?: number | null
}

export type PhStatus = "asidemia" | "alkalemia" | "normal"
export type PrimaryDisorder =
  | "met-as"
  | "met-alk"
  | "resp-as"
  | "resp-alk"
  | "mixed"
  | null
export type PrimerClass = "ok" | "warn" | "bad"
export type ExtraDisorder = "met-as" | "met-alk" | "resp-as" | "resp-alk" | null
export type RespPattern = "akut" | "kronik" | "parsial" | null
export type AnionGapCategory = "tinggi" | "rendah" | "normal"
export type PfCategory = "normal" | "ringan" | "sedang" | "berat"
export type WarningCode = "ph" | "pco2" | "hco3"

export interface CompensationResult {
  level: string | null
  // metabolik
  expectedPco2Low: number | null
  expectedPco2High: number | null
  adequate: boolean | null
  extra: ExtraDisorder
  // respiratorik
  expectedHco3Acute: number | null
  expectedHco3Chronic: number | null
  pattern: RespPattern
  suspect: ExtraDisorder
}

export interface AnionGapResult {
  value: number
  category: AnionGapCategory
}

export interface OxygenationResult {
  pfRatio: number | null
  pfCategory: PfCategory | null
  aaGradient: number | null
}

export interface AbgResult {
  warnings: WarningCode[]
  phStatus: PhStatus
  acidemia: boolean
  alkalemia: boolean
  primary: PrimaryDisorder
  primerClass: PrimerClass
  compensation: CompensationResult | null
  anionGap: AnionGapResult | null
  oxygenation: OxygenationResult | null
  sample: AbgSample
}
