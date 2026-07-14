import type { CompensationResult, PrimaryDisorder } from "./types"

export function compensation(
  primary: PrimaryDisorder,
  ph: number,
  pco2: number,
  hco3: number,
): CompensationResult | null {
  if (
    primary !== "met-as" &&
    primary !== "met-alk" &&
    primary !== "resp-as" &&
    primary !== "resp-alk"
  ) {
    return null
  }
  const acidemia = ph < 7.35
  const alkalemia = ph > 7.45
  const highCO2 = pco2 > 45
  const lowCO2 = pco2 < 35
  const highHCO3 = hco3 > 26
  const lowHCO3 = hco3 < 22
  const res: CompensationResult = {
    level: null,
    expectedPco2Low: null,
    expectedPco2High: null,
    adequate: null,
    extra: null,
    expectedHco3Acute: null,
    expectedHco3Chronic: null,
    pattern: null,
    suspect: null,
  }
  if (primary === "met-as") {
    const e = 1.5 * hco3 + 8
    const lo = e - 2
    const hi = e + 2
    res.expectedPco2Low = lo
    res.expectedPco2High = hi
    if (pco2 >= lo && pco2 <= hi) {
      res.adequate = true
    } else if (pco2 > hi) {
      res.adequate = false
      res.extra = "resp-as"
    } else {
      res.adequate = false
      res.extra = "resp-alk"
    }
  } else if (primary === "met-alk") {
    const e = 0.7 * hco3 + 21
    const lo = e - 2
    const hi = e + 2
    res.expectedPco2Low = lo
    res.expectedPco2High = hi
    if (pco2 >= lo && pco2 <= hi) {
      res.adequate = true
    } else if (pco2 > hi) {
      res.adequate = false
      res.extra = "resp-as"
    } else {
      res.adequate = false
      res.extra = "resp-alk"
    }
  } else if (primary === "resp-as") {
    const d = (pco2 - 40) / 10
    const ea = 24 + 1 * d
    const ec = 24 + 3.5 * d
    res.expectedHco3Acute = ea
    res.expectedHco3Chronic = ec
    if (hco3 <= ea + 2) res.pattern = "akut"
    else if (hco3 >= ec - 2) res.pattern = "kronik"
    else res.pattern = "parsial"
    if (hco3 > ec + 3) res.suspect = "met-alk"
    else if (hco3 < ea - 3) res.suspect = "met-as"
  } else if (primary === "resp-alk") {
    const d = (40 - pco2) / 10
    const ea = 24 - 2 * d
    let ec = 24 - 4 * d
    if (ec < 12) ec = 12
    res.expectedHco3Acute = ea
    res.expectedHco3Chronic = ec
    if (hco3 >= ea - 2) res.pattern = "akut"
    else if (hco3 <= ec + 2) res.pattern = "kronik"
    else res.pattern = "parsial"
  }
  let komp2 = false
  if (primary === "met-as") komp2 = lowCO2
  else if (primary === "met-alk") komp2 = highCO2
  else if (primary === "resp-as") komp2 = highHCO3
  else if (primary === "resp-alk") komp2 = lowHCO3
  if (!komp2) res.level = "Belum terkompensasi"
  else if (!acidemia && !alkalemia) res.level = "Terkompensasi penuh"
  else res.level = "Terkompensasi sebagian"
  return res
}
