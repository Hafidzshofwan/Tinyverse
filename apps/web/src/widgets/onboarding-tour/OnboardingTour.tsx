"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ComponentType, CSSProperties } from "react";
import { useAuth } from "@/widgets/user-account";

type PropsIkon = { size?: number };

function IkonSambut({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11.5V6a2 2 0 0 0-4 0v4" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v9" />
      <path d="M18 8.5a2 2 0 1 1 4 0V15a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.2-3.2a2 2 0 0 1 2.83-2.82L8 16" />
    </svg>
  );
}

function IkonSidebar({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <line x1="9.5" y1="3" x2="9.5" y2="21" />
      <line x1="5.5" y1="7" x2="6.8" y2="7" />
      <line x1="5.5" y1="11" x2="6.8" y2="11" />
      <line x1="5.5" y1="15" x2="6.8" y2="15" />
    </svg>
  );
}

function IkonCari({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7.5" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  );
}

function IkonPasien({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2.5" width="8" height="4" rx="1" />
      <path d="M9 4.5H6.5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2H15" />
      <path d="M9 13.5h6" />
      <path d="M12 10.5v6" />
    </svg>
  );
}

function IkonAsisten({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4.5H9" />
      <rect x="4" y="8" width="16" height="12" rx="2.5" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M9 13v2.2" />
      <path d="M15 13v2.2" />
    </svg>
  );
}

function IkonPengaturan({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 13.09H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function IkonSelesai({ size = 26 }: PropsIkon) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

interface LangkahTur {
  id: string;
  /** id elemen DOM yang disorot, atau null untuk kartu di tengah layar. */
  targetId: string | null;
  /** Set true jika target hanya terlihat setelah sidebar dibuka (mobile). */
  perluSidebarTerbuka?: boolean;
  Ikon: ComponentType<PropsIkon>;
  judul: string;
  deskripsi: string;
}

const LANGKAH: LangkahTur[] = [
  {
    id: "selamat-datang",
    targetId: null,
    Ikon: IkonSambut,
    judul: "Selamat datang di Tinyverse!",
    deskripsi:
      "Senang Anda bergabung. Yuk, kenalan singkat dengan bagian-bagian penting supaya Anda langsung nyaman memakainya. Tur ini kurang dari satu menit.",
  },
  {
    id: "sidebar",
    targetId: "tvTourSidebar",
    perluSidebarTerbuka: true,
    Ikon: IkonSidebar,
    judul: "Semua alat klinis, rapi di sini",
    deskripsi:
      "Menu di samping ini mengelompokkan semua kalkulator dan alat bantu: Darurat, Kalkulator Klinis, Tumbuh Kembang, Diagnostik, Neonatus, sampai Referensi.",
  },
  {
    id: "pencarian",
    targetId: "tvTourSearch",
    Ikon: IkonCari,
    judul: "Bingung cari menu apa?",
    deskripsi:
      "Ketik nama alat, gejala, atau istilah di kotak pencarian ini. Tinyverse langsung menampilkan alat paling cocok tanpa perlu menyusuri menu satu per satu.",
  },
  {
    id: "pasien",
    targetId: "tvPasienFab",
    Ikon: IkonPasien,
    judul: "Simpan data pasien yang sedang ditangani",
    deskripsi:
      "Klik tombol ini untuk mencatat profil pasien bangsal. Kalkulator lain (dosis obat, cairan, dll.) otomatis memakai berat badan dan usianya tanpa mengetik ulang.",
  },
  {
    id: "asisten-ai",
    targetId: "tvAiFab",
    Ikon: IkonAsisten,
    judul: "Asisten AI siap membantu",
    deskripsi:
      "Punya pertanyaan klinis mendadak? Tanyakan ke Asisten AI Tinyverse di sini -- dari dosis obat, interpretasi hasil, sampai panduan tata laksana.",
  },
  {
    id: "user-menu",
    targetId: "tvTourUserMenu",
    Ikon: IkonPengaturan,
    judul: "Profil & pengaturan akun Anda",
    deskripsi:
      "Kelola profil, kop surat cetak PDF, langganan, dan tema gelap/terang di sini. Anda juga bisa membuka tur ini lagi kapan saja lewat menu ini.",
  },
  {
    id: "selesai",
    targetId: null,
    Ikon: IkonSelesai,
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
const LEBAR_KARTU_TENGAH = 380;
const MARGIN_LAYAR = 16;

function jepit(nilai: number, min: number, maks: number): number {
  if (maks < min) return min;
  return Math.max(min, Math.min(nilai, maks));
}

/**
 * Menentukan posisi kartu relatif terhadap target yang disorot.
 *
 * Target "besar" (mis. sidebar yang tingginya hampir sepenuh layar) tidak
 * punya ruang "di atas" atau "di bawah" yang berarti -- menaruh kartu di
 * bawah target seperti itu akan mendorongnya ke luar layar. Untuk target
 * semacam ini, kartu ditaruh di sisi yang lebih lapang (kanan/kiri), atau
 * sebagai lembar mengambang di bagian bawah layar kalau tidak ada ruang di
 * samping sama sekali (mis. drawer selebar layar di HP).
 */
function hitungPosisiKartu(
  rect: RectTarget,
  lebarKartu: number,
  tinggiKartu: number,
): { top: number; left: number } {
  const lebarLayar = window.innerWidth;
  const tinggiLayar = window.innerHeight;
  const targetTinggiPenuh = rect.height > tinggiLayar * 0.55;
  const targetLebarPenuh = rect.width > lebarLayar * 0.55;
  const ruangKanan = lebarLayar - (rect.left + rect.width);
  const ruangKiri = rect.left;
  const cukupUntukSamping =
    Math.max(ruangKanan, ruangKiri) >= lebarKartu + MARGIN_LAYAR * 2;

  let top: number;
  let left: number;

  if ((targetTinggiPenuh || targetLebarPenuh) && cukupUntukSamping) {
    const diKanan = ruangKanan >= ruangKiri;
    left = diKanan
      ? rect.left + rect.width + MARGIN_LAYAR
      : rect.left - MARGIN_LAYAR - lebarKartu;
    top = rect.top + rect.height / 2 - tinggiKartu / 2;
  } else if (targetTinggiPenuh || targetLebarPenuh) {
    // Tak ada ruang di samping (mis. drawer mobile selebar layar) -- taruh
    // kartu sebagai lembar mengambang di bagian bawah layar.
    top = tinggiLayar - tinggiKartu - MARGIN_LAYAR;
    left = (lebarLayar - lebarKartu) / 2;
  } else {
    const ruangBawah = tinggiLayar - (rect.top + rect.height);
    const diBawah =
      ruangBawah > tinggiKartu + MARGIN_LAYAR || rect.top < tinggiKartu + MARGIN_LAYAR;
    left = rect.left + rect.width / 2 - lebarKartu / 2;
    top = diBawah
      ? rect.top + rect.height + 18
      : rect.top - 18 - tinggiKartu;
  }

  return {
    top: jepit(top, MARGIN_LAYAR, tinggiLayar - tinggiKartu - MARGIN_LAYAR),
    left: jepit(left, MARGIN_LAYAR, lebarLayar - lebarKartu - MARGIN_LAYAR),
  };
}

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
  const kartuRef = useRef<HTMLDivElement>(null);
  const tinggiKartuRef = useRef(230);
  const [koreksi, setKoreksi] = useState<{
    untukLangkah: number;
    top: number;
    left: number;
  } | null>(null);

  const tutupTur = useCallback(
    (tandaiSelesai: boolean) => {
      setLangkahAktif(-1);
      setRect(null);
      setSiapTampil(false);
      setKoreksi(null);
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

  // Hitung ulang posisi target setiap kali langkah berganti, lalu lacak terus
  // menerus selama langkah itu aktif.
  //
  // WHY dilacak tiap frame (bukan hanya lewat event "resize"/"scroll"): posisi
  // tombol yang disorot bisa berubah karena banyak hal yang TIDAK selalu
  // memicu event tersebut secara konsisten di semua browser -- zoom halaman
  // desktop (mis. 50%/75%/90%), pinch-zoom di HP, rotasi layar, animasi buka
  // sidebar, atau elemen yang baru selesai memuat font/gambar. Mengukur ulang
  // tiap frame lewat requestAnimationFrame membuat sorotan SELALU mengikuti
  // posisi asli elemen saat ini, pada ukuran layar/zoom/perangkat apa pun,
  // tanpa perlu menebak event mana saja yang mesti didengarkan.
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
    let idFrame: number | null = null;
    setSiapTampil(false);

    function ambilRect(id: string): RectTarget | null {
      const elemen = document.getElementById(id);
      if (!elemen) return null;
      const r = elemen.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    }

    // Ambang 0.5px: hindari memperbarui state karena pembulatan subpiksel
    // yang tidak kasatmata, supaya tidak me-render ulang tiap frame saat
    // posisi sebenarnya sedang diam.
    function berubahBerarti(a: RectTarget | null, b: RectTarget | null): boolean {
      if (!a || !b) return a !== b;
      return (
        Math.abs(a.top - b.top) > 0.5 ||
        Math.abs(a.left - b.left) > 0.5 ||
        Math.abs(a.width - b.width) > 0.5 ||
        Math.abs(a.height - b.height) > 0.5
      );
    }

    function lacakTerus() {
      if (batal || !langkah.targetId) return;
      const r = ambilRect(langkah.targetId);
      setRect((sebelumnya) => (berubahBerarti(sebelumnya, r) ? r : sebelumnya));
      idFrame = requestAnimationFrame(lacakTerus);
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
      // Target ditemukan -- mulai lacak posisinya tiap frame selama langkah
      // ini masih aktif (dihentikan oleh cleanup di bawah).
      idFrame = requestAnimationFrame(lacakTerus);
    }

    if (langkah.perluSidebarTerbuka) {
      window.dispatchEvent(new Event("tv-tour-buka-sidebar"));
      // Sidebar mobile/tablet biasanya butuh waktu untuk animasi buka penuh
      // sebelum ukurannya stabil -- ukur beberapa kali dengan jeda supaya
      // tidak menangkap ukuran di tengah animasi (kotak sorotan jadi kecil
      // dan salah tempat).
      setTimeout(() => ukur(PERCOBAAN_UKUR), JEDA_UKUR_MS * 2);
    } else {
      ukur(PERCOBAAN_UKUR);
    }

    return () => {
      batal = true;
      if (idFrame !== null) cancelAnimationFrame(idFrame);
    };
  }, [langkahAktif]);

  // Pastikan kartu selalu sepenuhnya terlihat di layar, berapa pun ukuran
  // kontennya dan berapa pun ukuran/posisi target yang disorot (termasuk
  // target setinggi layar seperti sidebar, dan layar sempit di HP). Dijalankan
  // sebelum browser menggambar ulang supaya tidak ada kedipan posisi yang
  // terlihat pengguna.
  useLayoutEffect(() => {
    if (langkahAktif < 0) return;

    function ukurDanKoreksi() {
      const elemen = kartuRef.current;
      if (!elemen) return;
      const r = elemen.getBoundingClientRect();
      tinggiKartuRef.current = r.height;
      let top = r.top;
      let left = r.left;
      let ubah = false;
      if (r.bottom > window.innerHeight - MARGIN_LAYAR) {
        top -= r.bottom - (window.innerHeight - MARGIN_LAYAR);
        ubah = true;
      }
      if (top < MARGIN_LAYAR) {
        top = MARGIN_LAYAR;
        ubah = true;
      }
      if (r.right > window.innerWidth - MARGIN_LAYAR) {
        left -= r.right - (window.innerWidth - MARGIN_LAYAR);
        ubah = true;
      }
      if (left < MARGIN_LAYAR) {
        left = MARGIN_LAYAR;
        ubah = true;
      }
      setKoreksi((sebelumnya) => {
        if (ubah) return { untukLangkah: langkahAktif, top, left };
        if (sebelumnya && sebelumnya.untukLangkah === langkahAktif) return null;
        return sebelumnya;
      });
    }

    ukurDanKoreksi();
    window.addEventListener("resize", ukurDanKoreksi);
    return () => window.removeEventListener("resize", ukurDanKoreksi);
  }, [langkahAktif, rect, siapTampil]);

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
  const tinggiPerkiraan = tinggiKartuRef.current;

  let kartuStyle: CSSProperties;
  if (tengah || !rect) {
    const lebarKartu = Math.min(LEBAR_KARTU_TENGAH, window.innerWidth - MARGIN_LAYAR * 2);
    kartuStyle = {
      top: jepit(
        (window.innerHeight - tinggiPerkiraan) / 2,
        MARGIN_LAYAR,
        window.innerHeight - tinggiPerkiraan - MARGIN_LAYAR,
      ),
      left: jepit(
        (window.innerWidth - lebarKartu) / 2,
        MARGIN_LAYAR,
        window.innerWidth - lebarKartu - MARGIN_LAYAR,
      ),
    };
  } else {
    const lebarKartu = Math.min(LEBAR_KARTU, window.innerWidth - MARGIN_LAYAR * 2);
    kartuStyle = hitungPosisiKartu(rect, lebarKartu, tinggiPerkiraan);
  }

  if (koreksi && koreksi.untukLangkah === langkahAktif) {
    kartuStyle = { ...kartuStyle, top: koreksi.top, left: koreksi.left };
  }

  const Ikon = langkah.Ikon;

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
        ref={kartuRef}
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
        <div className="tv-tour-ikon" aria-hidden>
          <Ikon size={26} />
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
