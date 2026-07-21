"use client";

import type { CSSProperties } from "react";

export interface ResultRow {
  label: string;
  value: string;
}

export interface ResultListProps {
  rows: ReadonlyArray<ResultRow>;
  rincian?: ReadonlyArray<ResultRow>;
  error: string | null;
  title?: string;
}

const errorStyle: CSSProperties = {
  marginTop: 16,
  padding: 16,
  borderRadius: 18,
  background: "linear-gradient(135deg, #FFE0E0, #FFF7F7)",
  border: "3px dashed #E63946",
  color: "#E63946",
  fontWeight: 700,
};

export function ResultList({ rows, rincian, error, title }: ResultListProps) {
  if (error) {
    return (
      <div style={errorStyle}>
        <p style={{ margin: 0 }}>⚠️ {error}</p>
      </div>
    );
  }
  if (rows.length === 0) return null;

  const [primary, ...rest] = rows;
  const sub = rest[0];
  const extra = rest.slice(1);
  const detailRows = rincian && rincian.length > 0 ? rincian : extra;
  const sectionTitle = title ?? "HASIL PERHITUNGAN";

  return (
    <div className="hasil-box-cairan tampil">
      <div className="hasil-label">{sectionTitle}</div>
      <div className="hasil-dosis">{primary.value}</div>
      {sub ? <span className="hasil-sub">{sub.value}</span> : null}

      {detailRows.length > 0 ? (
        <>
          <hr className="hasil-divider" />
          <div className="hasil-rincian-label">Rincian:</div>
          <ul className="hasil-rincian">
            {detailRows.map((row, i) => (
              <li key={i}>
                <strong>{row.label}</strong> — {row.value}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
