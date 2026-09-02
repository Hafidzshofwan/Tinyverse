/**
 * Ikon SVG layar "Kurva WHO & CDC" — disalin persis dari mesin v17
 * (public/growth-tool.html), diubah hanya dari string HTML menjadi JSX.
 *
 * WHY dipisah: di island seluruh ikon ini berupa template string yang
 * disuntikkan lewat innerHTML. Sebagai React, ikon menjadi komponen agar aman
 * (tanpa dangerouslySetInnerHTML) tanpa mengubah satu pun atribut gambarnya.
 */

const gayaInline = {
  display: "inline-block",
  verticalAlign: "middle",
  marginBottom: 6,
} as const;

const gayaKecil = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: 4,
} as const;

const gayaKecil6 = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: 6,
} as const;

export function IkonWho() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={gayaInline}>
      <circle cx="19" cy="19" r="16" fill="#2563EB" />
      <path
        d="M11 12C12.5 10.5 15 11 16.5 12.5C18 14 20 14.5 22 13.5C24 12.5 26 10.5 28 11.5C30 12.5 32 15 32.5 18C31 20 29 21.5 26 21C24 20.5 22 21.5 20.5 23.5C19 25.5 17 26.5 14 25.5C12 24.5 10 21.5 9.5 18.5C9 15.5 10 13 11 12Z"
        fill="#10B981"
      />
      <path d="M21.5 25.5C23.5 25.5 25.5 27 27 29.5C25 32 21 33.5 17 33C18.5 30.5 20 27.5 21.5 25.5Z" fill="#34D399" />
      <circle cx="19" cy="19" r="16" stroke="#93C5FD" strokeWidth="1.2" strokeOpacity="0.8" />
      <ellipse cx="19" cy="19" rx="16" ry="6.5" stroke="#E0F2FE" strokeWidth="1" strokeOpacity="0.7" />
      <ellipse cx="19" cy="19" rx="6.5" ry="16" stroke="#E0F2FE" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="3" y1="19" x2="35" y2="19" stroke="#E0F2FE" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="19" y1="3" x2="19" y2="35" stroke="#E0F2FE" strokeWidth="1" strokeOpacity="0.7" />
    </svg>
  );
}

export function IkonCdc() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={gayaInline}>
      <rect x="3" y="7" width="32" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
      <mask id="us_flag_mask_clean" maskUnits="userSpaceOnUse" x="3" y="7" width="32" height="24">
        <rect x="3" y="7" width="32" height="24" rx="4" fill="#FFFFFF" />
      </mask>
      <g mask="url(#us_flag_mask_clean)">
        <rect x="3" y="7" width="32" height="24" fill="#B91C1C" />
        <rect x="3" y="9.6" width="32" height="2.6" fill="#FFFFFF" />
        <rect x="3" y="14.8" width="32" height="2.6" fill="#FFFFFF" />
        <rect x="3" y="20.0" width="32" height="2.6" fill="#FFFFFF" />
        <rect x="3" y="25.2" width="32" height="2.6" fill="#FFFFFF" />
        <rect x="3" y="7" width="15" height="13" fill="#1E3A8A" />
        <circle cx="6.5" cy="9.8" r="1" fill="#FFFFFF" />
        <circle cx="10.5" cy="9.8" r="1" fill="#FFFFFF" />
        <circle cx="14.5" cy="9.8" r="1" fill="#FFFFFF" />
        <circle cx="8.5" cy="12.5" r="1" fill="#FFFFFF" />
        <circle cx="12.5" cy="12.5" r="1" fill="#FFFFFF" />
        <circle cx="6.5" cy="15.2" r="1" fill="#FFFFFF" />
        <circle cx="10.5" cy="15.2" r="1" fill="#FFFFFF" />
        <circle cx="14.5" cy="15.2" r="1" fill="#FFFFFF" />
        <circle cx="8.5" cy="17.8" r="1" fill="#FFFFFF" />
        <circle cx="12.5" cy="17.8" r="1" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function IkonMale() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={gayaInline}>
      <circle cx="12" cy="12" r="10" fill="#E0E7FF" />
      <path d="M7 11C7 7.5 9 6 12 6C15 6 17 7.5 17 11C17 11 15 9.5 12 9.5C9 9.5 7 11 7 11Z" fill="#1D4ED8" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#2563EB" />
    </svg>
  );
}

export function IkonFemale() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={gayaInline}>
      <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
      <path d="M6 13C5.5 9 8 6 12 6C16 6 18.5 9 18 13C17 10 15 9 12 9C9 9 7 10 6 13Z" fill="#BE185D" />
      <circle cx="6.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="17.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#DB2777" />
    </svg>
  );
}

export function IkonChart() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil}
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export function IkonCalendar() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function IkonScale() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E63946"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil}
    >
      <path d="M12 3v18M3 7l4 8M17 7l4 8M5 15h4M15 15h4M2 21h20" />
    </svg>
  );
}

export function IkonRuler() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1565C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil}
    >
      <path d="M21 3H3v18h18V3zM7 3v4M11 3v2M15 3v4M19 3v2" />
    </svg>
  );
}

export function IkonBmi() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7B1FA2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
    </svg>
  );
}

export function IkonBook() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil6}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function IkonPin() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil6}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IkonWarning() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={gayaKecil6}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/** Ikon judul section (header "Tumbuh Kembang") — salinan persis dari island. */
export function IkonJudulTumbuhKembang() {
  return (
    <svg width="38" height="38" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#EFF6FF" />
      <path d="M7 11H29M7 18H29M7 25H29M14 7V29M22 7V29" stroke="#DBEAFE" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M7 29H29M7 7V29" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 22C11 19 16 13 29 9" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 25C12 23 18 17 29 13" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 28C13 26 19 21 29 18" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="22" r="2" fill="#0A0B5F" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="19" cy="16" r="2" fill="#0A0B5F" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="26" cy="11.5" r="2" fill="#0A0B5F" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
}

/**
 * Ikon lingkar kepala: siluet kepala anak dengan garis ukur melingkar.
 * Warna mengikuti warna seri "lk" di chartConfig (#0277BD).
 */
export function IkonLingkarKepala() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0277BD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4,
      }}
    >
      {/* Kepala */}
      <path d="M12 3a7 7 0 0 1 7 7c0 3.2-1.6 5.8-4 6.8V19H9v-2.2C6.6 15.8 5 13.2 5 10a7 7 0 0 1 7-7z" />
      {/* Garis ukur melingkar (dashed) */}
      <path d="M5.3 8A7.3 7.3 0 0 1 18.7 8" strokeDasharray="2 1.5" />
      {/* Leher / alas */}
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}
