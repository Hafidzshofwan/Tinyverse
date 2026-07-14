"use client";

import { initFirebase } from "@/shared/firebase/firebaseClient";
import type { UserSettingsRepository } from "./repository";
import type { UserSettings } from "./types";
import { DEFAULT_USER_SETTINGS } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/** Ubah data mentah dari Firestore menjadi UserSettings yang aman-tipe. */
function normalkan(mentah: Any): UserSettings {
  const data = mentah || {};
  return {
    favorit: Array.isArray(data.favorit) ? (data.favorit as string[]) : [],
    pemakaian:
      data.pemakaian && typeof data.pemakaian === "object"
        ? (data.pemakaian as Record<string, number>)
        : {},
  };
}

/**
 * Implementasi repository berbasis Firestore, memakai compat SDK yang SUDAH
 * dipakai aplikasi (lihat `shared/firebase/firebaseClient`). Tidak menambah
 * dependency npm baru.
 *
 * Data disimpan pada koleksi `userSettings/{uid}` — SAMA dengan model data pada
 * paket `@tinyverse/data-access`, sehingga bila nanti aplikasi pindah ke SDK
 * modular, adapter cukup ditukar tanpa memindahkan data.
 */
export function buatRepoFirestore(): UserSettingsRepository {
  return {
    async get(uid: string): Promise<UserSettings> {
      const { db } = await initFirebase();
      const snap = await db.collection("userSettings").doc(uid).get();
      if (!snap.exists) return { ...DEFAULT_USER_SETTINGS };
      return normalkan(snap.data());
    },
    async update(
      uid: string,
      patch: Partial<UserSettings>,
    ): Promise<UserSettings> {
      const { db } = await initFirebase();
      const ref = db.collection("userSettings").doc(uid);
      await ref.set(patch, { merge: true });
      const snap = await ref.get();
      return normalkan(snap.data());
    },
  };
}
