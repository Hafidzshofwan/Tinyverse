/**
 * Inisialisasi Firebase Admin SDK — HANYA untuk server.
 *
 * WHY Admin SDK, bukan SDK klien: Admin SDK memakai service account, sehingga
 * ia MELEWATI Firestore Security Rules. Inilah yang memungkinkan aturan kita
 * menolak semua penulisan dari browser namun server tetap bisa menulis.
 *
 * CATATAN VERCEL: Admin SDK tidak bisa berjalan di Edge Runtime. Setiap Route
 * Handler atau Server Component yang memakainya wajib berjalan di runtime
 * Node. Karena itu verifikasi sesi TIDAK boleh ditaruh di middleware.ts.
 */
import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { envAdmin } from "./env";

const NAMA_APP = "tinyverse-admin";

/*
 * Lambda di Vercel dipakai ulang antar permintaan. Tanpa penjagaan ini,
 * initializeApp akan dipanggil berkali-kali dan melempar error.
 */
function app(): App {
  const adaSebelumnya = getApps().find((a) => a.name === NAMA_APP);
  if (adaSebelumnya) return adaSebelumnya;
  return initializeApp({ credential: cert(envAdmin()) }, NAMA_APP);
}

export function adminAuth(): Auth {
  return getAuth(app());
}

export function adminDb(): Firestore {
  return getFirestore(app());
}
