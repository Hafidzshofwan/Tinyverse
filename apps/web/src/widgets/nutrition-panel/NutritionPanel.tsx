import { NutritionForm } from "@/features/nutrition-calculator";

// Latar kotak ikon disamakan dengan header "Alur Tata Laksana"
// (gradien pink-lavender magenta → navy).
const iconBg = {
  background:
    "linear-gradient(135deg, rgba(217, 54, 166, 0.14), rgba(10, 11, 95, 0.08))",
} as const;

export function NutritionPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={iconBg} aria-hidden="true">
            🍎
          </div>
          <div>
            <h2>Kalkulator Nutrisi</h2>
            <p>Kebutuhan kalori &amp; protein dan takaran susu formula.</p>
          </div>
        </div>
        <NutritionForm />
      </div>
    </div>
  );
}
