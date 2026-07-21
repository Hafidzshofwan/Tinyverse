"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";
import { NumberField, ResultList } from "@/shared/ui";
import { viewBurn } from "@/entities/burn";
import { BurnSvgMap } from "./BurnSvgMap";

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px, 2.5vw, 24px)",
  border: "1px solid rgba(10, 11, 95, 0.07)",
  boxShadow: "0 18px 44px rgba(10, 11, 95, 0.10)",
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1rem",
  color: "#0A0B5F",
  margin: "0 0 14px",
  fontWeight: 700,
};

const rowGroup: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginBottom: 8,
};

const summaryStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 13,
  color: "rgba(10, 11, 95, 0.62)",
  fontWeight: 700,
  fontFamily: "'Quicksand', sans-serif",
};

const resetStyle: CSSProperties = {
  alignSelf: "flex-start",
  padding: "9px 14px",
  fontSize: 13,
  borderRadius: 999,
  border: "1px solid rgba(10, 11, 95, 0.08)",
  background: "white",
  color: "#0A0B5F",
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontWeight: 900,
  boxShadow: "0 8px 18px rgba(10, 11, 95, 0.08)",
  marginTop: 10,
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
  color: "#E67818",
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

const promptStyle: CSSProperties = {
  margin: "10px 0 0",
  padding: 12,
  borderRadius: 12,
  background: "rgba(10, 11, 95, 0.05)",
  color: "rgba(10, 11, 95, 0.72)",
  fontSize: 13,
  fontWeight: 700,
};

export function BurnForm() {
  const [usia, setUsia] = useState("");
  const [berat, setBerat] = useState("");
  const [selected, setSelected] = useState<ReadonlyArray<BurnArea>>([]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(area: BurnArea) {
    setSelected((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  const view = useMemo(
    () => viewBurn(selected, usia, berat),
    [selected, usia, berat],
  );

  const inputsReady = usia.trim() !== "" && berat.trim() !== "";

  return (
    <div>
      <div style={cardStyle}>
        <h3 style={titleStyle}>🔥 Rehidrasi Luka Bakar</h3>
        <div style={rowGroup}>
          <NumberField
            label="👶 Usia (tahun)"
            value={usia}
            onValueChange={setUsia}
            suffix=""
            step={1}
          />
          <NumberField
            label="⚖️ Berat Badan (kg)"
            value={berat}
            onValueChange={setBerat}
            suffix=""
          />
        </div>

        {!inputsReady ? (
          <p style={promptStyle}>
            Isi usia dan berat badan pasien terlebih dahulu, lalu klik area luka
            pada peta tubuh di bawah.
          </p>
        ) : null}

        <BurnSvgMap selected={selected} onToggle={toggle} />

        <p style={summaryStyle}>
          {selected.length} area terpilih · Luas luka{" "}
          {view.tbsaPercent.toFixed(1)}% TBSA
        </p>

        {selected.length > 0 ? (
          <button
            type="button"
            style={resetStyle}
            onClick={() => setSelected([])}
          >
            ↺ Reset pilihan area
          </button>
        ) : null}

        <ResultList rows={view.rows} error={view.error} />
      </div>
      <div style={infoBox}>
        <h3 style={infoTitle}>📐 Rumus yang digunakan</h3>
        <ul style={infoList}>
          <li>TBSA: Lund-Browder sesuai chart.</li>
          <li>Parkland: 4 × BB × %TBSA = cairan resusitasi 24 jam pertama.</li>
          <li>
            Pembagian: 50% dalam 8 jam pertama, 50% dalam 16 jam berikutnya.
          </li>
          <li>
            Maintenance: Holliday–Segar ditambahkan ke kebutuhan resusitasi.
          </li>
        </ul>
        <p style={catatan}>
          Gunakan sebagai alat bantu hitung cepat. Pilih hanya area luka bakar
          derajat 2/3. Penyesuaian klinis tetap diperlukan.
        </p>
      </div>
    </div>
  );
}
