"use client";

import { useRef, useState } from "react";
import { CHARTS } from "@/entities/immunization";
import type { ChartKey } from "@/entities/immunization";

const ZMIN = 0.5;
const ZMAX = 3;
const ZSTEP = 0.25;

const TABS: ReadonlyArray<{ id: ChartKey; label: string }> = [
  { id: "jadwal", label: "📅 Bagan Jadwal" },
  { id: "keterangan", label: "📝 Keterangan" },
];

function bulatkan(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Bagan Jadwal Imunisasi (port 1:1 dari island v17): dua tab gambar
 * (Jadwal/Keterangan) dengan kontrol zoom (−/+/Fit) dan klik gambar untuk
 * zoom cepat 2x. Zoom diterapkan lewat lebar gambar (persentase), identik
 * dengan logika applyZoom() di imunisasi-tool.html.
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
    <div className="imunisasi-card imunisasi-chart-card kartu">
      <div className="imn-tabs" role="tablist" aria-label="Pilih halaman bagan">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={chartKey === t.id}
            className={"imn-tab" + (chartKey === t.id ? " aktif" : "")}
            onClick={() => ubahChart(t.id)}
          >
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
    </div>
  );
}
