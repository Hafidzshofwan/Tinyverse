"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * LabTool - island loader (port verbatim dari Tinyverse v17).
 *
 * WHY: Halaman ini sangat imperatif (tab, state, kalkulator, timer/interval,
 * localStorage profil pasien). Agar SAMA PERSIS v17 tanpa risiko divergensi,
 * markup + CSS + script v17 dijalankan apa adanya di dokumen terisolasi
 * (/lab-tool.html) yang dimuat lewat <iframe>. Komponen ini hanya memuat island itu
 * dan menyesuaikan tinggi (auto-resize via postMessage).
 */
export function LabTool() {
  const [tinggi, setTinggi] = useState<number>(1200);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const data = e.data as { __tkHeight?: number } | null;
      if (data && typeof data.__tkHeight === "number" && data.__tkHeight > 0) {
        setTinggi(Math.min(6000, Math.max(400, Math.ceil(data.__tkHeight) + 24)));
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const gaya: CSSProperties = {
    width: "100%",
    height: tinggi,
    border: "none",
    display: "block",
    background: "transparent",
  };

  return <iframe src={useIslandSrc("/lab-tool.html")} title="Interpretasi Lab Anak" style={gaya} />;
}
