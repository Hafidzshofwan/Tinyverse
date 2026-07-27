"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GrowthTool, GrowthTrackingPanel } from "@/features/growth-chart";
import { ScreeningPanel } from "@/widgets/developmental-screening-panel";
import { ScreeningIcon } from "@/shared/ui";

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

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", fontFamily: "Quicksand, sans-serif" }}>
      {/* Tab Switcher */}
      <div
        className="tv-growth-tabs-switcher"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          padding: 6,
          borderRadius: 14,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("single")}
          className={`tv-growth-tab-btn ${tab === "single" ? "active" : ""}`}
        >
          <ScreeningIcon id="single" fallbackEmoji="📊" size={18} />
          <span>Kurva WHO &amp; CDC</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("longitudinal")}
          className={`tv-growth-tab-btn ${tab === "longitudinal" ? "active" : ""}`}
        >
          <ScreeningIcon id="longitudinal" fallbackEmoji="📈" size={18} />
          <span>Pemantauan Longitudinal</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("skrining")}
          className={`tv-growth-tab-btn ${tab === "skrining" ? "active" : ""}`}
        >
          <ScreeningIcon id="skrining" fallbackEmoji="🧩" size={18} />
          <span>Skrining Perkembangan</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "longitudinal" ? (
        <GrowthTrackingPanel iconVariant="svg-v1" />
      ) : tab === "skrining" ? (
        <ScreeningPanel iconVariant="svg-v1" />
      ) : (
        <GrowthTool />
      )}
    </div>
  );
}
