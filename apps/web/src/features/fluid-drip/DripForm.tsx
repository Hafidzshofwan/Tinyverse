"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { viewDrip, type DripType } from "../../entities/fluid";
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

const DRIP_TYPES: ReadonlyArray<{
  id: DripType;
  label: string;
  detail: string;
}> = [
  { id: "makro", label: "Makro drip", detail: "20 tpm/mL" },
  { id: "mikro", label: "Mikro drip", detail: "60 tpm/mL" },
];

/** Feature: kalkulator laju tetes infus (makro/mikro) — gaya v17. */
export function DripForm() {
  const [volume, setVolume] = useState("");
  const [hours, setHours] = useState("");
  const [dripType, setDripType] = useState<DripType>("makro");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    if (volume.trim() === "" || hours.trim() === "") {
      setError("Isi volume dan lama pemberian.");
      setRows([]);
      setCalculated(true);
      return;
    }
    try {
      const result = viewDrip(Number(volume), Number(hours), dripType);
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
        label="💧 Volume Cairan"
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
      <div role="group" aria-label="Jenis drip" style={toggleWrap}>
        {DRIP_TYPES.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDripType(opt.id)}
            style={toggleBtn(dripType === opt.id)}
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
        💉 Hitung Faktor Tetes
      </button>
      {calculated ? <ResultList rows={rows} error={error} /> : null}
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Rumus faktor tetes</h3>
        <ul style={infoList}>
          <li>
            Tetes/menit = volume cairan (mL) × faktor tetes ÷ waktu (menit)
          </li>
          <li>Makro drip umum: 20 tetes/mL</li>
          <li>Mikro drip umum: 60 tetes/mL</li>
        </ul>
        <p style={{ margin: "10px 0 0", color: "#8A7868", fontSize: 13 }}>
          Hasil adalah estimasi kecepatan tetesan manual. Sesuaikan dengan drip
          set yang dipakai dan kondisi klinis pasien.
        </p>
      </div>
    </div>
  );
}
