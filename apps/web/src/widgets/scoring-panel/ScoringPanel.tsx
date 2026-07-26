import type { CSSProperties } from "react";
import { ScoreCatalog } from "@/features/clinical-scores";
import { ClinicalScoreIcon } from "@/features/clinical-scores/ClinicalScoreIcon";

const wrapStyle: CSSProperties = { maxWidth: 820, margin: "0 auto" };

// Header inline diselaraskan 1:1 dengan alat island v17
const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 20,
};
const icoStyle: CSSProperties = {
  flex: "0 0 38px",
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#FDF2F8",
  border: "1px solid rgba(217, 54, 166, 0.12)",
  boxShadow: "0 2px 6px rgba(217, 54, 166, 0.06)",
};
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily:
    '"Fredoka", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  fontWeight: 700,
  fontSize: "18.32px",
  lineHeight: 1.2,
  color: "var(--tv-navy, #0a0b5f)",
};
const leadStyle: CSSProperties = {
  margin: "1px 0 0 0",
  fontFamily:
    '"Quicksand", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  fontWeight: 500,
  fontSize: "10.24px",
  lineHeight: 1.4,
  color: "rgba(10, 11, 95, 0.65)",
};

export function ScoringPanel() {
  return (
    <div style={wrapStyle}>
      <div style={headRow}>
        <div style={icoStyle} aria-hidden="true">
          <ClinicalScoreIcon id="header" size={24} fallbackEmoji="🧮" />
        </div>
        <div>
          <h1 style={titleStyle}>Skoring Klinis</h1>
          <p style={leadStyle}>Skor klinis pediatri tervalidasi.</p>
        </div>
      </div>
      <section className="tv-card tv-stack">
        <ScoreCatalog />
      </section>
    </div>
  );
}
