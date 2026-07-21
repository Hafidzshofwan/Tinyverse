import type { CSSProperties } from "react";
import { NutritionForm } from "@/features/nutrition-calculator";

const container: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const headRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 4,
};

const circleIcon: CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.6rem",
  flexShrink: 0,
  background: "linear-gradient(135deg, #FFD23F, #F5B700)",
  boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Fredoka', sans-serif",
  fontSize: "clamp(1.12rem, 2vw, 1.42rem)",
  fontWeight: 850,
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  color: "#4A3728",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "clamp(0.64rem, 1vw, 0.74rem)",
  lineHeight: 1.22,
  fontWeight: 700,
  letterSpacing: "-0.012em",
  color: "#8A7868",
};

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: 26,
  padding: "26px 22px",
  boxShadow: "0 10px 0 rgba(0,0,0,0.04), 0 12px 30px rgba(84, 198, 235, 0.15)",
  position: "relative",
};

/**
 * Panel Kalkulator Nutrisi (React native) — gaya v17.
 * Render NutritionForm (tab Kalori & Protein + Susu Formula) di dalam kartu v17.
 */
export function NutritionPanel() {
  return (
    <div style={container}>
      <div style={headRow}>
        <div style={circleIcon} aria-hidden="true">
          🍼
        </div>
        <div>
          <h1 style={titleStyle}>Kalkulator Nutrisi</h1>
          <p style={subtitleStyle}>
            Kebutuhan kalori & protein dan takaran susu formula.
          </p>
        </div>
      </div>
      <section style={cardStyle}>
        <NutritionForm />
      </section>
    </div>
  );
}
