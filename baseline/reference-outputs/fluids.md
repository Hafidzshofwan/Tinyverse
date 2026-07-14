# Reference Outputs — Fluids (Cairan)

> Ditangkap dari **v17 asli** (frozen 2026-07-12, sha256 `2188dae3bb2e4671…`) dengan menjalankan fungsinya langsung via headless browser. **Jangan diedit manual.**

## 1. Cairan Rumatan (Holliday–Segar) — `hitungKebutuhanCairan`

| Berat (kg) | Total (mL/hari) | ≈ mL/jam |
|---|---|---|
| 5 | 500 | 20.8 |
| 8 | 800 | 33.3 |
| 10 | 1000 | 41.7 |
| 12.5 | 1125 | 46.9 |
| 15 | 1250 | 52.1 |
| 20 | 1500 | 62.5 |
| 25 | 1600 | 66.7 |
| 30 | 1700 | 70.8 |

## 2. Faktor Tetes — `hitungFaktorTetes`

| Volume (mL) | Lama (jam) | Drip | Faktor (gtt/mL) | tetes/menit | (raw) | mL/jam |
|---|---|---|---|---|---|---|
| 500 | 8 | makro | 20 | 21 | 20.8 | 62.5 |
| 1000 | 24 | makro | 20 | 14 | 13.9 | 41.7 |
| 100 | 1 | mikro | 60 | 100 | 100.0 | 100.0 |
| 500 | 8 | mikro | 60 | 63 | 62.5 | 62.5 |

## 3. Rencana B (rehidrasi 3 jam) — `hitungRencanaB`

| Berat (kg) | Total (mL) | ≈ mL/jam | Durasi |
|---|---|---|---|
| 8 | 600 | 200.0 | 3 jam |
| 12.5 | 938 | 312.5 | 3 jam |
| 15 | 1125 | 375.0 | 3 jam |

## 4. Rencana C (rehidrasi bertahap) — `hitungRencanaC`

| Berat (kg) | Usia | Total (mL) | Tahap 1 (vol @ laju) | Tahap 2 (vol @ laju) | Total jam |
|---|---|---|---|---|---|
| 8 | bayi | 800 | 240 mL @ 240.0 mL/jam (1 j) | 560 mL @ 112.0 mL/jam (5 j) | 6 |
| 15 | anak | 1500 | 450 mL @ 900.0 mL/jam (0.5 j) | 1050 mL @ 420.0 mL/jam (2.5 j) | 3 |
