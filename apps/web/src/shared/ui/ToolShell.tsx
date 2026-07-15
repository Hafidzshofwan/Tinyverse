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
// Kotak ikon disamakan dengan alat island v17 (Terapi Cairan / Racik Puyer):
// gradien magenta -> navy yang menghasilkan nuansa pink-lavender.
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
// Judul: Fredoka 700, warna navy tema (sama seperti island).
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: '"Fredoka", sans-serif',
  fontWeight: 700,
  fontSize: "1.45rem",
  letterSpacing: "0.2px",
  color: "var(--tv-navy, #0a0b5f)",
};
// Subjudul: navy lembut (bukan abu-abu), agar selaras dengan island.
const leadStyle: CSSProperties = {
  margin: "3px 0 0",
  fontWeight: 500,
  fontSize: "0.92rem",
  lineHeight: 1.45,
  color: "rgba(10, 11, 95, 0.62)",
};

/**
 * Kerangka halaman alat: kontainer + header (ikon opsional, judul, deskripsi)
 * yang konsisten untuk semua kalkulator. Hanya presentasi.
 * Header disamakan dengan gaya alat island v17 (Terapi Cairan / Racik Puyer):
 * kotak ikon gradien pink-lavender, judul Fredoka navy, subjudul navy lembut,
 * tanpa badge "Preview".
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
