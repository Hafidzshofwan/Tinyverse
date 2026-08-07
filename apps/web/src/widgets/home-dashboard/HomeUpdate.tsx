"use client";

import Link from "next/link";
import { FITUR_TERSEDIA } from "@/widgets/app-shell/nav-config";
import { SidebarIcon } from "@/shared/ui";

/**
 * Kartu "Update Tinyverse" beranda: daftar fitur yang baru rilis. Sumber
 * datanya SAMA dengan badge "Baru" di Quick Access (lihat FITUR_BARU pada
 * widgets/app-shell/nav-config.ts) supaya keduanya tidak pernah tidak sinkron.
 */
export function HomeUpdate() {
  const daftar = FITUR_TERSEDIA.filter((f) => f.baru);

  return (
    <section className="tv-card tv-stack tv-update-card">
      <div className="tv-home-section-head">
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden style={{ display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v6m0 0l3-3m-3 3L9 5M4 13a8 8 0 1 0 16 0"
                stroke="#0284C7"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Update Tinyverse</span>
        </h2>
        <p>Fitur yang baru rilis di Tinyverse.</p>
      </div>
      {daftar.length === 0 ? (
        <p className="tv-insight-note">Belum ada update baru saat ini.</p>
      ) : (
        <ul className="tv-update-list">
          {daftar.map((f) => (
            <li key={f.href}>
              <span aria-hidden style={{ display: "inline-flex", flexShrink: 0 }}>
                <SidebarIcon slug={f.slug} size={20} />
              </span>
              <span>
                <Link href={f.href} style={{ color: "inherit", textDecoration: "none" }}>
                  <strong>{f.label}</strong>
                </Link>
                {" \u2014 " + f.desc}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
