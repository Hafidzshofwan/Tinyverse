"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * PuyerTool - island loader (port verbatim dari Tinyverse v17, halaman page-puyer).
 *
 * WHY: Racik Puyer v17 memakai basis data obat yang sama (daftarObat) untuk
 * pencarian, preset, rentang dosis, dan cek interaksi. Skripnya berupa IIFE mandiri.
 * Agar SAMA PERSIS dan berjalan OFFLINE, dataset obat bawaan (obat.json) disuntikkan
 * ke dokumen island (/puyer-tool.html) dan markup + CSS + skrip v17 dijalankan apa
 * adanya via <iframe>.
 */
export function PuyerTool() {
  const [tinggi, setTinggi] = useState<number>(1200);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const data = e.data as { __tkHeight?: number } | null;
      if (data && typeof data.__tkHeight === "number" && data.__tkHeight > 0) {
        setTinggi(Math.min(7000, Math.max(400, Math.ceil(data.__tkHeight) + 24)));
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

  return <iframe src={useIslandSrc("/puyer-tool.html")} title="Racik Puyer" style={gaya} />;
}
