/*
 * Konstanta kalkulator eGFR anak & remaja.
 *
 * Semua konstanta numerik pada berkas ini disalin verbatim dari 3 rujukan
 * berikut. DILARANG mengarang, membulatkan ulang, menginterpolasi, atau
 * mengubah angka konstanta di berkas ini.
 *
 * 1. "Age- and sex-dependent clinical equations to estimate glomerular
 *    filtration rates in children and young adults with chronic kidney
 *    disease." Kidney International. 2021. doi:10.1016/j.kint.2020.10.047
 *    -> rumus CKiD U25 (berbasis tinggi/kreatinin & berbasis cystatin C),
 *    Table 2 + teks hasil halaman 950-951.
 * 2. "New equations to estimate GFR in children with CKD." Journal of the
 *    American Society of Nephrology (JASN). 2009.
 *    doi:10.1681/ASN.2008030287 -> rumus Bedside Schwartz.
 * 3. "Estimating Time to ESRD in Children With CKD." American Journal of
 *    Kidney Diseases (AJKD). 2018. doi:10.1053/j.ajkd.2017.12.011 -> modul
 *    prognosis.
 */

export type Sex = "male" | "female";

// --- CKiD U25 - model tinggi/kreatinin (Pierce 2021) ------------------------
//
// eGFR = K x (tinggi_meter / SCr_mg/dL). PENTING: tinggi pada rumus asli
// dalam METER, bukan cm (lihat Pierce 2021: "GFR = 41.3 x [height (in m) /
// SCr (in mg/dl)]"; median tinggi kohort ~1.51 m dengan K~41.8). Kalkulator
// ini menerima input tinggi dalam cm (kebiasaan klinis) dan mengonversinya
// ke meter secara internal sebelum dikalikan K.
//
// K berbentuk piecewise dengan simpul usia 12 dan 18 tahun, SAMA untuk kedua
// jenis kelamin (Pierce 2021, hlm. 950: "For boys aged 1 to 12 years, K
// increased by a factor of 1.008 per year of age; for boys aged 12 to 18
// years, K increased more rapidly (1.045...)"; "For girls aged 12 to 18
// years, K increased by 1.023 per year increase in age.").
export const CKID_U25_SCR = {
  male: { kBase: 39.0, rBelow: 1.008, rAbove: 1.045, kAdult: 50.8, knotLow: 12, knotHigh: 18 },
  female: { kBase: 36.1, rBelow: 1.008, rAbove: 1.023, kAdult: 41.4, knotLow: 12, knotHigh: 18 },
} as const;

// --- CKiD U25 - model 1/cystatin C (Pierce 2021) ----------------------------
//
// eGFR = K / cysC_mg/L (cystatin C dalam mg/L, TIDAK memakai tinggi badan).
// K berbentuk piecewise dengan simpul usia BERBEDA per jenis kelamin: laki-
// laki 15 & 18 tahun, perempuan 12 & 18 tahun (Pierce 2021, hlm. 950-951:
// "parameterization was piecewise linear, with knots at the ages of 15 and
// 18 years for males and 12 and 18 years for females").
export const CKID_U25_CYSC = {
  male: { kBase: 87.2, rBelow: 1.011, rAbove: 0.96, kAdult: 77.1, knotLow: 15, knotHigh: 18 },
  female: { kBase: 79.9, rBelow: 1.004, rAbove: 0.974, kAdult: 68.3, knotLow: 12, knotHigh: 18 },
} as const;

// Model K konstan (tanpa ketergantungan usia), sex-specific saja - alternatif
// yang lebih sederhana dari Pierce 2021, ditampilkan sebagai info tambahan.
export const CKID_U25_CONSTANT_K = {
  scr: { male: 41.8, female: 37.6 },
  cysC: { male: 81.9, female: 74.9 },
} as const;

export const CKID_U25_VALID_AGE = { min: 1, max: 25 };

// --- Bedside Schwartz (Schwartz 2009) ---------------------------------------
//
// eGFR = 0.413 x (tinggi_cm / SCr_mg/dL). Tinggi dalam CM (Schwartz 2009:
// "with height measured in cm, a bedside calculation of 0.413*(height/serum
// creatinine), provides a good approximation"). Berlaku usia 1-16 tahun
// (kohort asli CKiD usia 1 s/d 16 tahun).
export const BEDSIDE_SCHWARTZ_K = 0.413;
export const BEDSIDE_SCHWARTZ_VALID_AGE = { min: 1, max: 16 };

// --- Konversi satuan ---------------------------------------------------------
//
// Kreatinin: 1 mg/dL = 88.4 umol/L (faktor konversi SI standar - BUKAN
// faktor 17.1 yang dipakai untuk bilirubin di modul lain).
export const CREATININE_MGDL_TO_UMOL_FACTOR = 88.4;

// --- Rentang nilai wajar klinis untuk validasi input ------------------------
// Rentang ini adalah rentang PERINGATAN (bukan larangan pengisian) - dipakai
// untuk menampilkan catatan "nilai di luar rentang wajar, mohon periksa
// ulang", bukan untuk memblokir kalkulasi.
export const PLAUSIBLE_RANGES = {
  ageYears: { min: 0, max: 25 },
  heightCm: { min: 45, max: 210 },
  scrMgDl: { min: 0.1, max: 15 },
  cysCMgL: { min: 0.3, max: 8 },
  upcrMgMg: { min: 0, max: 50 },
} as const;

// --- Stadium CKD KDIGO (nomenklatur klasifikasi standar internasional) -----
export type CkdStage = "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";

export const CKD_STAGES: ReadonlyArray<{
  stage: CkdStage;
  min: number;
  max: number | null;
  label: string;
  rangeLabel: string;
}> = [
  { stage: "G1", min: 90, max: null, label: "Normal atau tinggi", rangeLabel: "\u2265 90" },
  { stage: "G2", min: 60, max: 89, label: "Penurunan ringan", rangeLabel: "60-89" },
  { stage: "G3a", min: 45, max: 59, label: "Penurunan ringan-sedang", rangeLabel: "45-59" },
  { stage: "G3b", min: 30, max: 44, label: "Penurunan sedang-berat", rangeLabel: "30-44" },
  { stage: "G4", min: 15, max: 29, label: "Penurunan berat", rangeLabel: "15-29" },
  { stage: "G5", min: 0, max: 14, label: "Gagal ginjal (kidney failure)", rangeLabel: "< 15" },
];

// --- Modul prognosis (Furth 2018) -------------------------------------------
//
// Kategori eGFR & UPCR disalin verbatim dari abstrak Furth 2018. Studi
// (kohort CKiD + ESCAPE) hanya menganalisis rentang eGFR 15-90 mL/min/1.73m2
// pada saat masuk studi (bukan seluruh rentang stadium CKD).
//
// PERHATIAN keterbatasan sumber: rujukan yang tersedia untuk modul ini hanya
// memuat abstrak + komentar jurnal, BUKAN naskah lengkap dengan tabel rinci
// 6 stadium beserta median waktu per kombinasi eGFR x UPCR. Yang disebutkan
// secara eksplisit dan pasti hanya:
// - Median waktu ke kejadian komposit "> 10 tahun" untuk kombinasi risiko
//   PALING RENDAH (eGFR 45-90 & UPCR < 0,5 mg/mg).
// - Median waktu ke kejadian komposit 0,8 tahun untuk kombinasi risiko
//   PALING TINGGI (eGFR 15-30 & UPCR > 2 mg/mg).
// - Penyakit glomerular mencapai outcome ~43% lebih cepat dibanding
//   non-glomerular, pada tingkat risiko yang sama.
// - Arah risiko: risiko lebih tinggi pada UPCR lebih tinggi untuk eGFR
//   tertentu, dan tetap/meningkat seiring penurunan eGFR.
//
// Karena tabel pasti 6 stadium x median waktu TIDAK tersedia dari sumber
// yang diberikan, modul ini SENGAJA tidak menampilkan "Stadium 1-6 resmi"
// atau angka median waktu buatan untuk kombinasi selain 2 titik ekstrem di
// atas - untuk menghindari mengarang data yang tidak ada di sumber.
export type UpcrCategory = "low" | "moderate" | "high";

export const UPCR_CATEGORIES: ReadonlyArray<{
  key: UpcrCategory;
  label: string;
  min: number;
  max: number | null;
}> = [
  { key: "low", label: "< 0,5 mg/mg", min: 0, max: 0.5 },
  { key: "moderate", label: "0,5 - 2,0 mg/mg", min: 0.5, max: 2.0 },
  { key: "high", label: "> 2,0 mg/mg", min: 2.0, max: null },
];

export type PrognosisEgfrCategory = "e60_89" | "e45_59" | "e30_44" | "eBelow30";

export const PROGNOSIS_EGFR_CATEGORIES: ReadonlyArray<{
  key: PrognosisEgfrCategory;
  label: string;
  min: number;
  max: number | null;
}> = [
  { key: "e60_89", label: "60-89 mL/min/1,73m\u00b2", min: 60, max: 89 },
  { key: "e45_59", label: "45-59 mL/min/1,73m\u00b2", min: 45, max: 59 },
  { key: "e30_44", label: "30-44 mL/min/1,73m\u00b2", min: 30, max: 44 },
  { key: "eBelow30", label: "< 30 mL/min/1,73m\u00b2", min: 0, max: 29 },
];

export const FURTH_GLOMERULAR_FASTER_PCT = 43;
export const FURTH_BEST_CASE_LABEL = "> 10 tahun";
export const FURTH_WORST_CASE_YEARS = 0.8;
