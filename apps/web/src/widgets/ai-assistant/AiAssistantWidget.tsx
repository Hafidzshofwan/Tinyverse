"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormattedMessage } from "./FormattedMessage";
import { useAiChatStore, type Message } from "./useAiChatStore";
import { SidebarIcon } from "@/shared/ui";

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
  const { messages, setMessages, resetChat } = useAiChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
          contextData = { ...contextData, ...parsed };
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
      const errText = err instanceof Error ? err.message : "Gagal terhubung ke Asisten AI. Pastikan kunci GEMINI_API_KEY terkonfigurasi di Settings > Secrets.";
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
            style={{
              padding: "6px 13px",
              borderRadius: 18,
              backgroundColor: "var(--tv-navy, #0a0b5f)",
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
            style={{
              width: "100%",
              maxWidth: 460,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 24px rgba(10,11,95,0.18)",
              animation: "slideInRight 0.25s ease-out",
            }}
          >
            {/* Header Drawer Glassmorphism Magenta Blur */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "16px 20px",
                background: "linear-gradient(135deg, rgba(255, 245, 252, 0.92) 0%, rgba(248, 238, 250, 0.85) 60%, rgba(242, 226, 245, 0.9) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: "var(--tv-navy, #0a0b5f)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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

              <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
                <div
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
                  }}
                >
                  <SidebarIcon slug="ai-assistant" size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--tv-navy, #0a0b5f)",
                    }}
                  >
                    Asisten AI Tinyverse
                  </div>
                  <div
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 11,
                      color: "#6e709a",
                      fontWeight: 500,
                    }}
                  >
                    Informasi Terpusat Seluruh Web
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                <button
                  type="button"
                  onClick={resetChat}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: "#dc2626",
                    padding: "4px 10px",
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(220, 38, 38, 0.25)",
                    boxShadow: "0 1px 4px rgba(220, 38, 38, 0.08)",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title="Reset Percakapan"
                >
                  🔄 Reset
                </button>
                <Link
                  href="/preview/ai-assistant"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                    fontSize: 12,
                    color: "var(--tv-navy, #0a0b5f)",
                    padding: "4px 10px",
                    borderRadius: 20,
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(10, 11, 95, 0.1)",
                    boxShadow: "0 1px 4px rgba(10, 11, 95, 0.05)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                  title="Buka Halaman Penuh"
                >
                  Penuh ↗
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--tv-navy, #0a0b5f)",
                    fontSize: 22,
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Pesan-Pesan Percakapan */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                backgroundColor: "#f4f5fa",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
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
                        m.sender === "user" ? "var(--tv-navy, #0a0b5f)" : "#ffffff",
                      background:
                        m.sender === "user"
                          ? "linear-gradient(135deg, var(--tv-navy, #0a0b5f) 0%, var(--tv-navy-2, #17186f) 100%)"
                          : "#ffffff",
                      color: m.sender === "user" ? "#ffffff" : "var(--tv-teks, #0a0b4f)",
                      border:
                        m.sender === "user"
                          ? "none"
                          : "1px solid rgba(10, 11, 95, 0.09)",
                      boxShadow:
                        m.sender === "user"
                          ? "0 3px 8px rgba(10, 11, 95, 0.25)"
                          : "0 1px 4px rgba(10, 11, 95, 0.05)",
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
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>
                      {m.timestamp}
                    </span>
                    {m.sender === "ai" && (
                      <button
                        onClick={() => copyText(m.id, m.text)}
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedId === m.id ? "#16a34a" : "#64748b",
                          fontSize: 11,
                          cursor: "pointer",
                          padding: 0,
                          fontWeight: 500,
                        }}
                      >
                        {copiedId === m.id ? "✓ Tersalin" : "Salin"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#0284c7",
                    fontWeight: 600,
                  }}
                >
                  <span className="tv-ai-spinner">⏳</span> Menganalisis
                  informasi klinis...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
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
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  💡 {prompt}
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
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Tanyakan dosis, panduan, atau isi web..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 20,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  color: "#0f172a",
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  padding: "10px 18px",
                  borderRadius: 20,
                  background:
                    isLoading || !input.trim()
                      ? "#cbd5e1"
                      : "linear-gradient(135deg, var(--tv-navy, #0a0b5f) 0%, var(--tv-magenta, #d936a6) 100%)",
                  color: "#ffffff",
                  border: "none",
                  fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor:
                    isLoading || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
