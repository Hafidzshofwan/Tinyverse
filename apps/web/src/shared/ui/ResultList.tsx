import type { CSSProperties } from "react";

export interface ResultRow {
  label: string;
  value: string;
}

export interface ResultListProps {
  rows: ReadonlyArray<ResultRow>;
  error?: string | null;
}

const boxStyle: CSSProperties = {
  display: "none",
  background: "linear-gradient(135deg, #DCF3FB, #EAFBF1)",
  borderRadius: 18,
  padding: 20,
  marginTop: 16,
  border: "3px dashed #54C6EB",
  animation: "muncul 0.4s ease",
};

const errorStyle: CSSProperties = {
  margin: 0,
  padding: "10px 12px",
  color: "#F06387",
  background: "#FFF1F1",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid #F8A5A5",
};
const placeholderStyle: CSSProperties = {
  margin: 0,
  color: "#8A7868",
  fontSize: 14,
  fontWeight: 600,
};
const listStyle: CSSProperties = {
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 16,
  padding: "6px 0",
  borderTop: "1px dashed rgba(117, 100, 83, 0.18)",
};
const dtStyle: CSSProperties = {
  color: "#8A7868",
  fontSize: 14,
  fontWeight: 700,
};
const ddStyle: CSSProperties = {
  margin: 0,
  color: "#4A3728",
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
    <div style={boxStyle}>
      <h3
        style={{
          fontSize: "0.85rem",
          color: "#8A7868",
          fontWeight: 700,
          margin: "0 0 8px",
          fontFamily: "'Fredoka', sans-serif",
        }}
      >
        HASIL PERHITUNGAN
      </h3>
      <dl style={listStyle}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              ...rowStyle,
              borderTop: i === 0 ? "none" : rowStyle.borderTop,
              paddingTop: i === 0 ? 0 : undefined,
            }}
          >
            <dt style={dtStyle}>{row.label}</dt>
            <dd style={ddStyle}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
