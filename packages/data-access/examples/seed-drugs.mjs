// Skrip sekali-pakai untuk mengunggah katalog obat (obat.json) ke Firestore.
//
// Cara pakai (dari root repo, setelah `pnpm install`):
//   1. Salin obat.json ke root repo (atau sesuaikan path di bawah).
//   2. Isi konfigurasi Firebase di .env.local ATAU langsung di objek di bawah.
//   3. Jalankan:  node packages/data-access/examples/seed-drugs.mjs
//
// Catatan: skrip ini memakai SDK Firebase client, jadi Security Rules koleksi
// "drugs" harus mengizinkan write untuk akun yang menjalankan (mis. sementara
// izinkan write saat seeding, lalu kunci lagi jadi read-only).

import { readFileSync } from "node:fs"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, writeBatch } from "firebase/firestore"

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const drugs = JSON.parse(readFileSync("./obat.json", "utf8"))

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const batch = writeBatch(db)
for (const d of drugs) {
	batch.set(doc(db, "drugs", d.id), d)
}
await batch.commit()

console.log(`Selesai: ${drugs.length} obat diunggah ke koleksi "drugs".`)
process.exit(0)
