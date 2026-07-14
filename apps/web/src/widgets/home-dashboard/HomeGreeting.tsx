"use client";

import { useAuth } from "@/widgets/user-account";

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
      <span className="tv-home-badge">
        {"\uD83C\uDFE5"} Tinyverse Home Dashboard
      </span>
      <h1>
        {"Halo, " + sapaan + " "}
        {"\uD83D\uDC4B"}
      </h1>
      <p>Semua alat bantu pediatri dalam satu tempat.</p>
    </section>
  );
}
