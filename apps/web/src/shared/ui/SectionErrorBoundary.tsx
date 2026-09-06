"use client";

import { Component, type ReactNode } from "react";

/**
 * Batas error untuk SATU bagian UI, dipakai di dalam AppShell.
 *
 * WHY ini perlu selain app/error.tsx dan app/global-error.tsx: kedua berkas
 * itu hanya membungkus {children} milik layout akar -- yaitu isi halaman.
 * Header, sidebar, profil pasien, dan widget Asisten AI dirender oleh
 * AppShell SENDIRI, di LUAR {children}. Bila salah satunya melempar error,
 * Next.js tidak menganggapnya berasal dari {children}, sehingga error.tsx
 * TIDAK menangkapnya -- ia lolos sampai ke global-error.tsx dan mematikan
 * SELURUH aplikasi, termasuk isi halaman yang sebenarnya baik-baik saja.
 * Komponen ini menutup celah itu: setiap bagian AppShell yang dianggap
 * berisiko dibungkus sendiri-sendiri, sehingga satu bagian yang error tidak
 * ikut menjatuhkan bagian lain.
 *
 * WHY komponen kelas, bukan fungsi: React belum menyediakan padanan Hook
 * untuk `componentDidCatch`/`getDerivedStateFromError`. Batas error di React
 * hanya bisa dibuat lewat komponen kelas -- ini bukan pilihan gaya, melainkan
 * satu-satunya cara yang didukung React saat ini.
 */

type Props = {
  children: ReactNode;
  /** Nama bagian, dipakai pada pesan fallback & catatan error. */
  label: string;
  /**
   * "silent": sembunyikan bagian ini sepenuhnya saat error (untuk hiasan
   *   yang tidak esensial, mis. pencarian global, pengganti tema).
   * "inline": tampilkan pil kecil dengan tombol coba lagi (bawaan).
   */
  variant?: "silent" | "inline";
};

type State = {
  hasError: boolean;
};

export class SectionErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch() {
    // Error sudah ditangkap oleh getDerivedStateFromError.
  }

  private cobaLagi = () => {
    this.setState({ hasError: false });
  };

  override render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.variant === "silent") return null;

    return (
      <div
        role="alert"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid rgba(220, 38, 38, 0.35)",
          background: "rgba(220, 38, 38, 0.08)",
          color: "#B91C1C",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span>{this.props.label} gagal dimuat</span>
        <button
          type="button"
          onClick={this.cobaLagi}
          style={{
            border: "none",
            background: "transparent",
            color: "inherit",
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: 12,
          }}
        >
          Coba lagi
        </button>
      </div>
    );
  }
}
