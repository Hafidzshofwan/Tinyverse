"use client";

import React, { useEffect, useState } from "react";
import { ScreeningIcon } from "./ScreeningIcon";

export type SidebarIconSlug =
  | "beranda"
  | "ai-assistant"
  | "darurat"
  | "alur"
  | "dosis"
  | "cairan"
  | "puyer"
  | "obat"
  | "tekanan-darah"
  | "egfr"
  | "neonatus"
  | "tumbuh-kembang"
  | "skoring"
  | "lab"
  | "protokol"
  | "imunisasi"
  | "ringkasan"
  | "pembelajaran";

export type SidebarIconVariant = "v1" | "v2" | "v3";

export type IconVariantMap = Record<SidebarIconSlug, SidebarIconVariant>;

const STORAGE_KEY = "tv-sidebar-icon-variants";
const NAME_STORAGE_KEY = "tv-pembelajaran-menu-title";

export type PembelajaranNameKey = "akademi-klinis" | "kasus-kuis" | "ruang-belajar";

export interface PembelajaranNameOption {
  key: PembelajaranNameKey;
  label: string;
  badge: string;
  tagline: string;
  description: string;
  recommendation: string;
}

export const PEMBELAJARAN_NAME_OPTIONS: ReadonlyArray<PembelajaranNameOption> = [
  {
    key: "ruang-belajar",
    label: "Ruang Belajar",
    badge: "Opsi 1 · Edukatif",
    tagline: "Pusat Studi Kasus & Kuis Interaktif",
    description: "Nuansa hangat, bersahabat, dan memotivasi belajar mandiri dengan penjelasan dokter senior di setiap langkah.",
    recommendation: "Pilihan ramah dan interaktif untuk mendampingi stase anak.",
  },
  {
    key: "akademi-klinis",
    label: "Akademi Klinis",
    badge: "Opsi 2 · Prestisius",
    tagline: "Pusat Pendalaman & Kurikulum Pediatri",
    description: "Nuansa profesional, berwibawa, dan sangat cocok untuk dokter muda, residen, maupun dokter spesialis.",
    recommendation: "Pilihan utama bernuansa akademisi dan pelatihan klinis berstandar tinggi.",
  },
  {
    key: "kasus-kuis",
    label: "Kasus & Kuis Klinis",
    badge: "Opsi 3 · Interaktif",
    tagline: "Uji MCQ & Simulasi Kasus Step-by-Step",
    description: "Langsung menggambarkan dua modul inti di dalamnya: Uji Pemahaman MCQ dan Pembelajaran Berbasis Kasus nyata.",
    recommendation: "Pilihan paling to-the-point, jelas, dan memikat rasa ingin tahu.",
  },
];

const DEFAULT_NAME_KEY: PembelajaranNameKey = "ruang-belajar";

export function getSavedPembelajaranNameKey(): PembelajaranNameKey {
  if (typeof window === "undefined") return DEFAULT_NAME_KEY;
  try {
    const val = window.localStorage.getItem(NAME_STORAGE_KEY) as PembelajaranNameKey | null;
    if (val && val === "ruang-belajar") {
      return val;
    }
    // Default to ruang-belajar
    window.localStorage.setItem(NAME_STORAGE_KEY, "ruang-belajar");
    return DEFAULT_NAME_KEY;
  } catch {
    return DEFAULT_NAME_KEY;
  }
}

export function setSavedPembelajaranNameKey(key: PembelajaranNameKey) {
  try {
    window.localStorage.setItem(NAME_STORAGE_KEY, key);
  } catch (error) {
    console.error(error);
  }
  LISTENERS.forEach((cb) => cb());
}

const FALLBACK_PEMBELAJARAN_OPTION: PembelajaranNameOption = {
  key: "ruang-belajar",
  label: "Ruang Belajar",
  badge: "Opsi 1 · Edukatif",
  tagline: "Pusat Studi Kasus & Kuis Interaktif",
  description: "Nuansa hangat, bersahabat, dan memotivasi belajar mandiri dengan penjelasan dokter senior di setiap langkah.",
  recommendation: "Pilihan ramah dan interaktif untuk mendampingi stase anak.",
};

export function usePembelajaranMenuTitle() {
  const [key, setKey] = useState<PembelajaranNameKey>(getSavedPembelajaranNameKey);

  useEffect(() => {
    const update = () => setKey(getSavedPembelajaranNameKey());
    LISTENERS.add(update);
    return () => {
      LISTENERS.delete(update);
    };
  }, []);

  const currentOption: PembelajaranNameOption =
    PEMBELAJARAN_NAME_OPTIONS.find((o) => o.key === key) ?? FALLBACK_PEMBELAJARAN_OPTION;

  return {
    key,
    currentOption,
    label: currentOption.label,
    setKey: setSavedPembelajaranNameKey,
  };
}

const DEFAULT_VARIANTS: IconVariantMap = {
  "beranda": "v3",
  "ai-assistant": "v2",
  "darurat": "v3",
  "alur": "v2",
  "dosis": "v1",
  "cairan": "v1",
  "puyer": "v1",
  "obat": "v1",
  "tekanan-darah": "v1",
  "egfr": "v1",
  "neonatus": "v1",
  "tumbuh-kembang": "v1", // Always fixed as ScreeningIcon
  "skoring": "v1",
  "lab": "v1",
  "protokol": "v1",
  "imunisasi": "v2",
  "ringkasan": "v3",
  "pembelajaran": "v1",
};

// Global event listener system for real-time synchronization
const LISTENERS = new Set<() => void>();

function getSavedVariants(): IconVariantMap {
  if (typeof window === "undefined") return DEFAULT_VARIANTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VARIANTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_VARIANTS, ...parsed };
  } catch {
    return DEFAULT_VARIANTS;
  }
}

export function setIconVariant(slug: SidebarIconSlug, variant: SidebarIconVariant) {
  if (slug === "tumbuh-kembang") return; // Fixed
  const current = getSavedVariants();
  const next = { ...current, [slug]: variant };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error(error);
}
  LISTENERS.forEach((cb) => cb());
}

export function resetAllIconVariants() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
}
  LISTENERS.forEach((cb) => cb());
}

export function useSidebarIconVariants() {
  const [variants, setVariants] = useState<IconVariantMap>(getSavedVariants);

  useEffect(() => {
    const update = () => setVariants(getSavedVariants());
    LISTENERS.add(update);
    return () => {
      LISTENERS.delete(update);
    };
  }, []);

  return {
    variants,
    setVariant: setIconVariant,
    resetVariants: resetAllIconVariants,
  };
}

interface SidebarIconProps {
  slug: string;
  variant?: SidebarIconVariant;
  size?: number;
  className?: string;
  hideBackground?: boolean;
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({
  slug,
  variant: overrideVariant,
  size = 20,
  className = "",
  hideBackground = false,
}) => {
  const { variants } = useSidebarIconVariants();
  const currentVariant = overrideVariant || variants[slug as SidebarIconSlug] || "v1";

  // --- TUMBUH KEMBANG: FIXED SVG (No replacement option allowed) ---
  if (slug === "tumbuh-kembang") {
    return <ScreeningIcon id="single" size={size} className={className} />;
  }

  // --- 1. BERANDA ---
  if (slug === "beranda") {
    if (currentVariant === "v2") {
      // V2: Pusat Kendali Klinis & Gelombang EKG (Clinical Command Center)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#ECFDF5" />
          <path d="M3 10.5L12 3L21 10.5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V10.5Z" stroke="#059669" strokeWidth="1.8" strokeLinejoin="round" fill="#D1FAE5" fillOpacity="0.5" />
          <path d="M5.5 13.5H8.5L10 10.5L12 16.5L14 12.5L15.5 13.5H18.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="1.8" fill="#047857" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Atap Stetoskop & Perlindungan Anak (Stethoscope Roof & Heart Nest)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FDF2F8" />
          <path d="M4 11L12 4L20 11V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V11Z" fill="#FCE7F3" stroke="#D936A6" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 9C10.5 9 9 10.2 9 11.8C9 13.8 12 16.5 12 16.5C12 16.5 15 13.8 15 11.8C15 10.2 13.5 9 12 9Z" fill="#E11D48" fillOpacity="0.25" stroke="#E11D48" strokeWidth="1.5" />
          <circle cx="12" cy="11.8" r="1.2" fill="#BE123C" />
          <path d="M9 20V17C9 16.4 9.4 16 10 16H14C14.6 16 15 16.4 15 17V20" stroke="#881337" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    // V1: Klinik Pediatri Modern (Pediatric Care Haven - Default)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#EFF6FF" />
        <path d="M3.5 11L12 3.5L20.5 11V19.5C20.5 20.0523 20.0523 20.5 19.5 20.5H4.5C3.94772 20.5 3.5 20.0523 3.5 19.5V11Z" fill="#DBEAFE" fillOpacity="0.6" stroke="#2563EB" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 8.5V13.5M9.5 11H14.5" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 20.5V16.5C9 15.6716 9.67157 15 10.5 15H13.5C14.3284 15 15 15.6716 15 16.5V20.5" stroke="#1D4ED8" strokeWidth="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // --- 2. ASISTEN AI ---
  if (slug === "ai-assistant") {
    if (currentVariant === "v2") {
      // V2: AI Sparkle Star & Stethoscope Halo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          {!hideBackground && <rect width="24" height="24" rx="6" fill="#FDF2F8" />}
          <path d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z" fill={hideBackground ? "#FFFFFF" : "#D936A6"} />
          <path d="M18 15L19 17.5L21.5 18.5L19 19.5L18 22L17 19.5L14.5 18.5L17 17.5L18 15Z" fill={hideBackground ? "#FCE7F3" : "#8B5CF6"} />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Dual Chat Assistant Bubble
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          {!hideBackground && <rect width="24" height="24" rx="6" fill="#F0FDF4" />}
          <path d="M18 14C18 17.3137 15.3137 20 12 20C10.7 20 9.5 19.6 8.5 18.9L4 20L5.3 16.2C4.5 15.1 4 13.6 4 12C4 8.68629 6.68629 6 10 6" stroke={hideBackground ? "#FFFFFF" : "#10B981"} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M14 4C17.3137 4 20 6.68629 20 10C20 11.6 19.4 13.1 18.4 14.2L19.5 17.5L16.2 16.4C15.2 17 14.1 17.3 13 17.3" stroke={hideBackground ? "#FCE7F3" : "#059669"} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="11" r="1" fill={hideBackground ? "#FFFFFF" : "#047857"} />
          <circle cx="14" cy="11" r="1" fill={hideBackground ? "#FFFFFF" : "#047857"} />
        </svg>
      );
    }
    // V1: Pediatric AI Bot Head
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {!hideBackground && <rect width="24" height="24" rx="6" fill="#EFF6FF" />}
        <rect x="5" y="8" width="14" height="11" rx="3.5" stroke={hideBackground ? "#FFFFFF" : "#2563EB"} strokeWidth="1.8" fill={hideBackground ? "rgba(255, 255, 255, 0.25)" : "#DBEAFE"} fillOpacity={hideBackground ? "1" : "0.5"} />
        <path d="M12 4V8M12 4C11 4 10.5 2.5 12 2.5C13.5 2.5 13 4 12 4Z" stroke={hideBackground ? "#FFFFFF" : "#2563EB"} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12.5" r="1.5" fill={hideBackground ? "#FFFFFF" : "#0A0B5F"} />
        <circle cx="15" cy="12.5" r="1.5" fill={hideBackground ? "#FFFFFF" : "#0A0B5F"} />
        <path d="M10 15.5C10.5 16.2 11.2 16.5 12 16.5C12.8 16.5 13.5 16.2 14 15.5" stroke={hideBackground ? "#FFFFFF" : "#2563EB"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // --- 3. MODE DARURAT ---
  if (slug === "darurat") {
    if (currentVariant === "v2") {
      // V2: Resuscitation Heart Pulse & Emergency Cross
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FFF1F2" />
          <path d="M3 12H7L9 6L13 18L15 10L17 12H21" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 4V8M16 6H20" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Fast Action Alert Bell & Lightning
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FEF2F2" />
          <path d="M12 3C8.5 3 6 5.5 6 9V14L4 16H20L18 14V9C18 5.5 15.5 3 12 3Z" fill="#FCA5A5" fillOpacity="0.4" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19" stroke="#991B1B" strokeWidth="1.8" />
          <path d="M13 7L10 12H13L11 16" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    // V1: Emergency Siren Beacon Light
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FEF2F2" />
        <path d="M6 18H18V19H6V18Z" fill="#991B1B" />
        <path d="M7 17C7 12 9 7 12 7C15 7 17 12 17 17H7Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
        <path d="M12 2V4M4 8L5.5 9.5M20 8L18.5 9.5M2 14H4M20 14H22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // --- 4. ALUR TATA LAKSANA ---
  if (slug === "alur") {
    if (currentVariant === "v2") {
      // V2: Branching Algorithm Flowchart Diagram
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EEF2FF" />
          <rect x="8" y="3" width="8" height="5" rx="1.5" fill="#818CF8" stroke="#4F46E5" strokeWidth="1.5" />
          <path d="M12 8V12M12 12H6V15M12 12H18V15" stroke="#4338CA" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="3" y="15" width="6" height="5" rx="1" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="1.5" />
          <rect x="15" y="15" width="6" height="5" rx="1" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="1.5" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Waypoint Route Pin & Line
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#ECFDF5" />
          <circle cx="6" cy="18" r="2.5" stroke="#059669" strokeWidth="1.8" />
          <path d="M8.5 18H13.5C16 18 18 16 18 13.5C18 11 16 9 13.5 9H9" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 6C12 4.3 13.3 3 15 3C16.7 3 18 4.3 18 6C18 8 15 11 15 11C15 11 12 8 12 6Z" fill="#047857" stroke="#065F46" strokeWidth="1" />
        </svg>
      );
    }
    // V1: Interactive Compass & Decision Ring
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F0F9FF" />
        <circle cx="12" cy="12" r="8.5" stroke="#0284C7" strokeWidth="1.8" />
        <path d="M12 6.5V8.5M12 15.5V17.5M6.5 12H8.5M15.5 12H17.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.5 9.5L10.5 11L9.5 14.5L13.5 13L14.5 9.5Z" fill="#0A0B5F" stroke="#0284C7" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    );
  }

  // --- 5. DOSIS OBAT ---
  if (slug === "dosis") {
    if (currentVariant === "v2") {
      // V2: Pediatric Syringe Dropper & Spoon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EFF6FF" />
          <path d="M16 3L19 6M17.5 4.5L11 11M14 8L7 15" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 19C5 20.6667 6.33333 22 8 22C9.66667 22 11 20.6667 11 19C11 17.3333 8 14 8 14C8 14 5 17.3333 5 19Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.5" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Rx Pharmaceutical Capsule & Balance Scale Line
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FEF3C7" />
          <path d="M7 17L17 7" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="5" y="11" width="10" height="6" rx="3" transform="rotate(-45 5 11)" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <path d="M6 6H9M7.5 6V9" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    // V1: Dual Capsule & Tablet
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FFF7ED" />
        <rect x="5" y="8" width="13" height="7" rx="3.5" transform="rotate(-30 5 8)" fill="#FB923C" stroke="#EA580C" strokeWidth="1.5" />
        <line x1="8.5" y1="5" x2="15" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="16.5" cy="16.5" r="4" fill="#FED7AA" stroke="#C2410C" strokeWidth="1.5" />
        <line x1="14.5" y1="16.5" x2="18.5" y2="16.5" stroke="#C2410C" strokeWidth="1.2" />
      </svg>
    );
  }

  // --- 6. TERAPI CAIRAN ---
  if (slug === "cairan") {
    if (currentVariant === "v2") {
      // V2: Pure Water Droplet Heart Wave
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F0F9FF" />
          <path d="M12 3C12 3 5 11 5 15.5C5 19.1 7.9 22 11.5 22C15.1 22 18 19.1 18 15.5C18 11 12 3 12 3Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.8" />
          <path d="M7 16C7 16 9 18 12 18C15 18 16 16 16 16" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Hydration Cylinder Flask Tetes
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#E0F2FE" />
          <rect x="8" y="4" width="8" height="15" rx="2" stroke="#0284C7" strokeWidth="1.8" fill="#BAE6FD" fillOpacity="0.4" />
          <path d="M8 11H12M8 14H11M8 17H13" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 21C12 21.6 11.6 22 11 22C10.4 22 10 21.6 10 21C10 20.4 12 19 12 19C12 19 12 20.4 12 21Z" fill="#0284C7" />
        </svg>
      );
    }
    // V1: IV Infusion Bag & Droplet
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#E0F2FE" />
        <rect x="7" y="5" width="10" height="12" rx="2" fill="#7DD3FC" fillOpacity="0.5" stroke="#0284C7" strokeWidth="1.8" />
        <path d="M10 3H14V5H10V3Z" fill="#0369A1" />
        <path d="M12 17V20M12 22C12.6 22 13 21.6 13 21C13 20.4 12 19.5 12 19.5C12 19.5 11 20.4 11 21C11 21.6 11.4 22 12 22Z" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" fill="#0284C7" />
        <line x1="9" y1="9" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // --- 7. RACIK PUYER ---
  if (slug === "puyer") {
    if (currentVariant === "v2") {
      // V2: Pharmacy Compound Flask & Spoon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EDE9FE" />
          <path d="M9 3H15M10 3V8L5 17C4.2 18.4 5.2 20 6.8 20H17.2C18.8 20 19.8 18.4 19 17L14 8V3" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 14H16.5" stroke="#8B5CF6" strokeWidth="1.5" />
          <circle cx="10" cy="17" r="1" fill="#6D28D9" />
          <circle cx="14" cy="17" r="1" fill="#6D28D9" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Folded Paper Sachet & Grinded Powder
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FAF5FF" />
          <path d="M6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4Z" fill="#DDD6FE" stroke="#9333EA" strokeWidth="1.8" />
          <path d="M4 10H20M12 10V20" stroke="#7E22CE" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="8" cy="15" r="1.5" fill="#A855F7" />
          <circle cx="16" cy="15" r="1.5" fill="#A855F7" />
        </svg>
      );
    }
    // V1: Mortar, Pestle & Powder Sachet
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F5F3FF" />
        <path d="M5 11C5 11 4 17 12 17C20 17 19 11 19 11H5Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15 4L11 12" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="4" y="19" width="16" height="2" rx="1" fill="#7C3AED" />
      </svg>
    );
  }

  // --- 9. SKORING KLINIS ---
  if (slug === "skoring") {
    if (currentVariant === "v2") {
      // V2: Score Gauge Meter Pointer
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FEF3C7" />
          <path d="M4 17C4 12.6 7.6 9 12 9C16.4 9 20 12.6 20 17" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 17L16 11" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="2" fill="#78350F" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Multi-Criteria Assessment Stars
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FFFBEB" />
          <rect x="5" y="4" width="14" height="16" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.8" />
          <path d="M8 8H16M8 12H13M8 16H11" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16 14L17 16L19 16.2L17.5 17.5L18 19.5L16 18.3L14 19.5L14.5 17.5L13 16.2L15 16L16 14Z" fill="#F59E0B" />
        </svg>
      );
    }
    // V1: Pediatric Clinical Score Clipboard
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {!hideBackground && <rect width="24" height="24" rx="6" fill="#FDF2F8" />}
        <rect x="5.5" y="5" width="13" height="15.5" rx="3" fill="#FFF1F2" fillOpacity="0.8" stroke="#D936A6" strokeWidth="1.6" />
        <rect x="9.5" y="3.5" width="5" height="2.5" rx="1" fill="#0A0B5F" />
        <path d="M8.5 9.5H12.5M8.5 12.5H11.5M8.5 15.5H12.5" stroke="#0A0B5F" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="15.2" cy="9.5" r="1" fill="#D936A6" />
        <circle cx="15.2" cy="12.5" r="1" fill="#10B981" />
        <circle cx="15.2" cy="15.5" r="1" fill="#F59E0B" />
      </svg>
    );
  }

  // --- 10. INTERPRETASI LAB ---
  if (slug === "lab") {
    if (currentVariant === "v2") {
      // V2: Dual Blood Test Tubes AGD
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#CCFBF1" />
          <path d="M7 4H11V16C11 17.1 10.1 18 9 18C7.9 18 7 17.1 7 16V4Z" stroke="#0F766E" strokeWidth="1.8" fill="#5EEAD4" fillOpacity="0.4" />
          <path d="M13 4H17V16C17 17.1 16.1 18 15 18C13.9 18 13 17.1 13 16V4Z" stroke="#0F766E" strokeWidth="1.8" fill="#0D9488" fillOpacity="0.6" />
          <path d="M6 4H12M12 4H18" stroke="#115E59" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Blood Specimen Slide & Droplet
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F0FDFA" />
          <rect x="4" y="9" width="16" height="6" rx="1.5" fill="#99F6E4" stroke="#0D9488" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="2" fill="#E11D48" />
          <path d="M12 4V7" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    // V1: Clinical Microscope
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F0FDFA" />
        <path d="M12 3V8M10 8H14M12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16V20" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 20H16" stroke="#115E59" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="14" r="1.5" fill="#14B8A6" />
      </svg>
    );
  }

  // --- 12. GUIDELINE / PROTOKOL ---
  if (slug === "protokol") {
    if (currentVariant === "v2") {
      // V2: Medical Protocol Shield & Bookmark
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FAF5FF" />
          <path d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z" fill="#E9D5FF" stroke="#A855F7" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 8H14M12 8V14M10 12H14" stroke="#6B21A8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Clinical Pocket Reference Book
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F3E8FF" />
          <rect x="5" y="4" width="14" height="16" rx="2" fill="#D8B4FE" stroke="#7E22CE" strokeWidth="1.8" />
          <path d="M19 7H21V10H19M19 12H21V15H19" stroke="#6B21A8" strokeWidth="1.5" />
          <path d="M8 8H14M8 12H12" stroke="#581C87" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    // V1: Stethoscope & Guideline Book
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F3E8FF" />
        <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20V4H6.5C5.1 4 4 5.1 4 6.5V19.5Z" fill="#E9D5FF" stroke="#9333EA" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 19.5C4 20.9 5.1 22 6.5 22H20" stroke="#9333EA" strokeWidth="1.8" />
        <path d="M9 8H15M9 12H13" stroke="#6B21A8" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // --- 13. JADWAL IMUNISASI ---
  if (slug === "imunisasi") {
    if (currentVariant === "v2") {
      // V2: Vaccine Calendar Grid & Vial Bottle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#E0E7FF" />
          <rect x="4" y="5" width="16" height="15" rx="2" stroke="#3730A3" strokeWidth="1.8" fill="#C7D2FE" fillOpacity="0.4" />
          <path d="M4 9H20M8 3V6M16 3V6" stroke="#3730A3" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="8" cy="13" r="1.5" fill="#4338CA" />
          <circle cx="12" cy="13" r="1.5" fill="#4338CA" />
          <circle cx="16" cy="13" r="1.5" fill="#10B981" />
          <path d="M14.5 17L15.5 18L18 15.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Heart Protection Vaccine Badge
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EEF2FF" />
          <path d="M12 21C12 21 4 15 4 9C4 6.2 6.2 4 9 4C10.7 4 12 5 12 5C12 5 13.3 4 15 4C17.8 4 20 6.2 20 9C20 15 12 21 12 21Z" fill="#C7D2FE" stroke="#4338CA" strokeWidth="1.8" />
          <path d="M15 8L9 14M11.5 8L8.5 11M15.5 12L12.5 15" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    // V1: Vaccine Syringe & Shield
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#EEF2FF" />
        <path d="M18 3L21 6M19.5 4.5L13 11M15.5 7L17 8.5M11.5 11L13 12.5M10 14L4 20M4 20H7M4 20V17" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="3" stroke="#6366F1" strokeWidth="1.5" fill="#C7D2FE" fillOpacity="0.5" />
      </svg>
    );
  }

  // --- 14. RINGKASAN KLINIS ---
  if (slug === "ringkasan") {
    if (currentVariant === "v2") {
      // V2: Patient Records File Folder
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F8FAFC" />
          <path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V7Z" fill="#E2E8F0" stroke="#334155" strokeWidth="1.8" />
          <path d="M8 12H16M8 16H13" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Quick Copy Note Sheet & Stethoscope Stamp
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F1F5F9" />
          <path d="M8 4H16C17.1 4 18 4.9 18 6V18C18 19.1 17.1 20 16 20H8C6.9 20 6 19.1 6 18V6C6 4.9 6.9 4 8 4Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
          <path d="M9 8H15M9 12H15M9 16H12" stroke="#0A0B5F" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="15" cy="16" r="2" fill="#D936A6" />
        </svg>
      );
    }
    // V1: Clinical Medical Clipboard
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#F1F5F9" />
        <rect x="5" y="5" width="14" height="15" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.8" />
        <path d="M9 3H15V6H9V3Z" fill="#0A0B5F" rx="1" />
        <path d="M8 10H16M8 13.5H16M8 17H13" stroke="#0A0B5F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // --- OBAT & PUYER (menu gabungan) ---
  // Satu bentuk yang menceritakan dua alat sekaligus: kapsul yang digerus lalu
  // jatuh menjadi serbuk di atas bungkus puyer. Palet menggabungkan oranye dari
  // ikon Dosis Obat lama dan ungu dari ikon Racik Puyer lama, supaya menu baru
  // ini tetap terasa sebagai keturunan keduanya.
  if (slug === "obat") {
    if (currentVariant === "v2") {
      // V2: Mortar, alu, dan kapsul yang siap digerus
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#F5F3FF" />
          <path d="M15.5 3.5L11.5 11" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="4.6" y="9.4" width="9" height="5.4" rx="2.7" transform="rotate(-38 4.6 9.4)" fill="#FB923C" stroke="#EA580C" strokeWidth="1.4" />
          <path d="M5 12.5C5 12.5 4.2 18.5 12 18.5C19.8 18.5 19 12.5 19 12.5H5Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" strokeLinejoin="round" />
          <rect x="4" y="19.6" width="16" height="2" rx="1" fill="#7C3AED" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Bungkus puyer terlipat dengan kapsul menyilang di atasnya
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FFF7ED" />
          <path d="M4.5 9.5H19.5L17.6 20H6.4L4.5 9.5Z" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M4.5 9.5L12 13L19.5 9.5" stroke="#7C3AED" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 13V20" stroke="#A78BFA" strokeWidth="1.2" strokeDasharray="2 2" />
          <rect x="6.2" y="6.6" width="10" height="5.2" rx="2.6" transform="rotate(-24 6.2 6.6)" fill="#FDBA74" stroke="#EA580C" strokeWidth="1.4" />
          <circle cx="9.5" cy="16.5" r="1.1" fill="#A855F7" />
          <circle cx="14" cy="17.4" r="1.1" fill="#F59E0B" />
        </svg>
      );
    }
    // V1: Kapsul terbuka menumpahkan serbuk ke bungkus puyer
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FEF6EE" />
        <rect x="4.4" y="6.2" width="11" height="5.6" rx="2.8" transform="rotate(-32 4.4 6.2)" fill="#FB923C" stroke="#EA580C" strokeWidth="1.5" />
        <path d="M8.2 3.8L13 10" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="11.4" cy="12.6" r="0.85" fill="#F59E0B" />
        <circle cx="13.8" cy="14" r="0.7" fill="#A855F7" />
        <circle cx="9.6" cy="14.2" r="0.6" fill="#C084FC" />
        <path d="M5.4 15.4H18.6L17.1 20.6H6.9L5.4 15.4Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M5.4 15.4L12 17.4L18.6 15.4" stroke="#6D28D9" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    );
  }

  // --- TEKANAN DARAH ---
  // Slug ini belum pernah punya ikon, jadi menunya memakai lingkaran fallback.
  if (slug === "tekanan-darah") {
    if (currentVariant === "v2") {
      // V2: Pengukur aneroid dengan jarum dan balon pompa
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FFF1F2" />
          <circle cx="10" cy="10" r="6.2" fill="#FFFFFF" stroke="#BE123C" strokeWidth="1.8" />
          <path d="M10 10L13.2 6.9" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="10" r="1.1" fill="#BE123C" />
          <path d="M6.1 6.2L6.9 7M13.9 6.2L13.1 7M10 4.4V5.4" stroke="#FB7185" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14.8 14.4C16.9 14.4 18.6 15.9 18.6 17.8C18.6 19.6 17 21 15 21C13 21 11.4 19.6 11.4 17.8" stroke="#9F1239" strokeWidth="1.7" strokeLinecap="round" fill="#FDA4AF" fillOpacity="0.55" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Monitor digital dengan angka tensi dan denyut
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EFF6FF" />
          <rect x="4" y="5" width="16" height="11.5" rx="2.4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="1.8" />
          <path d="M6.6 9.2H11.4M6.6 12.4H10.2" stroke="#1E40AF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 12.6C13 12.6 14 10.4 15 12.6C15.6 13.9 16.4 10 17.4 12.6" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 19.4H17" stroke="#60A5FA" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    }
    // V1 (default): Gauge tensimeter (sphygmomanometer) dengan jarum, skala,
    // selang manset, dan guratan pulsa -- SAMA PERSIS dengan ikon header di
    // halaman Tekanan Darah (lihat BpPercentileForm.tsx) supaya konsisten.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#FDF2F8" />
        <circle cx="12" cy="13.5" r="7" fill="#FCE7F3" stroke="#DB2777" strokeWidth="1.6" />
        <path d="M12 7.6V9" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M17.9 13.5H16.5" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M6.1 13.5H7.5" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M16.2 9.3L15.2 10.3" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M8.8 9.3L9.8 10.3" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M12 13.5L15.1 10.6" stroke="#BE185D" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="13.5" r="1.5" fill="#BE185D" />
        <path d="M9 20.5C9 18.7 10.1 17.3 12 17.3C13.9 17.3 15 18.7 15 20.5" stroke="#DB2777" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M4.3 4H5.6L6.5 2.2L7.6 5.8L8.5 4H9.8" stroke="#F472B6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // --- KALKULATOR eGFR ---
  if (slug === "egfr") {
    if (currentVariant === "v2") {
      // V2: Nefron & Corong Filtrasi Glomerulus (Nephron & Glomerular Filtration)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#CCFBF1" />
          <path
            d="M 13.5 4.5 C 8 4.5 5 7.8 5 12 C 5 16.2 8 19.5 13.5 19.5 C 15.8 19.5 16.5 16.5 14.5 14.5 C 13 13 13 11 14.5 9.5 C 16.5 7.5 15.8 4.5 13.5 4.5 Z"
            fill="#99F6E4"
            stroke="#0D9488"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="9.5" r="2.2" fill="#0D9488" fillOpacity="0.3" stroke="#0F766E" strokeWidth="1.3" />
          <path d="M 9.5 11.7 V 15 C 9.5 16.2 11.5 16.2 11.5 15 V 13" stroke="#0F766E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <circle cx="17.5" cy="12" r="1" fill="#14B8A6" />
          <circle cx="19.5" cy="12" r="0.7" fill="#2DD4BF" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Modern Clinical Kidney Meter & GFR Gauge
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#E0F2FE" />
          <path d="M 8 6 C 5.8 6 4.8 8 4.8 10.5 C 4.8 13 5.8 15 8 15 C 9 15 9.2 13.8 8.5 12.8 C 7.8 11.8 7.8 10.2 8.5 9.2 C 9.2 8.2 9 6 8 6 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M 16 6 C 18.2 6 19.2 8 19.2 10.5 C 19.2 13 18.2 15 16 15 C 15 15 14.8 13.8 15.5 12.8 C 16.2 11.8 16.2 10.2 15.5 9.2 C 14.8 8.2 15 6 16 6 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M 6.5 18 H 17.5" stroke="#0369A1" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 9 18 L 12 14 L 15 18" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="12" cy="14" r="1.5" fill="#0369A1" />
        </svg>
      );
    }
    // V1 (default): Sepasang Organ Ginjal Pediatrik & Laju Filtrasi Glomerulus (eGFR) --
    // SAMA PERSIS dengan ikon header di halaman Kalkulator eGFR.
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#ECFEFF" />
        {/* Left Kidney Organ */}
        <path
          d="M 8.5 6.2 C 5.8 6.2 4.8 8.5 4.8 11.5 C 4.8 14.5 5.8 16.8 8.5 16.8 C 9.6 16.8 9.6 14.8 8.6 13.5 C 7.6 12.2 7.6 10.8 8.6 9.5 C 9.6 8.2 9.6 6.2 8.5 6.2 Z"
          fill="#CFFAFE"
          stroke="#0891B2"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Right Kidney Organ */}
        <path
          d="M 15.5 6.2 C 18.2 6.2 19.2 8.5 19.2 11.5 C 19.2 14.5 18.2 16.8 15.5 16.8 C 14.4 16.8 14.4 14.8 15.4 13.5 C 16.4 12.2 16.4 10.8 15.4 9.5 C 14.4 8.2 14.4 6.2 15.5 6.2 Z"
          fill="#CFFAFE"
          stroke="#0891B2"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Renal Cortex / Inner Calyx Details */}
        <path d="M 7.2 9.2 C 6.5 10.5 6.5 12.5 7.2 13.8" stroke="#0E7490" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 16.8 9.2 C 17.5 10.5 17.5 12.5 16.8 13.8" stroke="#0E7490" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Vessels & Ureters */}
        <path d="M 8.2 11.5 C 9.8 11.5 11 12.5 11.5 15.5 V 19" stroke="#0891B2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 15.8 11.5 C 14.2 11.5 13 12.5 12.5 15.5 V 19" stroke="#0891B2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* eGFR Glomerular Filtration Sparkle Indicator */}
        <circle cx="12" cy="4.5" r="1.1" fill="#06B6D4" />
        <path d="M 10.5 8.2 L 12 6.8 L 13.5 8.2" stroke="#06B6D4" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // --- TOOL NEONATUS ---
  if (slug === "neonatus") {
    if (currentVariant === "v2") {
      // V2: Botol susu bayi dengan dot dan garis takaran
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#EFF6FF" />
          <path d="M10.4 2.8H13.6V5H10.4Z" fill="#93C5FD" />
          <path d="M9.4 5H14.6C15.2 5 15.6 5.4 15.6 6V7.2H8.4V6C8.4 5.4 8.8 5 9.4 5Z" fill="#BFDBFE" />
          <rect x="8.4" y="7.2" width="7.2" height="13" rx="2.4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.6" />
          <path d="M9.9 11.2H14.1M9.9 14.2H14.1M9.9 17.2H12.6" stroke="#93C5FD" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Inkubator bayi dengan kubah penghangat
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect width="24" height="24" rx="6" fill="#FFF7ED" />
          <path d="M5 13C5 8.6 8.1 5.5 12 5.5C15.9 5.5 19 8.6 19 13" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" fill="#FFFBEB" />
          <rect x="4" y="13" width="16" height="5" rx="2" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.6" />
          <circle cx="12" cy="10" r="1.8" fill="#FBBF24" />
          <path d="M7.5 20.5H16.5" stroke="#FCD34D" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    }
    // V1 (default): Wajah bayi dengan lingkaran pelindung
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="6" fill="#ECFDF5" />
        <circle cx="12" cy="13" r="6.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.7" />
        <path d="M12 6.5C12 5 13 4 14.2 4.4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="9.8" cy="12.4" r="0.9" fill="#059669" />
        <circle cx="14.2" cy="12.4" r="0.9" fill="#059669" />
        <path d="M10 15.2C10.7 16 13.3 16 14 15.2" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // --- PEMBELAJARAN / AKADEMI KLINIS ---
  if (slug === "pembelajaran") {
    if (currentVariant === "v2") {
      // V2: Buku Pintar Medis & Berkas Sinar Ide (Kasus & Eksplorasi Klinis)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          {!hideBackground && <rect width="24" height="24" rx="6" fill="#ECFDF5" />}
          {/* Open Book Base */}
          <path
            d="M12 6.5C10 5.2 6.5 5.2 4 6.2V17.8C6.5 16.8 10 16.8 12 18.2C14 16.8 17.5 16.8 20 17.8V6.2C17.5 5.2 14 5.2 12 6.5Z"
            fill={hideBackground ? "rgba(255,255,255,0.2)" : "#D1FAE5"}
            fillOpacity={hideBackground ? "1" : "0.75"}
            stroke={hideBackground ? "#FFFFFF" : "#059669"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Book Spine */}
          <path d="M12 6.5V18.2" stroke={hideBackground ? "#FFFFFF" : "#047857"} strokeWidth="1.6" strokeLinecap="round" />
          {/* Pediatric ECG curve line */}
          <path
            d="M5.5 11.5H7.2L8.2 9.5L9.5 13.5L10.5 11.5H11"
            stroke={hideBackground ? "#FFFFFF" : "#10B981"}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Knowledge Sparkle Star at Top */}
          <path
            d="M12 2L12.6 3.6L14.2 4.2L12.6 4.8L12 6.4L11.4 4.8L9.8 4.2L11.4 3.6L12 2Z"
            fill={hideBackground ? "#FEF08A" : "#F59E0B"}
          />
        </svg>
      );
    }
    if (currentVariant === "v3") {
      // V3: Lencana Medali Prestasi & Pita Klinis (Kuis & Simulasi)
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          {!hideBackground && <rect width="24" height="24" rx="6" fill="#FDF2F8" />}
          {/* Rosette Ribbon Banner */}
          <path
            d="M8 14.5L6.5 21L12 18.5L17.5 21L16 14.5"
            fill={hideBackground ? "rgba(255,255,255,0.25)" : "#FCE7F3"}
            stroke={hideBackground ? "#FFFFFF" : "#D936A6"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Badge Rosette Round */}
          <circle
            cx="12"
            cy="9.5"
            r="6"
            fill={hideBackground ? "rgba(255,255,255,0.3)" : "#F472B6"}
            fillOpacity={hideBackground ? "1" : "0.25"}
            stroke={hideBackground ? "#FFFFFF" : "#D936A6"}
            strokeWidth="1.7"
          />
          {/* Golden Star of Clinical Excellence */}
          <path
            d="M12 5.8L13.2 8.3L15.9 8.7L13.9 10.6L14.4 13.3L12 12L9.6 13.3L10.1 10.6L8.1 8.7L10.8 8.3L12 5.8Z"
            fill={hideBackground ? "#FEF08A" : "#F59E0B"}
            stroke={hideBackground ? "#F59E0B" : "#D97706"}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    // V1 (default): Topi Wisuda Toga & Rumbai Emas (Akademi Pediatrik)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {!hideBackground && <rect width="24" height="24" rx="6" fill="#EEF2FF" />}
        {/* Cap Diamond Top */}
        <path
          d="M12 3.5L21 7.8L12 12.2L3 7.8L12 3.5Z"
          fill={hideBackground ? "rgba(255,255,255,0.35)" : "#818CF8"}
          fillOpacity={hideBackground ? "1" : "0.75"}
          stroke={hideBackground ? "#FFFFFF" : "#4338CA"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Cap Lower Base */}
        <path
          d="M6.5 10.5V14.8C6.5 17 9 18.5 12 18.5C15 18.5 17.5 17 17.5 14.8V10.5"
          fill={hideBackground ? "rgba(255,255,255,0.15)" : "#C7D2FE"}
          fillOpacity={hideBackground ? "1" : "0.4"}
          stroke={hideBackground ? "#FFFFFF" : "#4F46E5"}
          strokeWidth="1.5"
        />
        {/* Tassel & Golden Bead */}
        <path d="M18.8 9.5V16L17.5 17.2" stroke={hideBackground ? "#FEF08A" : "#F59E0B"} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17.5" cy="17.2" r="1.1" fill={hideBackground ? "#FEF08A" : "#D97706"} />
        <circle cx="12" cy="7.8" r="1" fill={hideBackground ? "#FFFFFF" : "#312E81"} />
      </svg>
    );
  }

  // Default fallback if unknown slug
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="6" fill="#F1F5F9" />
      <circle cx="12" cy="12" r="6" stroke="#64748B" strokeWidth="1.8" />
    </svg>
  );
};

// --- CUSTOMIZER MODAL / DRAWER COMPONENT ---
export interface IconCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: { slug: SidebarIconSlug; label: string; fixed?: boolean }[];
}

const SECTIONS: MenuSection[] = [
  {
    title: "Utama",
    items: [
      { slug: "beranda", label: "Beranda" },
      { slug: "ai-assistant", label: "Asisten AI" },
    ],
  },
  {
    title: "Emergency",
    items: [
      { slug: "darurat", label: "Mode Darurat" },
      { slug: "alur", label: "Alur Tata Laksana" },
    ],
  },
  {
    title: "Kalkulator Klinis",
    items: [
      { slug: "obat", label: "Obat & Puyer" },
      { slug: "cairan", label: "Terapi Cairan" },
    ],
  },
  {
    title: "Pemantauan Klinis",
    items: [
      { slug: "tumbuh-kembang", label: "Tumbuh Kembang", fixed: true },
      { slug: "skoring", label: "Skoring Klinis" },
      { slug: "tekanan-darah", label: "Tekanan Darah" },
      { slug: "egfr", label: "Kalkulator eGFR" },
    ],
  },
  {
    title: "Diagnostik & Gizi",
    items: [
      { slug: "lab", label: "Interpretasi Lab" },
    ],
  },
  {
    title: "Tool Neonatus",
    items: [{ slug: "neonatus", label: "Tool Neonatus" }],
  },
  {
    title: "Pembelajaran & Modul",
    items: [{ slug: "pembelajaran", label: "Akademi / Pembelajaran" }],
  },
  {
    title: "Referensi",
    items: [
      { slug: "protokol", label: "Guideline" },
      { slug: "imunisasi", label: "Jadwal Imunisasi" },
    ],
  },
  {
    title: "Dokumentasi",
    items: [{ slug: "ringkasan", label: "Ringkasan Klinis" }],
  },
];

export const IconCustomizerModal: React.FC<IconCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { variants, setVariant, resetVariants } = useSidebarIconVariants();
  const pembelajaranTitle = usePembelajaranMenuTitle();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10, 11, 95, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 20px 45px -10px rgba(10, 11, 95, 0.3)",
          overflow: "hidden",
          border: "1px solid rgba(217, 54, 166, 0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #D936A6 0%, #0A0B5F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "20px",
                boxShadow: "0 4px 12px rgba(217, 54, 166, 0.25)",
              }}
            >
              🎨
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#0A0B5F",
                  fontFamily: "var(--font-fredoka, 'Fredoka', sans-serif)",
                }}
              >
                Kustomisasi Nama & Desain Ikon Sidebar
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#64748B" }}>
                Pilih opsi nama menu dan gaya SVG favorit Anda untuk navigasi Tinyverse.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#E2E8F0",
              border: "none",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontWeight: 700,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#D936A6",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{sec.title}</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(217, 54, 166, 0.15)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {sec.items.map((item) => {
                    const activeVariant = variants[item.slug] || "v1";

                    if (item.fixed) {
                      return (
                        <div
                          key={item.slug}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "14px",
                            background: "#F8FAFC",
                            border: "1px dashed #CBD5E1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <SidebarIcon slug={item.slug} size={28} />
                            <div>
                              <div style={{ fontWeight: 700, color: "#0A0B5F", fontSize: "0.95rem" }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                                Desain Vektor Tetap (Kurva Standar WHO & CDC)
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: "20px",
                              background: "#E2E8F0",
                              color: "#475569",
                            }}
                          >
                            🔒 Tetap
                          </span>
                        </div>
                      );
                    }

                    if (item.slug === "pembelajaran") {
                      return (
                        <div
                          key={item.slug}
                          style={{
                            padding: "16px 18px",
                            borderRadius: "16px",
                            background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)",
                            border: "2px solid #E9D5FF",
                            boxShadow: "0 4px 14px rgba(217, 54, 166, 0.08)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <SidebarIcon slug="pembelajaran" variant={activeVariant} size={28} />
                              <div>
                                <div style={{ fontWeight: 800, color: "#0A0B5F", fontSize: "1rem" }}>
                                  Menu Pembelajaran:{" "}
                                  <span style={{ color: "#D936A6" }}>{pembelajaranTitle.label}</span>
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
                                  Pilih kombinasi nama menu dan desain SVG favorit Anda di bawah:
                                </div>
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "4px 10px",
                                borderRadius: "20px",
                                background: "#FDF2F8",
                                color: "#D936A6",
                                border: "1px solid #FBCFE8",
                              }}
                            >
                              ✨ 3 Opsi Nama &amp; Ikon
                            </span>
                          </div>

                          {/* 1. Name Selection */}
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: "#475569",
                                marginBottom: "8px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              1. Pilihan Nama Menu di Sidebar (3 Opsi)
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
                              {PEMBELAJARAN_NAME_OPTIONS.map((opt) => {
                                const isSelected = pembelajaranTitle.key === opt.key;
                                return (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => pembelajaranTitle.setKey(opt.key)}
                                    style={{
                                      textAlign: "left",
                                      padding: "10px 12px",
                                      borderRadius: "12px",
                                      border: isSelected ? "2px solid #9333EA" : "1px solid #E2E8F0",
                                      background: isSelected ? "#F3E8FF" : "#FFFFFF",
                                      cursor: "pointer",
                                      transition: "all 0.15s ease",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "0.7rem",
                                          fontWeight: 700,
                                          color: isSelected ? "#9333EA" : "#64748B",
                                        }}
                                      >
                                        {opt.badge}
                                      </span>
                                      {isSelected && <span style={{ color: "#9333EA", fontWeight: 800 }}>✓</span>}
                                    </div>
                                    <div
                                      style={{
                                        fontWeight: 800,
                                        fontSize: "0.92rem",
                                        color: isSelected ? "#581C87" : "#0A0B5F",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      {opt.label}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.3 }}>
                                      {opt.tagline}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. SVG Icon Selection */}
                          <div>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: "#475569",
                                marginBottom: "8px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              2. Pilihan Desain Ikon SVG (3 Opsi)
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                              {[
                                {
                                  variant: "v1" as SidebarIconVariant,
                                  title: "Topi Wisuda & Toga",
                                  subtitle: "Akademi Pediatri",
                                },
                                {
                                  variant: "v2" as SidebarIconVariant,
                                  title: "Buku Pintar & Ide",
                                  subtitle: "Studi Kasus & Sinar",
                                },
                                {
                                  variant: "v3" as SidebarIconVariant,
                                  title: "Medali Prestasi",
                                  subtitle: "Kuis & Bintang Emas",
                                },
                              ].map((itemOption, idx) => {
                                const isSelected = activeVariant === itemOption.variant;
                                return (
                                  <button
                                    key={itemOption.variant}
                                    type="button"
                                    onClick={() => setVariant("pembelajaran", itemOption.variant)}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: "6px",
                                      padding: "12px 8px",
                                      borderRadius: "14px",
                                      border: isSelected ? "2px solid #D936A6" : "1px solid #E2E8F0",
                                      background: isSelected ? "#FDF2F8" : "#FFFFFF",
                                      cursor: "pointer",
                                      transition: "all 0.15s ease",
                                    }}
                                  >
                                    <SidebarIcon slug="pembelajaran" variant={itemOption.variant} size={36} />
                                    <div style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          fontSize: "0.78rem",
                                          fontWeight: isSelected ? 800 : 700,
                                          color: isSelected ? "#D936A6" : "#0A0B5F",
                                        }}
                                      >
                                        Opsi {idx + 1} {isSelected ? "✓" : ""}
                                      </div>
                                      <div style={{ fontSize: "0.7rem", color: "#64748B" }}>
                                        {itemOption.title}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.slug}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "16px",
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#0A0B5F",
                            fontSize: "0.95rem",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span>{item.label}</span>
                        </div>

                        {/* 3 Variant Options */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                          {(["v1", "v2", "v3"] as SidebarIconVariant[]).map((v, idx) => {
                            const isSelected = activeVariant === v;
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setVariant(item.slug, v)}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "10px 8px",
                                  borderRadius: "12px",
                                  border: isSelected ? "2px solid #D936A6" : "1px solid #E2E8F0",
                                  background: isSelected ? "#FDF2F8" : "#F8FAFC",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <SidebarIcon slug={item.slug} variant={v} size={32} />
                                <span
                                  style={{
                                    fontSize: "0.76rem",
                                    fontWeight: isSelected ? 700 : 500,
                                    color: isSelected ? "#D936A6" : "#64748B",
                                  }}
                                >
                                  Opsi {idx + 1} {isSelected ? "✓" : ""}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F8FAFC",
          }}
        >
          <button
            type="button"
            onClick={() => {
              resetVariants();
              pembelajaranTitle.setKey("akademi-klinis");
            }}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#475569",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 Reset ke Default
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #0A0B5F 0%, #17186f 100%)",
              color: "#FFFFFF",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(10, 11, 95, 0.2)",
            }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
