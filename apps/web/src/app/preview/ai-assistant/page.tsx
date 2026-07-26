"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FormattedMessage } from "@/widgets/ai-assistant/FormattedMessage";
import { useAiChatStore, type Message } from "@/widgets/ai-assistant";
import { SidebarIcon } from "@/shared/ui";

const PRESET_TOPICS = [
  {
    title: "🚨 Kegawatdaruratan & PALS",
    prompts: [
      "Berapa dosis Epinefrin resusitasi & atropin untuk anak?",
      "Bagaimana tahapan defibrilasi pada penderita ventrikel fibrilasi anak?",
      "Rangkumkan panduan tatalaksana Syok Anafilaksis pada anak",
    ],
  },
  {
    title: "💊 Dosis Obat & Puyer",
    prompts: [
      "Hitung dosis Parasetamol sirup untuk anak berat 12.5 kg",
      "Jelaskan perbedaan metode DTM dan DTD pada penulisan resep puyer",
      "Berapa dosis maksimal Ibuprofen per hari untuk anak?",
    ],
  },
  {
    title: "💧 Terapi Cairan & Dehidrasi",
    prompts: [
      "Bagaimana rumus Holliday-Segar untuk kebutuhan cairan pemeliharaan?",
      "Tatalaksana rehidrasi diare berat menurut IDAI / WHO (Rencana C)",
      "Berapa faktor tetes makro vs mikro untuk pemberian cairan infus?",
    ],
  },
  {
    title: "📊 Skoring & Interpretasi Lab",
    prompts: [
      "Penjelasan komponen Pediatric Early Warning Score (PEWS)",
      "Cara menilai Glasgow Coma Scale (GCS) pada bayi di bawah 2 tahun",
      "Bagaimana cara membaca Analisis Gas Darah (AGD) dan Anion Gap?",
    ],
  },
];

interface PasienData {
  nama?: string;
  bb?: number;
  usiaBulan?: number;
}

export default function AiAssistantPage() {
  const { messages, setMessages, resetChat } = useAiChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PasienData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Muat profil pasien aktif
    try {
      const raw = localStorage.getItem("tv_pasien_aktif");
      if (raw) {
        setPatientData(JSON.parse(raw));
      }
    } catch {
      /* abaikan */
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-10)
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
          contextData: patientData,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal memperoleh respon dari server AI.");
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
      const errText = err instanceof Error ? err.message : "Gagal menghubungkan ke Asisten AI Gemini. Silakan periksa koneksi dan setelan GEMINI_API_KEY.";
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: "ai",
        text: `⚠️ **Terjadi Kesalahan:** ${errText}`,
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
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px", fontFamily: "'Quicksand', sans-serif" }}>
      {/* Header Halaman Magenta Blur Glassmorphism */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "24px 28px",
          borderRadius: "var(--tv-radius-lg, 24px)",
          background: "linear-gradient(135deg, rgba(255, 245, 252, 0.88) 0%, rgba(248, 238, 250, 0.78) 50%, rgba(242, 226, 245, 0.85) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(217, 54, 166, 0.2)",
          boxShadow: "0 8px 32px rgba(10, 11, 95, 0.06)",
          marginBottom: 20,
        }}
      >
        {/* Soft Radial Magenta Glow on Right */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217, 54, 166, 0.3) 0%, rgba(217, 54, 166, 0) 70%)",
            filter: "blur(25px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                border: "1px solid rgba(10, 11, 95, 0.08)",
                boxShadow: "0 2px 6px rgba(10, 11, 95, 0.04)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--tv-navy, #0a0b5f)",
                letterSpacing: "0.5px",
                marginBottom: 10,
              }}
            >
              <SidebarIcon slug="ai-assistant" size={16} />
              <span>TINYVERSE AI CO-PILOT</span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                color: "var(--tv-navy, #0a0b5f)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <SidebarIcon slug="ai-assistant" size={28} />
              <span>Asisten AI Tinyverse</span>
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: "#000000",
                fontWeight: 500,
              }}
            >
              Pusat Informasi & Co-Pilot Klinis Pediatrik Terintegrasi
            </p>
          </div>

          {patientData?.bb ? (
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                backgroundColor: "#ffffff",
                border: "1px solid rgba(217, 54, 166, 0.2)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--tv-navy, #0a0b5f)",
                boxShadow: "0 2px 8px rgba(10, 11, 95, 0.05)",
              }}
            >
              👤 Pasien Aktif: {patientData.nama || "Anak"} (BB: {patientData.bb} kg)
            </div>
          ) : (
            <div
              style={{
                fontSize: 12,
                color: "var(--tv-navy, #0a0b5f)",
                backgroundColor: "rgba(217, 54, 166, 0.08)",
                border: "1px solid rgba(217, 54, 166, 0.18)",
                padding: "6px 14px",
                borderRadius: 14,
                fontWeight: 600,
              }}
            >
              💡 Tips: Isi Profil Pasien untuk rekomendasi otomatis berdasarkan berat badan.
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          gap: 20,
          alignItems: "start",
        }}
        className="tv-ai-page-grid"
      >
        {/* Kolom Percakapan Utama */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            height: 680,
            overflow: "hidden",
          }}
        >
          {/* Header Panel Chat */}
          <div
            style={{
              padding: "12px 18px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                Koneksi Gemini AI Aktif
              </span>
            </div>

            <button
              onClick={resetChat}
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "Quicksand, system-ui, -apple-system, sans-serif",
                color: "#1E293B",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              🔄 Reset Percakapan
            </button>
          </div>

          {/* Area Pesan */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "14px 18px",
                    borderRadius:
                      m.sender === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
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
                        : "0 2px 6px rgba(0,0,0,0.03)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  <FormattedMessage text={m.text} isUser={m.sender === "user"} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 4,
                    padding: "0 4px",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    {m.timestamp}
                  </span>
                  {m.sender === "ai" && (
                    <button
                      onClick={() => copyText(m.id, m.text)}
                      style={{
                        background: "none",
                        border: "none",
                        color: copiedId === m.id ? "#16a34a" : "#64748b",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: 0,
                        fontWeight: 600,
                      }}
                    >
                      {copiedId === m.id ? "✓ Tersalin" : "Salin Jawaban"}
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
                  borderRadius: "18px 18px 18px 4px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: "#0284c7",
                  fontWeight: 600,
                }}
              >
                <span>⏳</span> Memproses analisis klinis & modul TinyVerse...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Pesan */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "16px 20px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Tanyakan topik klinis pediatri atau penggunaan alat web..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: 24,
                border: "1px solid #cbd5e1",
                fontSize: 14,
                outline: "none",
                color: "#0f172a",
                backgroundColor: "#f8fafc",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: "12px 24px",
                borderRadius: 24,
                background:
                  isLoading || !input.trim()
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, var(--tv-navy, #0a0b5f) 0%, var(--tv-magenta, #d936a6) 100%)",
                color: "#ffffff",
                border: "none",
                fontFamily: "'Fredoka', 'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                boxShadow:
                  isLoading || !input.trim()
                    ? "none"
                    : "0 2px 8px rgba(10, 11, 95, 0.25)",
              }}
            >
              Kirim
            </button>
          </form>
        </div>

        {/* Sidebar Kanan: Topik & Pintasan Modul */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Kotak Preset Topik Pertanyaan */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              💡 Topik & Pertanyaan Cepat
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PRESET_TOPICS.map((topic, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 6,
                    }}
                  >
                    {topic.title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {topic.prompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(p)}
                        disabled={isLoading}
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          borderRadius: 8,
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          color: "#334155",
                          fontSize: 12,
                          cursor: "pointer",
                          lineHeight: 1.4,
                          transition: "all 0.15s",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kotak Modul Web Terkait */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              🔗 Akses Cepat Modul Web
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                { href: "/preview/darurat", label: "Mode Darurat", slug: "darurat" },
                { href: "/preview/dosing", label: "Dosis Obat", slug: "dosis" },
                { href: "/preview/fluids", label: "Terapi Cairan", slug: "cairan" },
                { href: "/preview/lab", label: "Interpretasi Lab", slug: "lab" },
                { href: "/preview/skoring", label: "Skor Klinis", slug: "skoring" },
                { href: "/preview/guideline", label: "Guideline IDAI", slug: "protokol" },
              ].map((mod, mIdx) => (
                <Link
                  key={mIdx}
                  href={mod.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    borderRadius: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#0f172a",
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <SidebarIcon slug={mod.slug} size={18} />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {mod.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
