import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/seo/siteConfig";

/**
 * robots.txt dinamis (konvensi App Router Next.js, disajikan otomatis pada
 * /robots.txt).
 *
 * WHY jalur ini yang ditolak: /admin dan /api tidak pernah punya sesuatu yang
 * berguna bagi mesin pencari (panel internal dan route handler). /preview dan
 * /langganan/selesai selalu menampilkan layar masuk/gerbang berbayar atau
 * status transaksi pribadi bagi pengunjung yang belum masuk -- lihat
 * app/preview/layout.tsx dan app/langganan/selesai/page.tsx. Mengizinkan
 * crawler mengunjunginya hanya memboroskan crawl budget dan berisiko
 * mengindeks belasan halaman kosong/duplikat. /segera adalah halaman
 * penampung placeholder tanpa konten nyata.
 *
 * Bot AI (GPTBot, PerplexityBot, dst.) sengaja diberi aturan yang identik
 * dengan bot pencari umum: diizinkan di seluruh halaman publik, dan dijauhkan
 * dari jalur privat yang sama -- ini yang diminta untuk optimasi AI Search.
 */
const DISALLOW = [
  "/admin",
  "/admin/",
  "/api/",
  "/preview",
  "/preview/",
  "/langganan/selesai",
  "/segera",
];

const USER_AGENTS = [
  "*",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "anthropic-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: USER_AGENTS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: DISALLOW,
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
