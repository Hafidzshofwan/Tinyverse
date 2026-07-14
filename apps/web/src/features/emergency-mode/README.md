# emergency-mode (Mode Darurat)

Port **verbatim** dari TinyVerse v17 — SAMA PERSIS, tidak ada fitur yang dihilangkan.

## Isi (semua dari v17)
- **Data Pasien** cepat (nama, No. RM, usia, BB) tersinkron ke profil pusat (`localStorage: tv_pasien_aktif`).
- **pGCS** (Pediatric Glasgow Coma Scale): Eye/Verbal/Motor dengan opsi menyesuaikan kelompok usia otomatis + mode terintubasi (V=T) + interpretasi & salin/simpan.
- **PAT** (Pediatric Assessment Triangle): 3 sisi (penampilan/napas/sirkulasi) → kategori kegawatan + saran.
- **Dosis & Alat PALS**: epinefrin IV/IO & ETT, energi defibrilasi/kardioversi, D10/D25, ukuran ETT (cuffed/uncuffed), kedalaman, suction, bilah laringoskop — dihitung dari BB & usia.
- **Timer Resusitasi**: jam berjalan, alarm siklus 2 menit, pencatat tindakan berlabel waktu, salin/simpan kronologi.

## WHY island (bukan rewrite)
Halaman ini penuh state imperatif, `setInterval`, dan DOM langsung. Menjalankan
kode v17 apa adanya di `/public/darurat-tool.html` (dimuat via <iframe> oleh
`DaruratTool.tsx`) menjamin perilaku identik tanpa risiko divergensi. Rumus klinis
(PALS, ETT, GCS) tetap sesuai v17.

Alat bantu dokumentasi & hitung cepat — bukan pengganti penilaian klinis.
