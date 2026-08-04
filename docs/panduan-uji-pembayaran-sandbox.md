# Panduan Uji Alur Pembayaran (Sandbox Midtrans)

Dokumen ini untuk menguji alur beli-sampai-akses-terbuka memakai kredensial
**sandbox** Midtrans. Tidak menyentuh uang sungguhan, dan tidak menunggu hasil
review bisnis Midtrans -- review hanya berlaku untuk kredensial produksi.

## 1. Prasyarat

- `.env` (lokal) atau environment Vercel Preview berisi:
  - `MIDTRANS_MODE=sandbox`
  - `MIDTRANS_SERVER_KEY` diawali `SB-...`
  - `MIDTRANS_CLIENT_KEY` diawali `SB-...`
  - `APP_BASE_URL` mengarah ke alamat yang sedang diuji (mis. `http://localhost:3000` atau URL Preview Vercel)
  - `CRON_SECRET` terisi (dipakai di langkah 6)
- Kredensial Firebase Admin (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) mengarah ke project yang boleh ditulisi data uji.
- Sudah masuk (login) dengan satu akun pengguna di aplikasi.

Bila `MIDTRANS_SERVER_KEY`/`MIDTRANS_CLIENT_KEY` TIDAK diawali `SB-`, jangan
simpulkan itu keliru -- tidak semua akun sandbox Midtrans memakai awalan itu.
Yang penting `MIDTRANS_MODE` bernilai `sandbox`.

## 2. Jalur utama: pembayaran berhasil

1. Buka halaman **Langganan**, pilih salah satu paket, tekan tombol beli.
   Jendela Snap (popup) akan muncul di atas halaman.
2. Pilih metode **Kartu Kredit/Debit**.
3. Isi dengan kartu uji Midtrans (lihat tabel di bagian 3). Kartu ini hanya
   berfungsi selama `MIDTRANS_MODE=sandbox`.
4. Bila muncul halaman OTP 3DS, isi `112233`.
5. Setelah jendela Snap menutup dan menyatakan sukses, buka kembali halaman
   **Langganan** dan periksa:
   - Status berubah menjadi "Aktif" (atau tanggal "Berlaku sampai" bertambah,
     bila sebelumnya sudah berlangganan).
   - Kartu "Riwayat pembayaran" menampilkan baris baru berstatus "Berhasil".
   - Spanduk pengingat masa aktif (bila sebelumnya tampil) hilang.

Midtrans mengirim notifikasi ke `POST /api/midtrans/webhook` secara
asinkron -- biasanya dalam beberapa detik. Bila status di halaman Langganan
belum berubah setelah ~30 detik, muat ulang halaman sekali lagi sebelum
menganggap ada yang salah.

## 3. Kartu uji Midtrans (sandbox)

| Skenario | Nomor kartu | Tgl kedaluwarsa | CVV | OTP 3DS |
|---|---|---|---|---|
| Sukses | 4811 1111 1111 1114 | bebas, tanggal depan | 123 | 112233 |
| Ditolak bank (deny) | 4911 1111 1111 1113 | bebas, tanggal depan | 123 | 112233 |

Nomor-nomor ini dipublikasikan Midtrans dan sewaktu-waktu bisa berubah --
bila salah satunya tidak berfungsi, cek daftar terbaru di dashboard Midtrans
Sandbox pada menu Docs/Testing.

## 4. Jalur gagal: kartu ditolak

1. Ulangi langkah checkout di bagian 2, tetapi pakai kartu "Ditolak bank" di
   tabel atas.
2. Jendela Snap akan menampilkan pesan gagal.
3. Buka halaman **Langganan** > Riwayat pembayaran: baris pesanan tadi harus
   berstatus "Gagal", dan status langganan TIDAK berubah.

## 5. Jalur kedaluwarsa (pesanan tidak pernah dibayar)

Pesanan otomatis kedaluwarsa 60 menit setelah dibuat (`DURASI_BAYAR_MENIT` di
`snap.ts`). Untuk menguji tanpa menunggu satu jam, gunakan simulator status di
dashboard Midtrans Sandbox (menu Docs > Testing > Transaction Status
Simulator) dan kirim status `expire` untuk `order_id` yang bersangkutan, atau
tunggu rekonsiliasi otomatis (bagian 6) mengoreksinya lewat Get Status API.

## 6. Uji rekonsiliasi manual

Rute `GET /api/cron/rekonsiliasi` adalah jaring pengaman: memeriksa ulang
semua pesanan yang masih "menunggu" ke Midtrans lewat Get Status API dan
memperbaiki status yang telat diperbarui webhook. Bisa dipanggil manual:

```
curl -H "Authorization: Bearer NILAI_CRON_SECRET" https://ALAMAT_APLIKASI/api/cron/rekonsiliasi
```

Ganti `NILAI_CRON_SECRET` dengan isi environment variable `CRON_SECRET`, dan
`ALAMAT_APLIKASI` dengan domain yang sedang diuji. Jawabannya berupa ringkasan
JSON (`diperiksa`, `diterapkan`, `ditandaiKedaluwarsa`, `perluDitinjau`,
`gagal`).

## 7. Uji notifikasi dikirim ulang (idempoten)

Midtrans boleh mengirim notifikasi yang sama lebih dari sekali. Untuk
memastikan pesanan yang sudah "Berhasil" tidak diproses dua kali:

1. Selesaikan satu pembayaran sukses (bagian 2).
2. Di dashboard Midtrans Sandbox, buka riwayat transaksi tersebut dan kirim
   ulang notifikasinya (menu "Resend Notification", bila tersedia untuk akun
   sandbox), ATAU panggil ulang rekonsiliasi manual (bagian 6).
3. Periksa halaman Langganan: tanggal "Berlaku sampai" TIDAK bertambah lagi
   untuk kiriman ulang yang sama -- hanya bertambah satu kali per pesanan.

## 8. Tempat melihat jejak (bila hasil di halaman tidak sesuai dugaan)

- **Log Vercel** (tab Functions/Logs pada deployment yang diuji): cari baris
  berawalan `[midtrans]` atau `[rekonsiliasi]`.
- **Firestore**: koleksi pesanan menyimpan setiap notifikasi mentah yang
  diterima webhook, berguna untuk melihat isi persis yang dikirim Midtrans.

## Ringkasan checklist

- [ ] Beli paket dengan kartu sukses -> status jadi Aktif, riwayat "Berhasil"
- [ ] Beli paket dengan kartu ditolak -> status tidak berubah, riwayat "Gagal"
- [ ] Rekonsiliasi manual berjalan tanpa galat
- [ ] Notifikasi dikirim ulang tidak menggandakan masa aktif
- [ ] Spanduk pengingat masa aktif hilang setelah perpanjangan berhasil
