import type { CSSProperties } from "react";

export interface ToolHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  iconBg?: string;
}

/**
 * ToolHeader - header alat bergaya Tinyverse v17 (".judul-section"): ikon bulat
 * pastel kecil + judul + subjudul. Dipakai pada halaman alat NATIVE (mis. Skoring)
 * supaya SAMA PERSIS dengan header di dalam alat island (Terapi Cairan / Racik Puyer /
 * Tumbuh Kembang). Nilai gaya menyalin CSS ".judul-section" v17:
 *   row  -> display:flex; align-items:center; gap:10; margin-bottom:16
 *   ikon -> 42x42; radius 50%; font 1.3rem; shadow 0 3px 0 rgba(0,0,0,.08)
 *   h2   -> 1.05rem / 600 ; p -> 0.85rem / 600
 * Presentational murni (tanpa hook) sehingga aman sebagai server component.
 */
const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
};
const circleBase: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  flexShrink: 0,
  boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
};
const h2Style: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "var(--tv-teks, #0a0b4f)",
};
const pStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--tv-soft-teks, #667085)",
};

export function ToolHeader({ icon, title, subtitle, iconBg }: ToolHeaderProps) {
  const circle: CSSProperties = { ...circleBase, background: iconBg ?? "#E7F0FF" };
  return (
    <div style={row}>
      <div style={circle} aria-hidden="true">
        {icon}
      </div>
      <div>
        <h2 style={h2Style}>{title}</h2>
        {subtitle ? <p style={pStyle}>{subtitle}</p> : null}
      </div>
    </div>
  );
}
