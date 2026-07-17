"use client";

import { useEffect, useState } from "react";

/**
 * Versi build untuk cache-busting island statis (mis. /growth-tool.html).
 *
 * WHY: file island di /public dimuat lewat <iframe> dengan URL yang TETAP.
 * Akibatnya browser & CDN Vercel menyimpan salinan lama, sehingga perubahan
 * (mis. ukuran ikon) seolah "tidak muncul" walau commit sudah ter-deploy.
 * Dengan menambahkan ?v=<commit sha> yang berubah setiap deploy, URL ikut
 * berubah -> browser/CDN dipaksa mengambil file terbaru. SHA otomatis dari
 * Vercel (System Environment Variables); fallback aman untuk dev/lokal.
 */
const VERSI_ISLAND =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_BUILD_ID ||
  "dev";

/**
 * Meneruskan target deep-link dari hash halaman induk (#tk=...) ke URL island
 * (?tk=...), sehingga tv-deeplink.js di dalam island dapat auto-scroll &
 * membuka bagian yang tepat. Ikut memperbarui bila hash berubah (mis. mencari
 * lagi saat sudah berada di halaman alat yang sama).
 *
 * Selalu menyertakan ?v=<versi build> untuk cache-busting (lihat VERSI_ISLAND).
 */
export function useIslandSrc(base: string): string {
  const [src, setSrc] = useState(base + "?v=" + VERSI_ISLAND);
  useEffect(() => {
    function apply() {
      const h = window.location.hash || "";
      const m = h.match(/[#&]tk=([^&]+)/);
      setSrc(m ? base + "?tk=" + m[1] + "&v=" + VERSI_ISLAND : base + "?v=" + VERSI_ISLAND);
    }
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [base]);
  return src;
}
