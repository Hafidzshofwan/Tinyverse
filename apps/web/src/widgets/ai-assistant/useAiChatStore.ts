"use client";

/**
 * Hook reaktif untuk sesi chat AI.
 *
 * Sejak refactor sinkronisasi, seluruh logika penyimpanan (localStorage +
 * Firestore) dipindahkan ke shared/ai-chat/store.ts yang mengikuti pola
 * offline-first dari shared/user-settings/store.ts.
 *
 * File ini hanya menyediakan hook React dan mengekspos tipe publik agar
 * komponen lain tidak perlu diubah import-nya.
 */

import { useState, useEffect, useCallback } from "react";
import type { ChatSession, Message } from "@/shared/ai-chat/types";
import { DEFAULT_AI_WELCOME_MESSAGE } from "@/shared/ai-chat/types";
import {
  bacaIdAktif,
  tulisSemuaSesi,
  buatSesiBaru,
  deriveJudul,
  EVENT_CHAT,
} from "@/shared/ai-chat/store";
import {
  bacaSesiLokal,
  CHAT_STORAGE_KEY,
  SESSIONS_STORAGE_KEY,
  ACTIVE_SESSION_ID_KEY,
} from "@/shared/ai-chat/local";

// Re-export tipe agar komponen yang sudah ada tidak perlu mengubah import
export type { Message, ChatSession };
export {
  DEFAULT_AI_WELCOME_MESSAGE,
  CHAT_STORAGE_KEY,
  SESSIONS_STORAGE_KEY,
  ACTIVE_SESSION_ID_KEY,
};

// ── Helpers (tetap diekspor agar AiAssistantWidget tidak perlu diubah) ─────

export function getStoredSessions(): ChatSession[] {
  return bacaSesiLokal();
}

export function getStoredActiveSessionId(): string | null {
  return bacaIdAktif();
}

export function getStoredMessages(): Message[] {
  const sessions = bacaSesiLokal();
  const activeId = bacaIdAktif();
  if (activeId) {
    const sesi = sessions.find((s) => s.id === activeId);
    if (sesi && sesi.messages.length > 0) return sesi.messages;
  }
  if (sessions.length > 0 && sessions[0]) return sessions[0].messages;
  return [DEFAULT_AI_WELCOME_MESSAGE];
}

export function saveStoredSessions(sessions: ChatSession[]): void {
  tulisSemuaSesi(sessions, bacaIdAktif());
}

export function saveStoredActiveSessionId(id: string | null): void {
  tulisSemuaSesi(bacaSesiLokal(), id);
}

export function saveStoredMessages(msgs: Message[], customTitle?: string): void {
  const sessions = bacaSesiLokal();
  let activeId = bacaIdAktif();

  // Deduplicate
  const uniqueMsgs: Message[] = [];
  const seen = new Set<string>();
  for (const m of msgs) {
    if (m && m.id && !seen.has(m.id)) { seen.add(m.id); uniqueMsgs.push(m); }
  }

  if (!activeId || !sessions.some((s) => s.id === activeId)) {
    activeId = "session-" + Date.now();
  }

  const nowIso = new Date().toISOString();
  const existingIndex = sessions.findIndex((s) => s.id === activeId);

  let titleToUse = customTitle;
  if (!titleToUse && existingIndex >= 0 && sessions[existingIndex]?.title) {
    titleToUse = sessions[existingIndex].title;
  }
  if (!titleToUse || titleToUse.startsWith("Sesi Klinis (")) {
    titleToUse = deriveJudul(uniqueMsgs);
  }

  const updated: ChatSession = {
    id: activeId,
    title: titleToUse,
    createdAt: (existingIndex >= 0 && sessions[existingIndex]?.createdAt) || nowIso,
    updatedAt: nowIso,
    messages: uniqueMsgs,
  };

  if (existingIndex >= 0) sessions[existingIndex] = updated;
  else sessions.unshift(updated);

  tulisSemuaSesi(sessions, activeId);
}

export function clearStoredMessages(): void {
  const sessions = bacaSesiLokal();
  const activeId = bacaIdAktif();
  if (activeId) {
    const filtered = sessions.filter((s) => s.id !== activeId);
    tulisSemuaSesi(filtered, null);
  }
}

// ── Hook utama ─────────────────────────────────────────────────────────────

export function useAiChatStore() {
  const [messages, setMessagesState] = useState<Message[]>(getStoredMessages);
  const [sessions, setSessionsState] = useState<ChatSession[]>(getStoredSessions);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(getStoredActiveSessionId);

  const syncFromStorage = useCallback(() => {
    setMessagesState(getStoredMessages());
    setSessionsState(getStoredSessions());
    setActiveSessionIdState(getStoredActiveSessionId());
  }, []);

  useEffect(() => {
    syncFromStorage();
    window.addEventListener(EVENT_CHAT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(EVENT_CHAT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [syncFromStorage]);

  const setMessages = useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      const current = getStoredMessages();
      const next = typeof updater === "function" ? updater(current) : updater;
      saveStoredMessages(next);
    },
    [],
  );

  const createNewSession = useCallback(() => {
    const newSesi = buatSesiBaru();
    const current = bacaSesiLokal();
    current.unshift(newSesi);
    tulisSemuaSesi(current, newSesi.id);
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    const allSessions = bacaSesiLokal();
    const target = allSessions.find((s) => s.id === sessionId);
    if (target) tulisSemuaSesi(allSessions, target.id);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    const allSessions = bacaSesiLokal().filter((s) => s.id !== sessionId);
    const activeId = bacaIdAktif();
    if (activeId === sessionId) {
      const next = allSessions[0] ?? null;
      tulisSemuaSesi(allSessions, next?.id ?? null);
    } else {
      tulisSemuaSesi(allSessions, activeId);
    }
  }, []);

  const saveCurrentSession = useCallback((customTitle?: string) => {
    const currentMsgs = getStoredMessages();
    saveStoredMessages(currentMsgs, customTitle);
    return getStoredActiveSessionId() || "";
  }, []);

  const resetChat = useCallback(() => {
    createNewSession();
  }, [createNewSession]);

  return {
    messages,
    setMessages,
    sessions,
    activeSessionId,
    saveCurrentSession,
    loadSession,
    deleteSession,
    createNewSession,
    resetChat,
  };
}
