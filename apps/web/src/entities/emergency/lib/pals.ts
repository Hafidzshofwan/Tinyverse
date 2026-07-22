import type { PalsInput, PalsResult } from "../model/types";

const DASH = "\u2013";

function f(n: number | null, d: number): string {
  if (n == null || !isFinite(n)) return DASH;
  const p = Math.pow(10, d);
  return (Math.round(n * p) / p).toFixed(d).replace(".", ",");
}
function r05(x: number): number {
  return Math.round(x * 2) / 2;
}
function blade(ub: number | null): string {
  if (ub == null) return DASH;
  if (ub <= 1) return "Miller 0";
  if (ub <= 24) return "Miller 1 / Mac 1";
  if (ub <= 96) return "Mac 2 / Miller 2";
  return "Mac 3";
}

/** Kalkulator dosis & alat PALS — port verbatim dari v17. */
export function computePals(input: PalsInput): PalsResult {
  const bb = input.bb;
  const ub = input.ub;
  const yr = ub != null ? ub / 12 : null;

  const res: PalsResult = {
    hasBb: !!bb,
    epi: DASH,
    epiET: DASH,
    defib: DASH,
    kardio: DASH,
    d10: DASH,
    d25: DASH,
    ettC: DASH,
    ettU: DASH,
    ettDepth: DASH,
    suction: DASH,
    blade: DASH,
  };

  if (bb) {
    res.epi =
      f(Math.min(0.01 * bb, 1), 2) +
      " mg  =  " +
      f(Math.min(0.1 * bb, 10), 1) +
      " mL (1:10.000)";
    res.epiET =
      f(Math.min(0.1 * bb, 2.5), 2) +
      " mg  =  " +
      f(Math.min(0.1 * bb, 2.5), 1) +
      " mL (1:1.000)";
    res.defib =
      "Syok ke-1: " +
      Math.min(Math.round(2 * bb), 200) +
      " J   \u00b7   Syok ke-2 atau lebih: " +
      Math.min(Math.round(4 * bb), 360) +
      " J";
    res.kardio =
      "Awal " +
      f(0.5 * bb, 1) +
      "\u2013" +
      f(1 * bb, 1) +
      " J   \u00b7   naik " +
      Math.round(2 * bb) +
      " J";
    res.d10 = f(5 * bb, 0) + " mL  (5 mL/kg)";
    res.d25 = f(2 * bb, 0) + " mL  (2 mL/kg)";
  }

  if (ub != null && ub < 12) {
    let ett: { c: string; u: string; suction: string; blade: string };
    if (ub < 1)
      ett = { c: "3,0", u: "3,0\u20133,5", blade: "Miller 0\u20131", suction: "6\u20138 Fr" };
    else if (ub < 6)
      ett = { c: "3,0\u20133,5", u: "3,5", blade: "Miller 1", suction: "8 Fr" };
    else ett = { c: "3,5", u: "3,5\u20134,0", blade: "Miller 1", suction: "8 Fr" };
    const depthTxt =
      bb != null && ub < 1
        ? "\u2248 " + f(6 + bb, 0) + ' cm (patokan 6 + BB kg / rumus "7-8-9")'
        : ub < 6
          ? "\u2248 10 cm"
          : "\u2248 11\u201312 cm";
    res.ettC = ett.c + " mm";
    res.ettU = ett.u + " mm";
    res.ettDepth = depthTxt;
    res.suction = ett.suction;
    res.blade = ett.blade;
  } else if (yr != null) {
    const uncuff = r05(yr / 4 + 4);
    res.ettC = f(r05(yr / 4 + 3.5), 1) + " mm";
    res.ettU = f(uncuff, 1) + " mm";
    res.ettDepth = f(r05(uncuff * 3), 1) + " cm";
    res.suction = Math.round(uncuff) * 2 + " Fr";
    res.blade = blade(ub);
  }

  return res;
}
