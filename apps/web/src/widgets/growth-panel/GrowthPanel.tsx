"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GrowthTool, GrowthTrackingPanel } from "@/features/growth-chart";
import { ScreeningPanel } from "@/widgets/developmental-screening-panel";
import { ScreeningIcon, type IconStyleVariant } from "@/shared/ui";

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
  const [iconVariant, setIconVariant] = useState<IconStyleVariant>("svg-v1");

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
      minWidth: "160px",
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
      {/* Header bar with Icon Style Selector Options */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 10,
          padding: "0 2px",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>
          Desain Ikon SVG:
        </span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "#F8FAFC",
            padding: "4px 6px",
            borderRadius: 999,
            border: "1px solid #E2E8F0",
          }}
        >
          <button
            type="button"
            onClick={() => setIconVariant("svg-v1")}
            title="Desain Vector SVG V1 (Vibrant & Precision)"
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background: iconVariant === "svg-v1" ? "#0A0B5F" : "transparent",
              color: iconVariant === "svg-v1" ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: 11.5,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ✨ SVG V1
          </button>
          <button
            type="button"
            onClick={() => setIconVariant("svg-v2")}
            title="Desain Vector SVG V2 (Soft Badge Style)"
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background: iconVariant === "svg-v2" ? "#0A0B5F" : "transparent",
              color: iconVariant === "svg-v2" ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: 11.5,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🎨 SVG V2
          </button>
          <button
            type="button"
            onClick={() => setIconVariant("svg-v3")}
            title="Desain Vector SVG V3 (Medical Shield Style)"
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background: iconVariant === "svg-v3" ? "#0A0B5F" : "transparent",
              color: iconVariant === "svg-v3" ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: 11.5,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🛡️ SVG V3
          </button>
          <button
            type="button"
            onClick={() => setIconVariant("emoji")}
            title="Kembali ke Emoji Klasik"
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background: iconVariant === "emoji" ? "#0A0B5F" : "transparent",
              color: iconVariant === "emoji" ? "#FFFFFF" : "#D92D20",
              fontWeight: 700,
              fontSize: 11.5,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            😄 Emoji Klasik
          </button>
        </div>
      </div>

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
          <ScreeningIcon id="single" variant={iconVariant} fallbackEmoji="📊" size={18} />
          <span>Kurva WHO &amp; CDC</span>
        </button>

        <button type="button" onClick={() => setTab("longitudinal")} style={tabBtnStyle(tab === "longitudinal")}>
          <ScreeningIcon id="longitudinal" variant={iconVariant} fallbackEmoji="📈" size={18} />
          <span>Pemantauan Longitudinal</span>
        </button>

        <button type="button" onClick={() => setTab("skrining")} style={tabBtnStyle(tab === "skrining")}>
          <ScreeningIcon id="skrining" variant={iconVariant} fallbackEmoji="🧩" size={18} />
          <span>Skrining Perkembangan</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "longitudinal" ? (
        <GrowthTrackingPanel iconVariant={iconVariant} />
      ) : tab === "skrining" ? (
        <ScreeningPanel iconVariant={iconVariant} />
      ) : (
        <GrowthTool />
      )}
    </div>
  );
}
