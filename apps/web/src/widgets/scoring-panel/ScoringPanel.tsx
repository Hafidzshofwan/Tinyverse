import type { CSSProperties } from "react";
import { ScoreCatalog } from "@/features/clinical-scores";

const wrapStyle: CSSProperties = { maxWidth: 820, margin: "0 auto" };

// Header inline diselaraskan 1:1 dengan alat island v17
// (Terapi Cairan / Racik Puyer / Alur), menggantikan ToolHeader lama
// yang ikonnya bulat & warnanya berbeda.
const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  marginBottom: 18,
};
// Kotak ikon: gradien magenta -> navy (pink-lavender), membulat (radius 18) -
// bukan lingkaran biru solid seperti sebelumnya.
const icoStyle: CSSProperties = {
  flex: "0 0 auto",
  width: 54,
  height: 54,
  borderRadius: 18,
  display: "grid",
  placeItems: "center",
  fontSize: 26,
  lineHeight: 1,
  background:
    "linear-gradient(135deg, rgba(217, 54, 166, 0.14), rgba(10, 11, 95, 0.08))",
};
// Judul: computed sama dengan island -> 18.32px, Fredoka, warna #0A0B5F.
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily:
    '"Fredoka", "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontWeight: 700,
  fontSize: "1.145rem",
  color: "var(--tv-navy, #0a0b5f)",
};
// Subjudul: computed sama dengan island -> 10.24px, Quicksand,
// warna #0A0B5F9E (navy 62%), tanpa margin.
const leadStyle: CSSProperties = {
  margin: 0,
  fontWeight: 500,
  fontSize: "0.64rem",
  lineHeight: 1.45,
  color: "rgba(10, 11, 95, 0.62)",
};

/**
 * Widget: katalog Skoring Klinis. Header dibuat inline agar SAMA PERSIS dengan
 * header alat island lain (Terapi Cairan / Racik Puyer / Alur): kotak ikon
 * gradien pink-lavender membulat, judul Fredoka 18.32px navy, subjudul
 * Quicksand 10.24px navy-62%.
 */
export function ScoringPanel() {
  return (
    <div style={wrapStyle}>
      <div style={headRow}>
        <span style={icoStyle} aria-hidden="true">
          {"\uD83E\uDDEE"}
        </span>
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
