import type { CSSProperties } from "react";
import { ToolShell } from "@/shared/ui/ToolShell";

export const metadata = {
  title: "Segera Hadir | Tinyverse",
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
          Beranda atau menu di samping: Dosis Obat, Terapi Cairan, Kalkulator
          Nutrisi, Luka Bakar, GCS, dan AGD.
        </p>
      </div>
    </ToolShell>
  );
}
