/**
 * Konfigurasi dasar SEO yang dipakai bersama oleh layout, robots.ts,
 * sitemap.ts, manifest.ts, dan skema JSON-LD.
 *
 * WHY satu berkas: alamat domain produksi (SITE_URL) dipakai di banyak
 * tempat sekaligus (canonical, Open Graph, sitemap, robots). Menuliskannya
 * berulang di setiap berkas membuka peluang salah satu lupa diperbarui saat
 * domain berubah.
 */

export const SITE_URL = "https://www.tinyverse.web.id";

export const SITE_NAME = "Tinyverse";

export const SITE_TITLE_DEFAULT = "Tinyverse — Alat Bantu Klinis Pediatri";

export const SITE_TITLE_TEMPLATE = "%s | Tinyverse";

export const SITE_DESCRIPTION =
  "Tinyverse adalah alat bantu klinis pediatri untuk tenaga kesehatan: dosis obat & racik puyer, terapi cairan, skoring klinis, kurva tumbuh kembang, interpretasi lab & AGD, jadwal imunisasi, tool neonatus, hingga Asisten AI Co-Pilot klinis, dalam satu aplikasi.";

export const SITE_KEYWORDS: string[] = [
  "alat bantu klinis pediatri",
  "kalkulator dosis obat anak",
  "terapi cairan anak",
  "skoring klinis pediatri",
  "kurva tumbuh kembang anak",
  "interpretasi lab anak",
  "jadwal imunisasi anak",
  "kalkulator eGFR pediatrik",
  "tool neonatus",
  "aplikasi dokter anak",
  "Tinyverse",
];

export const SITE_LOCALE = "id_ID";

export const ORGANIZATION_EMAIL = "tinyverse.app@gmail.com";

export const ORGANIZATION_SOCIAL_LINKS: string[] = [
  "https://www.instagram.com/tinyverse.app",
];
