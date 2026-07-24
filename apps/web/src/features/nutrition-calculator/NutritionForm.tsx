"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  computeCalorieProtein,
  computeFormula,
  autoFormulaVolume,
  parseNum,
  fmt,
} from "@/entities/nutrition";

type Tab = "kalori" | "formula";

const autoBtn: CSSProperties = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: 14,
  border: "2px dashed rgba(10,11,95,0.16)",
  background: "#f5faff",
  color: "var(--navy)",
  fontFamily: "'Quicksand',sans-serif",
  fontSize: "0.9rem",
  fontWeight: 800,
  cursor: "pointer",
  marginBottom: 12,
  textAlign: "left",
};
const resultTitle: CSSProperties = {
  fontSize: "0.78rem",
  color: "var(--navy)",
  fontWeight: 800,
  letterSpacing: "0.04em",
  margin: "0 0 10px",
  fontFamily: "'Fredoka','Quicksand',sans-serif",
};
const resultText: CSSProperties = {
  margin: "0 0 6px",
  color: "var(--navy-soft)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.5,
};
const errorBoxStyle: CSSProperties = {
  border: "2px solid #e63946",
  background: "linear-gradient(135deg,#ffe0e0,#fff7f7)",
};

export function NutritionForm() {
  const [tab, setTab] = useState<Tab>("kalori");
  const profile = usePatientProfile();
  const [bb, setBb] = useSyncedField(profile.bb);
  const [usia, setUsia] = useSyncedField(profile.usiaBulan);
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
  const [ditambahkan, setDitambahkan] = useState(false);
  const bbNum = parseNum(bb);

  return (
    <div>
      <div className="kartu">
        <div className="segmented-toggle" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className={`segmented-btn ${tab === "kalori" ? "aktif" : ""}`}
            onClick={() => setTab("kalori")}
          >
            🔥 Kalori &amp; Protein
          </button>
          <button
            type="button"
            className={`segmented-btn ${tab === "formula" ? "aktif" : ""}`}
            onClick={() => setTab("formula")}
          >
            🍼 Susu Formula
          </button>
        </div>

        {tab === "kalori" ? (
          <div>
            <div className="form-row-group">
              <NumberField
                label="Berat Badan (kg)"
                value={bb}
                onValueChange={setBb}
                placeholder="cth: 12"
              />
              <NumberField
                label="Usia (bulan)"
                value={usia}
                onValueChange={setUsia}
                placeholder="cth: 24"
                step={1}
              />
            </div>
            <button
              type="button"
              className="btn-hitung"
              onClick={() =>
                setKResult(computeCalorieProtein(bbNum, parseNum(usia)))
              }
            >
              🔥 Hitung Kebutuhan
            </button>
            {kResult.error ? (
              <div className="hasil-box-cairan" style={errorBoxStyle}>
                <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
                  {kResult.error}
                </p>
              </div>
            ) : null}
            {kResult.result ? (
              <div className="hasil-box-cairan">
                <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
                <p style={resultText}>
                  Estimasi energi (Holliday–Segar):{" "}
                  {fmt(kResult.result.maintenanceEnergyKcalPerDay, 0)}{" "}
                  kkal/hari.
                </p>
                {kResult.result.ageBased ? (
                  <>
                    <p style={resultText}>
                      RDA per usia: {fmt(kResult.result.rdaKcalPerDay, 0)}{" "}
                      kkal/hari ({fmt(kResult.result.rdaKcalPerKg, 0)} kkal/kg ×{" "}
                      {fmt(kResult.result.weightKg, 1)} kg).
                    </p>
                    <p style={{ ...resultText, margin: 0 }}>
                      Protein: {fmt(kResult.result.proteinGPerDay, 1)} g/hari (
                      {fmt(kResult.result.proteinGPerKg, 2)} g/kg).
                    </p>
                  </>
                ) : (
                  <p
                    style={{
                      ...resultText,
                      margin: 0,
                      color: "var(--teks-lembut)",
                    }}
                  >
                    Isi usia untuk estimasi RDA per usia &amp; protein.
                  </p>
                )}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="tv-btn"
                    style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
                    onClick={() => {
                      if (!kResult.result) return;
                      const res = kResult.result;
                      const bodyText = [
                        `BB: ${res.weightKg} kg | Usia: ${usia || "-"} bln`,
                        `Estimasi Energi (Holliday-Segar): ${fmt(res.maintenanceEnergyKcalPerDay, 0)} kkal/hari`,
                        res.ageBased ? `RDA Per Usia: ${fmt(res.rdaKcalPerDay, 0)} kkal/hari (${fmt(res.rdaKcalPerKg, 0)} kkal/kg)` : "",
                        res.ageBased ? `Protein: ${fmt(res.proteinGPerDay, 1)} g/hari (${fmt(res.proteinGPerKg, 2)} g/kg)` : "",
                      ].filter(Boolean).join("\n");

                      addRingkasanItem({
                        title: `Kebutuhan Nutrisi & Kalori (BB ${res.weightKg} kg)`,
                        source: "Kebutuhan Nutrisi",
                        body: bodyText,
                      });
                      setDitambahkan(true);
                      setTimeout(() => setDitambahkan(false), 2200);
                    }}
                  >
                    {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="form-row-group">
              <NumberField
                label="Total volume susu / hari (mL)"
                value={vol}
                onValueChange={setVol}
                placeholder="cth: 800"
              />
              <NumberField
                label="Jumlah pemberian / hari"
                value={feeds}
                onValueChange={setFeeds}
                placeholder="cth: 8"
                step={1}
              />
              <NumberField
                label="Konsentrasi energi (kkal/mL)"
                value={conc}
                onValueChange={setConc}
                placeholder="0.67"
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
              <p className="catatan-metode" style={{ marginTop: 0 }}>
                Isi &quot;Berat Badan&quot; di tab Kalori &amp; Protein untuk
                memakai isi otomatis.
              </p>
            ) : null}
            <button
              type="button"
              className="btn-hitung"
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
              <div className="hasil-box-cairan" style={errorBoxStyle}>
                <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
                  {fResult.error}
                </p>
              </div>
            ) : null}
            {fResult.result ? (
              <div className="hasil-box-cairan">
                <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
                <p style={resultText}>
                  Total: {fmt(fResult.result.totalVolumeMl, 0)} mL/hari ≈{" "}
                  {fmt(fResult.result.totalKcalPerDay, 0)} kkal/hari.
                </p>
                <p style={resultText}>
                  Perlu <b>{fResult.result.scoops} sendok takar</b> +{" "}
                  <b>{fmt(fResult.result.waterMl, 0)} mL air matang</b> (1
                  sendok / 60 mL = 2 oz).
                </p>
                {fResult.result.perFeed ? (
                  <p style={{ ...resultText, margin: 0 }}>
                    Per pemberian: {fmt(fResult.result.perFeed.volumeMl, 0)} mL
                    ≈ {fResult.result.perFeed.scoops} sendok takar +{" "}
                    {fmt(fResult.result.perFeed.waterMl, 0)} mL air.
                  </p>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="tv-btn"
                    style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
                    onClick={() => {
                      if (!fResult.result) return;
                      const res = fResult.result;
                      const bodyText = [
                        `Total Volume: ${fmt(res.totalVolumeMl, 0)} mL/hari (${fmt(res.totalKcalPerDay, 0)} kkal/hari)`,
                        `Takaran Harian: ${res.scoops} sendok takar + ${fmt(res.waterMl, 0)} mL air`,
                        res.perFeed ? `Per Pemberian (${feeds}x/hari): ${fmt(res.perFeed.volumeMl, 0)} mL (${res.perFeed.scoops} sendok + ${fmt(res.perFeed.waterMl, 0)} mL air)` : "",
                      ].filter(Boolean).join("\n");

                      addRingkasanItem({
                        title: `Takaran Susu Formula (${fmt(res.totalVolumeMl, 0)} mL/hari)`,
                        source: "Kebutuhan Nutrisi",
                        body: bodyText,
                      });
                      setDitambahkan(true);
                      setTimeout(() => setDitambahkan(false), 2200);
                    }}
                  >
                    {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {tab === "kalori" ? (
        <div className="kartu info-metode">
          <h3>📐 Metode</h3>
          <ul>
            <li>
              Estimasi energi (Holliday–Segar): 100 kkal/kg (≤10 kg) + 50
              kkal/kg (11–20 kg) + 20 kkal/kg (&gt;20 kg).
            </li>
            <li>
              RDA per usia: acuan intake energi &amp; protein dari NBK/Kemenkes.
            </li>
            <li>Protein: 1,0–1,5 g/kgBB/hari (sesuaikan kondisi klinis).</li>
          </ul>
          <p className="catatan-metode">
            Estimasi edukatif; penyesuaian nutrisi harus disesuaikan dengan
            diagnosis dan kondisi pasien.
          </p>
        </div>
      ) : (
        <div className="kartu info-metode">
          <h3>📐 Patokan</h3>
          <ul>
            <li>1 sendok takar susu formula bubuk ≈ 60 mL air = 2 oz.</li>
            <li>Konsentrasi standar: 0,67 kkal/mL (ikuti petunjuk kemasan).</li>
            <li>
              Kebutuhan volume harian anak: ~150 mL/kgBB/hari (variasi per
              usia).
            </li>
          </ul>
          <p className="catatan-metode">
            SELALU ikuti petunjuk penyajian pada kemasan; takaran dapat berbeda
            antar merek.
          </p>
        </div>
      )}

      <div className="kartu info-metode">
        <h3>📚 Sumber Rujukan</h3>
        <ul>
          <li>
            Estimasi energi rumatan: Holliday &amp; Segar, Pediatrics 1957.
          </li>
          <li>Kebutuhan protein &amp; kalori per usia: Kemenkes RI / NBK.</li>
          <li>Takaran rekonstitusi formula: petunjuk penyajian produk.</li>
        </ul>
        <p className="catatan-metode">
          Disclaimer: estimasi kebutuhan nutrisi &amp; takaran formula, bukan
          pengganti penilaian klinis.
        </p>
      </div>
    </div>
  );
}
