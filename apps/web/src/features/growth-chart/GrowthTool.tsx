"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * GrowthTool - island loader untuk alat Tumbuh Kembang (WHO & CDC).
 *
 * WHY: Alat pertumbuhan v17 sangat interaktif dan imperatif (kalibrasi
 * klik-4-titik pada gambar chart, overlay plotting piksel-akurat, stepper,
 * z-score, persentil CDC/Waterlow, prediksi MPH). Agar hasilnya SAMA PERSIS
 * dengan v17 tanpa risiko divergensi saat ditulis ulang, mesin v17 dijalankan
 * apa adanya di dalam dokumen terisolasi (/public/growth-tool.html) yang
 * dimuat lewat <iframe>. Komponen React ini hanya memuat island itu dan
 * menyesuaikan tingginya (auto-resize via postMessage).
 *
 * Logika klinis murni (z-score) juga diekstrak terpisah + diuji di zscore.ts.
 */
export function GrowthTool() {
  const [tinggi, setTinggi] = useState<number>(1100);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const data = e.data as { __tkHeight?: number } | null;
      if (data && typeof data.__tkHeight === "number" && data.__tkHeight > 0) {
        setTinggi(Math.min(5000, Math.max(400, Math.ceil(data.__tkHeight) + 24)));
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

  return <iframe src={useIslandSrc("/growth-tool.html")} title="Tumbuh Kembang WHO & CDC" style={gaya} />;
}
