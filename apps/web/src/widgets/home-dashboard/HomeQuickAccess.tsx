"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FITUR_TERSEDIA } from "@/widgets/app-shell/nav-config";
import { usePemakaian, useFavorit, toggleFavorit } from "@/shared/lib/personalisasi";
import { SidebarIcon } from "@/shared/ui";

const JUMLAH_TAMPIL = 6;

/**
 * Quick Access beranda. Urutan kartu ditentukan SISTEM: fitur yang paling
 * sering dibuka user berada paling depan (data dari shared/lib/personalisasi).
 * Sumber daftarnya adalah fitur asli di menu (FITUR_TERSEDIA), sehingga tidak
 * ada lagi halaman review lepasan seperti GCS/AGD di sini.
 */
export function HomeQuickAccess() {
  const [isMounted, setIsMounted] = useState(false);
  const pemakaian = usePemakaian();
  const favorit = useFavorit();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const daftar = FITUR_TERSEDIA.map((f, i) => ({
    f,
    i,
    hitung: pemakaian[f.href] ?? 0,
  }))
    .sort((a, b) => b.hitung - a.hitung || a.i - b.i)
    .slice(0, JUMLAH_TAMPIL)
    .map((x) => x.f);

  const adaData = Object.keys(pemakaian).length > 0;

  if (!isMounted) {
    return (
      <section className="tv-home-section">
        <div className="tv-home-section-head">
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span aria-hidden style={{ display: "inline-flex" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Quick Access</span>
          </h2>
          <p>Memuat preferensi dan urutan fitur...</p>
        </div>
        <div className="tv-grid">
          {Array.from({ length: JUMLAH_TAMPIL }).map((_, idx) => (
            <div key={idx} className="tv-tool-card-skeleton">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span className="tv-skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
                <span className="tv-skeleton" style={{ width: 22, height: 22, borderRadius: "50%" }} />
              </div>
              <span className="tv-skeleton" style={{ width: "65%", height: 18, borderRadius: 6, marginTop: 4 }} />
              <span className="tv-skeleton" style={{ width: "95%", height: 13, borderRadius: 4 }} />
              <span className="tv-skeleton" style={{ width: "80%", height: 13, borderRadius: 4 }} />
              <span className="tv-skeleton" style={{ width: "35%", height: 15, borderRadius: 4, marginTop: 6 }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="tv-home-section">
      <div className="tv-home-section-head">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden style={{ display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Quick Access</span>
        </h2>
        <p>
          {adaData
            ? "Urutan otomatis mengikuti fitur yang paling sering kamu buka."
            : "Fitur inti; urutannya akan menyesuaikan otomatis dengan yang paling sering kamu buka."}
        </p>
      </div>
      <div className="tv-grid">
        {daftar.map((item, index) => {
          const fav = favorit.includes(item.href);
          return (
            <div
              key={item.href}
              className="tv-tool-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="tv-tool-actions">
                <div className="tv-tool-tooltip-wrapper">
                  <button
                    type="button"
                    className="tv-tool-info-btn"
                    aria-label={"Informasi fungsi " + item.label}
                  >
                    i
                  </button>
                  <div className="tv-tool-tooltip-box" role="tooltip">
                    <div className="tv-tool-tooltip-head">
                      <span>ⓘ</span>
                      <span>Fungsi {item.label}</span>
                    </div>
                    <div>{item.detail}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className={"tv-tool-star" + (fav ? " aktif" : "")}
                  aria-pressed={fav}
                  aria-label={fav ? "Hapus dari favorit" : "Tambahkan ke favorit"}
                  title={fav ? "Hapus dari favorit" : "Tambahkan ke favorit"}
                  onClick={() => toggleFavorit(item.href)}
                >
                  {fav ? "\u2605" : "\u2606"}
                </button>
              </div>
              <Link href={item.href} className="tv-tool-main">
                <span className="tv-tool-ico" aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <SidebarIcon slug={item.slug} size={38} />
                </span>
                <span className="tv-tool-name">{item.label}</span>
                <span className="tv-tool-desc">{item.desc}</span>
                <span className="tv-tool-go">{"Buka \u2192"}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
