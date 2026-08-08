import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppShell } from "@/widgets/app-shell";
import { hitungPengingat, type Pengingat } from "@/features/pengingat-langganan";
import { statusAksesSaatIni } from "@/server/entitlementServer";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from "@/shared/seo/siteConfig";
import { StructuredData } from "@/shared/seo/StructuredData";
import { ErrorMonitorMount } from "@/shared/lib/errorMonitoring";
import "@tinyverse/ui-kit/tokens.css";
import "./globals.css";

/**
 * Metadata global situs. Setiap halaman mewarisi ini kecuali ia mengatur
 * field-nya sendiri (mis. title dan description per halaman publik, atau
 * robots: noindex pada halaman berlangganan/admin/preview).
 *
 * `verification` sengaja dibaca dari environment variable, bukan ditulis
 * langsung: kode kepemilikan Google Search Console dan Bing Webmaster Tools
 * sebaiknya diisi lewat konfigurasi Vercel (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
 * dan NEXT_PUBLIC_BING_SITE_VERIFICATION) agar tidak perlu mengubah kode
 * setiap kali kode verifikasi diperbarui. Bila variabelnya belum diisi, tag
 * meta terkait otomatis tidak dirender -- tidak ada tag kosong yang tertinggal.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

// Pastikan penskalaan mengikuti lebar perangkat (mobile tidak mengecil/membesar).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Pengingat masa langganan, dihitung di server.
 *
 * WHY di layout akar, bukan di /preview: pengguna yang masa aktifnya sudah
 * habis tidak akan pernah melihat halaman /preview -- gerbang berbayar sudah
 * menahannya lebih dulu. Bila pengingat hanya dipasang di sana, justru orang
 * yang paling perlu diingatkan yang tidak pernah menerimanya.
 *
 * Konsekuensi yang perlu disadari: memanggil ini membaca cookie sesi, sehingga
 * seluruh halaman dirender per permintaan alih-alih disajikan dari hasil build.
 * Untuk aplikasi yang memang menuntut masuk pada hampir semua halamannya, ini
 * pertukaran yang wajar.
 *
 * Sumber spanduk dirakit di sini secara EKSPLISIT, tidak lagi dengan menyuapkan
 * objek entitlement apa adanya. Sebelumnya itu bekerja karena bentuk kedua tipe
 * kebetulan cocok, dan kecocokan yang kebetulan akan patah tanpa peringatan
 * begitu salah satu tipe berubah. Sekarang terlihat jelas data apa saja yang
 * dipakai spanduk -- termasuk keterangan masa percobaan, yang sengaja TIDAK
 * dititipkan di dalam entitlement agar penentu hak akses tetap tidak tersentuh.
 *
 * Seluruh badan fungsi dibungkus try/catch dengan sengaja. Layout akar
 * membungkus SETIAP halaman, termasuk halaman publik yang harus tetap terbuka
 * bagi calon pelanggan dan peninjau merchant. Satu galat di sini -- kredensial
 * Firebase yang belum terpasang, Firestore yang sedang terganggu -- akan
 * mematikan seluruh situs. Pengingat yang gagal tampil hanya merugikan sedikit;
 * situs yang mati merugikan segalanya.
 */
async function ambilPengingat(): Promise<Pengingat | null> {
  try {
    const status = await statusAksesSaatIni();
    if (!status.masuk) return null;
    return hitungPengingat(
      {
        status: status.entitlement.status,
        berakhirPada: status.entitlement.berakhirPada,
        percobaan: status.percobaan,
      },
      new Date().toISOString(),
    );
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pengingat = await ambilPengingat();

  return (
    <html lang="id" data-theme="navy" suppressHydrationWarning>
      <head>
        {/* Font dimuat lewat @import di globals.css. Preconnect di sini
            memangkas jeda tampil huruf (FOUT) pada kunjungan pertama. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tv-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <StructuredData />
        <ErrorMonitorMount />
        <AppShell pengingat={pengingat}>{children}</AppShell>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
