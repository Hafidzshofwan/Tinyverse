"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useAuth } from "@/widgets/user-account";

interface LangkahTur {
  id: string;
  /** id elemen DOM yang disorot, atau null untuk kartu di tengah layar. */
  targetId: string | null;
  /** Set true jika target hanya terlihat setelah sidebar dibuka (mobile). */
  perluSidebarTerbuka?: boolean;
  emoji: string;
  judul: string;
  deskripsi: string;
}

const LANGKAH: LangkahTur[] = [
  {
    id: "selamat-datang",
    targetId: null,
    emoji: "\u{1F44B}",
    judul: "Selamat datang di Tinyverse!",
    deskripsi:
      "Senang Anda bergabung. Yuk, kenalan singkat dengan bagian-bagian penting supaya Anda langsung nyaman memakainya. Tur ini kurang dari satu menit.",
  },
  {
    id: "sidebar",
    targetId: "tvTourSidebar",
    perluSidebarTerbuka: true,
    emoji: "\u{1F9ED}",
    judul: "Semua alat klinis, rapi di sini",
    deskripsi:
      "Menu di samping ini mengelompokkan semua kalkulator dan alat bantu: Darurat, Kalkulator Klinis, Tumbuh Kembang, Diagnostik, Neonatus, sampai Referensi.",
  },
  {
    id: "pencarian",
    targetId: "tvTourSearch",
    emoji: "\u{1F50D}",
    judul: "Bingung cari menu apa?",
    deskripsi:
      "Ketik nama alat, gejala, atau istilah di kotak pencarian ini. Tinyverse langsung menampilkan alat paling cocok tanpa perlu menyusuri menu satu per satu.",
  },
  {
    id: "pasien",
    targetId: "tvPasienFab",
    emoji: "\u{1FA7A}",
    judul: "Simpan data pasien yang sedang ditangani",
    deskripsi:
      "Klik tombol ini untuk mencatat profil pasien bangsal. Kalkulator lain (dosis obat, cairan, dll.) otomatis memakai berat badan dan usianya tanpa mengetik ulang.",
  },
  {
    id: "asisten-ai",
    targetId: "tvAiFab",
    emoji: "\u{1F916}",
    judul: "Asisten AI siap membantu",
    deskripsi:
      "Punya pertanyaan klinis mendadak? Tanyakan ke Asisten AI Tinyverse di sini -- dari dosis obat, interpretasi hasil, sampai panduan tata laksana.",
  },
  {
    id: "user-menu",
    targetId: "tvTourUserMenu",
    emoji: "\u2699\uFE0F",
    judul: "Profil & pengaturan akun Anda",
    deskripsi:
      "Kelola profil, kop surat cetak PDF, langganan, dan tema gelap/terang di sini. Anda juga bisa membuka tur ini lagi kapan saja lewat menu ini.",
  },
  {
    id: "selesai",
    targetId: null,
    emoji: "\u{1F389}",
    judul: "Siap dipakai!",
    deskripsi:
      "Semua siap. Selamat bekerja, semoga Tinyverse membantu memperlancar tugas klinis Anda sehari-hari.",
  },
];

interface RectTarget {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PERCOBAAN_UKUR = 6;
const JEDA_UKUR_MS = 220;
const LEBAR_KARTU = 340;

/**
 * Tur pengenalan fitur untuk pengguna baru (spotlight + kartu mengambang).
 *
 * Dipasang sekali di AppShell untuk seluruh aplikasi. Tidak melakukan apa pun
 * secara visual sampai dipicu -- baik otomatis (akun baru saja dibuat &
 * belum pernah menandai tur selesai) maupun manual ("Mulai tur fitur" di
 * menu pengguna, lewat event window "tv-mulai-tur").
 */
export function OnboardingTour() {
  const { profil, akunBaru, simpanPref } = useAuth();
  const [langkahAktif, setLangkahAktif] = useState(-1);
  const [rect, setRect] = useState<RectTarget | null>(null);
  const [siapTampil, setSiapTampil] = useState(false);
  const sudahAutoRef = useRef(false);

  const tutupTur = useCallback(
    (tandaiSelesai: boolean) => {
      setLangkahAktif(-1);
      setRect(null);
      setSiapTampil(false);
      if (tandaiSelesai) {
        simpanPref({ tourSelesai: true }).catch(() => {});
      }
    },
    [simpanPref],
  );

  // Pemicu otomatis: hanya akun yang baru saja dibuat pada sesi ini, dan
  // belum pernah menandai tur selesai sebelumnya (mis. pengguna lama yang
  // baru masuk lagi tidak akan diganggu).
  useEffect(() => {
    if (sudahAutoRef.current) return;
    if (!akunBaru || !profil) return;
    if (profil.preferensi?.tourSelesai) return;
    sudahAutoRef.current = true;
    const t = setTimeout(() => setLangkahAktif(0), 900);
    return () => clearTimeout(t);
  }, [akunBaru, profil]);

  // Pemicu manual dari menu pengguna ("Mulai tur fitur").
  useEffect(() => {
    function onMulai() {
      setLangkahAktif(0);
    }
    window.addEventListener("tv-mulai-tur", onMulai);
    return () => window.removeEventListener("tv-mulai-tur", onMulai);
  }, []);

  // Hitung ulang posisi target setiap kali langkah berganti.
  useEffect(() => {
    if (langkahAktif < 0) return;
    const langkahDipilih = LANGKAH[langkahAktif];
    if (!langkahDipilih) return;
    // Alias baru dengan tipe yang sudah pasti (bukan `LangkahTur | undefined`):
    // TypeScript tidak mempertahankan penyempitan tipe dari `if (!x) return`
    // ke dalam fungsi bersarang di bawah ini, jadi harus dibuatkan binding
    // baru yang tipenya sudah tetap sejak awal dideklarasikan.
    const langkah: LangkahTur = langkahDipilih;

    let batal = false;
    setSiapTampil(false);

    function ambilRect(id: string): RectTarget | null {
      const elemen = document.getElementById(id);
      if (!elemen) return null;
      const r = elemen.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    }

    function ukur(sisaPercobaan: number) {
      if (batal) return;
      if (!langkah.targetId) {
        setRect(null);
        setSiapTampil(true);
        return;
      }
      const r = ambilRect(langkah.targetId);
      if (!r) {
        if (sisaPercobaan > 0) {
          setTimeout(() => ukur(sisaPercobaan - 1), JEDA_UKUR_MS);
        } else {
          // Target tak ditemukan (mis. tata letak layar sangat sempit) --
          // lewati langkah ini daripada menampilkan sorotan yang salah tempat.
          setLangkahAktif((i) =>
            i < LANGKAH.length - 1 ? i + 1 : -1,
          );
        }
        return;
      }
      setRect(r);
      setSiapTampil(true);
    }

    if (langkah.perluSidebarTerbuka) {
      window.dispatchEvent(new Event("tv-tour-buka-sidebar"));
      setTimeout(() => ukur(PERCOBAAN_UKUR), JEDA_UKUR_MS);
    } else {
      ukur(PERCOBAAN_UKUR);
    }

    function onGeser() {
      if (!langkah.targetId) return;
      const r = ambilRect(langkah.targetId);
      if (r) setRect(r);
    }
    window.addEventListener("resize", onGeser);
    window.addEventListener("scroll", onGeser, true);
    return () => {
      batal = true;
      window.removeEventListener("resize", onGeser);
      window.removeEventListener("scroll", onGeser, true);
    };
  }, [langkahAktif]);

  // Kunci gulir halaman selama tur aktif, sama seperti drawer/modal lain.
  useEffect(() => {
    if (langkahAktif < 0) return;
    document.body.classList.add("tv-tour-aktif");
    return () => document.body.classList.remove("tv-tour-aktif");
  }, [langkahAktif]);

  if (langkahAktif < 0) return null;
  const langkah = LANGKAH[langkahAktif];
  if (!langkah) return null;

  const langkahPertama = langkahAktif === 0;
  const langkahTerakhir = langkahAktif === LANGKAH.length - 1;
  const tengah = !langkah.targetId;

  let kartuStyle: CSSProperties;
  if (tengah || !rect) {
    kartuStyle = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  } else {
    const margin = 16;
    const ruangBawah = window.innerHeight - (rect.top + rect.height);
    const diBawah = ruangBawah > 240 || rect.top < 240;
    let kiri = rect.left + rect.width / 2 - LEBAR_KARTU / 2;
    kiri = Math.max(
      margin,
      Math.min(kiri, window.innerWidth - LEBAR_KARTU - margin),
    );
    kartuStyle = diBawah
      ? { top: Math.min(rect.top + rect.height + 18, window.innerHeight - 24), left: kiri }
      : { top: Math.max(margin, rect.top - 18), left: kiri, transform: "translateY(-100%)" };
  }

  return (
    <div
      className={"tv-tour-lapisan" + (siapTampil ? " tampil" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Tur pengenalan fitur Tinyverse"
    >
      {rect ? (
        <div
          className="tv-tour-sorotan"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      ) : (
        <div className="tv-tour-latar" />
      )}
      <div
        className={"tv-tour-kartu" + (tengah ? " tengah" : "")}
        style={kartuStyle}
      >
        <div className="tv-tour-progres" aria-hidden>
          {LANGKAH.map((l, i) => (
            <span
              key={l.id}
              className={
                "tv-tour-titik" +
                (i === langkahAktif ? " aktif" : i < langkahAktif ? " lewat" : "")
              }
            />
          ))}
        </div>
        <div className="tv-tour-emoji" aria-hidden>
          {langkah.emoji}
        </div>
        <h3 className="tv-tour-judul">{langkah.judul}</h3>
        <p className="tv-tour-deskripsi">{langkah.deskripsi}</p>
        <div className="tv-tour-aksi">
          {langkahTerakhir ? (
            <span />
          ) : (
            <button
              type="button"
              className="tv-tour-lewati"
              onClick={() => tutupTur(true)}
            >
              Lewati tur
            </button>
          )}
          <div className="tv-tour-nav">
            {!langkahPertama && !langkahTerakhir && (
              <button
                type="button"
                className="tv-tour-btn tv-tour-btn-ghost"
                onClick={() => setLangkahAktif((i) => Math.max(0, i - 1))}
              >
                Kembali
              </button>
            )}
            <button
              type="button"
              className="tv-tour-btn tv-tour-btn-utama"
              onClick={() => {
                if (langkahTerakhir) {
                  tutupTur(true);
                } else {
                  setLangkahAktif((i) => i + 1);
                }
              }}
            >
              {langkahPertama ? "Mulai" : langkahTerakhir ? "Selesai" : "Lanjut"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
