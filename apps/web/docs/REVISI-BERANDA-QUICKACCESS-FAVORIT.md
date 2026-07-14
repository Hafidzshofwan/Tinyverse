# Revisi Beranda: Quick Access & Favorit

## Ringkasan
Merevisi dashboard/beranda pada tiga hal sesuai permintaan:
1. Quick Access kini **ditentukan sistem** berdasarkan fitur yang paling sering dibuka.
2. Menghapus entri **GCS** dan **AGD** dari Quick Access (halaman review lepasan).
3. **Favorit Saya** kini sepenuhnya bisa ditambah/dikurangi oleh user.

## 1. Quick Access berbasis pemakaian (bukan daftar statis)
**Sebelumnya:** `QUICK_ACCESS` adalah daftar HARDCODED (statis) di `nav-config.ts`, jadi
sama untuk semua orang dan tidak pernah berubah walau fitur A jauh lebih sering dipakai.

**Sekarang:**
- File baru `src/shared/lib/personalisasi.ts` mencatat berapa kali tiap fitur dibuka
  (disimpan di `localStorage` browser, kunci `tv-pemakaian`).
- `AppShell.tsx` memanggil `catatPemakaian(pathname)` setiap kali sebuah fitur dibuka
  (dari sidebar, Quick Access, favorit, maupun deep-link) — jadi pencatatannya otomatis
  di tingkat sistem, bukan hanya saat diklik dari satu tempat.
- `HomeQuickAccess.tsx` mengurutkan fitur dari yang **paling sering dibuka** dan
  menampilkan 6 teratas. Saat data belum ada, tampil urutan default (fitur inti).

**Kenapa localStorage, bukan server?** Agar tetap bekerja pada Mode Tinjau maupun akun
login tanpa mengubah struktur data medis, ringan, dan instan. Bisa dipindah ke profil
Firestore di kemudian hari bila ingin sinkron antar-perangkat.

## 2. GCS & AGD tidak lagi muncul sebagai "review" di Quick Access
**Masalah:** Quick Access lama memuat `GCS` (`/preview/gcs`) dan `AGD` (`/preview/agd`),
yang merupakan halaman preview lepasan dan **tidak ada di menu sidebar**. Membukanya
terasa seperti halaman review.

**Solusi:** Quick Access sekarang bersumber dari `FITUR_TERSEDIA`, yaitu **fitur asli yang
sudah jadi di menu** (`built: true`, selain Beranda). GCS adalah bagian dari **Skoring
Klinis** dan AGD bagian dari **Interpretasi Lab**, sehingga keduanya tidak lagi tampil
sebagai kartu tersendiri. (Halaman `/preview/gcs` dan `/preview/agd` tidak dihapus, hanya
tidak lagi ditautkan dari beranda.)

## 3. Favorit ditentukan user
**Sebelumnya:** `FAVORIT` adalah 2 contoh hardcoded; tombol bintang hanya hiasan.

**Sekarang:**
- Tombol bintang (☆/★) pada tiap kartu Quick Access **berfungsi**: klik untuk
  menambah/menghapus favorit (`toggleFavorit`, kunci `localStorage` `tv-favorit`).
- `HomeFavorites.tsx` menampilkan daftar favorit user, lengkap dengan tombol hapus (✕).
- Ada tampilan kosong yang informatif bila belum ada favorit.

## File yang diubah/ditambah
- Baru: `src/shared/lib/personalisasi.ts`
- Baru: `src/widgets/home-dashboard/{index.ts, HomeQuickAccess.tsx, HomeFavorites.tsx}`
- Ubah: `src/widgets/app-shell/nav-config.ts` (ganti `QUICK_ACCESS` statis → `FITUR_TERSEDIA`)
- Ubah: `src/widgets/app-shell/AppShell.tsx` (catat pemakaian saat fitur dibuka)
- Ubah: `src/app/page.tsx` (pakai komponen Quick Access & Favorit yang dinamis)
- Ubah: `src/app/globals.css` (tombol bintang & tombol hapus favorit dapat diklik)

Tidak ada logika/perhitungan medis yang diubah.
