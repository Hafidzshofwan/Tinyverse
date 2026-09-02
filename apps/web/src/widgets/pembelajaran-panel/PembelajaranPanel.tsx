"use client";

import { useState, useEffect } from "react";
import { TryoutGrid } from "@/features/tryout";
import { ModulGrid } from "@/features/quiz";
import { KasusGrid } from "@/features/kasus-klinis";
import {
  SidebarIcon,
  ClinicalSvgIcon,
  usePembelajaranMenuTitle,
  useSidebarIconVariants,
} from "@/shared/ui";

type Tab = "tryout" | "kuis" | "kasus";

const TABS: { id: Tab; label: string; iconName: "tryout" | "quiz" | "kasus"; sub: string }[] = [
  {
    id: "tryout",
    label: "Try Out UKNPDPD",
    iconName: "tryout",
    sub: "Simulasi CBT · Ujian Stase",
  },
  {
    id: "kuis",
    label: "Uji Pemahaman",
    iconName: "quiz",
    sub: "MCQ per Modul & Penilaian",
  },
  {
    id: "kasus",
    label: "Berbasis Kasus",
    iconName: "kasus",
    sub: "Studi Kasus Step-by-Step",
  },
];

export function PembelajaranPanel() {
  const [tab, setTab] = useState<Tab>("tryout");
  const [isTryoutActive, setIsTryoutActive] = useState(false);
  const pembelajaranTitle = usePembelajaranMenuTitle();
  const { variants } = useSidebarIconVariants();
  const currentIconVariant = variants.pembelajaran || "v1";

  // Sync tab dari URL hash (#tryout, #kuis, atau #kasus) supaya deep-link bisa bekerja
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    if (hash === "tryout" || hash === "kuis" || hash === "kasus") setTab(hash);
  }, []);

  function gantiTab(id: Tab) {
    setTab(id);
    setIsTryoutActive(false);
    window.history.replaceState(null, "", `#${id}`);
  }

  // Hitung posisi indikator geser tab (3 tab = 33.333% per tab)
  const tabIndex = TABS.findIndex((t) => t.id === tab);
  const indicatorLeft = `calc(${tabIndex * 33.333}% + 4px)`;

  const showHeaderAndTabs = !(tab === "tryout" && isTryoutActive);

  return (
    <div className={`tv-pembelajaran-page${!showHeaderAndTabs ? " tv-pembelajaran-page-fullscreen" : ""}`}>
      {/* ── Header ─────────────────────────────────────────────── */}
      {showHeaderAndTabs && (
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
              style={{ margin: "6px auto 0 auto", maxWidth: "560px" }}
            >
              Pusat persiapan uji kompetensi dokter & penalaran klinis pediatri: simulasi CBT Try Out UKNPDPD, uji pemahaman per modul, dan pembelajaran kasus interaktif.
            </p>
          </div>
        </div>
      )}

      {/* ── Tab switcher ────────────────────────────────────────── */}
      {showHeaderAndTabs && (
        <div className="tv-pembelajaran-tab-wrap tv-3-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tv-pembelajaran-tab${tab === t.id ? " aktif" : ""}`}
              onClick={() => gantiTab(t.id)}
            >
              <span
                className="tv-pembelajaran-tab-icon"
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClinicalSvgIcon name={t.iconName} size={24} />
              </span>
              <span className="tv-pembelajaran-tab-teks">
                <span className="tv-pembelajaran-tab-label">{t.label}</span>
                <span className="tv-pembelajaran-tab-sub">{t.sub}</span>
              </span>
            </button>
          ))}
          {/* Garis indikator bergerak */}
          <div
            className="tv-pembelajaran-tab-indicator tv-3-tabs"
            style={{ left: indicatorLeft }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* ── Konten tab ──────────────────────────────────────────── */}
      <div className="tv-pembelajaran-konten">
        {tab === "tryout" && <TryoutGrid onActiveStateChange={setIsTryoutActive} />}
        {tab === "kuis" && <ModulGrid />}
        {tab === "kasus" && <KasusGrid />}
      </div>
    </div>
  );
}
