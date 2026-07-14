"use client";

import { useEffect } from "react";

/**
 * Mendaftarkan service worker TinyVerse agar aplikasi bisa dipakai offline.
 *
 * Catatan:
 *  - Hanya berjalan di production. Saat `pnpm dev`, service worker sengaja
 *    dilewati supaya tidak mengganggu hot-reload.
 *  - Komponen ini tidak menampilkan apa pun (return null); cukup dirender
 *    sekali di root layout.
 */
export function RegisterSW(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Gagal mendaftarkan service worker:", err);
      });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
