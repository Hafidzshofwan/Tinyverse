import type { PhStatus, PrimaryDisorder, PrimerClass } from "./types"

export function phStatus(ph: number): PhStatus {
  if (ph < 7.35) return "asidemia"
  if (ph > 7.45) return "alkalemia"
  return "normal"
}

export interface PrimaryResult {
  primary: PrimaryDisorder
  primerClass: PrimerClass
}

export function classifyPrimary(
  ph: number,
  pco2: number,
  hco3: number,
): PrimaryResult {
  const acidemia = ph < 7.35
  const alkalemia = ph > 7.45
  const highCO2 = pco2 > 45
  const lowCO2 = pco2 < 35
  const highHCO3 = hco3 > 26
  const lowHCO3 = hco3 < 22
  let primary: PrimaryDisorder = null
  let primerClass: PrimerClass = "warn"
  if (acidemia) {
    if (lowHCO3 && highCO2) {
      primary = "mixed"
      primerClass = "bad"
    } else if (lowHCO3) {
      primary = "met-as"
    } else if (highCO2) {
      primary = "resp-as"
    } else {
      primary = null
    }
  } else if (alkalemia) {
    if (highHCO3 && lowCO2) {
      primary = "mixed"
      primerClass = "bad"
    } else if (highHCO3) {
      primary = "met-alk"
    } else if (lowCO2) {
      primary = "resp-alk"
    } else {
      primary = null
    }
  } else {
    primerClass = "ok"
    if (Math.abs(pco2 - 40) <= 5 && Math.abs(hco3 - 24) <= 3) {
      primary = null
    } else if (highCO2 && highHCO3) {
      primary = ph < 7.4 ? "resp-as" : "met-alk"
      primerClass = "warn"
    } else if (lowCO2 && lowHCO3) {
      primary = ph > 7.4 ? "resp-alk" : "met-as"
      primerClass = "warn"
    } else {
      primary = null
      primerClass = "warn"
    }
  }
  return { primary, primerClass }
}
