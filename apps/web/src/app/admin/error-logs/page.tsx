import type { Metadata } from "next";
import { ErrorLogsPanel } from "@/widgets/error-logs";

/** Halaman admin internal -- sengaja noindex, lihat juga app/robots.ts. */
export const metadata: Metadata = {
  title: "Pemantauan Error",
  robots: { index: false, follow: false },
};

/**
 * Halaman penuh pemantauan error produksi.
 *
 * Tidak ada penjaga di berkas ini. Yang menentukan tetap route
 * /api/admin/error-logs, yang menolak siapa pun tanpa custom claim admin.
 * Halaman ini hanya kulit -- mengikuti pola yang sama persis dengan
 * app/admin/pengguna/page.tsx, agar tidak ada dua jawaban berbeda soal
 * "siapa admin" di dalam proyek ini.
 */
export default function ErrorLogsPage() {
  return <ErrorLogsPanel />;
}
