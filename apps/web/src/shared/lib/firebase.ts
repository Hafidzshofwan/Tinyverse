"use client";

/**
 * Sambungan Firestore untuk DATA PASIEN.
 *
 * SEBELUMNYA berkas ini menunjuk ke project Firebase yang berbeda dari project
 * akun, dan memanggil signInAnonymously. Dua akibatnya: (1) Security Rules di
 * project akun tidak berlaku sama sekali untuk data pasien, dan (2) data pasien
 * ditulis oleh identitas anonim yang tidak berhubungan dengan akun yang login,
 * sehingga tidak ada cara memeriksa siapa pemiliknya.
 *
 * SEKARANG berkas ini memakai project yang sama dengan akun, dan masuk sebagai
 * pengguna sungguhan melalui custom token dari server. Dengan begitu satu
 * berkas Rules melindungi seluruh data, dan pemilik setiap dokumen bisa
 * diperiksa.
 *
 * App diberi nama tersendiri ("tinyverse-data") supaya tidak bertabrakan dengan
 * instance compat SDK yang dipakai halaman login pada project yang sama.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { FIREBASE_CONFIG } from "../firebase/firebaseClient";

const NAMA_APP = "tinyverse-data";

function ambilApp(): FirebaseApp {
  const ada = getApps().find((a) => a.name === NAMA_APP);
  if (ada) return ada;
  try {
    return initializeApp(FIREBASE_CONFIG, NAMA_APP);
  } catch {
    return getApp(NAMA_APP);
  }
}

const app = ambilApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Memastikan SDK data sudah masuk sebagai pengguna yang sama dengan sesi server.
 *
 * Aman dipanggil berkali-kali: bila sudah masuk ia langsung selesai, dan bila
 * ada panggilan yang sedang berjalan panggilan berikutnya menumpang hasil yang
 * sama. Tanpa penjagaan itu, sepuluh komponen yang memulai serentak akan
 * menerbitkan sepuluh token dan sepuluh proses masuk.
 *
 * Mengembalikan false, tidak melempar error. Kegagalan menyalakan sinkronisasi
 * awan tidak boleh mematikan alat klinis — data tetap tersimpan di localStorage.
 */
let sedangMasuk: Promise<boolean> | null = null;

export function pastikanAuthData(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (auth.currentUser) return Promise.resolve(true);
  if (sedangMasuk) return sedangMasuk;

  sedangMasuk = (async () => {
    const res = await fetch("/api/auth/firestore-token", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token?: string };
    if (!data.token) return false;
    await signInWithCustomToken(auth, data.token);
    return true;
  })()
    .catch((err) => {
      console.warn("Sinkronisasi awan tidak aktif:", err);
      return false;
    })
    .finally(() => {
      sedangMasuk = null;
    });

  return sedangMasuk;
}

/** Keluar dari SDK data. Dipanggil saat pengguna keluar dari aplikasi. */
export async function keluarAuthData(): Promise<void> {
  try {
    await auth.signOut();
  } catch {
    /* abaikan */
  }
}
