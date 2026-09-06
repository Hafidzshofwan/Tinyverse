"use client";

import { useAuth } from "@/widgets/user-account";
import { SidebarIcon } from "@/shared/ui";

/**
 * Menghasilkan sapaan berdasarkan jam lokal perangkat.
 * 05:00-11:59  Selamat pagi
 * 12:00-14:59  Selamat siang
 * 15:00-17:59  Selamat sore
 * 18:00-04:59  Selamat malam
 */
function sapaanWaktu(): string {
  const jam = new Date().getHours();
  if (jam >= 5 && jam < 12) return "Selamat pagi";
  if (jam >= 12 && jam < 15) return "Selamat siang";
  if (jam >= 15 && jam < 18) return "Selamat sore";
  return "Selamat malam";
}

/**
 * Header sapaan beranda. Nama diambil DINAMIS dari akun yang sedang login
 * (profil.nama), mis. "Selamat pagi, dr. Ajeng". Jika nama belum ada, tampil
 * "Dokter". Sapaan berubah otomatis sesuai jam lokal perangkat.
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
      <h1 style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span>{sapaanWaktu() + ", " + sapaan}</span>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="tv-greeting-hand-icon"
        >
          <defs>
            <linearGradient id="tvGreetingGrad1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--tv-greeting-stop1, #EC4899)" />
              <stop offset="100%" stopColor="var(--tv-greeting-stop2, #8B5CF6)" />
            </linearGradient>
            <linearGradient id="tvGreetingGrad2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--tv-greeting-stop3, #F59E0B)" />
              <stop offset="100%" stopColor="var(--tv-greeting-stop4, #EF4444)" />
            </linearGradient>
          </defs>
          <path
            d="M18 11V6a2 2 0 0 0-4 0v4M14 10V4a2 2 0 0 0-4 0v6M10 10.5V2.5a2 2 0 0 0-4 0v9.5M6 10.5V7a2 2 0 0 0-4 0v8a7 7 0 0 0 14 0v-4a2 2 0 0 0-4 0v0"
            stroke="url(#tvGreetingGrad1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M20 3l0.8 1.6 1.6 0.8-1.6 0.8L20 7.8l-0.8-1.6-1.6-0.8 1.6-0.8L20 3z" fill="url(#tvGreetingGrad2)" />
          <path d="M4 2l0.5 1 1 0.5-1 0.5L4 5l-0.5-1-1-0.5 1-0.5L4 2z" fill="#38BDF8" />
        </svg>
      </h1>
      <p>Semua alat bantu pediatri dalam satu tempat.</p>
    </section>
  );
}
