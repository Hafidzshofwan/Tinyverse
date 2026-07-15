import type { CSSProperties, ReactNode } from "react";

export interface ToolShellProps {
  title: string;
  desc?: string;
  icon?: string;
  children: ReactNode;
}

const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 15,
};
// Kotak ikon: gradien magenta -> navy (pink-lavender), sama seperti island v17
// (Terapi Cairan / Racik Puyer).
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
// Judul: nilai diselaraskan 1:1 dengan header island Terapi Cairan
// (computed: 18.32px, Fredoka, warna #0A0B5F).
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily:
    '"Fredoka", "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontWeight: 700,
  fontSize: "1.145rem",
  color: "var(--tv-navy, #0a0b5f)",
};
// Subjudul: diselaraskan 1:1 dengan island Terapi Cairan
// (computed: 10.24px, Quicksand, warna #0A0B5F9E = navy 62%).
const leadStyle: CSSProperties = {
  margin: 0,
  fontWeight: 500,
  fontSize: "0.64rem",
  lineHeight: 1.45,
  color: "rgba(10, 11, 95, 0.62)",
};

/**
 * Kerangka halaman alat: kontainer + header (ikon opsional, judul, deskripsi).
 * Header disamakan 1:1 dengan alat island v17 (Terapi Cairan / Racik Puyer):
 * kotak ikon gradien pink-lavender, judul Fredoka 18.32px navy, subjudul
 * Quicksand 10.24px navy-62%, tanpa badge "Preview".
 */
export function ToolShell({ title, desc, icon, children }: ToolShellProps) {
  return (
    <div className="tv-container">
      <div className="tv-tool-head">
        {icon ? (
          <div style={headRow}>
            <span style={icoStyle} aria-hidden="true">
              {icon}
            </span>
            <div>
              <h1 className="tv-tool-title" style={titleStyle}>
                {title}
              </h1>
              {desc ? (
                <p className="tv-tool-lead" style={leadStyle}>
                  {desc}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <h1 className="tv-tool-title" style={titleStyle}>
              {title}
            </h1>
            {desc ? (
              <p className="tv-tool-lead" style={leadStyle}>
                {desc}
              </p>
            ) : null}
          </>
        )}
      </div>
      {children}
    </div>
  );
}
