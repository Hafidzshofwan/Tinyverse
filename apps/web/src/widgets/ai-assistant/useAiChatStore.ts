"use client";

import { useState, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const CHAT_STORAGE_KEY = "tv_ai_chat_messages";

export const DEFAULT_AI_WELCOME_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  text: `Selamat datang di **Asisten AI Klinis Terpusat Tinyverse**! 🤖\n\nSaya telah diprogram untuk memahami seluruh modul, kalkulator, pedoman IDAI, dan konten medis di web Tinyverse ini.\n\nAda yang bisa saya bantu terkait dosis obat, terapi cairan, resusitasi PALS, alur tatalaksana, atau panduan alat klinis?`,
  timestamp: new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

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

export function saveStoredMessages(msgs: Message[]) {
  if (typeof window === "undefined") return;
  try {
    // Deduplicate by message ID to prevent duplicate entries
    const uniqueMsgs: Message[] = [];
    const seenIds = new Set<string>();
    for (const m of msgs) {
      if (m && m.id && !seenIds.has(m.id)) {
        seenIds.add(m.id);
        uniqueMsgs.push(m);
      }
    }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(uniqueMsgs));
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

export function clearStoredMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("tv_ai_chat_updated"));
  } catch {
    /* ignore error */
  }
}

export function useAiChatStore() {
  const [messages, setMessagesState] = useState<Message[]>(getStoredMessages);

  useEffect(() => {
    setMessagesState(getStoredMessages());

    const handleUpdate = () => {
      setMessagesState(getStoredMessages());
    };

    window.addEventListener("tv_ai_chat_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("tv_ai_chat_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    const current = getStoredMessages();
    const next = typeof updater === "function" ? updater(current) : updater;
    saveStoredMessages(next);
  }, []);

  const resetChat = useCallback(() => {
    clearStoredMessages();
  }, []);

  return {
    messages,
    setMessages,
    resetChat,
  };
}
