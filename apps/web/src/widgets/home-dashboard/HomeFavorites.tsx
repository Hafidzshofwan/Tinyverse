"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FITUR_TERSEDIA, type FiturMeta } from "@/widgets/app-shell/nav-config";
import { useFavorit, hapusFavorit } from "@/shared/lib/personalisasi";
import { SidebarIcon } from "@/shared/ui";

/**
 * Daftar "Favorit Saya". Sepenuhnya ditentukan user: fitur ditambahkan lewat
 * tombol bintang di kartu Quick Access, dan dapat dihapus lewat tombol di sini.
 */
export function HomeFavorites() {
  const [isMounted, setIsMounted] = useState(false);
  const favorit = useFavorit();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const daftar = favorit
    .map((href) => FITUR_TERSEDIA.find((f) => f.href === href))
    .filter((f): f is FiturMeta => Boolean(f));

  if (!isMounted) {
    return (
      <section className="tv-card tv-stack">
        <div className="tv-home-section-head">
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span aria-hidden style={{ display: "inline-flex" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Favorit Saya</span>
          </h2>
          <p>Memuat daftar favorit tersimpan...</p>
        </div>
        <div className="tv-fav-list">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="tv-fav-skeleton">
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <span className="tv-skeleton" style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <span className="tv-skeleton" style={{ width: "50%", height: 16, borderRadius: 4 }} />
                  <span className="tv-skeleton" style={{ width: "80%", height: 12, borderRadius: 4 }} />
                </div>
              </div>
              <span className="tv-skeleton" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="tv-card tv-stack">
      <div className="tv-home-section-head">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden style={{ display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Favorit Saya</span>
        </h2>
        <p>
          Tekan ikon bintang pada kartu Quick Access untuk menambah, atau tombol
          hapus di sini untuk mengurangi.
        </p>
      </div>
      {daftar.length === 0 ? (
        <div className="tv-fav-empty">
          {"Belum ada favorit. Tekan bintang (\u2606) pada kartu fitur untuk menyematkannya di sini."}
        </div>
      ) : (
        <div className="tv-fav-list">
          {daftar.map((f) => (
            <div key={f.href} className="tv-fav-item">
              <Link href={f.href} className="tv-fav-main">
                <span className="tv-fav-ico" aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <SidebarIcon slug={f.slug} size={34} />
                </span>
                <span className="tv-fav-text">
                  <span className="tv-fav-title">{f.label}</span>
                  <span className="tv-fav-sub">{f.desc}</span>
                </span>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="tv-tool-tooltip-wrapper">
                  <button
                    type="button"
                    className="tv-tool-info-btn"
                    aria-label={"Informasi fungsi " + f.label}
                  >
                    i
                  </button>
                  <div className="tv-tool-tooltip-box" role="tooltip">
                    <div className="tv-tool-tooltip-head">
                      <span>ⓘ</span>
                      <span>Fungsi {f.label}</span>
                    </div>
                    <div>{f.detail}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="tv-fav-del"
                  aria-label={"Hapus " + f.label + " dari favorit"}
                  title="Hapus dari favorit"
                  onClick={() => hapusFavorit(f.href)}
                >
                  {"\u2715"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
