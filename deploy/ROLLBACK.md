# ROLLBACK INSTAN — Kartu Darurat

> Pakai ini kalau setelah cutover aplikasi baru bermasalah dan kamu perlu
> mengembalikan `tyniverse.vercel.app` ke v17 secepatnya.

## Opsi A — Tukar nama balik (name-swap), < 1 menit

1. Vercel > project **`tyniverse`** (aplikasi baru) > Settings > General >
   **Project Name** → ganti jadi `tinyverse-web`.
   (URL-nya lepas dari `tyniverse.vercel.app`.)
2. Vercel > project **`tyniverse-v17`** > Settings > General >
   **Project Name** → ganti jadi `tyniverse`.
   (v17 kembali menempati `https://tyniverse.vercel.app`.)
3. Buka `https://tyniverse.vercel.app` → pastikan v17 kembali tampil.
4. (Kalau perlu) marketing site: set `NEXT_PUBLIC_APP_URL` balik ke URL lama
   app baru, atau arahkan sementara ke v17, lalu Redeploy.

## Opsi B — Instant Rollback bawaan Vercel (per-deployment)

Kalau masalahnya karena deploy TERBARU app baru (bukan ingin balik ke v17):
1. Vercel > project app baru > tab **Deployments**.
2. Pilih deployment lama yang stabil > menu **...** > **Promote to Production**
   (Instant Rollback). Produksi langsung kembali ke versi itu.

## Prinsip

- v17 **tidak pernah dihapus** selama P15 → selalu tersedia sebagai jaring.
- Rollback = operasi nama/promote, **tanpa** build ulang v17.
- Setelah rollback, catat penyebab masalah sebelum mencoba cutover lagi.
