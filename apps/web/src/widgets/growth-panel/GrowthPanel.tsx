"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { GrowthTool } from "@/features/growth-chart";

const GrowthTrackingPanel = dynamic(
  () => import("@/features/growth-chart").then((m) => m.GrowthTrackingPanel),
  { ssr: false, loading: () => <p style={{ padding: 24, textAlign: "center", color: "#667085" }}>Memuat Pemantauan Longitudinal…</p> }
);

const MchatForm = dynamic(
  () => import("@/features/mchat-r").then((m) => m.MchatForm),
  { ssr: false, loading: () => <p style={{ padding: 24, textAlign: "center", color: "#667085" }}>Memuat Skrining M-CHAT-R…</p> }
);

export function GrowthPanel() {
  const [tab, setTab] = useState<"longitudinal" | "single" | "mchat">("longitudinal");

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

        <button type="button" onClick={() => setTab("mchat")} style={tabBtnStyle(tab === "mchat")}>
          🧩 Skrining M-CHAT-R
        </button>
      </div>

      {/* Tab Content */}
      {tab === "longitudinal" ? <GrowthTrackingPanel /> : tab === "mchat" ? <MchatForm /> : <GrowthTool />}
    </div>
  );
}
