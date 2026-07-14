import type { CSSProperties } from "react";
import { ScoreCatalog } from "@/features/clinical-scores";
import { ToolHeader } from "@/shared/ui/ToolHeader";

const wrapStyle: CSSProperties = { maxWidth: 820, margin: "0 auto" };

/**
 * Widget: katalog Skoring Klinis. Header memakai ToolHeader (gaya "judul-section"
 * v17) agar SAMA PERSIS dengan header alat lain (Terapi Cairan / Racik Puyer /
 * Tumbuh Kembang) - bukan lagi ToolShell yang ukurannya kebesaran.
 */
export function ScoringPanel() {
  return (
    <div style={wrapStyle}>
      <ToolHeader
        icon={"\uD83E\uDDEE"}
        iconBg="#EAF6FB"
        title="Skoring Klinis"
        subtitle="Skor klinis pediatri tervalidasi."
      />
      <section className="tv-card tv-stack">
        <ScoreCatalog />
      </section>
    </div>
  );
}
