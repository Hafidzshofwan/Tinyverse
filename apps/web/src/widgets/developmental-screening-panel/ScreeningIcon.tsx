import React from "react";

export type IconStyleVariant = "svg-v1" | "svg-v2" | "svg-v3" | "emoji";

interface ScreeningIconProps {
  id: "kpsp" | "denver" | "mchat" | "header";
  variant?: IconStyleVariant;
  fallbackEmoji?: string;
  size?: number;
  className?: string;
}

/**
 * Custom SVG Icons with multiple artistic variations for Developmental Screening tools:
 * - KPSP (Pra-Skrining Perkembangan - Sprout / Growth)
 * - Denver II (4-Sector Development Test - Milestone Matrix / Grid)
 * - M-CHAT-R (Autism Risk Screening - Interlocking Puzzle & Heart)
 * - Header (General Developmental Screening - Comprehensive Child Health)
 */
export const ScreeningIcon: React.FC<ScreeningIconProps> = ({
  id,
  variant = "svg-v1",
  fallbackEmoji,
  size = 32,
  className = "",
}) => {
  // If user selected original emoji
  if (variant === "emoji") {
    const emojis: Record<string, string> = {
      kpsp: "🌱",
      denver: "📊",
      mchat: "🧩",
      header: "🧩",
    };
    return (
      <span style={{ fontSize: size * 0.85, lineHeight: 1 }} className={className}>
        {fallbackEmoji || emojis[id] || "📌"}
      </span>
    );
  }

  // --- 1. KPSP (Tumbuh Kembang & Pra-Skrining) ---
  if (id === "kpsp") {
    if (variant === "svg-v1") {
      // V1: Vibrant Sprout with Growth Measurement Scale
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="36" height="36" rx="10" fill="#ECFDF5" />
          <path d="M18 28V15" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 20C18 20 13 19 11 14C9 9 14 8 18 12C22 8 27 9 25 14C23 19 18 20 18 20Z" fill="#10B981" />
          <path d="M18 20C18 20 15 15 18 12C21 15 18 20 18 20Z" fill="#34D399" />
          {/* Soil Base */}
          <path d="M10 28C10 28 14 30 18 30C22 30 26 28 26 28" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" />
          {/* Growth indicator dots */}
          <circle cx="23" cy="11" r="1.5" fill="#F59E0B" />
          <circle cx="26" cy="16" r="1.2" fill="#3B82F6" />
        </svg>
      );
    }
    if (variant === "svg-v2") {
      // V2: Nurturing Heart Leaves & Stem
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="18" cy="18" r="18" fill="#D1FAE5" />
          <path d="M18 27V16" stroke="#047857" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18 17C15 12 10 13 11 18C12 21 18 25 18 25C18 25 24 21 25 18C26 13 21 12 18 17Z" fill="#059669" />
          <path d="M18 17C16.5 14.5 13.5 15 14 18C14.5 19.5 18 22 18 22C18 22 21.5 19.5 22 18C22.5 15 19.5 14.5 18 17Z" fill="#6EE7B7" />
        </svg>
      );
    }
    // V3: Clipboard Checklist with Young Sprout Badge
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="6" y="7" width="24" height="24" rx="5" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" />
        <rect x="13" y="5" width="10" height="4" rx="2" fill="#047857" />
        <path d="M11 14L14 17L21 10" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 23H17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 21C21 21 23 19 25 20C26 21.5 25 24 23 24C21 24 21 21 21 21Z" fill="#10B981" />
      </svg>
    );
  }

  // --- 2. DENVER II (4 Sektor Tumbuh Kembang) ---
  if (id === "denver") {
    if (variant === "svg-v1") {
      // V1: 4 Connected Development Sector Quadrants
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="36" height="36" rx="10" fill="#EFF6FF" />
          {/* Sector 1: Personal Social (Purple) */}
          <rect x="7" y="7" width="10" height="10" rx="3" fill="#8B5CF6" />
          {/* Sector 2: Fine Motor (Amber) */}
          <rect x="19" y="7" width="10" height="10" rx="3" fill="#F59E0B" />
          {/* Sector 3: Language (Teal) */}
          <rect x="7" y="19" width="10" height="10" rx="3" fill="#10B981" />
          {/* Sector 4: Gross Motor (Blue) */}
          <rect x="19" y="19" width="10" height="10" rx="3" fill="#3B82F6" />
          {/* Connecting Cross */}
          <circle cx="18" cy="18" r="3" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
          <path d="M18 16.5V19.5M16.5 18H19.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    }
    if (variant === "svg-v2") {
      // V2: Milestone Growth Chart with Assessment Bars
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="18" cy="18" r="18" fill="#DBEAFE" />
          <rect x="8" y="20" width="4" height="9" rx="1.5" fill="#3B82F6" />
          <rect x="14" y="15" width="4" height="14" rx="1.5" fill="#8B5CF6" />
          <rect x="20" y="11" width="4" height="18" rx="1.5" fill="#F59E0B" />
          <rect x="26" y="7" width="4" height="22" rx="1.5" fill="#10B981" />
          <path d="M8 18L14 13L20 9L28 5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      );
    }
    // V3: Medical Screening Shield with Developmental Stars
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18 4L29 8V17C29 23.5 24.2 29.5 18 31C11.8 29.5 7 23.5 7 17V8L18 4Z" fill="#3B82F6" fillOpacity="0.15" stroke="#2563EB" strokeWidth="2" />
        <path d="M18 10V24M11 17H25" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="18" cy="17" r="4" fill="#60A5FA" />
      </svg>
    );
  }

  // --- 3. M-CHAT-R (Skrining Autisme & Interlocking Puzzle) ---
  if (id === "mchat") {
    if (variant === "svg-v1") {
      // V1: Interlocking Puzzle Pieces Heart (Autism Spectrum Care)
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="36" height="36" rx="10" fill="#FDF2F8" />
          {/* Top Left Red Puzzle */}
          <path d="M9 10C9 8.89543 9.89543 8 11 8H16V13C16 14.1046 16.8954 15 18 15C19.1046 15 20 14.1046 20 13V8H25C26.1046 8 27 8.89543 27 10V15C25.8954 15 25 15.8954 25 17C25 18.1046 25.8954 19 27 19V24C27 25.1046 26.1046 26 25 26H20V23C20 21.8954 19.1046 21 18 21C16.8954 21 16 21.8954 16 23V26H11C9.89543 26 9 25.1046 9 24V19C10.1046 19 11 18.1046 11 17C11 15.8954 10.1046 15 9 15V10Z" fill="#EC4899" fillOpacity="0.25" stroke="#DB2777" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="18" cy="13" r="2" fill="#EC4899" />
          <circle cx="18" cy="21" r="2" fill="#3B82F6" />
          <circle cx="13" cy="17" r="2" fill="#F59E0B" />
          <circle cx="23" cy="17" r="2" fill="#10B981" />
        </svg>
      );
    }
    if (variant === "svg-v2") {
      // V2: Vibrant 4-Color Fitting Puzzle Matrix
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="18" cy="18" r="18" fill="#FCE7F3" />
          {/* Piece 1 */}
          <rect x="8" y="8" width="9" height="9" rx="2" fill="#EC4899" />
          {/* Piece 2 */}
          <rect x="19" y="8" width="9" height="9" rx="2" fill="#3B82F6" />
          {/* Piece 3 */}
          <rect x="8" y="19" width="9" height="9" rx="2" fill="#F59E0B" />
          {/* Piece 4 */}
          <rect x="19" y="19" width="9" height="9" rx="2" fill="#10B981" />
          <path d="M17 125C17 12 18 13 18 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="18" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    }
    // V3: Protective Badge with Central Puzzle Accent
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="6" y="6" width="24" height="24" rx="8" fill="#F43F5E" fillOpacity="0.15" stroke="#E11D48" strokeWidth="2" />
        <path d="M13 13H21C22.1 13 23 13.9 23 15V17C22 17 21 17.9 21 19C21 20.1 22 21 23 21V23C23 24.1 22.1 25 21 25H19C19 24 18.1 23 17 23C15.9 23 15 24 15 25H13C11.9 25 11 24.1 11 23V15C11 13.9 11.9 13 13 13Z" fill="#BE123C" />
      </svg>
    );
  }

  // --- 4. HEADER ICON ("Skrining Perkembangan" - Child Growth & Developmental Screening) ---
  if (variant === "svg-v1") {
    // V1: Child Growth Silhouette with Milestone Star & Sprout Leaf
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="36" height="36" rx="10" fill="#FDF2F8" />
        {/* Child Head */}
        <circle cx="18" cy="12" r="4.5" fill="#D936A6" />
        {/* Child Body & Open Caring Arms */}
        <path d="M11 26C11 21.5 14 19 18 19C22 19 25 21.5 25 26" stroke="#D936A6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Growth Measurement Arc / Height Chart Scale */}
        <path d="M7 29V9M7 13H10M7 18H9M7 23H10" stroke="#C026D3" strokeWidth="1.8" strokeLinecap="round" />
        {/* Milestone Star */}
        <path d="M26.5 7.5L27.5 9.5L29.5 10.5L27.5 11.5L26.5 13.5L25.5 11.5L23.5 10.5L25.5 9.5L26.5 7.5Z" fill="#F59E0B" />
        {/* Development Sprout */}
        <path d="M28 25C28 25 29 22 31 22C31 22 31.5 24.5 29.5 26C28.5 26.8 28 25 28 25Z" fill="#10B981" />
      </svg>
    );
  }

  if (variant === "svg-v2") {
    // V2: Pediatric Stethoscope Heart framing Child Growth Sprout
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="18" cy="18" r="18" fill="#FCE7F3" />
        {/* Stethoscope Loop */}
        <path d="M11 9V14C11 17.866 14.134 21 18 21C21.866 21 25 17.866 25 14V9" stroke="#D936A6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Stethoscope Earpieces */}
        <circle cx="11" cy="8" r="1.5" fill="#0A0B5F" />
        <circle cx="25" cy="8" r="1.5" fill="#0A0B5F" />
        {/* Stethoscope Sensor / Diaphragm */}
        <path d="M18 21V25" stroke="#D936A6" strokeWidth="2.5" />
        <circle cx="18" cy="27" r="3.5" fill="#FFFFFF" stroke="#0A0B5F" strokeWidth="2" />
        {/* Growing Sprout inside */}
        <path d="M18 18V13M18 13C16.5 11 14 12 15 14.5C16 16 18 16 18 16M18 13C19.5 11 22 12 21 14.5C20 16 18 16 18 16" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // V3: Developmental Screening Board with Assessment Checklist & Growth Curve
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="6" width="26" height="26" rx="6" fill="#D936A6" fillOpacity="0.12" stroke="#D936A6" strokeWidth="2" />
      <rect x="13" y="4" width="10" height="4" rx="2" fill="#0A0B5F" />
      <path d="M10 14H18M10 19H15M10 24H20" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
      {/* Assessment Checkmarks */}
      <path d="M22 13.5L24 15.5L27.5 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 18.5L24 20.5L27.5 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
