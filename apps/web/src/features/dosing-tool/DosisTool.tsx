"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * DosisTool - island loader (port verbatim dari Tinyverse v17, halaman page-dosis).
 *
 * WHY: Kalkulator Dosis v17 sangat imperatif (grid obat, filter kategori, pemilihan
 * sediaan, batas dosis tunggal/harian, peringatan keselamatan). Di v17 daftar obat
 * dimuat dari Firestore; agar berjalan OFFLINE dan SAMA PERSIS, dataset obat bawaan
 * (obat.json) disuntikkan langsung ke dokumen island (/dosis-tool.html) menggantikan
 * pemanggilan Firestore. Markup + CSS + skrip v17 dijalankan apa adanya via <iframe>.
 */
export function DosisTool() {
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

  return <iframe src={useIslandSrc("/dosis-tool.html")} title="Dosis Obat" style={gaya} />;
}
