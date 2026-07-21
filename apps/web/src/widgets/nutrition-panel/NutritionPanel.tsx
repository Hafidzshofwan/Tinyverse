import type { CSSProperties } from "react";
import { NutritionForm } from "@/features/nutrition-calculator";

const wrapStyle: CSSProperties = { maxWidth: 760, margin: "0 auto" };

/**
 * Panel Kalkulator Nutrisi (React native) - pengganti island iframe v17.
 * Render NutritionForm (tab Kalori & Protein + Susu Formula). Header dibawa ToolShell di page.tsx.
 */
export function NutritionPanel() {
  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <NutritionForm />
      </section>
    </div>
  );
}
