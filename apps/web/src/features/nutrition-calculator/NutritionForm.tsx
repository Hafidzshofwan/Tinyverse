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
  gap: 6,
  background: "#EAF6FB",
  borderRadius: 16,
  padding: 6,
  marginBottom: 18,
};

function tabBtn(active: boolean): CSSProperties {
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

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const hitungBtn: CSSProperties = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 16,
  background: "linear-gradient(135deg, #FFD23F, #FFE97A)",
  color: "#4A3728",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "1.05rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 0 #F5B700",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  marginTop: 4,
};

const autoBtn: CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: 16,
  border: "1px dashed #EAF6FB",
  background: "#FFFBF0",
  color: "#4A3728",
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: 4,
  textAlign: "left",
};

const resultBox: CSSProperties = {
  marginTop: 16,
  padding: 20,
  borderRadius: 18,
  background: "linear-gradient(135deg, #FFF6CC, #FFFDF1)",
  border: "3px dashed #F5B700",
  color: "#4A3728",
  lineHeight: 1.55,
  animation: "muncul 0.4s ease",
};

const resultTitle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#8A7868",
  fontWeight: 700,
  margin: "0 0 8px",
  fontFamily: "'Fredoka', sans-serif",
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

export function NutritionForm() {
  const [tab, setTab] = useState<Tab>("kalori");
  const [bb, setBb] = useState("");
  const [usia, setUsia] = useState("");
  const [vol, setVol] = useState("");
  const [feeds, setFeeds] = useState("");
  const [conc, setConc] = useState("0.67");

  const [kaloriResult, setKaloriResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeCalorieProtein>["result"];
  }>({ error: null, result: null });
  const [formulaResult, setFormulaResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeFormula>["result"];
  }>({ error: null, result: null });

  const bbNum = parseNum(bb);

  function hitungKalori() {
    const outcome = computeCalorieProtein(bbNum, parseNum(usia));
    setKaloriResult(outcome);
  }

  function isiOtomatis() {
    const v = autoFormulaVolume(bbNum);
    if (v != null) setVol(String(v));
  }

  function hitungFormula() {
    const outcome = computeFormula(
      parseNum(vol),
      parseNum(feeds),
      parseNum(conc),
    );
    setFormulaResult(outcome);
  }

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
          <button type="button" style={hitungBtn} onClick={hitungKalori}>
            🔥 Hitung Kebutuhan
          </button>
          {kaloriResult.error ? (
            <div
              style={{
                ...resultBox,
                borderColor: "#F8A5A5",
                background: "linear-gradient(135deg, #FFE0E0, #FFF7F7)",
              }}
            >
              <p style={{ margin: 0, color: "#E63946", fontWeight: 700 }}>
                {kaloriResult.error}
              </p>
            </div>
          ) : kaloriResult.result ? (
            <div style={resultBox}>
              <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
              <p style={{ margin: "0 0 6px", color: "#4A3728", fontSize: 15 }}>
                <b>Estimasi energi (Holliday–Segar):</b>{" "}
                {fmt(kaloriResult.result.maintenanceEnergyKcalPerDay, 0)}{" "}
                kkal/hari.
              </p>
              {kaloriResult.result.ageBased ? (
                <>
                  <p
                    style={{
                      margin: "0 0 6px",
                      color: "#4A3728",
                      fontSize: 15,
                    }}
                  >
                    <b>RDA per usia:</b>{" "}
                    {fmt(kaloriResult.result.rdaKcalPerDay, 0)} kkal/hari (
                    {fmt(kaloriResult.result.rdaKcalPerKg, 0)} kkal/kg ×{" "}
                    {fmt(kaloriResult.result.weightKg, 1)} kg).
                  </p>
                  <p style={{ margin: 0, color: "#4A3728", fontSize: 15 }}>
                    <b>Protein:</b> {fmt(kaloriResult.result.proteinGPerDay, 1)}{" "}
                    g/hari ({fmt(kaloriResult.result.proteinGPerKg, 2)} g/kg).
                  </p>
                </>
              ) : (
                <p style={{ margin: 0, color: "#8A7868", fontSize: 14 }}>
                  Isi usia untuk estimasi RDA per usia & protein.
                </p>
              )}
            </div>
          ) : null}
          <div style={infoBox}>
            <h3 style={infoTitle}>📐 Metode</h3>
            <ul style={infoList}>
              <li>
                Holliday–Segar: estimasi kebutuhan energi harian berdasarkan
                berat badan.
              </li>
              <li>
                RDA per usia: acuan intake energi & protein dari NBK/Kemenkes.
              </li>
              <li>Protein: 1,0–1,5 g/kgBB/hari (sesuaikan kondisi klinis).</li>
            </ul>
            <p style={{ margin: "10px 0 0", color: "#8A7868", fontSize: 13 }}>
              Estimasi edukatif; penyesuaian nutrisi harus disesuaikan dengan
              diagnosis dan kondisi pasien.
            </p>
          </div>
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
          <button type="button" style={autoBtn} onClick={isiOtomatis}>
            ↧ Isi otomatis 150 mL/kg dari berat pasien
          </button>
          {bbNum == null ? (
            <p style={{ margin: "8px 0 0", color: "#8A7868", fontSize: 13 }}>
              Isi &quot;Berat Badan&quot; di tab Kalori & Protein untuk memakai
              isi otomatis.
            </p>
          ) : null}
          <button type="button" style={hitungBtn} onClick={hitungFormula}>
            🍼 Hitung Takaran
          </button>
          {formulaResult.error ? (
            <div
              style={{
                ...resultBox,
                borderColor: "#F8A5A5",
                background: "linear-gradient(135deg, #FFE0E0, #FFF7F7)",
              }}
            >
              <p style={{ margin: 0, color: "#E63946", fontWeight: 700 }}>
                {formulaResult.error}
              </p>
            </div>
          ) : formulaResult.result ? (
            <div style={resultBox}>
              <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
              <p style={{ margin: "0 0 6px", color: "#4A3728", fontSize: 15 }}>
                <b>
                  Total: {fmt(formulaResult.result.totalVolumeMl, 0)} mL/hari
                </b>{" "}
                ≈ {fmt(formulaResult.result.totalKcalPerDay, 0)} kkal/hari.
              </p>
              <p style={{ margin: "0 0 6px", color: "#4A3728", fontSize: 15 }}>
                Perlu <b>{formulaResult.result.scoops} sendok takar</b> +{" "}
                <b>{fmt(formulaResult.result.waterMl, 0)} mL air matang</b>{" "}
                (patokan 1 sendok / 60 mL = 2 oz).
              </p>
              {formulaResult.result.perFeed ? (
                <p style={{ margin: 0, color: "#4A3728", fontSize: 15 }}>
                  <b>Per pemberian:</b>{" "}
                  {fmt(formulaResult.result.perFeed.volumeMl, 0)} mL ≈{" "}
                  {formulaResult.result.perFeed.scoops} sendok takar +{" "}
                  {fmt(formulaResult.result.perFeed.waterMl, 0)} mL air.
                </p>
              ) : null}
            </div>
          ) : null}
          <div style={infoBox}>
            <h3 style={infoTitle}>📐 Patokan</h3>
            <ul style={infoList}>
              <li>1 sendok takar susu formula bubar ≈ 60 mL air = 2 oz.</li>
              <li>
                Konsentrasi standar: 0,67 kkal/mL (ikuti petunjuk kemasan).
              </li>
              <li>
                Kebutuhan volume harian anak: ~150 mL/kgBB/hari (variasi per
                usia).
              </li>
            </ul>
            <h3 style={{ ...infoTitle, marginTop: 12 }}>📚 Sumber Rujukan</h3>
            <p style={{ margin: 0, color: "#8A7868", fontSize: 13 }}>
              Holliday-Segar; Kemenkes RI &quot;Pedoman Gizi Anak&quot;;
              petunjuk penyajian produk formula.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
