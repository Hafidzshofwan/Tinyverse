"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GrowthTool, GrowthTrackingPanel } from "@/features/growth-chart";
import { ScreeningPanel, ScreeningIcon } from "@/widgets/developmental-screening-panel";

export function GrowthPanel() {
  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center", color: "#64748B", fontFamily: "Quicksand, sans-serif" }}>Memuat Tumbuh Kembang...</div>}>
      <GrowthPanelInner />
    </Suspense>
  );
}

function GrowthPanelInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"longitudinal" | "single" | "skrining">("single");

  useEffect(() => {
    const t = searchParams ? searchParams.get("tab") : null;
    if (t === "longitudinal" || t === "single" || t === "skrining") {
      setTab(t);
    } else if (t === "kpsp" || t === "developmental") {
      setTab("skrining");
    }
  }, [searchParams]);

  function tabBtnStyle(aktif: boolean) {
    return {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 10,
      border: "none",
      fontWeight: 700,
      fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
      fontSize: "12.5px",
      cursor: "pointer" as const,
      background: aktif ? "#0A0B5F" : "transparent",
      color: aktif ? "#FFFFFF" : "#1E293B",
      boxShadow: aktif ? "0 4px 12px rgba(10,11,95,0.3)" : "none",
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    };
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", fontFamily: "Quicksand, sans-serif" }}>
      {/* Tab Switcher */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          background: "#F1F5F9",
          padding: 6,
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={() => setTab("single")} style={tabBtnStyle(tab === "single")}>
          📊 Kurva WHO &amp; CDC
        </button>

        <button type="button" onClick={() => setTab("longitudinal")} style={tabBtnStyle(tab === "longitudinal")}>
          📈 Pemantauan Longitudinal
        </button>

        <button type="button" onClick={() => setTab("skrining")} style={tabBtnStyle(tab === "skrining")}>
          <ScreeningIcon id="header" variant="svg-v1" size={18} />
          <span>Skrining Perkembangan</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "longitudinal" ? <GrowthTrackingPanel /> : tab === "skrining" ? <ScreeningPanel /> : <GrowthTool />}
    </div>
  );
}
