import { describe, it, expect } from "vitest"
import { analyzeAbg } from "./index"
import { ABG_GOLDEN } from "./__fixtures__/abg.golden"

describe("abg - analisis gas darah (golden v17)", () => {
  for (const g of ABG_GOLDEN) {
    const k = JSON.stringify(g.input)
    it(k, () => {
      expect(analyzeAbg(g.input)).toEqual(g.expected)
    })
  }
})

describe("abg - guards & patokan", () => {
  it("tolak input tak lengkap / NaN", () => {
    expect(() => analyzeAbg({ ph: NaN, pco2: 40, hco3: 24 })).toThrow()
  })
  it("KAD: asidosis metabolik AG tinggi, ada tambahan asidosis respiratorik", () => {
    const r = analyzeAbg({ ph: 7.18, pco2: 26, hco3: 10, na: 138, cl: 100 })
    expect(r.phStatus).toBe("asidemia")
    expect(r.primary).toBe("met-as")
    // Winter: pCO2 harapan = 1.5*10+8 = 23 (21-25); pCO2 terukur 26 > 25
    expect(r.compensation?.adequate).toBe(false)
    expect(r.compensation?.extra).toBe("resp-as")
    expect(r.anionGap?.category).toBe("tinggi")
  })
  it("P/F ratio & kategori Berlin", () => {
    const r = analyzeAbg({ ph: 7.4, pco2: 40, hco3: 24, po2: 90, fio2: 50 })
    expect(r.oxygenation?.pfRatio).toBe(180)
    expect(r.oxygenation?.pfCategory).toBe("sedang")
  })
})
