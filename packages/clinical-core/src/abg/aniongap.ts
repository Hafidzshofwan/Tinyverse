import type { AnionGapResult, AnionGapCategory } from "./types"

export function anionGap(
  na: number,
  cl: number,
  hco3: number,
): AnionGapResult {
  const value = na - (cl + hco3)
  let category: AnionGapCategory
  if (value > 12) category = "tinggi"
  else if (value < 8) category = "rendah"
  else category = "normal"
  return { value, category }
}
