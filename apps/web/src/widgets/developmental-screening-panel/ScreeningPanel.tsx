"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MchatForm } from "@/features/mchat-r";
import { KpspForm } from "@/features/kpsp";
import { DenverForm } from "@/features/denver";
import { ScreeningIcon, type IconStyleVariant } from "@/shared/ui";

interface AlatSkrining {
  id: string;
  emoji: string;
  nama: string;
  ringkas: string;
  usiaSasaran: string;
}

const DAFTAR_ALAT: AlatSkrining[] = [
  {
    id: "kpsp",
    emoji: "🌱",
    nama: "KPSP (Kuesioner Pra Skrining Perkembangan)",
    ringkas: "Skrining perkembangan umum anak (Pedoman SDIDTK Kemenkes 2022) — 10 pertanyaan ya/tidak.",
    usiaSasaran: "3 Bulan (berkelanjutan hingga 72 bulan)",
  },
  {
    id: "denver",
    emoji: "📊",
    nama: "Denver II (Denver Development Screening Test)",
    ringkas: "Skrining perkembangan komprehensif 4 sektor (Personal Sosial, Motorik Halus, Bahasa, Motorik Kasar).",
    usiaSasaran: "0–6 tahun (0–72 bulan)",
  },
  {
    id: "mchat",
    emoji: "🧩",
    nama: "M-CHAT-R",
    ringkas: "Skrining risiko autisme (ASD) — 20 pertanyaan ya/tidak.",
    usiaSasaran: "16–30 bulan",
  },
];

interface ScreeningPanelProps {
  iconVariant?: IconStyleVariant;
}

export function ScreeningPanel({ iconVariant = "svg-v1" }: ScreeningPanelProps = {}) {
  return (
    <Suspense fallback={<div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>Memuat Skrining Perkembangan...</div>}>
      <ScreeningPanelInner iconVariant={iconVariant} />
    </Suspense>
  );
}

function ScreeningPanelInner({ iconVariant = "svg-v1" }: ScreeningPanelProps) {
  const searchParams = useSearchParams();
  const [aktif, setAktif] = useState<string | null>(null);

  useEffect(() => {
    const tool = searchParams ? searchParams.get("tool") : null;
    if (tool === "mchat" || tool === "mchat-r") {
      setAktif("mchat");
    } else if (tool === "kpsp") {
      setAktif("kpsp");
    } else if (tool === "denver" || tool === "denver2") {
      setAktif("denver");
    }
  }, [searchParams]);

  if (aktif === "kpsp") {
    return <KpspForm onBack={() => setAktif(null)} />;
  }

  if (aktif === "denver") {
    return <DenverForm onBack={() => setAktif(null)} />;
  }

  if (aktif === "mchat") {
    return <MchatForm onBack={() => setAktif(null)} />;
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Top Header Section matching Growth Tracking Panel style */}
      <div
        style={{
          padding: "8px 0 16px 0",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ScreeningIcon id="header" variant={iconVariant} fallbackEmoji="🧩" size={38} />
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
                fontSize: "18.32px",
                fontWeight: 700,
                color: "#0A0B5F",
                lineHeight: 1.25,
              }}
            >
              Skrining Perkembangan
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Quicksand, system-ui, sans-serif",
                fontSize: "10.24px",
                fontWeight: 600,
                color: "#0A0B5F9E",
                lineHeight: 1.4,
              }}
            >
              Deteksi Dini &amp; Skrining Tumbuh Kembang Anak
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DAFTAR_ALAT.map((alat) => (
          <button
            key={alat.id}
            type="button"
            onClick={() => setAktif(alat.id)}
            className="tv-growth-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left",
              border: "1px solid #E2E8F0",
              background: "#fff",
              borderRadius: 18,
              padding: "16px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ScreeningIcon
                id={alat.id as "kpsp" | "denver" | "mchat"}
                variant={iconVariant}
                fallbackEmoji={alat.emoji}
                size={40}
              />
            </div>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: "#0a0b4f" }}>{alat.nama}</span>
              <span style={{ fontSize: 12.5, color: "#667085" }}>{alat.ringkas}</span>
              <span style={{ fontSize: 11.5, color: "#98A2B3", fontWeight: 600 }}>
                Usia sasaran: {alat.usiaSasaran}
              </span>
            </span>
          </button>
        ))}

        <div
          className="tv-growth-subcard"
          style={{
            border: "1px dashed #E2E8F0",
            borderRadius: 18,
            padding: "16px 18px",
            color: "#98A2B3",
            fontSize: 12.5,
            textAlign: "center",
          }}
        >
          Alat skrining lain (mis. Denver II) akan ditambahkan secara bertahap.
        </div>
      </div>
    </div>
  );
}
