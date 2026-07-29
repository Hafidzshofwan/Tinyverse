import { NutritionForm } from "@/features/nutrition-calculator";

export function NutritionPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#FEF2F2" />
              <path d="M12 4V20M6 20H18M4 8H20M4 8L7 14H1M20 8L23 14H17" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4" cy="12" r="1.5" fill="#16A34A" />
              <circle cx="20" cy="12" r="1.5" fill="#EA580C" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px" }}>Kalkulator Nutrisi</h2>
            <p style={{ fontSize: "10.24px" }}>Kebutuhan kalori &amp; protein dan takaran susu formula.</p>
          </div>
        </div>
        <NutritionForm />
      </div>
    </div>
  );
}

