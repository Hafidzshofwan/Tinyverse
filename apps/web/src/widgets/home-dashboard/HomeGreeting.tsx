"use client";

import { useAuth } from "@/widgets/user-account";
import { SidebarIcon } from "@/shared/ui";

/**
 * Header sapaan beranda. Nama diambil DINAMIS dari akun yang sedang login
 * (profil.nama), mis. "Halo, dr. Ajeng". Jika nama belum ada, tampil "Dokter".
 */
export function HomeGreeting() {
  const { profil } = useAuth();
  const nama = (profil?.nama ?? "").trim();
  const sapaan = nama ? "dr. " + nama : "Dokter";

  return (
    <section className="tv-home-header">
      <span className="tv-home-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <SidebarIcon slug="beranda" size={18} />
        <span>Tinyverse Home Dashboard</span>
      </span>
      <h1 style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span>{"Halo, " + sapaan}</span>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "inline-block" }}>
          <path d="M7 11.5V16.5C7 19.3 9.2 21.5 12 21.5C14.8 21.5 17 19.3 17 16.5V11.5" stroke="#D936A6" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 12V6.5C9 5.7 9.7 5 10.5 5C11.3 5 12 5.7 12 6.5V11" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 11V7.5C12 6.7 12.7 6 13.5 6C14.3 6 15 6.7 15 7.5V11" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 11.5V9C15 8.2 15.7 7.5 16.5 7.5C17.3 7.5 18 8.2 18 9V14" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 10.5C6 9.7 6.7 9 7.5 9C8.3 9 9 9.7 9 10.5V12" stroke="#0A0B5F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </h1>
      <p>Semua alat bantu pediatri dalam satu tempat.</p>
    </section>
  );
}
