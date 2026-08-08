"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FormattedMessage } from "@/widgets/ai-assistant/FormattedMessage";
import { useAiChatStore, type Message } from "@/widgets/ai-assistant";
import { SidebarIcon, ConfirmationModal } from "@/shared/ui";
import { usePatientProfile } from "@/shared/lib/patient";

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

function ResetIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
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

function SearchIcon({ size = 14, color = "currentColor", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PencilIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function LightbulbIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
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
    <svg className="tv-ai-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

function UserIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const PRESET_TOPICS = [
  {
    title: "Kegawatdaruratan & PALS",
    slug: "darurat",
    prompts: [
      "Berapa dosis Epinefrin resusitasi & atropin untuk anak?",
      "Bagaimana tahapan defibrilasi pada penderita ventrikel fibrilasi anak?",
      "Rangkumkan panduan tatalaksana Syok Anafilaksis pada anak",
    ],
  },
  {
    title: "Dosis Obat & Puyer",
    slug: "dosis",
    prompts: [
      "Hitung dosis Parasetamol sirup untuk anak berat 12.5 kg",
      "Jelaskan perbedaan metode DTM dan DTD pada penulisan resep puyer",
      "Berapa dosis maksimal Ibuprofen per hari untuk anak?",
    ],
  },
  {
    title: "Terapi Cairan & Dehidrasi",
    slug: "cairan",
    prompts: [
      "Bagaimana rumus Holliday-Segar untuk kebutuhan cairan pemeliharaan?",
      "Tatalaksana rehidrasi diare berat menurut IDAI / WHO (Rencana C)",
      "Berapa faktor tetes makro vs mikro untuk pemberian cairan infus?",
    ],
  },
  {
    title: "Skoring & Interpretasi Lab",
    slug: "skoring",
    prompts: [
      "Penjelasan komponen Pediatric Early Warning Score (PEWS)",
      "Cara menilai Glasgow Coma Scale (GCS) pada bayi di bawah 2 tahun",
      "Bagaimana cara membaca Analisis Gas Darah (AGD) dan Anion Gap?",
    ],
  },
];

export default function AiAssistantPage() {
  const {
    messages,
    setMessages,
    sessions,
    activeSessionId,
    saveCurrentSession,
    loadSession,
    deleteSession,
    createNewSession,
    resetChat,
  } = useAiChatStore();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Profil pasien aktif dibaca secara reaktif, sama seperti menu lain
  // (Lab, Profil Pasien, dsb). Dengan ini menu Asisten AI ikut memperbarui
  // diri sendiri saat pasien diganti di menu lain, tanpa perlu refresh halaman.
  const patientData = usePatientProfile();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInputValue, setTitleInputValue] = useState("");
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const filteredSessions = sessions.filter((s) => {
    if (!sessionSearchQuery.trim()) return true;
    const q = sessionSearchQuery.toLowerCase();
    const matchTitle = (s.title || "").toLowerCase().includes(q);
    const matchMsg = s.messages?.some((m) => m.text?.toLowerCase().includes(q));
    return matchTitle || matchMsg;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

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
          contextData: { ...patientData, nama: undefined, namaPasien: undefined },
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
    <div className="tv-ai-wrap">
      {/* Header Halaman Magenta Glassmorphism dengan Dukungan Dark Mode */}
      <div className="tv-ai-header">
        {/* Glow Halus di Sudut */}
        <div className="tv-ai-header-glow" />

        <div className="tv-ai-header-inner">
          <div>
            <div className="tv-ai-badge">
              <SidebarIcon slug="ai-assistant" size={16} />
              <span>TINYVERSE AI CO-PILOT</span>
            </div>
            <h1 className="tv-ai-title">
              <SidebarIcon slug="ai-assistant" size={28} />
              <span>Asisten AI Tinyverse</span>
            </h1>
            <p className="tv-ai-subtitle">
              Pusat Informasi & Co-Pilot Klinis Pediatrik Terintegrasi
            </p>
          </div>

          {patientData?.bb ? (
            <div className="tv-ai-patient-chip">
              <UserIcon size={16} color="var(--tv-accent, #ec4899)" />
              <span>Pasien Aktif: {patientData.nama || "Anak"} (BB: {patientData.bb} kg)</span>
            </div>
          ) : (
            <div className="tv-ai-tip-chip">
              <LightbulbIcon size={16} color="#f59e0b" />
              <span>Tips: Isi Profil Pasien untuk rekomendasi otomatis berdasarkan berat badan.</span>
            </div>
          )}
        </div>
      </div>

      <div className="tv-ai-page-grid">
        {/* Kolom Percakapan Utama */}
        <div className="tv-ai-chat-col">
          {/* Header Panel Chat */}
          <div className="tv-ai-chat-header">
            <div className="tv-ai-flex-8">
              <span className="tv-ai-status-dot" />
              <span className="tv-ai-status-text">
                Koneksi Gemini AI Aktif
              </span>
            </div>

            <div className="tv-ai-flex-8">
              <button
                type="button"
                onClick={() => {
                  saveCurrentSession();
                  showToast("Sesi aktif berhasil disimpan!");
                }}
                className="tv-ai-btn-pill tv-ai-btn-save"
                title="Simpan Sesi Diskusi Saat Ini"
              >
                <SaveIcon size={14} color="#10b981" />
                <span>Simpan Sesi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  createNewSession();
                  showToast("Sesi diskusi baru berhasil dibuat!");
                }}
                className="tv-ai-btn-pill tv-ai-btn-new"
                title="Mulai Sesi Chat Baru"
              >
                <PlusIcon size={14} color="var(--tv-accent, #ec4899)" />
                <span>Sesi Baru</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (messages.length > 0) {
                    setIsResetConfirmOpen(true);
                  } else {
                    resetChat();
                    showToast("Percakapan direset");
                  }
                }}
                className="tv-ai-btn-pill tv-ai-btn-reset"
                title="Reset Percakapan"
              >
                <ResetIcon size={13} color="var(--tv-text-secondary, #64748b)" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMsg && (
            <div className="tv-ai-toast">
              <span>{toastMsg}</span>
              <span className="tv-ai-toast-sub">Tersimpan Otomatis di LocalStorage</span>
            </div>
          )}

          {/* Area Pesan */}
          <div className="tv-ai-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                data-tv-chat-msg
                className={`tv-ai-msg ${m.sender === "user" ? "tv-ai-msg-user" : "tv-ai-msg-ai"}`}
              >
                <div className={`tv-ai-bubble ${m.sender === "user" ? "tv-ai-bubble-user" : "tv-ai-bubble-ai"}`}>
                  <FormattedMessage text={m.text} isUser={m.sender === "user"} />
                </div>

                <div className="tv-ai-msg-meta">
                  <span className="tv-ai-msg-time">
                    {m.timestamp}
                  </span>
                  {m.sender === "ai" && (
                    <button
                      type="button"
                      onClick={() => copyText(m.id, m.text)}
                      className={`tv-ai-copy-btn ${copiedId === m.id ? "tv-ai-copy-btn-done" : ""}`}
                    >
                      {copiedId === m.id ? (
                        <>
                          <CheckIcon size={12} color="#10b981" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        "Salin Jawaban"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="tv-ai-loading-bubble">
                <SpinnerIcon size={18} color="var(--tv-accent, #ec4899)" />
                <span>Memproses analisis klinis & modul TinyVerse...</span>
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
            className={`tv-ai-form ${isFocused || input.trim().length > 0 ? "tv-ai-form-fokus" : ""}`}
          >
            {(isFocused || input.trim().length > 0) && (
              <div className="tv-ai-focus-row">
                <span className="tv-ai-focus-label">
                  <span className="tv-ai-focus-dot" />
                  Mode Fokus Pertanyaan AI Co-Pilot
                </span>
                <span className="tv-ai-char-count">
                  {input.length} karakter
                </span>
              </div>
            )}
            <div className="tv-ai-input-row">
              <input
                type="text"
                placeholder="Tanyakan topik klinis pediatri atau penggunaan alat web..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                className={`tv-ai-text-input ${isFocused || input.trim().length > 0 ? "tv-ai-text-input-fokus" : ""}`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`tv-ai-submit-btn ${isFocused && input.trim() ? "tv-ai-submit-btn-siap" : ""}`}
              >
                Kirim
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Kanan: Topik & Pintasan Modul */}
        <div className="tv-ai-sidebar-col">
          {/* Kotak Sesi Diskusi Klinis Tersimpan */}
          <div className="tv-ai-panel tv-ai-panel-sesi">
            <div className="tv-ai-sesi-header-row">
              <h3 className="tv-ai-sesi-title">
                <FolderIcon size={16} color="var(--tv-accent, #ec4899)" />
                <span className="tv-ai-ellipsis">Sesi Tersimpan</span>
                <span className="tv-ai-count-badge">
                  {sessionSearchQuery.trim() ? `${filteredSessions.length}/${sessions.length}` : sessions.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  createNewSession();
                  showToast("Sesi baru siap!");
                }}
                className="tv-ai-btn-sesi-baru"
              >
                <PlusIcon size={12} color="#ffffff" />
                <span>Sesi Baru</span>
              </button>
            </div>

            {sessions.length > 0 && (
              <div className="tv-ai-search-wrap">
                <input
                  type="text"
                  value={sessionSearchQuery}
                  onChange={(e) => setSessionSearchQuery(e.target.value)}
                  placeholder="Cari riwayat percakapan..."
                  className="tv-ai-search-input"
                />
                <SearchIcon size={14} color="var(--tv-text-secondary, #94a3b8)" className="tv-ai-search-icon" />
                {sessionSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setSessionSearchQuery("")}
                    className="tv-ai-search-clear"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {sessions.length === 0 ? (
              <div className="tv-ai-empty-state">
                Belum ada sesi tersimpan. Percakapan akan otomatis disimpan di localStorage.
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="tv-ai-empty-state">
                Tidak ada sesi yang cocok dengan &quot;{sessionSearchQuery}&quot;.
              </div>
            ) : (
              <div className="tv-ai-sessions-list">
                {filteredSessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  const isEditingThis = editingTitleId === s.id;
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
                      className={`tv-ai-session-card ${isActive ? "tv-ai-session-card-aktif" : ""}`}
                    >
                      <div className="tv-ai-session-row">
                        <div className="tv-ai-session-title-wrap">
                          {isEditingThis ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (titleInputValue.trim()) {
                                  saveCurrentSession(titleInputValue.trim());
                                  setEditingTitleId(null);
                                  showToast("Nama sesi diperbarui!");
                                }
                              }}
                              className="tv-ai-edit-form"
                            >
                              <input
                                type="text"
                                value={titleInputValue}
                                onChange={(e) => setTitleInputValue(e.target.value)}
                                autoFocus
                                className="tv-ai-edit-input"
                              />
                              <button
                                type="submit"
                                className="tv-ai-edit-ok-btn"
                              >
                                OK
                              </button>
                            </form>
                          ) : (
                            <div className="tv-ai-title-row">
                              {isActive && (
                                <span className="tv-ai-aktif-badge">
                                  Aktif
                                </span>
                              )}
                              <span
                                className="tv-ai-session-title"
                                title={s.title}
                              >
                                {s.title}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="tv-ai-session-actions">
                          {!isEditingThis && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTitleId(s.id);
                                setTitleInputValue(s.title);
                              }}
                              className="tv-ai-icon-btn tv-ai-icon-btn-edit"
                              title="Ubah Nama Sesi"
                            >
                              <PencilIcon size={12} color="var(--tv-text-secondary, #64748b)" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSessionToDelete({ id: s.id, title: s.title || "Sesi" });
                            }}
                            className="tv-ai-icon-btn tv-ai-icon-btn-delete"
                            title="Hapus Sesi"
                          >
                            <TrashIcon size={12} color="#ef4444" />
                          </button>
                        </div>
                      </div>

                      <div className="tv-ai-session-footer">
                        <span>{dateFormatted} • {msgCount} pesan</span>
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              loadSession(s.id);
                              showToast(`Sesi "${s.title}" dimuat!`);
                            }}
                            className="tv-ai-lanjutkan-btn"
                          >
                            <span>Lanjutkan</span>
                            <ExternalLinkIcon size={10} color="var(--tv-text-primary, #0a0b5f)" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kotak Preset Topik Pertanyaan */}
          <div className="tv-ai-panel">
            <h3 className="tv-ai-panel-title">
              <LightbulbIcon size={16} color="#f59e0b" />
              <span>Topik & Pertanyaan Cepat</span>
            </h3>

            <div className="tv-ai-topics-col">
              {PRESET_TOPICS.map((topic, idx) => (
                <div key={idx}>
                  <div className="tv-ai-topic-group-title">
                    <SidebarIcon slug={topic.slug} size={16} />
                    <span>{topic.title}</span>
                  </div>
                  <div className="tv-ai-topic-prompts-col">
                    {topic.prompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(p)}
                        disabled={isLoading}
                        className="tv-ai-prompt-btn"
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
          <div className="tv-ai-panel">
            <h3 className="tv-ai-panel-title">
              <ExternalLinkIcon size={16} color="var(--tv-accent, #ec4899)" />
              <span>Akses Cepat Modul Web</span>
            </h3>
            <div className="tv-ai-modul-grid">
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
                  className="tv-ai-modul-link"
                >
                  <SidebarIcon slug={mod.slug} size={18} />
                  <span className="tv-ai-ellipsis">
                    {mod.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetChat();
          showToast("Percakapan direset");
          setIsResetConfirmOpen(false);
        }}
        title="Reset Percakapan?"
        description="Apakah Anda yakin ingin mereset pesan percakapan saat ini? Semua pesan dalam percakapan aktif akan dibersihkan."
        confirmText="Reset Chat"
        cancelText="Batal"
        variant="warning"
      />
    </div>
  );
}

