"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import { usePatientProfile, usePatientKey, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { computeFormula, autoFormulaVolume, parseNum, fmt } from "@/entities/nutrition";

const autoBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1.5px solid #93C5FD",
  background: "#EFF6FF",
  color: "#1D4ED8",
  fontWeight: 700,
  fontSize: 13.5,
  cursor: "pointer",
  marginBottom: 12,
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

function BeratField({
  label,
  kgValue,
  onKgChange,
  gramValue,
  onGramChange,
  totalKg,
}: {
  label: string;
  kgValue: string;
  onKgChange: (value: string) => void;
  gramValue: string;
  onGramChange: (value: string) => void;
  totalKg: number | null;
}) {
  return (
    <div className="form-group berat-kg-gram">
      <label>{label}</label>
      <div className="berat-kg-gram-row">
        <div className="berat-kg-gram-input">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            placeholder="cth: 1"
            value={kgValue}
            onChange={(e) => onKgChange(e.target.value)}
          />
          <span>kg</span>
        </div>
        <span className="berat-kg-gram-plus">+</span>
        <div className="berat-kg-gram-input">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={999}
            step={1}
            placeholder="cth: 850"
            value={gramValue}
            onChange={(e) => onGramChange(e.target.value)}
          />
          <span>gram</span>
        </div>
      </div>
      <p className="berat-kg-gram-total">
        {totalKg != null
          ? `Jadi total: ${fmt(totalKg, 3)} kg`
          : "Isi kg saja, gram saja, atau keduanya untuk dijumlah otomatis."}
      </p>
    </div>
  );
}

export function NutritionForm() {
  const profile = usePatientProfile();
  const [bb, setBb] = useSyncedField(profile.bb);
  const [bbGram, setBbGram] = useState("");
  const [vol, setVol] = useState("");
  const [feeds, setFeeds] = useState("");
  const [conc, setConc] = useState("0.67");
  const [fResult, setFResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeFormula>["result"];
  }>({ error: null, result: null });
  const [ditambahkan, setDitambahkan] = useState(false);

  const kunciPasien = usePatientKey();
  useEffect(() => {
    setBbGram("");
    setVol("");
    setFeeds("");
    setFResult({ error: null, result: null });
    setDitambahkan(false);
  }, [kunciPasien]);

  const bbNum = parseNum(bb);
  const bbGramNum = parseNum(bbGram);
  const weightKgTotal =
    bbNum != null || bbGramNum != null
      ? (bbNum ?? 0) + (bbGramNum ?? 0) / 1000
      : null;

  return (
    <div>
      <div className="kartu">
        <BeratField
          label="Berat Badan Saat Ini"
          kgValue={bb}
          onKgChange={setBb}
          gramValue={bbGram}
          onGramChange={setBbGram}
          totalKg={weightKgTotal}
        />
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
            const v = autoFormulaVolume(weightKgTotal);
            if (v != null) setVol(String(v));
          }}
        >
          Isi otomatis 150 mL/kg dari berat pasien
        </button>
        {weightKgTotal == null ? (
          <p className="catatan-metode" style={{ marginTop: 0 }}>
            Isi &quot;Berat Badan Saat Ini&quot; di atas untuk memakai isi otomatis.
          </p>
        ) : null}
        <button
          type="button"
          className="btn-hitung"
          onClick={() => setFResult(computeFormula(parseNum(vol), parseNum(feeds), parseNum(conc)))}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
            <path d="M12 2C10 6 7 8 7 13C7 16.5 9.5 19.5 13 20C17 20.5 20 17 20 13C20 8 16 5 14 2C14 5 12 6.5 12 8C12 6 12 2 12 2Z" fill="#FF5722" />
            <path d="M12 9C11 11 9.5 12 9.5 14.5C9.5 16.5 11 18.5 13 18.5C15 18.5 16.5 16.8 16.5 14.5C16.5 11.5 14 10 13 8.5C13 10 12 11 12 11" fill="#FFC107" />
          </svg>
          Hitung Takaran
        </button>
        {fResult.error ? (
          <div className="hasil-box-cairan" style={errorBoxStyle}>
            <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>{fResult.error}</p>
          </div>
        ) : null}
        {fResult.result ? (
          <div className="hasil-box-cairan">
            <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
            <p style={resultText}>
              Volume per pemberian: <b>{fmt(fResult.result.volumePerFeedMl, 1)} mL</b>
            </p>
            <p style={resultText}>
              Total kalori: <b>{fmt(fResult.result.totalKcalPerDay, 0)} kkal/hari</b>
            </p>
            {weightKgTotal != null ? (
              <p style={{ ...resultText, margin: 0 }}>
                Kalori per kg: {fmt(fResult.result.totalKcalPerDay / weightKgTotal, 1)} kkal/kg/hari.
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
                    `Volume per pemberian: ${fmt(res.volumePerFeedMl, 1)} mL`,
                    `Total kalori: ${fmt(res.totalKcalPerDay, 0)} kkal/hari`,
                    weightKgTotal != null
                      ? `Kalori per kg: ${fmt(res.totalKcalPerDay / weightKgTotal, 1)} kkal/kg/hari`
                      : "",
                  ]
                    .filter(Boolean)
                    .join("\n");
                  addRingkasanItem({
                    title: `Susu Formula (${fmt(res.volumePerFeedMl, 1)} mL/pemberian)`,
                    source: "Kalkulator Susu Formula",
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

      <div className="kartu info-metode">
        <h3>Patokan</h3>
        <ul>
          <li>Volume per pemberian = total volume / hari ÷ jumlah pemberian / hari.</li>
          <li>
            Total kalori/hari = total volume / hari (mL) × konsentrasi energi
            (kkal/mL). Konsentrasi standar susu formula bayi umumnya sekitar
            0,67 kkal/mL.
          </li>
          <li>
            Tombol isi otomatis memakai patokan umum 150 mL/kg/hari untuk bayi
            yang mendapat susu formula penuh (full feeds); sesuaikan dengan
            kondisi klinis dan toleransi masing-masing bayi.
          </li>
        </ul>
        <p className="catatan-metode">
          Estimasi takaran susu formula berbasis patokan umum, bukan pengganti
          penilaian klinis atau anjuran dokter/ahli gizi.
        </p>
      </div>

      <div className="kartu info-metode">
        <h3>Sumber Rujukan</h3>
        <ul>
          <li>Takaran rekonstitusi & konsentrasi energi: petunjuk penyajian produk susu formula.</li>
          <li>Patokan volume 150 mL/kg/hari: praktik umum neonatologi/pediatri untuk full feeds enteral.</li>
        </ul>
        <p className="catatan-metode">
          Disclaimer: estimasi takaran susu formula, bukan pengganti penilaian
          klinis.
        </p>
      </div>
    </div>
  );
}
