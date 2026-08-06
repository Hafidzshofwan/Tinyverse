/**
 * Lapisan entities untuk kalkulator eGFR pediatrik. Implementasi lokal
 * (belum ada di @tinyverse/clinical-core), mengikuti pola entities/bilirubin
 * dan entities/tpn.
 */

export {
  calcBedsideSchwartz,
  calcCkidU25CysC,
  calcCkidU25Scr,
  classifyCkdStage,
  classifyPrognosisEgfrCategory,
  classifyUpcrCategory,
  computeEgfr,
  creatinineMgDlToUmol,
  creatinineUmolToMgDl,
  estimateProgressionRisk,
  validateEgfrInputs,
} from "./lib/engine";

export type {
  BedsideSchwartzResult,
  CkdStageInfo,
  CkidU25CysCResult,
  CkidU25ScrResult,
  EgfrComputeInput,
  EgfrComputeResult,
  EgfrFormulaOutput,
  EgfrInputWarning,
  ProgressionRiskBand,
  ProgressionRiskResult,
} from "./lib/engine";

export {
  BEDSIDE_SCHWARTZ_K,
  BEDSIDE_SCHWARTZ_VALID_AGE,
  CKD_STAGES,
  CKID_U25_CONSTANT_K,
  CKID_U25_CYSC,
  CKID_U25_SCR,
  CKID_U25_VALID_AGE,
  CREATININE_MGDL_TO_UMOL_FACTOR,
  FURTH_BEST_CASE_LABEL,
  FURTH_GLOMERULAR_FASTER_PCT,
  FURTH_WORST_CASE_YEARS,
  PLAUSIBLE_RANGES,
  PROGNOSIS_EGFR_CATEGORIES,
  UPCR_CATEGORIES,
} from "./data/constants";

export type { CkdStage, PrognosisEgfrCategory, Sex, UpcrCategory } from "./data/constants";
