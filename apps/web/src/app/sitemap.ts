import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/seo/siteConfig";

/**
 * Sitemap dinamis (konvensi App Router Next.js, disajikan otomatis pada
 * /sitemap.xml).
 *
 * WHY hanya enam alamat ini: keterbukaan tanpa masuk diatur PERSIS oleh
 * RUTE_PUBLIK di widgets/app-shell/AppShell.tsx -- "/langganan",
 * "/syarat-ketentuan", "/pengembalian-dana", "/kebijakan-privasi",
 * "/kontak" -- ditambah beranda "/". Seluruh rute di bawah /preview dijaga
 * gerbang berbayar server-side (app/preview/layout.tsx) dan menampilkan layar
 * masuk bagi pengunjung yang belum berlangganan, sehingga tidak ada gunanya
 * -- dan berisiko dianggap konten tipis/duplikat -- bila dimasukkan ke
 * sitemap. /admin, /api, /langganan/selesai, dan /segera juga bukan halaman
 * publik. Bila menambah halaman publik baru, tambahkan juga entrinya di
 * sini.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/langganan`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/kontak`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/syarat-ketentuan`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/pengembalian-dana`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/kebijakan-privasi`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
