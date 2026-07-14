# fluid-therapy (Terapi Cairan)

Port **verbatim** dari TinyVerse v17 (halaman `page-cairan`) — SAMA PERSIS, tidak ada
fitur yang dihilangkan. Menyatukan kembali seperti v17: **satu** menu "Terapi Cairan"
yang memuat keempat metode (menu "Luka Bakar" terpisah dihapus).

## Isi (semua dari v17)
- **Rumatan (Holliday–Segar)**: 100/50/20 mL/kg — total mL/hari & mL/jam + rincian.
- **Rehidrasi WHO**: Rencana A/B/C. Rencana B (75 mL/kg/3 jam), Rencana C bertahap
  (30 lalu 70 mL/kg) dengan pembeda kelompok usia bayi/anak.
- **Rehidrasi Luka Bakar**: rumus **Parkland** (4 mL x BB x %TBSA) + **PETA TUBUH SVG
  INTERAKTIF Lund–Browder** (anterior & posterior; klik area, %TBSA otomatis menyesuaikan
  usia; toggle seluruh lengan/tungkai; reset). Output: TBSA, cairan resusitasi,
  pembagian 8/16 jam, maintenance, total 24 jam, target produksi urin.
- **Faktor Tetes Infus**: makro (20) / mikro (60) gtt/mL → tetes/menit & mL/jam.

## WHY island (bukan rewrite komponen)
Logika v17 (khususnya SVG interaktif + Parkland) berada di skrip aplikasi monolitik
yang meng-init seluruh halaman tanpa guard. Menjalankan slice markup+CSS+fungsi v17
apa adanya di `/public/cairan-tool.html` (via <iframe> pada `CairanTool.tsx`) dengan
bootstrap wiring sendiri menjamin perilaku & angka identik dan gambar interaktif utuh.

Alat bantu hitung — bukan pengganti penilaian klinis.
