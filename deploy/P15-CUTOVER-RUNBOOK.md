# P15 — Runbook Cutover (v17 → Platform Modular)

> Tujuan fase ini: **men-deploy aplikasi baru ke produksi (Vercel) lalu mengarahkan
> "pintu masuk" pengguna ke aplikasi baru**, sambil menjaga **v17 tetap hidup**
> sebagai **rollback instan**. Sesuai strategi Strangler Fig di Log Migrasi.

Runbook ini adalah **langkah manual yang KAMU jalankan** (deploy & domain harus
lewat akun Vercel-mu). AI tidak bisa mengakses akun Vercel/DNS-mu.

---

## 0. Ringkasan strategi (dan alasannya)

Kamu **belum punya custom domain** dan baru akan deploy saat semuanya selesai.
Untuk kondisi ini, strategi paling aman & gratis:

**Deploy sebagai 2 project Vercel terpisah, v17 dibiarkan utuh, lalu "cutover"
dilakukan dengan cara TUKAR NAMA project (name-swap) ketika kamu sudah yakin.**

Kenapa cara ini:
- **v17 tidak disentuh** selama proses → kalau ada masalah, v17 masih online =
  rollback instan (prinsip Strangler Fig).
- **Tanpa biaya domain** → memakai URL gratis `*.vercel.app`.
- **Reversible** → cutover = tukar nama; rollback = tukar balik.
- Saat nanti kamu beli custom domain, migrasi ke domain itu jadi mulus
  (lihat bagian 7).

Peta akhir yang dituju:

| Peran | Sebelum cutover | Sesudah cutover |
|---|---|---|
| Aplikasi utama (baru) | `tinyverse-web.vercel.app` | **`tyniverse.vercel.app`** |
| v17 (rollback) | `tyniverse.vercel.app` | `tyniverse-v17.vercel.app` (tetap hidup) |
| Marketing site | `tinyverse-site.vercel.app` | `tinyverse-site.vercel.app` |

> Catatan: URL contoh di atas bebas kamu ganti. Yang penting POLA-nya:
> app baru mengambil URL yang selama ini dipakai v17, dan v17 pindah ke URL arsip
> tapi **tetap online**.

---

## 1. Prasyarat (cek dulu sebelum mulai)

- [ ] `pnpm build` **hijau** di komputer kamu (root repo). Wajib lulus dulu.
- [ ] P12 (Auth) & P14 (Marketing) sudah kamu verifikasi jalan (idealnya).
- [ ] Repo sudah di-push ke **GitHub** (Vercel deploy dari GitHub).
- [ ] Punya akun **Vercel** (login pakai GitHub).
- [ ] (Kalau mau login aktif) Firebase sudah disiapkan: Security Rules + skrip
      seed obat sudah dijalankan (lihat catatan P11 di Log Migrasi).

> Pasang dulu bundel ini (BUNDEL-16): salin folder `deploy/` dan file
> `apps/web/vercel.json`, `apps/site/vercel.json`, `.env.production.example`
> ke repo (semua bersifat TAMBAHAN — tidak menimpa kode fitur).

---

## 2. Deploy aplikasi utama (apps/web) — Project #1

1. Buka https://vercel.com/new → pilih repo GitHub kamu → **Import**.
2. Di layar konfigurasi:
   - **Project Name**: `tinyverse-web` (sementara; nanti diganti saat cutover).
   - **Framework Preset**: Next.js (biasanya terdeteksi otomatis).
   - **Root Directory**: klik **Edit** → pilih **`apps/web`**.
     (PENTING untuk monorepo. Vercel otomatis menyertakan file dari luar Root
     Directory saat build — pnpm workspace ikut ter-install.)
   - **Build/Install Command**: biarkan default (Vercel mengenali pnpm & Next).
3. **Environment Variables** (Production):
   - `NEXT_PUBLIC_AUTH_ENABLED` = `true` (atau `false` untuk buka tanpa login).
   - (Firebase TIDAK perlu env — sudah hardcoded di kode.)
4. Klik **Deploy**. Tunggu sampai selesai.
5. Catat URL hasilnya, mis. `https://tinyverse-web.vercel.app`. Uji buka URL itu.

> Kalau build gagal soal workspace/monorepo: Project > Settings > General >
> pastikan opsi "Include files outside root directory" aktif (default aktif),
> dan Root Directory = `apps/web`.

---

## 3. Deploy marketing site (apps/site) — Project #2

1. https://vercel.com/new → **Import** repo yang SAMA sekali lagi (project baru).
2. Konfigurasi:
   - **Project Name**: `tinyverse-site`.
   - **Root Directory**: **`apps/site`**.
3. **Environment Variables** (Production):
   - `NEXT_PUBLIC_APP_URL` = URL app utama dari langkah 2
     (mis. `https://tinyverse-web.vercel.app`).
4. **Deploy** → catat URL, mis. `https://tinyverse-site.vercel.app`.
5. Buka marketing site → klik **Buka Aplikasi** → harus membuka app utama.

---

## 4. Verifikasi produksi (sebelum cutover)

Jalankan checklist di `GO-LIVE-CHECKLIST.md`. Ringkasnya:
- [ ] App utama terbuka, semua 9 menu "built" berfungsi.
- [ ] Login/daftar jalan (kalau `NEXT_PUBLIC_AUTH_ENABLED=true`).
- [ ] PWA: bisa "Install app", dan halaman yang sudah dibuka tetap jalan offline.
- [ ] Marketing site tampil benar; tombol "Buka Aplikasi" → app utama.
- [ ] 2 menu "Segera" (Imunisasi, Ringkasan) tampil sebagai placeholder (memang
      sengaja — belum dibangun).

> Jangan lanjut ke cutover sebelum semua ini beres.

---

## 5. CUTOVER (name-swap) — saat kamu sudah yakin

Inilah momen "mengarahkan domain". Karena belum ada custom domain, kita tukar
nama project agar app baru mengambil URL `tyniverse.vercel.app`.

1. **Amankan v17 dulu (jadikan rollback):**
   - Buka project **v17** di Vercel → Settings > General > **Project Name** →
     ganti jadi `tyniverse-v17`.
   - URL-nya otomatis jadi `https://tyniverse-v17.vercel.app` — **tetap online**.
   - Uji buka URL baru v17 ini, pastikan hidup. (Ini jaring pengamanmu.)
2. **Naikkan app baru ke URL utama:**
   - Buka project **tinyverse-web** → Settings > General > **Project Name** →
     ganti jadi `tyniverse`.
   - URL-nya otomatis jadi `https://tyniverse.vercel.app` (URL lama v17).
3. **Samakan marketing site:**
   - Project **tinyverse-site** > Settings > Environment Variables →
     ubah `NEXT_PUBLIC_APP_URL` = `https://tyniverse.vercel.app`.
   - **Redeploy** marketing site (Deployments > ... > Redeploy) agar env baru
     terpakai.
4. **Uji akhir:** buka `https://tyniverse.vercel.app` → harus aplikasi BARU.
   Buka `https://tyniverse-v17.vercel.app` → harus v17 (rollback siap).

> Kenapa aman: tidak ada file yang dihapus. v17 hanya berpindah URL, isinya utuh.

---

## 6. ROLLBACK instan (kalau ada masalah setelah cutover)

Lihat `ROLLBACK.md`. Ringkas: tukar nama balik —
`tyniverse` (app baru) → `tinyverse-web`, lalu `tyniverse-v17` → `tyniverse`.
Dalam < 1 menit `tyniverse.vercel.app` kembali ke v17.

---

## 7. Nanti: pakai custom domain (opsional, direkomendasikan)

Saat kamu sudah beli domain (mis. `tinyverse.app`):
1. Project app baru > Settings > **Domains** > tambah `tinyverse.app`
   (+ `www`). Ikuti instruksi DNS dari Vercel.
2. Untuk rollback berbasis domain (lebih mulus dari name-swap): cukup pindahkan
   domain itu dari project app baru ke project v17 bila perlu.
3. Rekomendasi tata letak: **marketing di domain utama** (`tinyverse.app`),
   **aplikasi di subdomain** (`app.tinyverse.app`), lalu set
   `NEXT_PUBLIC_APP_URL=https://app.tinyverse.app` di marketing site.

---

## 8. Catatan

- **Firebase:** config publik sudah hardcoded; produksi memakai project Firebase
  yang sama dengan v17. Pastikan **Authorized domains** di Firebase Console
  (Authentication > Settings) memuat domain Vercel kamu (`tyniverse.vercel.app`,
  dan URL lain yang dipakai) agar login tidak diblokir.
- **Header keamanan:** `vercel.json` menambah header standar (nosniff, X-Frame
  SAMEORIGIN, Referrer-Policy, Permissions-Policy, HSTS) — bersifat tambahan,
  tidak mengubah kode fitur.
- **2 fitur "Segera":** Imunisasi & Ringkasan sengaja dibiarkan placeholder
  (keputusan kamu). Bisa dibangun setelah cutover tanpa mengganggu yang lain.
- **v17 dipensiunkan** baru di **P16**, setelah masa stabil. Selama P15, v17 wajib
  tetap hidup.
