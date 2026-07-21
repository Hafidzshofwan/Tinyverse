"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { MaintenanceForm } from "@/features/fluid-maintenance";
import { DripForm } from "@/features/fluid-drip";
import { BurnForm } from "@/features/burn-calculator";
import { WhoPanel } from "@/features/rehydration-who";

type MainTab = "holliday" | "who" | "burn" | "drip";

const MAINTABS: ReadonlyArray<{ id: MainTab; icon: string; label: string }> = [
  { id: "holliday", icon: "🧃", label: "Holliday–Segar" },
  { id: "who", icon: "🩹", label: "Rehidrasi WHO" },
  { id: "burn", icon: "🔥", label: "Rehidrasi Luka Bakar" },
  { id: "drip", icon: "💉", label: "Faktor Tetes" },
];

const SUBTITLE: Record<MainTab, string> = {
  holliday: "Holliday–Segar (estimasi cairan rumatan)",
  who: "Rencana A, B, dan C untuk diare",
  burn: "Parkland + Lund-Browder untuk luka bakar",
  drip: "Hitung tetesan cairan infus",
};

const container: CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 4,
};

const squareIcon: CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.24rem",
  flexShrink: 0,
  background: "linear-gradient(135deg, #E23CA7, #D936A6)",
  boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "clamp(1.12rem, 2vw, 1.42rem)",
  fontWeight: 850,
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  color: "#0A0B5F",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "clamp(0.64rem, 1vw, 0.74rem)",
  lineHeight: 1.22,
  fontWeight: 650,
  letterSpacing: "-0.012em",
  color: "rgba(10, 11, 95, 0.62)",
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  position: "relative",
};

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
  overflow: "visible",
  borderRadius: 28,
  padding: 6,
  background: "transparent",
};

function tabBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    minWidth: 120,
    border: "none",
    borderRadius: 999,
    background: active ? "#0A0B5F" : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: "0.88rem",
    color: active ? "#FFFFFF" : "rgba(10, 11, 95, 0.62)",
    padding: "11px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    lineHeight: 1.3,
    boxShadow: active ? "0 10px 22px rgba(10, 11, 95, 0.18)" : "none",
  };
}

/**
 * Panel Terapi Cairan (React native) — gaya v17.
 */
export function FluidsPanel() {
  const [tab, setTab] = useState<MainTab>("holliday");
  return (
    <div style={container}>
      <div style={headRow}>
        <div style={squareIcon} aria-hidden="true">
          💧
        </div>
        <div>
          <h1 style={titleStyle}>Terapi Cairan</h1>
          <p style={subtitleStyle}>{SUBTITLE[tab]}</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div role="tablist" aria-label="Modul terapi cairan" style={tabWrap}>
          {MAINTABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              style={tabBtn(tab === t.id)}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "holliday" ? <MaintenanceForm /> : null}
      {tab === "drip" ? <DripForm /> : null}
      {tab === "who" ? <WhoPanel /> : null}
      {tab === "burn" ? <BurnForm /> : null}
    </div>
  );
}
