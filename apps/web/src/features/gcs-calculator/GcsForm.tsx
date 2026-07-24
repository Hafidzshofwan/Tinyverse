"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { NumberField, RedFlagCrossLink } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  deriveAgeGroups,
  gcsOptionsFor,
  computeGcs,
  eyeMotorLabel,
  verbalLabel,
  type AgeGroups,
  type EyeMotorAgeGroup,
  type VerbalAgeGroup,
  type GcsOption,
  type GcsResult,
} from "@/entities/gcs";

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const kompStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  border: "1px solid var(--etail-line)",
  borderRadius: 14,
  padding: 12,
};
const disabledKompStyle: CSSProperties = {
  ...kompStyle,
  opacity: 0.45,
  pointerEvents: "none",
};
const headRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  flexWrap: "wrap",
};
const kompNameStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--teks)",
};
const toggleWrapStyle: CSSProperties = {
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};
const pillBase: CSSProperties = {
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 999,
  border: "1px solid var(--etail-line)",
  background: "var(--putih)",
  color: "var(--teks-lembut)",
  cursor: "pointer",
};
const pillActive: CSSProperties = {
  ...pillBase,
  background: "var(--etail-navy)",
  borderColor: "var(--etail-navy)",
  color: "#FFFFFF",
};
const optListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const optBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  textAlign: "left",
  width: "100%",
  border: "1px solid var(--etail-line)",
  background: "var(--putih)",
  borderRadius: 10,
  padding: "8px 10px",
  fontSize: 13,
  color: "var(--teks)",
  cursor: "pointer",
};
const optActive: CSSProperties = {
  ...optBase,
  borderColor: "var(--etail-magenta)",
  background: "var(--etail-soft)",
};
const poinStyle: CSSProperties = {
  flexShrink: 0,
  width: 26,
  height: 26,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 7,
  background: "var(--etail-soft)",
  border: "1px solid var(--etail-line)",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--teks-lembut)",
};
const poinActive: CSSProperties = {
  ...poinStyle,
  background: "var(--etail-magenta)",
  borderColor: "var(--etail-magenta)",
  color: "#FFFFFF",
};
const tubeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "var(--teks)",
  cursor: "pointer",
};
const infoStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--teks-lembut)",
};

interface LevelStyle {
  bg: string;
  border: string;
  fg: string;
}
const LEVEL_STYLE: Record<string, LevelStyle> = {
  stabil: { bg: "#E8F8EE", border: "#12957E", fg: "#12957E" },
  waspada: { bg: "#FFF6E5", border: "#E7B900", fg: "#B57400" },
  kritis: { bg: "#FDECEC", border: "#E23CA7", fg: "#C5228D" },
};

function OptionButton(props: {
  option: GcsOption;
  active: boolean;
  onSelect: (score: number) => void;
}) {
  const { option, active, onSelect } = props;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(option.score)}
      style={active ? optActive : optBase}
    >
      <span style={active ? poinActive : poinStyle}>{option.score}</span>
      <span>{option.label}</span>
    </button>
  );
}

export function GcsForm() {
  const profile = usePatientProfile();
  const [usiaBulan, setUsiaBulan] = useSyncedField(profile.usiaBulan);
  const [manualEM, setManualEM] = useState<EyeMotorAgeGroup | null>(null);
  const [manualV, setManualV] = useState<VerbalAgeGroup | null>(null);
  const [eye, setEye] = useState<number | null>(null);
  const [motor, setMotor] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [intubated, setIntubated] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  const ageMonths = usiaBulan.trim() === "" ? null : Number(usiaBulan);
  const derived = useMemo(() => deriveAgeGroups(ageMonths), [ageMonths]);
  const groups: AgeGroups = {
    eyeMotor: manualEM ?? derived.eyeMotor,
    verbal: manualV ?? derived.verbal,
  };
  const options = useMemo(
    () => gcsOptionsFor(groups),
    [groups.eyeMotor, groups.verbal],
  );
  const result: GcsResult = useMemo(
    () => computeGcs({ eye, motor, verbal, intubated }),
    [eye, motor, verbal, intubated],
  );

  const emGroups: EyeMotorAgeGroup[] = ["lt1", "ge1"];
  const vGroups: VerbalAgeGroup[] = ["lt2", "2to5", "gt5"];
  const lvl = result.level ? LEVEL_STYLE[result.level] : null;

  const skorStyle: CSSProperties = {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    color: lvl ? lvl.fg : "var(--teks)",
  };
  const totalTextStyle: CSSProperties = {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.45,
    color: "var(--teks-lembut)",
  };
  const hasilStyle: CSSProperties = {
    borderRadius: 14,
    padding: 16,
    textAlign: "center",
    background: lvl ? lvl.bg : "var(--etail-soft)",
    border: `2px ${lvl ? "solid" : "dashed"} ${lvl ? lvl.border : "var(--etail-line)"}`,
  };

  return (
    <div style={wrapStyle}>
      <NumberField
        label="👶 Usia"
        value={usiaBulan}
        onValueChange={setUsiaBulan}
        suffix="bulan"
        step={1}
      />
      <p style={infoStyle}>
        Kelompok usia — Eye/Motor: {eyeMotorLabel(groups.eyeMotor)} · Verbal:{" "}
        {verbalLabel(groups.verbal)}
      </p>

      <div style={kompStyle}>
        <div style={headRowStyle}>
          <span style={kompNameStyle}>👁️ Eye (E)</span>
          <div style={toggleWrapStyle}>
            {emGroups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setManualEM(g)}
                style={groups.eyeMotor === g ? pillActive : pillBase}
              >
                {eyeMotorLabel(g)}
              </button>
            ))}
          </div>
        </div>
        <div style={optListStyle}>
          {options.eye.map((o) => (
            <OptionButton
              key={o.score}
              option={o}
              active={eye === o.score}
              onSelect={setEye}
            />
          ))}
        </div>
      </div>

      <div style={intubated ? disabledKompStyle : kompStyle}>
        <div style={headRowStyle}>
          <span style={kompNameStyle}>🗣️ Verbal (V)</span>
          <div style={toggleWrapStyle}>
            {vGroups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setManualV(g)}
                style={groups.verbal === g ? pillActive : pillBase}
              >
                {verbalLabel(g)}
              </button>
            ))}
          </div>
        </div>
        <div style={optListStyle}>
          {options.verbal.map((o) => (
            <OptionButton
              key={o.score}
              option={o}
              active={verbal === o.score}
              onSelect={setVerbal}
            />
          ))}
        </div>
      </div>

      <label style={tubeRowStyle}>
        <input
          type="checkbox"
          checked={intubated}
          onChange={(e) => setIntubated(e.target.checked)}
        />
        Pasien terintubasi (Verbal tidak dapat dinilai → “T”)
      </label>

      <div style={kompStyle}>
        <div style={headRowStyle}>
          <span style={kompNameStyle}>💪 Motor (M)</span>
          <span style={infoStyle}>{eyeMotorLabel(groups.eyeMotor)}</span>
        </div>
        <div style={optListStyle}>
          {options.motor.map((o) => (
            <OptionButton
              key={o.score}
              option={o}
              active={motor === o.score}
              onSelect={setMotor}
            />
          ))}
        </div>
      </div>

      <div style={hasilStyle}>
        <div style={skorStyle}>
          {result.complete ? result.totalText : result.scoreText}
        </div>
        <div style={totalTextStyle}>
          {result.complete ? (
            <>
              <strong>{result.category}</strong>
              <br />
              {result.advice}
            </>
          ) : (
            <>
              Pilih komponen Eye, Verbal{intubated ? " (terintubasi)" : ""}{" "}
              &amp; Motor untuk melihat total.
            </>
          )}
        </div>
        {result.complete && (
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              className="tv-btn"
              style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
              onClick={() => {
                addRingkasanItem({
                  title: `Glasgow Coma Scale (GCS Pediatrik) — Total: ${result.totalText}`,
                  source: "GCS Pediatrik",
                  body: `Hasil: ${result.scoreText} (${result.totalText})\nKategori: ${result.category}\nRekomendasi: ${result.advice}`,
                });
                setDitambahkan(true);
                setTimeout(() => setDitambahkan(false), 2200);
              }}
            >
              {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
            </button>
          </div>
        )}
      </div>

      {result.complete && result.total != null && result.total <= 8 && (
        <RedFlagCrossLink
          badge="RED-FLAG KLINIS (GCS ≤ 8)"
          title="Penurunan Kesadaran Berat (Koma) — Ancaman Airway"
          description="GCS ≤ 8 berisiko tinggi hilangnya refleks proteksi jalan napas. Pertimbangkan intubasi endotrakeal & siapkan resusitasi airway lanjut."
          actions={[
            {
              label: "Buka Mode Darurat (PALS)",
              href: "/preview/darurat",
              primary: true,
              icon: "⚡",
            },
            {
              label: "Cek Analisa Gas Darah",
              href: "/preview/agd",
              icon: "🩺",
            },
          ]}
        />
      )}
    </div>
  );
}
