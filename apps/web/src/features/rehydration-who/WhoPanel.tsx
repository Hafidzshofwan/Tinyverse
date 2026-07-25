"use client";

import { useState } from "react";
import { PlanAInfo } from "@/features/rehydration-plan-a";
import { PlanBForm } from "@/features/rehydration-plan-b";
import { PlanCForm } from "@/features/rehydration-plan-c";

type WhoTab = "a" | "b" | "c";

const WHO_TABS: ReadonlyArray<{
  id: WhoTab;
  label: string;
  detail: string;
}> = [
  { id: "a", label: "Rencana A", detail: "Tanpa Dehidrasi" },
  { id: "b", label: "Rencana B", detail: "Dehidrasi Ringan-Sedang" },
  { id: "c", label: "Rencana C", detail: "Dehidrasi Berat" },
];

/**
 * Sub-panel Rehidrasi WHO dengan tab Rencana A/B/C — gaya v17.
 */
export function WhoPanel() {
  const [tab, setTab] = useState<WhoTab>("a");
  return (
    <div>
      <div className="kartu">
        <div
          role="tablist"
          aria-label="Rencana rehidrasi WHO"
          className="segmented-toggle"
        >
          {WHO_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`segmented-btn ${tab === t.id ? "aktif" : ""}`}
              style={{
                flexDirection: "column",
                gap: "2px",
                padding: "8px 6px",
                lineHeight: 1.25,
              }}
              onClick={() => setTab(t.id)}
            >
              <span>{t.label}</span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                }}
              >
                {t.detail}
              </span>
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
