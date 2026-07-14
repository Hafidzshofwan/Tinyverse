import type { AbgInput, AbgResult, WarningCode } from "./types"
import { assertValidAbg } from "./guards"
import { phStatus, classifyPrimary } from "./classify"
import { compensation } from "./compensation"
import { anionGap } from "./aniongap"
import { oxygenation } from "./oxygenation"

export function analyzeAbg(input: AbgInput): AbgResult {
  assertValidAbg(input)
  const ph = input.ph
  const pco2 = input.pco2
  const hco3 = input.hco3
  const sample = input.sample ?? "arteri"
  const warnings: WarningCode[] = []
  if (ph < 6.7 || ph > 7.9) warnings.push("ph")
  if (pco2 <= 0 || pco2 > 150) warnings.push("pco2")
  if (hco3 <= 0 || hco3 > 60) warnings.push("hco3")
  const status = phStatus(ph)
  const acidemia = ph < 7.35
  const alkalemia = ph > 7.45
  const prim = classifyPrimary(ph, pco2, hco3)
  const comp = compensation(prim.primary, ph, pco2, hco3)
  const na = input.na ?? null
  const cl = input.cl ?? null
  const ag = na != null && cl != null ? anionGap(na, cl, hco3) : null
  const po2 = input.po2 ?? null
  const fio2 = input.fio2 ?? null
  const ox = po2 != null ? oxygenation(po2, fio2, pco2) : null
  return {
    warnings,
    phStatus: status,
    acidemia,
    alkalemia,
    primary: prim.primary,
    primerClass: prim.primerClass,
    compensation: comp,
    anionGap: ag,
    oxygenation: ox,
    sample,
  }
}
