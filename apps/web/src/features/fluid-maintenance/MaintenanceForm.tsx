"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewMaintenance } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  marginBottom: 14,
};

const hitungBtn: CSSProperties = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 16,
  background: "linear-gradient(135deg, #E23CA7, #D936A6)",
  color: "white",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 5px 0 #C5228D, 0 8px 18px rgba(217, 54, 166, 0.3)",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const infoBox: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  color: "rgba(10, 11, 95, 0.62)",
  fontSize: 14,
  lineHeight: 1.68,
};

const infoTitle: CSSProperties = {
  margin: "0 0 8px",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "0.78rem",
  color: "#0B0C63",
  fontWeight: 700,
};

const infoList: CSSProperties = {
  margin: "0 0 12px",
  paddingLeft: 20,
  color: "rgba(10, 11, 95, 0.62)",
  fontSize: 14,
  lineHeight: 1.5,
};

const catatan: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(10, 11, 95, 0.62)",
  fontSize: 13,
  fontStyle: "italic",
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
    <div>
      <div style={cardStyle}>
        <NumberField
          label="⚖️ Berat Badan (kg)"
          value={weight}
          onValueChange={setWeight}
          placeholder="cth: 12.5"
          suffix=""
        />
        <button type="button" style={hitungBtn} onClick={hitung}>
          💧 Hitung Kebutuhan Cairan
        </button>
        {calculated ? <ResultList rows={rows} error={error} /> : null}
      </div>
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang metode Holliday–Segar</h3>
        <ul style={infoList}>
          <li>10 kg pertama → 100 mL/kgBB/hari</li>
          <li>10 kg kedua (11–20 kg) → tambahan 50 mL/kgBB/hari</li>
          <li>Setiap kg di atas 20 kg → tambahan 20 mL/kgBB/hari</li>
        </ul>
        <p style={catatan}>
          Hasil adalah estimasi kebutuhan cairan rumatan harian dalam kondisi
          normal (tanpa dehidrasi/kehilangan cairan tambahan). Penyesuaian
          klinis tetap diperlukan sesuai kondisi pasien.
        </p>
      </div>
    </div>
  );
}
