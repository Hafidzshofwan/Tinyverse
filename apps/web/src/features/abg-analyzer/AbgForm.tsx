"use client";

import { useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { NumberField, RedFlagCrossLink } from "@/shared/ui";
import { computeAbg, parseNum, AGD_CONTOH } from "@/entities/abg";
import type { AbgSample, StepTone } from "@/entities/abg";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

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
  const [ditambahkan, setDitambahkan] = useState(false);

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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        Muat contoh kasus
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
          <span style={captionStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px", color: "#DC2626" }}>
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            Jenis sampel
          </span>
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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Contoh kasus: {outcome.view.exampleLabel}
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
            <div style={warnBlock}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px", color: "#D97706" }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {outcome.view.warnings.join(" ")}
            </div>
          ) : null}
          <div style={footNote}>Korelasikan dengan klinis.</div>
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              className="tv-btn"
              style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
              onClick={() => {
                if (!outcome.view) return;
                const v = outcome.view;
                const bodyText = [
                  `Sampel: ${sample.toUpperCase()} | pH: ${ph}, pCO₂: ${pco2} mmHg, HCO₃⁻: ${hco3} mmol/L`,
                  `Kesimpulan: ${v.conclusion}`,
                  ...v.steps.map((s) => `• ${s.label}: ${s.text}`),
                ].join("\n");

                addRingkasanItem({
                  title: `Analisis Gas Darah (AGD) — ${v.conclusion}`,
                  source: "Analisis Gas Darah",
                  body: bodyText,
                });
                setDitambahkan(true);
                setTimeout(() => setDitambahkan(false), 2200);
              }}
            >
              {ditambahkan ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Ditambahkan ke Ringkasan!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Tambahkan ke Ringkasan
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {outcome.view && parseNum(ph) !== null && parseNum(ph)! < 7.25 && (
        <RedFlagCrossLink
          badge="RED-FLAG KLINIS (pH < 7.25)"
          title="Asidosis Berat — Evaluasi KAD / Syok / Sepsis"
          description="Asidosis metabolik/respiratorik berat memerlukan evaluasi klinis cepat. Bila ditemukan GDS > 200 mg/dL & ketonuria (+), curigai Ketoasidosis Diabetikum (KAD)."
          actions={[
            {
              label: "Buka Alur Tatalaksana KAD",
              href: "/preview/alur",
              primary: true,
            },
            {
              label: "Mode Darurat Resusitasi",
              href: "/preview/darurat",
            },
          ]}
        />
      )}
    </div>
  );
}
