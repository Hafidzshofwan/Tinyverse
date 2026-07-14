"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "./nav-config";
import { NavLinks } from "./NavLinks";
import { GlobalSearch } from "./GlobalSearch";
import { PatientProfile } from "@/widgets/patient-profile";
import { AuthProvider, AuthScreen, UserMenu, useAuth } from "@/widgets/user-account";
import { Logo } from "./Logo";
import { catatPemakaian } from "@/shared/lib/personalisasi";

export interface AppShellProps {
  children: ReactNode;
}

const STORAGE_KEY = "tv-sidebar-open";

// Peta href -> label menu untuk mencatat riwayat "Buka Fitur" (seperti v17).
const LABEL_BY_HREF: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const g of NAV_GROUPS) for (const it of g.items) m[it.href] = it.label;
  return m;
})();

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <AppShellInner>{children}</AppShellInner>
    </AuthProvider>
  );
}

function AppShellInner({ children }: AppShellProps) {
  const { status, catatRiwayat } = useAuth();
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const riwayatTerakhir = useRef<string>("");

  // Ingat kondisi buka/tutup sidebar antar kunjungan (di browser).
  useEffect(() => {
    // Di mobile, mulai dengan sidebar tertutup agar konten tidak tertutup drawer.
    if (window.matchMedia("(max-width: 900px)").matches) {
      setOpen(false);
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setOpen(saved === "1");
  }, []);
  useEffect(() => {
    // Simpan preferensi buka/tutup hanya di layar besar (tidak mengganggu desktop).
    if (window.matchMedia("(max-width: 900px)").matches) return;
    window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  }, [open]);
  // Tutup drawer otomatis setiap pindah halaman di mobile.
  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) setOpen(false);
  }, [pathname]);

  // Catat riwayat saat membuka salah satu menu (hanya ketika sudah login).
  useEffect(() => {
    if (status !== "signedIn" || !pathname) return;
    const label = LABEL_BY_HREF[pathname];
    if (!label) return;
    if (riwayatTerakhir.current === pathname) return;
    riwayatTerakhir.current = pathname;
    // Catat pemakaian fitur (dasar urutan Quick Access), selain Beranda.
    if (pathname !== "/") catatPemakaian(pathname);
    catatRiwayat("Buka Fitur", label, "Dibuka dari navigasi");
  }, [pathname, status, catatRiwayat]);

  // Deep-link: island mengirim posisi elemen tujuan; gulir halaman induk ke
  // sana (dikurangi tinggi header agar tidak tertutup).
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data as { __tkScrollTo?: number } | null;
      if (d && typeof d.__tkScrollTo === "number") {
        const frame = document.querySelector(
          "iframe",
        ) as HTMLIFrameElement | null;
        const base = frame
          ? frame.getBoundingClientRect().top + window.scrollY
          : 0;
        window.scrollTo({
          top: Math.max(0, base + d.__tkScrollTo - 90),
          behavior: "smooth",
        });
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const kelasShell = useMemo(
    () => (open ? "tv-shell" : "tv-shell tv-shell-collapsed"),
    [open],
  );

  // Wajib login: sebelum berhasil masuk, tampilkan layar login/daftar penuh.
  if (status !== "signedIn") {
    return <AuthScreen />;
  }

  return (
    <div className={kelasShell}>
      <header className="tv-topbar">
        <button
          type="button"
          className="tv-hamburger"
          aria-label="Buka atau tutup menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden>{"\u2630"}</span>
        </button>
        <Link href="/" className="tv-brand">
          <Logo />
          Tinyverse
        </Link>
        <GlobalSearch />
        <UserMenu />
      </header>
      <div className="tv-body">
        <div
          className="tv-backdrop"
          aria-hidden
          onClick={() => setOpen(false)}
        />
        <aside className="tv-sidebar">
          <NavLinks groups={NAV_GROUPS} />
        </aside>
        <main className="tv-main">
          <div className="tv-main-inner">{children}</div>
        </main>
      </div>
      <footer className="tv-footer">
        <div className="tv-footer-inner">
          <div className="tv-footer-brand">
            <Logo size={24} />
            <div>
              <div className="tv-footer-name">Tinyverse</div>
              <div className="tv-footer-cap">
                Alat bantu klinis pediatri, bukan pengganti penilaian klinis.
              </div>
            </div>
          </div>
          <div className="tv-footer-maker">
            <span>
              Dibuat oleh <strong>M. Hafidzuddin Shofwan</strong>
            </span>
            <span className="tv-footer-year">{"\u00A9"} 2026 Tinyverse</span>
          </div>
        </div>
      </footer>
      <PatientProfile />
    </div>
  );
}
