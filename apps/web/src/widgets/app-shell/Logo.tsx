import type { CSSProperties } from "react";

/**
 * Logo Tinyverse (hanya ikon). Menampilkan gambar dari /brand/logo.png yang
 * bisa diganti dengan file logo milik pengguna (PNG latar transparan). Teks
 * "Tinyverse" tetap dirender terpisah oleh header/footer.
 */
export function Logo({ size = 30 }: { size?: number }) {
  const gaya: CSSProperties = { height: size, width: "auto" };
  return (
    <img
      className="tv-brand-logo-img"
      src="/brand/logo.png"
      alt="Logo Tinyverse"
      style={gaya}
      draggable={false}
    />
  );
}
