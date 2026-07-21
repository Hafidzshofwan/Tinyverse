"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewPlanC, type PlanCAgeCategory } from "../../entities/fluid";
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

const toggleWrap: CSSProperties = {
  display: "flex",
  gap: 6,
  background: "#EAF6FB",
  borderRadius: 16,
  padding: 6,
  marginBottom: 4,
};

function toggleBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    border: "none",
    background: active ? "#54C6EB" : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600,
    fontSize: "0.88rem",
    color: active ? "white" : "#8A7868",
    padding: "11px 10px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    lineHeight: 1.3,
    boxShadow: active ? "0 3px 0 #2BA9D6" : "none",
  };
}

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

const AGE_OPTIONS: ReadonlyArray<{
  id: PlanCAgeCategory;
  label: string;
  detail: string;
}> = [
  { id: "bayi", label: "Bayi", detail: "di bawah 1 th" },
  { id: "anak", label: "Anak", detail: "1 th ke atas" },
];

/** Feature: rehidrasi Rencana C (tahap 30 lalu 70 mL/kg) — gaya v17. */
export function PlanCForm() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState<PlanCAgeCategory>("bayi");
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
      const result = viewPlanC(Number(weight), age);
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
      <div role="group" aria-label="Kategori usia" style={toggleWrap}>
        {AGE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setAge(opt.id)}
            style={toggleBtn(age === opt.id)}
          >
            {opt.label}
            <br />
            <small style={{ fontSize: "0.72rem", opacity: 0.9 }}>
              {opt.detail}
            </small>
          </button>
        ))}
      </div>
      <button type="button" style={hitungBtn} onClick={hitung}>
        🩹 Hitung Rencana C
      </button>
      {calculated ? <ResultList rows={rows} error={error} /> : null}
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang Rencana Terapi C</h3>
        <ul style={infoList}>
          <li>Dipakai untuk diare dengan dehidrasi berat.</li>
          <li>
            Tahap 1: 30 mL/kgBB diberikan dalam 1 jam (bayi) atau 30 menit
            (anak).
          </li>
          <li>
            Tahap 2: 70 mL/kgBB diberikan dalam 5 jam (bayi) atau 2,5 jam
            (anak).
          </li>
        </ul>
        <p style={{ margin: "10px 0 0", color: "#8A7868", fontSize: 13 }}>
          Sumber: WHO/IDAI — Lima Lintas Tatalaksana Diare. Lakukan di fasilitas
          kesehatan dengan monitoring ketat.
        </p>
      </div>
    </div>
  );
}
