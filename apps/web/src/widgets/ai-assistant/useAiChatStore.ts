"use client";

import { useState, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export const CHAT_STORAGE_KEY = "tv_ai_chat_messages";
export const SESSIONS_STORAGE_KEY = "tv_ai_chat_sessions";
export const ACTIVE_SESSION_ID_KEY = "tv_ai_chat_active_session_id";

export const DEFAULT_AI_WELCOME_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  text: `Selamat datang di **Asisten AI Klinis Terpusat Tinyverse**! 🤖\n\nSaya telah diprogram untuk memahami seluruh modul, kalkulator, pedoman IDAI, dan konten medis di web Tinyverse ini.\n\nAda yang bisa saya bantu terkait dosis obat, terapi cairan, resusitasi PALS, alur tatalaksana, atau panduan alat klinis?`,
  timestamp: new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

export function getStoredSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore error */
  }
  return [];
}

export function saveStoredSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

export function getStoredActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export function saveStoredActiveSessionId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
    }
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

export function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [DEFAULT_AI_WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    /* ignore error */
  }
  return [DEFAULT_AI_WELCOME_MESSAGE];
}

function deriveSessionTitle(msgs: Message[]): string {
  const firstUserMsg = msgs.find((m) => m.sender === "user" && m.text.trim());
  if (firstUserMsg) {
    const clean = firstUserMsg.text.replace(/\n+/g, " ").trim();
    if (clean.length > 35) return clean.slice(0, 35) + "...";
    return clean;
  }
  const dateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const timeStr = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Sesi Klinis (${dateStr} ${timeStr})`;
}

export function saveStoredMessages(msgs: Message[], customTitle?: string) {
  if (typeof window === "undefined") return;
  try {
    // Deduplicate messages by ID
    const uniqueMsgs: Message[] = [];
    const seenIds = new Set<string>();
    for (const m of msgs) {
      if (m && m.id && !seenIds.has(m.id)) {
        seenIds.add(m.id);
        uniqueMsgs.push(m);
      }
    }

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(uniqueMsgs));

    // Synchronize into tv_ai_chat_sessions
    let activeId = getStoredActiveSessionId();
    const sessions = getStoredSessions();

    if (!activeId || !sessions.some((s) => s.id === activeId)) {
      activeId = `session-${Date.now()}`;
      saveStoredActiveSessionId(activeId);
    }

    const nowIso = new Date().toISOString();
    const existingIndex = sessions.findIndex((s) => s.id === activeId);

    let titleToUse = customTitle;
    if (!titleToUse && existingIndex >= 0 && sessions[existingIndex]?.title) {
      titleToUse = sessions[existingIndex].title;
    }
    if (!titleToUse || titleToUse.startsWith("Sesi Klinis (")) {
      titleToUse = deriveSessionTitle(uniqueMsgs);
    }

    const updatedSession: ChatSession = {
      id: activeId,
      title: titleToUse,
      createdAt: (existingIndex >= 0 && sessions[existingIndex]?.createdAt) || nowIso,
      updatedAt: nowIso,
      messages: uniqueMsgs,
    };

    if (existingIndex >= 0) {
      sessions[existingIndex] = updatedSession;
    } else {
      sessions.unshift(updatedSession);
    }

    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

export function clearStoredMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    const activeId = getStoredActiveSessionId();
    if (activeId) {
      const sessions = getStoredSessions().filter((s) => s.id !== activeId);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      saveStoredActiveSessionId(null);
    }
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

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

    const handleUpdate = () => {
      syncFromStorage();
    };

    window.addEventListener("tv_ai_chat_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("tv_ai_chat_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncFromStorage]);

  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    const current = getStoredMessages();
    const next = typeof updater === "function" ? updater(current) : updater;
    saveStoredMessages(next);
  }, []);

  const createNewSession = useCallback(() => {
    if (typeof window === "undefined") return;
    const newId = `session-${Date.now()}`;
    const defaultMsgs = [DEFAULT_AI_WELCOME_MESSAGE];
    const nowIso = new Date().toISOString();

    const newSession: ChatSession = {
      id: newId,
      title: "Sesi Diskusi Baru",
      createdAt: nowIso,
      updatedAt: nowIso,
      messages: defaultMsgs,
    };

    const currentSessions = getStoredSessions();
    currentSessions.unshift(newSession);

    saveStoredActiveSessionId(newId);
    saveStoredSessions(currentSessions);
    saveStoredMessages(defaultMsgs, "Sesi Diskusi Baru");
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    if (typeof window === "undefined") return;
    const allSessions = getStoredSessions();
    const target = allSessions.find((s) => s.id === sessionId);
    if (target) {
      saveStoredActiveSessionId(target.id);
      saveStoredMessages(target.messages, target.title);
    }
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    if (typeof window === "undefined") return;
    const allSessions = getStoredSessions().filter((s) => s.id !== sessionId);
    const activeId = getStoredActiveSessionId();

    if (activeId === sessionId) {
      if (allSessions.length > 0 && allSessions[0]) {
        const nextActive = allSessions[0];
        saveStoredActiveSessionId(nextActive.id);
        saveStoredSessions(allSessions);
        saveStoredMessages(nextActive.messages, nextActive.title);
      } else {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        saveStoredActiveSessionId(null);
        saveStoredSessions([]);
        window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
      }
    } else {
      saveStoredSessions(allSessions);
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

