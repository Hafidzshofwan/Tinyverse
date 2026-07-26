import type { CSSProperties, ReactNode } from "react";

export interface ToolShellProps {
  title: string;
  desc?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 15,
};
// Kotak ikon: disamakan presisi 46x46, warna #D936A6, bg #D936A61A, font 17.6px Quicksand
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
  fontFamily: "'Quicksand', system-ui, sans-serif",
  lineHeight: 1,
  background: "transparent",
  color: "#D936A6",
  boxShadow: "none",
};
// Judul: diselaraskan presisi dengan contoh v17 (19.84px Fredoka, #0A0B5F).
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily:
    '"Fredoka", "Quicksand", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontWeight: 700,
  fontSize: "19.84px",
  color: "#0A0B5F",
};
// Subjudul: diselaraskan presisi dengan contoh v17 (9.92px Quicksand, #0A0B5F9E, margin 2px 0 0).
const leadStyle: CSSProperties = {
  margin: "2px 0 0 0",
  fontFamily: '"Quicksand", system-ui, sans-serif',
  fontWeight: 500,
  fontSize: "9.92px",
  lineHeight: 1.3,
  color: "#0A0B5F9E",
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
