import type { CSSProperties } from "react";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const cardStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  background: "#E7F8DA",
  border: "1px solid #BFE6A3",
  color: "#2f6b1f",
  lineHeight: 1.55,
};
const titleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1rem",
  color: "var(--hijau-tua, #2f6b1f)",
};
const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};
const cellStyle: CSSProperties = {
  border: "1px solid #BFE6A3",
  padding: "8px 10px",
  textAlign: "left",
};
const noteStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "var(--teks-lembut)",
  lineHeight: 1.55,
};

/**
 * Rencana Terapi A (WHO/IDAI) - diare TANPA dehidrasi.
 * Kartu info STATIS (paritas 1:1 dengan island v17). Tanpa input/hitung
 * sehingga tidak butuh rumus baru di clinical-core.
 */
export function PlanAInfo() {
  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h3 style={titleStyle}>🥤 Cairan tambahan setiap kali BAB cair</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Kelompok Usia</th>
              <th style={cellStyle}>Volume per Episode BAB Cair</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>&lt; 1 tahun</td>
              <td style={cellStyle}>50–100 mL</td>
            </tr>
            <tr>
              <td style={cellStyle}>≥ 1 tahun</td>
              <td style={cellStyle}>100–200 mL</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={noteStyle}>
        Rencana Terapi A dipakai pada diare <b>tanpa dehidrasi</b>: lanjutkan
        ASI/pemberian makan, beri oralit setiap BAB cair sesuai tabel, tambahkan
        zinc sesuai program (10–14 hari), dan segera ke fasilitas kesehatan bila
        muncul tanda bahaya. (Sumber: WHO/IDAI — Lima Lintas Tatalaksana Diare.)
      </p>
    </div>
  );
}
