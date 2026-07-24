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
  width: 46,
  height: 46,
  borderRadius: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17.6px",
  fontFamily: "'Quicksand', system-ui, sans-serif",
  color: "#D936A6",
  flexShrink: 0,
  boxShadow: "none",
};
const h2Style: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka', 'Quicksand', sans-serif",
  fontSize: "19.84px",
  fontWeight: 700,
  color: "#0A0B5F",
};
const pStyle: CSSProperties = {
  margin: "2px 0 0 0",
  fontFamily: "'Quicksand', system-ui, sans-serif",
  fontSize: "9.92px",
  fontWeight: 500,
  color: "#0A0B5F9E",
};

export function ToolHeader({ icon, title, subtitle, iconBg }: ToolHeaderProps) {
  const circle: CSSProperties = { ...circleBase, background: iconBg ?? "#D936A61A" };
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
