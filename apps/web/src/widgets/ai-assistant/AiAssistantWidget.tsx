"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormattedMessage } from "./FormattedMessage";
import { useAiChatStore, type Message } from "./useAiChatStore";
import { SidebarIcon, ConfirmationModal } from "@/shared/ui";

function FolderIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SaveIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function PlusIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TrashIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SearchIcon({ size = 14, color = "currentColor", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LightbulbIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function SpinnerIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg className="tv-ai-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function CheckIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MicIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

interface TvSpeechRecognitionResult {
  transcript: string;
}
interface TvSpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: TvSpeechRecognitionResult } };
}
interface TvSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: TvSpeechRecognitionEvent) => void) | null;
  onerror: ((event?: { error?: string }) => void) | null;
  onend: (() => void) | null;
}
type TvSpeechRecognitionConstructor = new () => TvSpeechRecognition;

function getSpeechRecognitionCtor(): TvSpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: TvSpeechRecognitionConstructor;
    webkitSpeechRecognition?: TvSpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

const PRESET_PROMPTS = [
  "Berapa dosis Epinefrin resusitasi & nebulizer anak 10 kg?",
  "Jelaskan alur tatalaksana Kejang Demam menurut IDAI",
  "Bagaimana cara menghitung kebutuhan cairan Holliday-Segar?",
  "Apa kriteria interpretasi Analisis Gas Darah (AGD) pediatrik?",
  "Apa saja komponen Pediatric Early Warning Score (PEWS)?",
  "Rekomendasi vaksinasi IDAI untuk anak usia 2 tahun",
];

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    setMessages,
    sessions,
    activeSessionId,
    saveCurrentSession,
    loadSession,
    deleteSession,
    createNewSession,
    } = useAiChatStore();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSessionsPanel, setShowSessionsPanel] = useState(false);
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isConfirmNewSessionOpen, setIsConfirmNewSessionOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<TvSpeechRecognition | null>(null);

  useEffect(() => {
    setVoiceSupported(!!getSpeechRecognitionCtor());
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  const toggleListening = async () => {
    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) {
      showToast("Input suara tidak didukung di peramban ini.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err: unknown) {
      console.warn("Akses mikrofon ditolak atau gagal:", err);
      showToast("Izin mikrofon ditolak. Izinkan akses mikrofon pada peramban.");
      setIsListening(false);
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = (e: unknown) => {
      setIsListening(false);
      const errObj = e as { error?: string };
      if (errObj?.error === "not-allowed" || errObj?.error === "service-not-allowed") {
        showToast("Izin mikrofon ditolak. Silakan izinkan akses mikrofon pada peramban.");
      } else if (errObj?.error === "no-speech") {
        showToast("Tidak ada suara terdeteksi. Silakan coba bicara lagi.");
      } else {
        showToast("Gagal merekam suara. Periksa izin mikrofon lalu coba lagi.");
      }
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error("Gagal memulai recognition:", err);
      setIsListening(false);
      showToast("Gagal memulai perekaman suara.");
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (!sessionSearchQuery.trim()) return true;
    const q = sessionSearchQuery.toLowerCase();
    const matchTitle = (s.title || "").toLowerCase().includes(q);
    const matchMsg = s.messages?.some((m) => m.text?.toLowerCase().includes(q));
    return matchTitle || matchMsg;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      document.body.classList.add("tv-ai-chat-open");
    } else {
      document.body.classList.remove("tv-ai-chat-open");
    }
    return () => {
      document.body.classList.remove("tv-ai-chat-open");
    };
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    const msgId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userMsg: Message = {
      id: msgId,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput("");
    setIsLoading(true);

    try {
      // Ambil data pasien aktif jika ada
      let contextData: Record<string, unknown> = { activeTab: pathname };
      try {
        const rawPasien = localStorage.getItem("tv_pasien_aktif");
        if (rawPasien) {
          const parsed = JSON.parse(rawPasien) as Record<string, unknown>;
          contextData = { ...contextData, ...parsed }; delete contextData.nama; delete contextData.namaPasien;
        }
      } catch {
        /* abaikan */
      }

      // Kirim riwayat ringkas
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history,
          contextData,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mendapatkan tanggapan dari AI.");
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Gagal terhubung ke Asisten AI. Periksa sambungan internet Anda, lalu coba lagi.";
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: "ai",
        text: `⚠️ **Terjadi Kendala:** ${errText}`,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Tombol Melayang AI FAB (Sembunyi saat Drawer Chat Terbuka) */}
      {!isOpen && (
        <div
          className="tv-ai-fab-container"
          style={{
            position: "fixed",
            bottom: 18,
            right: 84,
            zIndex: 8500,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Floating Label Badge */}
          <div
            className="tv-ai-fab-badge"
            style={{
              padding: "6px 13px",
              borderRadius: 18,
              color: "#ffffff",
              fontFamily: "'Fredoka', 'Quicksand', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(10, 11, 95, 0.25)",
              border: "1px solid rgba(217, 54, 166, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 7,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={() => setIsOpen(true)}
          >
            <span>Asisten AI</span>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#4ade80",
                boxShadow: "0 0 8px #4ade80",
              }}
            />
          </div>

          {/* Circle Button */}
          <button
            type="button"
            id="tvAiFab"
            aria-label="Asisten AI Tinyverse"
            title="Asisten AI Tinyverse"
            onClick={() => setIsOpen(true)}
            style={{
              width: 52,
              height: 52,
              border: 0,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0A0B5F 0%, #D936A6 100%)",
              color: "#ffffff",
              boxShadow: "0 0 0 4px rgba(217, 54, 166, 0.25), 0 8px 24px rgba(10, 11, 95, 0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              flexShrink: 0,
            }}
          >
            <SidebarIcon slug="ai-assistant" size={28} hideBackground />
          </button>
        </div>
      )}

      {/* Drawer / Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(10, 11, 79, 0.35)",
            backdropFilter: "blur(4px)",
            zIndex: 9500,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "stretch",
            fontFamily: "'Quicksand', sans-serif",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="tv-ai-drawer-container"
            style={{
              width: "100%",
              maxWidth: 460,
              backgroundColor: "var(--tv-card, #ffffff)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 24px rgba(10,11,95,0.18)",
              animation: "slideInRight 0.25s ease-out",
            }}
          >
            {/* Header Drawer Glassmorphism Magenta Blur */}
            <div
              className="tv-ai-drawer-header"
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "16px 20px",
                background: "linear-gradient(135deg, rgba(255, 245, 252, 0.92) 0%, rgba(248, 238, 250, 0.85) 60%, rgba(242, 226, 245, 0.9) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: "var(--tv-navy, #0a0b5f)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderBottom: "1px solid rgba(217, 54, 166, 0.15)",
                boxShadow: "0 4px 16px rgba(10, 11, 95, 0.04)",
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {/* Soft Radial Glow */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(217, 54, 166, 0.25) 0%, rgba(217, 54, 166, 0) 70%)",
                  filter: "blur(15px)",
                  pointerEvents: "none",
                }}
              />

              {/* BARIS 1: Judul & Tombol Tutup */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className="tv-ai-drawer-icon-box"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(10, 11, 95, 0.08)",
                      border: "1px solid rgba(10, 11, 95, 0.06)",
                      flexShrink: 0,
                    }}
                  >
                    <SidebarIcon slug="ai-assistant" size={24} />
                  </div>
                  <div
                    className="tv-ai-drawer-title"
                    style={{
                      fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "var(--tv-navy, #0a0b5f)",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Asisten AI Tinyverse
                  </div>
                </div>

                <button
                  type="button"
                  className="tv-ai-drawer-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup Chat AI"
                  title="Tutup Chat"
                  style={{
                    background: "rgba(10, 11, 95, 0.05)",
                    border: "1px solid rgba(10, 11, 95, 0.1)",
                    borderRadius: 10,
                    color: "var(--tv-navy, #0a0b5f)",
                    fontSize: 18,
                    cursor: "pointer",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    transition: "all 0.18s ease",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* BARIS 2: Deskripsi */}
              <div
                className="tv-ai-drawer-desc"
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12,
                  color: "#6e709a",
                  fontWeight: 500,
                  marginTop: -2,
                  lineHeight: 1.4,
                }}
              >
                Informasi Terpusat Seluruh Web
              </div>

              {/* BARIS 3: Fitur Sesi, Simpan, Baru, dan Penuh */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  position: "relative",
                  zIndex: 1,
                  flexWrap: "wrap",
                  marginTop: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowSessionsPanel((v) => !v)}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: showSessionsPanel ? "#ffffff" : "var(--tv-navy, #0a0b5f)",
                    padding: "5px 12px",
                    borderRadius: 20,
                    backgroundColor: showSessionsPanel ? "var(--tv-accent, #ec4899)" : "var(--tv-putih, #ffffff)",
                    border: "1px solid var(--tv-line, rgba(10, 11, 95, 0.15))",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Lihat Sesi Diskusi Tersimpan"
                >
                  <FolderIcon size={14} color={showSessionsPanel ? "#ffffff" : "var(--tv-accent, #ec4899)"} />
                  <span>Sesi ({sessions.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveCurrentSession();
                    showToast("Sesi aktif berhasil disimpan!");
                  }}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: "#059669",
                    padding: "5px 12px",
                    borderRadius: 20,
                    backgroundColor: "var(--tv-putih, #ffffff)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 1px 4px rgba(16, 185, 129, 0.08)",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Simpan Sesi Diskusi Saat Ini"
                >
                  <SaveIcon size={14} color="#059669" />
                  <span>Simpan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (messages.length > 0) {
                      setIsConfirmNewSessionOpen(true);
                    } else {
                      createNewSession();
                      setShowSessionsPanel(false);
                      showToast("Sesi baru dibuat!");
                    }
                  }}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: "var(--tv-magenta, #ec4899)",
                    padding: "5px 12px",
                    borderRadius: 20,
                    backgroundColor: "var(--tv-putih, #ffffff)",
                    border: "1px solid rgba(236, 72, 153, 0.3)",
                    boxShadow: "0 1px 4px rgba(236, 72, 153, 0.08)",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Mulai Sesi Chat Baru"
                >
                  <PlusIcon size={14} color="var(--tv-magenta, #ec4899)" />
                  <span>Baru</span>
                </button>
                <Link
                  href="/preview/ai-assistant"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: "var(--tv-navy, #0a0b5f)",
                    padding: "5px 12px",
                    borderRadius: 20,
                    backgroundColor: "var(--tv-putih, #ffffff)",
                    border: "1px solid var(--tv-line, rgba(10, 11, 95, 0.15))",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title="Buka Halaman Penuh"
                >
                  <span>Penuh</span>
                  <ExternalLinkIcon size={12} color="var(--tv-navy, #0a0b5f)" />
                </Link>
              </div>
            </div>

            {/* Toast Notification Alert */}
            {toastMsg && (
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: 12,
                  fontWeight: 700,
                  borderBottom: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <span>{toastMsg}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>localStorage</span>
              </div>
            )}

            {/* Panel Daftar Sesi Diskusi Tersimpan */}
            {showSessionsPanel && (
              <div
                style={{
                  backgroundColor: "var(--tv-soft, #f8fafc)",
                  borderBottom: "2px solid var(--tv-accent, #ec4899)",
                  padding: "14px 16px",
                  maxHeight: 280,
                  overflowY: "auto",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--tv-teks, #0a0b5f)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FolderIcon size={15} color="var(--tv-accent, #ec4899)" />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Sesi Tersimpan</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--tv-accent, #ec4899)",
                        backgroundColor: "rgba(236, 72, 153, 0.12)",
                        padding: "2px 7px",
                        borderRadius: 10,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {sessionSearchQuery.trim() ? `${filteredSessions.length}/${sessions.length}` : sessions.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (messages.length > 0) {
                        setIsConfirmNewSessionOpen(true);
                      } else {
                        createNewSession();
                        setShowSessionsPanel(false);
                        showToast("Sesi baru dibuat!");
                      }
                    }}
                    style={{
                      fontSize: 11.5,
                      color: "#ffffff",
                      backgroundColor: "var(--tv-accent, #ec4899)",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(236, 72, 153, 0.25)",
                    }}
                  >
                    <PlusIcon size={12} color="#ffffff" />
                    <span>Sesi Baru</span>
                  </button>
                </div>

                {sessions.length > 0 && (
                  <div style={{ marginBottom: 10, position: "relative" }}>
                    <input
                      type="text"
                      value={sessionSearchQuery}
                      onChange={(e) => setSessionSearchQuery(e.target.value)}
                      placeholder="Cari riwayat sesi..."
                      style={{
                        width: "100%",
                        padding: "6px 10px 6px 30px",
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid var(--tv-line, #e2e8f0)",
                        backgroundColor: "var(--tv-putih, #ffffff)",
                        color: "var(--tv-teks, #0f172a)",
                        outline: "none",
                      }}
                    />
                    <SearchIcon size={13} color="var(--tv-soft-teks, #94a3b8)" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    {sessionSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSessionSearchQuery("")}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          fontSize: 11,
                          color: "var(--tv-soft-teks, #94a3b8)",
                          cursor: "pointer",
                          padding: "2px 4px",
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {sessions.length === 0 ? (
                  <div style={{ fontSize: 12, color: "var(--tv-soft-teks, #64748b)", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                    Belum ada sesi diskusi yang tersimpan. Mulai bertanya dan klik &quot;Simpan&quot;!
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div style={{ fontSize: 12, color: "var(--tv-soft-teks, #64748b)", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                    Tidak ada sesi yang cocok dengan &quot;{sessionSearchQuery}&quot;.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filteredSessions.map((s) => {
                      const isActive = s.id === activeSessionId;
                      const msgCount = s.messages ? s.messages.length : 0;
                      const dateFormatted = new Date(s.updatedAt || s.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={s.id}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            backgroundColor: "var(--tv-putih, #ffffff)",
                            border: isActive ? "2px solid var(--tv-accent, #ec4899)" : "1px solid var(--tv-line, #e2e8f0)",
                            boxShadow: isActive ? "0 2px 8px rgba(236, 72, 153, 0.15)" : "0 1px 3px rgba(0, 0, 0, 0.03)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {isActive && (
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    backgroundColor: "var(--tv-accent, #ec4899)",
                                    color: "#ffffff",
                                    padding: "1px 6px",
                                    borderRadius: 10,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Aktif
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "var(--tv-teks, #0a0b5f)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "block",
                                }}
                                title={s.title}
                              >
                                {s.title}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--tv-soft-teks, #64748b)", marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <span>{dateFormatted}</span>
                              <span>•</span>
                              <span>{msgCount} pesan</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => {
                                  loadSession(s.id);
                                  setShowSessionsPanel(false);
                                  showToast(`Sesi "${s.title}" dimuat!`);
                                }}
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "var(--tv-teks, #0f172a)",
                                  backgroundColor: "var(--tv-soft, #f1f5f9)",
                                  border: "1px solid var(--tv-line, #cbd5e1)",
                                  padding: "4px 8px",
                                  borderRadius: 10,
                                  cursor: "pointer",
                                }}
                              >
                                Buka
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSessionToDelete({ id: s.id, title: s.title || "Sesi" });
                              }}
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#ef4444",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                padding: "4px 8px",
                                borderRadius: 10,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title="Hapus Sesi"
                            >
                              <TrashIcon size={14} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pesan-Pesan Percakapan */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                backgroundColor: "var(--tv-soft, #f4f5fa)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`tv-ai-msg ${m.sender === "user" ? "tv-ai-msg-user" : "tv-ai-msg-ai"}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      m.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "12px 16px",
                      borderRadius:
                        m.sender === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      backgroundColor:
                        m.sender === "user" ? "var(--tv-accent, #ec4899)" : "var(--tv-putih, #ffffff)",
                      background:
                        m.sender === "user"
                          ? "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
                          : "var(--tv-putih, #ffffff)",
                      color: m.sender === "user" ? "#ffffff" : "var(--tv-teks, #0a0b4f)",
                      border:
                        m.sender === "user"
                          ? "none"
                          : "1px solid var(--tv-line, rgba(10, 11, 95, 0.09))",
                      boxShadow:
                        m.sender === "user"
                          ? "0 3px 8px rgba(236, 72, 153, 0.3)"
                          : "0 1px 4px rgba(0, 0, 0, 0.05)",
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    <FormattedMessage text={m.text} isUser={m.sender === "user"} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4,
                      padding: "0 4px",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "var(--tv-soft-teks, #94a3b8)" }}>
                      {m.timestamp}
                    </span>
                    {m.sender === "ai" && (
                      <button
                        onClick={() => copyText(m.id, m.text)}
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedId === m.id ? "#16a34a" : "var(--tv-soft-teks, #64748b)",
                          fontSize: 11,
                          cursor: "pointer",
                          padding: 0,
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        {copiedId === m.id ? (
                          <>
                            <CheckIcon size={12} color="#16a34a" />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          "Salin"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "var(--tv-putih, #ffffff)",
                    border: "1px solid var(--tv-line, #e2e8f0)",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#38bdf8",
                    fontWeight: 600,
                  }}
                >
                  <SpinnerIcon size={16} color="var(--tv-accent, #ec4899)" />
                  <span>Menganalisis informasi klinis...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "var(--tv-putih, #ffffff)",
                borderTop: "1px solid var(--tv-line, #e2e8f0)",
                display: "flex",
                gap: 6,
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {PRESET_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  style={{
                    whiteSpace: "nowrap",
                    padding: "6px 12px",
                    borderRadius: 16,
                    backgroundColor: "var(--tv-soft, #f1f5f9)",
                    border: "1px solid var(--tv-line, #cbd5e1)",
                    color: "var(--tv-teks, #334155)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <LightbulbIcon size={14} color="#f59e0b" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--tv-putih, #ffffff)",
                borderTop: "1px solid var(--tv-line, rgba(217, 54, 166, 0.15))",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isFocused || input.trim().length > 0 ? "0 -4px 18px rgba(236, 72, 153, 0.12)" : "none",
              }}
            >
              {(isFocused || input.trim().length > 0) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--tv-teks, #0a0b5f)",
                    fontWeight: 700,
                    padding: "0 4px",
                    animation: "fadeIn 0.2s ease-out",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "var(--tv-accent, #ec4899)",
                        boxShadow: "0 0 6px var(--tv-accent, #ec4899)",
                      }}
                    />
                    Mode Fokus Pertanyaan AI
                  </span>
                  <span style={{ fontSize: 10, color: "var(--tv-soft-teks, #64748b)", fontWeight: 600 }}>
                    {input.length} karakter
                  </span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Tanyakan dosis, panduan, atau isi web..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 20,
                    border: isFocused || input.trim().length > 0
                      ? "1.5px solid var(--tv-accent, #ec4899)"
                      : "1px solid var(--tv-line, #cbd5e1)",
                    fontSize: 14,
                    outline: "none",
                    color: "var(--tv-teks, #0f172a)",
                    backgroundColor: "var(--tv-soft, #ffffff)",
                    boxShadow: isFocused || input.trim().length > 0
                      ? "0 0 0 4px rgba(236, 72, 153, 0.2), 0 4px 18px rgba(0, 0, 0, 0.09)"
                      : "0 1px 3px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    title={isListening ? "Berhenti merekam suara" : "Bicara ke Asisten AI"}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: isListening ? "#ef4444" : "var(--tv-soft, #f1f5f9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      flexShrink: 0,
                      boxShadow: isListening ? "0 0 12px rgba(239, 68, 68, 0.5)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <MicIcon size={18} color={isListening ? "#ffffff" : "var(--tv-accent, #ec4899)"} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 20,
                    background:
                      isLoading || !input.trim()
                        ? "var(--tv-line, #cbd5e1)"
                        : "linear-gradient(135deg, var(--tv-accent, #ec4899) 0%, #db2777 100%)",
                    color: "#ffffff",
                    border: "none",
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor:
                      isLoading || !input.trim() ? "not-allowed" : "pointer",
                    boxShadow: !input.trim()
                      ? "none"
                      : "0 4px 14px rgba(236, 72, 153, 0.35)",
                    transform: isFocused && input.trim() ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) {
            deleteSession(sessionToDelete.id);
            showToast("Sesi dihapus");
            setSessionToDelete(null);
          }
        }}
        title="Hapus Sesi Chat?"
        description={`Apakah Anda yakin ingin menghapus sesi "${sessionToDelete?.title}"? Riwayat percakapan dalam sesi ini akan dihapus permanen.`}
        confirmText="Hapus Sesi"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={isConfirmNewSessionOpen}
        onClose={() => setIsConfirmNewSessionOpen(false)}
        onConfirm={() => {
          createNewSession();
          setShowSessionsPanel(false);
          showToast("Sesi baru dibuat!");
          setIsConfirmNewSessionOpen(false);
        }}
        title="Buat Sesi Baru?"
        description="Percakapan saat ini akan ditutup dan disimpan ke riwayat sesi. Anda akan memulai percakapan baru yang kosong."
        confirmText="Sesi Baru"
        cancelText="Batal"
        variant="warning"
      />
    </>
  );
}
