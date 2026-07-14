# feature: dosing-tool (Kalkulator Dosis Obat)

Island loader untuk Kalkulator Dosis Obat, port verbatim dari TinyVerse v17
(halaman `page-dosis`).

## Kenapa island (iframe)?
Logika dosis v17 sangat imperatif dan saling terkait (grid obat, filter kategori,
pemilihan sediaan, batas dosis tunggal/harian, peringatan keselamatan). Menyalin
markup + CSS + skrip v17 apa adanya ke dokumen terisolasi menjamin hasilnya SAMA
PERSIS tanpa menulis ulang.

## Dataset obat offline
Di v17 daftar obat dimuat dari Firestore (`db.collection("obat")`). Agar berjalan
offline, dataset bawaan `obat.json` disuntikkan langsung ke `/dosis-tool.html`
menggantikan pemanggilan Firestore. Data mengikuti skema yang sama persis dengan
yang diharapkan mesin v17 (dosisMinPerKg, sediaanMg, bands, dll).
