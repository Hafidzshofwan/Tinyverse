"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewPlanC } from "@/entities/fluid";
import type { PlanCAgeCategory } from "@/entities/fluid";
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
  background: "linear-gradient(135deg, #E63946, #FF7A7A)",
  color: "white",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 0 #B71C1C, 0 8px 18px rgba(230, 57, 70, 0.3)",
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
  color: "#B71C1C",
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

const resultCard: CSSProperties = {
  marginTop: 16,
  padding: 20,
  borderRadius: 18,
  background: "linear-gradient(135deg, #FFE0E0, #FFF7F7)",
  border: "3px dashed #E63946",
  color: "#0A0B4F",
  lineHeight: 1.55,
  animation: "muncul 0.4s ease",
};

const resultTitle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#667085",
  fontWeight: 700,
  margin: "0 0 10px",
  fontFamily: "'Fredoka', sans-serif",
};

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 6,
  background: "#EAF6FB",
  borderRadius: 16,
  padding: 6,
  marginBottom: 18,
};

function ageTabBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    border: "none",
    borderRadius: 10,
    background: active ? "#E63946" : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: "0.88rem",
    color: active ? "#FFFFFF" : "rgba(10, 11, 95, 0.62)",
    padding: "11px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    boxShadow: active ? "0 3px 0 #B71C1C" : "none",
  };
}

/** Feature: Rencana C (dehidrasi berat) — gaya v17. */
export function PlanCForm() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState<PlanCAgeCategory>("anak");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    const result = viewPlanC(weight === "" ? NaN : Number(weight), age);
    setRows(result.rows);
    setError(result.error);
    setTotal(result.total != null ? `${result.total} mL` : "");
    setCalculated(true);
  }

  return (
    <div>
      <div style={cardStyle}>
        <NumberField
          label="⚖️ Berat Badan (kg)"
          value={weight}
          onValueChange={setWeight}
          placeholder="cth: 12"
          suffix=""
        />
        <div style={tabWrap}>
          <button
            type="button"
            style={ageTabBtn(age === "bayi")}
            onClick={() => setAge("bayi")}
          >
            Bayi
            <br />
            <small style={{ fontSize: "0.72rem" }}>&lt; 1 tahun</small>
          </button>
          <button
            type="button"
            style={ageTabBtn(age === "anak")}
            onClick={() => setAge("anak")}
          >
            Anak
            <br />
            <small style={{ fontSize: "0.72rem" }}>≥ 1 tahun</small>
          </button>
        </div>
        <button type="button" style={hitungBtn} onClick={hitung}>
          🩹 Hitung Rencana C
        </button>
        {calculated ? (
          error ? (
            <ResultList rows={[]} error={error} />
          ) : (
            <div style={resultCard}>
              <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
              <p
                style={{
                  margin: 0,
                  color: "#B71C1C",
                  fontSize: "1.5rem",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                }}
              >
                Dosis total: {total}
              </p>
              <ResultList rows={rows} error={null} />
            </div>
          )
        ) : null}
      </div>
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang Rencana Terapi C</h3>
        <ul style={infoList}>
          <li>Dosis total: 100 mL/kgBB, diberikan dalam 2 tahap</li>
          <li>Bayi (&lt; 1 tahun): Tahap 1 → 30 mL/kg, Tahap 2 → 70 mL/kg</li>
          <li>Anak (≥ 1 tahun): Tahap 1 → 30 mL/kg, Tahap 2 → 70 mL/kg</li>
        </ul>
        <p style={catatan}>
          Untuk dehidrasi berat, jalur IV. Nilai ulang anak setiap 1–2 jam; jika
          hidrasi belum membaik, ulangi tahap 1.
        </p>
      </div>
    </div>
  );
}
