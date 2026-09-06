import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppShell } from "@/widgets/app-shell";
import { PengingatSlot } from "@/widgets/app-shell/PengingatSlot";
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="navy" suppressHydrationWarning>
      <head>
        {/* Font dimuat lewat @import di globals.css. Preconnect di sini
            memangkas jeda tampil huruf (FOUT) pada kunjungan pertama. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Firebase dimuat lewat <script> CDN terpisah dari gstatic.com --
            preconnect di sini memangkas jeda DNS+TLS sebelum tiga berkas SDK
            itu mulai diunduh. Ini bukan solusi utama (lihat firebaseClient.ts
            untuk perbaikan berikutnya yang lebih besar), tapi kemenangan
            kecil tanpa risiko yang layak diambil sekarang. */}
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tv-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <StructuredData />
        {/*
         * WHY pengingat dibungkus Suspense, bukan lagi di-`await` di sini:
         * lihat catatan lengkap di widgets/app-shell/PengingatSlot.tsx.
         * Ringkasnya -- ini yang membuat SELURUH halaman (termasuk halaman
         * publik seperti /langganan) tidak lagi menunggu pembacaan cookie
         * sesi + query Firestore sebelum HTML mulai dikirim ke browser.
         */}
        <AppShell
          pengingatSlot={
            <Suspense fallback={null}>
              <PengingatSlot />
            </Suspense>
          }
        >
          {children}
        </AppShell>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
