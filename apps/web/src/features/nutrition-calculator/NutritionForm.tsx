"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import {
  computeCalorieProtein,
  computeFormula,
  autoFormulaVolume,
  parseNum,
  fmt,
} from "@/entities/nutrition";

type Tab = "kalori" | "formula";

const tabWrap: CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 18,
  flexWrap: "wrap",
};

function tabBtn(active: boolean): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: 12,
    border: active
      ? "1px solid var(--hijau-tua)"
      : "1px solid var(--etail-line)",
    background: active ? "#E7F8DA" : "var(--putih)",
    color: active ? "#2f6b1f" : "var(--teks-lembut)",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const okCard: CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 14,
  background: "#E7F8DA",
  border: "1px solid #BFE6A3",
  color: "#2f6b1f",
  lineHeight: 1.55,
};

const neutralCard: CSSProperties = {
  marginTop: 16,
  padding: "14px 16px",
  borderRadius: 14,
  background: "var(--etail-soft)",
  color: "var(--teks-lembut)",
};

const hintStyle: CSSProperties = {
  marginTop: 8,
  color: "#8a5320",
  fontSize: ".85rem",
};

const subHint: CSSProperties = {
  marginTop: 10,
  display: "block",
  color: "var(--teks-lembut)",
  fontSize: ".8rem",
};

const autoBtn: CSSProperties = {
  marginTop: 4,
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid var(--etail-line)",
  background: "#DCF3FB",
  color: "#1c4e79",
  fontWeight: 700,
  cursor: "pointer",
};

export function NutritionForm() {
  const [tab, setTab] = useState<Tab>("kalori");
  const [bb, setBb] = useState("");
  const [usia, setUsia] = useState("");
  const [vol, setVol] = useState("");
  const [feeds, setFeeds] = useState("");
  const [conc, setConc] = useState("0.67");

  const bbNum = parseNum(bb);
  const calpro = computeCalorieProtein(bbNum, parseNum(usia));
  const formula = computeFormula(
    parseNum(vol),
    parseNum(feeds),
    parseNum(conc),
  );

  return (
    <div>
      <div style={tabWrap}>
        <button
          type="button"
          style={tabBtn(tab === "kalori")}
          onClick={() => setTab("kalori")}
        >
          🔥 Kalori & Protein
        </button>
        <button
          type="button"
          style={tabBtn(tab === "formula")}
          onClick={() => setTab("formula")}
        >
          🍼 Susu Formula
        </button>
      </div>

      {tab === "kalori" ? (
        <div>
          <div style={gridStyle}>
            <NumberField
              label="⚖️ Berat Badan"
              value={bb}
              onValueChange={setBb}
              placeholder="cth: 12"
              suffix="kg"
            />
            <NumberField
              label="👶 Usia"
              value={usia}
              onValueChange={setUsia}
              placeholder="cth: 24"
              suffix="bulan"
              step={1}
            />
          </div>
          {calpro.error ? (
            <div style={neutralCard}>{calpro.error}</div>
          ) : calpro.result ? (
            <div style={okCard}>
              <b>Estimasi energi (Holliday–Segar):</b>{" "}
              {fmt(calpro.result.maintenanceEnergyKcalPerDay, 0)} kkal/hari.
              {calpro.result.ageBased ? (
                <>
                  <br />
                  <b>RDA per usia:</b> {fmt(calpro.result.rdaKcalPerDay, 0)}{" "}
                  kkal/hari ({fmt(calpro.result.rdaKcalPerKg, 0)} kkal/kg ×{" "}
                  {fmt(calpro.result.weightKg, 1)} kg).
                  <br />
                  <b>Protein:</b> {fmt(calpro.result.proteinGPerDay, 1)} g/hari
                  ({fmt(calpro.result.proteinGPerKg, 2)} g/kg).
                </>
              ) : (
                <div style={hintStyle}>
                  Isi usia untuk estimasi RDA per usia & protein.
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <div style={gridStyle}>
            <NumberField
              label="🥛 Total volume susu / hari"
              value={vol}
              onValueChange={setVol}
              placeholder="cth: 800"
              suffix="mL"
            />
            <NumberField
              label="🍚 Jumlah pemberian / hari"
              value={feeds}
              onValueChange={setFeeds}
              placeholder="cth: 8"
              step={1}
            />
            <NumberField
              label="⚡ Konsentrasi energi"
              value={conc}
              onValueChange={setConc}
              placeholder="0.67"
              suffix="kkal/mL"
            />
          </div>
          <button
            type="button"
            style={autoBtn}
            onClick={() => {
              const v = autoFormulaVolume(bbNum);
              if (v != null) setVol(String(v));
            }}
          >
            ⇧ Isi otomatis 150 mL/kg dari berat
          </button>
          {bbNum == null ? (
            <span style={subHint}>
              Isi &quot;Berat Badan&quot; di tab Kalori &amp; Protein untuk memakai isi
              otomatis.
            </span>
          ) : null}
          {formula.error ? (
            <div style={neutralCard}>{formula.error}</div>
          ) : formula.result ? (
            <div style={okCard}>
              <b>Total: {fmt(formula.result.totalVolumeMl, 0)} mL/hari</b> ≈{" "}
              {fmt(formula.result.totalKcalPerDay, 0)} kkal/hari.
              <br />
              Perlu <b>{formula.result.scoops} sendok takar</b> +{" "}
              <b>{fmt(formula.result.waterMl, 0)} mL air matang</b> (patokan 1
              sendok / 60 mL = 2 oz).
              {formula.result.perFeed ? (
                <>
                  <br />
                  <b>Per pemberian:</b>{" "}
                  {fmt(formula.result.perFeed.volumeMl, 0)} mL ≈{" "}
                  {formula.result.perFeed.scoops} sendok takar +{" "}
                  {fmt(formula.result.perFeed.waterMl, 0)} mL air.
                </>
              ) : null}
              <span style={subHint}>
                Ikuti petunjuk penyajian pada kemasan produk.
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
