"use client";

import { useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import { computeAbg, parseNum, AGD_CONTOH } from "@/entities/abg";
import type { AbgSample, StepTone } from "@/entities/abg";

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 14,
};

const loadBtn: CSSProperties = {
  marginBottom: 16,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid var(--etail-line)",
  background: "#EDE7FB",
  color: "#5B37C9",
  fontWeight: 700,
  cursor: "pointer",
};

const captionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--teks)",
};

const selectLabel: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const selectStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: 15,
  color: "var(--teks)",
  background: "var(--putih)",
  border: "1px solid var(--etail-line)",
  borderRadius: 10,
  outline: "none",
};

const optWrap: CSSProperties = { marginTop: 16 };
const optSummary: CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  color: "var(--teks-lembut)",
  marginBottom: 12,
};

const neutralCard: CSSProperties = {
  marginTop: 18,
  padding: "14px 16px",
  borderRadius: 14,
  background: "var(--etail-soft)",
  color: "var(--teks-lembut)",
};

const okCard: CSSProperties = {
  marginTop: 18,
  padding: "16px 18px",
  borderRadius: 14,
  background: "#E7F8DA",
  border: "1px solid #BFE6A3",
  lineHeight: 1.55,
};

const warnCard: CSSProperties = {
  marginTop: 18,
  padding: "16px 18px",
  borderRadius: 14,
  background: "#FFF4E5",
  border: "1px solid #F3D9A6",
  lineHeight: 1.55,
};

const exampleTag: CSSProperties = {
  fontSize: ".8rem",
  fontWeight: 700,
  color: "#5B37C9",
  marginBottom: 6,
};

const conclusionStyle: CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 800,
  color: "var(--teks)",
  marginBottom: 10,
};

const olStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const warnBlock: CSSProperties = {
  marginTop: 10,
  color: "#a3341c",
  fontWeight: 600,
};

const footNote: CSSProperties = {
  marginTop: 12,
  fontSize: ".8rem",
  color: "var(--teks-lembut)",
};

function toneColor(tone: StepTone): string {
  if (tone === "ok") return "#2f6b1f";
  if (tone === "warn") return "#8a5320";
  if (tone === "bad") return "#a3341c";
  return "var(--teks)";
}

function stepStyle(tone: StepTone): CSSProperties {
  return { color: toneColor(tone) };
}

export function AbgForm() {
  const [ph, setPh] = useState("");
  const [pco2, setPco2] = useState("");
  const [hco3, setHco3] = useState("");
  const [sample, setSample] = useState<AbgSample>("arteri");
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [po2, setPo2] = useState("");
  const [fio2, setFio2] = useState("");
  const [exampleLabel, setExampleLabel] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const clearLabel = () => setExampleLabel(null);
  const bind = (setter: (s: string) => void) => (val: string) => {
    setter(val);
    clearLabel();
  };

  const outcome = computeAbg(
    {
      ph: parseNum(ph),
      pco2: parseNum(pco2),
      hco3: parseNum(hco3),
      sample,
      na: parseNum(na),
      cl: parseNum(cl),
      po2: parseNum(po2),
      fio2: parseNum(fio2),
    },
    exampleLabel,
  );

  const loadExample = () => {
    const c = AGD_CONTOH[idx % AGD_CONTOH.length];
    if (!c) return;
    setPh(String(c.values.ph));
    setPco2(String(c.values.pco2));
    setHco3(String(c.values.hco3));
    setNa(c.values.na != null ? String(c.values.na) : "");
    setCl(c.values.cl != null ? String(c.values.cl) : "");
    setPo2(c.values.po2 != null ? String(c.values.po2) : "");
    setFio2(c.values.fio2 != null ? String(c.values.fio2) : "");
    setSample("arteri");
    setExampleLabel(c.label);
    setIdx(idx + 1);
  };

  const card = outcome.view?.ok ? okCard : warnCard;

  return (
    <div>
      <button type="button" style={loadBtn} onClick={loadExample}>
        🎓 Muat contoh kasus
      </button>

      <div style={gridStyle}>
        <NumberField
          label="pH"
          value={ph}
          onValueChange={bind(setPh)}
          placeholder="cth: 7,35"
          step={0.01}
        />
        <NumberField
          label="pCO₂"
          value={pco2}
          onValueChange={bind(setPco2)}
          placeholder="cth: 40"
          suffix="mmHg"
          step={1}
        />
        <NumberField
          label="HCO₃⁻"
          value={hco3}
          onValueChange={bind(setHco3)}
          placeholder="cth: 24"
          suffix="mmol/L"
          step={1}
        />
        <label style={selectLabel}>
          <span style={captionStyle}>🩸 Jenis sampel</span>
          <select
            value={sample}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSample(e.target.value as AbgSample);
              clearLabel();
            }}
            style={selectStyle}
          >
            <option value="arteri">Arteri</option>
            <option value="vena">Vena</option>
            <option value="kapiler">Kapiler</option>
          </select>
        </label>
      </div>

      <details style={optWrap}>
        <summary style={optSummary}>
          Opsional — anion gap (Na⁺, Cl⁻) & oksigenasi (PaO₂, FiO₂)
        </summary>
        <div style={gridStyle}>
          <NumberField
            label="Na⁺"
            value={na}
            onValueChange={bind(setNa)}
            placeholder="cth: 138"
            suffix="mmol/L"
            step={1}
          />
          <NumberField
            label="Cl⁻"
            value={cl}
            onValueChange={bind(setCl)}
            placeholder="cth: 102"
            suffix="mmol/L"
            step={1}
          />
          <NumberField
            label="PaO₂"
            value={po2}
            onValueChange={bind(setPo2)}
            placeholder="cth: 90"
            suffix="mmHg"
            step={1}
          />
          <NumberField
            label="FiO₂"
            value={fio2}
            onValueChange={bind(setFio2)}
            placeholder="cth: 0,21 atau 21"
            step={0.01}
          />
        </div>
      </details>

      {outcome.error ? (
        <div style={neutralCard}>{outcome.error}</div>
      ) : outcome.view ? (
        <div style={card}>
          {outcome.view.exampleLabel ? (
            <div style={exampleTag}>
              🎓 Contoh kasus: {outcome.view.exampleLabel}
            </div>
          ) : null}
          <div style={conclusionStyle}>{outcome.view.conclusion}</div>
          <ol style={olStyle}>
            {outcome.view.steps.map((s) => (
              <li key={s.label} style={stepStyle(s.tone)}>
                <b>{s.label}:</b> {s.text}
              </li>
            ))}
          </ol>
          {outcome.view.warnings.length ? (
            <div style={warnBlock}>⚠️ {outcome.view.warnings.join(" ")}</div>
          ) : null}
          <div style={footNote}>Korelasikan dengan klinis.</div>
        </div>
      ) : null}
    </div>
  );
}
