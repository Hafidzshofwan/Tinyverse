"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Halo! Saya **Asisten AI Klinis TinyVerse**. Saya telah mempelajari seluruh modul, kalkulator, pedoman IDAI, dan konten medis di web TinyVerse ini.\n\nAda yang bisa saya bantu terkait dosis obat, terapi cairan, resusitasi PALS, alur tatalaksana, atau panduan alat klinis?",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
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
    }
  }, [messages, isOpen]);

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
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
        id: (Date.now() + 1).toString(),
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
        id: (Date.now() + 1).toString(),
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
      {/* Tombol Melayang AI FAB */}
      <button
        type="button"
        id="tvAiFab"
        aria-label="Asisten AI TinyVerse"
        title="Asisten AI TinyVerse"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 76, // Di sebelah kiri Profil Pasien FAB
          zIndex: 990,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderRadius: 30,
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          transition: "transform 0.2s, boxShadow 0.2s",
        }}
      >
        <span style={{ fontSize: 18 }}>🤖</span>
        <span className="tv-ai-fab-text">Asisten AI</span>
      </button>

      {/* Drawer / Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "stretch",
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
              boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
              animation: "slideInRight 0.25s ease-out",
            }}
          >
            {/* Header Drawer */}
            <div
              style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🤖
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    Asisten AI TinyVerse
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    Informasi Terpusat Seluruh Web
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link
                  href="/preview/ai-assistant"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: 12,
                    color: "#38bdf8",
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: "rgba(56, 189, 248, 0.1)",
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
                    color: "#94a3b8",
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
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                gap: 14,
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
                        m.sender === "user" ? "#0284c7" : "#ffffff",
                      color: m.sender === "user" ? "#ffffff" : "#1e293b",
                      border:
                        m.sender === "user"
                          ? "none"
                          : "1px solid #e2e8f0",
                      boxShadow:
                        m.sender === "user"
                          ? "0 2px 6px rgba(2, 132, 199, 0.2)"
                          : "0 1px 3px rgba(0,0,0,0.04)",
                      fontSize: 14,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.text}
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
                      : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  color: "#ffffff",
                  border: "none",
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
