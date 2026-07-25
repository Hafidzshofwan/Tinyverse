"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GrowthTool } from "@/features/growth-chart";

const GrowthTrackingPanel = dynamic(
  () => import("@/features/growth-chart").then((m) => m.GrowthTrackingPanel),
  { ssr: false, loading: () => <p style={{ padding: 24, textAlign: "center", color: "#667085" }}>Memuat Pemantauan Longitudinal…</p> }
);

export function GrowthPanel() {
  const [tab, setTab] = useState<"longitudinal" | "single">("single");

  useEffect(() => {
    function evaluateTab() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "longitudinal") {
        setTab("longitudinal");
        return;
      } else if (tabParam === "single" || tabParam === "who" || tabParam === "cdc" || tabParam === "kurva") {
        setTab("single");
        return;
      }

      try {
        const rawTarget = sessionStorage.getItem("tv_search_target");
        if (rawTarget) {
          const parsed = JSON.parse(rawTarget);
          const anchor = String(parsed.anchor || "").toLowerCase();
          const href = String(parsed.href || "").toLowerCase();
          if (href.includes("tab=longitudinal") || anchor.includes("longitudinal")) {
            setTab("longitudinal");
          } else if (href.includes("tab=single") || anchor.includes("kurva") || anchor.includes("who") || anchor.includes("gizi")) {
            setTab("single");
          }
        }
      } catch {}
    }

    evaluateTab();
    window.addEventListener("hashchange", evaluateTab);
    return () => window.removeEventListener("hashchange", evaluateTab);
  }, []);

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
        }}
      >
        <button
          type="button"
          onClick={() => setTab("single")}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
            fontSize: "13px",
            cursor: "pointer",
            background: tab === "single" ? "#0A0B5F" : "transparent",
            color: tab === "single" ? "#FFFFFF" : "#1E293B",
            boxShadow: tab === "single" ? "0 4px 12px rgba(10,11,95,0.3)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          📊 Kurva WHO &amp; CDC
        </button>

        <button
          type="button"
          onClick={() => setTab("longitudinal")}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            fontWeight: 700,
            fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
            fontSize: "13px",
            cursor: "pointer",
            background: tab === "longitudinal" ? "#0A0B5F" : "transparent",
            color: tab === "longitudinal" ? "#FFFFFF" : "#1E293B",
            boxShadow: tab === "longitudinal" ? "0 4px 12px rgba(10,11,95,0.3)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          📈 Pemantauan Longitudinal
        </button>
      </div>

      {/* Tab Content */}
      {tab === "longitudinal" ? <GrowthTrackingPanel /> : <GrowthTool />}
    </div>
  );
}
