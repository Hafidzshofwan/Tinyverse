"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * NutritionTool - island loader (port verbatim Tinyverse v17, halaman page-nutrisi).
 *
 * WHY: fitur nutrisi versi React sebelumnya tidak pernah ada implementasinya
 * (folder features/nutrition-calculator hilang -> halaman rusak). Agar SAMA PERSIS
 * dengan v17 (header "judul-section" + tab Kalori/Protein & Susu Formula + rumus
 * Holliday-Segar/RDA) dan langsung berfungsi, markup+CSS+skrip v17 dijalankan apa
 * adanya di dokumen terisolasi (/nutrisi-tool.html) via <iframe>. Tinggi menyesuaikan
 * otomatis (postMessage __tkHeight).
 */
export function NutritionTool() {
  const [tinggi, setTinggi] = useState<number>(900);

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

  return <iframe src={useIslandSrc("/nutrisi-tool.html")} title="Kalkulator Nutrisi" style={gaya} />;
}
