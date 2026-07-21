"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewPlanB } from "@/entities/fluid";
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
  background: "linear-gradient(135deg, #F9D85C, #FFE97A)",
  color: "#0A0B4F",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 0 #E7B900, 0 8px 18px rgba(233, 185, 0, 0.3)",
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
  color: "#E7B900",
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
  background: "linear-gradient(135deg, #FFF6CC, #FFFDF1)",
  border: "3px dashed #E7B900",
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

/** Feature: Rencana B (rehidrasi ringan–sedang) — gaya v17. */
export function PlanBForm() {
  const [weight, setWeight] = useState("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    const result = viewPlanB(weight === "" ? NaN : Number(weight));
    setRows(result.rows);
    setError(result.error);
    setTotal(result.total ? `${result.total} mL` : "");
    setDuration(result.duration ? `${result.duration} jam` : "");
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
        <button type="button" style={hitungBtn} onClick={hitung}>
          🩹 Hitung Rencana B
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
                  color: "#E7B900",
                  fontSize: "1.5rem",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                }}
              >
                Dosis total: {total}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#0A0B4F",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Diberikan dalam {duration}
              </p>
              <ResultList rows={rows} error={null} />
            </div>
          )
        ) : null}
      </div>
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Tentang Rencana Terapi B</h3>
        <ul style={infoList}>
          <li>Dosis total: 75 mL/kgBB</li>
          <li>Diberikan dalam: 3 jam</li>
          <li>Untuk dehidrasi ringan–sedang</li>
        </ul>
        <p style={catatan}>
          Untuk dehidrasi ringan–sedang. Cairan diberikan sedikit-sedikit tapi
          sering secara oral/nasogastrik. Nilai ulang setiap 1–2 jam.
        </p>
      </div>
    </div>
  );
}
