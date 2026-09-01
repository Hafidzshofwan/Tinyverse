"use client";

import React from "react";
import { SidebarIcon, type SidebarIconSlug } from "./SidebarIcon";

export type ClinicalIconType =
  | SidebarIconSlug
  | "cairan"
  | "dehidrasi"
  | "neonatus"
  | "ikterus"
  | "skoring"
  | "tumbuh-kembang"
  | "gizi"
  | "ftt-gizi"
  | "obat"
  | "farmakologi"
  | "respirasi"
  | "asmatikus"
  | "neurologi"
  | "kejang-demam"
  | "quiz"
  | "uji-pemahaman"
  | "kasus"
  | "berbasis-kasus"
  | "lightbulb"
  | "info"
  | "check-badge"
  | "trophy"
  | "book"
  | "refresh"
  | "tryout"
  | "cbt"
  | "exam";

interface ClinicalSvgIconProps {
  name: ClinicalIconType | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ClinicalSvgIcon: React.FC<ClinicalSvgIconProps> = ({
  name,
  size = 24,
  className = "",
  style,
}) => {
  const norm = (name || "").toLowerCase().trim();

  // 1. Menu-mirrored icons (reusing the exact Sidebar SVG icons)
  if (norm === "cairan" || norm === "dehidrasi" || norm === "fluids") {
    return <SidebarIcon slug="cairan" size={size} className={className} />;
  }
  if (norm === "neonatus" || norm === "ikterus" || norm === "bilirubin" || norm === "tpn-neonatus") {
    return <SidebarIcon slug="neonatus" size={size} className={className} />;
  }
  if (norm === "skoring" || norm === "scoring") {
    return <SidebarIcon slug="skoring" size={size} className={className} />;
  }
  if (norm === "tumbuh-kembang" || norm === "gizi" || norm === "ftt-gizi" || norm === "pertumbuhan") {
    return <SidebarIcon slug="tumbuh-kembang" size={size} className={className} />;
  }
  if (norm === "obat" || norm === "farmakologi" || norm === "dosis" || norm === "dosing" || norm === "puyer") {
    return <SidebarIcon slug="obat" size={size} className={className} />;
  }
  if (norm === "darurat" || norm === "emergency") {
    return <SidebarIcon slug="darurat" size={size} className={className} />;
  }
  if (norm === "alur") {
    return <SidebarIcon slug="alur" size={size} className={className} />;
  }
  if (norm === "tekanan-darah") {
    return <SidebarIcon slug="tekanan-darah" size={size} className={className} />;
  }
  if (norm === "egfr") {
    return <SidebarIcon slug="egfr" size={size} className={className} />;
  }
  if (norm === "lab") {
    return <SidebarIcon slug="lab" size={size} className={className} />;
  }
  if (norm === "protokol" || norm === "guideline") {
    return <SidebarIcon slug="protokol" size={size} className={className} />;
  }
  if (norm === "imunisasi") {
    return <SidebarIcon slug="imunisasi" size={size} className={className} />;
  }
  if (norm === "ringkasan") {
    return <SidebarIcon slug="ringkasan" size={size} className={className} />;
  }
  if (norm === "pembelajaran" || norm === "ruang-belajar") {
    return <SidebarIcon slug="pembelajaran" size={size} className={className} />;
  }
  if (norm === "ai-assistant") {
    return <SidebarIcon slug="ai-assistant" size={size} className={className} />;
  }
  if (norm === "beranda") {
    return <SidebarIcon slug="beranda" size={size} className={className} />;
  }

  // 2. Custom Medical / Clinical SVGs for non-sidebar items
  if (norm === "respirasi" || norm === "asmatikus" || norm === "asma" || norm === "paru") {
    // Anatomical Pediatric Respiratory & Lungs SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#F0F9FF" />
        {/* Trachea and main bronchi */}
        <path d="M12 3V10M12 7L9.5 5.5M12 8.5L14.5 7" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
        {/* Left Lung */}
        <path
          d="M11 10.5C9 10.5 5 11.5 5 15.5C5 18 7 19.5 9 19.5C10.5 19.5 11 18.2 11 17V10.5Z"
          fill="#BAE6FD"
          stroke="#0284C7"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Right Lung with cardiac notch */}
        <path
          d="M13 10.5C15 10.5 19 11.5 19 15.5C19 18 17 19.5 15 19.5C13.5 19.5 13 18.2 13 17V10.5Z"
          fill="#38BDF8"
          fillOpacity="0.45"
          stroke="#0284C7"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Internal bronchial tree branching */}
        <path d="M8.5 13.5C7.8 14.5 7.8 16 8.5 17" stroke="#0369A1" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M15.5 13.5C16.2 14.5 16.2 16 15.5 17" stroke="#0369A1" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "neurologi" || norm === "kejang-demam" || norm === "kejang" || norm === "otak") {
    // Pediatric Neurology / Brain Cortex & Neural Synapse SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#FAF5FF" />
        {/* Left Brain Hemisphere */}
        <path
          d="M12 5C9.8 5 8 6.5 8 8.5C6.5 8.8 5.5 10 5.5 11.5C5.5 12.8 6.2 13.8 7.2 14.2C7 15 7.5 16.2 8.5 17C9.2 17.5 10.5 18 12 18V5Z"
          fill="#E9D5FF"
          stroke="#7E22CE"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Right Brain Hemisphere */}
        <path
          d="M12 5C14.2 5 16 6.5 16 8.5C17.5 8.8 18.5 10 18.5 11.5C18.5 12.8 17.8 13.8 16.8 14.2C17 15 16.5 16.2 15.5 17C14.8 17.5 13.5 18 12 18V5Z"
          fill="#DDD6FE"
          stroke="#7E22CE"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Internal sulci & fissures */}
        <path d="M9.5 9C10.5 9.5 10.5 11 9 11.5M9.5 14C10.5 14 11 15 10 16" stroke="#6B21A8" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14.5 9C13.5 9.5 13.5 11 15 11.5M14.5 14C13.5 14 13 15 14 16" stroke="#6B21A8" strokeWidth="1.2" strokeLinecap="round" />
        {/* Synaptic flash / impulse */}
        <circle cx="12" cy="11.5" r="1.5" fill="#A855F7" />
      </svg>
    );
  }

  // 3. Tab & Educational UI SVGs
  if (norm === "quiz" || norm === "uji-pemahaman" || norm === "kuis" || norm === "mcq") {
    // MCQ Exam Checklist / Quiz Clipboard SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#EEF2FF" />
        <path d="M8 4H16C16.5523 4 17 4.44772 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5C7 4.44772 7.44772 4 8 4Z" fill="#FFFFFF" stroke="#4338CA" strokeWidth="1.6" />
        <path d="M10 3H14V5H10V3Z" fill="#C7D2FE" stroke="#4338CA" strokeWidth="1.4" strokeLinejoin="round" />
        {/* Checkmarks & options */}
        <path d="M9.5 9L10.5 10L12.5 8" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="9" x2="15.5" y2="9" stroke="#4338CA" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9.5 13L10.5 14L12.5 12" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="13" x2="15.5" y2="13" stroke="#4338CA" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="10" cy="16.5" r="1" fill="#F43F5E" />
        <line x1="12.5" y1="16.5" x2="15.5" y2="16.5" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "kasus" || norm === "berbasis-kasus" || norm === "case" || norm === "stetoskop") {
    // Clinical Stethoscope & Case Investigation SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#FDF2F8" />
        {/* Stethoscope earpieces & tube */}
        <path d="M6 5V9C6 11.5 8 13.5 10.5 13.5H13.5C16 13.5 18 11.5 18 9V5" stroke="#BE185D" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="6" cy="4.5" r="1" fill="#BE185D" />
        <circle cx="18" cy="4.5" r="1" fill="#BE185D" />
        {/* Center tube down */}
        <path d="M12 13.5V16C12 17.5 13 18.5 14.5 18.5H15.5" stroke="#BE185D" strokeWidth="1.6" strokeLinecap="round" />
        {/* Chestpiece */}
        <circle cx="17.5" cy="18.5" r="2.5" fill="#FCE7F3" stroke="#9D174D" strokeWidth="1.6" />
        <circle cx="17.5" cy="18.5" r="1" fill="#D936A6" />
      </svg>
    );
  }

  if (norm === "lightbulb" || norm === "info" || norm === "tip") {
    // Clinical Tip / Glowing Idea Lightbulb SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#FEFCE8" />
        <path
          d="M9 15C8.2 14.2 7.5 13 7.5 11.5C7.5 9 9.5 7 12 7C14.5 7 16.5 9 16.5 11.5C16.5 13 15.8 14.2 15 15H9Z"
          fill="#FEF08A"
          stroke="#CA8A04"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M10 18H14M10.5 20H13.5" stroke="#A16207" strokeWidth="1.6" strokeLinecap="round" />
        {/* Radiating light rays */}
        <path d="M12 3.5V5M5 11.5H3.5M20.5 11.5H19M6.5 6L7.8 7.3M17.5 6L16.2 7.3" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (norm === "check-badge" || norm === "selesai" || norm === "verified") {
    // Verified / Clinical Completion Checkmark Badge SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#F0FDF4" />
        <path
          d="M12 3.5L14.2 5.2L17 5.1L18 7.7L20.4 9.1L19.8 11.8L21 14.2L19.2 16.3L19.2 19L16.5 19.5L14.8 21.4L12 20.6L9.2 21.4L7.5 19.5L4.8 19L4.8 16.3L3 14.2L4.2 11.8L3.6 9.1L6 7.7L7 5.1L9.8 5.2L12 3.5Z"
          fill="#DCFCE7"
          stroke="#16A34A"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M8.5 12.5L11 15L16 9.5" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (norm === "trophy" || norm === "celebration" || norm === "juara") {
    // Pediatric Clinical Achievement Trophy / Star Medal SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#FFFBEB" />
        {/* Trophy cup */}
        <path
          d="M7 5H17V10C17 12.8 14.8 15 12 15C9.2 15 7 12.8 7 10V5Z"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Handles */}
        <path d="M7 7H4.5C3.7 7 3 7.7 3 8.5C3 10.2 4.3 11.5 6 11.5H7" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 7H19.5C20.3 7 21 7.7 21 8.5C21 10.2 19.7 11.5 18 11.5H17" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        {/* Stem & base */}
        <path d="M12 15V18M8 20H16" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
        {/* Star inside cup */}
        <path d="M12 7.5L12.7 9L14.3 9.2L13.1 10.3L13.5 11.9L12 11L10.5 11.9L10.9 10.3L9.7 9.2L11.3 9L12 7.5Z" fill="#F59E0B" />
      </svg>
    );
  }

  if (norm === "book" || norm === "referensi" || norm === "buku") {
    // Medical Textbook & References SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#F1F5F9" />
        <path d="M5 6C5 4.9 5.9 4 7 4H19V18H7C5.9 18 5 18.9 5 20V6Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M5 20C5 18.9 5.9 18 7 18H19" stroke="#475569" strokeWidth="1.6" />
        <path d="M9 7H15M9 10H15M9 13H13" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M14 4V10L16 8.5L18 10V4" fill="#E11D48" />
      </svg>
    );
  }

  if (norm === "refresh" || norm === "retry" || norm === "ulangi") {
    // Circular Reload / Retry SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C15.4286 4 18.3582 6.15574 19.4975 9.18359" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="20 4 20 9.5 14.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12C20 16.4183 16.4183 20 12 20C8.57143 20 5.64181 17.8443 4.50247 14.8164" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="4 20 4 14.5 9.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (norm === "tryout" || norm === "cbt" || norm === "exam" || norm === "uji-kompetensi") {
    // Professional CBT Exam / Pediatric Board Simulation SVG
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <rect width="24" height="24" rx="6" fill="#F0FDF4" />
        {/* Computer Screen / CBT Display */}
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="#16A34A" strokeWidth="1.6" fill="#DCFCE7" />
        {/* Base */}
        <path d="M8 19H16M12 16V19" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" />
        {/* Checkmark inside CBT screen */}
        <path d="M8 10L10.5 12.5L16 7" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Default fallback icon: Clipboard Document with stethoscope
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <rect width="24" height="24" rx="6" fill="#F8FAFC" />
      <path d="M8 4H16V20H8V4Z" stroke="#64748B" strokeWidth="1.6" fill="#FFFFFF" />
      <path d="M10 8H14M10 12H14M10 16H13" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};
