import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_DEFAULT } from "@/shared/seo/siteConfig";

/**
 * Web app manifest dinamis (konvensi App Router Next.js, disajikan otomatis
 * pada /manifest.webmanifest).
 *
 * Ikon dan warna diambil dari aset serta variabel yang sudah ada di proyek
 * (app/icon.png, app/apple-icon.png sebagai ikon file-convention Next.js, dan
 * --tv-bg / warna navy pada app/globals.css) -- tidak ada aset baru yang
 * dibuat dan tidak ada tampilan yang berubah.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE_DEFAULT,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5fa",
    theme_color: "#0A0B5F",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
