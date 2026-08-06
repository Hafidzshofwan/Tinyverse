import { BilirubinForm } from "@/features/bilirubin-calculator";

export function BilirubinPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="biliBgGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#9A3412" />
                </linearGradient>
                <linearGradient id="bluePhototherapyGrad" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="sunCoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <rect width="38" height="38" rx="10" fill="url(#biliBgGrad)" />
              <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="9.25" stroke="#FBBF24" strokeWidth="0.8" strokeOpacity="0.5" />
              <path d="M13 5H25L32 32H6L13 5Z" fill="url(#bluePhototherapyGrad)" />
              <rect x="12" y="4" width="14" height="3.5" rx="1.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
              <line x1="14" y1="7.5" x2="24" y2="7.5" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="19" cy="22" r="7.5" fill="url(#sunCoreGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M19 17.2C17.3 17.2 16.2 18.5 16.2 19.8C16.2 21.3 17.4 22.4 19 22.4C20.6 22.4 21.8 21.3 21.8 19.8C21.8 18.5 20.7 17.2 19 17.2Z" fill="#FFFFFF" fillOpacity="0.9" />
              <path d="M19 11.5V13.5M26.5 14.5L25 16M11.5 14.5L13 16M28.5 22H26.5M11.5 22H9.5M26.5 29.5L25 28M11.5 29.5L13 28M19 30.5V32.5" stroke="#FEF08A" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M7.5 8L8.2 9.5L9.7 10.2L8.2 10.9L7.5 12.4L6.8 10.9L5.3 10.2L6.8 9.5L7.5 8Z" fill="#38BDF8" />
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
