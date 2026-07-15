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
  gap: 14,
};
const icoStyle: CSSProperties = {
  flex: "0 0 auto",
  width: 52,
  height: 52,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  fontSize: 26,
  lineHeight: 1,
  background: "var(--tv-accent-soft, #E7F0FF)",
};
// Judul & subjudul disamakan dengan gaya island v17 (Racik Puyer):
// lebih ringkas dari 1.7rem bawaan .tv-tool-title, dan tanpa badge "Preview".
const titleStyle: CSSProperties = { margin: 0, fontSize: "1.35rem" };
const leadStyle: CSSProperties = { margin: "4px 0 0", fontSize: "0.9rem" };

/**
 * Kerangka halaman alat: kontainer + header (ikon opsional, judul, deskripsi)
 * yang konsisten untuk semua kalkulator. Hanya presentasi.
 * Header meniru gaya alat island v17 (Racik Puyer / Terapi Cairan): tanpa badge
 * "Preview" dan judul lebih ringkas, agar seragam di semua halaman alat.
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
