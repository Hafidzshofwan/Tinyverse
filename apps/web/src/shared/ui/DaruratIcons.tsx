"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

// 1. User / Patient Icon
export const UserPatientIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#EEF2FF" />
    <circle cx="12" cy="8.5" r="3" fill="#4338CA" />
    <path d="M6 18.5C6 15.8 8.7 13.8 12 13.8C15.3 13.8 18 15.8 18 18.5" stroke="#4338CA" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 2. Save Icon
export const SaveDataIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 3. Copy Icon
export const CopyDataIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 4. Warning / Alert Icon
export const AlertWarnIcon: React.FC<IconProps> = ({ size = 20, className = "", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 3L2 21H22L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 9V14" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="#B45309" />
  </svg>
);

// 5. Brain / GCS Icon
export const BrainGcsIcon: React.FC<IconProps> = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#F3E8FF" />
    <path d="M12 5C9.5 5 7.5 6.8 7.5 9C7.5 10.2 8 11.2 8.8 12C7.7 12.8 7 14 7 15.5C7 17.5 8.8 19 11 19H12" stroke="#7E22CE" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 5C14.5 5 16.5 6.8 16.5 9C16.5 10.2 16 11.2 15.2 12C16.3 12.8 17 14 17 15.5C17 17.5 15.2 19 13 19H12" stroke="#7E22CE" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="10" cy="9" r="1.2" fill="#9333EA" />
    <circle cx="14" cy="9" r="1.2" fill="#9333EA" />
  </svg>
);

// 6. Eye Icon (GCS Eye)
export const GcsEyeIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
  </svg>
);

// 7. Speech / Verbal Icon (GCS Verbal)
export const GcsVerbalIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5 20 9.1 19.6 7.8 18.9L3 20L4.3 16.2C3.5 15 3 13.3 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11.5H16M10 8.5H14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 8. Motor / Arm Icon (GCS Motor)
export const GcsMotorIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 16.5L9 11L13 13L18 5" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="16.5" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="18" cy="5" r="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
  </svg>
);

// 9. PAT Triangle Icon
export const PatTriangleIcon: React.FC<IconProps> = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#FFE4E6" />
    <path d="M12 4L3.5 19H20.5L12 4Z" fill="#FECDD3" stroke="#E11D48" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="1.5" fill="#9F1239" />
  </svg>
);

// 10. Syringe / Emergency Drug Icon
export const EmergencyDrugIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 3L21 6L18 9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7L17 10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 6L8.5 12.5L11.5 15.5L18 9L15 6Z" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8.5 12.5L3 18V21H6L11.5 15.5" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 22L5 19" stroke="#991B1B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 11. Cardiac / Defib Icon
export const DefibIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="#FECDD3" stroke="#E11D48" strokeWidth="1.8" />
    <path d="M13 6L9 12H13L10 17" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 12. Airway / Lungs Icon
export const LungsIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4V11.5M12 11.5L8.5 14M12 11.5L15.5 14" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.5 14C6.5 14 5 15.5 5 17.5C5 19.5 6.8 20 8.5 20C10.2 20 11 18.5 11 17C11 15.5 10 14 8.5 14Z" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.5" />
    <path d="M15.5 14C17.5 14 19 15.5 19 17.5C19 19.5 17.2 20 15.5 20C13.8 20 13 18.5 13 17C13 15.5 14 14 15.5 14Z" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.5" />
  </svg>
);

// 13. Fluid / IV Drop Icon
export const FluidDropIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2.5C12 2.5 18 8 18 13.5C18 16.8 15.3 19.5 12 19.5C8.7 19.5 6 16.8 6 13.5C6 8 12 2.5 12 2.5Z" fill="#BFDBFE" stroke="#2563EB" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 12.5C10 12.5 11.5 11 13 12.5" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 14. Timer / Stopwatch Icon
export const ResusStopwatchIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="13" r="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <path d="M12 9V13L15 15" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 2H14M12 2V5" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 15. Stethoscope Icon
export const StethoscopeIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 3V9C6 12.3137 8.68629 15 12 15C15.3137 15 18 12.3137 18 9V3" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 15V18C12 19.6569 13.3431 21 15 21H17" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
    <circle cx="19" cy="21" r="2" fill="#99F6E4" stroke="#0F766E" strokeWidth="1.8" />
  </svg>
);

// 16. Book Reference Icon
export const BookRefIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20V4H6.5C5.11929 4 4 5.11929 4 6.5V19.5Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 19.5C4 20.8807 5.11929 22 6.5 22H20" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 17. Print Icon
export const PrintReportIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="14" width="12" height="8" rx="1" fill="#fff" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 18. Mic Voice Icon
export const MicVoiceIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V22M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 19. Play Icon
export const PlayTimerIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
  </svg>
);

// 20. Stop Icon
export const StopTimerIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" />
  </svg>
);

// 21. Metronome Icon
export const MetronomeIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 21L12 3L17 21H7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 18L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="8" r="2" fill="currentColor" />
  </svg>
);

// 22. Pill & Capsule Icon (Obat Emergensi)
export const PillCapsuleIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="11" width="14" height="7" rx="3.5" transform="rotate(-45 3 11)" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
    <path d="M7.5 13.5L13.5 7.5" stroke="#DC2626" strokeWidth="2" />
    <circle cx="18" cy="18" r="3" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5" />
  </svg>
);

// 23. Heartbeat Pulse Icon (Obat Henti Jantung & Aritmia)
export const HeartBeatPulseIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FFF1F2" stroke="#E11D2A" strokeWidth="1.5" />
    <path d="M3.5 11.5H7.5L9 8L11.5 15L13.5 9.5L15 11.5H19.5" stroke="#E11D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 24. Lightning Shock Icon (Energi Listrik)
export const LightningShockIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

// 25. Airway Tube Icon (Jalan Napas & Alat)
export const AirwayTubeIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 3V7C6 11.4183 9.58172 15 14 15H21" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 11L22 15L18 19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="2" width="6" height="3" rx="1" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2" fill="#60A5FA" />
  </svg>
);

// 26. IV Fluid Bag Icon (Cairan Resusitasi)
export const IvFluidBagIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="7" y="5" width="10" height="13" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
    <path d="M10 2H14" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 2V5" stroke="#0284C7" strokeWidth="2" />
    <path d="M9 10C9 10 10.5 12 12 12C13.5 12 15 10 15 10" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 18V22" stroke="#0284C7" strokeWidth="2" />
    <circle cx="12" cy="22" r="1.5" fill="#0284C7" />
  </svg>
);

// 27. Syringe Infiltration Icon (Obat RSI / Intubasi)
export const SyringeInfiltrationIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 3L21 6" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.5 4.5L19.5 7.5" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 6L8 13" stroke="#9333EA" strokeWidth="2" />
    <rect x="7" y="10" width="8" height="5" rx="1" transform="rotate(-45 7 10)" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2" />
    <path d="M6 17L3 20" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 22L5 19" stroke="#7E22CE" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// --- Individual Per-Drug & Per-Device Icons for PALS ---

export const DrugEpiIvIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FEF2F2" />
    <path d="M17 3L21 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 5L7 13" stroke="#DC2626" strokeWidth="2" />
    <rect x="6" y="11" width="8" height="5" rx="1" transform="rotate(-45 6 11)" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="1.5" />
    <path d="M5 18L2 21" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2.5" fill="#EF4444" />
  </svg>
);

export const DrugEpiEtIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FFF7ED" />
    <path d="M5 19C5 12 10 5 18 5" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 3V7M16 5H20" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="10" cy="14" r="3" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5" />
  </svg>
);

export const DrugAmiodaroneIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FDF2F8" />
    <rect x="8" y="7" width="8" height="12" rx="2" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
    <path d="M9 13H11L12 10L13.5 15L14.5 13H15.5" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DrugLidocaineIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#EFF6FF" />
    <rect x="8" y="6" width="8" height="13" rx="2" fill="#BFDBFE" stroke="#2563EB" strokeWidth="1.5" />
    <path d="M10 3H14V6H10V3Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2" fill="#1E40AF" />
  </svg>
);

export const DrugAdenosine1Icon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FFFBEB" />
    <path d="M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V9L18 12V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V12L8 9V5Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="12" cy="15" r="3" fill="#F59E0B" />
    <text x="12" y="17.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">1</text>
  </svg>
);

export const DrugAdenosine2Icon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FFF7ED" />
    <path d="M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V9L18 12V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V12L8 9V5Z" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5" />
    <circle cx="12" cy="15" r="3" fill="#C2410C" />
    <text x="12" y="17.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">2</text>
  </svg>
);

export const DrugAtropineIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#ECFDF5" />
    <rect x="8" y="7" width="8" height="12" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#34D399" stroke="#047857" strokeWidth="1.2" />
    <path d="M12 11V15M10 13H14" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DrugMgSO4Icon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#EEF2FF" />
    <rect x="7" y="6" width="10" height="13" rx="2" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill="#312E81" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Mg</text>
  </svg>
);

export const DrugCaGluconateIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FEFCE8" />
    <rect x="7" y="6" width="10" height="13" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill="#854D0E" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Ca</text>
  </svg>
);

export const DrugNaBicarbIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#ECFEFF" />
    <rect x="7" y="6" width="10" height="13" rx="2" fill="#A5F3FC" stroke="#0891B2" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill="#164E63" fontSize="7" fontWeight="bold" fontFamily="sans-serif">HCO3</text>
  </svg>
);

export const EnergyDefibIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FEF2F2" />
    <rect x="4" y="6" width="7" height="12" rx="1.5" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
    <rect x="13" y="6" width="7" height="12" rx="1.5" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M13 3L11 9H14L12 15" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EnergyCardioversionIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FAF5FF" />
    <path d="M12 20.35l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.78-3.4 6.86-8.55 11.54L12 20.35z" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.5" />
    <path d="M7 11H10L11 7L13 15L14 11H17" stroke="#7E22CE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DeviceEttCuffedIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#EFF6FF" />
    <path d="M4 18C4 18 8 18 12 12C16 6 20 6 20 6" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="10" cy="15" rx="3" ry="2" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.2" />
  </svg>
);

export const DeviceEttUncuffedIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F0F9FF" />
    <path d="M4 18C4 18 8 18 12 12C16 6 20 6 20 6" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const DeviceEttDepthIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#ECFDF5" />
    <rect x="3" y="10" width="18" height="4" rx="1" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
    <path d="M6 10V12M9 10V13M12 10V12M15 10V13M18 10V12" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const DeviceSuctionCatheterIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F8FAFC" />
    <path d="M3 20C8 20 10 14 15 10C18 7.6 21 7 21 7" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    <circle cx="21" cy="7" r="1.5" fill="#0EA5E9" />
  </svg>
);

export const DeviceLaryngoscopeIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F3E8FF" />
    <rect x="6" y="12" width="5" height="9" rx="1" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
    <path d="M8.5 12V5C8.5 5 11 5 15 8C18 10.25 19 11 19 11" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="9" r="1.5" fill="#F59E0B" />
  </svg>
);

export const FluidIsotonicSalineIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F0F9FF" />
    <rect x="7" y="6" width="10" height="12" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
    <path d="M10 3H14V6H10V3Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2" fill="#0284C7" />
  </svg>
);

export const FluidPediatricBolusIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FDF2F8" />
    <rect x="7" y="6" width="10" height="12" rx="2" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1.5" />
    <path d="M10 3H14V6H10V3Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
    <path d="M12 10C12 10 10.5 12 10.5 13C10.5 13.8284 11.1716 14.5 12 14.5C12.8284 14.5 13.5 13.8284 13.5 13C13.5 12 12 10 12 10Z" fill="#BE185D" />
  </svg>
);

export const DrugKetamineIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F3E8FF" />
    <rect x="7" y="7" width="10" height="11" rx="2" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fill="#5B21B6" fontSize="8" fontWeight="bold" fontFamily="sans-serif">K</text>
  </svg>
);

export const DrugMidazolamIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#F5F3FF" />
    <rect x="7" y="7" width="10" height="11" rx="2" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fill="#4C1D95" fontSize="8" fontWeight="bold" fontFamily="sans-serif">M</text>
  </svg>
);

export const DrugFentanylIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FDF2F8" />
    <rect x="7" y="7" width="10" height="11" rx="2" fill="#FBCFE8" stroke="#D946EF" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#F0ABFC" stroke="#C026D3" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fill="#701A75" fontSize="8" fontWeight="bold" fontFamily="sans-serif">F</text>
  </svg>
);

export const DrugRocuroniumIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FFF1F2" />
    <path d="M16 3L19 6" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 5L7 12" stroke="#E11D48" strokeWidth="2" />
    <rect x="6" y="10" width="8" height="5" rx="1" transform="rotate(-45 6 10)" fill="#FECDD3" stroke="#BE123C" strokeWidth="1.5" />
    <path d="M5 17L2 20" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DrugSuccinylcholineIcon: React.FC<IconProps> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="5" fill="#FEF2F2" />
    <rect x="7" y="7" width="10" height="11" rx="2" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M10 4H14V7H10V4Z" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="1.2" />
    <text x="12" y="15" textAnchor="middle" fill="#7F1D1D" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Sch</text>
  </svg>
);


