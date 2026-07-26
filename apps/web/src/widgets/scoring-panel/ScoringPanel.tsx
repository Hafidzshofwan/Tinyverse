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
// Kotak ikon: DISAMAKAN dengan Racik Puyer (.ikon-bulat) -> 52x52,
// border-radius 17px, background magenta 10% (rgba(217,54,166,0.10)),
// font 1.24rem (=19.84px). Sebelumnya 54x54 radius 18 gradien.
const icoStyle: CSSProperties = {
  flex: "0 0 38px",
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "38px",
  lineHeight: 1,
  background: "transparent",
  color: "#d936a6",
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
