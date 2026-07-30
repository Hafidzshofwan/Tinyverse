import type { ChangeEvent, ReactNode } from "react";

export interface NumberFieldProps {
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  suffix?: string;
}

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
    <div className="form-group">
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onValueChange(e.target.value)
          }
        />
        {suffix ? (
          <span style={{ fontSize: 14, color: "#8A7868", fontWeight: 700 }}>
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
