# Fitur: Skoring Klinis (`clinical-scores`)

Satu mesin skoring data-driven untuk 8 skor klinis anak.

## Mengapa dibuat begini

- **Menyalin sumber kebenaran, bukan menebak.** Semua item, nilai, ambang,
  dan logika interpretasi disalin persis dari array `SKOR` di v17 milik
  pengguna (yang mengacu pedoman masing-masing).
- **Data-driven + fungsi murni.** Tiap skor adalah satu entri data dengan
  fungsi `interpret` murni. `hitungSkor(id, pilihan)` generik: menjumlahkan
  nilai lalu memanggil interpret. Mudah diuji & dipindahkan ke
  `@tinyverse/clinical-core` pada fase DDD.
- **Satu form generik** merender semua skor, jadi menambah skor baru cukup
  menambah data (tanpa UI baru).

## Daftar skor

| id       | Nama                              | Sumber (ringkas)             |
| -------- | --------------------------------- | ---------------------------- |
| cds      | Skor Dehidrasi (CDS)              | Goldman 2008                 |
| croup    | Westley Croup Score               | Westley 1978                 |
| pas      | Pediatric Appendicitis Score      | Samuel 2002                  |
| downes   | Downes Score                      | Downes-Vidyasagar 1970/71    |
| pass     | Pediatric Asthma Severity Score   | Gorelick 2004                |
| kawasaki | Kriteria Kawasaki (AHA)           | AHA 2017 / AAP 2024          |
| centor   | Skor Centor (McIsaac)             | Centor 1981; McIsaac 1998    |
| tbanak   | Skoring TB Anak                   | Kemenkes RI 2016 (Tabel 3.1) |

Golden vectors: lihat `hitungSkor.test.ts` (mencakup nilai batas & kasus
khusus seperti Kawasaki syarat demam dan Centor nilai negatif).

## Catatan

Menggantikan fitur `tb-score` lama (kini TB jadi salah satu entri katalog).
Ambang kategori bersifat indikatif; alat bantu, bukan pengganti penilaian klinis.
