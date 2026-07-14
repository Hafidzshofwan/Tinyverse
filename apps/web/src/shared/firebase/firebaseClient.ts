"use client";

/**
 * Loader Firebase (compat SDK) via CDN — sama seperti v17 agar fitur profil,
 * login, riwayat, dan kelola pengguna terhubung ke proyek Firebase yang sama.
 * Memakai compat SDK dari gstatic supaya tidak perlu menambah dependency npm
 * (cukup jalankan dev seperti biasa, tanpa langkah install tambahan).
 */

// Konfigurasi proyek Firebase v17 (key sisi-klien; memang publik & aman di frontend).
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDI5f69PBuHR-HX50ddVGqOYYBEDlJaZsA",
  authDomain: "tyniverse-5a3b2.firebaseapp.com",
  projectId: "tyniverse-5a3b2",
  storageBucket: "tyniverse-5a3b2.firebasestorage.app",
  messagingSenderId: "446927338321",
  appId: "1:446927338321:web:5b48cb060b052855b6b170",
  measurementId: "G-RZYE8ZRDSB",
};

// Email yang otomatis jadi admin (sama dengan v17).
export const ADMIN_EMAILS = ["m.hafidzuddin.s@gmail.com"];

const SDK_VERSION = "10.12.5";
const SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION;
const SDK_SCRIPTS = [
  SDK_BASE + "/firebase-app-compat.js",
  SDK_BASE + "/firebase-auth-compat.js",
  SDK_BASE + "/firebase-firestore-compat.js",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFirebase = any;

export interface FirebaseHandles {
  fb: AnyFirebase;
  auth: AnyFirebase;
  db: AnyFirebase;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Firebase hanya bisa dimuat di browser."));
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-fb="' + src + '"]',
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Gagal memuat " + src)),
        );
      }
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.fb = src;
    s.addEventListener("load", () => {
      s.dataset.loaded = "1";
      resolve();
    });
    s.addEventListener("error", () => reject(new Error("Gagal memuat " + src)));
    document.head.appendChild(s);
  });
}

let handlesPromise: Promise<FirebaseHandles> | null = null;

/** Muat SDK (berurutan), inisialisasi app, lalu kembalikan auth & db. Idempoten. */
export function initFirebase(): Promise<FirebaseHandles> {
  if (handlesPromise) return handlesPromise;
  handlesPromise = (async () => {
    // Harus berurutan: app dulu, baru auth & firestore.
    for (const src of SDK_SCRIPTS) {
      // eslint-disable-next-line no-await-in-loop
      await loadScript(src);
    }
    const fb = (window as unknown as { firebase?: AnyFirebase }).firebase;
    if (!fb) throw new Error("Pustaka Firebase gagal dimuat.");
    if (!fb.apps || !fb.apps.length) fb.initializeApp(FIREBASE_CONFIG);
    return { fb, auth: fb.auth(), db: fb.firestore() } as FirebaseHandles;
  })();
  return handlesPromise;
}

/** Terjemahkan kode error Firebase ke pesan berbahasa Indonesia (sama seperti v17). */
export function petaError(e: AnyFirebase): string {
  const c = (e && e.code) || "";
  const m: Record<string, string> = {
    "auth/email-already-in-use": "Email sudah terdaftar. Silakan masuk.",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/weak-password": "Kata sandi terlalu lemah (minimal 6 karakter).",
    "auth/user-not-found": "Akun tidak ditemukan.",
    "auth/wrong-password": "Kata sandi salah.",
    "auth/invalid-credential": "Email atau kata sandi salah.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/network-request-failed":
      "Gagal terhubung. Periksa koneksi internet Anda.",
    "permission-denied": "Akses ditolak oleh aturan keamanan Firestore.",
  };
  return m[c] || (e && e.message) || "Terjadi kesalahan.";
}
