# Fitur: Racik Puyer (`puyer-calculator`)

Alat bantu menghitung kebutuhan tablet dan pembagian bungkus saat meracik puyer.

## Mengapa dibuat begini

- **Bukan pemberi rekomendasi dosis.** Dosis target diinput oleh klinisi. Alat
  ini hanya mengubah dosis target menjadi jumlah tablet yang perlu digerus dan
  membaginya menjadi bungkus yang rata. Ini mengurangi risiko dibanding alat
  yang "menyarankan" dosis.
- **Logika = fungsi murni (`hitungPuyer`).** Deterministik, tanpa efek samping,
  sehingga mudah diuji dan dipindahkan. UI (`PuyerForm`) hanya memanggilnya.
- **Peringatan, bukan pemblokiran.** Hasil yang tidak praktis (mis. total tablet
  bukan kelipatan 0,5) memunculkan peringatan agar klinisi memeriksa ulang.

## Rumus

```
totalBungkus      = frekuensiPerHari x jumlahHari
tabletPerBungkus  = dosisPerKaliMg / kekuatanTabletMg
totalTablet       = tabletPerBungkus x totalBungkus
```

## Golden vectors (lihat `hitungPuyer.test.ts`)

| dosis/kali | tablet | freq | hari | tablet/bungkus | bungkus | total tablet |
| ---------- | ------ | ---- | ---- | -------------- | ------- | ------------ |
| 250 mg     | 500 mg | 3    | 5    | 0,5            | 15      | 7,5          |
| 125 mg     | 500 mg | 3    | 5    | 0,25           | 15      | 3,75 (warn)  |
| 500 mg     | 500 mg | 2    | 3    | 1              | 6       | 6            |

## Catatan arsitektur (fase DDD berikutnya)

Saat ini fungsi murni tinggal di layer `features` agar staging berjalan tanpa
menyentuh paket lain. Pada fase DDD, `hitungPuyer` sebaiknya dipromosikan ke
`@tinyverse/clinical-core` (framework-agnostic) dan feature ini hanya mengimpor
dari sana. Uji golden vector ikut dipindahkan.
