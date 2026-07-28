import React from "react";
import { SidebarIcon } from "@/shared/ui";

export function RakObatHeaderIcon({ size = 38 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <SidebarIcon slug="dosis" size={size} />
    </div>
  );
}

export function KalkulatorHeaderIcon({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#FDF2F8" />
      <rect x="5" y="4" width="14" height="16" rx="3" fill="#EC4899" />
      <rect x="7" y="6" width="10" height="4" rx="1" fill="#FFFFFF" />
      <circle cx="8.5" cy="12.5" r="1" fill="#FFFFFF" />
      <circle cx="12" cy="12.5" r="1" fill="#FFFFFF" />
      <circle cx="15.5" cy="12.5" r="1" fill="#FFFFFF" />
      <circle cx="8.5" cy="15.5" r="1" fill="#FFFFFF" />
      <circle cx="12" cy="15.5" r="1" fill="#FFFFFF" />
      <circle cx="15.5" cy="15.5" r="1" fill="#FFFFFF" />
      <path d="M8.5 18.5H15.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIconSvg({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function PillIconSvg({ size = 20, color = "#EC4899" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="11" width="14" height="7" rx="3.5" transform="rotate(-45 4 11)" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <line x1="8.5" y1="12.5" x2="13.5" y2="7.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function MedicineCardIcon({ jenis, size = 18 }: { jenis?: string; size?: number }) {
  const lower = (jenis || "").toLowerCase();

  if (lower.includes("sirup") || lower.includes("mukolitik") || lower.includes("cair")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3H16V6H8V3Z" fill="#3B82F6" fillOpacity="0.2" stroke="#2563EB" strokeWidth="1.8" />
        <path d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V8Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.8" />
        <line x1="9" y1="12" x2="15" y2="12" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    );
  }

  if (lower.includes("antibiotik") || lower.includes("antivirus")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="14" height="7" rx="3.5" transform="rotate(-30 5 10)" fill="#10B981" fillOpacity="0.25" stroke="#059669" strokeWidth="1.8" />
        <line x1="8" y1="7" x2="15" y2="17" stroke="#059669" strokeWidth="1.8" />
      </svg>
    );
  }

  return <PillIconSvg size={size} color="#6366F1" />;
}
