import type { CSSProperties } from "react";

export interface ResultRow {
  label: string;
  value: string;
}

export interface ResultListProps {
  rows: ResultRow[];
  error: string | null;
}

const cardStyle: CSSProperties = {
  marginTop: 16,
  padding: "20px",
  borderRadius: 18,
  background: "linear-gradient(135deg, #DCF3FB, #EAFBF1)",
  border: "3px dashed #54C6EB",
  color: "#0A0B4F",
  lineHeight: 1.55,
  animation: "muncul 0.4s ease",
};

const titleStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#667085",
  fontWeight: 700,
  margin: "0 0 10px",
  fontFamily: "'Fredoka', sans-serif",
};

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px dashed rgba(10, 11, 95, 0.09)",
  fontSize: 15,
  fontWeight: 700,
};

const labelStyle: CSSProperties = {
  color: "#667085",
  fontWeight: 700,
};

const valueStyle: CSSProperties = {
  color: "#0A0B5F",
  fontWeight: 800,
  fontFamily: "'Fredoka', sans-serif",
  textAlign: "right",
};

const errorStyle: CSSProperties = {
  marginTop: 16,
  padding: 16,
  borderRadius: 18,
  background: "linear-gradient(135deg, #FFE0E0, #FFF7F7)",
  border: "3px dashed #E63946",
  color: "#E63946",
  fontWeight: 700,
};

export function ResultList({ rows, error }: ResultListProps) {
  if (error) {
    return (
      <div style={errorStyle}>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }
  if (rows.length === 0) return null;
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>HASIL PERHITUNGAN</h3>
      {rows.map((row, i) => (
        <div key={i} style={rowStyle}>
          <span style={labelStyle}>{row.label}</span>
          <span style={valueStyle}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
