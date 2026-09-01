"use client";

import { useState } from "react";
import type { PaketTryOut, HasilTryOut } from "./types";
import { ClinicalSvgIcon } from "@/shared/ui";
import {
  TryoutAnalyticsIcon,
  TryoutReviewDiscussionIcon,
  TryoutCheckIcon,
  TryoutCrossIcon,
  TryoutMinusIcon,
  TryoutTimerIcon,
  TryoutFlagIcon,
} from "./TryoutIcons";
import Link from "next/link";

interface TryoutResultViewProps {
  paket: PaketTryOut;
  hasil: HasilTryOut;
  onUlangi: () => void;
  onKembaliKeDaftar: () => void;
}

export function TryoutResultView({
  paket,
  hasil,
  onUlangi,
  onKembaliKeDaftar,
}: TryoutResultViewProps) {
  const [filterReview, setFilterReview] = useState<"semua" | "salah" | "benar" | "ragu">("semua");
  const [bukaSoalId, setBukaSoalId] = useState<string | null>(null);

  const durasiMenit = Math.floor(hasil.durasiDetikDigunakan / 60);
  const durasiDetik = hasil.durasiDetikDigunakan % 60;

  const soalFiltered = paket.daftarSoal.filter((soal) => {
    const userState = hasil.jawabanUser[soal.nomor];
    const isBenar = userState?.pilihan === soal.jawabanBenar;
    if (filterReview === "benar") return isBenar;
    if (filterReview === "salah") return !isBenar;
    if (filterReview === "ragu") return userState?.raguRagu;
    return true;
  });

  return (
    <div className="tv-tryout-result-page">
      {/* ── Banner Skor Utama ────────────────────────────────────────── */}
      <div className={`tv-tryout-result-banner ${hasil.lulus ? "lulus" : "evaluasi"}`}>
        <div className="tv-tryout-result-badge-row">
          <span className="tv-tryout-chip-kategori">{paket.kategoriLabel}</span>
        </div>

        <div className="tv-tryout-result-main">
          <div className="tv-tryout-score-circle">
            <span className="tv-tryout-score-number">{hasil.skorPersen}%</span>
            <span className="tv-tryout-score-target">Target ≥ {paket.passingGradePersen}%</span>
          </div>

          <div className="tv-tryout-result-meta">
            <h2 className="tv-tryout-status-title">
              {hasil.lulus ? "LULUS TRY OUT" : "BELUM MEMENUHI PASSING GRADE"}
            </h2>
            <p className="tv-tryout-status-desc">
              {hasil.lulus
                ? `Skor Anda telah memenuhi passing grade kelulusan UKNPDPD / stase anak (${paket.passingGradePersen}%). Pertahankan penalaran klinis Anda!`
                : `Skor Anda berada di bawah ambang kelulusan (${paket.passingGradePersen}%). Evaluasi pembahasan soal dan perdalam topik subdivisi di bawah ini.`}
            </p>
            <div className="tv-tryout-stat-pills">
              <span className="tv-tryout-stat-pill benar">
                <TryoutCheckIcon size={14} />
                <span>{hasil.jumlahBenar} Benar</span>
              </span>
              <span className="tv-tryout-stat-pill salah">
                <TryoutCrossIcon size={14} />
                <span>{hasil.jumlahSalah} Salah</span>
              </span>
              {hasil.jumlahKosong > 0 && (
                <span className="tv-tryout-stat-pill kosong">
                  <TryoutMinusIcon size={14} />
                  <span>{hasil.jumlahKosong} Kosong</span>
                </span>
              )}
              <span className="tv-tryout-stat-pill waktu">
                <TryoutTimerIcon size={14} />
                <span>{durasiMenit}m {durasiDetik}s</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analisis Performa Per Subdivisi ──────────────────────────── */}
      <div className="tv-tryout-subdivisi-card">
        <div className="tv-tryout-section-head">
          <TryoutAnalyticsIcon size={24} />
          <div>
            <h3 className="tv-tryout-section-title">Breakdown Nilai Subdivisi Pediatri</h3>
            <p className="tv-tryout-section-sub">Pemetaan kekuatan dan area materi yang perlu dievaluasi</p>
          </div>
        </div>

        <div className="tv-tryout-subdivisi-list">
          {hasil.rincianSubdivisi.map((sub) => (
            <div key={sub.subdivisi} className="tv-tryout-sub-item">
              <div className="tv-tryout-sub-header">
                <span className="tv-tryout-sub-name">{sub.label}</span>
                <span className="tv-tryout-sub-ratio">
                  {sub.benar}/{sub.total} Soal ({sub.persen}%)
                </span>
              </div>
              <div className="tv-tryout-progress-track">
                <div
                  className={`tv-tryout-progress-fill ${
                    sub.persen >= 80 ? "bagus" : sub.persen >= 60 ? "sedang" : "kurang"
                  }`}
                  style={{ width: `${Math.max(sub.persen, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Review Kunci Jawaban & Pembahasan ────────────────────────── */}
      <div className="tv-tryout-review-section">
        <div className="tv-tryout-review-header-wrap">
          <div className="tv-tryout-section-head">
            <TryoutReviewDiscussionIcon size={24} />
            <div>
              <h3 className="tv-tryout-section-title">Kunci Jawaban & Pembahasan Soal</h3>
              <p className="tv-tryout-section-sub">Pelajari rasionalisasi diagnosis dan eliminasi opsi jawaban</p>
            </div>
          </div>

          <div className="tv-tryout-filter-chips">
            <button
              className={`tv-tryout-filter-btn ${filterReview === "semua" ? "aktif" : ""}`}
              onClick={() => setFilterReview("semua")}
            >
              Semua ({paket.daftarSoal.length})
            </button>
            <button
              className={`tv-tryout-filter-btn salah ${filterReview === "salah" ? "aktif" : ""}`}
              onClick={() => setFilterReview("salah")}
            >
              Salah ({hasil.jumlahSalah})
            </button>
            <button
              className={`tv-tryout-filter-btn benar ${filterReview === "benar" ? "aktif" : ""}`}
              onClick={() => setFilterReview("benar")}
            >
              Benar ({hasil.jumlahBenar})
            </button>
            <button
              className={`tv-tryout-filter-btn ${filterReview === "ragu" ? "aktif" : ""}`}
              onClick={() => setFilterReview("ragu")}
            >
              Ragu-ragu
            </button>
          </div>
        </div>

        <div className="tv-tryout-review-list">
          {soalFiltered.map((soal) => {
            const userState = hasil.jawabanUser[soal.nomor];
            const isBenar = userState?.pilihan === soal.jawabanBenar;
            const isBuka = bukaSoalId === soal.id || filterReview !== "semua";

            return (
              <div
                key={soal.id}
                className={`tv-tryout-review-item ${isBenar ? "benar" : "salah"}`}
              >
                <div
                  className="tv-tryout-review-item-top"
                  onClick={() => setBukaSoalId(isBuka ? null : soal.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="tv-tryout-review-item-info">
                    <span className={`tv-tryout-no-badge ${isBenar ? "benar" : "salah"}`}>
                      No. {soal.nomor}
                    </span>
                    <span className="tv-tryout-item-subdiv">{soal.subdivisiLabel}</span>
                    {userState?.raguRagu && (
                      <span className="tv-tryout-item-ragu">
                        <TryoutFlagIcon size={12} />
                        <span>Ragu</span>
                      </span>
                    )}
                  </div>
                  <span className="tv-tryout-review-status-label">
                    {isBenar ? (
                      <>
                        <TryoutCheckIcon size={14} />
                        <span>Jawaban Benar</span>
                      </>
                    ) : (
                      <>
                        <TryoutCrossIcon size={14} />
                        <span>Jawaban Salah</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="tv-tryout-review-item-content">
                  {/* Vignette */}
                  <div className="tv-tryout-vignette-box">
                    <p className="tv-tryout-vignette-text">{soal.vignette}</p>
                  </div>

                  {/* Pertanyaan */}
                  <p className="tv-tryout-question-text">{soal.pertanyaan}</p>

                  {/* Opsi List */}
                  <div className="tv-tryout-review-options">
                    {soal.opsi.map((op) => {
                      const isKunci = op.id === soal.jawabanBenar;
                      const isDipilihUser = userState?.pilihan === op.id;
                      let classStatus = "";
                      if (isKunci) classStatus = "kunci-benar";
                      else if (isDipilihUser && !isBenar) classStatus = "pilihan-salah";

                      return (
                        <div
                          key={op.id}
                          className={`tv-tryout-review-option ${classStatus}`}
                        >
                          <span className="tv-tryout-option-id">{op.id.toUpperCase()}</span>
                          <span className="tv-tryout-option-text">{op.teks}</span>
                          {isKunci && (
                            <span className="tv-tryout-option-tag kunci">Kunci Jawaban</span>
                          )}
                          {isDipilihUser && !isKunci && (
                            <span className="tv-tryout-option-tag salah">Pilihan Anda</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Kotak Pembahasan */}
                  <div className="tv-tryout-explanation-box">
                    <div className="tv-tryout-exp-head">
                      <ClinicalSvgIcon name="lightbulb" size={18} />
                      <span className="tv-tryout-exp-title">Pembahasan & Analisis Kasus</span>
                    </div>
                    <p className="tv-tryout-exp-body">{soal.pembahasan}</p>

                    {soal.referensi && (
                      <div className="tv-tryout-exp-ref">
                        <strong>Referensi Pedoman:</strong> {soal.referensi}
                      </div>
                    )}

                    {soal.linkAlatTerkait && (
                      <div className="tv-tryout-tool-link-wrap">
                        <Link
                          href={soal.linkAlatTerkait.href}
                          className="tv-tryout-tool-link-btn"
                        >
                          <ClinicalSvgIcon name="alur" size={16} />
                          <span>{soal.linkAlatTerkait.label}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tombol Aksi Bawah ────────────────────────────────────────── */}
      <div className="tv-tryout-result-actions">
        <button
          className="tv-btn tv-btn-secondary tv-tryout-action-btn"
          onClick={onKembaliKeDaftar}
        >
          ← Kembali ke Daftar Paket
        </button>
        <button
          className="tv-btn tv-btn-primary tv-tryout-action-btn"
          onClick={onUlangi}
        >
          <ClinicalSvgIcon name="refresh" size={18} />
          <span>Ulangi Try Out</span>
        </button>
      </div>
    </div>
  );
}
