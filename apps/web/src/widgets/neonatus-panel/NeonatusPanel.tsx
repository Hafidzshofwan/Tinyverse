"use client";

import { useCallback, useEffect, useState } from "react";
import { TpnNeonatusPanel } from "@/widgets/tpn-neonatus-panel";
import { BilirubinPanel } from "@/widgets/bilirubin-panel";

/**
 * Widget: menu gabungan Tool Neonatus.
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.5C12 2.5 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 12 2.5 12 2.5Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 11V16M10 14H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span>TPN Neonatus</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "bilirubin"}
                className={"segmented-btn" + (tab === "bilirubin" ? " aktif" : "")}
                onClick={() => pilihTab("bilirubin")}
              >
                <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Bilirubin (AAP 2022)</span>
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
