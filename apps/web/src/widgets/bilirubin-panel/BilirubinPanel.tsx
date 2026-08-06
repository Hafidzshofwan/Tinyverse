import { BilirubinForm } from "@/features/bilirubin-calculator";

export function BilirubinPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#FFFBEB" />
              <circle cx="12" cy="12" r="4.2" fill="#F59E0B" />
              <path
                d="M12 3.2V5.6M12 18.4V20.8M20.8 12H18.4M5.6 12H3.2M18.07 5.93L16.36 7.64M7.64 16.36L5.93 18.07M18.07 18.07L16.36 16.36M7.64 7.64L5.93 5.93"
                stroke="#F59E0B"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px" }}>Bilirubin Neonatus (AAP 2022)</h2>
            <p style={{ fontSize: "10.24px" }}>
              Threshold fototerapi, eskalasi perawatan &amp; exchange transfusion bayi baru lahir.
            </p>
          </div>
        </div>
        <BilirubinForm />
      </div>
    </div>
  );
}
