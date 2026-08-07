import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * app/preview/ai-assistant/page.tsx adalah Client Component ("use client"),
 * dan Next.js tidak mengizinkan Client Component mengekspor `metadata`.
 * Berkas layout terpisah ini (Server Component) yang menyediakan judul tab.
 *
 * Root layout (app/layout.tsx) sudah mendefinisikan `title.template`
 * ("%s | Tinyverse") yang otomatis menambahkan " | Tinyverse" ke judul apa
 * pun di bawah pohonnya. Judul di sini sengaja HANYA "Asisten AI" (tanpa
 * embel-embel " | Tinyverse") -- sama seperti seluruh halaman /preview/*
 * lain -- supaya template tidak menempelkannya dua kali dan tab Chrome
 * tidak lagi menampilkan "Asisten AI | Tinyverse | Tinyverse".
 */
export const metadata: Metadata = {
  title: "Asisten AI",
};

export default function AiAssistantLayout({ children }: { children: ReactNode }) {
  return children;
}
