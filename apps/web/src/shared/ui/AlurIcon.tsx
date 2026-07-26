"use client";

import React from "react";

export type AlurIconId =
  | "respirasi"
  | "neurologi"
  | "metabolik"
  | "infeksi"
  | "asma"
  | "kejang-demam"
  | "dbd"
  | "hipoglikemia"
  | "kad"
  | string;

interface AlurIconProps {
  id: AlurIconId;
  size?: number;
  className?: string;
}

export const AlurIcon: React.FC<AlurIconProps> = ({
  id,
  size = 28,
  className = "",
}) => {
  // 1. CATEGORY: RESPIRASI
  if (id === "respirasi") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#E6F4EA" />
        <path
          d="M12 4.5V11.5M12 11.5L8.5 14M12 11.5L15.5 14"
          stroke="#1C7C54"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 14C6.5 14 5 15.5 5 17.5C5 19.5 6.8 20 8.5 20C10.2 20 11 18.5 11 17C11 15.5 10 14 8.5 14Z"
          fill="#A7F3D0"
          stroke="#166534"
          strokeWidth="1.5"
        />
        <path
          d="M15.5 14C17.5 14 19 15.5 19 17.5C19 19.5 17.2 20 15.5 20C13.8 20 13 18.5 13 17C13 15.5 14 14 15.5 14Z"
          fill="#A7F3D0"
          stroke="#166534"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  // 2. CATEGORY: NEUROLOGI
  if (id === "neurologi") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F3E8FF" />
        <path
          d="M12 5C9.5 5 7.5 6.8 7.5 9C7.5 10.2 8 11.2 8.8 12C7.7 12.8 7 14 7 15.5C7 17.5 8.8 19 11 19H12M12 5C14.5 5 16.5 6.8 16.5 9C16.5 10.2 16 11.2 15.2 12C16.3 12.8 17 14 17 15.5C17 17.5 15.2 19 13 19H12"
          stroke="#7A3EC0"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M12 5V19" stroke="#6821A8" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="10" cy="9" r="1.2" fill="#9333EA" />
        <circle cx="14" cy="9" r="1.2" fill="#9333EA" />
        <path d="M9.5 15.5L14.5 15.5" stroke="#7E22CE" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. CATEGORY: METABOLIK
  if (id === "metabolik") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FEF3C7" />
        <path
          d="M12 3.5C12 3.5 17.5 9 17.5 13.5C17.5 16.5 15 19 12 19C9 19 6.5 16.5 6.5 13.5C6.5 9 12 3.5 12 3.5Z"
          fill="#FDE68A"
          stroke="#C9761A"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 10V15.5M9.5 12.8H14.5" stroke="#B45309" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. CATEGORY: INFEKSI
  if (id === "infeksi") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#CCFBF1" />
        <path
          d="M12 3.5L18.5 6.5V11.5C18.5 16 15.5 19.5 12 20.5C8.5 19.5 5.5 16 5.5 11.5V6.5L12 3.5Z"
          fill="#99F6E4"
          stroke="#0F766E"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 8V14M9 11H15" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. CONDITION: ASMA (Serangan Asma)
  if (id === "asma") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#E0F2FE" />
        {/* Lungs & Airway Expansion */}
        <path
          d="M12 4V10.5M12 10.5L8.5 13M12 10.5L15.5 13"
          stroke="#0284C7"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 13C6.5 13 5 14.5 5 16.8C5 18.8 6.8 19.5 8.5 19.5C10.2 19.5 11 18 11 16.5C11 15 10 13 8.5 13Z"
          fill="#BAE6FD"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        <path
          d="M15.5 13C17.5 13 19 14.5 19 16.8C19 18.8 17.2 19.5 15.5 19.5C13.8 19.5 13 18 13 16.5C13 15 14 13 15.5 13Z"
          fill="#BAE6FD"
          stroke="#0369A1"
          strokeWidth="1.5"
        />
        {/* Aerosol Puffs */}
        <circle cx="6.5" cy="8" r="1" fill="#38BDF8" />
        <circle cx="9" cy="6.5" r="1.5" fill="#0284C7" />
        <circle cx="15" cy="6.5" r="1.5" fill="#0284C7" />
        <circle cx="17.5" cy="8" r="1" fill="#38BDF8" />
      </svg>
    );
  }

  // 6. CONDITION: KEJANG-DEMAM (Kejang Demam)
  if (id === "kejang-demam") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F3E8FF" />
        {/* Thermometer */}
        <path
          d="M8 5.5C8 4.4 8.9 3.5 10 3.5C11.1 3.5 12 4.4 12 5.5V12.2C13.2 13 14 14.4 14 16C14 18.2 12.2 20 10 20C7.8 20 6 18.2 6 16C6 14.4 6.8 13 8 12.2V5.5Z"
          fill="#DDD6FE"
          stroke="#7C3AED"
          strokeWidth="1.6"
        />
        <circle cx="10" cy="16" r="2.2" fill="#EF4444" />
        <path d="M10 9V14" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
        {/* EEG Lightning / Electric Wave */}
        <path
          d="M15 6L13.5 10H16.5L15 14"
          stroke="#D97706"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 7. CONDITION: DBD (Demam Berdarah Dengue)
  if (id === "dbd") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FFE4E6" />
        {/* Blood Cell / Plasma Droplet */}
        <path
          d="M12 3.5C12 3.5 18 9 18 13.5C18 16.8 15.3 19.5 12 19.5C8.7 19.5 6 16.8 6 13.5C6 9 12 3.5 12 3.5Z"
          fill="#FECDD3"
          stroke="#E11D48"
          strokeWidth="1.8"
        />
        {/* Mosquito Wing & Body Lines */}
        <path d="M12 8.5V15.5" stroke="#9F1239" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 11L15 13M9 13L15 11" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#9F1239" />
      </svg>
    );
  }

  // 8. CONDITION: HIPOGLIKEMIA (Hipoglikemia)
  if (id === "hipoglikemia") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FFEDD5" />
        {/* Glucose Meter Screen */}
        <rect x="5" y="4" width="14" height="16" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.8" />
        <rect x="7.5" y="6.5" width="9" height="5.5" rx="1.5" fill="#FFFFFF" stroke="#F97316" strokeWidth="1.2" />
        {/* Low Meter Level Reading */}
        <path d="M9 9.2H12.5" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="9.2" r="1" fill="#DC2626" />
        {/* Blood Strip Drop */}
        <path d="M12 14.5V17.5" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="14" r="1.2" fill="#EA580C" />
      </svg>
    );
  }

  // 9. CONDITION: KAD (Ketoasidosis Diabetik)
  if (id === "kad") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F3E8FF" />
        {/* IV Drip Bag / Syringe */}
        <path
          d="M8 4.5H16V13C16 15.2 14.2 17 12 17C9.8 17 8 15.2 8 13V4.5Z"
          fill="#DDD6FE"
          stroke="#6D28D9"
          strokeWidth="1.8"
        />
        <path d="M12 17V20.5" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 2.5H14" stroke="#5B21B6" strokeWidth="1.8" strokeLinecap="round" />
        {/* Fluid level & pH test drop */}
        <path d="M8.5 9.5C10 10.5 14 8.5 15.5 9.5" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="12" cy="13.5" r="1.5" fill="#EF4444" />
      </svg>
    );
  }

  // DEFAULT FALLBACK SVG
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="6" fill="#EFF6FF" />
      <path d="M12 4L19 8V16L12 20L5 16V8L12 4Z" stroke="#2563EB" strokeWidth="1.8" fill="#DBEAFE" fillOpacity="0.5" />
      <circle cx="12" cy="12" r="2" fill="#1D4ED8" />
    </svg>
  );
};
