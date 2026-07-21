import { NutritionForm } from "@/features/nutrition-calculator";

export function NutritionPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" aria-hidden="true">
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
