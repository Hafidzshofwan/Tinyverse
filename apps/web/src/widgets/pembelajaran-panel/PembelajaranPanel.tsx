"use client";

import { useState, useEffect } from "react";
import { ModulGrid } from "@/features/quiz";
import { KasusGrid } from "@/features/kasus-klinis";
import {
  SidebarIcon,
  usePembelajaranMenuTitle,
  useSidebarIconVariants,
} from "@/shared/ui";

type Tab = "kuis" | "kasus";

const TABS: { id: Tab; label: string; icon: string; sub: string }[] = [
  {
    id: "kuis",
    label: "Uji Pemahaman",
    icon: "📝",
    sub: "MCQ per modul · skor tersimpan",
  },
  {
    id: "kasus",
    label: "Berbasis Kasus",
    icon: "🩺",
    sub: "Step-by-step · penjelasan klinis",
  },
];

export function PembelajaranPanel() {
  const [tab, setTab] = useState<Tab>("kuis");
  const pembelajaranTitle = usePembelajaranMenuTitle();
  const { variants } = useSidebarIconVariants();
  const currentIconVariant = variants.pembelajaran || "v1";

  // Sync tab dari URL hash (#kuis atau #kasus) supaya deep-link bisa bekerja
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    if (hash === "kuis" || hash === "kasus") setTab(hash);
  }, []);

  function gantiTab(id: Tab) {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="tv-pembelajaran-page">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="tv-pembelajaran-header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(217,54,166,0.12) 0%, rgba(10,11,95,0.08) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(10,11,95,0.06)",
          }}
        >
          <SidebarIcon
            slug="pembelajaran"
            variant={currentIconVariant}
            size={36}
          />
        </div>
        <div>
          <h1 className="tv-pembelajaran-judul" style={{ margin: 0 }}>
            {pembelajaranTitle.label}
          </h1>
          <p
            className="tv-pembelajaran-sub"
            style={{ margin: "6px auto 0 auto", maxWidth: "520px" }}
          >
            {pembelajaranTitle.currentOption.tagline}
          </p>
        </div>
      </div>

      {/* ── Tab switcher ────────────────────────────────────────── */}
      <div className="tv-pembelajaran-tab-wrap" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tv-pembelajaran-tab${tab === t.id ? " aktif" : ""}`}
            onClick={() => gantiTab(t.id)}
          >
            <span className="tv-pembelajaran-tab-icon" aria-hidden="true">
              {t.icon}
            </span>
            <span className="tv-pembelajaran-tab-teks">
              <span className="tv-pembelajaran-tab-label">{t.label}</span>
              <span className="tv-pembelajaran-tab-sub">{t.sub}</span>
            </span>
          </button>
        ))}
        {/* Garis indikator bergerak */}
        <div
          className="tv-pembelajaran-tab-indicator"
          style={{ left: tab === "kuis" ? "4px" : "calc(50% + 2px)" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Konten tab ──────────────────────────────────────────── */}
      <div className="tv-pembelajaran-konten">
        {tab === "kuis" ? <ModulGrid /> : <KasusGrid />}
      </div>
    </div>
  );
}
