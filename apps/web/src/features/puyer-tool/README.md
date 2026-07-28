# Racik Puyer

Kalkulator puyer multi-obat. Sejak Gelombang 3, layar ini **murni React** —
iframe ke `/puyer-tool.html` sudah dihapus beserta berkas island-nya.

## Isi folder

| Berkas | Peran |
| --- | --- |
| `PuyerToolNative.tsx` | Komponen layar. Markup, kelas CSS, teks, dan ikon disalin persis dari island. |
| `PuyerIcons.tsx` | Seluruh SVG island. |
| `puyer-tool.css` | 139 aturan gaya island, semuanya dilingkupi `.puyer-island-wrap` agar tidak bocor ke halaman lain. |
| `obatKatalog.ts` | 35 obat, diekstrak mekanis dari island dan terbukti identik pada seluruh bidang dengan `scripts/obat.json`. |
| `format.ts` | Pembulatan, format koma desimal, dan pecahan tablet resep. |
| `hitungRacikan.ts` | Rumus inti racikan + catatan keselamatan. |
| `rentangDosis.ts` | Rentang dosis lazim per obat, memakai `calculateDosing` dari `@tinyverse/clinical-core`. |
| `interaksi.ts` | Pengingat interaksi & tumpukan sedatif. |

## Yang dijaga

Tidak ada angka klinis, ambang peringatan, atau kalimat peringatan yang diubah
saat migrasi. Dua tes menjaganya:

- `hitungRacikan.test.ts` — mengunci rumus, ambang selisih 10%/15%, susunan
  draft resep, dan bunyi catatan.
- `rentangDosis.golden.test.ts` — 420 vektor hasil **menjalankan** mesin dosis
  asli milik island, membuktikan `calculateDosing` memberi angka yang sama.

Bila tes golden gagal, jangan perbarui berkas golden-nya; telusuri dulu
perubahan perilakunya.
