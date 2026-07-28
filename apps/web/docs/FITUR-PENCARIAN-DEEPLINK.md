# Pencarian Global + Deep-Link (BUNDEL-7)

Dokumen ini menjelaskan revisi pencarian dan logo pada BUNDEL-7, beserta
alasannya, agar mudah dirawat ke depan.

## Ringkasan revisi

1. **Pencarian langsung membuka bagian yang tepat (deep-link).**
   Sebelumnya, menekan hasil seperti “Epinefrin” hanya membuka Mode Darurat di
   posisi paling atas. Sekarang aplikasi otomatis: membuka tab yang benar
   (mis. “Dosis & Alat (PALS)”), membuka kategori yang relevan (mis. “Obat
   Emergensi”), lalu menggulir + menyorot baris tujuan.
2. **Pencarian mencakup semua isi web**: teks tiap alat, **nama obat** (Dosis
   Obat), **skoring klinis**, dan **guideline**.
3. **Galeri “Obat Emergensi” & “Energi Listrik” kini tertutup saat awal dibuka.**
4. **Logo**: ikon di samping tulisan “Tinyverse” (header & footer) memakai
   gambar `public/brand/logo.png` yang bisa diganti dengan logo Anda.

## Cara kerja deep-link (alur teknis)

Alat-alat tampilan (Mode Darurat, Cairan, dll.) dirender sebagai halaman HTML
“island” di dalam `<iframe>`. Agar pencarian bisa menuju bagian dalam island:

1. **Indeks** (`scripts/build-search-index.mjs` → `public/search-index.json`)
   menyimpan `anchor` untuk tiap hasil:
   - `text:<potongan teks>` — dicari berdasarkan teks (untuk isi island & obat).
   - `id:<idElemen>` — langsung ke elemen ber-id (untuk skoring, mis.
     `id:skor-cds`).
2. **GlobalSearch** (`src/widgets/app-shell/GlobalSearch.tsx`) saat hasil
   diklik menavigasi ke `href` + `#tk=<anchor>` (mis.
   `/preview/darurat#tk=text:Epinefrin...`).
3. **Loader iframe** (mis. `DaruratTool.tsx`) memakai hook
   `src/shared/lib/useIslandSrc.ts` untuk meneruskan `#tk=...` dari halaman induk
   menjadi `?tk=...` pada URL island.
4. **Bridge** `public/tv-deeplink.js` (disuntik ke semua island) membaca `?tk=`,
   menemukan elemen tujuan (via id atau kecocokan teks yang mengabaikan spasi &
   tanda baca), membuka tab/kategori/`<details>` di atasnya, menyorotnya, lalu
   mengirim posisi ke halaman induk lewat `postMessage({ __tkScrollTo })`.
5. **AppShell** mendengarkan pesan itu dan menggulir halaman ke posisi elemen
   (dikurangi tinggi header ~90px).
6. **Skoring** adalah komponen React (bukan island), jadi ditangani langsung di
   `ScoreCatalog.tsx` (kartu diberi `id="skor-<id>"` + efek gulir/sorot).

> Catatan: island dirender penuh tanpa scroll internal, sehingga yang menggulir
> adalah halaman induk — itulah alasan mekanisme `__tkScrollTo` diperlukan.

## Mengganti logo

- Ganti berkas `apps/web/public/brand/logo.png` dengan logo Anda (**PNG latar
  transparan**, disarankan bujur sangkar mis. 256×256). Nama file harus tetap
  `logo.png`.
- Tidak perlu ubah kode. Tinggi ikon otomatis (header ~30px, footer ~24px) dan
  proporsional. Teks “Tinyverse” tetap tampil di samping ikon.
- Logo Anda (emblem “T” hasil potong dari logo lengkap, latar transparan)
  **sudah terpasang**. Wordmark “Tinyverse” di logo asli sengaja dipotong agar
  tidak dobel dengan teks di header/footer.

## Memperbarui indeks pencarian

Jika konten alat, daftar obat (`scripts/obat.json`), atau skoring berubah,
jalankan ulang dari folder `apps/web`:

```
node scripts/build-search-index.mjs
```

Ini menulis ulang `public/search-index.json`.

## Berkas yang terlibat

- Baru: `public/tv-deeplink.js`, `src/shared/lib/useIslandSrc.ts`,
  `src/widgets/app-shell/Logo.tsx`, `public/brand/logo.png`,
  `scripts/obat.json`.
- Diubah: `scripts/build-search-index.mjs`, `public/search-index.json`,
  `public/darurat-tool.html` (+ semua `*-tool.html` disuntik bridge),
  `src/widgets/app-shell/{GlobalSearch,AppShell}.tsx`, 8 loader di
  `src/features/*`, `src/features/clinical-scores/ScoreCatalog.tsx`,
  `src/app/globals.css`.

## Mode Tinjau (bypass login untuk localhost)

Karena API key login dibatasi ke domain tertentu, `localhost` tidak bisa
login. Seperti v17, tersedia **Mode Tinjau**: masuk ke aplikasi memakai profil
dummy tanpa Firebase.

- Di layar login ada tombol **“Masuk Mode Tinjau (tanpa login)”** (juga muncul
  di layar error bila Firebase gagal dimuat).
- Profil dummy: nama “Mode Tinjau”, role admin, `tinjau@demo.local`.
- Pilihan Mode Tinjau disimpan di `localStorage` (`tv-mode-tinjau`) sehingga
  bertahan saat halaman dimuat ulang; menekan **Keluar** akan menghapusnya.
- Dalam Mode Tinjau, penyimpanan ke Firestore dilewati: edit profil &
  preferensi hanya berlaku di sesi (tidak persisten), riwayat tidak dicatat,
  dan daftar pengguna admin kosong. Ini disengaja karena tidak ada akun nyata.
- Kode: `src/widgets/user-account/AuthProvider.tsx` (`masukTinjau`, `tinjauRef`,
  `PROFIL_TINJAU`, cek `localStorage` saat init) dan
  `src/widgets/user-account/AuthScreen.tsx` (tombol).

> Untuk produksi (domain terdaftar), cukup login seperti biasa; Mode Tinjau
> hanya alat bantu pratinjau lokal.

## Pencarian isi Guideline (pneumonia, kejang demam, dll.)

Daftar guideline berada di array `DAFTAR_GUIDELINE` di dalam
`src/features/guideline-tool/data.ts`. `scripts/build-search-index.mjs` mem-parse `DAFTAR_GUIDELINE`
secara khusus dan menambahkan satu entri per guideline (judul + kategori +
sumber + tahun + tags sebagai kata kunci). Anchor-nya `text:<judul>` sehingga
saat diklik, komponen guideline menyorot kartu yang cocok.

Saat konten guideline diubah/ditambah, jalankan ulang dari `apps/web`:

    node scripts/build-search-index.mjs

Saat ini terindeks 14 guideline (Pneumonia, Asma, Diare, Tuberkulosis, Kejang
Demam, Gizi Buruk, Infeksi Tropis, Hipotiroid Kongenital, Short Stature, DBD,
DM Tipe 1, Alergi Susu Sapi, Sindrom Nefrotik, Epilepsi).
