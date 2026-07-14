"use client";

import { useEffect, useState } from "react";

/**
 * Meneruskan target deep-link dari hash halaman induk (#tk=...) ke URL island
 * (?tk=...), sehingga tv-deeplink.js di dalam island dapat auto-scroll &
 * membuka bagian yang tepat. Ikut memperbarui bila hash berubah (mis. mencari
 * lagi saat sudah berada di halaman alat yang sama).
 */
export function useIslandSrc(base: string): string {
  const [src, setSrc] = useState(base);
  useEffect(() => {
    function apply() {
      const h = window.location.hash || "";
      const m = h.match(/[#&]tk=([^&]+)/);
      setSrc(m ? base + "?tk=" + m[1] : base);
    }
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [base]);
  return src;
}
