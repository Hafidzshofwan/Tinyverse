import { analyzeAbg } from "@tinyverse/clinical-core";
import type { AbgResult, AbgSample } from "@tinyverse/clinical-core";

// Pembulatan tampilan (UI-only). Core tetap memakai angka mentah untuk keputusan.
export function fmt(n: number | null | undefined, d = 0): string {
  if (n == null || !Number.isFinite(n)) return "–";
  const p = Math.pow(10, d);
  return String(Math.round(n * p) / p);
}

export function parseNum(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export interface AbgFormValues {
  ph: number | null;
  pco2: number | null;
  hco3: number | null;
  sample: AbgSample;
  na: number | null;
  cl: number | null;
  po2: number | null;
  fio2: number | null;
}

export interface AbgExample {
  label: string;
  values: {
    ph: number;
    pco2: number;
    hco3: number;
    na?: number;
    cl?: number;
    po2?: number;
    fio2?: number;
  };
}

export const AGD_CONTOH: AbgExample[] = [
  {
    label: "Asidosis metabolik AG tinggi (mis. ketoasidosis diabetik)",
    values: { ph: 7.18, pco2: 26, hco3: 10, na: 138, cl: 100 },
  },
  {
    label: "Asidosis respiratorik akut (mis. depresi napas)",
    values: { ph: 7.24, pco2: 60, hco3: 25 },
  },
  {
    label: "Alkalosis metabolik (mis. muntah berulang)",
    values: { ph: 7.52, pco2: 47, hco3: 36, na: 140, cl: 90 },
  },
  {
    label: "Alkalosis respiratorik (mis. takipnea/nyeri)",
    values: { ph: 7.52, pco2: 28, hco3: 22 },
  },
  {
    label: "Asidosis metabolik AG normal (mis. diare)",
    values: { ph: 7.3, pco2: 32, hco3: 15, na: 138, cl: 115 },
  },
];

export type StepTone = "ok" | "warn" | "bad" | "neutral";

export interface AbgStep {
  label: string;
  text: string;
  tone: StepTone;
}

export interface AbgViewModel {
  ok: boolean;
  conclusion: string;
  steps: AbgStep[];
  warnings: string[];
  exampleLabel: string | null;
}

export interface AbgOutcome {
  error: string | null;
  view: AbgViewModel | null;
}

const WARNING_TEXT: Record<string, string> = {
  ph: "pH di luar rentang yang mungkin secara biologis — periksa kembali.",
  pco2: "pCO₂ tampak tidak wajar.",
  hco3: "HCO₃⁻ tampak tidak wajar.",
};

function phStatusText(r: AbgResult, ph: number): string {
  if (r.phStatus === "asidemia") return `Asidemia (pH ${fmt(ph, 2)}, <7,35)`;
  if (r.phStatus === "alkalemia") return `Alkalemia (pH ${fmt(ph, 2)}, >7,45)`;
  return `Normal (pH ${fmt(ph, 2)})`;
}

function primerText(r: AbgResult): string {
  const p = r.primary;
  if (r.phStatus === "asidemia") {
    if (p === "mixed")
      return "Asidosis campuran — metabolik (HCO₃ ↓) + respiratorik (pCO₂ ↑)";
    if (p === "met-as") return "Asidosis metabolik (HCO₃ ↓)";
    if (p === "resp-as") return "Asidosis respiratorik (pCO₂ ↑)";
    return "Asidemia namun pCO₂ & HCO₃ tak khas — periksa kembali / gangguan campuran.";
  }
  if (r.phStatus === "alkalemia") {
    if (p === "mixed")
      return "Alkalosis campuran — metabolik (HCO₃ ↑) + respiratorik (pCO₂ ↓)";
    if (p === "met-alk") return "Alkalosis metabolik (HCO₃ ↑)";
    if (p === "resp-alk") return "Alkalosis respiratorik (pCO₂ ↓)";
    return "Alkalemia namun pola tak khas — periksa kembali.";
  }
  if (p === null) {
    return r.primerClass === "ok"
      ? "Gas darah normal."
      : "Pola tak lazim — pertimbangkan gangguan campuran.";
  }
  if (p === "resp-as")
    return "Asidosis respiratorik kronik, terkompensasi penuh (pH condong asam).";
  if (p === "met-alk")
    return "Alkalosis metabolik, terkompensasi penuh (pH condong basa).";
  if (p === "resp-alk")
    return "Alkalosis respiratorik kronik, terkompensasi penuh (pH condong basa).";
  return "Asidosis metabolik, terkompensasi penuh (pH condong asam).";
}

function dxText(r: AbgResult): string {
  switch (r.primary) {
    case "met-as":
      return "AG tinggi: KAD, asidosis laktat (syok/sepsis/hipoksia), gagal ginjal (uremia), intoksikasi (salisilat/metanol/etilen glikol), kelainan metabolik bawaan (IEM). AG normal (hiperkloremik): diare (tersering pada anak), RTA, kehilangan bikarbonat.";
    case "met-alk":
      return "Muntah / drainase NGT, stenosis pilorus (bayi), diuretik, hipokalemia, hiperaldosteronisme, pemberian alkali berlebih.";
    case "resp-as":
      return "Hipoventilasi: depresi SSP (sedatif, kejang, ensefalopati), obstruksi jalan napas (bronkiolitis, asma, croup, benda asing), penyakit neuromuskular, kelelahan otot napas, pneumonia berat.";
    case "resp-alk":
      return "Hiperventilasi: nyeri/cemas, demam, hipoksia, sepsis awal, intoksikasi salisilat, penyakit SSP, gagal hati.";
    case "mixed":
      return "Gangguan campuran — nilai tiap komponen. Sering pada sepsis, syok, intoksikasi salisilat, dan penyakit kritis.";
    default:
      return "";
  }
}

function kompText(r: AbgResult, pco2: number, hco3: number): string {
  const c = r.compensation;
  if (!c) return "";
  const p = r.primary;
  let body = "";
  if (p === "met-as") {
    const lo = fmt(c.expectedPco2Low, 0);
    const hi = fmt(c.expectedPco2High, 0);
    if (c.adequate)
      body = `Sesuai — pCO₂ ${fmt(pco2, 0)} masuk rentang harapan ${lo}–${hi}; paru mengompensasi tepat → gangguan tunggal (murni metabolik).`;
    else if (c.extra === "resp-as")
      body = `Tidak sesuai — pCO₂ ${fmt(pco2, 0)} > harapan (${lo}–${hi}); paru kurang mengompensasi → ada asidosis respiratorik tambahan (campuran).`;
    else
      body = `Tidak sesuai — pCO₂ ${fmt(pco2, 0)} < harapan (${lo}–${hi}); paru berlebihan mengompensasi → ada alkalosis respiratorik tambahan (campuran).`;
  } else if (p === "met-alk") {
    const lo = fmt(c.expectedPco2Low, 0);
    const hi = fmt(c.expectedPco2High, 0);
    if (c.adequate)
      body = `Sesuai — pCO₂ ${fmt(pco2, 0)} masuk rentang harapan ${lo}–${hi} → gangguan tunggal (murni metabolik).`;
    else if (c.extra === "resp-as")
      body = `Tidak sesuai — pCO₂ ${fmt(pco2, 0)} > harapan (${lo}–${hi}) → ada asidosis respiratorik tambahan (campuran).`;
    else
      body = `Tidak sesuai — pCO₂ ${fmt(pco2, 0)} < harapan (${lo}–${hi}) → ada alkalosis respiratorik tambahan (campuran).`;
  } else if (p === "resp-as") {
    const ea = fmt(c.expectedHco3Acute, 0);
    const ec = fmt(c.expectedHco3Chronic, 0);
    if (c.pattern === "akut")
      body = `Pola akut — HCO₃ ${fmt(hco3, 0)} sesuai kompensasi cepat (harapan akut ≈${ea}; bila sudah kronik ≥3 hari ≈${ec}).`;
    else if (c.pattern === "kronik")
      body = `Pola kronik — HCO₃ ${fmt(hco3, 0)} menandakan kompensasi ginjal penuh (harapan kronik ≈${ec}).`;
    else
      body = `Kompensasi parsial — HCO₃ ${fmt(hco3, 0)} di antara harapan akut ≈${ea} dan kronik ≈${ec} (ginjal masih menyesuaikan).`;
    if (c.suspect === "met-alk")
      body +=
        " HCO₃ lebih tinggi dari harapan → curiga alkalosis metabolik tambahan.";
    else if (c.suspect === "met-as")
      body +=
        " HCO₃ lebih rendah dari harapan → curiga asidosis metabolik tambahan.";
  } else if (p === "resp-alk") {
    const ea = fmt(c.expectedHco3Acute, 0);
    const ec = fmt(c.expectedHco3Chronic, 0);
    if (c.pattern === "akut")
      body = `Pola akut — HCO₃ ${fmt(hco3, 0)} sesuai kompensasi cepat (harapan akut ≈${ea}; bila kronik ≈${ec}).`;
    else if (c.pattern === "kronik")
      body = `Pola kronik — HCO₃ ${fmt(hco3, 0)} menandakan kompensasi ginjal penuh (harapan kronik ≈${ec}).`;
    else
      body = `Kompensasi parsial — HCO₃ ${fmt(hco3, 0)} di antara harapan akut ≈${ea} dan kronik ≈${ec}.`;
  }
  if (c.level && body) body = `${c.level}: ${body}`;
  return body;
}

function agText(r: AbgResult, v: AbgFormValues): string {
  const ag = r.anionGap;
  if (!ag || v.na == null || v.cl == null) {
    return "Isi Na⁺ & Cl⁻ untuk hitung anion gap.";
  }
  const hasil = `${fmt(ag.value, 1)} = Na ${fmt(v.na, 0)} − (Cl ${fmt(v.cl, 0)} + HCO₃ ${fmt(v.hco3, 0)}); normal 8–12.`;
  let interp = "";
  let kelainan = "";
  if (ag.category === "tinggi") {
    interp =
      "AG tinggi — menandakan asidosis metabolik AG tinggi (penumpukan anion tak-terukur).";
    kelainan =
      "KAD, asidosis laktat (syok/sepsis/hipoksia), gagal ginjal (uremia), intoksikasi (salisilat/metanol/etilen glikol), rabdomiolisis.";
  } else if (ag.category === "rendah") {
    interp = "AG rendah — jarang, umumnya bukan penanda asidosis AG-tinggi.";
    kelainan =
      "Hipoalbuminemia, paraprotein (mis. mieloma), atau artefak laboratorium.";
  } else {
    interp = "AG normal.";
    if (v.hco3 != null && v.hco3 < 22)
      kelainan =
        "Bila disertai asidosis metabolik: tipe hiperkloremik — diare (tersering pada anak), RTA, atau kehilangan bikarbonat.";
  }
  return `Hasil: ${hasil} Interpretasi: ${interp}${kelainan ? " Kelainan mendasari: " + kelainan : ""}`;
}

function oxText(r: AbgResult, v: AbgFormValues): string {
  const ox = r.oxygenation;
  if (!ox || v.po2 == null) return "";
  if (ox.pfRatio == null) {
    return `PaO₂ ${fmt(v.po2, 0)} mmHg. Isi FiO₂ untuk rasio P/F & gradien A–a.`;
  }
  const cat =
    ox.pfCategory === "normal"
      ? "normal/tidak ARDS"
      : ox.pfCategory === "ringan"
        ? "ARDS ringan (200–300)"
        : ox.pfCategory === "sedang"
          ? "ARDS sedang (100–200)"
          : "ARDS berat (<100)";
  const caveat =
    v.sample !== "arteri"
      ? " — perlu diingat P/F & gradien A–a memakai PaO₂ arteri; sampel ini bukan arteri, tafsirkan dengan hati-hati"
      : "";
  return `Rasio P/F (PaO₂/FiO₂) = ${fmt(ox.pfRatio, 0)} → ${cat}. Gradien A–a ≈ ${fmt(ox.aaGradient, 0)} mmHg${caveat}. Ambang P/F = definisi Berlin (dewasa/umum); untuk anak, PALICC memakai Oxygenation Index.`;
}

function sampleText(sample: AbgSample): string {
  if (sample === "vena")
    return "Sampel vena: pH ~0,03–0,04 lebih rendah & pCO₂ ~5–8 mmHg lebih tinggi dari arteri; oksigenasi (pO₂/P-F) tidak dapat dinilai.";
  if (sample === "kapiler")
    return "Sampel kapiler: mendekati arteri untuk pH/pCO₂ bila perfusi baik; pO₂ kurang andal.";
  return "";
}

function buildView(
  r: AbgResult,
  v: AbgFormValues,
  exampleLabel: string | null,
): AbgViewModel {
  const warnings = r.warnings.map((w) => WARNING_TEXT[w] ?? w);
  const steps: AbgStep[] = [];
  steps.push({
    label: "pH",
    text: phStatusText(r, v.ph as number),
    tone: r.phStatus === "normal" ? "ok" : "warn",
  });
  const primerTone: StepTone =
    r.primerClass === "ok" ? "ok" : r.primerClass === "bad" ? "bad" : "warn";
  steps.push({ label: "Primer", text: primerText(r), tone: primerTone });
  const dx = dxText(r);
  if (dx) steps.push({ label: "Diagnosis banding", text: dx, tone: "neutral" });
  const komp = kompText(r, v.pco2 as number, v.hco3 as number);
  if (komp) steps.push({ label: "Kompensasi", text: komp, tone: "neutral" });
  steps.push({ label: "Anion gap", text: agText(r, v), tone: "neutral" });
  const ox = oxText(r, v);
  if (ox) steps.push({ label: "Oksigenasi", text: ox, tone: "neutral" });
  const sn = sampleText(r.sample);
  if (sn) steps.push({ label: "Sampel", text: sn, tone: "neutral" });
  return {
    ok: r.primerClass === "ok" && warnings.length === 0,
    conclusion: primerText(r),
    steps,
    warnings,
    exampleLabel,
  };
}

export function computeAbg(
  v: AbgFormValues,
  exampleLabel: string | null = null,
): AbgOutcome {
  if (v.ph == null || v.pco2 == null || v.hco3 == null) {
    return {
      error: "Isi minimal pH, pCO₂, dan HCO₃⁻ untuk dianalisis.",
      view: null,
    };
  }
  try {
    const r = analyzeAbg({
      ph: v.ph,
      pco2: v.pco2,
      hco3: v.hco3,
      sample: v.sample,
      na: v.na,
      cl: v.cl,
      po2: v.po2,
      fio2: v.fio2,
    });
    return { error: null, view: buildView(r, v, exampleLabel) };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Input tidak valid.",
      view: null,
    };
  }
}
