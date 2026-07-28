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
 * pengguna sungguhan lewat custom token dari server.
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

let sedangMasuk: Promise<boolean> | null = null;

/**
 * Memastikan SDK data sudah masuk sebagai pengguna yang diharapkan.
 *
 * uidDiharapkan WAJIB diperhatikan, bukan sekadar "apakah sudah masuk". Bila
 * hanya keberadaan sesi yang diperiksa, pergantian akun di browser yang sama
 * akan membuat SDK data tetap masuk sebagai akun LAMA, dan data pasien tertulis
 * ke akun yang salah.
 *
 * Aman dipanggil berkali-kali; panggilan serentak menumpang hasil yang sama.
 * Mengembalikan false, tidak melempar. Gagal menyalakan sinkronisasi awan tidak
 * boleh mematikan alat klinis — data tetap tersimpan di localStorage.
 */
export function pastikanAuthData(
  uidDiharapkan?: string | null,
): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  const kini = auth.currentUser;
  if (kini && (!uidDiharapkan || kini.uid === uidDiharapkan)) {
    return Promise.resolve(true);
  }
  if (sedangMasuk) return sedangMasuk;

  sedangMasuk = (async () => {
    /* Identitas milik akun sebelumnya harus dikeluarkan lebih dulu. */
    const basi = auth.currentUser;
    if (basi && uidDiharapkan && basi.uid !== uidDiharapkan) {
      await auth.signOut();
    }

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
