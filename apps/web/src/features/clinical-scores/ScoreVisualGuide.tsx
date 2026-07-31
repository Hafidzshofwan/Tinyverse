"use client";

import React from "react";

interface OptionIllustrationProps {
  scoreId: string;
  paramIndex: number;
  optionIndex: number;
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
    // 0. Posture (Sikap Tubuh)
    if (paramIndex === 0) {
      // 0: Ekstensi 0° (0)
      if (optionIndex === 0) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 64 42" width="54" height="36">
              {/* Kepala dengan mata dot */}
              <circle cx="16" cy="21" r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
              <circle cx="15" cy="20" r="0.8" fill="#334155" />
              <circle cx="17" cy="20" r="0.8" fill="#334155" />
              {/* Badan & Ekstremitas Lurus Flat */}
              <line x1="21" y1="21" x2="46" y2="21" stroke="#334155" strokeWidth="2" />
              <line x1="27" y1="21" x2="27" y2="32" stroke="#334155" strokeWidth="1.5" />
              <line x1="27" y1="21" x2="27" y2="10" stroke="#334155" strokeWidth="1.5" />
              <line x1="46" y1="21" x2="58" y2="21" stroke="#334155" strokeWidth="1.5" />
            </svg>
          </div>
        );
      }
      // 1: Fleksi ringan panggul & lutut (1)
      if (optionIndex === 1) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 64 42" width="54" height="36">
              <circle cx="16" cy="21" r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
              <circle cx="15" cy="20" r="0.8" fill="#334155" />
              <circle cx="17" cy="20" r="0.8" fill="#334155" />
              <line x1="21" y1="21" x2="44" y2="21" stroke="#334155" strokeWidth="2" />
              <line x1="27" y1="21" x2="27" y2="30" stroke="#334155" strokeWidth="1.5" />
              <line x1="27" y1="21" x2="27" y2="12" stroke="#334155" strokeWidth="1.5" />
              <path d="M44 21 L50 15 L56 21" stroke="#0284C7" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        );
      }
      // 2: Fleksi sedang panggul & lutut (2)
      if (optionIndex === 2) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 64 42" width="54" height="36">
              <circle cx="16" cy="21" r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
              <circle cx="15" cy="20" r="0.8" fill="#334155" />
              <circle cx="17" cy="20" r="0.8" fill="#334155" />
              <line x1="21" y1="21" x2="42" y2="21" stroke="#334155" strokeWidth="2" />
              <path d="M27 21 L23 14 L27 8" stroke="#0284C7" strokeWidth="1.8" fill="none" />
              <path d="M42 21 L48 11 L54 21" stroke="#0284C7" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        );
      }
      // 3: Lengan fleksi, kaki fleksi kuat (3)
      if (optionIndex === 3) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 64 42" width="54" height="36">
              <circle cx="16" cy="21" r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
              <circle cx="15" cy="20" r="0.8" fill="#334155" />
              <circle cx="17" cy="20" r="0.8" fill="#334155" />
              <line x1="21" y1="21" x2="40" y2="21" stroke="#334155" strokeWidth="2" />
              <path d="M27 21 L21 14 L27 10" stroke="#059669" strokeWidth="1.8" fill="none" />
              <path d="M40 21 L46 9 L52 21 M40 21 L44 31 L50 21" stroke="#059669" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        );
      }
      // 4: Fleksi penuh 4 ekstremitas (4)
      if (optionIndex === 4) {
        return (
          <div className="tv-opt-svg-wrapper">
            <svg viewBox="0 0 64 42" width="54" height="36">
              <circle cx="16" cy="21" r="5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
              <circle cx="15" cy="20" r="0.8" fill="#334155" />
              <circle cx="17" cy="20" r="0.8" fill="#334155" />
              <line x1="21" y1="21" x2="38" y2="21" stroke="#334155" strokeWidth="2" />
              <path d="M25 21 L19 12 L25 12" stroke="#059669" strokeWidth="2" fill="none" />
              <path d="M38 21 L42 10 L34 10" stroke="#059669" strokeWidth="2" fill="none" />
              <path d="M38 21 L42 32 L34 32" stroke="#059669" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );
      }
    }

    // 1. Square Window (Pergelangan Tangan)
    if (paramIndex === 1) {
      const texts = [">90°", "90°", "60°", "45°", "30°", "0°"];
      const text = texts[optionIndex] || "0°";
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 60 42" width="50" height="36">
            {/* Lengan bawah vertikal */}
            <line x1="24" y1="36" x2="24" y2="14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            {optionIndex === 0 && <line x1="24" y1="14" x2="42" y2="6" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />}
            {optionIndex === 1 && <line x1="24" y1="14" x2="46" y2="14" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />}
            {optionIndex === 2 && <line x1="24" y1="14" x2="42" y2="23" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />}
            {optionIndex === 3 && <line x1="24" y1="14" x2="38" y2="28" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />}
            {optionIndex === 4 && <line x1="24" y1="14" x2="32" y2="31" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />}
            {optionIndex === 5 && <line x1="28" y1="14" x2="28" y2="36" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />}
            <text x="44" y="36" fontSize="10" fill="#0284C7" fontWeight="bold" textAnchor="end">{text}</text>
          </svg>
        </div>
      );
    }

    // 2. Arm Recoil (Rekoil Lengan)
    if (paramIndex === 2) {
      const recoilLabels = ["180°", "140–180°", "110–140°", "90–110°", "<90°"];
      const text = recoilLabels[optionIndex] || "180°";
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 60 42" width="50" height="36">
            <circle cx="30" cy="10" r="4.5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.2" />
            <rect x="27" y="15" width="6" height="12" rx="2" fill="#334155" />
            {optionIndex === 0 && <line x1="27" y1="16" x2="27" y2="34" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 1 && <path d="M27 16 L22 26 L26 34" stroke="#0284C7" strokeWidth="2" fill="none" strokeLinecap="round" />}
            {optionIndex === 2 && <path d="M27 16 L18 24 L24 32" stroke="#0284C7" strokeWidth="2" fill="none" strokeLinecap="round" />}
            {optionIndex === 3 && <path d="M27 16 L16 22 L20 16" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />}
            {optionIndex === 4 && <path d="M27 16 L16 18 L24 10" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />}
            <text x="30" y="40" fontSize="9" fill="#0284C7" fontWeight="bold" textAnchor="middle">{text}</text>
          </svg>
        </div>
      );
    }

    // 3. Popliteal Angle (Sudut Popliteal)
    if (paramIndex === 3) {
      const popLabels = ["180°", "160°", "140°", "120°", "100°", "90°", "<90°"];
      const text = popLabels[optionIndex] || "180°";
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 60 42" width="50" height="36">
            {/* Bayi terlentang */}
            <circle cx="12" cy="24" r="4" fill="#E2E8F0" stroke="#334155" strokeWidth="1.2" />
            <line x1="16" y1="24" x2="30" y2="24" stroke="#334155" strokeWidth="2" />
            {/* Paha vertikal */}
            <line x1="30" y1="24" x2="30" y2="10" stroke="#0284C7" strokeWidth="2" />
            {/* Betis sesuai sudut */}
            {optionIndex === 0 && <line x1="30" y1="10" x2="50" y2="10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 1 && <line x1="30" y1="10" x2="48" y2="15" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 2 && <line x1="30" y1="10" x2="44" y2="21" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 3 && <line x1="30" y1="10" x2="40" y2="25" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 4 && <line x1="30" y1="10" x2="36" y2="28" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 5 && <line x1="30" y1="10" x2="16" y2="10" stroke="#059669" strokeWidth="2" strokeLinecap="round" />}
            {optionIndex === 6 && <line x1="30" y1="10" x2="18" y2="16" stroke="#059669" strokeWidth="2" strokeLinecap="round" />}
            <text x="44" y="38" fontSize="9" fill="#D97706" fontWeight="bold" textAnchor="middle">{text}</text>
          </svg>
        </div>
      );
    }

    // 4. Scarf Sign (Tanda Selendang)
    if (paramIndex === 4) {
      // Posisi siku berpindah dari kiri melewati garis tengah
      const elbowX = [12, 17, 23, 30, 37, 44][optionIndex] ?? 30;
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 60 42" width="50" height="36">
            {/* Torso & Garis Tengah */}
            <circle cx="30" cy="9" r="4" fill="#E2E8F0" stroke="#334155" strokeWidth="1.2" />
            <rect x="20" y="15" width="20" height="22" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
            <line x1="30" y1="15" x2="30" y2="37" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
            {/* Lengan ditarik menyilang */}
            <path d={`M 44 20 Q 34 18 ${elbowX} 22`} stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx={elbowX} cy="22" r="2.5" fill="#EF4444" />
            <path d={`M ${elbowX} 22 L ${elbowX - 4} 19 M ${elbowX} 22 L ${elbowX - 4} 25`} stroke="#EF4444" strokeWidth="1.2" />
          </svg>
        </div>
      );
    }

    // 5. Heel to Ear (Tumit ke Telinga)
    if (paramIndex === 5) {
      // Posisi tumit makin dekat ke telinga (kiri)
      const heelX = [16, 20, 24, 28, 32, 36][optionIndex] ?? 20;
      const heelY = [12, 14, 18, 22, 25, 28][optionIndex] ?? 16;
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 60 42" width="50" height="36">
            {/* Bayi terlentang, telinga di (14, 12) */}
            <circle cx="14" cy="20" r="4.5" fill="#E2E8F0" stroke="#334155" strokeWidth="1.2" />
            <line x1="18" y1="20" x2="36" y2="20" stroke="#334155" strokeWidth="2" />
            {/* Kaki ditarik ke arah telinga */}
            <path d={`M 36 20 L ${heelX} ${heelY}`} stroke="#0284C7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx={heelX} cy={heelY} r="2" fill="#0284C7" />
            <path d={`M 36 20 Q 26 12 ${heelX} ${heelY}`} stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          </svg>
        </div>
      );
    }

    // 6. Skin (Kulit)
    if (paramIndex === 6) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <rect x="10" y="10" width="30" height="22" rx="4" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="1.5" />
            <path d="M14 17h22M14 22h22M14 27h16" stroke="#FB7185" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // 7. Lanugo
    if (paramIndex === 7) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <path d="M15 32 Q22 18 35 10" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M12 28 Q20 20 28 14" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M22 34 Q28 26 38 18" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // 8. Plantar
    if (paramIndex === 8) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <path d="M20 8 C14 8 14 16 16 22 C18 28 22 34 26 34 C30 34 32 30 30 22 C28 16 26 8 20 8 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            <line x1="18" y1="18" x2="28" y2="18" stroke="#D97706" strokeWidth="1.2" />
            <line x1="19" y1="24" x2="27" y2="24" stroke="#D97706" strokeWidth="1.2" />
          </svg>
        </div>
      );
    }

    // 9. Breast
    if (paramIndex === 9) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <circle cx="25" cy="21" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="25" cy="21" r="6" fill="#F59E0B" />
            <circle cx="25" cy="21" r="2" fill="#B45309" />
          </svg>
        </div>
      );
    }

    // 10. Eye / Ear
    if (paramIndex === 10) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <path d="M18 10 C12 10 10 16 10 21 C10 28 16 32 22 32 C26 32 28 28 26 24 C24 20 20 20 18 22" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="36" cy="21" r="7" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="36" cy="21" r="3" fill="#0284C7" />
          </svg>
        </div>
      );
    }

    // 11. Genitalia
    if (paramIndex === 11) {
      return (
        <div className="tv-opt-svg-wrapper">
          <svg viewBox="0 0 50 42" width="44" height="36">
            <rect x="12" y="10" width="26" height="22" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="25" cy="18" r="4" fill="#94A3B8" />
            <path d="M20 28 Q25 24 30 28" stroke="#64748B" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );
    }
  }

  return null;
};
