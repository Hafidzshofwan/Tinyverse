"use client";

import React, { useEffect, useState } from "react";

export type LoadingVariant = "pulse" | "pediatric" | "fluid";

export const LOADING_VARIANTS: {
  id: LoadingVariant;
  name: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "pulse",
    name: "Denyut Jantung Klinis (Pulse & ECG)",
    tagline: "Presisi & Respon Darurat",
    description:
      "Garis sinyal EKG / denyut jantung elektrokarbon yang bergerak kontinu melintasi ikon hati pediatri berpendar. Memberikan kesan klinis, responsif, dan canggih.",
  },
  {
    id: "pediatric",
    name: "Orbit Stetoskop & Bintang (Pediatric Care)",
    tagline: "Ramah, Hangat & Ceria",
    description:
      "Badge stetoskop pediatri di pusat dikelilingi orbit bintang berpijar dan partikel ceria yang berputar halus. Menciptakan suasana medis anak yang tenang dan bersahabat.",
  },
  {
    id: "fluid",
    name: "Gelombang Rehidrasi & Kapsul (Fluid Wave)",
    tagline: "Dinamis & Interaktif",
    description:
      "Kapsul/puyer transparan berisi efek gelombang cairan dinamis dan gelembung udara yang naik perlahan. Sangat cocok dengan jiwa kalkulator dosis dan terapi cairan.",
  },
];

const STORAGE_KEY = "tv-loading-variant";

export function getSavedLoadingVariant(): LoadingVariant {
  if (typeof window === "undefined") return "pulse";
  const saved = localStorage.getItem(STORAGE_KEY) as LoadingVariant;
  if (saved === "pulse" || saved === "pediatric" || saved === "fluid") {
    return saved;
  }
  return "pulse";
}

export function setSavedLoadingVariant(variant: LoadingVariant): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, variant);
}

interface LoadingAnimationProps {
  variant?: LoadingVariant;
  message?: string;
  fullScreen?: boolean;
  inlineHeight?: number | string;
}

export function LoadingAnimation({
  variant,
  message,
  fullScreen = false,
  inlineHeight = 280,
}: LoadingAnimationProps) {
  const [activeVariant, setActiveVariant] = useState<LoadingVariant>("pulse");

  useEffect(() => {
    if (variant) {
      setActiveVariant(variant);
    } else {
      setActiveVariant(getSavedLoadingVariant());
    }
  }, [variant]);

  const defaultMessages: Record<LoadingVariant, string> = {
    pulse: "Menghubungkan sinyal klinis pediatri...",
    pediatric: "Menyiapkan ruang perawatan Tinyverse...",
    fluid: "Menghitung parameter rehidrasi & dosis...",
  };

  const currentMessage = message || defaultMessages[activeVariant];

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(10, 11, 40, 0.75)",
    backdropFilter: "blur(12px)",
    color: "#F8FAFC",
    padding: "20px",
  };

  const cardStyle: React.CSSProperties = fullScreen
    ? {
        width: "100%",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        borderRadius: "26px",
        background: "var(--tv-card, #1E293B)",
        border: "1px solid var(--tv-line, rgba(255, 255, 255, 0.15))",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.2)",
      }
    : {
        width: "100%",
        height: typeof inlineHeight === "number" ? `${inlineHeight}px` : inlineHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "20px",
        background: "var(--tv-card, #1E293B)",
        border: "1px solid var(--tv-line, rgba(255, 255, 255, 0.1))",
      };

  const content = (
    <div style={cardStyle} className="tv-loading-anim-container">
      {/* RENDER SELECTED VARIANT */}
      {activeVariant === "pulse" && <PulseAnimation />}
      {activeVariant === "pediatric" && <PediatricAnimation />}
      {activeVariant === "fluid" && <FluidAnimation />}

      {/* CAPTION MESSAGE */}
      <div
        style={{
          marginTop: "18px",
          textAlign: "center",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--tv-teks, #F8FAFC)",
            margin: "0 0 4px 0",
            letterSpacing: "0.2px",
          }}
        >
          {currentMessage}
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--tv-soft-teks, #94A3B8)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#38BDF8",
              boxShadow: "0 0 8px #38BDF8",
            }}
          />
          <span>Tinyverse Pediatric Engine</span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return <div style={backdropStyle}>{content}</div>;
  }

  return content;
}

/* --------------------------------------------------------------------------
   OPTI 1: DENYUT JANTUNG & EKG KLINIS (PULSE)
   -------------------------------------------------------------------------- */
function PulseAnimation() {
  return (
    <div
      style={{
        position: "relative",
        width: "160px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pulse Rings */}
      <div
        style={{
          position: "absolute",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "2px solid rgba(236, 72, 153, 0.6)",
          animation: "tvPulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "2px solid rgba(56, 189, 248, 0.5)",
          animation: "tvPulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.6s infinite",
        }}
      />

      {/* Heart Icon with Beating Animation */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          animation: "tvHeartBeating 1.4s ease-in-out infinite",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGrad)"
          />
        </svg>
      </div>

      {/* ECG Line Overlay Across SVG */}
      <svg
        width="180"
        height="60"
        viewBox="0 0 180 60"
        fill="none"
        style={{
          position: "absolute",
          zIndex: 3,
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="ecgGrad" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Shadow trace line */}
        <path
          d="M0 30 H50 L58 10 L66 50 L74 20 L82 40 L90 30 H180"
          stroke="rgba(56, 189, 248, 0.15)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Animated Dash Stroke */}
        <path
          d="M0 30 H50 L58 10 L66 50 L74 20 L82 40 L90 30 H180"
          stroke="url(#ecgGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="600"
          style={{
            animation: "tvEcgDash 1.8s ease-in-out infinite",
          }}
        />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   OPTI 2: ORBIT STETOSKOP & BINTANG PEDIATRI (PEDIATRIC)
   -------------------------------------------------------------------------- */
function PediatricAnimation() {
  return (
    <div
      style={{
        position: "relative",
        width: "140px",
        height: "140px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer Orbiting Ring 1 */}
      <div
        style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "1.5px dashed rgba(56, 189, 248, 0.4)",
          animation: "tvOrbitRotate 10s linear infinite",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#38BDF8",
            boxShadow: "0 0 10px #38BDF8",
          }}
        />
      </div>

      {/* Outer Orbiting Ring 2 (Reverse) */}
      <div
        style={{
          position: "absolute",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          border: "1.5px solid rgba(236, 72, 153, 0.3)",
          animation: "tvOrbitCounterRotate 7s linear infinite",
        }}
      >
        <span
          style={{
            position: "absolute",
            bottom: "-5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#EC4899",
            boxShadow: "0 0 10px #EC4899",
          }}
        />
      </div>

      {/* Floating Center Badge */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #0A0B5F 0%, #17186F 100%)",
          border: "1.5px solid rgba(56, 189, 248, 0.5)",
          boxShadow: "0 10px 25px rgba(10, 11, 95, 0.5), 0 0 15px rgba(236, 72, 153, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "tvFloatingBadge 2.8s ease-in-out infinite",
        }}
      >
        {/* Pediatric Stethoscope Icon */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 3v6a6 6 0 0012 0V3"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15v3a3 3 0 003 3h1a3 3 0 003-3v-1"
            stroke="#EC4899"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19" cy="14" r="2.5" fill="#F59E0B" />
          <circle cx="6" cy="3" r="1.5" fill="#38BDF8" />
          <circle cx="18" cy="3" r="1.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* Bouncing Dots Underneath */}
      <div
        style={{
          position: "absolute",
          bottom: "-10px",
          display: "flex",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#38BDF8",
            animation: "tvBouncingDots 1.4s infinite 0s",
          }}
        />
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#EC4899",
            animation: "tvBouncingDots 1.4s infinite 0.2s",
          }}
        />
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#F59E0B",
            animation: "tvBouncingDots 1.4s infinite 0.4s",
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   OPTI 3: GELOMBANG REHIDRASI & KAPSUL (FLUID WAVE)
   -------------------------------------------------------------------------- */
function FluidAnimation() {
  return (
    <div
      style={{
        position: "relative",
        width: "140px",
        height: "110px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Capsule Container */}
      <div
        style={{
          position: "relative",
          width: "110px",
          height: "54px",
          borderRadius: "27px",
          background: "rgba(15, 23, 42, 0.6)",
          border: "2px solid rgba(56, 189, 248, 0.6)",
          boxShadow: "0 0 20px rgba(56, 189, 248, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Shimmer Light Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)",
            transform: "skewX(-20deg)",
            zIndex: 4,
            animation: "tvShimmerGlow 2.2s infinite",
          }}
        />

        {/* Dual Liquid Waves */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "80%",
            zIndex: 2,
            opacity: 0.85,
          }}
        >
          <svg
            width="220"
            height="45"
            viewBox="0 0 220 45"
            fill="none"
            style={{
              animation: "tvWaveMoveOne 3s linear infinite",
            }}
          >
            <defs>
              <linearGradient id="fluidGrad1" x1="0" y1="0" x2="0" y2="45">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>
            <path
              d="M0 20 C 30 10, 70 30, 110 20 C 150 10, 190 30, 220 20 V 45 H 0 Z"
              fill="url(#fluidGrad1)"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200%",
            height: "85%",
            zIndex: 1,
            opacity: 0.5,
          }}
        >
          <svg
            width="220"
            height="45"
            viewBox="0 0 220 45"
            fill="none"
            style={{
              animation: "tvWaveMoveTwo 2.2s linear infinite",
            }}
          >
            <defs>
              <linearGradient id="fluidGrad2" x1="0" y1="0" x2="0" y2="45">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
            </defs>
            <path
              d="M0 15 C 40 30, 80 5, 110 20 C 140 35, 180 10, 220 25 V 45 H 0 Z"
              fill="url(#fluidGrad2)"
            />
          </svg>
        </div>

        {/* Rising Bubbles */}
        <span
          style={{
            position: "absolute",
            left: "25%",
            bottom: "5px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#FFFFFF",
            zIndex: 3,
            animation: "tvBubbleFloat 2s infinite 0.1s",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: "2px",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#FFFFFF",
            zIndex: 3,
            animation: "tvBubbleFloat 2.4s infinite 0.6s",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "75%",
            bottom: "8px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#FFFFFF",
            zIndex: 3,
            animation: "tvBubbleFloat 1.8s infinite 1.2s",
          }}
        />
      </div>
    </div>
  );
}
