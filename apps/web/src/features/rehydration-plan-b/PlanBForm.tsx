"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewPlanB } from "../../entities/fluid";
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
  background: "linear-gradient(135deg, #E63946, #FF7A7A)",
  color: "white",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 0 #B71C1C",
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

/** Feature: rehidrasi Rencana B (75 mL/kg dalam 3 jam) — gaya v17. */
export function PlanBForm() {
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
      const result = viewPlanB(Number(weight));
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
        placeholder="cth: 8"
        suffix="kg"
      />
      <button type="button" style={hitungBtn} onClick={hitung}>
        🩹 Hitung Rencana B
      </button>
      {calculated ? <ResultList rows={rows} error={error} /> : null}
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang Rencana Terapi B</h3>
        <ul style={infoList}>
          <li>Dipakai untuk diare dengan dehidrasi ringan–sedang.</li>
          <li>Total cairan: 75 mL/kgBB selama 3 jam.</li>
          <li>Berikan secara cepat lalu evaluasi kembali status hidrasi.</li>
        </ul>
        <p style={{ margin: "10px 0 0", color: "#8A7868", fontSize: 13 }}>
          Sumber: WHO/IDAI — Lima Lintas Tatalaksana Diare. Pastikan pasien
          dapat minum dan tidak ada tanda bahaya.
        </p>
      </div>
    </div>
  );
}
