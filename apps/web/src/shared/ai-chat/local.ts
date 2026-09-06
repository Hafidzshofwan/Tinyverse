"use client";

import type { ChatSession } from "./types";

/**
 * Lapisan penyimpanan lokal (localStorage) untuk sesi chat AI.
 * Kunci dipertahankan sama agar data yang sudah tersimpan tidak hilang.
 */

export const CHAT_STORAGE_KEY = "tv_ai_chat_messages";
export const SESSIONS_STORAGE_KEY = "tv_ai_chat_sessions";
export const ACTIVE_SESSION_ID_KEY = "tv_ai_chat_active_session_id";

function bacaJson<T>(kunci: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const mentah = window.localStorage.getItem(kunci);
    return mentah ? (JSON.parse(mentah) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function bacaSesiLokal(): ChatSession[] {
  return bacaJson<ChatSession[]>(SESSIONS_STORAGE_KEY, []);
}

export function tulisSesiLokal(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch { /* abaikan */ }
}

export function bacaIdAktifLokal(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACTIVE_SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export function tulisIdAktifLokal(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
    else window.localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
  } catch { /* abaikan */ }
}
