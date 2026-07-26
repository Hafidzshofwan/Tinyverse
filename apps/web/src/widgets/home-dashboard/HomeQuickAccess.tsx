"use client";

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
  const pemakaian = usePemakaian();
  const favorit = useFavorit();

  const daftar = FITUR_TERSEDIA.map((f, i) => ({
    f,
    i,
    hitung: pemakaian[f.href] ?? 0,
  }))
    .sort((a, b) => b.hitung - a.hitung || a.i - b.i)
    .slice(0, JUMLAH_TAMPIL)
    .map((x) => x.f);

  const adaData = Object.keys(pemakaian).length > 0;

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
        {daftar.map((item) => {
          const fav = favorit.includes(item.href);
          return (
            <div key={item.href} className="tv-tool-card">
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
