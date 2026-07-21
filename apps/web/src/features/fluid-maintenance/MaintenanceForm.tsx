"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewMaintenance } from "../../entities/fluid";
import { NumberField, ResultList, type ResultRow } from "../../shared/ui";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const hitungBtn: CSSProperties = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 16,
  background: "linear-gradient(160deg, #7ED957, #4EAE2E)",
  color: "white",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 5px 0 #4EAE2E, 0 8px 18px rgba(78,174,46,0.3)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const infoBox: CSSProperties = {
  marginTop: 18,
  padding: "14px 16px",
  borderRadius: 14,
  background: "#FFFBF0",
  border: "1px solid #EAF6FB",
  color: "#4A3728",
  fontSize: 14,
  lineHeight: 1.55,
};

const infoTitle: CSSProperties = {
  margin: "0 0 8px",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "0.95rem",
  color: "#4A3728",
};

const infoList: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: "#8A7868",
  fontSize: 14,
  lineHeight: 1.55,
};

/** Feature: kalkulator cairan rumatan (Holliday–Segar) — gaya v17. */
export function MaintenanceForm() {
  const [weight, setWeight] = useState("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    if (weight.trim() === "") {
      setError("Isi berat badan terlebih dahulu.");
      setRows([]);
      setCalculated(true);
      return;
    }
    try {
      const result = viewMaintenance(Number(weight));
      setRows(result.rows);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Input tidak valid");
      setRows([]);
    }
    setCalculated(true);
  }

  return (
    <div style={wrapStyle}>
      <NumberField
        label="⚖️ Berat Badan"
        value={weight}
        onValueChange={setWeight}
        placeholder="cth: 12.5"
        suffix="kg"
      />
      <button type="button" style={hitungBtn} onClick={hitung}>
        💧 Hitung Kebutuhan Cairan
      </button>
      {calculated ? <ResultList rows={rows} error={error} /> : null}
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang metode Holliday–Segar</h3>
        <ul style={infoList}>
          <li>10 kg pertama → 100 mL/kgBB/hari</li>
          <li>10 kg kedua (11–20 kg) → tambahan 50 mL/kgBB/hari</li>
          <li>Setiap kg di atas 20 kg → tambahan 20 mL/kgBB/hari</li>
        </ul>
        <p style={{ margin: "10px 0 0", color: "#8A7868", fontSize: 13 }}>
          Hasil adalah estimasi kebutuhan cairan rumatan harian dalam kondisi
          normal. Penyesuaian klinis tetap diperlukan.
        </p>
      </div>
    </div>
  );
}
