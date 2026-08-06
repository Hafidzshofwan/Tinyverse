import { TpnNeonatusForm } from "@/features/tpn-neonatus";

export function TpnNeonatusPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="tpnBgGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="tpnFluidGrad" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="lipidGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <rect width="38" height="38" rx="10" fill="url(#tpnBgGrad)" />
              <rect x="0.75" y="0.75" width="36.5" height="36.5" rx="9.25" stroke="#60A5FA" strokeWidth="0.8" strokeOpacity="0.5" />
              <path d="M19 3V5" stroke="#93C5FD" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M17 5H21" stroke="#93C5FD" strokeWidth="1.6" strokeLinecap="round" />
              <rect x="11" y="7" width="16" height="18" rx="3.5" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="1.4" />
              <path d="M12 13.5H26V22A3 3 0 0 1 23 25H15A3 3 0 0 1 12 22V13.5Z" fill="url(#tpnFluidGrad)" fillOpacity="0.85" />
              <path d="M19 15.5C17.2 15.5 16 16.8 16 18.2C16 19.8 17.3 21 19 21C20.7 21 22 19.8 22 18.2C22 16.8 20.8 15.5 19 15.5Z" fill="url(#lipidGrad)" />
              <path d="M18.2 16.8C18.2 16.8 17.5 17.5 17.5 18.2" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
              <rect x="17.5" y="25" width="3" height="3" rx="0.5" fill="#93C5FD" />
              <path d="M19 28V33C19 34.2 20 35 21.2 35" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="21.2" cy="35" r="0.9" fill="#38BDF8" />
              <path d="M29 6.5L29.8 8.2L31.5 9L29.8 9.8L29 11.5L28.2 9.8L26.5 9L28.2 8.2L29 6.5Z" fill="#FDE047" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "19.48px" }}>TPN Neonatus</h2>
            <p style={{ fontSize: "10.24px" }}>Nutrisi parenteral total: GIR, asam amino & lipid.</p>
          </div>
        </div>
        <TpnNeonatusForm />
      </div>
    </div>
  );
}
