import type { CSSProperties } from "react";
import { NutritionForm } from "@/features/nutrition-calculator";

const container: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 4,
};
const squareIcon: CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.24rem",
  flexShrink: 0,
  background: "linear-gradient(135deg,#E23CA7,#D936A6)",
  boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
};
const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka',sans-serif",
  fontSize: "clamp(1.12rem,2vw,1.42rem)",
  fontWeight: 850,
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  color: "#0A0B5F",
};
const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Quicksand',sans-serif",
  fontSize: "clamp(0.64rem,1vw,0.74rem)",
  lineHeight: 1.22,
  fontWeight: 650,
  letterSpacing: "-0.012em",
  color: "rgba(10,11,95,0.62)",
};

export function NutritionPanel() {
  return (
    <div style={container}>
      <div style={headRow}>
        <div style={squareIcon} aria-hidden="true">
          🍎
        </div>
        <div>
          <h1 style={titleStyle}>Kalkulator Nutrisi</h1>
          <p style={subtitleStyle}>
            Kebutuhan kalori & protein dan takaran susu formula.
          </p>
        </div>
      </div>
      <NutritionForm />
    </div>
  );
}
