"use client";

import { useState } from "react";
import {
  useAllTryoutStats,
  type RingkasanEvaluasiGlobal,
  type SubdivisiStatAkumulasi,
} from "./useTryoutStorage";
import {
  TryoutAnalyticsIcon,
  TryoutAccuracyIcon,
  TryoutTrophyScoreIcon,
  TryoutCheckIcon,
  TryoutCrossIcon,
} from "./TryoutIcons";
import { ClinicalSvgIcon } from "@/shared/ui";

// Mock data contoh untuk pratinjau saat user belum pernah mengerjakan ujian sama sekali
const CONTOH_EVALUASI_MOCK: RingkasanEvaluasiGlobal = {
  hasData: true,
  totalSesi: 4,
  rataRataAkurasi: 78,
  skorTertinggi: 87,
  totalSoalDikerjakan: 60,
  totalSoalBenar: 47,
  totalSoalSalah: 13,
  subdivisiStats: [
    {
      subdivisi: "gastrohepatologi",
      label: "Gastroenterohepatologi",
      totalSoal: 8,
      totalBenar: 4,
      persenAkurasi: 50,
    },
    {
      subdivisi: "nefrologi",
      label: "Nefrologi & Urologi Anak",
      totalSoal: 6,
      totalBenar: 4,
      persenAkurasi: 67,
    },
    {
      subdivisi: "respirologi",
      label: "Respirologi Anak",
      totalSoal: 10,
      totalBenar: 7,
      persenAkurasi: 70,
    },
    {
      subdivisi: "infeksi-tropis",
      label: "Infeksi & Pediatri Tropis",
      totalSoal: 12,
      totalBenar: 10,
      persenAkurasi: 83,
    },
    {
      subdivisi: "gawat-darurat",
      label: "Emergensi & Resusitasi",
      totalSoal: 10,
      totalBenar: 9,
      persenAkurasi: 90,
    },
    {
      subdivisi: "neonatologi",
      label: "Neonatologi & Perinatologi",
      totalSoal: 14,
      totalBenar: 13,
      persenAkurasi: 93,
    },
  ],
  trenSesi: [
    {
      id: "sim-1",
      paketId: "paket-1",
      paketJudul: "Simulasi Diagnostik Awal",
      tanggalISO: new Date(Date.now() - 6 * 86400000).toISOString(),
      labelTanggal: "Sesi 1",
      skorPersen: 60,
      jumlahBenar: 9,
      totalSoal: 15,
      lulus: false,
    },
    {
      id: "sim-2",
      paketId: "paket-2",
      paketJudul: "Drill Prediksi UKNPDPD 1",
      tanggalISO: new Date(Date.now() - 4 * 86400000).toISOString(),
      labelTanggal: "Sesi 2",
      skorPersen: 73,
      jumlahBenar: 11,
      totalSoal: 15,
      lulus: true,
    },
    {
      id: "sim-3",
      paketId: "paket-3",
      paketJudul: "Ujian Stase Pediatri",
      tanggalISO: new Date(Date.now() - 2 * 86400000).toISOString(),
      labelTanggal: "Sesi 3",
      skorPersen: 80,
      jumlahBenar: 12,
      totalSoal: 15,
      lulus: true,
    },
    {
      id: "sim-4",
      paketId: "paket-4",
      paketJudul: "Prediksi Komprehensif 2",
      tanggalISO: new Date().toISOString(),
      labelTanggal: "Sesi 4 (Terbaru)",
      skorPersen: 87,
      jumlahBenar: 13,
      totalSoal: 15,
      lulus: true,
    },
  ],
  subdivisiTerendah: {
    subdivisi: "gastrohepatologi",
    label: "Gastroenterohepatologi",
    totalSoal: 8,
    totalBenar: 4,
    persenAkurasi: 50,
  },
  subdivisiTertinggi: {
    subdivisi: "neonatologi",
    label: "Neonatologi & Perinatologi",
    totalSoal: 14,
    totalBenar: 13,
    persenAkurasi: 93,
  },
};

/**
 * Menghasilkan kurva mulus Bezier (Cubic Spline) dari sekumpulan titik data
 */
function getSmoothCurvePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const first = points[0];
  if (!first) return "";
  if (points.length === 1) return `M ${first.x} ${first.y}`;
  if (points.length === 2) {
    const second = points[1];
    if (!second) return `M ${first.x} ${first.y}`;
    return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} L ${second.x.toFixed(1)} ${second.y.toFixed(1)}`;
  }

  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function TryoutEvaluationDashboard({
  onBukaDaftarPaket,
}: {
  onBukaDaftarPaket?: () => void;
} = {}) {
  const { stats, isContohAktif, setContohAktif } = useAllTryoutStats();
  const [hoveredSesi, setHoveredSesi] = useState<number | null>(null);

  // Menentukan data yang dirender (data asli user atau data ilustrasi sampel)
  const isUsingSample = !stats.hasData && isContohAktif;
  const currentStats = stats.hasData ? stats : isUsingSample ? CONTOH_EVALUASI_MOCK : stats;

  const hasAnyData = stats.hasData || isUsingSample;

  // Status evaluasi akurasi global
  const statusAkurasiText = (() => {
    if (!hasAnyData) return "Belum Ada Data";
    if (currentStats.rataRataAkurasi >= 80) return "Tinggi / Sangat Baik";
    if (currentStats.rataRataAkurasi >= 66) return "Kompeten (Lulus SKDI)";
    return "Perlu Evaluasi Khusus";
  })();

  const statusAkurasiColor = (() => {
    if (!hasAnyData) return "abu";
    if (currentStats.rataRataAkurasi >= 80) return "tinggi";
    if (currentStats.rataRataAkurasi >= 66) return "sedang";
    return "kurang";
  })();

  return (
    <div id="tv-tryout-eval-dashboard" className="tv-tryout-dashboard-container">
      {/* ── Top Header Dashboard Evaluasi ───────────────────────────── */}
      <div className="tv-tryout-dash-header">
        <div className="tv-tryout-dash-header-left">
          <div className="tv-tryout-dash-icon-box">
            <TryoutAnalyticsIcon size={26} />
          </div>
          <div>
            <div className="tv-tryout-dash-title-row">
              <h2 className="tv-tryout-dash-title">
                Dashboard Evaluasi & Statistik Klinis
              </h2>
              {isUsingSample && (
                <span className="tv-tryout-badge-sample">
                  Mode Simulasi / Contoh Tampilan
                </span>
              )}
            </div>
            <p className="tv-tryout-dash-subtitle">
              Visualisasi persentase kebenaran, pemetaan grafik subdivisi, dan diagram tren evaluasi hasil belajar sebelum memulai paket ujian.
            </p>
          </div>
        </div>

        {/* Tombol switch data sampel untuk demonstrasi */}
        {!stats.hasData && (
          <div className="tv-tryout-dash-header-right">
            <button
              type="button"
              className={`tv-tryout-toggle-sample-btn ${isContohAktif ? "active" : ""}`}
              onClick={() => setContohAktif(!isContohAktif)}
            >
              <ClinicalSvgIcon name="refresh" size={14} />
              <span>
                {isContohAktif ? "Sembunyikan Contoh" : "Lihat Contoh Grafik & Statistik"}
              </span>
            </button>
          </div>
        )}
      </div>

      {!hasAnyData ? (
        /* ── State Saat Belum Ada Pengerjaan Try Out ────────────────── */
        <div className="tv-tryout-empty-eval-box">
          <div className="tv-tryout-empty-eval-icon">
            <TryoutAnalyticsIcon size={36} />
          </div>
          <div className="tv-tryout-empty-eval-content">
            <h3 className="tv-tryout-empty-eval-title">
              Evaluasi Akurasi Siap Merekam Pengerjaan Anda
            </h3>
            <p className="tv-tryout-empty-eval-desc">
              Data persentase ketepatan jawaban, diagram batang penguasaan materi subdivisi pediatri, serta kurva tren peningkatan skor akan tersaji di sini setelah Anda menyelesaikan simulasi ujian.
            </p>
            <div className="tv-tryout-empty-eval-actions">
              {onBukaDaftarPaket && (
                <button
                  type="button"
                  className="tv-btn tv-btn-primary tv-btn-sm"
                  onClick={onBukaDaftarPaket}
                >
                  Buka Daftar Paket Try Out
                </button>
              )}
              <button
                type="button"
                className="tv-btn tv-btn-secondary tv-btn-sm"
                onClick={() => setContohAktif(true)}
              >
                Tampilkan Contoh Grafik & Persentase Evaluasi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── 1. Kartu Indikator Kunci / Key Performance Indicators ─── */}
          <div className="tv-tryout-kpi-grid">
            {/* KPI 1: Rerata Akurasi */}
            <div className={`tv-tryout-kpi-card ${statusAkurasiColor}`}>
              <div className="tv-tryout-kpi-top">
                <span className="tv-tryout-kpi-label">Rata-Rata Akurasi</span>
                <span className={`tv-tryout-kpi-badge ${statusAkurasiColor}`}>
                  {statusAkurasiText}
                </span>
              </div>
              <div className="tv-tryout-kpi-val-row">
                <span className="tv-tryout-kpi-number">{currentStats.rataRataAkurasi}%</span>
                <span className="tv-tryout-kpi-sub">
                  dari {currentStats.totalSesi} sesi simulasi
                </span>
              </div>
              <div className="tv-tryout-kpi-bar-mini">
                <div
                  className={`tv-tryout-kpi-bar-fill ${statusAkurasiColor}`}
                  style={{ width: `${Math.min(100, Math.max(8, currentStats.rataRataAkurasi))}%` }}
                />
              </div>
            </div>

            {/* KPI 2: Skor Tertinggi */}
            <div className="tv-tryout-kpi-card highlight">
              <div className="tv-tryout-kpi-top">
                <span className="tv-tryout-kpi-label">Akurasi Terbaik</span>
                <TryoutTrophyScoreIcon size={18} />
              </div>
              <div className="tv-tryout-kpi-val-row">
                <span className="tv-tryout-kpi-number">{currentStats.skorTertinggi}%</span>
                <span className="tv-tryout-kpi-sub">Pencapaian skor puncak</span>
              </div>
              <p className="tv-tryout-kpi-note">
                Passing grade standar: <strong>66%</strong>
              </p>
            </div>

            {/* KPI 3: Akumulasi Butir Soal */}
            <div className="tv-tryout-kpi-card">
              <div className="tv-tryout-kpi-top">
                <span className="tv-tryout-kpi-label">Total Soal Dikerjakan</span>
                <TryoutAccuracyIcon size={18} />
              </div>
              <div className="tv-tryout-kpi-val-row">
                <span className="tv-tryout-kpi-number">{currentStats.totalSoalDikerjakan}</span>
                <span className="tv-tryout-kpi-sub">butir skenario klinis</span>
              </div>
              <div className="tv-tryout-kpi-ratio-line">
                <span className="tv-tryout-ratio-pill benar">
                  <TryoutCheckIcon size={12} />
                  <span>{currentStats.totalSoalBenar} Benar</span>
                </span>
                <span className="tv-tryout-ratio-pill salah">
                  <TryoutCrossIcon size={12} />
                  <span>{currentStats.totalSoalSalah} Salah</span>
                </span>
              </div>
            </div>

            {/* KPI 4: Subdivisi Prioritas Evaluasi */}
            <div className="tv-tryout-kpi-card prio">
              <div className="tv-tryout-kpi-top">
                <span className="tv-tryout-kpi-label">Fokus Penguatan</span>
                <span className="tv-tryout-kpi-badge warning">Perlu Evaluasi</span>
              </div>
              <div className="tv-tryout-kpi-val-row">
                <span className="tv-tryout-kpi-title-focus">
                  {currentStats.subdivisiTerendah?.label || "Komprehensif"}
                </span>
                <span className="tv-tryout-kpi-sub">
                  Akurasi: <strong>{currentStats.subdivisiTerendah?.persenAkurasi ?? 0}%</strong>
                </span>
              </div>
              <p className="tv-tryout-kpi-note-focus">
                Prioritaskan review konsep dan pembahasan skenario topik ini sebelum ujian.
              </p>
            </div>
          </div>

          {/* ── 2. Grid Visualisasi: Diagram Batang & Kurva Tren ───────── */}
          <div className="tv-tryout-charts-grid">
            {/* ── Diagram Batang Subdivisi (Horizontal Bar Chart) ─────── */}
            <div className="tv-tryout-chart-card">
              <div className="tv-tryout-chart-head">
                <div>
                  <h3 className="tv-tryout-chart-title">
                    Diagram Penguasaan Subdivisi Klinis
                  </h3>
                  <p className="tv-tryout-chart-desc">
                    Persentase akumulasi jawaban benar pada masing-masing subdivisi pediatri
                  </p>
                </div>
                <div className="tv-tryout-chart-legend">
                  <span className="tv-tryout-legend-item">
                    <span className="tv-tryout-legend-dot hijau" /> ≥ 80% Kuasai
                  </span>
                  <span className="tv-tryout-legend-item">
                    <span className="tv-tryout-legend-dot kuning" /> 60–79% Cukup
                  </span>
                  <span className="tv-tryout-legend-item">
                    <span className="tv-tryout-legend-dot merah" /> &lt; 60% Evaluasi
                  </span>
                </div>
              </div>

              <div className="tv-tryout-bar-chart-body">
                {currentStats.subdivisiStats.map((sub: SubdivisiStatAkumulasi) => {
                  const barColorClass =
                    sub.persenAkurasi >= 80
                      ? "hijau"
                      : sub.persenAkurasi >= 60
                      ? "kuning"
                      : "merah";

                  return (
                    <div key={sub.subdivisi} className="tv-tryout-bar-row">
                      <div className="tv-tryout-bar-label-group">
                        <span className="tv-tryout-bar-subdiv-name">{sub.label}</span>
                        <span className="tv-tryout-bar-ratio">
                          {sub.totalBenar}/{sub.totalSoal} Soal Benar
                        </span>
                      </div>

                      <div className="tv-tryout-bar-track-wrap">
                        <div className="tv-tryout-bar-track">
                          {/* Garis threshold batas 66% */}
                          <div
                            className="tv-tryout-bar-threshold"
                            style={{ left: "66%" }}
                            title="Batas Passing Grade (66%)"
                          />
                          <div
                            className={`tv-tryout-bar-fill ${barColorClass}`}
                            style={{ width: `${Math.max(6, sub.persenAkurasi)}%` }}
                          />
                        </div>
                        <span className={`tv-tryout-bar-percent-label ${barColorClass}`}>
                          {sub.persenAkurasi}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="tv-tryout-chart-footer-note">
                <span>Garis putus-putus vertikal menunjukkan ambang kompetensi kelulusan (66%).</span>
              </div>
            </div>

            {/* ── Diagram Tren Progres Ujian (Line / Curve Chart SVG) ─── */}
            <div className="tv-tryout-chart-card">
              <div className="tv-tryout-chart-head">
                <div>
                  <h3 className="tv-tryout-chart-title">
                    Diagram Tren Evaluasi Pengerjaan
                  </h3>
                  <p className="tv-tryout-chart-desc">
                    Grafik pergerakan persentase skor dari sesi ke sesi
                  </p>
                </div>
                <span className="tv-tryout-trend-badge">
                  {currentStats.trenSesi.length} Sesi Terakhir
                </span>
              </div>

              <div className="tv-tryout-line-chart-container">
                <svg
                  className="tv-tryout-trend-svg"
                  viewBox="0 0 540 230"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="tv-trend-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D936A6" stopOpacity="0.25" />
                      <stop offset="75%" stopColor="#D936A6" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#D936A6" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="tv-tag-shadow" x="-10%" y="-10%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0A0B5F" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Zona Hijau Lulus (Passing Zone >= 66%) */}
                  {(() => {
                    const yPassing = 180 - (66 / 100) * 145; // ~84.3
                    return (
                      <g>
                        <rect
                          x="46"
                          y="35"
                          width="474"
                          height={Math.max(0, yPassing - 35)}
                          fill="#10B981"
                          fillOpacity="0.05"
                          rx="4"
                        />
                        {/* Garis Passing Grade 66% */}
                        <line
                          x1="46"
                          y1={yPassing}
                          x2="520"
                          y2={yPassing}
                          stroke="#10B981"
                          strokeDasharray="5 4"
                          strokeWidth="1.5"
                        />
                        {/* Label Badge Target Lulus */}
                        <rect
                          x="414"
                          y={yPassing - 17}
                          width="106"
                          height="15"
                          rx="4"
                          fill="#ECFDF5"
                          stroke="#A7F3D0"
                          strokeWidth="1"
                        />
                        <text
                          x="467"
                          y={yPassing - 6}
                          textAnchor="middle"
                          fontSize="8.5"
                          fill="#047857"
                          fontWeight="700"
                        >
                          Target Lulus (≥66%)
                        </text>
                      </g>
                    );
                  })()}

                  {/* Garis grid horizontal (100%, 75%, 50%, 25%, 0%) */}
                  {[100, 75, 50, 25, 0].map((level) => {
                    const y = 180 - (level / 100) * 145;
                    const isBase = level === 0;
                    return (
                      <g key={level}>
                        <line
                          x1="46"
                          y1={y}
                          x2="520"
                          y2={y}
                          stroke={isBase ? "#CBD5E1" : "#E2E8F0"}
                          strokeDasharray={isBase ? undefined : "3 3"}
                          strokeWidth={isBase ? "1.2" : "1"}
                        />
                        <text
                          x="40"
                          y={y + 3.5}
                          textAnchor="end"
                          fontSize="9.5"
                          fill="#94A3B8"
                          fontWeight="600"
                        >
                          {level}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Kurva Mulus dan Titik Sesi */}
                  {(() => {
                    const sesiList = currentStats.trenSesi;
                    if (sesiList.length === 0) return null;

                    const startX = 72;
                    const endX = 492;
                    const availableWidth = endX - startX;
                    const count = sesiList.length;

                    const points = sesiList.map((sesi, idx) => {
                      const x =
                        count === 1
                          ? startX + availableWidth / 2
                          : startX + (idx / (count - 1)) * availableWidth;
                      const y = 180 - (sesi.skorPersen / 100) * 145;
                      return { x, y, sesi, idx };
                    });

                    // Kurva halus Bezier
                    const linePath = getSmoothCurvePath(points);

                    // Area fill di bawah garis
                    const firstPt = points[0];
                    const lastPt = points[points.length - 1];
                    if (!firstPt || !lastPt) return null;

                    const firstX = firstPt.x;
                    const lastX = lastPt.x;
                    const areaPath = `${linePath} L ${lastX.toFixed(1)} 180 L ${firstX.toFixed(1)} 180 Z`;

                    return (
                      <>
                        {/* Area di bawah garis gradien */}
                        <path d={areaPath} fill="url(#tv-trend-grad)" />

                        {/* Garis tren utama */}
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#D936A6"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Titik-titik node pengerjaan */}
                        {points.map((pt, idx) => {
                          const isHovered = hoveredSesi === idx;
                          const isLulus = pt.sesi.skorPersen >= 66;

                          return (
                            <g
                              key={idx}
                              onMouseEnter={() => setHoveredSesi(idx)}
                              onMouseLeave={() => setHoveredSesi(null)}
                              style={{ cursor: "pointer" }}
                            >
                              {/* Garis pemandu vertikal ke sumbu X */}
                              <line
                                x1={pt.x}
                                y1={pt.y}
                                x2={pt.x}
                                y2="180"
                                stroke={isHovered ? "#D936A6" : "#E2E8F0"}
                                strokeDasharray="3 3"
                                strokeWidth={isHovered ? "1.4" : "1"}
                                opacity={isHovered ? 0.9 : 0.4}
                              />

                              {/* Label badge nilai mengambang di atas titik */}
                              <rect
                                x={pt.x - 17}
                                y={pt.y - 24}
                                width="34"
                                height="16"
                                rx="4"
                                fill={isHovered ? "#0A0B5F" : isLulus ? "#047857" : "#BE123C"}
                                filter="url(#tv-tag-shadow)"
                              />
                              <text
                                x={pt.x}
                                y={pt.y - 12.5}
                                textAnchor="middle"
                                fontSize="9.5"
                                fontWeight="800"
                                fill="#FFFFFF"
                              >
                                {pt.sesi.skorPersen}%
                              </text>

                              {/* Lingkaran halo saat hover */}
                              {isHovered && (
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="11"
                                  fill={isLulus ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)"}
                                />
                              )}

                              {/* Dot node utama dengan border kontras */}
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isHovered ? "6" : "5"}
                                fill={isLulus ? "#10B981" : "#F43F5E"}
                                stroke="#FFFFFF"
                                strokeWidth="2.5"
                              />

                              {/* Sumbu X: Urutan Sesi */}
                              <text
                                x={pt.x}
                                y="198"
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#0A0B5F"
                              >
                                Sesi {idx + 1}
                              </text>

                              {/* Sumbu X: Tanggal Pengerjaan */}
                              <text
                                x={pt.x}
                                y="213"
                                textAnchor="middle"
                                fontSize="8.5"
                                fontWeight="500"
                                fill="#64748B"
                              >
                                {pt.sesi.labelTanggal}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Rincian sesi yang di-hover */}
              {(() => {
                const hoveredItem = hoveredSesi !== null ? currentStats.trenSesi[hoveredSesi] : null;
                if (!hoveredItem) return null;

                const isLulus = hoveredItem.skorPersen >= 66;

                return (
                  <div className="tv-tryout-hover-detail">
                    <span className="tv-tryout-hover-title">
                      {hoveredItem.labelTanggal}:{" "}
                      <strong>{hoveredItem.skorPersen}% Benar</strong> (
                      {hoveredItem.jumlahBenar}/{hoveredItem.totalSoal} Soal)
                    </span>
                    <span className={`tv-tryout-hover-badge ${isLulus ? "lulus" : "evaluasi"}`}>
                      {isLulus ? "Lulus Passing Grade" : "Di Bawah Passing Grade"}
                    </span>
                  </div>
                );
              })()}

              <div className="tv-tryout-chart-footer-note">
                <span>
                  Arahkan kursor ke titik sesi untuk melihat rasio kebenaran masing-masing paket.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
