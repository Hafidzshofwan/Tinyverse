"use client";

import Link from "next/link";
import { FITUR_TERSEDIA, type FiturMeta } from "@/widgets/app-shell/nav-config";
import { useFavorit, hapusFavorit } from "@/shared/lib/personalisasi";

/**
 * Daftar "Favorit Saya". Sepenuhnya ditentukan user: fitur ditambahkan lewat
 * tombol bintang di kartu Quick Access, dan dapat dihapus lewat tombol di sini.
 */
export function HomeFavorites() {
  const favorit = useFavorit();

  const daftar = favorit
    .map((href) => FITUR_TERSEDIA.find((f) => f.href === href))
    .filter((f): f is FiturMeta => Boolean(f));

  return (
    <section className="tv-card tv-stack">
      <div className="tv-home-section-head">
        <h2>
          <span aria-hidden>{"\u2B50"}</span> Favorit Saya
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
                <span className="tv-fav-ico" aria-hidden>
                  {f.icon}
                </span>
                <span className="tv-fav-text">
                  <span className="tv-fav-title">{f.label}</span>
                  <span className="tv-fav-sub">{f.desc}</span>
                </span>
              </Link>
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
          ))}
        </div>
      )}
    </section>
  );
}
