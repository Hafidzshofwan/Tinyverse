/**
 * Lapisan entities untuk tekanan darah anak.
 *
 * WHY ada berkas tipis ini: fitur di lapisan features tidak mengimpor paket
 * inti secara langsung, sama seperti entities/fluid dan entities/gcs. Semua
 * perhitungan tetap tinggal di @tinyverse/clinical-core.
 */

export {
  AAP_ABSOLUTE_CUTOFF,
  AAP_ADOLESCENT_AGE,
  AAP_CRISIS_ADOLESCENT,
  AAP_DISCLAIMER,
  AAP_MEASUREMENT_CHECKLIST,
  AAP_TABLE_MAX_AGE,
  AAP_TABLE_MIN_AGE,
  BP_CATEGORY_LABEL,
  classifyBPAge13Plus,
  classifyBPUnder13,
  evaluateBP,
  findNearestHeightPercentile,
  generateIndonesianExplanation,
  getAAPBPThresholds,
  getAAPFollowUpRecommendation,
  validateBPInput,
} from "@tinyverse/clinical-core";

export type {
  BPCategory,
  BPClassification,
  BPInput,
  BPMethod,
  BPReadingCount,
  BPResult,
  BPResultOk,
  BPThresholds,
  HeightPercentile,
  HeightPercentileResult,
  Sex,
} from "@tinyverse/clinical-core";
