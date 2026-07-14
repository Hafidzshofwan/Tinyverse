# Fitur Pencarian Global (Command Palette)

Dokumen ini menjelaskan cara kerja pencarian di header (kotak "Cari alat, fitur,
atau kata kunci...").

## Ruang lingkup pencarian

Pencarian mencakup 3 lapisan (dari paling dangkal ke paling dalam):

1. **Nama menu** — mis. "Kalkulator Nutrisi", "Interpretasi Lab".
2. **Kata kunci / alias medis** — mis. `gcs`, `natrium`, `mpasi`, `dehidrasi`,
   `agd`, `susu formula`. Dikurasi manual di generator agar istilah umum tetap
   ketemu walau kata persisnya tak muncul di judul.
3. **Teks di dalam alat** — judul panel, label input, tombol, dsb. yang diambil
   otomatis dari isi tiap island `*-tool.html`.

> Catatan: "apapun yang dicari" di sini berarti apa pun **di dalam aplikasi
> Tinyverse** (menu + isi alat), bukan pencarian internet. Aplikasi ini alat
> klinis offline, jadi indeksnya dibatasi ke konten aplikasi sendiri.

## Arsitektur

- **`public/search-index.json`** — indeks statis (± 46 KB) yang di-`fetch` sekali
  saat kotak pencarian pertama difokus. Karena file statis, fitur langsung jalan
  tanpa server/DB.
- **`scripts/build-search-index.mjs`** — generator murni Node (tanpa dependency).
  Membaca tiap `public/*-tool.html`, membuang `<script>`/`<style>`, menyisakan
  teks, memfilter & dedupe frasa, lalu menulis `search-index.json`.
- **`src/widgets/app-shell/GlobalSearch.tsx`** — komponen kotak pencarian +
  dropdown hasil. Tokenisasi query (cocok AND, tanpa peduli huruf besar/kecil),
  peringkat (nama menu > kata kunci > isi; frasa lebih pendek diutamakan), maks
  10 hasil dan maks 3 per alat. Klik hasil = pindah ke halaman alat.

## Regenerasi indeks

Jika isi island (`*-tool.html`) berubah, perbarui indeks:

```cmd
cd apps\web
node scripts\build-search-index.mjs
```

File `public/search-index.json` akan ditimpa dengan konten terbaru.

## Batasan saat ini & rencana lanjutan

- Klik hasil membawa ke **halaman alat** terkait. Untuk sekarang belum melompat
  (scroll) langsung ke bagian tertentu di dalam iframe alat.
- Rencana lanjutan (opsional): kirim pesan `postMessage` ke island untuk
  auto-scroll/menyorot elemen yang cocok (deep-link ke dalam alat).
