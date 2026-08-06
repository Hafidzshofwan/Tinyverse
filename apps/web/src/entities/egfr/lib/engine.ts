import {
  BEDSIDE_SCHWARTZ_K,
  BEDSIDE_SCHWARTZ_VALID_AGE,
  CKD_STAGES,
  CKID_U25_CYSC,
  CKID_U25_SCR,
  CKID_U25_VALID_AGE,
  CREATININE_MGDL_TO_UMOL_FACTOR,
  FURTH_GLOMERULAR_FASTER_PCT,
  FURTH_BEST_CASE_LABEL,
  FURTH_WORST_CASE_YEARS,
  PLAUSIBLE_RANGES,
  PROGNOSIS_EGFR_CATEGORIES,
  UPCR_CATEGORIES,
  type CkdStage,
  type PrognosisEgfrCategory,
  type Sex,
  type UpcrCategory,
} from "../data/constants";

/**
 * Mesin hitung eGFR pediatrik. WHY implementasi lokal (bukan di paket
 * @tinyverse/clinical-core): kalkulator ini baru dan belum dipindahkan ke
 * paket bersama, mengikuti pola entities/bilirubin, entities/tpn, dkk.
 */

// --- Konversi satuan ---------------------------------------------------------

export function creatinineUmolToMgDl(umol: number): number {
  return umol / CREATININE_MGDL_TO_UMOL_FACTOR;
}

export function creatinineMgDlToUmol(mgDl: number): number {
  return mgDl * CREATININE_MGDL_TO_UMOL_FACTOR;
}

// --- K rumus CKiD U25 --------------------------------------------------------

function kCkidU25Scr(ageYears: number, sex: Sex): number | null {
  if (ageYears < CKID_U25_VALID_AGE.min || ageYears > CKID_U25_VALID_AGE.max) return null;
  const cfg = CKID_U25_SCR[sex];
  if (ageYears >= cfg.knotHigh) return cfg.kAdult;
  if (ageYears >= cfg.knotLow) return cfg.kBase * Math.pow(cfg.rAbove, ageYears - cfg.knotLow);
  return cfg.kBase * Math.pow(cfg.rBelow, ageYears - cfg.knotLow);
}

function kCkidU25CysC(ageYears: number, sex: Sex): number | null {
  if (ageYears < CKID_U25_VALID_AGE.min || ageYears > CKID_U25_VALID_AGE.max) return null;
  const cfg = CKID_U25_CYSC[sex];
  if (ageYears >= cfg.knotHigh) return cfg.kAdult;
  if (ageYears >= cfg.knotLow) return cfg.kBase * Math.pow(cfg.rAbove, ageYears - cfg.knotLow);
  return cfg.kBase * Math.pow(cfg.rBelow, ageYears - cfg.knotLow);
}

// --- Rumus eGFR --------------------------------------------------------------

export interface CkidU25ScrResult {
  eGFR: number;
  kUsed: number;
  validForAge: boolean;
}

/**
 * CKiD U25 berbasis tinggi/kreatinin (Pierce 2021).
 *
 * WHY dibagi /100: rumus asli memakai tinggi dalam METER ("GFR = 41.3 x
 * [height (in m)/SCr (in mg/dl)]"), sedangkan input pengguna dalam cm demi
 * kebiasaan klinis. Konversi cm -> m dilakukan di sini, bukan di form, agar
 * satu-satunya tempat pengali satuan berada di mesin hitung.
 */
export function calcCkidU25Scr(ageYears: number, sex: Sex, heightCm: number, scrMgDl: number): CkidU25ScrResult | null {
  const k = kCkidU25Scr(ageYears, sex);
  if (k === null || !Number.isFinite(heightCm) || !Number.isFinite(scrMgDl) || scrMgDl <= 0) return null;
  const heightM = heightCm / 100;
  const eGFR = (k * heightM) / scrMgDl;
  return {
    eGFR,
    kUsed: k,
    validForAge: ageYears >= CKID_U25_VALID_AGE.min && ageYears <= CKID_U25_VALID_AGE.max,
  };
}

export interface CkidU25CysCResult {
  eGFR: number;
  kUsed: number;
  validForAge: boolean;
}

/** CKiD U25 berbasis 1/cystatin C (Pierce 2021). cysCMgL dalam mg/L. */
export function calcCkidU25CysC(ageYears: number, sex: Sex, cysCMgL: number): CkidU25CysCResult | null {
  const k = kCkidU25CysC(ageYears, sex);
  if (k === null || !Number.isFinite(cysCMgL) || cysCMgL <= 0) return null;
  const eGFR = k / cysCMgL;
  return {
    eGFR,
    kUsed: k,
    validForAge: ageYears >= CKID_U25_VALID_AGE.min && ageYears <= CKID_U25_VALID_AGE.max,
  };
}

export interface BedsideSchwartzResult {
  eGFR: number;
  validForAge: boolean;
}

/** Bedside Schwartz (Schwartz 2009). Tinggi dalam CM (bukan meter). */
export function calcBedsideSchwartz(ageYears: number, heightCm: number, scrMgDl: number): BedsideSchwartzResult | null {
  if (!Number.isFinite(heightCm) || !Number.isFinite(scrMgDl) || scrMgDl <= 0) return null;
  const eGFR = (BEDSIDE_SCHWARTZ_K * heightCm) / scrMgDl;
  return {
    eGFR,
    validForAge: ageYears >= BEDSIDE_SCHWARTZ_VALID_AGE.min && ageYears <= BEDSIDE_SCHWARTZ_VALID_AGE.max,
  };
}

// --- Stadium CKD (KDIGO) -----------------------------------------------------

export interface CkdStageInfo {
  stage: CkdStage;
  label: string;
  rangeLabel: string;
}

export function classifyCkdStage(eGFR: number): CkdStageInfo {
  const found = CKD_STAGES.find((s) => eGFR >= s.min && (s.max === null || eGFR <= s.max));
  const fallback = CKD_STAGES[CKD_STAGES.length - 1] as (typeof CKD_STAGES)[number];
  const row = found ?? fallback;
  return { stage: row.stage, label: row.label, rangeLabel: row.rangeLabel };
}

// --- Validasi & peringatan klinis -------------------------------------------

export interface EgfrInputWarning {
  field: "age" | "height" | "scr" | "cysC" | "upcr";
  message: string;
}

export function validateEgfrInputs(input: {
  ageYears: number;
  heightCm: number;
  scrMgDl: number;
  cysCMgL?: number | null;
  upcrMgMg?: number | null;
}): EgfrInputWarning[] {
  const warnings: EgfrInputWarning[] = [];
  const r = PLAUSIBLE_RANGES;

  if (!Number.isFinite(input.ageYears) || input.ageYears < r.ageYears.min || input.ageYears > r.ageYears.max) {
    warnings.push({ field: "age", message: `Usia di luar rentang wajar kalkulator ini (${r.ageYears.min}-${r.ageYears.max} tahun).` });
  } else if (input.ageYears > CKID_U25_VALID_AGE.max) {
    warnings.push({ field: "age", message: `Usia di atas ${CKID_U25_VALID_AGE.max} tahun berada di luar validasi rumus CKiD U25 maupun Bedside Schwartz.` });
  }

  if (!Number.isFinite(input.heightCm) || input.heightCm < r.heightCm.min || input.heightCm > r.heightCm.max) {
    warnings.push({ field: "height", message: `Tinggi badan di luar rentang wajar (${r.heightCm.min}-${r.heightCm.max} cm). Periksa kembali satuan/angka.` });
  }

  if (!Number.isFinite(input.scrMgDl) || input.scrMgDl < r.scrMgDl.min || input.scrMgDl > r.scrMgDl.max) {
    warnings.push({ field: "scr", message: `Kreatinin serum di luar rentang wajar (${r.scrMgDl.min}-${r.scrMgDl.max} mg/dL). Periksa kembali satuan/angka.` });
  }

  if (input.cysCMgL != null && Number.isFinite(input.cysCMgL)) {
    if (input.cysCMgL < r.cysCMgL.min || input.cysCMgL > r.cysCMgL.max) {
      warnings.push({ field: "cysC", message: `Cystatin C di luar rentang wajar (${r.cysCMgL.min}-${r.cysCMgL.max} mg/L). Periksa kembali satuan/angka.` });
    }
  }

  if (input.upcrMgMg != null && Number.isFinite(input.upcrMgMg)) {
    if (input.upcrMgMg < r.upcrMgMg.min || input.upcrMgMg > r.upcrMgMg.max) {
      warnings.push({ field: "upcr", message: `Rasio protein-kreatinin urin (UPCR) di luar rentang wajar (${r.upcrMgMg.min}-${r.upcrMgMg.max} mg/mg). Periksa kembali satuan/angka.` });
    }
  }

  return warnings;
}

// --- Modul prognosis (Furth 2018) - lihat catatan keterbatasan di constants.ts

export function classifyUpcrCategory(upcrMgMg: number): UpcrCategory | null {
  const found = UPCR_CATEGORIES.find((c) => upcrMgMg >= c.min && (c.max === null || upcrMgMg < c.max || (c.key === "high" && upcrMgMg >= c.min)));
  return found ? found.key : null;
}

export function classifyPrognosisEgfrCategory(eGFR: number): PrognosisEgfrCategory | null {
  const found = PROGNOSIS_EGFR_CATEGORIES.find((c) => eGFR >= c.min && (c.max === null || eGFR <= c.max));
  return found ? found.key : null;
}

export type ProgressionRiskBand = "rendah" | "sedang" | "tinggi" | "sangat-tinggi";

export interface ProgressionRiskResult {
  band: ProgressionRiskBand;
  bandLabel: string;
  egfrCategoryLabel: string;
  upcrCategoryLabel: string;
  applicable: boolean;
  note: string;
  glomerularNote?: string;
}

const RISK_BAND_LABEL: Record<ProgressionRiskBand, string> = {
  rendah: "Risiko rendah",
  sedang: "Risiko sedang",
  tinggi: "Risiko tinggi",
  "sangat-tinggi": "Risiko sangat tinggi",
};

/**
 * Estimasi pita risiko progresi ke ESRD (Furth 2018).
 *
 * WHY pita ordinal, bukan "Stadium 1-6" resmi: sumber yang tersedia hanya
 * memuat abstrak/komentar, bukan tabel lengkap 6 stadium dengan median
 * waktu per selnya. Fungsi ini menyusun peringkat ordinal dari 4 kategori
 * eGFR x 3 kategori UPCR (arah risiko sesuai teks: risiko naik saat UPCR
 * naik dan/atau eGFR turun), lalu mengelompokkannya menjadi 4 pita kualitatif.
 * Angka median waktu HANYA ditampilkan untuk 2 titik ekstrem yang eksplisit
 * disebutkan sumber (>10 tahun & 0,8 tahun) - bukan untuk kombinasi lainnya.
 */
export function estimateProgressionRisk(eGFR: number, upcrMgMg: number, isGlomerular?: boolean | null): ProgressionRiskResult | null {
  const egfrCat = classifyPrognosisEgfrCategory(eGFR);
  const upcrCat = classifyUpcrCategory(upcrMgMg);
  if (!egfrCat || !upcrCat) return null;

  const egfrRank: Record<PrognosisEgfrCategory, number> = { e60_89: 0, e45_59: 1, e30_44: 2, eBelow30: 3 };
  const upcrRank: Record<UpcrCategory, number> = { low: 0, moderate: 1, high: 2 };
  const score = egfrRank[egfrCat] + upcrRank[upcrCat]; // 0..5

  let band: ProgressionRiskBand;
  if (score <= 1) band = "rendah";
  else if (score <= 2) band = "sedang";
  else if (score <= 3) band = "tinggi";
  else band = "sangat-tinggi";

  const egfrRow = PROGNOSIS_EGFR_CATEGORIES.find((c) => c.key === egfrCat);
  const upcrRow = UPCR_CATEGORIES.find((c) => c.key === upcrCat);

  let note = `Perkiraan pita risiko relatif berdasarkan kategori eGFR dan UPCR (Furth 2018), bukan penomoran 6 stadium resmi (tabel rinci per stadium tidak tersedia dari materi rujukan yang diberikan).`;
  if (egfrCat === "e60_89" && upcrCat === "low") {
    note += ` Kombinasi risiko paling rendah pada studi rujukan memiliki median waktu ke kejadian komposit ${FURTH_BEST_CASE_LABEL}.`;
  }
  if (egfrCat === "eBelow30" && upcrCat === "high") {
    note += ` Kombinasi risiko paling tinggi pada studi rujukan memiliki median waktu ke kejadian komposit sekitar ${FURTH_WORST_CASE_YEARS} tahun.`;
  }

  const glomerularNote =
    isGlomerular == null
      ? undefined
      : isGlomerular
        ? `Penyakit ginjal glomerular umumnya mencapai kejadian komposit ~${FURTH_GLOMERULAR_FASTER_PCT}% lebih cepat dibanding non-glomerular pada tingkat risiko yang sama.`
        : `Penyakit ginjal non-glomerular umumnya berprogresi lebih lambat dibanding glomerular (~${FURTH_GLOMERULAR_FASTER_PCT}% lebih lambat mencapai kejadian komposit) pada tingkat risiko yang sama.`;

  return {
    band,
    bandLabel: RISK_BAND_LABEL[band],
    egfrCategoryLabel: egfrRow?.label ?? "",
    upcrCategoryLabel: upcrRow?.label ?? "",
    applicable: true,
    note,
    glomerularNote,
  };
}

// --- Fungsi gabungan untuk lapisan features ---------------------------------

export interface EgfrComputeInput {
  ageYears: number;
  sex: Sex;
  heightCm: number;
  scrMgDl: number;
  cysCMgL?: number | null;
  upcrMgMg?: number | null;
  isGlomerular?: boolean | null;
}

export interface EgfrFormulaOutput {
  eGFR: number;
  stage: CkdStageInfo;
  validForAge: boolean;
  kUsed?: number | null;
}

export interface EgfrComputeResult {
  warnings: EgfrInputWarning[];
  ckidU25Scr: EgfrFormulaOutput;
  bedsideSchwartz: EgfrFormulaOutput;
  ckidU25CysC: EgfrFormulaOutput | null;
  prognosis: ProgressionRiskResult | null;
}

/**
 * Menggabungkan semua rumus + klasifikasi + modul prognosis menjadi satu
 * hasil. Mengembalikan null hanya bila input dasar (tinggi/kreatinin) tidak
 * valid secara matematis (misal SCr <= 0) - peringatan rentang klinis tetap
 * dikembalikan lewat `warnings`, kalkulasi tidak diblokir olehnya.
 */
export function computeEgfr(input: EgfrComputeInput): EgfrComputeResult | null {
  const warnings = validateEgfrInputs({
    ageYears: input.ageYears,
    heightCm: input.heightCm,
    scrMgDl: input.scrMgDl,
    cysCMgL: input.cysCMgL,
    upcrMgMg: input.upcrMgMg,
  });

  const scrRes = calcCkidU25Scr(input.ageYears, input.sex, input.heightCm, input.scrMgDl);
  const schwartzRes = calcBedsideSchwartz(input.ageYears, input.heightCm, input.scrMgDl);
  if (!scrRes || !schwartzRes) return null;

  const ckidU25Scr: EgfrFormulaOutput = {
    eGFR: scrRes.eGFR,
    stage: classifyCkdStage(scrRes.eGFR),
    validForAge: scrRes.validForAge,
    kUsed: scrRes.kUsed,
  };
  const bedsideSchwartz: EgfrFormulaOutput = {
    eGFR: schwartzRes.eGFR,
    stage: classifyCkdStage(schwartzRes.eGFR),
    validForAge: schwartzRes.validForAge,
  };

  let ckidU25CysC: EgfrFormulaOutput | null = null;
  if (input.cysCMgL != null && Number.isFinite(input.cysCMgL) && input.cysCMgL > 0) {
    const cysRes = calcCkidU25CysC(input.ageYears, input.sex, input.cysCMgL);
    if (cysRes) {
      ckidU25CysC = {
        eGFR: cysRes.eGFR,
        stage: classifyCkdStage(cysRes.eGFR),
        validForAge: cysRes.validForAge,
        kUsed: cysRes.kUsed,
      };
    }
  }

  let prognosis: ProgressionRiskResult | null = null;
  if (input.upcrMgMg != null && Number.isFinite(input.upcrMgMg) && input.upcrMgMg >= 0) {
    prognosis = estimateProgressionRisk(ckidU25Scr.eGFR, input.upcrMgMg, input.isGlomerular);
  }

  return { warnings, ckidU25Scr, bedsideSchwartz, ckidU25CysC, prognosis };
}
