"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { PlanAInfo } from "@/features/rehydration-plan-a";
import { PlanBForm } from "@/features/rehydration-plan-b";
import { PlanCForm } from "@/features/rehydration-plan-c";

type WhoTab = "a" | "b" | "c";

const WHO_TABS: ReadonlyArray<{
  id: WhoTab;
  icon: string;
  label: string;
  detail: string;
  activeColor: string;
}> = [
  {
    id: "a",
    icon: "🥤",
    label: "Rencana A",
    detail: "Tanpa Dehidrasi",
    activeColor: "#22C7A7",
  },
  {
    id: "b",
    icon: "🩹",
    label: "Rencana B",
    detail: "Ringan–Sedang",
    activeColor: "#F9D85C",
  },
  {
    id: "c",
    icon: "🩹",
    label: "Rencana C",
    detail: "Dehidrasi Berat",
    activeColor: "#E63946",
  },
];

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  position: "relative",
  marginBottom: 14,
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

function tabBtn(active: boolean, activeColor: string): CSSProperties {
  return {
    flex: 1,
    minWidth: 120,
    border: "none",
    borderRadius: 999,
    background: active ? activeColor : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: "0.88rem",
    color: active ? "#0A0B4F" : "rgba(10, 11, 95, 0.62)",
    padding: "11px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    lineHeight: 1.3,
    boxShadow: active ? "0 10px 22px rgba(10, 11, 95, 0.18)" : "none",
  };
}

/**
 * Sub-panel Rehidrasi WHO dengan tab Rencana A/B/C — gaya v17.
 */
export function WhoPanel() {
  const [tab, setTab] = useState<WhoTab>("a");
  return (
    <div>
      <div style={cardStyle}>
        <div role="tablist" aria-label="Rencana rehidrasi WHO" style={tabWrap}>
          {WHO_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              style={tabBtn(tab === t.id, t.activeColor)}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
              <br />
              <small style={{ fontSize: "0.72rem", opacity: 0.9 }}>
                {t.detail}
              </small>
            </button>
          ))}
        </div>
      </div>

      {tab === "a" ? <PlanAInfo /> : null}
      {tab === "b" ? <PlanBForm /> : null}
      {tab === "c" ? <PlanCForm /> : null}
    </div>
  );
}
