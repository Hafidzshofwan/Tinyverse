"use client";

import { useEffect, useState } from "react";
import { useIslandSrc } from "@/shared/lib/useIslandSrc";
import type { CSSProperties } from "react";

/**
 * ImunisasiTool - island loader (Jadwal Imunisasi IDAI 2024).
 *
 * WHY: Fitur imunisasi menampilkan DUA halaman bagan IDAI 2024 (Jadwal + Keterangan)
 * dengan zoom, ditambah materi tiap vaksin lewat dropdown (penyakit yang dicegah,
 * jenis hidup/mati, cara pemberian, jadwal & dosis, KIPI, kontraindikasi, catatan).
 * Seluruh markup + CSS + skrip dijalankan apa adanya di dokumen terisolasi
 * (/imunisasi-tool.html) via <iframe> agar konsisten dengan island lain (mis.
 * guideline). Tinggi iframe menyesuaikan otomatis (postMessage __tkHeight). Gambar
 * bagan diletakkan di apps/web/public/assets/images/.
 */
export function ImunisasiTool() {
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

  return <iframe src={useIslandSrc("/imunisasi-tool.html")} title="Jadwal Imunisasi" style={gaya} />;
}
