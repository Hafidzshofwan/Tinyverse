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
const titleTight: CSSProperties = { margin: 0 };
const leadTight: CSSProperties = { margin: "4px 0 0" };

/**
 * Kerangka halaman alat: kontainer + header (badge, ikon opsional, judul,
 * deskripsi) yang konsisten untuk semua kalkulator. Hanya presentasi.
 * Ikon (opsional) meniru gaya ikon-bulat v17 agar sejajar dengan alat island
 * (Mode Darurat, Dosis Obat, Terapi Cairan) yang berjudul + berikon.
 */
export function ToolShell({ title, desc, icon, children }: ToolShellProps) {
  return (
    <div className="tv-container">
      <div className="tv-tool-head">
        <span className="tv-tool-badge">Preview</span>
        {icon ? (
          <div style={headRow}>
            <span style={icoStyle} aria-hidden="true">
              {icon}
            </span>
            <div>
              <h1 className="tv-tool-title" style={titleTight}>
                {title}
              </h1>
              {desc ? (
                <p className="tv-tool-lead" style={leadTight}>
                  {desc}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <h1 className="tv-tool-title">{title}</h1>
            {desc ? <p className="tv-tool-lead">{desc}</p> : null}
          </>
        )}
      </div>
      {children}
    </div>
  );
}
