# Go-Live Checklist — P15 Cutover

## A. Sebelum deploy (lokal)
- [ ] `pnpm install` bersih
- [ ] `pnpm build` hijau (semua paket)
- [ ] `pnpm typecheck` hijau
- [ ] `pnpm lint` hijau
- [ ] P12 (Auth) diverifikasi jalan di lokal
- [ ] P14 (Marketing) diverifikasi jalan di lokal
- [ ] Repo sudah di-push ke GitHub

## B. Deploy app utama (apps/web) — Project #1
- [ ] Root Directory = `apps/web`
- [ ] Env `NEXT_PUBLIC_AUTH_ENABLED` diisi (true/false)
- [ ] Deploy sukses, URL dicatat: ________________________
- [ ] Buka URL → app tampil

## C. Deploy marketing (apps/site) — Project #2
- [ ] Root Directory = `apps/site`
- [ ] Env `NEXT_PUBLIC_APP_URL` = URL app utama
- [ ] Deploy sukses, URL dicatat: ________________________
- [ ] Tombol "Buka Aplikasi" → app utama

## D. Verifikasi fungsional (produksi)
- [ ] Beranda tampil
- [ ] Mode Darurat OK
- [ ] Dosis Obat OK
- [ ] Terapi Cairan OK
- [ ] Racik Puyer OK
- [ ] Tumbuh Kembang OK
- [ ] Skoring Klinis OK (termasuk GCS)
- [ ] Interpretasi Lab OK (termasuk AGD)
- [ ] Kalkulator Nutrisi OK
- [ ] Guideline OK
- [ ] Imunisasi & Ringkasan tampil sebagai "Segera" (placeholder, sengaja)

## E. Auth & data (kalau login aktif)
- [ ] Daftar / login jalan
- [ ] Domain Vercel sudah masuk Firebase > Authentication > Authorized domains
- [ ] Favorit / Quick Access tersimpan (Firestore `userSettings/{uid}`)
- [ ] Katalog obat sudah di-seed ke Firestore (kalau memakai data Firestore)

## F. PWA / offline
- [ ] Bisa "Install app" (ikon install muncul)
- [ ] Service worker "activated" (DevTools > Application)
- [ ] Offline: halaman yang sudah dibuka tetap jalan; lainnya → offline.html

## G. Keamanan
- [ ] Header keamanan aktif (cek DevTools > Network > Response Headers:
      X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS)

## H. Cutover (name-swap)
- [ ] v17 di-rename → `tyniverse-v17` dan DIUJI masih hidup (rollback siap)
- [ ] App baru di-rename → `tyniverse` (ambil `tyniverse.vercel.app`)
- [ ] Marketing `NEXT_PUBLIC_APP_URL` diarahkan ke `tyniverse.vercel.app` + Redeploy
- [ ] `tyniverse.vercel.app` = app baru; `tyniverse-v17.vercel.app` = v17

## I. Setelah go-live
- [ ] Pantau error (Vercel > Logs) beberapa hari
- [ ] Simpan link `ROLLBACK.md` di tempat mudah diakses
- [ ] Update Log Migrasi: tandai P15 ✅
