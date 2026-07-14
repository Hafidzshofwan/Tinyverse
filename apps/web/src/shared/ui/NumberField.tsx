import type { ChangeEvent, CSSProperties } from "react";

export interface NumberFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  suffix?: string;
}

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const captionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--teks)",
};
const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};
const suffixStyle: CSSProperties = {
  fontSize: 14,
  color: "var(--teks-lembut)",
  fontWeight: 600,
};

export function NumberField({
  label,
  value,
  onValueChange,
  placeholder,
  min = 0,
  step = 0.1,
  suffix,
}: NumberFieldProps) {
  return (
    <label style={labelStyle}>
      <span style={captionStyle}>{label}</span>
      <span style={rowStyle}>
        <input
          type="number"
          inputMode="decimal"
          className="tv-input"
          value={value}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
        {suffix ? <span style={suffixStyle}>{suffix}</span> : null}
      </span>
    </label>
  );
}
