PHASE 5 (P5) — Bounded Context: Fluids (Cairan)
================================================

APA INI
-------
Migrasi kalkulator CAIRAN dari v17 menjadi PURE FUNCTIONS yang teruji di
@tinyverse/clinical-core. Setiap fungsi murni (tanpa DOM/React), testable,
dan diverifikasi terhadap GOLDEN VECTORS dari P0 (angka hasil v17 asli).

Fungsi yang dimigrasi (port 1:1 dari v17):
  - maintenanceFluids()   <- hitungKebutuhanCairan  (Holliday-Segar)
  - dripRate()            <- hitungFaktorTetes       (faktor tetes)
  - rehydrationPlanB()    <- hitungRencanaB          (rehidrasi 3 jam)
  - rehydrationPlanC()    <- hitungRencanaC          (rehidrasi bertahap)

FILE (di dalam packages/clinical-core/src/fluids/):
  types.ts             tipe domain
  guards.ts            validasi input (tolak berat/volume <= 0)
  maintenance.ts       Holliday-Segar
  drip.ts              faktor tetes (makro 20 / mikro 60 gtt/mL)
  rehydration.ts       Rencana B & C
  index.ts             barrel export bounded context
  __fixtures__/fluids.golden.ts   SALINAN golden vectors P0 (jangan diedit)
  *.test.ts            golden tests (17 vektor + uji validasi)

FILE YANG BERUBAH:
  src/index.ts   -> menambah  export * from "./fluids"

CARA PASANG
-----------
1. Ekstrak zip ke ROOT repo tinyverse (pilih "Ya, Timpa Semua").
   Hanya src/index.ts yang ditimpa; sisanya file baru.
2. Di root repo jalankan:
     pnpm install
     pnpm typecheck
     pnpm --filter @tinyverse/clinical-core test
     pnpm build

HASIL YANG DIHARAPKAN
---------------------
- typecheck: semua package sukses
- test: Test Files 7 passed (7), Tests 34 passed (34)   [4 dari P4 + 3 baru P5]
- build: successful

TIDAK ADA dependency baru. Tidak menyentuh v17, apps/web, atau package lain.
