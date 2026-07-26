"use client";

import { useEffect, useState } from "react";
import { MaintenanceForm } from "@/features/fluid-maintenance";
import { DripForm } from "@/features/fluid-drip";
import { BurnForm } from "@/features/burn-calculator";
import { WhoPanel } from "@/features/rehydration-who";

type MainTab = "holliday" | "who" | "burn" | "drip";

const MAINTABS: ReadonlyArray<{ id: MainTab; icon: React.ReactNode; label: string }> = [
  {
    id: "holliday",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
        <path d="M8 3H16V6H8V3Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <path d="M7 6H17L19 20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20L7 6Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
        <path d="M7 13H17" stroke="#0284C7" strokeWidth="1.5" />
      </svg>
    ),
    label: "Holliday–Segar",
  },
  {
    id: "who",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
        <path d="M12 3C12 3 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 12 3 12 3Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
        <path d="M12 10V16M9 13H15" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    label: "Rehidrasi WHO",
  },
  {
    id: "burn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
        <path d="M12 3C12 3 17 8 17 13C17 16.5 14.5 19 12 19C9.5 19 7 16.5 7 13C7 8 12 3 12 3Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
        <path d="M12 9C12 9 14.5 12 14.5 14.5C14.5 16 13.5 17 12 17C10.5 17 9.5 16 9.5 14.5C9.5 12 12 9 12 9Z" fill="#EF4444" />
      </svg>
    ),
    label: "Rehidrasi Luka Bakar",
  },
  {
    id: "drip",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
        <path d="M12 3V10M12 10C10.3 10 9 11.3 9 13C9 15.5 12 19 12 19C12 19 15 15.5 15 13C15 11.3 13.7 10 12 10Z" stroke="#0284C7" strokeWidth="1.5" fill="#7DD3FC" />
        <circle cx="12" cy="13" r="1.5" fill="#0369A1" />
      </svg>
    ),
    label: "Faktor Tetes",
  },
];

const SUBTITLE: Record<MainTab, string> = {
  holliday: "Holliday–Segar (estimasi cairan rumatan)",
  who: "Rencana A, B, dan C untuk diare",
  burn: "Parkland + Lund-Browder untuk luka bakar",
  drip: "Hitung tetesan cairan infus",
};

export function FluidsPanel() {
  const [tab, setTab] = useState<MainTab>("holliday");

  useEffect(() => {
    function evaluateTab() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as MainTab | null;
      if (tabParam && ["holliday", "who", "burn", "drip"].includes(tabParam)) {
        setTab(tabParam);
        return;
      }
      try {
        const rawTarget = sessionStorage.getItem("tv_search_target");
        if (rawTarget) {
          const parsed = JSON.parse(rawTarget);
          const anchor = String(parsed.anchor || "").toLowerCase();
          const href = String(parsed.href || "").toLowerCase();
          if (href.includes("tab=who") || anchor.includes("who") || anchor.includes("rehidrasi")) setTab("who");
          else if (href.includes("tab=burn") || anchor.includes("burn") || anchor.includes("luka bakar")) setTab("burn");
          else if (href.includes("tab=drip") || anchor.includes("drip") || anchor.includes("faktor tetes")) setTab("drip");
          else if (href.includes("tab=holliday") || anchor.includes("holliday")) setTab("holliday");
        }
      } catch (error) {
        console.error(error);
      }
    }

    evaluateTab();
    window.addEventListener("hashchange", evaluateTab);
    return () => window.removeEventListener("hashchange", evaluateTab);
  }, []);

  return (
    <div className="tv-page-cairan-wrapper">
      <style>{`
        html body .tv-page-cairan .judul-section .ikon-bulat {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" aria-hidden="true" style={{ background: "transparent", boxShadow: "none" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#E0F2FE" />
              <rect x="7" y="5" width="10" height="12" rx="2" fill="#7DD3FC" fillOpacity="0.5" stroke="#0284C7" strokeWidth="1.8" />
              <path d="M10 3H14V5H10V3Z" fill="#0369A1" />
              <path d="M12 17V20M12 22C12.6 22 13 21.6 13 21C13 20.4 12 19.5 12 19.5C12 19.5 11 20.4 11 21C11 21.6 11.4 22 12 22Z" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" fill="#0284C7" />
              <line x1="9" y1="9" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
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
