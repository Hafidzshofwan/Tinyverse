"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * CairanTool - island loader (port verbatim dari Tinyverse v17, halaman page-cairan).
 *
 * WHY: Terapi Cairan v17 adalah SATU halaman dengan 4 metode (Rumatan Holliday-Segar,
 * Rehidrasi WHO Rencana A/B/C, Rehidrasi Luka Bakar, dan Faktor Tetes). Bagian Luka
 * Bakar memakai PETA TUBUH SVG INTERAKTIF (Lund-Browder) + rumus Parkland yang sangat
 * imperatif (klik area -> hitung %TBSA menyesuaikan usia). Agar SAMA PERSIS dan gambar
 * interaktifnya tetap utuh, markup + CSS + skrip v17 dijalankan apa adanya di dokumen
 * terisolasi (/cairan-tool.html) via <iframe>. Komponen ini hanya memuat island itu
 * dan menyesuaikan tinggi otomatis (postMessage).
 */
export function CairanTool() {
  const [tinggi, setTinggi] = useState<number>(1300);

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

  return <iframe src={useIslandSrc("/cairan-tool.html")} title="Terapi Cairan" style={gaya} />;
}
