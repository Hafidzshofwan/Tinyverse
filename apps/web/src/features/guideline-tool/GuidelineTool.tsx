"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * GuidelineTool - island loader (port verbatim Tinyverse v17, halaman page-protokol).
 *
 * WHY: Guideline v17 adalah "PDF library" pediatri: galeri kartu + pencarian + filter
 * kategori + tampilan detail (embed PDF) + lightbox alur. Logikanya (TV_GUIDELINE_LIST,
 * renderProtokolGallery, filter, detail) dijalankan apa adanya di dokumen terisolasi
 * (/guideline-tool.html) via <iframe> agar SAMA PERSIS v17. Header judul-section
 * (Guideline Anak) ikut dari dalam island. File PDF diletakkan pengguna di
 * apps/web/public/assets/guidelines/ (item.pdfUrl relatif -> /assets/guidelines/...).
 */
export function GuidelineTool() {
  const [tinggi, setTinggi] = useState<number>(900);

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

  return <iframe src={useIslandSrc("/guideline-tool.html")} title="Guideline Anak" style={gaya} />;
}
