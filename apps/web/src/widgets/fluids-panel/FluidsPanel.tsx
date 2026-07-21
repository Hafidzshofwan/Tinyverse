"use client";

import { useState } from "react";
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

export function FluidsPanel() {
  const [tab, setTab] = useState<MainTab>("holliday");

  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" aria-hidden="true">
            💧
          </div>
          <div>
            <h2>Terapi Cairan</h2>
            <p>{SUBTITLE[tab]}</p>
          </div>
        </div>

        <div className="kartu">
          <div
            role="tablist"
            aria-label="Modul terapi cairan"
            className="segmented-toggle"
          >
            {MAINTABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`segmented-btn ${tab === t.id ? "aktif" : ""}`}
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
    </div>
  );
}
