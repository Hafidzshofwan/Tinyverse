# @tinyverse/data-access

Lapisan **repository** untuk TinyVerse: membungkus sumber data (Firebase) di
balik **kontrak (port)** yang stabil, supaya kode aplikasi tidak pernah
memanggil Firebase langsung.

## Dua entri impor

```ts
// Inti (portable, tanpa SDK Firebase) — aman dipakai & diuji di mana saja:
import {
  createInMemoryRepositories,
  InMemoryDrugRepository,
  type DrugRepository,
  type UserRepository,
} from "@tinyverse/data-access"

// Entri Firebase (memuat SDK `firebase/firestore`) — hanya di sisi yang pakai:
import {
  createFirebaseRepositories,
  seedDrugsToFirestore,
} from "@tinyverse/data-access/firebase"
```

Entri Firebase sengaja dipisah agar package inti tetap ringan & bisa diuji
tanpa memuat SDK. Keduanya menghasilkan bentuk `Repositories` yang sama
(`{ drugs, users }`), jadi bisa ditukar tanpa mengubah kode pemakai.

## Model data Firestore

- `drugs/{id}` — satu dokumen per obat, id = `DrugRecord.id` (mis. `paracetamol`).
- `users/{uid}` — akun pengguna (`UserAccount`).
- `userSettings/{uid}` — pengaturan pengguna (`UserSettings`).

`FirebaseDrugRepository.list` memakai paginasi Firestore asli
(`orderBy("nama")` + `limit` + `startAfter`). `search` mengambil seluruh
koleksi lalu memfilter di memori (katalog kecil & statis, meniru v17;
Firestore tak punya pencarian substring bawaan).

## Cara pakai di aplikasi (contoh)

```ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { createFirebaseRepositories } from "@tinyverse/data-access/firebase"

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})
const repos = createFirebaseRepositories({ firestore: getFirestore(app) })

const page = await repos.drugs.list({ limit: 20 })
const settings = await repos.users.getSettings(uid)
```

## Seeding katalog obat

Lihat `examples/seed-drugs.mjs` — skrip sekali-pakai untuk mengunggah
`obat.json` (35 obat) ke koleksi `drugs`. Isi konfigurasi Firebase via env,
lalu jalankan `node packages/data-access/examples/seed-drugs.mjs`.

## Isi package

```
src/
  shared/           tipe primitif (Id, Page, ListOptions) + error standar
  drugs/            DTO + port + adapter in-memory + adapter Firestore + seed
  users/            akun & pengaturan: DTO + port + in-memory + Firestore
  factory.ts        createInMemoryRepositories()
  firebase-factory.ts  createFirebaseRepositories()
  index.ts          barrel inti (tanpa Firebase)
  firebase.ts       entri subpath Firebase
examples/
  seed-drugs.mjs    skrip unggah obat.json -> Firestore
```

## Pengujian

- Unit test (`pnpm --filter @tinyverse/data-access test`) memakai adapter
  in-memory yang deterministik — tidak butuh jaringan/Firebase.
- Adapter Firestore diuji terhadap **Firebase Emulator** pada langkah
  integrasi terpisah (di luar unit test ini).
