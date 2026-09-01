"use client";

import { useState } from "react";
import { PAKET_TRYOUT_LIST } from "./data";
import { TryoutExamRunner } from "./TryoutExamRunner";
import { TryoutResultView } from "./TryoutResultView";
import { useTryoutStorage } from "./useTryoutStorage";
import type { PaketTryOut, HasilTryOut } from "./types";
import {
  TryoutExamCardIcon,
  TryoutPlayCbtIcon,
  TryoutStudyModeIcon,
  TryoutDocumentIcon,
  TryoutTimerIcon,
  TryoutTargetIcon,
  TryoutTrophyScoreIcon,
  TryoutCheckIcon,
} from "./TryoutIcons";

function PaketKartu({
  paket,
  onMulaiCBT,
  onMulaiLatihan,
}: {
  paket: PaketTryOut;
  onMulaiCBT: (paket: PaketTryOut) => void;
  onMulaiLatihan: (paket: PaketTryOut) => void;
}) {
  const { skorTerbaik, jumlahPercobaan, riwayat } = useTryoutStorage(paket.id);
  const hasilTerakhir = riwayat[0];

  return (
    <div id={`tv-tryout-card-${paket.id}`} className="tv-tryout-paket-card">
      <div className="tv-tryout-paket-card-top">
        <div className="tv-tryout-paket-icon-box">
          <TryoutExamCardIcon size={38} />
        </div>
        <div className="tv-tryout-paket-badge-group">
          <span className="tv-tryout-badge-kategori">{paket.kategoriLabel}</span>
        </div>
      </div>

      <div className="tv-tryout-paket-body">
        <h3 className="tv-tryout-paket-title">{paket.judul}</h3>
        <p className="tv-tryout-paket-desc">{paket.deskripsi}</p>

        <div className="tv-tryout-paket-meta-list">
          <span className="tv-tryout-meta-item">
            <TryoutDocumentIcon size={16} />
            <span><strong>{paket.daftarSoal.length}</strong> Soal Kasus</span>
          </span>
          <span className="tv-tryout-meta-item">
            <TryoutTimerIcon size={16} />
            <span><strong>{paket.durasiMenit}</strong> Menit</span>
          </span>
          <span className="tv-tryout-meta-item">
            <TryoutTargetIcon size={16} />
            <span>Passing Grade <strong>{paket.passingGradePersen}%</strong></span>
          </span>
        </div>

        {skorTerbaik !== null ? (
          <div className="tv-tryout-paket-history">
            <div className="tv-tryout-history-row">
              <span className="tv-tryout-history-label">
                <TryoutTrophyScoreIcon size={15} />
                <span>Skor Tertinggi:</span>
              </span>
              <span
                className={`tv-tryout-history-score ${
                  skorTerbaik >= paket.passingGradePersen ? "lulus" : "evaluasi"
                }`}
              >
                {skorTerbaik}% {skorTerbaik >= paket.passingGradePersen ? "(Lulus)" : "(Perlu Evaluasi)"}
              </span>
            </div>
            <div className="tv-tryout-history-sub">
              Dikerjakan {jumlahPercobaan}×
              {hasilTerakhir?.tanggalISO && (
                <>
                  {" "}· Terakhir:{" "}
                  {new Date(hasilTerakhir.tanggalISO).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="tv-tryout-paket-history belum">
            <span>Belum pernah dikerjakan</span>
          </div>
        )}
      </div>

      <div className="tv-tryout-paket-actions">
        <button
          id={`btn-mulai-cbt-${paket.id}`}
          className="tv-btn tv-btn-primary tv-tryout-btn-main"
          onClick={() => onMulaiCBT(paket)}
        >
          <TryoutPlayCbtIcon size={18} />
          <span>Mulai Try Out CBT</span>
        </button>
        <button
          id={`btn-mulai-latihan-${paket.id}`}
          className="tv-btn tv-btn-secondary tv-tryout-btn-sub"
          onClick={() => onMulaiLatihan(paket)}
        >
          <TryoutStudyModeIcon size={18} />
          <span>Mode Latihan Mandiri</span>
        </button>
      </div>
    </div>
  );
}

export function TryoutGrid() {
  const [paketAktif, setPaketAktif] = useState<PaketTryOut | null>(null);
  const [modeAktif, setModeAktif] = useState<"cbt" | "latihan">("cbt");
  const [hasilAktif, setHasilAktif] = useState<HasilTryOut | null>(null);

  const { simpanHasil } = useTryoutStorage(paketAktif?.id || "");

  function handleMulaiCBT(paket: PaketTryOut) {
    setPaketAktif(paket);
    setModeAktif("cbt");
    setHasilAktif(null);
  }

  function handleMulaiLatihan(paket: PaketTryOut) {
    setPaketAktif(paket);
    setModeAktif("latihan");
    setHasilAktif(null);
  }

  function handleSelesaiUjian(hasil: HasilTryOut) {
    simpanHasil(hasil);
    setHasilAktif(hasil);
  }

  function handleUlangi() {
    setHasilAktif(null);
  }

  function handleKembali() {
    setPaketAktif(null);
    setHasilAktif(null);
  }

  // Jika sedang melihat hasil
  if (paketAktif && hasilAktif) {
    return (
      <TryoutResultView
        paket={paketAktif}
        hasil={hasilAktif}
        onUlangi={handleUlangi}
        onKembaliKeDaftar={handleKembali}
      />
    );
  }

  // Jika sedang mengerjakan ujian
  if (paketAktif) {
    return (
      <TryoutExamRunner
        paket={paketAktif}
        mode={modeAktif}
        onSelesai={handleSelesaiUjian}
        onKeluar={handleKembali}
      />
    );
  }

  // Tampilan Beranda Daftar Paket Try Out
  return (
    <div className="tv-tryout-page">
      {/* ── Banner Pengantar Try Out ─────────────────────────────────── */}
      <div className="tv-tryout-intro-card">
        <div className="tv-tryout-intro-left">
          <span className="tv-tryout-intro-pill">Ujian Kompetensi Dokter</span>
          <h2 className="tv-tryout-intro-title">
            Simulasi Try Out UKNPDPD & Ujian Stase
          </h2>
          <p className="tv-tryout-intro-desc">
            Simulasi Computer-Based Test (CBT) pediatri berstandar UKNPDPD dan ujian stase anak. Dilengkapi timer waktu nyata, navigasi nomor soal, analisis per subdivisi, serta kunci pembahasan lengkap.
          </p>
          <div className="tv-tryout-feature-bullets">
            <div className="tv-tryout-feat-item">
              <TryoutCheckIcon size={16} />
              <span>Soal kasus klinis komprehensif</span>
            </div>
            <div className="tv-tryout-feat-item">
              <TryoutCheckIcon size={16} />
              <span>Timer & lembar navigasi nomor soal CBT</span>
            </div>
            <div className="tv-tryout-feat-item">
              <TryoutCheckIcon size={16} />
              <span>Kunci jawaban & pembahasan berbasis ilmiah</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Header Bagian Paket ─────────────────────────────────────── */}
      <div className="tv-tryout-grid-section-head">
        <h3 className="tv-tryout-grid-sec-title">Daftar Paket Try Out</h3>
        <span className="tv-tryout-grid-count-badge">
          {PAKET_TRYOUT_LIST.length} Paket Ujian
        </span>
      </div>

      {/* ── Daftar Grid Paket ────────────────────────────────────────── */}
      <div className="tv-tryout-paket-grid">
        {PAKET_TRYOUT_LIST.map((paket) => (
          <PaketKartu
            key={paket.id}
            paket={paket}
            onMulaiCBT={handleMulaiCBT}
            onMulaiLatihan={handleMulaiLatihan}
          />
        ))}
      </div>
    </div>
  );
}
