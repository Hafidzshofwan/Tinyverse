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
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>
                <linearGradient id="bluePhototherapyGrad" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="babySkinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="100%" stopColor="#FDBA74" />
                </linearGradient>
              </defs>
              {/* Card Container Background */}
              <rect width="38" height="38" rx="10" fill="url(#biliBgGrad)" />
              <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="9.25" stroke="#38BDF8" strokeWidth="0.8" strokeOpacity="0.4" />
              
              {/* Phototherapy Blue Light Beam Cone */}
              <path d="M10 8L28 8L34 31H4L10 8Z" fill="url(#bluePhototherapyGrad)" />

              {/* Phototherapy Rays */}
              <line x1="12" y1="8" x2="8" y2="28" stroke="#38BDF8" strokeWidth="0.7" strokeDasharray="1.5 1.5" opacity="0.7" />
              <line x1="19" y1="8" x2="19" y2="28" stroke="#7DD3FC" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.85" />
              <line x1="26" y1="8" x2="30" y2="28" stroke="#38BDF8" strokeWidth="0.7" strokeDasharray="1.5 1.5" opacity="0.7" />
              
              {/* Floating Light Photons */}
              <circle cx="15" cy="13" r="0.8" fill="#E0F2FE" />
              <circle cx="23" cy="16" r="0.8" fill="#E0F2FE" />
              <circle cx="18" cy="11" r="1" fill="#BAE6FD" />

              {/* Overhead Phototherapy Lamp Unit */}
              <line x1="19" y1="1" x2="19" y2="3.5" stroke="#64748B" strokeWidth="1.2" />
              <rect x="8" y="3.5" width="22" height="4.5" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
              <rect x="11" y="5.2" width="16" height="1.3" rx="0.65" fill="#BAE6FD" />

              {/* Incubator Bed Base & Mattress */}
              <rect x="5" y="30" width="28" height="4" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.8" />
              <rect x="6" y="28" width="26" height="2.5" rx="1" fill="#F8FAFC" />

              {/* Newborn Baby sleeping under therapy light */}
              {/* Baby Head */}
              <circle cx="13.5" cy="25" r="3.2" fill="url(#babySkinGrad)" />
              {/* Protective Phototherapy Eye Mask / Goggles */}
              <rect x="11.5" y="23.8" width="4.5" height="1.8" rx="0.8" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.5" />
              <line x1="10.8" y1="24.7" x2="16.2" y2="24.7" stroke="#334155" strokeWidth="0.6" />
              {/* Baby Body */}
              <ellipse cx="21" cy="25.8" rx="5.5" ry="2.8" fill="url(#babySkinGrad)" />
              {/* Diaper / Swaddle Blanket */}
              <path d="M19.5 24 C22 24 26 24.8 26 26.8 C25 28.2 21.5 28.2 19 27.5 Z" fill="#FFFFFF" opacity="0.95" />
              {/* Baby Arm */}
              <circle cx="17" cy="25.2" r="0.9" fill="#FCA5A5" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px" }}>Bilirubin Neonatus</h2>
            <p style={{ fontSize: "10.24px" }}>
              Ambang batas fototerapi, peningkatan perawatan &amp; transfusi tukar bayi baru lahir.
            </p>
          </div>
        </div>
        <BilirubinForm />
      </div>
    </div>
  );
}
