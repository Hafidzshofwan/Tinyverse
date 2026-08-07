import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * app/preview/ai-assistant/page.tsx adalah Client Component ("use client"),
 * dan Next.js tidak mengizinkan Client Component mengekspor `metadata`.
 * Berkas layout terpisah ini (Server Component) yang menyediakan judul tab,
 * memakai format literal yang sama dengan seluruh halaman /preview/* lainnya.
 */
export const metadata: Metadata = {
  title: "Asisten AI | Tinyverse",
};

export default function AiAssistantLayout({ children }: { children: ReactNode }) {
  return children;
}
