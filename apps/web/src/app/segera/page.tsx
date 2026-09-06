import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ToolShell } from "@/shared/ui/ToolShell";

/** Halaman penampung placeholder tanpa konten nyata -- sengaja noindex. */
export const metadata: Metadata = {
  title: "Segera Hadir",
  robots: { index: false, follow: false },
};

const pStyle: CSSProperties = {
  margin: 0,
  color: "var(--tv-soft-teks)",
  lineHeight: 1.55,
};

export default function SegeraPage() {
  return (
    <ToolShell
      title="Sedang Disusun"
      desc="Menu ini sudah ada di struktur navigasi, tetapi halamannya belum dibuat pada tahap ini. Fitur akan diaktifkan pada fase berikutnya."
    >
      <div className="tv-card tv-stack">
        <p style={pStyle}>
          Terima kasih sudah menelusuri. Alat yang sudah aktif dapat dibuka dari
          Beranda atau menu di samping: Dosis Obat, Terapi Cairan, Luka Bakar,
          GCS, dan AGD.
        </p>
      </div>
    </ToolShell>
  );
}
