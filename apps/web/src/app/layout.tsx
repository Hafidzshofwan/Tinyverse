import type { ReactNode } from "react";
import { AppShell } from "@/widgets/app-shell";
import "@tinyverse/ui-kit/tokens.css";
import "./globals.css";

export const metadata = {
  title: "Tinyverse",
  description: "Preview migrasi Tinyverse v17 menuju Next.js (FSD/DDD)",
};

// Pastikan penskalaan mengikuti lebar perangkat (mobile tidak mengecil/membesar).
export const viewport = {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tv-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
