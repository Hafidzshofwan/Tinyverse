"use client";

import { initFirebase } from "@/shared/firebase/firebaseClient";
import type { ChatSession } from "./types";
import { MAKS_SESI } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const KOLEKSI = "userAiChat";

/**
 * Struktur dokumen Firestore: userAiChat/{uid}
 * {
 *   sessions: ChatSession[],   -- array sesi, terbaru di depan, maks MAKS_SESI
 *   activeSessionId: string | null
 * }
 *
 * WHY satu dokumen, bukan sub-koleksi per sesi:
 *   Jumlah sesi per user kecil (maks 20). Satu dokumen = satu read/write,
 *   lebih murah dan lebih sederhana daripada N query per sesi. Ukuran dokumen
 *   Firestore maks 1MB; 20 sesi dengan ~50 pesan masing-masing jauh di bawah.
 */

function normalkan(mentah: Any): { sessions: ChatSession[]; activeSessionId: string | null } {
  const data = mentah || {};
  const sessions = Array.isArray(data.sessions) ? (data.sessions as ChatSession[]) : [];
  const activeSessionId =
    typeof data.activeSessionId === "string" ? data.activeSessionId : null;
  return { sessions, activeSessionId };
}

export async function bacaChatFirestore(
  uid: string,
): Promise<{ sessions: ChatSession[]; activeSessionId: string | null }> {
  try {
    const { db } = await initFirebase();
    const snap = await db.collection(KOLEKSI).doc(uid).get();
    if (!snap.exists) return { sessions: [], activeSessionId: null };
    return normalkan(snap.data());
  } catch {
    return { sessions: [], activeSessionId: null };
  }
}

export async function tulisChatFirestore(
  uid: string,
  sessions: ChatSession[],
  activeSessionId: string | null,
): Promise<void> {
  try {
    const { db } = await initFirebase();
    // Potong bila melebihi batas sebelum disimpan ke cloud
    const dipotong = sessions.slice(0, MAKS_SESI);
    await db.collection(KOLEKSI).doc(uid).set(
      { sessions: dipotong, activeSessionId },
      { merge: false }, // tulis penuh agar tidak ada sesi orphan
    );
  } catch {
    /* offline: biarkan, cache lokal sudah tertulis */
  }
}
