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

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: "rumatan", label: "🧃 Rumatan" },
  { id: "tetes", label: "💉 Faktor Tetes" },
  { id: "rencanaA", label: "🥤 Rencana A" },
  { id: "rencanaB", label: "🩹 Rencana B" },
  { id: "rencanaC", label: "🩹 Rencana C" },
  { id: "lukabakar", label: "🔥 Luka Bakar" },
];

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 18,
  flexWrap: "wrap",
};

function tabBtn(active: boolean): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: 12,
    border: active
      ? "1px solid var(--biru, #2f7fd1)"
      : "1px solid var(--etail-line, #EAF6FB)",
    background: active ? "#DCF3FB" : "var(--putih)",
    color: active ? "#1c4e79" : "var(--teks-lembut)",
    fontWeight: 700,
    cursor: "pointer",
  };
}

/**
 * Panel Terapi Cairan (React native) - pengganti island iframe v17.
 * Merakit sub-fitur: Rumatan (Holliday-Segar), Faktor Tetes, Rencana A (kartu statis),
 * Rencana B & C (WHO), Rehidrasi Luka Bakar (pakai ulang BurnForm).
 * Header dibawa ToolShell di page.tsx (pola GCS/Burn/Alur).
 */
export function FluidsPanel() {
  const [tab, setTab] = useState<TabId>("rumatan");
  return (
    <div>
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
          </button>
        ))}
      </div>
      <section className="tv-card tv-stack">
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
