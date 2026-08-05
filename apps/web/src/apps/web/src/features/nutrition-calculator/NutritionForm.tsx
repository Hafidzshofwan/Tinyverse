"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import { usePatientProfile, usePatientKey, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  computeNeonatalTpn,
  computeFormula,
  autoFormulaVolume,
  parseNum,
  fmt,
} from "@/entities/nutrition";
import type { TpnCategory } from "@/entities/nutrition";

type Tab = "tpn" | "formula";

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

function statusLabel(status: "rendah" | "dalam-rentang" | "tinggi"): string {
  if (status === "rendah") return "di bawah rentang";
  if (status === "tinggi") return "di atas rentang";
  return "dalam rentang";
}

function statusColor(status: "rendah" | "dalam-rentang" | "tinggi"): string {
  if (status === "dalam-rentang") return "#10B981";
  return "#e63946";
}

export function NutritionForm() {
  const [tab, setTab] = useState<Tab>("tpn");
  const profile = usePatientProfile();
  const [bb, setBb] = useSyncedField(profile.bb);
  const [kategori, setKategori] = useState<TpnCategory>("preterm");
  const [hariKe, setHariKe] = useState("1");
  const [volumeCairan, setVolumeCairan] = useState("");
  const [dekstrosa, setDekstrosa] = useState("");
  const [asamAmino, setAsamAmino] = useState("");
  const [lipid, setLipid] = useState("");
  const [vol, setVol] = useState("");
  const [feeds, setFeeds] = useState("");
  const [conc, setConc] = useState("0.67");
  const [tpnResult, setTpnResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeNeonatalTpn>["result"];
  }>({ error: null, result: null });
  const [fResult, setFResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeFormula>["result"];
  }>({ error: null, result: null });
  const [ditambahkan, setDitambahkan] = useState(false);

  /*
   * WHY: hasil TPN dan formula dihitung dari berat pasien SEBELUMNYA.
   * Kolom beratnya kini berganti otomatis, jadi membiarkan hasil lama tetap di
   * layar membuat angka itu terbaca seolah-olah milik pasien yang baru dipilih.
   * Nilai konsentrasi formula sengaja TIDAK direset karena itu properti sediaan
   * susu, bukan properti pasien.
   */
  const kunciPasien = usePatientKey();
  useEffect(() => {
    setVol("");
    setFeeds("");
    setTpnResult({ error: null, result: null });
    setFResult({ error: null, result: null });
    setDitambahkan(false);
  }, [kunciPasien]);

  const bbNum = parseNum(bb);

  return (
    <div>
      <div className="kartu">
        <div className="segmented-toggle" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className={`segmented-btn ${tab === "tpn" ? "aktif" : ""}`}
            onClick={() => setTab("tpn")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
              <path d="M9 2H15V6H9V2Z" fill="#0EA5E9" />
              <path d="M8 6H16V12C16 12 18 14 18 17C18 19.7614 15.3137 22 12 22C8.68629 22 6 19.7614 6 17C6 14 8 12 8 12V6Z" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1.6" />
              <path d="M8 15H16" stroke="#0284C7" strokeWidth="1.6" />
            </svg>
            <span>TPN Neonatus</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${tab === "formula" ? "aktif" : ""}`}
            onClick={() => setTab("formula")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
              <path d="M10 2H14V4H10V2Z" fill="#F59E0B" />
              <rect x="8" y="4" width="8" height="3" rx="1" fill="#2563EB" />
              <path d="M7 9C7 8 8 7 9 7H15C16 7 17 8 17 9V19C17 20.6569 15.6569 22 14 22H10C8.34315 22 7 20.6569 7 19V9Z" fill="#0EA5E9" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1.6" />
              <path d="M9 13H15" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 17H13" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Susu Formula</span>
          </button>
        </div>

        {tab === "tpn" ? (
          <div>
            <div className="segmented-toggle" style={{ marginBottom: 14 }}>
              <button
                type="button"
                className={`segmented-btn ${kategori === "preterm" ? "aktif" : ""}`}
                onClick={() => setKategori("preterm")}
              >
                <span>Preterm</span>
              </button>
              <button
                type="button"
                className={`segmented-btn ${kategori === "term" ? "aktif" : ""}`}
                onClick={() => setKategori("term")}
              >
                <span>Term (cukup bulan)</span>
              </button>
            </div>
            <div className="form-row-group">
              <NumberField
                label="Berat Badan (kg)"
                value={bb}
                onValueChange={setBb}
                placeholder="cth: 1.8"
              />
              <NumberField
                label="Hari ke- (day of life)"
                value={hariKe}
                onValueChange={setHariKe}
                placeholder="cth: 1"
                min={1}
                step={1}
              />
            </div>
            <div className="form-row-group">
              <NumberField
                label="Volume cairan (mL/kg/hari)"
                value={volumeCairan}
                onValueChange={setVolumeCairan}
                placeholder="cth: 100"
              />
              <NumberField
                label="Konsentrasi dekstrosa (%)"
                value={dekstrosa}
                onValueChange={setDekstrosa}
                placeholder="cth: 10"
              />
            </div>
            <div className="form-row-group">
              <NumberField
                label="Asam amino (g/kg/hari)"
                value={asamAmino}
                onValueChange={setAsamAmino}
                placeholder="cth: 2.5"
              />
              <NumberField
                label="Lipid (g/kg/hari)"
                value={lipid}
                onValueChange={setLipid}
                placeholder="cth: 2"
              />
            </div>
            <button
              type="button"
              className="btn-hitung"
              onClick={() =>
                setTpnResult(
                  computeNeonatalTpn({
                    weightKg: bbNum ?? undefined,
                    category: kategori,
                    dayOfLife: parseNum(hariKe) ?? undefined,
                    fluidVolumeMlPerKgPerDay: parseNum(volumeCairan) ?? undefined,
                    dextrosePercent: parseNum(dekstrosa) ?? undefined,
                    aminoAcidGPerKgPerDay: parseNum(asamAmino) ?? undefined,
                    lipidGPerKgPerDay: parseNum(lipid) ?? undefined,
                  }),
                )
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
                <path d="M12 2C10 6 7 8 7 13C7 16.5 9.5 19.5 13 20C17 20.5 20 17 20 13C20 8 16 5 14 2C14 5 12 6.5 12 8C12 6 12 2 12 2Z" fill="#FF5722" />
                <path d="M12 9C11 11 9.5 12 9.5 14.5C9.5 16.5 11 18.5 13 18.5C15 18.5 16.5 16.8 16.5 14.5C16.5 11.5 14 10 13 8.5C13 10 12 11 12 11" fill="#FFC107" />
              </svg>
              Hitung TPN
            </button>
            {tpnResult.error ? (
              <div className="hasil-box-cairan" style={errorBoxStyle}>
                <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
                  {tpnResult.error}
                </p>
              </div>
            ) : null}
            {tpnResult.result ? (
              <div className="hasil-box-cairan">
                <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
                <p style={resultText}>
                  Total volume: {fmt(tpnResult.result.totalVolumeMlPerDay, 0)}{" "}
                  mL/hari.
                </p>
                <p style={resultText}>
                  GIR:{" "}
                  <b>{fmt(tpnResult.result.girMgKgMin, 2)} mg/kg/menit</b> (
                  <span style={{ color: statusColor(tpnResult.result.girRange.status), fontWeight: 800 }}>
                    {statusLabel(tpnResult.result.girRange.status)}
                  </span>
                  , acuan {tpnResult.result.girRange.min}
                  {tpnResult.result.girRange.max != null ? `-${tpnResult.result.girRange.max}` : ""}{" "}
                  mg/kg/menit).
                </p>
                <p style={resultText}>
                  Dekstrosa: {fmt(tpnResult.result.dextroseGPerDay, 1)} g/hari ≈{" "}
                  {fmt(tpnResult.result.dextroseKcalPerDay, 0)} kkal/hari.
                </p>
                <p style={resultText}>
                  Asam amino: {fmt(tpnResult.result.aminoAcidGPerDay, 1)} g/hari ≈{" "}
                  {fmt(tpnResult.result.aminoAcidKcalPerDay, 0)} kkal/hari (
                  <span style={{ color: statusColor(tpnResult.result.aminoAcidRange.status), fontWeight: 800 }}>
                    {statusLabel(tpnResult.result.aminoAcidRange.status)}
                  </span>
                  , acuan {tpnResult.result.aminoAcidRange.min}
                  {tpnResult.result.aminoAcidRange.max != null ? `-${tpnResult.result.aminoAcidRange.max}` : "+"}{" "}
                  g/kg/hari).
                </p>
                <p style={resultText}>
                  Lipid: {fmt(tpnResult.result.lipidGPerDay, 1)} g/hari ≈{" "}
                  {fmt(tpnResult.result.lipidKcalPerDay, 0)} kkal/hari (
                  <span style={{ color: statusColor(tpnResult.result.lipidStatus), fontWeight: 800 }}>
                    {statusLabel(tpnResult.result.lipidStatus)}
                  </span>
                  , maks {tpnResult.result.lipidMaxGPerKgPerDay} g/kg/hari). Porsi dari kalori
                  non-protein: {fmt(tpnResult.result.lipidPercentOfNonProteinKcal, 0)}% (
                  <span style={{ color: statusColor(tpnResult.result.lipidRatioStatus), fontWeight: 800 }}>
                    {statusLabel(tpnResult.result.lipidRatioStatus)}
                  </span>
                  , anjuran 25-50%).
                </p>
                <p style={{ ...resultText, margin: 0 }}>
                  Total kalori: <b>{fmt(tpnResult.result.totalKcalPerDay, 0)} kkal/hari</b> (
                  {fmt(tpnResult.result.totalKcalPerKgPerDay, 1)} kkal/kg/hari).
                </p>
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="tv-btn"
                    style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
                    onClick={() => {
                      if (!tpnResult.result) return;
                      const res = tpnResult.result;
                      const bodyText = [
                        `BB: ${res.weightKg} kg | Kategori: ${kategori === "preterm" ? "Preterm" : "Term"} | Hari ke-${hariKe || "-"}`,
                        `Volume: ${fmt(res.totalVolumeMlPerDay, 0)} mL/hari`,
                        `GIR: ${fmt(res.girMgKgMin, 2)} mg/kg/menit (${statusLabel(res.girRange.status)}, acuan ${res.girRange.min}${res.girRange.max != null ? `-${res.girRange.max}` : ""} mg/kg/menit)`,
                        `Dekstrosa: ${fmt(res.dextroseGPerDay, 1)} g/hari (${fmt(res.dextroseKcalPerDay, 0)} kkal/hari)`,
                        `Asam Amino: ${fmt(res.aminoAcidGPerDay, 1)} g/hari (${fmt(res.aminoAcidKcalPerDay, 0)} kkal/hari, ${statusLabel(res.aminoAcidRange.status)})`,
                        `Lipid: ${fmt(res.lipidGPerDay, 1)} g/hari (${fmt(res.lipidKcalPerDay, 0)} kkal/hari, ${statusLabel(res.lipidStatus)})`,
                        `Total Kalori: ${fmt(res.totalKcalPerDay, 0)} kkal/hari (${fmt(res.totalKcalPerKgPerDay, 1)} kkal/kg/hari)`,
                      ].filter(Boolean).join("\n");

                      addRingkasanItem({
                        title: `TPN Neonatus (BB ${res.weightKg} kg)`,
                        source: "Kebutuhan Nutrisi",
                        body: bodyText,
                      });
                      setDitambahkan(true);
                      setTimeout(() => setDitambahkan(false), 2200);
                    }}
                  >
                    {ditambahkan ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                          <circle cx="12" cy="12" r="10" fill="#10B981" />
                          <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Ditambahkan ke Ringkasan!
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                          <rect x="4" y="3" width="16" height="18" rx="2" fill="#3B82F6" fillOpacity="0.25" stroke="#60A5FA" strokeWidth="1.6" />
                          <path d="M8 8H16M8 12H16M8 16H12" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="17" cy="16" r="3.5" fill="#10B981" />
                          <path d="M17 14.5V17.5M15.5 16H18.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Tambahkan ke Ringkasan
                      </>
                    )}
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
              className="auto-fill-btn"
              style={autoBtn}
              onClick={() => {
                const v = autoFormulaVolume(bbNum);
                if (v != null) setVol(String(v));
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                <circle cx="12" cy="12" r="10" fill="#2563EB" fillOpacity="0.15" />
                <path d="M12 7V17M12 17L8 13M12 17L16 13" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Isi otomatis 150 mL/kg dari berat pasien
            </button>
            {bbNum == null ? (
              <p className="catatan-metode" style={{ marginTop: 0 }}>
                Isi &quot;Berat Badan&quot; di tab TPN Neonatus untuk
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
                <path d="M10 2H14V4H10V2Z" fill="#F59E0B" />
                <rect x="8" y="4" width="8" height="3" rx="1" fill="#60A5FA" />
                <path d="M7 9C7 8 8 7 9 7H15C16 7 17 8 17 9V19C17 20.6569 15.6569 22 14 22H10C8.34315 22 7 20.6569 7 19V9Z" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.8" />
                <path d="M9 13H15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 17H13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Hitung Takaran
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
                    style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
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
                    {ditambahkan ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                          <circle cx="12" cy="12" r="10" fill="#10B981" />
                          <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Ditambahkan ke Ringkasan!
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                          <rect x="4" y="3" width="16" height="18" rx="2" fill="#3B82F6" fillOpacity="0.25" stroke="#60A5FA" strokeWidth="1.6" />
                          <path d="M8 8H16M8 12H16M8 16H12" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="17" cy="16" r="3.5" fill="#10B981" />
                          <path d="M17 14.5V17.5M15.5 16H18.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Tambahkan ke Ringkasan
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {tab === "tpn" ? (
        <div className="kartu info-metode">
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h20" />
              <path d="M6 12v-4" />
              <path d="M10 12v-2" />
              <path d="M14 12v-4" />
              <path d="M18 12v-2" />
            </svg>
            Metode
          </h3>
          <ul>
            <li>
              GIR (Glucose Infusion Rate) dihitung dari konsentrasi dekstrosa
              dan volume cairan: GIR (mg/kg/menit) = %dekstrosa × volume
              (mL/kg/hari) ÷ 144.
            </li>
            <li>
              Rentang GIR acuan: preterm hari 1 = 4-8, hari ≥2 = 8-10 mg/kg/menit;
              term hari 1 = 2,5-5, hari ≥2 = 5-10 mg/kg/menit.
            </li>
            <li>
              Asam amino: preterm hari 1 ≥1,5 g/kg/hari, hari ≥2 = 2,5-3,5
              g/kg/hari; term = 1,5-3,0 g/kg/hari.
            </li>
            <li>Lipid: maksimal 4 g/kg/hari untuk preterm maupun term.</li>
            <li>
              Kalori: dekstrosa 3,4 kkal/g, asam amino 4 kkal/g, lipid (emulsi
              20%) 10 kkal/g.
            </li>
          </ul>
          <p className="catatan-metode">
            Estimasi edukatif berbasis ESPGHAN/ESPEN/ESPR/CSPEN 2018; bukan
            pengganti penilaian klinis. Elektrolit, mikronutrien, dan
            osmolaritas jalur akses tetap harus dinilai terpisah.
          </p>
        </div>
      ) : (
        <div className="kartu info-metode">
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Patokan
          </h3>
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
        <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Sumber Rujukan
        </h3>
        <ul>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Carbohydrates (Clinical Nutrition
            37, 2018): rentang GIR neonatus (R5.4).
          </li>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Amino acids (Clinical Nutrition 37,
            2018): dosis asam amino neonatus (R3.1-R3.4).
          </li>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Lipids (Clinical Nutrition 37,
            2018): dosis maksimal & rasio kalori lipid (R4.3, pendahuluan bab
            Lipid).
          </li>
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
