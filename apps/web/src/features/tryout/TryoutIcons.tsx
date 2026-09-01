"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 1. Kartu Paket Ujian — Pediatric CBT Examination Monitor & Case Illustration
 */
export const TryoutExamCardIcon: React.FC<IconProps> = ({
  size = 36,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="tv-exam-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDF2F8" />
        <stop offset="1" stopColor="#FCE7F3" />
      </linearGradient>
      <linearGradient id="tv-screen-grad" x1="6" y1="6" x2="34" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F8FAFC" />
      </linearGradient>
    </defs>
    {/* Soft rounded backdrop */}
    <rect width="40" height="40" rx="12" fill="url(#tv-exam-bg)" />
    
    {/* Monitor Screen Frame */}
    <rect
      x="6"
      y="7"
      width="28"
      height="21"
      rx="4"
      fill="url(#tv-screen-grad)"
      stroke="#D936A6"
      strokeWidth="1.8"
    />
    
    {/* Monitor Top Status Bar */}
    <path d="M6 12H34" stroke="#F472B6" strokeWidth="1.2" />
    <circle cx="10" cy="9.5" r="1.2" fill="#D936A6" />
    <circle cx="14" cy="9.5" r="1.2" fill="#F472B6" />
    <circle cx="18" cy="9.5" r="1.2" fill="#FBCFE8" />
    
    {/* Monitor Screen Content: Medical Pulse & Checkmark */}
    <path
      d="M10 20H13L15 15.5L17.5 22.5L20 18.5L22 20H24"
      stroke="#0A0B5F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Correct Checkmark badge in corner of screen */}
    <circle cx="28" cy="19" r="3.5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
    <path d="M26.5 19L27.5 20L29.5 18" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Monitor Stand & Base */}
    <path d="M17 28V31.5H23V28" stroke="#D936A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 32H27" stroke="#D936A6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 2. Tombol Mulai Try Out CBT (Play & CBT Terminal)
 */
export const TryoutPlayCbtIcon: React.FC<IconProps> = ({
  size = 18,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    style={style}
  >
    <rect x="2" y="3" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 17H13M10 15V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path
      d="M8.5 6.8L12.8 9.3C13.2 9.6 13.2 10.4 12.8 10.7L8.5 13.2C8 13.5 7.5 13.1 7.5 12.5V7.5C7.5 6.9 8 6.5 8.5 6.8Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * 3. Tombol Mode Latihan Mandiri (Buku Studi & Pena)
 */
export const TryoutStudyModeIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    style={style}
  >
    <path
      d="M3.5 5.5C3.5 4.4 4.4 3.5 5.5 3.5H9C9.6 3.5 10 3.9 10 4.5V16C10 15.4 9.6 15 9 15H5.5C4.4 15 3.5 15.9 3.5 17V5.5Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 5.5C16.5 4.4 15.6 3.5 14.5 3.5H11C10.4 3.5 10 3.9 10 4.5V16C10 15.4 10.4 15 11 15H14.5C15.6 15 16.5 15.9 16.5 17V5.5Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M6 7H7.5M6 10H7.5M12.5 7H14M12.5 10H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Meta: Soal Kasus (Medical Case Document) — replaces 📝
 */
export const TryoutDocumentIcon: React.FC<IconProps> = ({
  size = 15,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <rect x="2.5" y="2" width="11" height="12" rx="2.5" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.3" />
    <path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8.5" stroke="#4338CA" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11" cy="11" r="1" fill="#4F46E5" />
  </svg>
);

/**
 * 5. Meta: Durasi Waktu / Stopwatch — replaces ⏱
 */
export const TryoutTimerIcon: React.FC<IconProps> = ({
  size = 15,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <circle cx="8" cy="9" r="5.5" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.3" />
    <path d="M8 2.2V4M6.5 2.2H9.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M8 9L8 6.5M8 9L10 9" stroke="#B45309" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M12.2 4.8L13.2 3.8" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 6. Meta: Passing Grade / Target Score Bullseye — replaces 🎯
 */
export const TryoutTargetIcon: React.FC<IconProps> = ({
  size = 15,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="6.2" fill="#FDF2F8" stroke="#D936A6" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="4" fill="#FCE7F3" stroke="#BE185D" strokeWidth="1.1" />
    <circle cx="8" cy="8" r="1.8" fill="#9D174D" />
  </svg>
);

/**
 * 7. Tandai Ragu-ragu (Flag on Pole) — replaces ⚠️
 */
export const TryoutFlagIcon: React.FC<IconProps> = ({
  size = 15,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <path d="M3.5 2.5V14" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <path
      d="M3.5 3.5C6 2.5 8 4.5 10.5 3.5C11.5 3.1 12.5 3.5 12.5 4.5V9C12.5 10 11.5 9.6 10.5 10C8 11 6 9 3.5 10"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 8. Status Benar (Circular Checkmark) — replaces ✓
 */
export const TryoutCheckIcon: React.FC<IconProps> = ({
  size = 14,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="7" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
    <path d="M5 8.2L7 10.2L11 6" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 9. Status Salah (Circular Cross) — replaces ✕
 */
export const TryoutCrossIcon: React.FC<IconProps> = ({
  size = 14,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="7" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.2" />
    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#B91C1C" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * 10. Status Kosong / Unanswered — replaces ○
 */
export const TryoutMinusIcon: React.FC<IconProps> = ({
  size = 14,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="7" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />
    <path d="M5.5 8H10.5" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * 11. Breakdown Subdivisi Pediatri (Pediatric Specialty Analytics & Bars)
 */
export const TryoutAnalyticsIcon: React.FC<IconProps> = ({
  size = 22,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
  >
    <rect width="24" height="24" rx="6" fill="#F0FDF4" />
    {/* Analytics Bars */}
    <rect x="4.5" y="13" width="3" height="7" rx="1" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.2" />
    <rect x="9.5" y="9" width="3" height="11" rx="1" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.2" />
    <rect x="14.5" y="6" width="3" height="14" rx="1" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
    {/* Trend Line with Pediatric Dot */}
    <path d="M5.5 11L10.5 7L15.5 4.5L19.5 6" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="19.5" cy="6" r="1.5" fill="#047857" />
  </svg>
);

/**
 * 12. Kunci Jawaban & Pembahasan (Medical Clinical Discussion & Lightbulb)
 */
export const TryoutReviewDiscussionIcon: React.FC<IconProps> = ({
  size = 22,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
  >
    <rect width="24" height="24" rx="6" fill="#EEF2FF" />
    {/* Clipboard Base */}
    <rect x="5" y="4" width="14" height="16" rx="2.5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.4" />
    <path d="M8.5 3H15.5V5H8.5V3Z" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Medical Diagnostic Cross & Discussion Line */}
    <path d="M12 8.5V12.5M10 10.5H14" stroke="#4338CA" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8 15.5H16M8 17.5H13" stroke="#818CF8" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 13. Navigasi Nomor Soal / Lembar Kerja (Grid Sheet)
 */
export const TryoutGridSheetIcon: React.FC<IconProps> = ({
  size = 18,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    style={style}
  >
    <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
    {/* 4 Quadrant / Grid Dots */}
    <circle cx="7" cy="7" r="1.2" fill="currentColor" />
    <circle cx="13" cy="7" r="1.2" fill="currentColor" />
    <circle cx="7" cy="13" r="1.2" fill="currentColor" />
    <circle cx="13" cy="13" r="1.2" fill="currentColor" />
    <path d="M3 10H17M10 3V17" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.5" />
  </svg>
);

/**
 * 14. Tombol Keluar Ujian (Clean Exit / Log out)
 */
export const TryoutExitIcon: React.FC<IconProps> = ({
  size = 14,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <path d="M6 2.5H3.5C2.95 2.5 2.5 2.95 2.5 3.5V12.5C2.5 13.05 2.95 13.5 3.5 13.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M10 5L13.5 8L10 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * 15. Alert / Perhatian Modal Warning
 */
export const TryoutWarningAlertIcon: React.FC<IconProps> = ({
  size = 16,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <path
      d="M7.13 2.5C7.52 1.83 8.48 1.83 8.87 2.5L14.28 11.87C14.67 12.54 14.19 13.38 13.41 13.38H2.59C1.81 13.38 1.33 12.54 1.72 11.87L7.13 2.5Z"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M8 6V9M8 11.2H8.01" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 16. Trofi Riwayat Skor Tertinggi
 */
export const TryoutTrophyScoreIcon: React.FC<IconProps> = ({
  size = 14,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={style}
  >
    <path
      d="M4.5 3H11.5V6.5C11.5 8.4 9.9 10 8 10C6.1 10 4.5 8.4 4.5 6.5V3Z"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M4.5 4.5H2.5C2 4.5 1.5 5 1.5 5.5C1.5 6.6 2.4 7.5 3.5 7.5H4.5" stroke="#D97706" strokeWidth="1.1" />
    <path d="M11.5 4.5H13.5C14 4.5 14.5 5 14.5 5.5C14.5 6.6 13.6 7.5 12.5 7.5H11.5" stroke="#D97706" strokeWidth="1.1" />
    <path d="M8 10V12.5M5.5 13.5H10.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="6" r="1" fill="#D97706" />
  </svg>
);
