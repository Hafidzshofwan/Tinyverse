"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";
import { NumberField, ResultList } from "@/shared/ui";
import { BURN_REGION_GROUPS, viewBurn } from "@/entities/burn";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const groupStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const groupTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--teks)",
};
const chipWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};
const chipBase: CSSProperties = {
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 999,
  border: "1px solid var(--etail-line)",
  background: "var(--putih)",
  color: "var(--teks)",
  cursor: "pointer",
};
const chipActive: CSSProperties = {
  ...chipBase,
  background: "var(--etail-magenta)",
  borderColor: "var(--etail-magenta)",
  color: "#FFFFFF",
};
const summaryStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "var(--teks-lembut)",
};
const resetStyle: CSSProperties = {
  alignSelf: "flex-start",
  padding: "6px 12px",
  fontSize: 13,
  borderRadius: 10,
  border: "1px solid var(--etail-line)",
  background: "var(--putih)",
  color: "var(--teks)",
  cursor: "pointer",
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

  return (
    <div style={wrapStyle}>
      <NumberField
        label="👶 Usia"
        value={usia}
        onValueChange={setUsia}
        suffix="tahun"
      />
      <NumberField
        label="⚖️ Berat badan"
        value={berat}
        onValueChange={setBerat}
        suffix="kg"
      />

      {BURN_REGION_GROUPS.map((group) => (
        <div key={group.title} style={groupStyle}>
          <span style={groupTitleStyle}>{group.title}</span>
          <div style={chipWrapStyle}>
            {group.options.map((opt) => {
              const aktif = selectedSet.has(opt.area);
              return (
                <button
                  key={opt.area}
                  type="button"
                  aria-pressed={aktif}
                  onClick={() => toggle(opt.area)}
                  style={aktif ? chipActive : chipBase}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

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
          Reset area
        </button>
      ) : null}

      <ResultList rows={view.rows} error={view.error} />
    </div>
  );
}
