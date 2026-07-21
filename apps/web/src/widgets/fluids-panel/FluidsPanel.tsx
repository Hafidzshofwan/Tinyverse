"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { MaintenanceForm } from "@/features/fluid-maintenance";
import { DripForm } from "@/features/fluid-drip";
import { PlanAInfo } from "@/features/rehydration-plan-a";
import { PlanBForm } from "@/features/rehydration-plan-b";
import { PlanCForm } from "@/features/rehydration-plan-c";
import { BurnForm } from "@/features/burn-calculator";

type TabId =
  "rumatan" | "tetes" | "rencanaA" | "rencanaB" | "rencanaC" | "lukabakar";

const TABS: ReadonlyArray<{
  id: TabId;
  label: string;
  detail: string;
  icon: string;
}> = [
  { id: "rumatan", label: "Holliday–Segar", detail: "Rumatan", icon: "🧃" },
  { id: "tetes", label: "Faktor Tetes", detail: "Makro/Mikro", icon: "💉" },
  { id: "rencanaA", label: "Rencana A", detail: "Tanpa Dehidrasi", icon: "🥤" },
  { id: "rencanaB", label: "Rencana B", detail: "Ringan–Sedang", icon: "🩹" },
  { id: "rencanaC", label: "Rencana C", detail: "Dehidrasi Berat", icon: "🩹" },
  { id: "lukabakar", label: "Luka Bakar", detail: "Parkland", icon: "🔥" },
];

const container: CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 4,
};

const circleIcon: CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.6rem",
  flexShrink: 0,
  background: "linear-gradient(135deg, #54C6EB, #2BA9D6)",
  boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "clamp(1.12rem, 2vw, 1.42rem)",
  fontWeight: 850,
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  color: "#4A3728",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "clamp(0.64rem, 1vw, 0.74rem)",
  lineHeight: 1.22,
  fontWeight: 700,
  letterSpacing: "-0.012em",
  color: "#8A7868",
};

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 6,
  background: "#EAF6FB",
  borderRadius: 16,
  padding: 6,
  flexWrap: "wrap",
};

function tabBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    minWidth: 120,
    border: "none",
    background: active ? "#54C6EB" : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: "0.88rem",
    color: active ? "white" : "#8A7868",
    padding: "11px 10px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    lineHeight: 1.3,
    boxShadow: active ? "0 3px 0 #2BA9D6" : "none",
  };
}

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: "26px 22px",
  boxShadow: "0 10px 0 rgba(0,0,0,0.04), 0 12px 30px rgba(84, 198, 235, 0.15)",
  position: "relative",
};

/**
 * Panel Terapi Cairan (React native) — gaya v17.
 * Merakit sub-fitur: Rumatan (Holliday-Segar), Faktor Tetes, Rencana A (kartu statis),
 * Rencana B & C (WHO), Rehidrasi Luka Bakar (pakai ulang BurnForm).
 */
export function FluidsPanel() {
  const [tab, setTab] = useState<TabId>("rumatan");
  return (
    <div style={container}>
      <div style={headRow}>
        <div style={circleIcon} aria-hidden="true">
          💧
        </div>
        <div>
          <h1 style={titleStyle}>Terapi Cairan</h1>
          <p style={subtitleStyle}>
            Rumatan, rehidrasi WHO, faktor tetes, & luka bakar.
          </p>
        </div>
      </div>
      <div role="tablist" aria-label="Modul terapi cairan" style={tabWrap}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            style={tabBtn(tab === t.id)}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <br />
            <small style={{ fontSize: "0.72rem", opacity: 0.9 }}>
              {t.detail}
            </small>
          </button>
        ))}
      </div>
      <section style={cardStyle}>
        {tab === "rumatan" ? <MaintenanceForm /> : null}
        {tab === "tetes" ? <DripForm /> : null}
        {tab === "rencanaA" ? <PlanAInfo /> : null}
        {tab === "rencanaB" ? <PlanBForm /> : null}
        {tab === "rencanaC" ? <PlanCForm /> : null}
        {tab === "lukabakar" ? <BurnForm /> : null}
      </section>
    </div>
  );
}
