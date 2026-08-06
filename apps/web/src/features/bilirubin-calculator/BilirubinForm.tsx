"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
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

const zoneBoxStyle: Record<BilirubinZoneColor, CSSProperties> = {
  green: { border: "2px solid #10B981", background: "linear-gradient(135deg,#e6fbf1,#fff)" },
  yellow: { border: "2px solid #EAB308", background: "linear-gradient(135deg,#fef9e6,#fff)" },
  orange: { border: "2px solid #F97316", background: "linear-gradient(135deg,#fff1e6,#fff)" },
  red: { border: "2px solid #DC2626", background: "linear-gradient(135deg,#ffe0e0,#fff)" },
  "dark-red": { border: "2px solid #7C2D12", background: "linear-gradient(135deg,#f7dede,#fff)" },
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

  const chartWidth = 640;
  const chartHeight = 300;
  const padLeft = 40;
  const padBottom = 30;
  const padTop = 10;
  const padRight = 10;
  const maxY = 30;
  const maxX = 336;

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
    for (let h = 0; h <= maxX; h += step) {
      const pv = lookupBilirubinThreshold(photoSel.curveKey, h);
      const ev = lookupBilirubinThreshold(exchSel.curveKey, h);
      if (pv != null) photoPts.push([h, pv]);
      if (ev != null) exchPts.push([h, ev]);
    }
    return { photoPts, exchPts };
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
            Usia gestasi &lt;35 minggu berada di luar cakupan pedoman AAP 2022 ini.
          </p>
        ) : null}
        <div className="form-row-group">
          <DateTimeField label="Tanggal & jam lahir" value={birthDateTime} onValueChange={setBirthDateTime} />
          <DateTimeField label="Tanggal & jam pengukuran TSB" value={measureDateTime} onValueChange={setMeasureDateTime} />
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
            label={`TSB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
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

        <CheckboxField label="Nilai di atas dari TcB (transkutan), bukan TSB serum" checked={useTcb} onChange={setUseTcb} />
        {useTcb ? (
          <div className="form-row-group">
            <NumberField
              label={`TcB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
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
            Usia gestasi &lt;38 minggu — kurva &quot;dengan faktor risiko&quot; otomatis digunakan sesuai AAP
            2022, terlepas dari checkbox di atas.
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
              label={`TSB saat mulai fototerapi (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
              value={phototherapyStartTsb}
              onValueChange={setPhototherapyStartTsb}
              placeholder="cth: 17"
            />
          </div>
        ) : null}

        <div style={{ marginTop: 10, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "var(--navy)" }}>Riwayat pengukuran TSB (opsional, untuk tren)</h3>
          <button type="button" className="tv-btn" style={{ padding: "6px 12px", fontSize: 13 }} onClick={addHistoryRow}>
            + Tambah titik
          </button>
        </div>
        {history.map((row) => (
          <div key={row.id} className="form-row-group" style={{ alignItems: "flex-end" }}>
            <DateTimeField
              label="Tanggal & jam"
              value={row.dateTime}
              onValueChange={(v) => updateHistoryRow(row.id, { dateTime: v })}
            />
            <NumberField
              label={`TSB (${tsbUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"})`}
              value={row.value}
              onValueChange={(v) => updateHistoryRow(row.id, { value: v })}
              placeholder="cth: 12"
            />
            <button
              type="button"
              className="tv-btn"
              style={{ padding: "10px 12px", background: "#fde0e0", color: "#DC2626", fontWeight: 700 }}
              onClick={() => removeHistoryRow(row.id)}
            >
              Hapus
            </button>
          </div>
        ))}

        {gaNum == null || !birthDateTime || !measureDateTime || tsbMgDl == null ? (
          <p className="catatan-metode" style={{ marginTop: 16 }}>
            Isi usia gestasi, tanggal &amp; jam lahir, tanggal &amp; jam pengukuran, dan nilai TSB untuk melihat
            hasil.
          </p>
        ) : ageError ? null : thresholds && thresholds.outOfScope ? (
          <div className="hasil-box-cairan" style={errorBoxStyle}>
            <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
              Usia gestasi &lt;35 minggu berada di luar cakupan pedoman AAP 2022 ini. Gunakan pedoman
              neonatologi/NICU yang sesuai.
            </p>
          </div>
        ) : thresholds && zone ? (
          <div className="hasil-box-cairan" style={zoneBoxStyle[zone.color]}>
            <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
            <p style={resultText}>
              Threshold fototerapi: <b>{fmt(thresholds.phototherapyMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.phototherapyMgDl ?? 0), 0)} µmol/L)
            </p>
            <p style={resultText}>
              Threshold eskalasi perawatan: <b>{fmt(thresholds.escalationMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.escalationMgDl ?? 0), 0)} µmol/L)
            </p>
            <p style={resultText}>
              Threshold exchange transfusion: <b>{fmt(thresholds.exchangeMgDl, 1)} mg/dL</b> (
              {fmt(mgdlToUmol(thresholds.exchangeMgDl ?? 0), 0)} µmol/L)
            </p>
            <p className="catatan-metode" style={{ margin: "0 0 10px" }}>
              Kurva acuan: {thresholds.curveLabelPhoto} · {thresholds.curveLabelExchange}
            </p>
            <p style={{ ...resultText, color: zoneColorHex[zone.color], fontWeight: 800, fontSize: 16 }}>
              {zone.title}
            </p>
            <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
              {zone.recommendations.map((r, i) => (
                <li key={i} style={{ ...resultText, margin: "0 0 4px" }}>
                  {r}
                </li>
              ))}
            </ul>
            {guardrails.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                {guardrails.map((w, i) => (
                  <p key={i} style={{ ...resultText, color: "#DC2626", fontWeight: 700, margin: "0 0 4px" }}>
                    ⚠ {w}
                  </p>
                ))}
              </div>
            ) : null}
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="tv-btn"
                style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
                onClick={() => {
                  const bodyText = [
                    `GA ${gaNum} minggu, usia ${ageHours != null ? Math.floor(ageHours) : "-"} jam, TSB ${fmt(tsbMgDl, 1)} mg/dL`,
                    `Threshold: Fototerapi ${fmt(thresholds.phototherapyMgDl, 1)} | Eskalasi ${fmt(thresholds.escalationMgDl, 1)} | Exchange ${fmt(thresholds.exchangeMgDl, 1)} mg/dL`,
                    `Zona: ${zone.title}`,
                    ...zone.recommendations,
                    ...guardrails,
                  ]
                    .filter(Boolean)
                    .join("\n");
                  addRingkasanItem({
                    title: `Bilirubin Neonatus (GA ${gaNum}mg, TSB ${fmt(tsbMgDl, 1)} mg/dL)`,
                    source: "Bilirubin Neonatus AAP 2022",
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
          <h3>Nomogram</h3>
          <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ maxWidth: "100%" }}>
            <line x1={padLeft} y1={chartHeight - padBottom} x2={chartWidth - padRight} y2={chartHeight - padBottom} stroke="#94a3b8" strokeWidth={1} />
            <line x1={padLeft} y1={padTop} x2={padLeft} y2={chartHeight - padBottom} stroke="#94a3b8" strokeWidth={1} />
            <path d={pointsToPath(nomogram.photoPts)} fill="none" stroke="#F97316" strokeWidth={2} />
            <path d={pointsToPath(nomogram.exchPts)} fill="none" stroke="#7C2D12" strokeWidth={2} strokeDasharray="6,4" />
            {historyPoints.map((p, i) => (
              <circle key={i} cx={xToPx(p.hoursAfterBirth)} cy={yToPx(p.tsbMgDl)} r={4} fill="#2563EB" />
            ))}
            {ageHours != null && tsbMgDl != null ? (
              <circle cx={xToPx(ageHours)} cy={yToPx(tsbMgDl)} r={5} fill="#10B981" stroke="#065f46" strokeWidth={1.5} />
            ) : null}
          </svg>
          <p className="catatan-metode">
            Garis oranye: threshold fototerapi. Garis putus-putus cokelat tua: threshold exchange
            transfusion. Titik biru: riwayat TSB. Titik hijau: pengukuran saat ini.
          </p>
        </div>
      ) : null}

      <div className="kartu info-metode">
        <h3>Metode</h3>
        <ul>
          <li>
            Threshold dihitung persis dari tabel Kemper AR, Newman TB, Slaughter JL, et al. AAP 2022
            Clinical Practice Guideline (Pediatrics. 2022;150(3):e2022058859), tanpa pembulatan atau
            interpolasi tambahan.
          </li>
          <li>
            Threshold eskalasi perawatan = threshold exchange transfusion − 2,0 mg/dL, dihitung langsung
            dari kurva exchange.
          </li>
          <li>
            Usia gestasi &lt;38 minggu otomatis memakai kurva &quot;dengan faktor risiko&quot;, terlepas dari
            checkbox faktor risiko lainnya.
          </li>
          <li>Konversi satuan: 1 mg/dL = 17,1 µmol/L.</li>
          <li>
            Zona diprioritaskan berurutan: tanda ensefalopati akut → TSB ≥ exchange → TSB ≥
            eskalasi → TSB ≥ fototerapi → di bawah fototerapi (interval kontrol berdasarkan selisih
            ke threshold fototerapi).
          </li>
        </ul>
        <p className="catatan-metode">
          Threshold AAP 2022 berbasis konsensus ahli. Alat ini pendukung keputusan, bukan pengganti
          penilaian klinis.
        </p>
      </div>
    </div>
  );
}
