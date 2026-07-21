"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewDrip } from "@/entities/fluid";
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

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 6,
  background: "#EAF6FB",
  borderRadius: 16,
  padding: 6,
  marginBottom: 18,
};

function dripTabBtn(active: boolean): CSSProperties {
  return {
    flex: 1,
    border: "none",
    borderRadius: 10,
    background: active ? "#0A0B5F" : "transparent",
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: "0.88rem",
    color: active ? "#FFFFFF" : "rgba(10, 11, 95, 0.62)",
    padding: "11px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    boxShadow: active ? "0 3px 0 #090A4E" : "none",
  };
}

/** Feature: kalkulator faktor tetes — gaya v17. */
export function DripForm() {
  const [volume, setVolume] = useState("");
  const [hours, setHours] = useState("");
  const [factor, setFactor] = useState<"macro" | "micro">("macro");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    const result = viewDrip(
      volume === "" ? NaN : Number(volume),
      hours === "" ? NaN : Number(hours),
      factor,
    );
    setRows(result.rows);
    setError(result.error);
    setCalculated(true);
  }

  return (
    <div>
      <div style={cardStyle}>
        <div style={tabWrap}>
          <button
            type="button"
            style={dripTabBtn(factor === "macro")}
            onClick={() => setFactor("macro")}
          >
            Makro drip
            <br />
            <small style={{ fontSize: "0.72rem" }}>20 tpm/mL</small>
          </button>
          <button
            type="button"
            style={dripTabBtn(factor === "micro")}
            onClick={() => setFactor("micro")}
          >
            Mikro drip
            <br />
            <small style={{ fontSize: "0.72rem" }}>60 tpm/mL</small>
          </button>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <NumberField
            label="💧 Kebutuhan Cairan"
            value={volume}
            onValueChange={setVolume}
            placeholder="cth: 500"
            suffix="mL"
          />
          <NumberField
            label="⏱️ Lama Pemberian"
            value={hours}
            onValueChange={setHours}
            placeholder="cth: 8"
            suffix="jam"
          />
        </div>
        <button type="button" style={hitungBtn} onClick={hitung}>
          💉 Hitung Faktor Tetes
        </button>
        {calculated ? <ResultList rows={rows} error={error} /> : null}
      </div>
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Rumus faktor tetes</h3>
        <ul style={infoList}>
          <li>
            Tetes/menit = volume cairan (mL) × faktor tetes ÷ waktu (menit)
          </li>
          <li>Makro drip umum: 20 tetes/mL</li>
          <li>Mikro drip umum: 60 tetes/mL</li>
        </ul>
        <p style={catatan}>
          Hasil adalah estimasi kecepatan tetesan manual. Sesuaikan dengan drip
          set yang benar-benar digunakan dan kondisi klinis pasien.
        </p>
      </div>
    </div>
  );
}
