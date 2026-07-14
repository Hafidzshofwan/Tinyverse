# guideline-tool

Island loader untuk Guideline Anak (port verbatim v17 page-protokol / PDF library).
Sumber: apps/web/public/guideline-tool.html (markup + CSS + skrip v17 di iframe terisolasi).

Data: TV_GUIDELINE_LIST (embedded) berisi ~14 guideline dgn kategori, sumber, tahun, tags.
UI: galeri kartu + pencarian + filter kategori + detail (embed PDF) + lightbox alur.

## Menaruh file PDF
item.pdfUrl memakai path relatif assets/guidelines/<id>.pdf. Letakkan file PDF pedoman
(IDAI/Kemenkes) di apps/web/public/assets/guidelines/ sesuai nama pdfUrl di data.
Sampai file diisi, kartu & detail tetap tampil; hanya frame PDF yang kosong (tombol Buka PDF tersedia).
