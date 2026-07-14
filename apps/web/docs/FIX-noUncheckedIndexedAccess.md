# Fix Build: noUncheckedIndexedAccess (apps/web)

## Masalah
`pnpm build` gagal pada tahap "Linting and checking validity of types" dengan
error `Object is possibly 'undefined'` / `'x' is possibly 'undefined'`.

Penyebab: aturan TypeScript `noUncheckedIndexedAccess` (aktif di konfigurasi
dasar). Aturan ini menganggap hasil akses indeks array (`arr[i]`, `obj[key]`)
bisa `undefined`, sehingga tidak boleh langsung dipakai untuk aritmatika,
perbandingan angka, atau akses properti tanpa penjagaan (guard).

## Cakupan (hasil pengecekan tipe menyeluruh dengan tsc)
Error indeks-array yang ASLI hanya ada pada 5 berkas:
- `features/clinical-scores/data.ts`, `hitungSkor.ts`, `ScoreCatalog.tsx` (sudah diperbaiki manual sebelumnya)
- `features/growth-chart/zscore.ts` (diperbaiki di bundel ini)
- `widgets/user-account/avatar.ts` (diperbaiki di bundel ini)

Ratusan "error" lain yang mungkin terlihat saat mencoba tsc tanpa @types adalah
GANGGUAN dari ketiadaan tipe React/Node di lingkungan uji, BUKAN error nyata;
di mesin dev (yang punya @types/react & @types/node) hal itu tidak muncul.

## Perubahan & alasan
### growth-chart/zscore.ts
- Baris SD (`table[lo]`, `table[hi]`) diambil ke variabel lokal lebih dulu,
  lalu dijaga (`if (!barisLo || !barisHi) return null`). TypeScript menyempitkan
  tipe pada VARIABEL, bukan pada akses indeks langsung yang diulang.
- Saat interpolasi, `barisHi[i]` diperiksa `=== undefined` dengan fallback aman
  ke nilai `v`. Untuk tabel WHO 7-kolom yang valid, hasilnya IDENTIK dengan v17.
- Pada `tkHitungZscoreNumerik`, elemen `lo`, `hi`, `label`, dan `row[0/1/5/6]`
  dijaga eksplisit sebelum dipakai. Fungsi tetap deterministik; hasil sama untuk
  data valid, fallback hanya mencegah `NaN` diam-diam bila baris cacat.

**WHY (penting untuk perangkat lunak medis):** kami TIDAK memakai tambalan
`?? 0` sembarangan pada perhitungan z-score, karena mengganti nilai kosong
dengan 0 dapat menghasilkan angka yang salah secara diam-diam. Kami memilih
penjagaan eksplisit yang mempertahankan hasil untuk data yang benar.

### widgets/user-account/avatar.ts
- `bagian[0]` dan `bagian[bagian.length - 1]` diambil ke variabel lokal lalu
  dijaga; huruf awal diambil dengan `?? ""`. Perilaku inisial nama TIDAK berubah.

## Verifikasi
Dijalankan `tsc` dengan `noUncheckedIndexedAccess: true`. Setelah perbaikan,
tidak ada lagi error `TS2532` / `TS18048` / `TS2345` pada kedua berkas.

## Catatan keputusan
Aturan `noUncheckedIndexedAccess` sengaja DIPERTAHANKAN (tidak dimatikan) demi
keamanan perhitungan klinis. Paket inti `@tinyverse/clinical-core` tetap ketat.
