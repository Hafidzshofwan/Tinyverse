"use client";

import { useEffect, useRef, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * CairanTool - island loader (port verbatim dari Tinyverse v17, halaman page-cairan).
 *
 * WHY: Terapi Cairan v17 adalah SATU halaman dengan 4 metode (Rumatan Holliday-Segar,
 * Rehidrasi WHO Rencana A/B/C, Rehidrasi Luka Bakar, dan Faktor Tetes). Bagian Luka
 * Bakar memakai PETA TUBUH SVG INTERAKTIF (Lund-Browder) + rumus Parkland yang sangat
 * imperatif. Agar SAMA PERSIS dan gambar interaktifnya tetap utuh, markup + CSS + skrip
 * v17 dijalankan apa adanya di dokumen terisolasi (/cairan-tool.html) via <iframe>.
 *
 * RESPONSIF PERANGKAT (BUNDEL-23): media query DI DALAM iframe membaca lebar IFRAME,
 * bukan lebar perangkat. Karena itu komponen ini (yang berada di dokumen induk dan tahu
 * lebar perangkat asli) mengirim jenis perangkat ke island lewat postMessage
 * {__tkDev:'phone'|'tablet'|'desktop'}. Island memakainya untuk tata letak tablet
 * (isi penuh + 2 kolom) tanpa mengubah tampilan desktop/HP.
 */

type Dev = "phone" | "tablet" | "desktop";

function bandFor(lebar: number): Dev {
  if (lebar < 768) return "phone";
  if (lebar < 1280) return "tablet";
  return "desktop";
}

export function CairanTool() {
  const [tinggi, setTinggi] = useState<number>(1300);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const src = useIslandSrc("/cairan-tool.html");

  // Auto-resize tinggi iframe (postMessage __tkHeight dari island).
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

  // Beri tahu island jenis perangkat berdasar LEBAR PERANGKAT ASLI.
  // Dikirim ulang saat ukuran/orientasi berubah, tanpa memuat ulang iframe
  // (state kalkulator tetap aman).
  useEffect(() => {
    function kirimDev() {
      const el = frameRef.current;
      if (!el || !el.contentWindow) return;
      el.contentWindow.postMessage({ __tkDev: bandFor(window.innerWidth) }, "*");
    }
    kirimDev();
    window.addEventListener("resize", kirimDev);
    return () => window.removeEventListener("resize", kirimDev);
  }, []);

  const gaya: CSSProperties = {
    width: "100%",
    height: tinggi,
    border: "none",
    display: "block",
    background: "transparent",
  };

  return (
    <iframe
      ref={frameRef}
      src={src}
      title="Terapi Cairan"
      style={gaya}
      onLoad={() => {
        frameRef.current?.contentWindow?.postMessage(
          { __tkDev: bandFor(window.innerWidth) },
          "*",
        );
      }}
    />
  );
}
