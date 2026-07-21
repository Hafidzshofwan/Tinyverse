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
  { id: "b", label: "Rencana B", detail: "Ringan–Sedang" },
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
      </div>

      {tab === "a" ? <PlanAInfo /> : null}
      {tab === "b" ? <PlanBForm /> : null}
      {tab === "c" ? <PlanCForm /> : null}
    </div>
  );
}
