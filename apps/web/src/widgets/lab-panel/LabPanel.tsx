"use client";

import { useEffect, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { SidebarIcon } from "@/shared/ui";
import { ReferenceTab } from "@/features/lab-reference";
import { BloodTab } from "@/features/lab-blood";
import { ElectrolyteTab } from "@/features/lab-electrolyte";
import { AbgForm } from "@/features/abg-analyzer";

type TabId = "rujukan" | "darah" | "elektrolit" | "agd";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "rujukan",
    label: "Nilai Rujukan",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#0D9488" fillOpacity="0.15" stroke="#0D9488" strokeWidth="1.8"/>
        <path d="M9 3H15C15.5523 3 16 3.44772 16 4V6C16 6.55228 15.5523 7 15 7H9C8.44772 7 8 6.55228 8 6V4C8 3.44772 8.44772 3 9 3Z" fill="#0D9488"/>
        <path d="M7 11H13" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 15H11" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16.5" cy="14.5" r="2.5" fill="#F59E0B"/>
        <path d="M15.5 14.5L16.2 15.2L17.5 13.8" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "darah",
    label: "Hitung Darah",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
        <path d="M12 2.5C12 2.5 5 9.5 5 15C5 18.866 8.13401 22 12 22C15.866 22 19 18.866 19 15C19 9.5 12 2.5 12 2.5Z" fill="#E11D48"/>
        <path d="M12 4.5C12 4.5 7 10 7 15C7 17.7614 9.23858 20 12 20C12 20 10 18 10 15C10 12 4.5 12 4.5Z" fill="#FB7185"/>
        <circle cx="15.5" cy="11.5" r="1.5" fill="#FFFFFF" fillOpacity="0.85"/>
        <path d="M9.5 15H14.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 12.5V17.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "elektrolit",
    label: "Koreksi Elektrolit",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
        <path d="M9 3H15M10 3V8L5.2 16.3C4.4 17.7 5.4 19.5 7 19.5H17C18.6 19.5 19.6 17.7 18.8 16.3L14 8V3" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.2 14.5H17.8C18.4 14.5 18.8 15.2 18.5 15.7L17.2 18C16.8 18.6 16.2 19 15.5 19H8.5C7.8 19 7.2 18.6 6.8 18L5.5 15.7C5.2 15.2 5.6 14.5 6.2 14.5Z" fill="#4F46E5"/>
        <circle cx="9.5" cy="11" r="1.3" fill="#38BDF8"/>
        <circle cx="14.5" cy="13" r="1.5" fill="#F59E0B"/>
        <path d="M9 6H11M10 5V7" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13.5 6.5H15.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "agd",
    label: "Gas Darah",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
        <path d="M12 3V12" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 7C9.5 7 6.5 8.5 5.5 11C4.3 14 5 18.5 7.5 19.5C9.5 20.3 11 18.5 11.5 16.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 7C14.5 7 17.5 8.5 18.5 11C19.7 14 19 18.5 16.5 19.5C14.5 20.3 13 18.5 12.5 16.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7.5" cy="14" r="2.2" fill="#38BDF8"/>
        <circle cx="16.5" cy="14" r="2.2" fill="#38BDF8"/>
        <circle cx="12" cy="4" r="2" fill="#0EA5E9"/>
        <path d="M11.2 4C11.2 3.5 11.5 3.2 12 3.2C12.5 3.2 12.8 3.5 12.8 4" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function LabPanel() {
  const profile = usePatientProfile();
  const [tab, setTab] = useState<TabId>("rujukan");

  useEffect(() => {
    function evaluateTab() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as TabId | null;
      if (tabParam && ["rujukan", "darah", "elektrolit", "agd"].includes(tabParam)) {
        setTab(tabParam);
        return;
      }
      try {
        const rawTarget = sessionStorage.getItem("tv_search_target");
        if (rawTarget) {
          const parsed = JSON.parse(rawTarget);
          const anchor = String(parsed.anchor || "").toLowerCase();
          const href = String(parsed.href || "").toLowerCase();
          if (href.includes("tab=agd") || anchor.includes("agd") || anchor.includes("gas darah")) setTab("agd");
          else if (href.includes("tab=elektrolit") || anchor.includes("elektrolit")) setTab("elektrolit");
          else if (href.includes("tab=darah") || anchor.includes("darah") || anchor.includes("hematologi")) setTab("darah");
          else if (href.includes("tab=rujukan") || anchor.includes("rujukan")) setTab("rujukan");
        }
      } catch (error) {
        console.error(error);
      }
    }

    evaluateTab();
    window.addEventListener("hashchange", evaluateTab);
    return () => window.removeEventListener("hashchange", evaluateTab);
  }, []);

  const hasProfile = profile.usiaBulan != null || profile.bb != null;

  return (
    <div className="tv-page-lab-wrapper">
      <div className="tv-page-lab">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }} aria-hidden>
            <SidebarIcon slug="lab" size={38} />
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px" }}>Interpretasi Lab Anak</h2>
            <p style={{ fontSize: "10.24px" }}>
              Nilai rujukan per usia, interpretasi hitung darah & koreksi
              elektrolit.
            </p>
          </div>
        </div>

        <div className="kartu">
          <div className="dx-pasien">
            {hasProfile ? (
              <>
                Pasien aktif &middot; Usia:{" "}
                {profile.usiaBulan != null ? `${profile.usiaBulan} bln` : "\u2014"}{" "}
                &middot; BB:{" "}
                {profile.bb != null ? `${profile.bb} kg` : "\u2014"}
              </>
            ) : (
              <>
                Pasien belum diisi &mdash; buka{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", margin: "0 3px" }}>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>{" "}
                Profil Pasien untuk mengisi otomatis.
              </>
            )}
          </div>
          <div className="segmented-toggle" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={"segmented-btn" + (tab === t.id ? " aktif" : "")}
                onClick={() => setTab(t.id)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === "rujukan" ? <ReferenceTab /> : null}
        {tab === "darah" ? <BloodTab /> : null}
        {tab === "elektrolit" ? <ElectrolyteTab /> : null}
        {tab === "agd" ? (
          <div className="kartu">
            <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16"/>
                <path d="M12 9A5 5 0 0 0 7 4H5a3 3 0 0 0-3 3v7a5 5 0 0 0 5 5h1a4 4 0 0 0 4-4v-6z"/>
                <path d="M12 9a5 5 0 0 1 5-5h2a3 3 0 0 1 3 3v7a5 5 0 0 1-5 5h-1a4 4 0 0 1-4-4v-6z"/>
              </svg>
              Analisis Gas Darah (AGD)
            </div>
            <AbgForm />
          </div>
        ) : null}
      </div>
    </div>
  );
}
