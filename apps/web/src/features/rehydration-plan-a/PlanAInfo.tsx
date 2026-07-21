"use client";

/** Kartu statis Rencana A (tanpa dehidrasi) — gaya v17. */
export function PlanAInfo() {
  return (
    <div className="kartu">
      <h3 className="kartu-title" style={{ color: "#22C7A7" }}>
        Cairan tambahan setiap kali BAB cair
      </h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          marginBottom: 14,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "10px 12px",
                background: "rgba(10, 11, 95, 0.05)",
                color: "#0A0B5F",
                fontWeight: 700,
                borderRadius: 10,
              }}
            >
              Kelompok Usia
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "10px 12px",
                background: "rgba(10, 11, 95, 0.05)",
                color: "#0A0B5F",
                fontWeight: 700,
                borderRadius: 10,
              }}
            >
              Volume per Episode BAB Cair
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(10, 11, 95, 0.07)",
                color: "rgba(10, 11, 95, 0.72)",
                fontWeight: 700,
              }}
            >
              &lt; 1 tahun
            </td>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(10, 11, 95, 0.07)",
                color: "rgba(10, 11, 95, 0.72)",
                fontWeight: 700,
              }}
            >
              50–100 mL
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(10, 11, 95, 0.07)",
                color: "rgba(10, 11, 95, 0.72)",
                fontWeight: 700,
              }}
            >
              ≥ 1 tahun
            </td>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(10, 11, 95, 0.07)",
                color: "rgba(10, 11, 95, 0.72)",
                fontWeight: 700,
              }}
            >
              100–200 mL
            </td>
          </tr>
        </tbody>
      </table>
      <p className="catatan-metode">
        Diberikan sebagai tambahan di luar cairan/ASI/makan seperti biasa, untuk
        mengganti kehilangan cairan akibat diare. Bila muntah atau dehidrasi
        muncul, pertimbangkan Rencana B.
      </p>
    </div>
  );
}
