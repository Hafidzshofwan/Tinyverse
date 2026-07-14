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
    <html lang="id" data-theme="navy">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
