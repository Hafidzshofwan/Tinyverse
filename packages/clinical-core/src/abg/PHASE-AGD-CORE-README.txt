TinyVerse - AGD core (analisis gas darah) untuk @tinyverse/clinical-core
=======================================================================
Bounded context: src/abg/
Entry util: analyzeAbg(input) -> AbgResult terstruktur (enum + angka, tanpa HTML).

ISI:
  src/abg/types.ts         - tipe input/hasil + enum
  src/abg/guards.ts        - assertValidAbg (pH/pCO2/HCO3 wajib angka)
  src/abg/classify.ts      - phStatus + classifyPrimary (gangguan primer)
  src/abg/compensation.ts  - rentang kompensasi harapan + level + curiga campuran
  src/abg/aniongap.ts      - anion gap Na-(Cl+HCO3), kategori 8-12
  src/abg/oxygenation.ts   - rasio P/F (Berlin) + gradien A-a
  src/abg/abg.ts           - analyzeAbg (orchestrator)
  src/abg/index.ts         - barrel (TANPA export guards)
  src/abg/__fixtures__/abg.golden.ts - kunci jawaban dari v17 (jangan diedit)
  src/abg/abg.test.ts      - vitest (golden + patokan)

CARA PASANG:
  1. Salin folder src/abg ke packages/clinical-core/src/abg (merge).
  2. TAMBAH 1 baris di packages/clinical-core/src/index.ts:
         export * from "./abg"
  3. pnpm --filter @tinyverse/clinical-core typecheck
  4. pnpm --filter @tinyverse/clinical-core test
