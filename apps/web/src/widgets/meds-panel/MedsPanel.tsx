"use client";

import { useCallback, useEffect, useState } from "react";
import { SidebarIcon } from "@/shared/ui";
import { DosingPanel } from "@/widgets/dosing-panel";
import { PuyerPanel } from "@/widgets/puyer-panel";

/**
 * Widget: menu gabungan Obat & Racik Puyer.
 *
 * Dua alat yang tadinya berdiri sebagai menu terpisah kini berbagi satu rute
 * dengan sepasang tab. Isi kedua alat TIDAK diubah sama sekali; keduanya tetap
 * dipanggil lewat widget aslinya, dan masing-masing sudah membawa judul serta
 * tata letaknya sendiri. Karena itu panel ini sengaja tidak menambah header,
 * supaya tidak muncul dua judul bertumpuk.
 *
 * Pola tab meniru LabPanel apa adanya: .segmented-toggle berisi .segmented-btn
 * di dalam .kartu, dan tab dibaca dari window.location.search, bukan
 * useSearchParams, agar halaman tidak terpaksa jatuh ke render sisi klien.
 */

type TabId = "dosis" | "puyer";

function adalahTab(nilai: string | null): nilai is TabId {
  return nilai === "dosis" || nilai === "puyer";
}

export function MedsPanel() {
  const [tab, setTab] = useState<TabId>("dosis");

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
          if (href.includes("tab=puyer") || href.includes("/preview/puyer") || anchor.includes("puyer")) {
            setTab("puyer");
          } else if (href.includes("tab=dosis") || href.includes("/preview/dosing") || anchor.includes("dosis")) {
            setTab("dosis");
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
    <div className="tv-page-obat-wrapper">
      <div className="tv-page-obat">
        <div className="kartu">
          <div className="segmented-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "dosis"}
              className={"segmented-btn" + (tab === "dosis" ? " aktif" : "")}
              onClick={() => pilihTab("dosis")}
            >
              <SidebarIcon slug="dosis" size={20} />
              <span>Dosis Obat</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "puyer"}
              className={"segmented-btn" + (tab === "puyer" ? " aktif" : "")}
              onClick={() => pilihTab("puyer")}
            >
              <SidebarIcon slug="puyer" size={20} />
              <span>Racik Puyer</span>
            </button>
          </div>
        </div>

        {tab === "dosis" ? <DosingPanel /> : null}
        {tab === "puyer" ? <PuyerPanel /> : null}
      </div>
    </div>
  );
}
