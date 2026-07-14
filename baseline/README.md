# baseline/ — P0 Safety Net (TinyVerse)

> Fase **P0** dari migrasi v17 → platform modular. Tujuannya bukan menulis fitur, tapi membuat **jaring pengaman**: mengunci v17, menyimpan salinannya, dan merekam "kunci jawaban" (reference outputs) kalkulator klinisnya. Semua fase migrasi berikutnya (P5+) diuji terhadap angka-angka ini.

## Isi folder

```
baseline/
├─ README.md                       ← file ini
├─ FREEZE.md                       ← catatan pembekuan v17 (fingerprint + tanggal)
├─ v17/
│  ├─ tinyverse-v17.html           ← SNAPSHOT arsip v17 (read-only, jangan diedit)
│  └─ fingerprint.txt              ← sha256 + jumlah baris + ukuran
├─ reference-outputs/
│  ├─ fluids.reference.json        ← kunci jawaban (data mentah, canonical)
│  ├─ fluids.golden.ts             ← kunci jawaban bertipe (dipakai test P5)
│  └─ fluids.md                    ← tabel enak-dibaca manusia
└─ capture/
   ├─ capture-fluids.js            ← harness Playwright (menjalankan fungsi v17)
   ├─ gen-golden.js                ← turunkan golden + cross-check vs rumus v17
   ├─ gen-ts-md.js                 ← hasilkan .ts + .md dari .json
   └─ raw-capture.json             ← output mentah hasil penangkapan
```

## Prinsip P0

1. **Freeze** — v17 dikunci pada satu sidik jari SHA-256 (lihat `FREEZE.md`). Kalau file v17 berubah 1 byte pun, hash berubah dan kita tahu baseline tidak lagi valid.
2. **Snapshot** — salinan utuh v17 disimpan di `v17/` sebagai arsip abadi (masuk version control).
3. **Reference outputs** — output kalkulator ditangkap dengan **menjalankan kode v17 aslinya** (headless Chromium via Playwright), bukan menyalin ulang rumus. Lalu di-cross-check ulang terhadap rumus v17. Ini "kunci jawaban".

## Cakupan saat ini

Bounded context **Fluids (Cairan)** — target migrasi P5:

| Kalkulator | Fungsi v17 | # vektor |
|---|---|---|
| Cairan rumatan (Holliday–Segar) | `hitungKebutuhanCairan` | 8 |
| Faktor tetes | `hitungFaktorTetes` | 4 |
| Rehidrasi Rencana B | `hitungRencanaB` | 3 |
| Rehidrasi Rencana C | `hitungRencanaC` | 2 |

Bounded context lain (Obat/dosing, Luka bakar, Skor/GCS, Nutrisi, AGD, dll.) akan ditambahkan di `reference-outputs/` saat fase migrasinya tiba, memakai harness yang sama.

## Cara regenerasi (bila perlu)

> Hanya jalankan ulang bila memang mau memperbarui baseline secara sengaja. Baseline harus stabil.

```bash
# butuh: node + playwright + chromium; snapshot ada di v17/tinyverse-v17.html
node capture/capture-fluids.js     # tangkap output dari snapshot
node capture/gen-golden.js         # turunkan golden + cross-check
node capture/gen-ts-md.js          # hasilkan .ts + .md
```

## Cara pakai di P5

Di paket `@tinyverse/clinical-core`, import golden vectors lalu bandingkan hasil pure-function domain Fluids terhadapnya:

```ts
import { maintenanceGolden } from "../../baseline/reference-outputs/fluids.golden"
// for (const g of maintenanceGolden) expect(maintenanceMlPerDay(g.weightKg)).toBe(g.totalMlPerDay)
```

(Jalur import final ditentukan saat P5 — file golden bisa disalin/di-symlink ke dalam paket test.)
