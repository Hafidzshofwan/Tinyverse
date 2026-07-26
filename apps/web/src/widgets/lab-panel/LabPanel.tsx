"use client";

import { useEffect, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { ReferenceTab } from "@/features/lab-reference";
import { BloodTab } from "@/features/lab-blood";
import { ElectrolyteTab } from "@/features/lab-electrolyte";
import { AbgForm } from "@/features/abg-analyzer";

type TabId = "rujukan" | "darah" | "elektrolit" | "agd";

const TABS: { id: TabId; label: string }[] = [
  { id: "rujukan", label: "📋 Nilai Rujukan" },
  { id: "darah", label: "🩸 Hitung Darah" },
  { id: "elektrolit", label: "🧪 Koreksi Elektrolit" },
  { id: "agd", label: "🫁 Gas Darah" },
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
  const info = hasProfile
    ? "Pasien aktif \u00b7 Usia: " +
      (profile.usiaBulan != null ? profile.usiaBulan + " bln" : "\u2014") +
      " \u00b7 BB: " +
      (profile.bb != null ? profile.bb + " kg" : "\u2014")
    : "Pasien belum diisi \u2014 buka \ud83d\udc64 Profil Pasien untuk mengisi otomatis.";

  return (
    <div className="tv-page-lab-wrapper">
      <div className="tv-page-lab">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent", color: "#D936A6" }} aria-hidden>
            🔬
          </div>
          <div>
            <h2>Interpretasi Lab Anak</h2>
            <p>
              Nilai rujukan per usia, interpretasi hitung darah & koreksi
              elektrolit.
            </p>
          </div>
        </div>

        <div className="kartu">
          <div className="dx-pasien">{info}</div>
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
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "rujukan" ? <ReferenceTab /> : null}
        {tab === "darah" ? <BloodTab /> : null}
        {tab === "elektrolit" ? <ElectrolyteTab /> : null}
        {tab === "agd" ? (
          <div className="kartu">
            <div className="dx-sub-h">🫁 Analisis Gas Darah (AGD)</div>
            <AbgForm />
          </div>
        ) : null}
      </div>
    </div>
  );
}
