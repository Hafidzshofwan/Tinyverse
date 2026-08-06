import { BILIRUBIN_THRESHOLDS } from "../data/thresholds";

/*
 * Engine kalkulator Bilirubin Neonatus (AAP 2022). Semua threshold numerik
 * berasal HANYA dari BILIRUBIN_THRESHOLDS (data/thresholds.ts, disalin
 * verbatim dari Supplemental Tables 1-4 AAP 2022). DILARANG mengarang,
 * membulatkan ulang, menginterpolasi, atau mengubah angka threshold di file
 * ini.
 */

export const MGDL_TO_UMOL_FACTOR = 17.1;

export function mgdlToUmol(mgdl: number): number {
  return mgdl * MGDL_TO_UMOL_FACTOR;
}

export function umolToMgdl(umol: number): number {
  return umol / MGDL_TO_UMOL_FACTOR;
}

// --- Faktor risiko & pemilihan kurva ---------------------------------------

export interface RiskFactorInput {
  albuminLow: boolean;
  hemolyticDisease: boolean;
  sepsis: boolean;
  clinicalInstability: boolean;
}

export function hasManualRiskFactor(input: RiskFactorInput): boolean {
  return input.albuminLow || input.hemolyticDisease || input.sepsis || input.clinicalInstability;
}

// Usia gestasi <38 minggu OTOMATIS memakai kurva "dengan faktor risiko"
// sesuai AAP 2022, terlepas dari faktor risiko manual lainnya.
export function shouldUseRiskFactorCurve(gaWeeks: number, input: RiskFactorInput): boolean {
  return gaWeeks < 38 || hasManualRiskFactor(input);
}

export type CurveFamily = "phototherapy" | "exchange";

const FAMILY_PREFIX: Record<CurveFamily, string> = {
  phototherapy: "photo",
  exchange: "exchange",
};

// Kunci kurva tersedia 35-40 (phototherapy.noRF) atau 35-38 (lainnya). Kunci
// tertinggi berlaku untuk usia gestasi >= kunci tersebut.
const MAX_GA_KEY: Record<CurveFamily, { noRF: number; withRF: number }> = {
  phototherapy: { noRF: 40, withRF: 38 },
  exchange: { noRF: 38, withRF: 38 },
};

const MIN_GA_KEY = 35;

function capToAllowedGa(gaWeeks: number, family: CurveFamily, withRF: boolean): number | null {
  if (gaWeeks < MIN_GA_KEY) return null;
  const maxKey = MAX_GA_KEY[family][withRF ? "withRF" : "noRF"];
  const flooredGa = Math.floor(gaWeeks);
  return Math.min(Math.max(flooredGa, MIN_GA_KEY), maxKey);
}

export interface CurveSelection {
  curveKey: string | null;
  cappedGaWeeks: number | null;
  label: string;
}

export function selectCurve(family: CurveFamily, gaWeeks: number, withRF: boolean): CurveSelection {
  const capped = capToAllowedGa(gaWeeks, family, withRF);
  if (capped == null) {
    return { curveKey: null, cappedGaWeeks: null, label: "" };
  }
  const rfKey = withRF ? "withRF" : "noRF";
  const curveKey = `${FAMILY_PREFIX[family]}.${rfKey}.${capped}`;
  const maxKey = MAX_GA_KEY[family][rfKey];
  const gaLabel = capped === maxKey && gaWeeks > maxKey ? `\u2265${maxKey}` : `${capped}`;
  const label = `GA ${gaLabel} minggu (${withRF ? "dengan" : "tanpa"} faktor risiko)`;
  return { curveKey, cappedGaWeeks: capped, label };
}

// Melihat nilai threshold (mg/dL) dari sebuah kurva pada jam tertentu setelah
// lahir. Array `values` berindeks per jam selesai (indeks 0 = jam ke-0).
// Jika jam yang diminta melampaui panjang array, gunakan plateauValue.
export function lookupBilirubinThreshold(curveKey: string, hoursAfterBirth: number): number | null {
  const curve = BILIRUBIN_THRESHOLDS[curveKey];
  if (!curve) return null;
  if (hoursAfterBirth < 0) return null;
  const hourIndex = Math.floor(hoursAfterBirth);
  if (hourIndex < curve.values.length) return curve.values[hourIndex];
  return curve.plateauValue;
}

// --- Threshold gabungan ------------------------------------------------------

export interface ThresholdsResult {
  outOfScope: boolean;
  phototherapyMgDl: number | null;
  escalationMgDl: number | null;
  exchangeMgDl: number | null;
  curveLabelPhoto: string;
  curveLabelExchange: string;
}

export function computeThresholds(gaWeeks: number, withRF: boolean, ageHours: number): ThresholdsResult {
  if (gaWeeks < MIN_GA_KEY) {
    return {
      outOfScope: true,
      phototherapyMgDl: null,
      escalationMgDl: null,
      exchangeMgDl: null,
      curveLabelPhoto: "",
      curveLabelExchange: "",
    };
  }

  const photoSel = selectCurve("phototherapy", gaWeeks, withRF);
  const exchSel = selectCurve("exchange", gaWeeks, withRF);

  const phototherapyMgDl = photoSel.curveKey != null ? lookupBilirubinThreshold(photoSel.curveKey, ageHours) : null;
  const exchangeMgDl = exchSel.curveKey != null ? lookupBilirubinThreshold(exchSel.curveKey, ageHours) : null;
  // Threshold eskalasi perawatan = threshold exchange transfusion - 2,0 mg/dL.
  const escalationMgDl = exchangeMgDl != null ? Math.round((exchangeMgDl - 2.0) * 10) / 10 : null;

  return {
    outOfScope: false,
    phototherapyMgDl,
    escalationMgDl,
    exchangeMgDl,
    curveLabelPhoto: photoSel.label,
    curveLabelExchange: exchSel.label,
  };
}

// --- Klasifikasi zona ---------------------------------------------------------

export type BilirubinZoneKind = "below-photo" | "photo" | "escalation" | "exchange" | "encephalopathy" | "incomplete";
export type BilirubinZoneColor = "green" | "yellow" | "orange" | "red" | "dark-red";

export interface ZoneClassification {
  kind: BilirubinZoneKind;
  color: BilirubinZoneColor;
  title: string;
  recommendations: string[];
}

export interface ClassifyInput {
  ageHours: number;
  tsbMgDl: number;
  encephalopathySigns: boolean;
  hemolyticDiseaseWithPositiveDat: boolean;
}

export function classifyZone(thresholds: ThresholdsResult, input: ClassifyInput): ZoneClassification {
  if (
    thresholds.outOfScope ||
    thresholds.phototherapyMgDl == null ||
    thresholds.exchangeMgDl == null ||
    thresholds.escalationMgDl == null
  ) {
    return {
      kind: "incomplete",
      color: "green",
      title: "Data belum lengkap",
      recommendations: ["Lengkapi usia gestasi dan usia (jam) pengukuran untuk menghitung zona."],
    };
  }

  // Tanda ensefalopati bilirubin akut selalu diprioritaskan sebagai emergensi.
  if (input.encephalopathySigns) {
    return {
      kind: "encephalopathy",
      color: "dark-red",
      title: "EMERGENSI: Tanda Ensefalopati Bilirubin Akut",
      recommendations: [
        "Lakukan exchange transfusion emergensi segera, terlepas dari nilai TSB saat ini.",
        "Mulai fototerapi intensif sambil mempersiapkan exchange transfusion.",
        "Hubungi/rujuk tim neonatologi atau PICU segera.",
      ],
    };
  }

  if (input.tsbMgDl >= thresholds.exchangeMgDl) {
    return {
      kind: "exchange",
      color: "red",
      title: "Zona Exchange Transfusion",
      recommendations: [
        "TSB \u2265 threshold exchange transfusion. Siapkan exchange transfusion emergensi.",
        "Mulai/lanjutkan fototerapi intensif sambil menunggu atau mempersiapkan exchange transfusion.",
        "Ulangi TSB setiap 2 jam sampai exchange transfusion dilakukan atau TSB turun jelas di bawah threshold.",
      ],
    };
  }

  if (input.tsbMgDl >= thresholds.escalationMgDl) {
    return {
      kind: "escalation",
      color: "orange",
      title: "Zona Eskalasi Perawatan",
      recommendations: [
        "TSB berada dalam 2,0 mg/dL dari threshold exchange transfusion. Eskalasi perawatan.",
        "Mulai/lanjutkan fototerapi intensif.",
        "Pertimbangkan rawat inap tingkat lebih tinggi dan siapkan kemungkinan exchange transfusion.",
        "Ulangi TSB dalam 4-6 jam.",
      ],
    };
  }

  if (input.tsbMgDl >= thresholds.phototherapyMgDl) {
    return {
      kind: "photo",
      color: "yellow",
      title: "Zona Fototerapi",
      recommendations: [
        "TSB \u2265 threshold fototerapi. Mulai fototerapi.",
        "Ulangi TSB dalam 4-24 jam sesuai usia, tren, dan faktor risiko.",
      ],
    };
  }

  const diff = thresholds.phototherapyMgDl - input.tsbMgDl;
  return {
    kind: "below-photo",
    color: "green",
    title: "Di Bawah Threshold Fototerapi",
    recommendations: [
      `TSB ${diff.toFixed(1)} mg/dL di bawah threshold fototerapi.`,
      diff <= 2
        ? "TSB mendekati threshold fototerapi \u2014 pertimbangkan kontrol ulang dalam 24 jam."
        : "Kontrol ulang sesuai jadwal follow-up rutin dan faktor risiko.",
    ],
  };
}

// --- Guardrail / peringatan tambahan -----------------------------------------

export interface HistoryPoint {
  hoursAfterBirth: number;
  tsbMgDl: number;
}

export interface GuardrailInput {
  ageHours: number;
  history: HistoryPoint[];
  directBilirubinMgDl: number | null;
  tsbMgDl: number;
  gaWeeks: number;
  isOnPhototherapy: boolean;
  phototherapyStartTsbMgDl: number | null;
  phototherapyThresholdAtStartMgDl: number | null;
}

export function computeGuardrailWarnings(input: GuardrailInput): string[] {
  const warnings: string[] = [];

  if (input.directBilirubinMgDl != null && input.tsbMgDl > 0) {
    const pct = (input.directBilirubinMgDl / input.tsbMgDl) * 100;
    if (input.directBilirubinMgDl >= 2.0 || pct >= 20) {
      warnings.push(
        "Bilirubin direk tinggi (kemungkinan kolestasis) \u2014 evaluasi lebih lanjut untuk penyebab bilirubin direk/terkonjugasi, bukan hanya hiperbilirubinemia indirek.",
      );
    }
  }

  const priorPoints = input.history
    .filter((p) => p.hoursAfterBirth < input.ageHours)
    .sort((a, b) => b.hoursAfterBirth - a.hoursAfterBirth);
  if (priorPoints.length > 0) {
    const prev = priorPoints[0];
    const hoursDiff = input.ageHours - prev.hoursAfterBirth;
    if (hoursDiff > 0) {
      const ratePerHour = (input.tsbMgDl - prev.tsbMgDl) / hoursDiff;
      if (ratePerHour >= 0.3) {
        warnings.push(
          `Kenaikan TSB cepat (\u2248${ratePerHour.toFixed(2)} mg/dL/jam) \u2014 pertimbangkan evaluasi hemolisis dan pemantauan lebih ketat.`,
        );
      }
    }
  }

  if (input.ageHours < 24 && input.tsbMgDl >= 5) {
    warnings.push(
      "Ikterus timbul dalam 24 jam pertama kehidupan \u2014 evaluasi penyebab patologis (hemolisis, infeksi) segera.",
    );
  }

  if (input.isOnPhototherapy && input.phototherapyStartTsbMgDl != null) {
    const drop = input.phototherapyStartTsbMgDl - input.tsbMgDl;
    if (drop <= 0) {
      warnings.push(
        "TSB tidak turun (atau naik) sejak mulai fototerapi \u2014 evaluasi ulang, pertimbangkan fototerapi intensif atau exchange transfusion.",
      );
    }
  }

  if (input.tsbMgDl >= 30) {
    warnings.push("TSB \u226530 mg/dL \u2014 hiperbilirubinemia ekstrem, risiko tinggi ensefalopati bilirubin akut.");
  } else if (input.tsbMgDl >= 25) {
    warnings.push("TSB \u226525 mg/dL \u2014 hiperbilirubinemia berat, tata laksana emergensi sesuai pedoman.");
  }

  return warnings;
}

// TcB (transkutan) mendekati/di atas ambang fototerapi (dalam 3,0 mg/dL) atau
// >=15 mg/dL perlu dikonfirmasi dengan TSB (pengukuran serum) sesuai AAP 2022.
export function tcbNeedsTsbConfirmation(tcbMgDl: number, phototherapyThresholdMgDl: number): boolean {
  return tcbMgDl >= phototherapyThresholdMgDl - 3.0 || tcbMgDl >= 15;
}
