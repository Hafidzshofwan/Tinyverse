import type { OxygenationResult, PfCategory } from "./types"

export function oxygenation(
  po2: number,
  fio2: number | null,
  pco2: number,
): OxygenationResult {
  let pfRatio: number | null = null
  let pfCategory: PfCategory | null = null
  let aaGradient: number | null = null
  if (fio2 != null) {
    const ff = fio2 > 1 ? fio2 / 100 : fio2
    pfRatio = po2 / ff
    pfCategory =
      pfRatio >= 300
        ? "normal"
        : pfRatio >= 200
          ? "ringan"
          : pfRatio >= 100
            ? "sedang"
            : "berat"
    const pao2 = ff * (760 - 47) - pco2 / 0.8
    aaGradient = pao2 - po2
  }
  return { pfRatio, pfCategory, aaGradient }
}
