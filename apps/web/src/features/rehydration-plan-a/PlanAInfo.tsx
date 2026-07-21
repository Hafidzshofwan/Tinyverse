import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1rem",
  color: "#0A0B5F",
  margin: "0 0 14px",
  fontWeight: 700,
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
  marginBottom: 14,
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  background: "rgba(10, 11, 95, 0.05)",
  color: "#0A0B5F",
  fontWeight: 700,
  borderRadius: 10,
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(10, 11, 95, 0.07)",
  color: "rgba(10, 11, 95, 0.72)",
  fontWeight: 700,
};

const catatan: CSSProperties = {
  margin: 0,
  color: "rgba(10, 11, 95, 0.62)",
  fontSize: 13,
  fontStyle: "italic",
  lineHeight: 1.68,
};

/**
 * Kartu statis Rencana A (tanpa dehidrasi) — gaya v17.
 */
export function PlanAInfo() {
  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>🥤 Cairan tambahan setiap kali BAB cair</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Kelompok Usia</th>
            <th style={thStyle}>Volume per Episode BAB Cair</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>&lt; 1 tahun</td>
            <td style={tdStyle}>50–100 mL</td>
          </tr>
          <tr>
            <td style={tdStyle}>≥ 1 tahun</td>
            <td style={tdStyle}>100–200 mL</td>
          </tr>
        </tbody>
      </table>
      <p style={catatan}>
        Diberikan sebagai tambahan di luar cairan/ASI/makan seperti biasa, untuk
        mengganti kehilangan cairan akibat diare. Bila muntah atau dehidrasi
        muncul, pertimbangkan Rencana B.
      </p>
    </div>
  );
}
