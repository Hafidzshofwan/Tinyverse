"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField, ReferensiBlok, REFERENSI_BILIRUBIN } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  computeThresholds,
  classifyZone,
  computeGuardrailWarnings,
  shouldUseRiskFactorCurve,
  mgdlToUmol,
  umolToMgdl,
  tcbNeedsTsbConfirmation,
  selectCurve,
  lookupBilirubinThreshold,
} from "@/entities/bilirubin";
import type { BilirubinZoneColor } from "@/entities/bilirubin";

type TsbUnit = "mgdl" | "umol";

interface HistoryRow {
  id: string;
  dateTime: string;
  value: string;
}

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

function fmt(n: number | null | undefined, d = 1): string {
  if (n == null || !Number.isFinite(n)) return "\u2013";
  const p = Math.pow(10, d);
  return String(Math.round(n * p) / p);
}

function parseNum(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function nowLocalIso(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function hoursBetween(startIso: string, endIso: string): number | null {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return (end.getTime() - start.getTime()) / 3600000;
}

function DateTimeField({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="datetime-local"
        className="tv-date-input"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        margin: "8px 0",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--navy-soft)",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0 }}
      />
      <span>{label}</span>
    </label>
  );
}

const zoneColorHex: Record<BilirubinZoneColor, string> = {
  green: "#10B981",
  yellow: "#EAB308",
  orange: "#F97316",
  red: "#DC2626",
  "dark-red": "#7C2D12",
};

const zoneBoxClass: Record<BilirubinZoneColor, string> = {
  green: "bili-box bili-box-green",
  yellow: "bili-box bili-box-yellow",
  orange: "bili-box bili-box-orange",
  red: "bili-box bili-box-red",
  "dark-red": "bili-box bili-box-dark-red",
};

let historyIdCounter = 0;
function nextHistoryId(): string {
  historyIdCounter += 1;
  return `h${Date.now()}_${historyIdCounter}`;
}

export function BilirubinForm() {
  const [gaWeeks, setGaWeeks] = useState("38");
  const [birthDateTime, setBirthDateTime] = useState("");
  const [measureDateTime, setMeasureDateTime] = useState(() => nowLocalIso());
  const [tsbUnit, setTsbUnit] = useState<TsbUnit>("mgdl");
  const [tsbValue, setTsbValue] = useState("");
  const [useTcb, setUseTcb] = useState(false);
  const [tcbValue, setTcbValue] = useState("");
  const [albuminLow, setAlbuminLow] = useState(false);
  const [hemolyticDisease, setHemolyticDisease] = useState(false);
  const [hemolyticDatPositive, setHemolyticDatPositive] = useState(false);
  const [sepsis, setSepsis] = useState(false);
  const [clinicalInstability, setClinicalInstability] = useState(false);
  const [encephalopathySigns, setEncephalopathySigns] = useState(false);
  const [directBilirubin, setDirectBilirubin] = useState("");
  const [isOnPhototherapy, setIsOnPhototherapy] = useState(false);
  const [phototherapyStartTsb, setPhototherapyStartTsb] = useState("");
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [ditambahkan, setDitambahkan] = useState(false);

  const gaNum = parseNum(gaWeeks);
  const ageHours = birthDateTime && measureDateTime ? hoursBetween(birthDateTime, measureDateTime) : null;
  const ageError =
    birthDateTime && measureDateTime && ageHours != null && ageHours < 0
      ? "Tanggal/jam pengukuran TSB tidak boleh sebelum tanggal/jam lahir."
      : null;

  const tsbNum = parseNum(tsbValue);
  const tsbMgDl = tsbNum == null ? null : tsbUnit === "mgdl" ? tsbNum : umolToMgdl(tsbNum);
  const tcbNum = parseNum(tcbValue);
  const tcbMgDl = tcbNum == null ? null : tsbUnit === "mgdl" ? tcbNum : umolToMgdl(tcbNum);

  const manualRiskFactors = { albuminLow, hemolyticDisease, sepsis, clinicalInstability };
  const gaForRiskCheck = gaNum ?? 40;
  const withRF = shouldUseRiskFactorCurve(gaForRiskCheck, manualRiskFactors);
  const gaAutoRisk = gaNum != null && gaNum < 38;

  const thresholds =
    gaNum != null && ageHours != null && ageHours >= 0
      ? computeThresholds(gaNum, withRF, ageHours)
      : null;

  const zone =
    thresholds && tsbMgDl != null
      ? classifyZone(thresholds, {
          ageHours: ageHours ?? 0,
          tsbMgDl,
          encephalopathySigns,
          hemolyticDiseaseWithPositiveDat: hemolyticDisease && hemolyticDatPositive,
        })
      : null;

  const tcbWarning =
    useTcb &&
    tcbMgDl != null &&
    thresholds &&
    !thresholds.outOfScope &&
    thresholds.phototherapyMgDl != null &&
    tcbNeedsTsbConfirmation(tcbMgDl, thresholds.phototherapyMgDl)
      ? "TcB mendekati/di atas ambang fototerapi (\u2265ambang\u22123,0 mg/dL) atau \u226515 mg/dL \u2014 konfirmasi dengan TSB (pengukuran serum)."
      : null;

  const historyPoints = useMemo(
    () =>
      birthDateTime
        ? history
            .map((row) => {
              const h = hoursBetween(birthDateTime, row.dateTime);
              const v = parseNum(row.value);
              const vMgDl = v == null ? null : tsbUnit === "mgdl" ? v : umolToMgdl(v);
              return h != null && vMgDl != null ? { hoursAfterBirth: h, tsbMgDl: vMgDl } : null;
            })
            .filter((p): p is { hoursAfterBirth: number; tsbMgDl: number } => p != null)
        : [],
    [birthDateTime, history, tsbUnit],
  );

  const phototherapyStartTsbNum = parseNum(phototherapyStartTsb);
  const phototherapyStartTsbMgDl =
    phototherapyStartTsbNum == null ? null : tsbUnit === "mgdl" ? phototherapyStartTsbNum : umolToMgdl(phototherapyStartTsbNum);

  const guardrails =
    thresholds && !thresholds.outOfScope && tsbMgDl != null && ageHours != null
      ? computeGuardrailWarnings({
          ageHours,
          history: historyPoints,
          directBilirubinMgDl: parseNum(directBilirubin),
          tsbMgDl,
          gaWeeks: gaNum ?? 40,
          isOnPhototherapy,
          phototherapyStartTsbMgDl,
          phototherapyThresholdAtStartMgDl: thresholds.phototherapyMgDl,
        })
      : [];

  const chartWidth = 660;
  const chartHeight = 350;
  const padLeft = 50;
  const padBottom = 52;
  const padTop = 30;
  const padRight = 20;
  const maxY = 30;
  const maxX = 336;

  const yTicks = [0, 5, 10, 15, 20, 25, 30];
  const xTicks = [0, 24, 48, 72, 96, 120, 144, 168, 216, 264, 312, 336];

  function xToPx(h: number): number {
    return padLeft + (h / maxX) * (chartWidth - padLeft - padRight);
  }
  function yToPx(v: number): number {
    return chartHeight - padBottom - (v / maxY) * (chartHeight - padTop - padBottom);
  }
  function pointsToPath(pts: Array<[number, number]>): string {
    return pts.map(([h, v], i) => `${i === 0 ? "M" : "L"}${xToPx(h).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" ");
  }

  const nomogram = useMemo(() => {
    if (!thresholds || thresholds.outOfScope || gaNum == null) return null;
    const photoSel = selectCurve("phototherapy", gaNum, withRF);
    const exchSel = selectCurve("exchange", gaNum, withRF);
    if (!photoSel.curveKey || !exchSel.curveKey) return null;
    const step = 6;
    const photoPts: Array<[number, number]> = [];
    const exchPts: Array<[number, number]> = [];
    const escalPts: Array<[number, number]> = [];
    for (let h = 0; h <= maxX; h += step) {
      const pv = lookupBilirubinThreshold(photoSel.curveKey, h);
      const ev = lookupBilirubinThreshold(exchSel.curveKey, h);
      if (pv != null) photoPts.push([h, pv]);
      if (ev != null) {
        exchPts.push([h, ev]);
        escalPts.push([h, Math.max(0, ev - 2.0)]);
      }
    }
    return { photoPts, escalPts, exchPts };
  }, [thresholds, gaNum, withRF, maxX]);

  function addHistoryRow() {
    setHistory((prev) => [...prev, { id: nextHistoryId(), dateTime: measureDateTime, value: "" }]);
  }
  function updateHistoryRow(id: string, patch: Partial<HistoryRow>) {
    setHistory((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }
  function removeHistoryRow(id: string) {
    setHistory((prev) => prev.filter((row) => row.id !== id));
  }

  return (
    <div>
      <div className="kartu">
        <div className="form-row-group">
          <NumberField
            label="Usia gestasi saat lahir (minggu)"
            value={gaWeeks}
            onValueChange={setGaWeeks}
            placeholder="cth: 38"
            step={1}
          />
        </div>
        {gaNum != null && gaNum < 35 ? (
          <p className="catatan-metode" style={{ marginTop: 0, color: "#e63946", fontWeight: 700 }}>
            Usia gestasi &lt;35 minggu berada di luar cakupan pedoman ini.
          </p>
        ) : null}
        <div className="form-row-group">
          <DateTimeField label="Tanggal & jam lahir" value={birthDateTime} onValueChange={setBirthDateTime} />
          <DateTimeField label="Tanggal & jam pengukuran Total Serum Bilirubin (TSB)" value={measureDateTime} onValueChange={setMeasureDateTime} />
        </div>
        {ageError ? (
          <p className="catatan-metode" style={{ marginTop: 0, color: "#e63946", fontWeight: 700 }}>
            {ageError}
          </p>
        ) : ageHours != null ? (
          <p className="catatan-metode" style={{ marginTop: 0 }}>
            Usia saat pengukuran: {Math.floor(ageHours)} jam.
          </p>
        ) : null}

        <div className="segmented-toggle" style={{ marginBottom: 14 }}>
          <button type="button" className={`segmented-btn ${tsbUnit === "mgdl" ? "aktif" : ""}`} onClick={() => setTsbUnit("mgdl")}>
            <span>mg/dL</span>
          </button>
          <button type="button" className={`segmented-btn ${tsbUnit === "umol" ? "aktif" : ""}`} onClick={() => setTsbUnit("umol")}>
            <span>µmol/L</span>
          </button>
        </div>
        <div className="form-row-group">
          <NumberField
            label={`Total Serum Bilirubin / TSB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
            value={tsbValue}
            onValueChange={setTsbValue}
            placeholder={tsbUnit === "mgdl" ? "cth: 15" : "cth: 256"}
          />
        </div>
        {tsbMgDl != null ? (
          <p className="catatan-metode" style={{ marginTop: 0 }}>
            {tsbUnit === "mgdl" ? `\u2248 ${fmt(mgdlToUmol(tsbMgDl), 0)} \u00b5mol/L` : `\u2248 ${fmt(tsbMgDl, 1)} mg/dL`}
          </p>
        ) : null}

        <CheckboxField label="Nilai di atas dari Bilirubin Transkutan (TcB), bukan pengukuran serum (TSB)" checked={useTcb} onChange={setUseTcb} />
        {useTcb ? (
          <div className="form-row-group">
            <NumberField
              label={`Bilirubin Transkutan / TcB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
              value={tcbValue}
              onValueChange={setTcbValue}
              placeholder="cth: 14"
            />
          </div>
        ) : null}
        {tcbWarning ? (
          <p className="catatan-metode" style={{ marginTop: 0, color: "#e63946", fontWeight: 700 }}>
            {tcbWarning}
          </p>
        ) : null}

        <h3 style={{ fontSize: "0.85rem", margin: "16px 0 6px", color: "var(--navy)" }}>Faktor risiko neurotoksisitas</h3>
        <CheckboxField label="Albumin <3,0 g/dL" checked={albuminLow} onChange={setAlbuminLow} />
        <CheckboxField
          label="Penyakit hemolitik isoimun, defisiensi G6PD, atau penyakit hemolitik lain"
          checked={hemolyticDisease}
          onChange={setHemolyticDisease}
        />
        {hemolyticDisease ? (
          <div style={{ marginLeft: 24 }}>
            <CheckboxField
              label="Direct Antiglobulin Test (DAT) positif (penyakit hemolitik isoimun)"
              checked={hemolyticDatPositive}
              onChange={setHemolyticDatPositive}
            />
          </div>
        ) : null}
        <CheckboxField label="Sepsis" checked={sepsis} onChange={setSepsis} />
        <CheckboxField
          label="Instabilitas klinis signifikan dalam 24 jam terakhir"
          checked={clinicalInstability}
          onChange={setClinicalInstability}
        />
        {gaAutoRisk ? (
          <p className="catatan-metode" style={{ marginTop: 4 }}>
            Usia gestasi &lt;38 minggu — kurva &quot;dengan faktor risiko&quot; otomatis digunakan sesuai pedoman American Academy of Pediatrics, terlepas dari checkbox di atas.
          </p>
        ) : null}
        <CheckboxField
          label="Tanda ensefalopati bilirubin akut (hipertonia, arching/retrocollis-opistotonus, tangis melengking, apnea berulang)"
          checked={encephalopathySigns}
          onChange={setEncephalopathySigns}
        />

        <h3 style={{ fontSize: "0.85rem", margin: "16px 0 6px", color: "var(--navy)" }}>Data tambahan (opsional)</h3>
        <div className="form-row-group">
          <NumberField
            label={`Bilirubin direk (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
            value={directBilirubin}
            onValueChange={setDirectBilirubin}
            placeholder="cth: 1.0"
          />
        </div>
        <CheckboxField label="Bayi sedang menjalani fototerapi" checked={isOnPhototherapy} onChange={setIsOnPhototherapy} />
        {isOnPhototherapy ? (
          <div className="form-row-group">
            <NumberField
              label={`Total Serum Bilirubin (TSB) saat mulai fototerapi (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
              value={phototherapyStartTsb}
              onValueChange={setPhototherapyStartTsb}
              placeholder="cth: 17"
            />
          </div>
        ) : null}

        <div style={{ marginTop: 18, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "var(--navy)", fontWeight: 700 }}>
            Riwayat pengukuran Total Serum Bilirubin (TSB) (opsional, untuk tren)
          </h3>
          <button
            type="button"
            className="tv-btn sekunder"
            style={{ width: "auto", margin: 0, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}
            onClick={addHistoryRow}
          >
            + Tambah titik
          </button>
        </div>
        {history.map((row, idx) => (
          <div
            key={row.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 12,
              alignItems: "end",
              padding: "12px",
              borderRadius: "14px",
              background: "var(--tv-soft, #f4f5fa)",
              border: "1px solid var(--tv-line, rgba(10, 11, 95, 0.09))",
              marginBottom: 10,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <DateTimeField
                label={`Tanggal & jam #${idx + 1}`}
                value={row.dateTime}
                onValueChange={(v) => updateHistoryRow(row.id, { dateTime: v })}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <NumberField
                label={`Total Serum Bilirubin / TSB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
                value={row.value}
                onValueChange={(v) => updateHistoryRow(row.id, { value: v })}
                placeholder="cth: 12"
              />
            </div>
            <div style={{ minWidth: 0, paddingBottom: 18 }}>
              <button
                type="button"
                className="tv-btn"
                style={{
                  width: "auto",
                  padding: "11px 16px",
                  background: "rgba(220, 38, 38, 0.12)",
                  color: "#DC2626",
                  fontWeight: 700,
                  marginTop: 0,
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  boxShadow: "none",
                }}
                onClick={() => removeHistoryRow(row.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {gaNum == null || !birthDateTime || !measureDateTime || tsbMgDl == null ? (
          <p className="catatan-metode" style={{ marginTop: 16 }}>
            Isi usia gestasi, tanggal &amp; jam lahir, tanggal &amp; jam pengukuran, dan nilai Total Serum Bilirubin (TSB) untuk melihat
            hasil.
          </p>
        ) : ageError ? null : thresholds && thresholds.outOfScope ? (
          <div className="hasil-box-cairan" style={errorBoxStyle}>
            <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
              Usia gestasi &lt;35 minggu berada di luar cakupan pedoman ini. Gunakan pedoman
              neonatologi/NICU yang sesuai.
            </p>
          </div>
        ) : thresholds && zone ? (
          <div className={zoneBoxClass[zone.color]}>
            <h3 className="bili-box-title">HASIL PERHITUNGAN</h3>
            <p className="bili-box-text">
              Ambang batas fototerapi: <b>{fmt(thresholds.phototherapyMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.phototherapyMgDl ?? 0), 0)} µmol/L)
            </p>
            <p className="bili-box-text">
              Ambang batas eskalasi terapi (siaga transfusi tukar): <b>{fmt(thresholds.escalationMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.escalationMgDl ?? 0), 0)} µmol/L)
            </p>
            <p className="bili-box-text">
              Ambang batas transfusi tukar: <b>{fmt(thresholds.exchangeMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.exchangeMgDl ?? 0), 0)} µmol/L)
            </p>
            <p className="catatan-metode" style={{ margin: "0 0 10px", opacity: 0.85 }}>
              Kurva acuan: {thresholds.curveLabelPhoto} · {thresholds.curveLabelExchange}
            </p>
            <p className="bili-box-text" style={{ fontWeight: 800, fontSize: 16.5, margin: "8px 0" }}>
              {zone.title}
            </p>
            <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
              {zone.recommendations.map((r, i) => (
                <li key={i} className="bili-box-text" style={{ margin: "0 0 4px", fontSize: 14 }}>
                  {r}
                </li>
              ))}
            </ul>
            {guardrails.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                {guardrails.map((w, i) => (
                  <p key={i} className="bili-box-text" style={{ fontWeight: 700, margin: "0 0 4px", color: "#EF4444" }}>
                    ⚠ {w}
                  </p>
                ))}
              </div>
            ) : null}
            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                className="tv-btn"
                style={{ background: "var(--tv-navy, #0A0B5F)", color: "#FFFFFF", fontWeight: 700 }}
                onClick={() => {
                  const bodyText = [
                    `GA ${gaNum} minggu, usia ${ageHours != null ? Math.floor(ageHours) : "-"} jam, TSB ${fmt(tsbMgDl, 1)} mg/dL`,
                    `Ambang batas: Fototerapi ${fmt(thresholds.phototherapyMgDl, 1)} | Peningkatan Perawatan ${fmt(thresholds.escalationMgDl, 1)} | Transfusi Tukar ${fmt(thresholds.exchangeMgDl, 1)} mg/dL`,
                    `Zona: ${zone.title}`,
                    ...zone.recommendations,
                    ...guardrails,
                  ]
                    .filter(Boolean)
                    .join("\n");
                  addRingkasanItem({
                    title: `Bilirubin Neonatus (GA ${gaNum}mg, TSB ${fmt(tsbMgDl, 1)} mg/dL)`,
                    source: "Bilirubin Neonatus",
                    body: bodyText,
                  });
                  setDitambahkan(true);
                  setTimeout(() => setDitambahkan(false), 2200);
                }}
              >
                {ditambahkan ? "Ditambahkan ke Ringkasan!" : "Tambahkan ke Ringkasan"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {nomogram ? (
        <div className="kartu info-metode">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ margin: 0 }}>Nomogram Ambang Batas Bilirubin</h3>
            <span className="bili-nomogram-badge">
              GA {gaNum} mg {withRF ? "(Dengan Risiko Neurotoksisitas)" : "(Tanpa Risiko Neurotoksisitas)"}
            </span>
          </div>

          {/* SVG Chart */}
          <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="bili-nomogram-svg" style={{ maxWidth: "100%" }}>
            {/* Horizontal Gridlines & Y Axis Ticks */}
            {yTicks.map((v) => {
              const yPx = yToPx(v);
              return (
                <g key={`y-${v}`}>
                  <line
                    x1={padLeft}
                    y1={yPx}
                    x2={chartWidth - padRight}
                    y2={yPx}
                    className="bili-gridline"
                    strokeDasharray={v === 0 ? undefined : "3,3"}
                  />
                  <line x1={padLeft - 5} y1={yPx} x2={padLeft} y2={yPx} className="bili-axis" />
                  <text x={padLeft - 8} y={yPx + 4} textAnchor="end" className="bili-tick-text">
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Vertical Gridlines & X Axis Ticks */}
            {xTicks.map((h) => {
              const xPx = xToPx(h);
              const dayNum = h / 24;
              return (
                <g key={`x-${h}`}>
                  <line
                    x1={xPx}
                    y1={padTop}
                    x2={xPx}
                    y2={chartHeight - padBottom}
                    className="bili-gridline"
                    strokeDasharray="3,3"
                  />
                  <line x1={xPx} y1={chartHeight - padBottom} x2={xPx} y2={chartHeight - padBottom + 5} className="bili-axis" />
                  <text x={xPx} y={chartHeight - padBottom + 18} textAnchor="middle" className="bili-tick-text">
                    {h}j
                  </text>
                  <text x={xPx} y={chartHeight - padBottom + 31} textAnchor="middle" className="bili-tick-subtext">
                    {h === 0 ? "Lahir" : `H-${dayNum}`}
                  </text>
                </g>
              );
            })}

            {/* Main Axes */}
            <line x1={padLeft} y1={chartHeight - padBottom} x2={chartWidth - padRight} y2={chartHeight - padBottom} className="bili-axis" />
            <line x1={padLeft} y1={padTop} x2={padLeft} y2={chartHeight - padBottom} className="bili-axis" />

            {/* Axis Titles */}
            <text x={padLeft} y={18} textAnchor="start" className="bili-axis-title">
              TSB (mg/dL)
            </text>
            <text x={(chartWidth + padLeft - padRight) / 2} y={chartHeight - 8} textAnchor="middle" className="bili-axis-title">
              Usia Bayi setelah Lahir (Jam &amp; Hari)
            </text>

            {/* Curves */}
            {/* Fototerapi */}
            <path d={pointsToPath(nomogram.photoPts)} fill="none" stroke="#F97316" strokeWidth={2.5} />
            {/* Siaga Transfusi Tukar / Eskalasi */}
            <path d={pointsToPath(nomogram.escalPts)} fill="none" stroke="#D97706" strokeWidth={1.5} strokeDasharray="4,3" />
            {/* Transfusi Tukar */}
            <path d={pointsToPath(nomogram.exchPts)} fill="none" stroke="#991B1B" strokeWidth={2.5} strokeDasharray="6,4" />

            {/* History trajectory line & dots */}
            {historyPoints.length > 0 ? (
              <g>
                <path
                  d={historyPoints.map((p, i) => `${i === 0 ? "M" : "L"}${xToPx(p.hoursAfterBirth).toFixed(1)},${yToPx(p.tsbMgDl).toFixed(1)}`).join(" ")}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="3,3"
                />
                {historyPoints.map((p, i) => (
                  <circle key={i} cx={xToPx(p.hoursAfterBirth)} cy={yToPx(p.tsbMgDl)} r={4} fill="#3B82F6" stroke="#FFFFFF" strokeWidth={1.5} />
                ))}
              </g>
            ) : null}

            {/* Patient current measurement point & crosshair */}
            {ageHours != null && tsbMgDl != null ? (() => {
              const px = xToPx(ageHours);
              const py = yToPx(tsbMgDl);
              const labelText = `${fmt(tsbMgDl, 1)} mg/dL (${Math.round(ageHours)}j)`;
              const boxW = 100;
              const boxH = 22;
              let bx = px + 8;
              let by = py - 26;
              if (bx + boxW > chartWidth - padRight) bx = px - boxW - 8;
              if (by < padTop) by = py + 8;

              return (
                <g>
                  {/* Crosshairs */}
                  <line x1={padLeft} y1={py} x2={px} y2={py} stroke="#10B981" strokeWidth={1.5} strokeDasharray="3,3" />
                  <line x1={px} y1={py} x2={px} y2={chartHeight - padBottom} stroke="#10B981" strokeWidth={1.5} strokeDasharray="3,3" />
                  {/* Pulse Halo */}
                  <circle cx={px} cy={py} r={10} fill="#10B981" fillOpacity={0.25} stroke="#10B981" strokeWidth={1.5} />
                  {/* Main Dot */}
                  <circle cx={px} cy={py} r={5.5} fill="#10B981" stroke="#FFFFFF" strokeWidth={2} />
                  {/* Tooltip Badge */}
                  <rect x={bx} y={by} width={boxW} height={boxH} className="bili-tooltip-rect" />
                  <text x={bx + boxW / 2} y={by + 15} textAnchor="middle" className="bili-tooltip-text">
                    {labelText}
                  </text>
                </g>
              );
            })() : null}
          </svg>

          {/* Legend */}
          <div className="bili-legend">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 3, background: "#F97316", borderRadius: 2 }} /> Garis Ambang Fototerapi
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 2, borderBottom: "2px dashed #D97706" }} /> Garis Siaga Transfusi Tukar (-2 mg/dL)
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 3, borderBottom: "2.5px dashed #991B1B" }} /> Garis Ambang Transfusi Tukar
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", border: "1.5px solid #065F46" }} /> Hasil Pengukuran Saat Ini
            </span>
            {historyPoints.length > 0 ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} /> Riwayat TSB
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="kartu info-metode">
        <h3>Metode</h3>
        <ul>
          <li>
            Ambang batas dihitung persis dari tabel pedoman American Academy of Pediatrics
            (Pediatrics. 2022;150(3):e2022058859), tanpa pembulatan atau interpolasi tambahan.
          </li>
          <li>
            Ambang batas eskalasi terapi intensif = ambang batas transfusi tukar − 2,0 mg/dL, dihitung langsung
            dari kurva transfusi tukar.
          </li>
          <li>
            Usia gestasi &lt;38 minggu otomatis memakai kurva &quot;dengan faktor risiko&quot;, terlepas dari
            checkbox faktor risiko lainnya.
          </li>
          <li>Konversi satuan: 1 mg/dL = 17,1 µmol/L.</li>
          <li>
            Zona diprioritaskan berurutan: tanda ensefalopati akut → Total Serum Bilirubin (TSB) ≥ transfusi tukar → TSB ≥
            eskalasi terapi intensif → TSB ≥ fototerapi → di bawah fototerapi (interval kontrol berdasarkan selisih
            ke ambang batas fototerapi).
          </li>
        </ul>
        <p className="catatan-metode" style={{ marginBottom: 12 }}>
          Ambang batas berbasis konsensus ahli. Alat ini pendukung keputusan, bukan pengganti
          penilaian klinis.
        </p>
        <ReferensiBlok
          sumber={REFERENSI_BILIRUBIN}
          catatan="Pedoman tata laksana hiperbilirubinemia neonatus usia gestasi ≥35 minggu oleh American Academy of Pediatrics."
        />
      </div>
    </div>
  );
}
