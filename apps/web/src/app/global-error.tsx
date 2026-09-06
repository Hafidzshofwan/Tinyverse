"use client";

/**
 * Batas error untuk layout akar itu sendiri.
 *
 * Next.js hanya memakai berkas ini bila error terlempar di app/layout.tsx
 * sendiri (mis. `ambilPengingat` yang gagal di luar try/catch-nya, atau bug
 * baru di AppShell). Karena layout akar-lah yang gagal, komponen ini
 * MENGGANTIKAN seluruhnya, termasuk <html> dan <body> — karena itu ia wajib
 * merender keduanya sendiri.
 *
 * WHY gaya ditulis inline, bukan lewat CSS module atau globals.css: berkas
 * ini aktif justru ketika layout akar gagal, dan globals.css di-import LEWAT
 * layout akar. Bergantung padanya di sini berarti berjudi bahwa tepat saat
 * dibutuhkan, sumber daya yang gagal itu masih tersedia — taruhan yang
 * sengaja dihindari dengan menulis gaya yang berdiri sendiri.
 */
export default function GlobalErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0F172A",
          color: "#F1F5F9",
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(148,163,184,0.25)",
            borderLeft: "3px solid #DC2626",
            borderRadius: "0 16px 16px 0",
            padding: "32px 28px",
            background: "#1E293B",
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 12 }} aria-hidden="true">
            {"\u26A0\uFE0F"}
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700 }}>
            Aplikasi gagal dimuat
          </h1>
          <p
            style={{
              margin: "0 0 22px",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#94A3B8",
            }}
          >
            Terjadi error yang tidak terduga saat memuat aplikasi. Tim sudah
            otomatis menerima catatannya. Coba muat ulang halaman ini.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: "#2563EB",
                color: "#FFFFFF",
              }}
            >
              Coba lagi
            </button>
            <a
              href="/"
              style={{
                border: "1px solid rgba(148,163,184,0.35)",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                color: "#F1F5F9",
              }}
            >
              Muat ulang beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
