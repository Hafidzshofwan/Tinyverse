# P12 — Auth Route Guard, Feature Flag, & Repository Pengaturan

Fase ini merapikan sisi autentikasi + personalisasi secara arsitektural, TANPA
mengubah tampilan dan TANPA menyentuh modul kalkulator klinis.

## 1. Route guard (penjaga rute)

- Lokasi: `src/widgets/app-shell/AppShell.tsx`.
- Sebelumnya gerbang login tertanam kaku (`if (status !== "signedIn") ...`).
- Sekarang gerbang menghormati feature flag `AUTH_WAJIB`:
  - `AUTH_WAJIB = true`  -> wajib login (perilaku sama seperti sebelumnya).
  - `AUTH_WAJIB = false` -> aplikasi bisa dipakai tanpa login (untuk demo /
    pengembangan). `UserMenu` otomatis tidak tampil bila belum ada profil.
- Setelah login berhasil, URL tidak berubah sehingga pengguna otomatis kembali
  ke halaman yang tadi dituju.

## 2. Feature flag

- Lokasi: `src/shared/config/fitur.ts` -> konstanta `AUTH_WAJIB`.
- Dikendalikan variabel lingkungan `NEXT_PUBLIC_AUTH_ENABLED`:
  - tidak diisi / `true` -> wajib login (default).
  - `false` -> wajib-login dimatikan.
- Karena berawalan `NEXT_PUBLIC_`, nilai diproses saat build. Setelah mengubah
  `.env`, jalankan ulang `pnpm dev` agar berlaku.

## 3. Repository pengaturan pengguna

Modul baru: `src/shared/user-settings/`

| File            | Peran                                                        |
| --------------- | ------------------------------------------------------------ |
| `types.ts`      | Bentuk `UserSettings` (favorit + pemakaian) + nilai default. |
| `repository.ts` | Port `UserSettingsRepository` (`get` / `update`).            |
| `local.ts`      | Implementasi localStorage (kunci lama dipertahankan).        |
| `firestore.ts`  | Implementasi Firestore compat pada `userSettings/{uid}`.     |
| `store.ts`      | Store reaktif offline-first + hook (`useFavorit`, dll).      |
| `index.ts`      | Barrel ekspor modul.                                         |

### Kenapa pola ini (dan bukan langsung `@tinyverse/data-access`)?

- Aplikasi web memakai **Firebase compat SDK** (dimuat via CDN di
  `shared/firebase/firebaseClient.ts`), sedangkan paket `@tinyverse/data-access`
  memakai **Firebase modular SDK**. Mencampur keduanya berarti menambah stack
  Firebase kedua + dependency npm baru — berisiko dan di luar lingkup satu fase.
- Maka P12 menerapkan **pola Repository yang sama** di lapisan aplikasi, dengan
  model data **identik** (`userSettings/{uid}`). Saat aplikasi nanti bermigrasi
  ke SDK modular, cukup tukar `firestore.ts` dengan adapter dari paket
  data-access — data tidak perlu dipindahkan.

### Perilaku penyimpanan (offline-first)

- Baca cepat dari cache memori (sinkron) -> UI tetap ringan.
- Setiap perubahan: tulis ke localStorage **dan** (bila login) ke Firestore.
- Saat login, pengaturan akun dimuat. Bila akun masih kosong tetapi ada data
  lokal, data lokal diunggah sekali (migrasi mulus per-browser -> per-akun).
- Mode Tinjau / belum login -> localStorage saja (tidak menyentuh Firestore).

### Kompatibilitas

- `src/shared/lib/personalisasi.ts` kini hanya me-`export` ulang dari modul di
  atas, sehingga komponen lama (`HomeQuickAccess`, `HomeFavorites`, `AppShell`)
  tidak perlu diubah import-nya.

## Langkah manual di luar kode (opsional, agar sinkron antar-perangkat)

Agar favorit/pemakaian ikut akun (bukan hanya per-browser), tambahkan aturan
keamanan Firestore untuk koleksi `userSettings` — hanya pemilik yang boleh
baca/tulis:

```
match /userSettings/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

Bila aturan ini belum dipasang, aplikasi tetap berjalan normal memakai
localStorage (penulisan Firestore yang ditolak akan diabaikan diam-diam).
