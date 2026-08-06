"use client";

import { useCallback, useEffect, useState } from "react";
import { TpnNeonatusPanel } from "@/widgets/tpn-neonatus-panel";
import { BilirubinPanel } from "@/widgets/bilirubin-panel";

/**
 * Widget: menu gabungan Tools Neonatus.
 *
 * Dua alat neonatus (TPN & Bilirubin) yang tadinya berdiri sebagai dua item
 * menu terpisah kini berbagi satu rute dengan sepasang tab. Isi kedua alat
 * TIDAK diubah sama sekali; keduanya tetap dipanggil lewat widget aslinya,
 * dan masing-masing sudah membawa judul serta tata letaknya sendiri. Karena
 * itu panel ini sengaja tidak menambah header, supaya tidak muncul dua judul
 * bertumpuk.
 *
 * Pola tab meniru MedsPanel (Obat & Racik Puyer) apa adanya:
 * .segmented-toggle berisi .segmented-btn di dalam .kartu, dan tab dibaca
 * dari window.location.search, bukan useSearchParams, agar halaman tidak
 * terpaksa jatuh ke render sisi klien.
 */

type TabId = "tpn" | "bilirubin";

function adalahTab(nilai: string | null): nilai is TabId {
  return nilai === "tpn" || nilai === "bilirubin";
}

export function NeonatusPanel() {
  const [tab, setTab] = useState<TabId>("tpn");

  useEffect(() => {
    function evaluateTab() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (adalahTab(tabParam)) {
        setTab(tabParam);
        return;
      }
      try {
        const rawTarget = sessionStorage.getItem("tv_search_target");
        if (rawTarget) {
          const parsed = JSON.parse(rawTarget);
          const anchor = String(parsed.anchor || "").toLowerCase();
          const href = String(parsed.href || "").toLowerCase();
          if (
            href.includes("tab=bilirubin") ||
            href.includes("/preview/bilirubin") ||
            anchor.includes("bilirubin")
          ) {
            setTab("bilirubin");
          } else if (
            href.includes("tab=tpn") ||
            href.includes("/preview/tpn-neonatus") ||
            anchor.includes("tpn")
          ) {
            setTab("tpn");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    evaluateTab();
    window.addEventListener("hashchange", evaluateTab);
    return () => window.removeEventListener("hashchange", evaluateTab);
  }, []);

  const pilihTab = useCallback((next: TabId) => {
    setTab(next);
    if (typeof window === "undefined") return;
    // replaceState, bukan pushState: berpindah tab tidak layak menumpuk riwayat
    // peramban, tetapi URL tetap bisa disalin dan dibagikan.
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url.toString());
  }, []);

  return (
    <div>
      <div className="tv-page-neonatus-tabs-wrapper">
        <div className="tv-page-cairan">
          <div className="kartu">
            <div className="segmented-toggle" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "tpn"}
                className={"segmented-btn" + (tab === "tpn" ? " aktif" : "")}
                onClick={() => pilihTab("tpn")}
              >
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="tabTpnBgGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0284C7" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                      </linearGradient>
                      <linearGradient id="tabTpnFluidGrad" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                      <linearGradient id="tabLipidGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <rect width="38" height="38" rx="10" fill="url(#tabTpnBgGrad)" />
                    <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="9.25" stroke="#60A5FA" strokeWidth="0.8" strokeOpacity="0.5" />
                    <path d="M19 3V5" stroke="#93C5FD" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M17 5H21" stroke="#93C5FD" strokeWidth="1.6" strokeLinecap="round" />
                    <rect x="11" y="7" width="16" height="18" rx="3.5" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="1.4" />
                    <path d="M12 13.5H26V22A3 3 0 0 1 23 25H15A3 3 0 0 1 12 22V13.5Z" fill="url(#tabTpnFluidGrad)" fillOpacity="0.85" />
                    <path d="M19 15.5C17.2 15.5 16 16.8 16 18.2C16 19.8 17.3 21 19 21C20.7 21 22 19.8 22 18.2C22 16.8 20.8 15.5 19 15.5Z" fill="url(#tabLipidGrad)" />
                    <path d="M18.2 16.8C18.2 16.8 17.5 17.5 17.5 18.2" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
                    <rect x="17.5" y="25" width="3" height="3" rx="0.5" fill="#93C5FD" />
                    <path d="M19 28V33C19 34.2 20 35 21.2 35" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="21.2" cy="35" r="0.9" fill="#38BDF8" />
                    <path d="M29 6.5L29.8 8.2L31.5 9L29.8 9.8L29 11.5L28.2 9.8L26.5 9L28.2 8.2L29 6.5Z" fill="#FDE047" />
                  </svg>
                </span>
                <span>Nutrisi Parenteral</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "bilirubin"}
                className={"segmented-btn" + (tab === "bilirubin" ? " aktif" : "")}
                onClick={() => pilihTab("bilirubin")}
              >
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="tabBiliBgGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E1B4B" />
                      </linearGradient>
                      <linearGradient id="tabBluePhototherapyGrad" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.18" />
                      </linearGradient>
                      <linearGradient id="tabBabySkinGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FED7AA" />
                        <stop offset="100%" stopColor="#FDBA74" />
                      </linearGradient>
                    </defs>
                    <rect width="38" height="38" rx="10" fill="url(#tabBiliBgGrad)" />
                    <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="9.25" stroke="#38BDF8" strokeWidth="0.8" strokeOpacity="0.4" />
                    <path d="M10 8L28 8L34 31H4L10 8Z" fill="url(#tabBluePhototherapyGrad)" />
                    <line x1="12" y1="8" x2="8" y2="28" stroke="#38BDF8" strokeWidth="0.7" strokeDasharray="1.5 1.5" opacity="0.7" />
                    <line x1="19" y1="8" x2="19" y2="28" stroke="#7DD3FC" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.85" />
                    <line x1="26" y1="8" x2="30" y2="28" stroke="#38BDF8" strokeWidth="0.7" strokeDasharray="1.5 1.5" opacity="0.7" />
                    <circle cx="15" cy="13" r="0.8" fill="#E0F2FE" />
                    <circle cx="23" cy="16" r="0.8" fill="#E0F2FE" />
                    <circle cx="18" cy="11" r="1" fill="#BAE6FD" />
                    <line x1="19" y1="1" x2="19" y2="3.5" stroke="#64748B" strokeWidth="1.2" />
                    <rect x="8" y="3.5" width="22" height="4.5" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                    <rect x="11" y="5.2" width="16" height="1.3" rx="0.65" fill="#BAE6FD" />
                    <rect x="5" y="30" width="28" height="4" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.8" />
                    <rect x="6" y="28" width="26" height="2.5" rx="1" fill="#F8FAFC" />
                    <circle cx="13.5" cy="25" r="3.2" fill="url(#tabBabySkinGrad)" />
                    <rect x="11.5" y="23.8" width="4.5" height="1.8" rx="0.8" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.5" />
                    <line x1="10.8" y1="24.7" x2="16.2" y2="24.7" stroke="#334155" strokeWidth="0.6" />
                    <ellipse cx="21" cy="25.8" rx="5.5" ry="2.8" fill="url(#tabBabySkinGrad)" />
                    <path d="M19.5 24 C22 24 26 24.8 26 26.8 C25 28.2 21.5 28.2 19 27.5 Z" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="17" cy="25.2" r="0.9" fill="#FCA5A5" />
                  </svg>
                </span>
                <span>Bilirubin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {tab === "tpn" ? <TpnNeonatusPanel /> : null}
      {tab === "bilirubin" ? <BilirubinPanel /> : null}
    </div>
  );
}
