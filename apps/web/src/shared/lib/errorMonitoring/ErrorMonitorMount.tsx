"use client";

import { useEffect } from "react";
import { pasangPemantauErrorGlobal } from "./errorLogger";

/**
 * Komponen tanpa tampilan yang hanya memasang pemantau error global sekali
 * saat aplikasi dimuat. Ditaruh di layout akar agar berlaku di SEMUA halaman,
 * termasuk halaman publik yang tidak dijaga sesi.
 */
export function ErrorMonitorMount() {
  useEffect(() => {
    pasangPemantauErrorGlobal();
  }, []);
  return null;
}
