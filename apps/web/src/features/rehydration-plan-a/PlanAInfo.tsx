import type { CSSProperties } from "react";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const cardStyle: CSSProperties = {
  padding: "20px 22px",
  borderRadius: 18,
  background: "linear-gradient(135deg, #F0FFE8, #FFFFFF)",
  border: "3px solid rgba(126, 217, 87, 0.45)",
  color: "#4A3728",
  lineHeight: 1.55,
  boxShadow: "0 10px 0 rgba(0,0,0,0.04), 0 12px 30px rgba(84, 198, 235, 0.15)",
};
const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  color: "#4A3728",
};
const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};
const cellStyle: CSSProperties = {
  border: "1px solid rgba(126, 217, 87, 0.45)",
  padding: "10px 12px",
  textAlign: "left",
  color: "#4A3728",
  fontWeight: 600,
};
const thStyle: CSSProperties = {
  ...cellStyle,
  background: "rgba(126, 217, 87, 0.15)",
  fontFamily: "'Fredoka', sans-serif",
};
const noteStyle: CSSProperties = {
  margin: 0,
  padding: "14px 16px",
  borderRadius: 14,
  background: "#FFFBF0",
  border: "1px solid #EAF6FB",
  fontSize: 13,
  color: "#8A7868",
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
              <th style={thStyle}>Kelompok Usia</th>
              <th style={thStyle}>Volume per Episode BAB Cair</th>
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
        muncul tanda bahaya. <br />
        <i>Sumber: WHO/IDAI — Lima Lintas Tatalaksana Diare.</i>
      </p>
    </div>
  );
}
