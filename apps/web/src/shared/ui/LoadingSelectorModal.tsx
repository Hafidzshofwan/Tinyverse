"use client";

import React, { useState } from "react";
import {
  LoadingAnimation,
  LOADING_VARIANTS,
  getSavedLoadingVariant,
  setSavedLoadingVariant,
  type LoadingVariant,
} from "./LoadingAnimation";

interface LoadingSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoadingSelectorModal({
  isOpen,
  onClose,
}: LoadingSelectorModalProps) {
  const [activeVariant, setActiveVariant] = useState<LoadingVariant>("pulse");
  const [fullscreenDemoVariant, setFullscreenDemoVariant] =
    useState<LoadingVariant | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setActiveVariant(getSavedLoadingVariant());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSelect(variant: LoadingVariant) {
    setActiveVariant(variant);
    setSavedLoadingVariant(variant);
  }

  function handleTriggerFullscreen(variant: LoadingVariant) {
    setFullscreenDemoVariant(variant);
    setTimeout(() => {
      setFullscreenDemoVariant(null);
    }, 3200);
  }

  return (
    <>
      {/* FULLSCREEN DEMO OVERLAY (IF TRIGGERED) */}
      {fullscreenDemoVariant && (
        <div style={{ position: "relative", zIndex: 999999 }}>
          <LoadingAnimation
            variant={fullscreenDemoVariant}
            fullScreen
            message={`Pratinjau Layar Penuh: ${
              LOADING_VARIANTS.find((v) => v.id === fullscreenDemoVariant)?.name
            }`}
          />
          <button
            type="button"
            onClick={() => setFullscreenDemoVariant(null)}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 1000000,
              background: "#EC4899",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 18px",
              borderRadius: "30px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(236, 72, 153, 0.5)",
            }}
          >
            Tutup Pratinjau (Esc)
          </button>
        </div>
      )}

      {/* MODAL BACKDROP */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99990,
          background: "rgba(10, 11, 40, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        onClick={onClose}
      >
        {/* MODAL CONTAINER */}
        <div
          style={{
            width: "100%",
            maxWidth: "960px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "var(--tv-card, #1E293B)",
            border: "1px solid var(--tv-line, rgba(255, 255, 255, 0.12))",
            borderRadius: "28px",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.15)",
            padding: "28px",
            color: "var(--tv-teks, #F8FAFC)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "20px",
              borderBottom: "1px solid var(--tv-line, rgba(255,255,255,0.08))",
              paddingBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(56, 189, 248, 0.12)",
                  color: "#38BDF8",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                }}
              >
                <span>✦ OPSI ANIMASI LOADING TINYVERSE</span>
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: "0 0 6px 0",
                  color: "var(--tv-teks, #F8FAFC)",
                  letterSpacing: "-0.3px",
                }}
              >
                Pilih Animasi Loading Pilihan Anda
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--tv-soft-teks, #94A3B8)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Di bawah ini adalah 3 opsi animasi loading yang telah dirancang.
                Anda dapat mencoba pratinjau animasi secara langsung dan menguji
                tampilan layar penuh sebelum memutuskannya!
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--tv-teks, #F8FAFC)",
                fontSize: "18px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* 3 CARDS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {LOADING_VARIANTS.map((v, idx) => {
              const isSelected = activeVariant === v.id;
              return (
                <div
                  key={v.id}
                  style={{
                    borderRadius: "22px",
                    background: isSelected
                      ? "rgba(10, 11, 95, 0.4)"
                      : "rgba(15, 23, 42, 0.4)",
                    border: isSelected
                      ? "2px solid #EC4899"
                      : "1px solid var(--tv-line, rgba(255, 255, 255, 0.1))",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(236, 72, 153, 0.3)"
                      : "none",
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    transition: "all 0.25s ease",
                  }}
                >
                  {/* TOP BADGE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: isSelected ? "#EC4899" : "#38BDF8",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Opsi {idx + 1}: {v.tagline}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          background: "#EC4899",
                          color: "#FFF",
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        AKTIF
                      </span>
                    )}
                  </div>

                  {/* MINI LIVE PREVIEW */}
                  <div
                    style={{
                      marginBottom: "14px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: "#0F172A",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <LoadingAnimation
                      variant={v.id}
                      inlineHeight={180}
                      message=""
                    />
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div style={{ marginBottom: "16px", flexGrow: 1 }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: "0 0 6px 0",
                        color: "var(--tv-teks, #F8FAFC)",
                      }}
                    >
                      {v.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--tv-soft-teks, #94A3B8)",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {v.description}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(v.id)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "14px",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        border: "none",
                        background: isSelected
                          ? "linear-gradient(135deg, #EC4899 0%, #D936A6 100%)"
                          : "rgba(56, 189, 248, 0.15)",
                        color: isSelected ? "#FFFFFF" : "#38BDF8",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected ? "✓ Sedang Digunakan" : "Gunakan Animasi Ini"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTriggerFullscreen(v.id)}
                      style={{
                        width: "100%",
                        padding: "8px 14px",
                        borderRadius: "14px",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        background: "transparent",
                        color: "var(--tv-soft-teks, #CBD5E1)",
                      }}
                    >
                      👁 Uji Layar Penuh (3 Detik)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid var(--tv-line, rgba(255, 255, 255, 0.08))",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "var(--tv-soft-teks, #94A3B8)",
              }}
            >
              Pilihan tersimpan otomatis di browser ini.
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: "16px",
                background: "#0A0B5F",
                color: "#FFFFFF",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Selesai &amp; Simpan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
