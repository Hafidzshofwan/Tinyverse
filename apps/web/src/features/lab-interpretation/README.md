# lab-interpretation (Interpretasi Lab Anak)

Port **verbatim** dari TinyVerse v17 — SAMA PERSIS, tidak ada fitur yang dihilangkan.

## Isi (semua dari v17)
- **Nilai Rujukan** per kelompok usia (neonatus → remaja) untuk 13 parameter (Hb, Ht, leukosit, trombosit, MCV, Na, K, Cl, Ca, glukosa, ureum, kreatinin, CRP) + cek cepat satu nilai (rendah/normal/tinggi).
- **Hitung Darah**: interpretasi anemia (derajat + morfologi mikro/normo/makrositik), leukopenia/leukositosis, trombositopenia/trombositosis.
- **Koreksi Elektrolit**: natrium (defisit Na, NaCl 3%, air bebas) + kalium (KCl oral/IV) + kalsium (koreksi albumin + Ca glukonas), lengkap dengan ambang kewaspadaan.
- **Gas Darah (AGD)**: analisis 6 langkah (pH → primer → DDx → kompensasi akut/kronik → anion gap → oksigenasi P/F & gradien A–a), catatan jenis sampel, plus contoh kasus.

Rujukan mengikuti Harriet Lane / AAP-ACCP; ambang anemia WHO 2024 (sesuai v17).

## WHY island (bukan rewrite)
Banyak tab, state, dan render DOM langsung. Kode v17 dijalankan apa adanya di
`/public/lab-tool.html` (via <iframe> pada `LabTool.tsx`) agar perilaku & angka
identik. Alat bantu — selalu korelasikan dengan klinis & rentang lab setempat.
