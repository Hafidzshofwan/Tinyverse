import { TpnNeonatusForm } from "@/features/tpn-neonatus";

export function TpnNeonatusPanel() {
  return (
    <div className="tv-page-cairan-wrapper">
      <div className="tv-page-cairan">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "transparent" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#EFF6FF" />
              <path d="M12 3.5C12 3.5 6.5 10.2 6.5 14.5C6.5 17.8 9 20 12 20C15 20 17.5 17.8 17.5 14.5C17.5 10.2 12 3.5 12 3.5Z" fill="#3B82F6" />
              <path d="M9.6 15.2C9.6 16.6 10.7 17.6 12 17.6" stroke="#EFF6FF" strokeWidth="1.3" strokeLinecap="round" />
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
