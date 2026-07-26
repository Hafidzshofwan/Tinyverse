import React from "react";

export type ClinicalScoreIconId =
  | "header"
  | "cds"
  | "croup"
  | "pas"
  | "downes"
  | "pass"
  | "kawasaki"
  | "centor"
  | "tbanak";

interface ClinicalScoreIconProps {
  id: ClinicalScoreIconId;
  size?: number;
  className?: string;
  fallbackEmoji?: string;
}

export const ClinicalScoreIcon: React.FC<ClinicalScoreIconProps> = ({
  id,
  size = 24,
  className = "",
  fallbackEmoji,
}) => {
  if (id === "header") {
    // Medical Calculator & Scoring Clipboard
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="6" y="7" width="24" height="25" rx="5" fill="#FFF1F2" fillOpacity="0.8" stroke="#D936A6" strokeWidth="2.2" />
        <rect x="13" y="4.5" width="10" height="4" rx="1.5" fill="#0A0B5F" />
        <path d="M11 14H18M11 19.5H16M11 25H18" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="23" cy="14" r="1.8" fill="#D936A6" />
        <circle cx="23" cy="19.5" r="1.8" fill="#10B981" />
        <circle cx="23" cy="25" r="1.8" fill="#F59E0B" />
      </svg>
    );
  }

  if (id === "cds") {
    // Clinical Dehydration Scale: Droplet & Level Indicator
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#EFF6FF" />
        <path d="M18 8C18 8 10 17.5 10 22.5C10 26.9 13.6 30 18 30C22.4 30 26 26.9 26 22.5C26 17.5 18 8 18 8Z" fill="#3B82F6" />
        <path d="M18 11.5C18 11.5 13 18.5 13 22.5C13 25.3 15.2 27.5 18 27.5" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="18" x2="23" y2="18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="19" y1="22" x2="23" y2="22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "croup") {
    // Westley Croup Score: Airway & Larynx Stridor Waves
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#FFF7ED" />
        <path d="M18 7V29" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 14C14 14 11 12 11 9" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 14C22 14 25 12 25 9" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 21C14 20 16 20 18 21C20 22 22 22 24 21" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 26C14 25 16 25 18 26C20 27 22 27 24 26" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "pas") {
    // Pediatric Appendicitis Score: Abdomen Quadrant Pain
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#FEF2F2" />
        <circle cx="18" cy="18" r="11" stroke="#EF4444" strokeWidth="2" />
        <line x1="18" y1="7" x2="18" y2="29" stroke="#FECDD3" strokeWidth="1.5" />
        <line x1="7" y1="18" x2="29" y2="18" stroke="#FECDD3" strokeWidth="1.5" />
        {/* RLQ Target */}
        <circle cx="22.5" cy="22.5" r="3.5" fill="#DC2626" />
        <circle cx="22.5" cy="22.5" r="5.5" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (id === "downes") {
    // Downes Score: Neonatal Lungs & Respiratory Distress Gauge
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#F0FDF4" />
        <path d="M18 9V26" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 13C14 12 9 14 9 20C9 24.5 13 27 16 27C17 27 18 26 18 25" fill="#15803D" fillOpacity="0.2" stroke="#16A34A" strokeWidth="2" />
        <path d="M18 13C22 12 27 14 27 20C27 24.5 23 27 20 27C19 27 18 26 18 25" fill="#15803D" fillOpacity="0.2" stroke="#16A34A" strokeWidth="2" />
        <path d="M13 18H23" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "pass") {
    // PASS: Pediatric Asthma Severity Score (Wind/Bronchus)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#F0FDFA" />
        <path d="M8 12C12 12 14 10 18 10C22 10 24 12 28 12" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 18C12 18 15 16 19 16C23 16 25 18 28 18" stroke="#14B8A6" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 24C11 24 13 22 17 22C21 22 23 24 28 24" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "kawasaki") {
    // Kawasaki Disease Criteria: Heart & Strawberry Vessel
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#FFF1F2" />
        <path d="M18 29C18 29 8 22 8 14.5C8 11.2 10.6 8.5 13.8 8.5C15.8 8.5 17.3 9.5 18 10.8C18.7 9.5 20.2 8.5 22.2 8.5C25.4 8.5 28 11.2 28 14.5C28 22 18 29 18 29Z" fill="#E11D48" />
        <circle cx="14" cy="14" r="1" fill="#FFFFFF" />
        <circle cx="22" cy="14" r="1" fill="#FFFFFF" />
        <circle cx="18" cy="18" r="1" fill="#FFFFFF" />
        <circle cx="15" cy="21" r="1" fill="#FFFFFF" />
        <circle cx="21" cy="21" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  if (id === "centor") {
    // Centor Score: Throat / Tonsil Inspection
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#FAF5FF" />
        <path d="M10 12C10 12 14 10 18 10C22 10 26 12 26 12V20C26 24 22 27 18 27C14 27 10 24 10 20V12Z" stroke="#7E22CE" strokeWidth="2" />
        <circle cx="14" cy="16" r="2.5" fill="#A855F7" />
        <circle cx="22" cy="16" r="2.5" fill="#A855F7" />
        <path d="M14 22C16 24 20 24 22 22" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "tbanak") {
    // Skoring TB Anak: Lungs Shield & Check
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="36" height="36" rx="8" fill="#F8FAFC" />
        <path d="M18 5L28 9V17C28 23.5 23.2 29.5 18 31C12.8 29.5 8 23.5 8 17V9L18 5Z" fill="#334155" fillOpacity="0.1" stroke="#475569" strokeWidth="2" />
        <path d="M14 17L17 20L23 13" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <span style={{ fontSize: size * 0.85, lineHeight: 1 }} className={className}>
      {fallbackEmoji || "🧮"}
    </span>
  );
};
