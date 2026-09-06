"use client";

/**
 * Batas error untuk seluruh halaman di bawah layout akar.
 *
 * Next.js merender berkas ini bila ada error yang terlempar SAAT render pada
 * segmen mana pun (kecuali layout akar sendiri — itu tugas global-error.tsx).
 * Boundary ini tetap dirender DI DALAM layout akar, jadi CSS global dan
 * AppShell (header, sidebar) tetap ada di sekitarnya — pengguna tidak
 * kehilangan seluruh konteks navigasi hanya karena satu halaman gagal.
 */
import gaya from "./ErrorBoundary.module.css";

export default function ErrorBoundary({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className={gaya.bungkus}>
      <div className={gaya.kartu}>
        <div className={gaya.ikon} aria-hidden="true">
          {"\u26A0\uFE0F"}
        </div>
        <h1 className={gaya.judul}>Ada yang tidak beres</h1>
        <p className={gaya.pesan}>
          Halaman ini mengalami error yang tidak terduga. Coba muat ulang — bila
          masih terjadi, kembali ke beranda dan coba lagi dari sana.
        </p>
        <div className={gaya.aksi}>
          <button type="button" className="tv-btn" onClick={() => reset()}>
            Coba lagi
          </button>
          <a href="/preview" className="tv-btn sekunder">
            Kembali ke beranda
          </a>
        </div>
      </div>
    </div>
  );
}
