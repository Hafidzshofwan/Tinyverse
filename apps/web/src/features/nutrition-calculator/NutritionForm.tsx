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

const card: CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 26,
  padding: "clamp(16px,2.5vw,24px)",
  border: "1px solid rgba(10,11,95,0.07)",
  boxShadow: "0 18px 44px rgba(10,11,95,0.10)",
  marginBottom: 14,
};
const info: CSSProperties = {
  ...card,
  color: "rgba(10,11,95,0.62)",
  fontSize: 14,
  lineHeight: 1.68,
};
const infoTitle: CSSProperties = {
  margin: "0 0 8px",
  fontFamily: "'Fredoka',sans-serif",
  fontSize: "0.78rem",
  color: "#0B0C63",
  fontWeight: 700,
};
const infoList: CSSProperties = {
  margin: "0 0 12px",
  paddingLeft: 20,
  color: "rgba(10,11,95,0.62)",
  fontSize: 14,
  lineHeight: 1.5,
};
const catatan: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(10,11,95,0.62)",
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
const tabBtn = (active: boolean): CSSProperties => ({
  flex: 1,
  border: "none",
  borderRadius: 10,
  background: active ? "#0A0B5F" : "transparent",
  fontFamily: "'Fredoka',sans-serif",
  fontWeight: 700,
  fontSize: "0.88rem",
  color: active ? "#FFFFFF" : "rgba(10,11,95,0.62)",
  padding: "11px 10px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "center",
  lineHeight: 1.3,
  boxShadow: active ? "0 3px 0 #090A4E" : "none",
});
const hitungBtn: CSSProperties = {
  width: "100%",
  padding: 15,
  border: "none",
  borderRadius: 16,
  background: "linear-gradient(135deg,#E23CA7,#D936A6)",
  color: "white",
  fontFamily: "'Fredoka',sans-serif",
  fontSize: "1.05rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 5px 0 #C5228D, 0 8px 18px rgba(217,54,166,0.3)",
  transition: "transform 0.15s ease,box-shadow 0.15s ease",
  marginTop: 4,
};
const autoBtn: CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: 16,
  border: "1px dashed rgba(10,11,95,0.09)",
  background: "white",
  color: "#0A0B5F",
  fontFamily: "'Fredoka',sans-serif",
  fontSize: "0.95rem",
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 4,
  marginBottom: 14,
  textAlign: "left",
};
const resultBox: CSSProperties = {
  marginTop: 16,
  padding: 20,
  borderRadius: 18,
  background: "linear-gradient(135deg,#FFF6CC,#FFFDF1)",
  border: "3px dashed #E7B900",
  color: "#0A0B4F",
  lineHeight: 1.55,
  animation: "muncul 0.4s ease",
};
const resultTitle: CSSProperties = {
  fontSize: "0.85rem",
  color: "#667085",
  fontWeight: 700,
  margin: "0 0 8px",
  fontFamily: "'Fredoka',sans-serif",
};
const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 14,
};

export function NutritionForm() {
  const [tab, setTab] = useState<Tab>("kalori");
  const [bb, setBb] = useState("");
  const [usia, setUsia] = useState("");
  const [vol, setVol] = useState("");
  const [feeds, setFeeds] = useState("");
  const [conc, setConc] = useState("0.67");
  const [kResult, setKResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeCalorieProtein>["result"];
  }>({ error: null, result: null });
  const [fResult, setFResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeFormula>["result"];
  }>({ error: null, result: null });
  const bbNum = parseNum(bb);

  return (
    <div>
      <div style={card}>
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
            <div style={grid}>
              <NumberField
                label="Berat Badan (kg)"
                value={bb}
                onValueChange={setBb}
                placeholder="cth: 12"
                suffix=""
              />
              <NumberField
                label="Usia (bulan)"
                value={usia}
                onValueChange={setUsia}
                placeholder="cth: 24"
                suffix=""
                step={1}
              />
            </div>
            <button
              type="button"
              style={hitungBtn}
              onClick={() =>
                setKResult(computeCalorieProtein(bbNum, parseNum(usia)))
              }
            >
              🔥 Hitung Kebutuhan
            </button>
            {kResult.error ? (
              <div
                style={{
                  ...resultBox,
                  borderColor: "#E63946",
                  background: "linear-gradient(135deg,#FFE0E0,#FFF7F7)",
                }}
              >
                <p style={{ margin: 0, color: "#E63946", fontWeight: 700 }}>
                  {kResult.error}
                </p>
              </div>
            ) : null}
            {kResult.result ? (
              <div style={resultBox}>
                <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#0A0B4F",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Estimasi energi (Holliday–Segar):{" "}
                  {fmt(kResult.result.maintenanceEnergyKcalPerDay, 0)}{" "}
                  kkal/hari.
                </p>
                {kResult.result.ageBased ? (
                  <>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#0A0B4F",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      RDA per usia: {fmt(kResult.result.rdaKcalPerDay, 0)}{" "}
                      kkal/hari ({fmt(kResult.result.rdaKcalPerKg, 0)} kkal/kg ×{" "}
                      {fmt(kResult.result.weightKg, 1)} kg).
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#0A0B4F",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      Protein: {fmt(kResult.result.proteinGPerDay, 1)} g/hari (
                      {fmt(kResult.result.proteinGPerKg, 2)} g/kg).
                    </p>
                  </>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      color: "#667085",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Isi usia untuk estimasi RDA per usia & protein.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div style={grid}>
              <NumberField
                label="Total volume susu / hari (mL)"
                value={vol}
                onValueChange={setVol}
                placeholder="cth: 800"
                suffix=""
              />
              <NumberField
                label="Jumlah pemberian / hari"
                value={feeds}
                onValueChange={setFeeds}
                placeholder="cth: 8"
                suffix=""
                step={1}
              />
              <NumberField
                label="Konsentrasi energi (kkal/mL)"
                value={conc}
                onValueChange={setConc}
                placeholder="0.67"
                suffix=""
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
              ↧ Isi otomatis 150 mL/kg dari berat pasien
            </button>
            {bbNum == null ? (
              <p
                style={{
                  margin: "0 0 14px",
                  color: "#667085",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Isi &quot;Berat Badan&quot; di tab Kalori & Protein untuk
                memakai isi otomatis.
              </p>
            ) : null}
            <button
              type="button"
              style={hitungBtn}
              onClick={() =>
                setFResult(
                  computeFormula(
                    parseNum(vol),
                    parseNum(feeds),
                    parseNum(conc),
                  ),
                )
              }
            >
              🍼 Hitung Takaran
            </button>
            {fResult.error ? (
              <div
                style={{
                  ...resultBox,
                  borderColor: "#E63946",
                  background: "linear-gradient(135deg,#FFE0E0,#FFF7F7)",
                }}
              >
                <p style={{ margin: 0, color: "#E63946", fontWeight: 700 }}>
                  {fResult.error}
                </p>
              </div>
            ) : null}
            {fResult.result ? (
              <div style={resultBox}>
                <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#0A0B4F",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Total: {fmt(fResult.result.totalVolumeMl, 0)} mL/hari ≈{" "}
                  {fmt(fResult.result.totalKcalPerDay, 0)} kkal/hari.
                </p>
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#0A0B4F",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Perlu <b>{fResult.result.scoops} sendok takar</b> +{" "}
                  <b>{fmt(fResult.result.waterMl, 0)} mL air matang</b> (1
                  sendok / 60 mL = 2 oz).
                </p>
                {fResult.result.perFeed ? (
                  <p
                    style={{
                      margin: 0,
                      color: "#0A0B4F",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Per pemberian: {fmt(fResult.result.perFeed.volumeMl, 0)} mL
                    ≈ {fResult.result.perFeed.scoops} sendok takar +{" "}
                    {fmt(fResult.result.perFeed.waterMl, 0)} mL air.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {tab === "kalori" ? (
        <div style={info}>
          <h3 style={infoTitle}>📐 Metode</h3>
          <ul style={infoList}>
            <li>
              Estimasi energi (Holliday–Segar): 100 kkal/kg (≤10 kg) + 50
              kkal/kg (11–20 kg) + 20 kkal/kg (&gt;20 kg).
            </li>
            <li>
              RDA per usia: acuan intake energi & protein dari NBK/Kemenkes.
            </li>
            <li>Protein: 1,0–1,5 g/kgBB/hari (sesuaikan kondisi klinis).</li>
          </ul>
          <p style={catatan}>
            Estimasi edukatif; penyesuaian nutrisi harus disesuaikan dengan
            diagnosis dan kondisi pasien.
          </p>
        </div>
      ) : (
        <div style={info}>
          <h3 style={infoTitle}>📐 Patokan</h3>
          <ul style={infoList}>
            <li>1 sendok takar susu formula bubur ≈ 60 mL air = 2 oz.</li>
            <li>Konsentrasi standar: 0,67 kkal/mL (ikuti petunjuk kemasan).</li>
            <li>
              Kebutuhan volume harian anak: ~150 mL/kgBB/hari (variasi per
              usia).
            </li>
          </ul>
          <p style={catatan}>
            SELALU ikuti petunjuk penyajian pada kemasan; takaran dapat berbeda
            antar merek.
          </p>
        </div>
      )}

      <div style={info}>
        <h3 style={infoTitle}>📚 Sumber Rujukan</h3>
        <ul style={infoList}>
          <li>Estimasi energi rumatan: Holliday & Segar, Pediatrics 1957.</li>
          <li>Kebutuhan protein & kalori per usia: Kemenkes RI / NBK.</li>
          <li>Takaran rekonstitusi formula: petunjuk penyajian produk.</li>
        </ul>
        <p style={catatan}>
          Disclaimer: estimasi kebutuhan nutrisi & takaran formula, bukan
          pengganti penilaian klinis.
        </p>
      </div>
    </div>
  );
}
