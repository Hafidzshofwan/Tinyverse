"use client";

import { useRef, useState } from "react";
import { CHARTS } from "@/entities/immunization";
import type { ChartKey } from "@/entities/immunization";

const ZMIN = 0.5;
const ZMAX = 3;
const ZSTEP = 0.25;

const TABS: ReadonlyArray<{ id: ChartKey; label: string; icon: React.ReactNode }> = [
  {
    id: "jadwal",
    label: "Bagan Jadwal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.6"/>
        <path d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V9H3V7Z" fill="#2563EB"/>
        <path d="M8 2V5M16 2V5" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7.5" cy="12.5" r="1.5" fill="#10B981"/>
        <circle cx="12" cy="12.5" r="1.5" fill="#F59E0B"/>
        <circle cx="16.5" cy="12.5" r="1.5" fill="#3B82F6"/>
        <circle cx="7.5" cy="16.5" r="1.5" fill="#EC4899"/>
        <path d="M11 17L12.5 18.5L16.5 14.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "keterangan",
    label: "Keterangan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" fill="#FDE68A" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="7" y="11" width="3" height="3" rx="1" fill="#EF4444"/>
        <path d="M12 12.5H17" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="7" y="16" width="3" height="3" rx="1" fill="#10B981"/>
        <path d="M12 17.5H17" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
];

function bulatkan(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Bagan Jadwal Imunisasi (port 1:1 dari island v17, gaya direstyle mengikuti
 * tema navy-magenta terpadu — sama seperti Lab/Darurat/Cairan): dua tab
 * gambar (Jadwal/Keterangan) dengan kontrol zoom (−/+/Fit) dan klik gambar
 * untuk zoom cepat 2x. Zoom diterapkan lewat lebar gambar (persentase),
 * identik dengan logika applyZoom() di imunisasi-tool.html.
 */
export function ScheduleChart() {
  const [chartKey, setChartKey] = useState<ChartKey>("jadwal");
  const [zoom, setZoom] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const chart = CHARTS[chartKey];

  function resetGeser() {
    if (wrapRef.current) {
      wrapRef.current.scrollTop = 0;
      wrapRef.current.scrollLeft = 0;
    }
  }

  function ubahChart(key: ChartKey) {
    setChartKey(key);
    setZoom(1);
    resetGeser();
  }

  function zoomIn() {
    setZoom((z) => Math.min(ZMAX, bulatkan(z + ZSTEP)));
  }
  function zoomOut() {
    setZoom((z) => Math.max(ZMIN, bulatkan(z - ZSTEP)));
  }
  function zoomFit() {
    setZoom(1);
    resetGeser();
  }
  function klikGambar() {
    setZoom((z) => (z >= 2 ? 1 : 2));
  }

  return (
    <>
      <div className="segmented-toggle" role="tablist" aria-label="Pilih halaman bagan">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={chartKey === t.id}
            className={"segmented-btn" + (chartKey === t.id ? " aktif" : "")}
            onClick={() => ubahChart(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="imunisasi-toolbar">
        <h3>{chart.title}</h3>
        <div className="imunisasi-toolbar-actions">
          <button
            type="button"
            className="imunisasi-zoom-btn"
            aria-label="Perkecil"
            onClick={zoomOut}
          >
            −
          </button>
          <span className="imunisasi-zoom-label">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="imunisasi-zoom-btn"
            aria-label="Perbesar"
            onClick={zoomIn}
          >
            +
          </button>
          <button type="button" className="imunisasi-zoom-btn" onClick={zoomFit}>
            Fit
          </button>
        </div>
      </div>

      <div className="imunisasi-image-wrap" ref={wrapRef}>
        {/* eslint-disable-next-line @next/next/no-img-element -- gambar statis, tidak butuh optimasi Next/Image */}
        <img
          className="imunisasi-image"
          src={chart.src}
          alt={chart.alt}
          style={{ width: zoom * 100 + "%" }}
          onClick={klikGambar}
        />
      </div>

      <p className="imunisasi-note">
        Ganti tab untuk melihat halaman <strong>Jadwal</strong> atau{" "}
        <strong>Keterangan</strong>. Gunakan tombol zoom (− / + / Fit) atau
        klik gambar untuk memperbesar; geser untuk menelusuri.
      </p>
    </>
  );
}
