import type { CSSProperties } from "react";

export interface ResultRow {
  label: string;
  value: string;
}

export interface ResultListProps {
  rows: ReadonlyArray<ResultRow>;
  error?: string | null;
}

const errorStyle: CSSProperties = {
  margin: 0,
  padding: "10px 12px",
  color: "var(--pink-tua)",
  background: "rgba(197, 34, 141, 0.08)",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
};
const placeholderStyle: CSSProperties = {
  margin: 0,
  color: "var(--teks-lembut)",
  fontSize: 14,
};
const listStyle: CSSProperties = {
  margin: 0,
  display: "flex",
  flexDirection: "column",
};
const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 16,
  padding: "9px 0",
  borderBottom: "1px solid var(--etail-line)",
};
const dtStyle: CSSProperties = {
  color: "var(--teks-lembut)",
  fontSize: 14,
};
const ddStyle: CSSProperties = {
  margin: 0,
  color: "var(--teks)",
  fontSize: 15,
  fontWeight: 700,
  textAlign: "right",
};

export function ResultList({ rows, error }: ResultListProps) {
  if (error) {
    return <p style={errorStyle}>{error}</p>;
  }
  if (rows.length === 0) {
    return <p style={placeholderStyle}>Masukkan nilai untuk melihat hasil.</p>;
  }
  return (
    <dl style={listStyle}>
      {rows.map((row) => (
        <div key={row.label} style={rowStyle}>
          <dt style={dtStyle}>{row.label}</dt>
          <dd style={ddStyle}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
