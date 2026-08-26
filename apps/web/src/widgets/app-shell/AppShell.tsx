"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "./nav-config";
import { NavLinks } from "./NavLinks";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { PatientProfile } from "@/widgets/patient-profile";
import { AiAssistantWidget } from "@/widgets/ai-assistant";
import { AuthProvider, AuthScreen, VerifikasiEmailScreen, UserMenu, useAuth } from "@/widgets/user-account";
import { Logo } from "./Logo";
import { catatPemakaian } from "@/shared/lib/personalisasi";
import { LoadingAnimation, SectionErrorBoundary } from "@/shared/ui";
import { OnboardingTour } from "@/widgets/onboarding-tour";
import publik from "./publik.module.css";

export interface AppShellProps {
  children: ReactNode;
  /**
   * Slot JSX pengingat langganan, sudah dirakit + dibungkus <Suspense> oleh
   * layout akar (lihat widgets/app-shell/PengingatSlot.tsx).
   *
   * WHY berupa ReactNode siap-pakai, bukan lagi data mentah `Pengingat |
   * null`: AppShell adalah Client Component, sedangkan pengambilan datanya
   * (baca cookie sesi + Firestore) harus tetap di server DAN tidak boleh
   * memblokir render. React Server Component streaming mendukung pola ini --
   * Server Component boleh dioper sebagai children/prop ke Client Component,
   * asal tidak dibongkar isinya di sisi klien. AppShell cukup menaruhnya di
   * posisi yang tepat, tanpa perlu tahu apa isinya atau kapan datanya siap.
   */
  pengingatSlot?: ReactNode;
}

const STORAGE_KEY = "tv-sidebar-open";

/**
 * Rute yang boleh dilihat tanpa masuk.
 *
 * WHY: calon pelanggan -- dan peninjau pendaftaran merchant Midtrans -- harus
 * bisa melihat daftar paket beserta harganya, syarat & ketentuan, kebijakan
 * pengembalian dana, dan cara menghubungi kami sebelum membuat akun. Sebelum
 * ini seluruh situs hanya menampilkan layar masuk, sehingga tidak ada satu pun
 * harga maupun dokumen yang terlihat dari luar.
 *
 * Pencocokan sengaja PERSIS, bukan awalan. "/langganan/selesai" menampilkan
 * status pesanan milik seseorang, jadi tidak boleh ikut terbuka hanya karena
 * awalan jalurnya kebetulan sama. Setiap rute publik baru harus ditulis satu
 * per satu di sini, dan itu memang disengaja.
 *
 * Daftar ini hanya mengatur TAMPILAN. Gerbang berbayar /preview adalah Server
 * Component terpisah yang memutuskan sebelum HTML dikirim, dan sama sekali
 * tidak terpengaruh oleh daftar ini.
 */
const RUTE_PUBLIK: readonly string[] = [
  "/langganan",
  "/syarat-ketentuan",
  "/pengembalian-dana",
  "/kebijakan-privasi",
  "/kontak",
];

function rutePublik(pathname: string | null): boolean {
  if (!pathname) return false;
  return RUTE_PUBLIK.includes(pathname);
}

// Peta href -> label menu untuk mencatat riwayat "Buka Fitur" (seperti v17).
const LABEL_BY_HREF: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const g of NAV_GROUPS) for (const it of g.items) m[it.href] = it.label;
  return m;
})();

export function AppShell({ children, pengingatSlot }: AppShellProps) {
  return (
    <AuthProvider>
      <AppShellInner pengingatSlot={pengingatSlot}>{children}</AppShellInner>
    </AuthProvider>
  );
}

function AppShellInner({ children, pengingatSlot }: AppShellProps) {
  const { status, emailVerified, catatRiwayat } = useAuth();
  const [open, setOpen] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const riwayatTerakhir = useRef<string>("");
  const prevPathname = useRef<string>(pathname);

  // Efek transisi loading saat pengguna berpindah menu/halaman
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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

  // Tur onboarding perlu sidebar TERBUKA saat menyorotnya, termasuk di layar
  // sempit (mobile) yang defaultnya tertutup. Dikoordinasikan lewat event
  // custom, bukan prop, karena OnboardingTour dipasang di luar percabangan
  // render ini dan tidak punya akses langsung ke state `open`.
  useEffect(() => {
    function onBukaSidebar() {
      setOpen(true);
    }
    window.addEventListener("tv-tour-buka-sidebar", onBukaSidebar);
    return () =>
      window.removeEventListener("tv-tour-buka-sidebar", onBukaSidebar);
  }, []);

  const kelasShell = useMemo(
    () => (open ? "tv-shell" : "tv-shell tv-shell-collapsed"),
    [open],
  );

  /* Rute publik ditampilkan apa adanya, tanpa menunggu Firebase selesai
     memeriksa sesi. Menunggu hanya akan memunculkan pemuatan yang tidak perlu
     bagi pengunjung yang memang belum punya akun. Kerangka di bawah sengaja
     minimal: tanpa sidebar, tanpa menu pengguna, tanpa profil pasien, dan
     tanpa asisten AI -- semuanya menuntut pengguna yang sudah masuk. */
  if (status !== "signedIn" && rutePublik(pathname)) {
    return (
      <div className={publik.wrap}>
        <header className={publik.topbar}>
          <Link href="/" className="tv-brand">
            <Logo />
            <span className="tv-brand-txt">Tinyverse</span>
          </Link>
          <Link href="/" className={publik.masuk}>
            Masuk
          </Link>
        </header>
        <main className={publik.isi}>{children}</main>
        <footer className={publik.footer}>
          {/* Tautan dokumen wajib merchant. Ditaruh di kaki setiap halaman
              publik supaya peninjau menemukannya tanpa harus menebak alamat. */}
          <nav className={publik.kakiTautan}>
            <Link href="/langganan">Langganan</Link>
            <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
            <Link href="/pengembalian-dana">Pengembalian Dana</Link>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link href="/kontak">Kontak</Link>
          </nav>
          <div>Alat bantu klinis pediatri, bukan pengganti penilaian klinis.</div>
        </footer>
      </div>
    );
  }

  // Wajib login: sebelum berhasil masuk, tampilkan layar login/daftar penuh.
  if (status !== "signedIn") {
    if (status === "loading") {
      return (
        <LoadingAnimation
          fullScreen
          message="Memuat modul & sesi Tinyverse..."
        />
      );
    }
    return <AuthScreen />;
  }

  /*
   * Email belum diverifikasi: tampilkan layar verifikasi penuh.
   *
   * WHY di sini (bukan di AuthScreen atau dalam halaman tersendiri):
   * AuthScreen hanya tampil saat status !== "signedIn". Setelah daftar,
   * status langsung menjadi "signedIn" -- AuthScreen menghilang, dan tanpa
   * gerbang ini pengguna langsung masuk ke seluruh fitur tanpa pernah
   * mengklik tautan verifikasi.
   *
   * Akun Google dikecualikan secara otomatis: Google selalu menetapkan
   * emailVerified = true pada akun yang masuk lewat OAuth.
   */
  if (!emailVerified) {
    return <VerifikasiEmailScreen />;
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
          <span className="tv-brand-txt">Tinyverse</span>
        </Link>
        <SectionErrorBoundary label="Pencarian" variant="silent">
          <GlobalSearch id="tvTourSearch" />
        </SectionErrorBoundary>
        <SectionErrorBoundary label="Pengganti tema" variant="silent">
          <ThemeToggle />
        </SectionErrorBoundary>
        <SectionErrorBoundary label="Menu pengguna" variant="inline">
          <UserMenu id="tvTourUserMenu" />
        </SectionErrorBoundary>
      </header>
      {/* Tanpa prop variant: animasi perpindahan halaman harus memakai animasi
          yang dipilih pengguna, sama seperti layar pemuatan sesi. Sebelumnya
          baris ini memaksa satu varian, sehingga satu sesi bisa menampilkan dua
          animasi yang berbeda. */}
      {isNavigating && (
        <LoadingAnimation
          fullScreen
          message={`Memuat ${LABEL_BY_HREF[pathname] || "modul Tinyverse"}...`}
        />
      )}
      <div className="tv-body">
        <div
          className="tv-backdrop"
          aria-hidden
          onClick={() => setOpen(false)}
        />
        <aside className="tv-sidebar" id="tvTourSidebar">
          <SectionErrorBoundary label="Menu navigasi" variant="inline">
            <NavLinks groups={NAV_GROUPS} />
          </SectionErrorBoundary>
        </aside>
        <main className="tv-main">
          <div className="tv-main-inner">
            {/* Pengingat langganan sengaja di dalam tv-main-inner, sejajar isi
                halaman: ia ikut tergulung bersama konten dan tidak pernah
                menutupi header maupun hasil perhitungan alat klinis. */}
            {pengingatSlot}
            {children}
          </div>
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
      <SectionErrorBoundary label="Profil pasien" variant="inline">
        <PatientProfile />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="Asisten AI" variant="inline">
        <AiAssistantWidget />
      </SectionErrorBoundary>
      {/* Silent: tur onboarding adalah kenyamanan tambahan, bukan fitur inti --
          kalau ia gagal, pengguna tetap harus bisa memakai seluruh aplikasi. */}
      <SectionErrorBoundary label="Tur onboarding" variant="silent">
        <OnboardingTour />
      </SectionErrorBoundary>
    </div>
  );
}
