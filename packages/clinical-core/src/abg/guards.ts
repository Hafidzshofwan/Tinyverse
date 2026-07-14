import type { AbgInput } from "./types"

export function assertValidAbg(input: AbgInput): void {
  const trio = [input.ph, input.pco2, input.hco3]
  const ok = trio.every((n) => typeof n === "number" && Number.isFinite(n))
  if (!ok) {
    throw new Error("pH, pCO2, dan HCO3 wajib diisi angka yang valid.")
  }
}
