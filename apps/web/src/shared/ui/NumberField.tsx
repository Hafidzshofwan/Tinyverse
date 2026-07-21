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
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  color: "#0A0B5F",
  marginBottom: 6,
  fontFamily: "'Quicksand', sans-serif",
};
const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};
const inputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  border: "2px solid rgba(10, 11, 95, 0.09)",
  borderRadius: 14,
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "0.82rem",
  fontWeight: 700,
  color: "#0A0B4F",
  backgroundColor: "#FFFFFF",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};
const suffixStyle: CSSProperties = {
  fontSize: 14,
  color: "#667085",
  fontWeight: 700,
  fontFamily: "'Quicksand', sans-serif",
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
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={labelStyle}>{label}</span>
      <span style={rowStyle}>
        <input
          type="number"
          inputMode="decimal"
          style={inputStyle}
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
