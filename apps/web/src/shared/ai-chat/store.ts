"use client";

import type { ChatSession, Message } from "./types";
import { DEFAULT_AI_WELCOME_MESSAGE, MAKS_SESI } from "./types";
import {
  bacaSesiLokal,
  tulisSesiLokal,
  bacaIdAktifLokal,
  tulisIdAktifLokal,
} from "./local";
import { bacaChatFirestore, tulisChatFirestore } from "./firestore";

/**
 * Store sesi chat AI — offline-first, mirip pola user-settings/store.ts.
 *
 * Strategi:
 * - Semua baca/tulis langsung ke localStorage (sinkron, cepat).
 * - Setiap perubahan dikirim ke Firestore secara fire-and-forget bila user login.
 * - Saat login, data cloud dimuat; bila cloud kosong tapi lokal ada → migrasi.
 * - Event "tv-ai-chat" dipakai untuk reaktivitas antar-komponen.
 */

export const EVENT_CHAT = "tv-ai-chat";

type Mode = "lokal" | "akun";
let mode: Mode = "lokal";
let uidAktif: string | null = null;

function pancarkan(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_CHAT));
  }
}

// ── Baca ──────────────────────────────────────────────────────────────────

export function bacaSesi(): ChatSession[] {
  return bacaSesiLokal();
}

export function bacaIdAktif(): string | null {
  return bacaIdAktifLokal();
}

// ── Tulis (optimistic + write-through ke Firestore) ────────────────────────

function simpanKeCloud(sessions: ChatSession[], activeId: string | null): void {
  if (mode !== "akun" || !uidAktif) return;
  const uid = uidAktif;
  void tulisChatFirestore(uid, sessions, activeId);
}

export function tulisSemuaSesi(sessions: ChatSession[], activeId: string | null): void {
  // Potong di lokal juga
  const dipotong = sessions.slice(0, MAKS_SESI);
  tulisSesiLokal(dipotong);
  tulisIdAktifLokal(activeId);
  simpanKeCloud(dipotong, activeId);
  pancarkan();
}

// ── Operasi sesi ───────────────────────────────────────────────────────────

export function buatSesiBaru(): ChatSession {
  const nowIso = new Date().toISOString();
  return {
    id: "session-" + Date.now(),
    title: "Sesi Diskusi Baru",
    createdAt: nowIso,
    updatedAt: nowIso,
    messages: [DEFAULT_AI_WELCOME_MESSAGE],
  };
}

export function deriveJudul(msgs: Message[]): string {
  const firstUser = msgs.find((m) => m.sender === "user" && m.text.trim());
  if (firstUser) {
    const clean = firstUser.text.replace(/\n+/g, " ").trim();
    return clean.length > 35 ? clean.slice(0, 35) + "..." : clean;
  }
  const d = new Date();
  return `Sesi Klinis (${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })})`;
}

// ── Sinkronisasi akun ──────────────────────────────────────────────────────

/**
 * Dipanggil saat status login berubah.
 * uid nyata  → mode "akun" (Firestore + localStorage).
 * null       → mode "lokal" saja.
 */
export function setAkunAiChat(uid: string | null): void {
  if (!uid) {
    mode = "lokal";
    uidAktif = null;
    return;
  }
  if (mode === "akun" && uidAktif === uid) return;
  mode = "akun";
  uidAktif = uid;
  void hidrasiDariAkun(uid);
}

async function hidrasiDariAkun(uid: string): Promise<void> {
  const lokal = bacaSesiLokal();
  const { sessions: cloud, activeSessionId: cloudActiveId } = await bacaChatFirestore(uid);

  const cloudKosong = cloud.length === 0;
  const lokalAda = lokal.length > 0;

  if (cloudKosong && lokalAda) {
    // Migrasi sekali: unggah data lokal ke cloud
    await tulisChatFirestore(uid, lokal, bacaIdAktifLokal());
    pancarkan();
  } else if (!cloudKosong) {
    // Gunakan data cloud (lebih up-to-date / dari perangkat lain)
    tulisSesiLokal(cloud);
    tulisIdAktifLokal(cloudActiveId);
    pancarkan();
  }
}
