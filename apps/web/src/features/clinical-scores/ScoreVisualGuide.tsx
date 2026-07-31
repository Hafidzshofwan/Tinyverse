"use client";

import React from "react";

interface OptionIllustrationProps {
  scoreId: string;
  paramIndex: number;
  optionIndex: number;
}

/* ==========================================================================
   Primitif gambar bersama untuk New Ballard Score
   ==========================================================================
   Ilustrasi Ballard digambar ulang mengikuti bagan asli Ballard JL, Khoury JC,
   Wedig K, et al. J Pediatr 1991;119:417-423 - garis tunggal tanpa arsiran,
   kepala berupa lingkaran bertitik, badan berupa kapsul memanjang.

   WHY currentColor: bagan aslinya hitam-putih. Dengan mewarisi warna teks,
   garis ikut menyesuaikan mode terang dan gelap tanpa perlu satu pun aturan
   CSS tambahan. Warna aksen HANYA dipakai pada bagian yang sedang diukur,
   supaya mata pengguna langsung tertuju ke sana - itulah yang membedakan
   satu pilihan dari pilihan lain di kolom yang sama.

   WHY sudut dihitung dengan trigonometri, bukan koordinat tangan: Square
   Window dan Popliteal Angle adalah pengukuran sudut. Menuliskan koordinat
   secara manual membuat gambar 45 derajat tidak benar-benar 45 derajat, dan
   perawat yang membandingkan gambar dengan bayinya akan tersesat.
========================================================================== */

const AKSEN = "#0EA5E9";
const AKSEN_KUAT = "#10B981";

/** Bingkai SVG seragam untuk seluruh ilustrasi Ballard. */
const Kanvas: React.FC<{
  vb?: string;
  lebar?: number;
  children: React.ReactNode;
}> = ({ vb = "0 0 64 44", lebar = 56, children }) => (
  <div className="tv-opt-svg-wrapper">
    <svg
      viewBox={vb}
      width={lebar}
      height={38}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  </div>
);

/** Kepala bayi: lingkaran bertitik, konvensi bagan Ballard asli. */
const Kepala: React.FC<{ x: number; y: number; r?: number }> = ({
  x,
  y,
  r = 5,
}) => (
  <>
    <circle cx={x} cy={y} r={r} />
    <circle cx={x} cy={y} r={1.2} fill="currentColor" stroke="none" />
  </>
);

/** Label sudut atau ukuran. */
const Label: React.FC<{
  x: number;
  y: number;
  teks: string;
  warna?: string;
}> = ({ x, y, teks, warna = AKSEN }) => (
  <text
    x={x}
    y={y}
    fontSize={8.5}
    fontWeight={700}
    fill={warna}
    stroke="none"
    textAnchor="middle"
  >
    {teks}
  </text>
);

/** Membatasi indeks pilihan agar tidak pernah keluar dari larik gambar. */
function batas(i: number, maks: number): number {
  if (!Number.isFinite(i) || i < 0) return 0;
  return i > maks ? maks : i;
}

/**
 * Mengambil satu entri larik memakai indeks yang sudah dibatasi.
 *
 * WHY: tsconfig repo menyalakan noUncheckedIndexedAccess, sehingga SETIAP
 * pembacaan `larik[i]` bertipe `T | undefined` dan menggagalkan build. Menabur
 * tanda `!` ke seluruh berkas memang membuat build lolos, tetapi itu hanya
 * membungkam pemeriksa tipe tanpa membuktikan apa pun. Helper ini membatasi
 * indeks lebih dulu lalu mengembalikan nilai yang dijamin ada, jadi tipenya
 * jujur dan gambar tetap muncul walau indeks di luar dugaan.
 */
function pilih<T>(daftar: readonly T[], i: number, cadangan: T): T {
  if (daftar.length === 0) return cadangan;
  const n = batas(Math.floor(i), daftar.length - 1);
  return daftar[n] ?? cadangan;
}

export const OptionIllustration: React.FC<OptionIllustrationProps> = ({
  scoreId,
  paramIndex,
  optionIndex,
}) => {
  if (scoreId === "apgar") {
    // 0. Appearance (Warna Kulit)
    if (paramIndex === 0) {
      if (optionIndex === 0) {
        // Skor 0: Pucat / Biru Seluruh Tubuh
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 70 50" width="56" height="40">
              <circle cx="35" cy="11" r="7.5" fill="#94A3B8" />
              <path d="M28 17 H42 C44 26 43 32 40 35 H30 C27 32 26 26 28 17 Z" fill="#94A3B8" />
              <path d="M28 19 Q18 21 16 27 Q15 30 18 30 Q21 28 27 23" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              <path d="M42 19 Q52 21 54 27 Q55 30 52 30 Q49 28 43 23" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              <path d="M30 35 Q24 40 22 45 Q21 48 25 48 Q28 46 32 37" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              <path d="M40 35 Q46 40 48 45 Q49 48 45 48 Q42 46 38 37" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
              <circle cx="32" cy="11" r="1" fill="#475569" />
              <circle cx="38" cy="11" r="1" fill="#475569" />
              <path d="M33 14 Q35 13 37 14" stroke="#475569" strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 1) {
        // Skor 1: Tubuh Pink, Ekstremitas Biru
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 70 50" width="56" height="40">
              <circle cx="35" cy="11" r="7.5" fill="#FB7185" />
              <path d="M28 17 H42 C44 26 43 32 40 35 H30 C27 32 26 26 28 17 Z" fill="#FB7185" />
              <path d="M28 19 Q18 21 16 27 Q15 30 18 30 Q21 28 27 23" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <path d="M42 19 Q52 21 54 27 Q55 30 52 30 Q49 28 43 23" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <path d="M30 35 Q24 40 22 45 Q21 48 25 48 Q28 46 32 37" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <path d="M40 35 Q46 40 48 45 Q49 48 45 48 Q42 46 38 37" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <circle cx="32" cy="11" r="1" fill="#9F1239" />
              <circle cx="38" cy="11" r="1" fill="#9F1239" />
              <path d="M33 14 Q35 15 37 14" stroke="#9F1239" strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 2) {
        // Skor 2: Seluruh Tubuh Pink
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 70 50" width="56" height="40">
              <circle cx="35" cy="11" r="7.5" fill="#F43F5E" />
              <path d="M28 17 H42 C44 26 43 32 40 35 H30 C27 32 26 26 28 17 Z" fill="#F43F5E" />
              <path d="M28 19 Q18 21 16 27 Q15 30 18 30 Q21 28 27 23" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
              <path d="M42 19 Q52 21 54 27 Q55 30 52 30 Q49 28 43 23" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
              <path d="M30 35 Q24 40 22 45 Q21 48 25 48 Q28 46 32 37" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
              <path d="M40 35 Q46 40 48 45 Q49 48 45 48 Q42 46 38 37" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
              <circle cx="32" cy="11" r="1" fill="#881337" />
              <circle cx="38" cy="11" r="1" fill="#881337" />
              <path d="M33 14 Q35 15.5 37 14" stroke="#881337" strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      }
    }

    // 1. Pulse (Frekuensi Jantung)
    if (paramIndex === 1) {
      if (optionIndex === 0) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M30 36s-12-8-12-15c0-4 3-7 7-7 3 0 5 2 5 2s2-2 5-2c4 0 7 3 7 7 0 7-12 15-12 15z" fill="#CBD5E1" />
              <line x1="12" y1="23" x2="48" y2="23" stroke="#64748B" strokeWidth="2.5" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 1) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M30 36s-12-8-12-15c0-4 3-7 7-7 3 0 5 2 5 2s2-2 5-2c4 0 7 3 7 7 0 7-12 15-12 15z" fill="#F59E0B" />
              <path d="M10 23h12l3-6 4 12 4-6h17" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 2) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M30 36s-12-8-12-15c0-4 3-7 7-7 3 0 5 2 5 2s2-2 5-2c4 0 7 3 7 7 0 7-12 15-12 15z" fill="#10B981" />
              <path d="M8 23h8l3-8 3 16 3-12 3 6h14" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );
      }
    }

    // 2. Grimace (Refleks)
    if (paramIndex === 2) {
      if (optionIndex === 0) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 50 42" width="44" height="36">
              <circle cx="25" cy="21" r="16" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              <line x1="17" y1="17" x2="21" y2="17" stroke="#64748B" strokeWidth="2" />
              <line x1="29" y1="17" x2="33" y2="17" stroke="#64748B" strokeWidth="2" />
              <line x1="19" y1="27" x2="31" y2="27" stroke="#64748B" strokeWidth="2" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 1) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 50 42" width="44" height="36">
              <circle cx="25" cy="21" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
              <path d="M16 17q3-3 6 0" stroke="#D97706" strokeWidth="2" fill="none" />
              <path d="M28 17q3-3 6 0" stroke="#D97706" strokeWidth="2" fill="none" />
              <ellipse cx="25" cy="27" rx="4" ry="2" fill="#D97706" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 2) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 50 42" width="44" height="36">
              <circle cx="25" cy="21" r="16" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
              <path d="M15 15l5 3" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M35 15l-5 3" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="25" cy="28" r="5" fill="#059669" />
            </svg>
          </div>
        );
      }
    }

    // 3. Activity (Tonus Otot)
    if (paramIndex === 3) {
      if (optionIndex === 0) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <circle cx="30" cy="12" r="5" fill="#CBD5E1" />
              <rect x="27" y="17" width="6" height="16" rx="3" fill="#CBD5E1" />
              <line x1="27" y1="19" x2="16" y2="19" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="33" y1="19" x2="44" y2="19" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="33" x2="22" y2="42" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="32" y1="33" x2="38" y2="42" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 1) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <circle cx="30" cy="12" r="5" fill="#FDE68A" />
              <rect x="27" y="17" width="6" height="16" rx="3" fill="#FDE68A" />
              <path d="M27 19l-5 3 2 5" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M33 19l5 3-2 5" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M28 33l-3 4 2 3" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M32 33l3 4-2 3" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 2) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <circle cx="30" cy="12" r="5" fill="#A7F3D0" />
              <rect x="27" y="17" width="6" height="16" rx="3" fill="#A7F3D0" />
              <path d="M27 19l-7-2 2-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M33 19l7-2-2-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M28 33l-5-2 2-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M32 33l5-2-2-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );
      }
    }

    // 4. Respiration (Usaha Napas)
    if (paramIndex === 4) {
      if (optionIndex === 0) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M18 14c0 7 4 12 12 12s12-5 12-12" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              <line x1="15" y1="32" x2="45" y2="32" stroke="#64748B" strokeWidth="2" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 1) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M12 22c6-5 12 5 18 0s12 5 18 0" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        );
      }
      if (optionIndex === 2) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 60 45" width="48" height="36">
              <path d="M8 22q7-10 14 0t14 0 16 0" stroke="#10B981" strokeWidth="3" fill="none" />
              <path d="M38 10l5-3m-1 8l5 2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
      }
    }
  }

  if (scoreId === "ballard") {
    /* ================= MATURITAS NEUROMUSKULAR ================= */

    // 0. Posture (Sikap Tubuh) - 5 pilihan, skor 0..4
    if (paramIndex === 0) {
      // Makin matur, lengan dan tungkai makin menekuk sehingga jangkauannya
      // makin pendek. Itulah isyarat visual utama pada baris ini.
      const AWAL = { lengan: "M30 16 L54 12", tungkai: "M35 28 L58 32" };
      const SIKAP = [
        AWAL,
        { lengan: "M30 16 L45 11 L55 17", tungkai: "M35 28 L50 33 L58 27" },
        { lengan: "M30 16 L43 10 L52 18", tungkai: "M35 28 L48 34 L56 25" },
        { lengan: "M30 16 L41 9 L48 18", tungkai: "M35 28 L45 35 L52 24" },
        { lengan: "M30 16 L38 9 L44 17", tungkai: "M35 28 L42 34 L48 23" },
      ];
      const s = pilih(SIKAP, optionIndex, AWAL);
      return (
        <Kanvas>
          <Kepala x={13} y={22} />
          <rect x={18} y={16} width={18} height={12} rx={6} />
          <path d={s.lengan} stroke={AKSEN} strokeWidth={2} />
          <path d={s.tungkai} stroke={AKSEN} strokeWidth={2} />
        </Kanvas>
      );
    }

    // 1. Square Window (Pergelangan Tangan) - 6 pilihan
    if (paramIndex === 1) {
      const AWAL = { d: 120, teks: "> 90\u00B0" };
      const JENDELA = [
        AWAL,
        { d: 90, teks: "90\u00B0" },
        { d: 60, teks: "60\u00B0" },
        { d: 45, teks: "45\u00B0" },
        { d: 30, teks: "30\u00B0" },
        { d: 0, teks: "0\u00B0" },
      ];
      const s = pilih(JENDELA, optionIndex, AWAL);
      // Sudut diukur dari sumbu lengan bawah. 0 derajat berarti telapak tangan
      // benar-benar menempel pada lengan - kondisi paling matur.
      const t = (s.d * Math.PI) / 180;
      const px = 26 + 15 * Math.sin(t);
      const py = 16 - 15 * Math.cos(t);
      const jx = 3.5 * Math.cos(t);
      const jy = 3.5 * Math.sin(t);
      const warna = s.d === 0 ? AKSEN_KUAT : AKSEN;
      return (
        <Kanvas>
          {/* Lengan bawah, selalu tegak sebagai acuan sudut */}
          <path d="M26 40 L26 16" strokeWidth={2} />
          {/* Telapak tangan */}
          <path
            d={`M26 16 L${px.toFixed(1)} ${py.toFixed(1)}`}
            stroke={warna}
            strokeWidth={2.4}
          />
          {/* Lebar telapak, supaya arah tangan terbaca meski sudutnya 0 */}
          <path
            d={`M${(px - jx).toFixed(1)} ${(py - jy).toFixed(1)} L${(px + jx).toFixed(1)} ${(py + jy).toFixed(1)}`}
            stroke={warna}
            strokeWidth={2}
          />
          <Label x={48} y={41} teks={s.teks} warna={warna} />
        </Kanvas>
      );
    }

    // 2. Arm Recoil (Rekoil Lengan) - 5 pilihan
    if (paramIndex === 2) {
      const AWAL = { garis: "M26 18 L24 38", teks: "180\u00B0", kuat: false };
      const REKOIL = [
        AWAL,
        { garis: "M26 18 L20 30 L26 38", teks: "140\u2013180\u00B0", kuat: false },
        { garis: "M26 18 L17 27 L26 34", teks: "110\u2013140\u00B0", kuat: false },
        { garis: "M26 18 L16 24 L26 29", teks: "90\u2013110\u00B0", kuat: true },
        { garis: "M26 18 L16 21 L27 23", teks: "< 90\u00B0", kuat: true },
      ];
      const s = pilih(REKOIL, optionIndex, AWAL);
      const warna = s.kuat ? AKSEN_KUAT : AKSEN;
      return (
        <Kanvas>
          <Kepala x={32} y={9} r={4.5} />
          <rect x={26} y={14} width={12} height={22} rx={5} />
          <path d={s.garis} stroke={warna} strokeWidth={2.2} />
          <Label x={49} y={41} teks={s.teks} warna={warna} />
        </Kanvas>
      );
    }

    // 3. Popliteal Angle (Sudut Popliteal) - 7 pilihan
    if (paramIndex === 3) {
      const AWAL = { d: 180, teks: "180\u00B0" };
      const POPLITEAL = [
        AWAL,
        { d: 160, teks: "160\u00B0" },
        { d: 140, teks: "140\u00B0" },
        { d: 120, teks: "120\u00B0" },
        { d: 100, teks: "100\u00B0" },
        { d: 90, teks: "90\u00B0" },
        { d: 70, teks: "< 90\u00B0" },
      ];
      const s = pilih(POPLITEAL, optionIndex, AWAL);
      // Sudut popliteal diukur di lutut, antara paha dan betis. 180 derajat
      // berarti tungkai lurus sempurna; simpangan betis dihitung dari situ.
      const r = ((180 - s.d) * Math.PI) / 180;
      const kx = 26;
      const ky = 17;
      const bx = kx + 15 * Math.sin(r);
      const by = ky - 15 * Math.cos(r);
      const warna = s.d <= 90 ? AKSEN_KUAT : AKSEN;
      return (
        <Kanvas>
          <Kepala x={11} y={31} r={4.5} />
          <rect x={15} y={27} width={15} height={9} rx={4.5} />
          {/* Paha ditahan tegak ke arah perut */}
          <path d={`M26 31 L${kx} ${ky}`} stroke={AKSEN} strokeWidth={2} />
          {/* Betis dibuka sampai terasa tahanan */}
          <path
            d={`M${kx} ${ky} L${bx.toFixed(1)} ${by.toFixed(1)}`}
            stroke={warna}
            strokeWidth={2}
          />
          <circle cx={kx} cy={ky} r={1.8} fill={warna} stroke="none" />
          <Label x={49} y={41} teks={s.teks} warna={warna} />
        </Kanvas>
      );
    }

    // 4. Scarf Sign (Tanda Selendang) - 6 pilihan
    if (paramIndex === 4) {
      // Siku ditarik melintasi dada. Patokannya garis tengah (x=32) dan garis
      // puting (x=25 dan x=39); teks pilihan menyebut patokan itu secara
      // eksplisit, jadi keduanya ikut digambar sebagai penanda.
      const SIKU_X = [16, 21, 25, 32, 38, 43];
      const i = batas(optionIndex, 5);
      const sx = pilih(SIKU_X, optionIndex, 16);
      const warna = i >= 4 ? AKSEN_KUAT : AKSEN;
      return (
        <Kanvas>
          <Kepala x={32} y={8} r={4.5} />
          <rect x={18} y={14} width={28} height={24} rx={5} />
          <path
            d="M32 14 L32 38"
            strokeWidth={1}
            strokeDasharray="2 2"
            opacity={0.55}
          />
          <circle cx={25} cy={23} r={1.1} fill="currentColor" stroke="none" />
          <circle cx={39} cy={23} r={1.1} fill="currentColor" stroke="none" />
          <path
            d={`M46 18 Q ${((46 + sx) / 2).toFixed(1)} 15 ${sx} 24`}
            stroke={warna}
            strokeWidth={2.2}
          />
          <circle cx={sx} cy={24} r={2.4} fill={warna} stroke="none" />
        </Kanvas>
      );
    }

    // 5. Heel to Ear (Tumit ke Telinga) - 6 pilihan
    if (paramIndex === 5) {
      const AWAL = { x: 17, y: 13, teks: "180\u00B0" };
      const TUMIT = [
        AWAL,
        { x: 21, y: 15, teks: "160\u00B0" },
        { x: 26, y: 18, teks: "140\u00B0" },
        { x: 31, y: 22, teks: "120\u00B0" },
        { x: 36, y: 26, teks: "100\u00B0" },
        { x: 40, y: 30, teks: "< 90\u00B0" },
      ];
      const s = pilih(TUMIT, optionIndex, AWAL);
      const i = batas(optionIndex, 5);
      // Lutut ditempatkan di atas garis pinggul-tumit agar tungkai terbaca
      // menekuk, bukan sekadar patah.
      const lx = (44 + s.x) / 2 + 3;
      const ly = (30 + s.y) / 2 - 10;
      const warna = i >= 4 ? AKSEN_KUAT : AKSEN;
      return (
        <Kanvas>
          <Kepala x={12} y={20} r={5} />
          {/* Daun telinga: sasaran yang dituju tumit */}
          <path d="M16.5 17 Q19.5 20 16.5 23" strokeWidth={1.2} />
          <rect x={18} y={26} width={28} height={10} rx={5} />
          <path
            d={`M44 30 L${lx.toFixed(1)} ${ly.toFixed(1)} L${s.x} ${s.y}`}
            stroke={warna}
            strokeWidth={2}
          />
          <circle cx={s.x} cy={s.y} r={2.2} fill={warna} stroke="none" />
          <Label x={52} y={41} teks={s.teks} warna={warna} />
        </Kanvas>
      );
    }

    /* ==================== MATURITAS FISIK ====================
       Baris-baris ini sebelumnya mengabaikan optionIndex sehingga SATU gambar
       dipakai untuk seluruh pilihan di kolomnya. Akibatnya ilustrasi tidak
       membantu sama sekali: pengguna melihat gambar yang sama persis apa pun
       yang ia pilih. Setiap pilihan sekarang punya gambarnya sendiri.

       Bagan Ballard asli tidak memuat gambar untuk maturitas fisik - hanya
       teks. Ilustrasi di bawah karena itu dirancang dari deskripsi klinis
       tiap pilihan, dan sengaja dibuat skematis, bukan realistis, supaya
       terbaca pada ukuran 56 piksel.
    ========================================================== */

    // 6. Kulit (Skin) - 7 pilihan
    if (paramIndex === 6) {
      const AWAL = { isi: "#F0F9FF", vena: 0, retak: 0 };
      const KULIT = [
        AWAL,
        { isi: "#FCA5A5", vena: 0, retak: 0 },
        { isi: "#FBCFE8", vena: 4, retak: 0 },
        { isi: "#FBCFE8", vena: 2, retak: 0 },
        { isi: "#FEE2E2", vena: 1, retak: 2 },
        { isi: "#F1EADB", vena: 0, retak: 4 },
        { isi: "#E3D5BE", vena: 0, retak: 6 },
      ];
      const s = pilih(KULIT, optionIndex, AWAL);
      const i = batas(optionIndex, 6);
      const VENA = [
        "M14 18 L20 21 L26 19",
        "M16 26 L23 24 L30 27",
        "M30 15 L36 18 L42 16",
        "M32 29 L38 26 L44 29",
      ];
      const RETAK = [
        "M16 14 L19 20 L17 27",
        "M24 13 L26 20 L24 29",
        "M32 14 L35 21 L33 28",
        "M40 15 L42 21 L40 28",
        "M19 31 L27 30",
        "M33 31 L42 30",
      ];
      return (
        <Kanvas vb="0 0 56 44" lebar={50}>
          <rect
            x={9}
            y={10}
            width={38}
            height={24}
            rx={6}
            fill={s.isi}
            strokeDasharray={i === 0 ? "3 2" : undefined}
            opacity={i === 0 ? 0.75 : 1}
          />
          {/* Vena yang masih tembus pandang pada kulit belum matur */}
          {VENA.slice(0, s.vena).map((d) => (
            <path key={d} d={d} stroke="#3B82F6" strokeWidth={1} opacity={0.85} />
          ))}
          {/* Retakan bertambah banyak dan dalam seiring maturitas */}
          {RETAK.slice(0, s.retak).map((d) => (
            <path key={d} d={d} strokeWidth={i >= 5 ? 1.4 : 1} opacity={0.8} />
          ))}
          {/* Pengelupasan superfisial */}
          {i === 3 && (
            <>
              <path d="M15 16 q4 -3 8 0 q-4 3 -8 0 Z" fill="#FFFFFF" opacity={0.9} strokeWidth={0.9} />
              <path d="M30 25 q5 -3 9 0 q-5 3 -9 0 Z" fill="#FFFFFF" opacity={0.9} strokeWidth={0.9} />
            </>
          )}
          {/* Keriput pada kulit paling matur */}
          {i === 6 && (
            <>
              <path d="M12 20 q9 -3 17 0 q9 3 15 0" strokeWidth={0.9} opacity={0.65} />
              <path d="M12 25 q9 3 17 0 q9 -3 15 0" strokeWidth={0.9} opacity={0.65} />
            </>
          )}
        </Kanvas>
      );
    }

    // 7. Lanugo - 6 pilihan
    if (paramIndex === 7) {
      const i = batas(optionIndex, 5);
      const RAMBUT = [
        "M13 31 L15 21",
        "M17 32 L19 22",
        "M21 31 L23 20",
        "M25 32 L27 21",
        "M29 31 L31 20",
        "M33 32 L35 22",
        "M37 31 L39 21",
        "M41 31 L43 22",
        "M15 27 L17 17",
        "M23 28 L25 18",
        "M31 27 L33 17",
        "M39 28 L41 18",
        "M19 25 L21 16",
        "M35 25 L37 16",
      ];
      // Pola dipilih eksplisit, bukan diambil N pertama, supaya "jarang"
      // benar-benar tersebar merata dan tidak menggerombol di satu sisi.
      const POLA: number[][] = [
        [],
        [0, 4, 8, 12],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        [0, 2, 5, 7, 9, 11, 13],
        [2, 7, 11],
        [6],
      ];
      const dipilih = pilih(POLA, optionIndex, []);
      // filter, bukan map berindeks, supaya tidak ada pembacaan larik mentah
      const dipakai = RAMBUT.filter((_, k) => dipilih.includes(k));
      return (
        <Kanvas vb="0 0 56 44" lebar={50}>
          {/* Punggung bayi */}
          <rect x={9} y={12} width={38} height={22} rx={8} fill="#FDE8D7" />
          {dipakai.map((d) => (
            <path key={d} d={d} strokeWidth={0.9} opacity={0.9} stroke="#B45309" />
          ))}
          {i === 0 && <Label x={28} y={26} teks={"\u2014"} warna="#B45309" />}
        </Kanvas>
      );
    }

    // 8. Permukaan Plantar - 7 pilihan
    if (paramIndex === 8) {
      const i = batas(optionIndex, 6);
      const SOL =
        "M25 5 C18 5 15 11 16 18 C17 25 19 30 20 34 C21 37 29 37 30 34 C31 30 33 25 34 18 C35 11 32 5 25 5 Z";
      // Lipatan tumbuh dari anterior (dekat jari, y kecil) ke arah tumit.
      const LIPAT = [
        "M18.5 13 q6 2.5 13 0",
        "M18 17 q6.5 2.5 14 0",
        "M18 21 q6.5 2.5 14 0",
        "M18.5 25 q6 2.5 13 0",
        "M19.5 29 q5 2 11 0",
      ];
      const jml = pilih([0, 0, 0, 1, 3, 5, 5], optionIndex, 0);
      return (
        <Kanvas vb="0 0 56 44" lebar={48}>
          <path d={SOL} fill="#FDE68A" />
          {/* Bercak merah samar: belum menjadi lipatan sejati */}
          {i === 2 && (
            <path d="M19 13 q6 2.5 13 0" stroke="#F87171" strokeWidth={1.2} strokeDasharray="1.5 2" />
          )}
          {LIPAT.slice(0, jml).map((d) => (
            <path key={d} d={d} strokeWidth={i === 6 ? 1.8 : 1.2} />
          ))}
          {/* Dua pilihan pertama dinilai dari PANJANG kaki, bukan lipatan */}
          {i <= 1 && (
            <>
              <path d="M40 6 L40 36" strokeWidth={1} stroke={AKSEN} />
              <path d="M37.5 6 L42.5 6 M37.5 36 L42.5 36" strokeWidth={1} stroke={AKSEN} />
              <Label x={30} y={42} teks={i === 0 ? "40\u201350 mm" : "> 50 mm"} />
            </>
          )}
        </Kanvas>
      );
    }

    // 9. Payudara / Areola - 6 pilihan
    if (paramIndex === 9) {
      const AWAL = { areola: 6, nodul: 0 };
      const DADA = [
        AWAL,
        { areola: 6.5, nodul: 0.9 },
        { areola: 8, nodul: 0 },
        { areola: 8.5, nodul: 1.9 },
        { areola: 9, nodul: 2.7 },
        { areola: 10, nodul: 3.6 },
      ];
      const s = pilih(DADA, optionIndex, AWAL);
      const i = batas(optionIndex, 5);
      const samar = i <= 1;
      return (
        <Kanvas vb="0 0 56 44" lebar={48}>
          {/* Bidang dada */}
          <rect x={8} y={9} width={40} height={26} rx={8} fill="#FFF1F2" opacity={0.85} />
          <circle
            cx={28}
            cy={22}
            r={s.areola}
            stroke="#BE185D"
            strokeWidth={i >= 4 ? 1.8 : 1.2}
            strokeDasharray={samar ? "2 2" : undefined}
            opacity={samar ? 0.7 : 1}
            fill={i >= 4 ? "#FBCFE8" : "none"}
          />
          {/* Areola berbintik */}
          {i === 3 && (
            <>
              <circle cx={24} cy={19} r={0.7} fill="#BE185D" stroke="none" />
              <circle cx={32} cy={20} r={0.7} fill="#BE185D" stroke="none" />
              <circle cx={25} cy={26} r={0.7} fill="#BE185D" stroke="none" />
              <circle cx={31} cy={26} r={0.7} fill="#BE185D" stroke="none" />
            </>
          )}
          {/* Areola terangkat: cincin luar tambahan */}
          {i >= 4 && (
            <circle cx={28} cy={22} r={s.areola + 1.8} stroke="#BE185D" strokeWidth={0.9} opacity={0.55} />
          )}
          {s.nodul > 0 && (
            <circle cx={28} cy={22} r={s.nodul} fill="#BE185D" stroke="none" />
          )}
        </Kanvas>
      );
    }

    // 10. Mata & Telinga - 6 pilihan
    if (paramIndex === 10) {
      const i = batas(optionIndex, 5);
      // Pilihan pertama dinilai dari KELOPAK MATA, sisanya dari daun telinga.
      if (i === 0) {
        return (
          <Kanvas vb="0 0 56 44" lebar={48}>
            <ellipse cx={28} cy={22} rx={15} ry={7} fill="#E0F2FE" />
            {/* Kelopak menyatu: garis tegas tanpa iris */}
            <path d="M14 22 L42 22" strokeWidth={2.2} />
            <path d="M18 26 L16 29 M24 27 L23 30 M32 27 L33 30 M38 26 L40 29" strokeWidth={1} />
          </Kanvas>
        );
      }
      const AWAL = {
        d: "M36 12 Q28 12 28 22 Q28 32 36 32",
        tebal: 1.4,
        teks: "terlipat",
      };
      const TELINGA = [
        AWAL,
        { d: "M37 11 Q25 12 25 22 Q25 32 37 33", tebal: 1.6, teks: "lambat" },
        { d: "M38 10 Q22 11 22 22 Q22 33 38 34", tebal: 1.9, teks: "cepat" },
        { d: "M38 10 Q20 10 20 22 Q20 34 38 34", tebal: 2.3, teks: "instan" },
        { d: "M39 9 Q18 9 18 22 Q18 35 39 35", tebal: 2.8, teks: "kaku" },
      ];
      const s = pilih(TELINGA, i - 1, AWAL);
      return (
        <Kanvas vb="0 0 56 44" lebar={48}>
          <path d={s.d} strokeWidth={s.tebal} />
          {/* Antiheliks: lekukan dalam yang menegas seiring maturitas */}
          {i >= 3 && (
            <path
              d={`M34 15 Q${28 - i} 17 ${28 - i} 22 Q${28 - i} 27 34 29`}
              strokeWidth={1}
              opacity={0.6}
            />
          )}
          {/* Panah rekoil: makin matur makin cepat kembali */}
          {i >= 2 && (
            <path
              d="M43 19 q4 3 0 6"
              stroke={i >= 4 ? AKSEN_KUAT : AKSEN}
              strokeWidth={i >= 4 ? 1.8 : 1.1}
              strokeDasharray={i === 2 ? "2 2" : undefined}
            />
          )}
          <Label x={28} y={42} teks={s.teks} warna={i >= 4 ? AKSEN_KUAT : AKSEN} />
        </Kanvas>
      );
    }

    // 11. Genitalia - 6 pilihan
    if (paramIndex === 11) {
      // Teks pilihan menyebut laki-laki DAN perempuan dalam satu baris, jadi
      // keduanya digambar berdampingan pada kanvas yang sedikit lebih lebar.
      const AWAL = { rugae: 0, testis: 10, majora: 4, klitoris: 2.6 };
      const GENITAL = [
        AWAL,
        { rugae: 1, testis: 13, majora: 4.8, klitoris: 2.3 },
        { rugae: 2, testis: 17, majora: 5.6, klitoris: 2 },
        { rugae: 3, testis: 22, majora: 6.4, klitoris: 1.7 },
        { rugae: 4, testis: 27, majora: 7.2, klitoris: 1.4 },
        { rugae: 5, testis: 30, majora: 8, klitoris: 1.1 },
      ];
      const s = pilih(GENITAL, optionIndex, AWAL);
      const RUGAE = [
        "M17 22 q7 2 13 0",
        "M17 26 q7 2 13 0",
        "M18 18 q6 2 11 0",
        "M18 30 q6 2 11 0",
        "M19 14 q5 2 9 0",
      ];
      return (
        <Kanvas vb="0 0 78 44" lebar={66}>
          {/* Laki-laki: skrotum + testis yang turun + rugae */}
          <path d="M23.5 12 Q14 20 16 30 Q19 38 23.5 38 Q28 38 31 30 Q33 20 23.5 12 Z" fill="#FEF3C7" />
          <circle cx={20.5} cy={s.testis} r={2.2} fill="#D97706" stroke="none" />
          <circle cx={26.5} cy={s.testis} r={2.2} fill="#D97706" stroke="none" />
          {RUGAE.slice(0, s.rugae).map((d) => (
            <path key={d} d={d} strokeWidth={0.9} opacity={0.75} />
          ))}
          <text x={23.5} y={7} fontSize={8} fill="currentColor" stroke="none" textAnchor="middle">
            {"\u2642"}
          </text>

          {/* Perempuan: majora membesar sampai menutupi klitoris & minora */}
          <ellipse cx={56} cy={25} rx={s.majora} ry={12} fill="#FCE7F3" strokeWidth={1.3} />
          <path d="M56 15 L56 35" strokeWidth={0.9} opacity={0.6} />
          <circle cx={56} cy={16} r={s.klitoris} fill="#BE185D" stroke="none" />
          <text x={56} y={7} fontSize={8} fill="currentColor" stroke="none" textAnchor="middle">
            {"\u2640"}
          </text>
        </Kanvas>
      );
    }
  }

  return null;
};
