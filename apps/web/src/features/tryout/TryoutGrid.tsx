"use client";

import { useState } from "react";
import {
  PAKET_TRYOUT_LIST,
  PAKET_MINI_CBT_LIST,
  PAKET_PREDIKSI_JITU_LIST,
} from "./data";
import { TryoutExamRunner } from "./TryoutExamRunner";
import { TryoutResultView } from "./TryoutResultView";
import { useTryoutStorage } from "./useTryoutStorage";
import { TryoutEvaluationDashboard } from "./TryoutEvaluationDashboard";
import type { PaketTryOut, HasilTryOut } from "./types";
import {
  TryoutExamCardIcon,
  TryoutPlayCbtIcon,
  TryoutStudyModeIcon,
  TryoutDocumentIcon,
  TryoutTrophyScoreIcon,
  TryoutCheckIcon,
  TryoutAnalyticsIcon,
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
  const isMini = paket.kategori === "mini-cbt";

  return (
    <div id={`tv-tryout-card-${paket.id}`} className="tv-tryout-paket-card">
      <div className="tv-tryout-paket-card-top">
        <div className="tv-tryout-paket-icon-box">
          <TryoutExamCardIcon size={38} />
        </div>
        <div className="tv-tryout-paket-badge-group">
          <span className={`tv-tryout-badge-kategori ${isMini ? "mini-cbt" : "uknpdpd"}`}>
            {paket.kategoriLabel}
          </span>
          <span className="tv-tryout-badge-durasi">
            {paket.badge}
          </span>
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
            <TryoutCheckIcon size={16} />
            <span>Evaluasi Akurasi & Pembahasan</span>
          </span>
        </div>

        {skorTerbaik !== null ? (
          <div className="tv-tryout-paket-history">
            <div className="tv-tryout-history-row">
              <span className="tv-tryout-history-label">
                <TryoutTrophyScoreIcon size={15} />
                <span>Akurasi Tertinggi:</span>
              </span>
              <span
                className={`tv-tryout-history-score ${
                  skorTerbaik >= 80 ? "lulus" : "evaluasi"
                }`}
              >
                {skorTerbaik}% Akurasi Benar
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
          <span>{isMini ? "Mulai Mini CBT" : "Mulai Try Out CBT"}</span>
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

export function TryoutGrid({
  onActiveStateChange,
}: {
  onActiveStateChange?: (active: boolean) => void;
} = {}) {
  const [paketAktif, setPaketAktif] = useState<PaketTryOut | null>(null);
  const [modeAktif, setModeAktif] = useState<"cbt" | "latihan">("cbt");
  const [hasilAktif, setHasilAktif] = useState<HasilTryOut | null>(null);
  const [tabAktif, setTabAktif] = useState<"paket" | "evaluasi">("paket");
  const [filterKategori, setFilterKategori] = useState<"semua" | "mini-cbt" | "prediksi-jitu">("semua");

  const { simpanHasil } = useTryoutStorage(paketAktif?.id || "");

  function handleMulaiCBT(paket: PaketTryOut) {
    setPaketAktif(paket);
    setModeAktif("cbt");
    setHasilAktif(null);
    onActiveStateChange?.(true);
  }

  function handleMulaiLatihan(paket: PaketTryOut) {
    setPaketAktif(paket);
    setModeAktif("latihan");
    setHasilAktif(null);
    onActiveStateChange?.(true);
  }

  function handleSelesaiUjian(hasil: HasilTryOut) {
    simpanHasil(hasil);
    setHasilAktif(hasil);
    onActiveStateChange?.(true);
  }

  function handleUlangi() {
    setHasilAktif(null);
    onActiveStateChange?.(true);
  }

  function handleKembali() {
    setPaketAktif(null);
    setHasilAktif(null);
    onActiveStateChange?.(false);
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

      {/* ── Tab Switcher: Paket Try Out vs Evaluasi Klinis ───────── */}
      <div className="tv-tryout-main-tab-wrap" role="tablist">
        <button
          id="btn-tab-paket-tryout"
          type="button"
          role="tab"
          aria-selected={tabAktif === "paket"}
          className={`tv-tryout-main-tab-btn ${tabAktif === "paket" ? "active" : ""}`}
          onClick={() => setTabAktif("paket")}
        >
          <div className="tv-tryout-tab-icon">
            <TryoutPlayCbtIcon size={20} />
          </div>
          <div className="tv-tryout-tab-text-group">
            <span className="tv-tryout-tab-title">Daftar Paket Ujian</span>
            <span className="tv-tryout-tab-sub">Simulasi CBT & Latihan Mandiri</span>
          </div>
          <span className="tv-tryout-tab-badge">{PAKET_TRYOUT_LIST.length} Paket</span>
        </button>

        <button
          id="btn-tab-evaluasi-tryout"
          type="button"
          role="tab"
          aria-selected={tabAktif === "evaluasi"}
          className={`tv-tryout-main-tab-btn ${tabAktif === "evaluasi" ? "active" : ""}`}
          onClick={() => setTabAktif("evaluasi")}
        >
          <div className="tv-tryout-tab-icon">
            <TryoutAnalyticsIcon size={20} />
          </div>
          <div className="tv-tryout-tab-text-group">
            <span className="tv-tryout-tab-title">Dashboard & Evaluasi</span>
            <span className="tv-tryout-tab-sub">Akurasi, Subdivisi & Tren Skor</span>
          </div>
          <span className="tv-tryout-tab-badge">Analitik</span>
        </button>
      </div>

      {/* ── Konten Sesuai Tab Aktif ──────────────────────────────────── */}
      {tabAktif === "evaluasi" ? (
        <TryoutEvaluationDashboard onBukaDaftarPaket={() => setTabAktif("paket")} />
      ) : (
        <>
          {/* ── Header Bagian Paket & Filter Seri ────────────────────────── */}
          <div className="tv-tryout-grid-section-head">
            <h3 className="tv-tryout-grid-sec-title">Pilih Paket Ujian</h3>
            <span
              className="tv-tryout-grid-count-badge"
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {filterKategori === "semua"
                ? `${PAKET_TRYOUT_LIST.length} Paket Tersedia`
                : filterKategori === "mini-cbt"
                ? `${PAKET_MINI_CBT_LIST.length} Paket Mini CBT`
                : `${PAKET_PREDIKSI_JITU_LIST.length} Paket Prediksi Jitu`}
            </span>
          </div>

          <div className="tv-tryout-series-filter-wrap" role="group" aria-label="Filter kategori paket">
            <button
              id="btn-filter-semua-paket"
              type="button"
              className={`tv-tryout-series-btn ${filterKategori === "semua" ? "active" : ""}`}
              onClick={() => setFilterKategori("semua")}
            >
              <span>Semua Paket</span>
              <span className="tv-tryout-series-pill-count">{PAKET_TRYOUT_LIST.length}</span>
            </button>

            <button
              id="btn-filter-mini-cbt"
              type="button"
              className={`tv-tryout-series-btn ${filterKategori === "mini-cbt" ? "active" : ""}`}
              onClick={() => setFilterKategori("mini-cbt")}
            >
              <span>Mini CBT (15 Soal)</span>
              <span className="tv-tryout-series-pill-count">{PAKET_MINI_CBT_LIST.length}</span>
            </button>

            <button
              id="btn-filter-prediksi-jitu"
              type="button"
              className={`tv-tryout-series-btn ${filterKategori === "prediksi-jitu" ? "active" : ""}`}
              onClick={() => setFilterKategori("prediksi-jitu")}
            >
              <span>Prediksi Jitu UKNPDPD (25 Soal)</span>
              <span className="tv-tryout-series-pill-count">{PAKET_PREDIKSI_JITU_LIST.length}</span>
            </button>
          </div>

          {/* ── Urutan Seri 1: Mini CBT Pediatri (15 Soal) ──────────────── */}
          {(filterKategori === "semua" || filterKategori === "mini-cbt") && (
            <div className="tv-tryout-series-block">
              {filterKategori === "semua" && (
                <div className="tv-tryout-series-section-header">
                  <div className="tv-tryout-series-section-title-group">
                    <h4 className="tv-tryout-series-section-title">
                      Mini CBT Pediatri
                    </h4>
                    <p className="tv-tryout-series-section-desc">
                      Latihan cepat 15 soal klinis (durasi 15 menit) dengan urutan Paket 1 – 3 untuk penguatan konsep harian.
                    </p>
                  </div>
                  <span
                    className="tv-tryout-grid-count-badge"
                    style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {PAKET_MINI_CBT_LIST.length} Paket
                  </span>
                </div>
              )}

              <div className="tv-tryout-paket-grid">
                {PAKET_MINI_CBT_LIST.map((paket) => (
                  <PaketKartu
                    key={paket.id}
                    paket={paket}
                    onMulaiCBT={handleMulaiCBT}
                    onMulaiLatihan={handleMulaiLatihan}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Urutan Seri 2: Try Out Prediksi Jitu UKNPDPD (25 Soal) ────── */}
          {(filterKategori === "semua" || filterKategori === "prediksi-jitu") && (
            <div
              className="tv-tryout-series-block"
              style={{ marginTop: filterKategori === "semua" ? "1.5rem" : "0.5rem" }}
            >
              {filterKategori === "semua" && (
                <div className="tv-tryout-series-section-header">
                  <div className="tv-tryout-series-section-title-group">
                    <h4 className="tv-tryout-series-section-title">
                      Try Out Prediksi Jitu UKNPDPD
                    </h4>
                    <p className="tv-tryout-series-section-desc">
                      Simulasi intensif 25 soal kasus klinis komprehensif (durasi 25 menit) dengan urutan Paket 1 – 4 berstandar SKDI.
                    </p>
                  </div>
                  <span
                    className="tv-tryout-grid-count-badge"
                    style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {PAKET_PREDIKSI_JITU_LIST.length} Paket
                  </span>
                </div>
              )}

              <div className="tv-tryout-paket-grid">
                {PAKET_PREDIKSI_JITU_LIST.map((paket) => (
                  <PaketKartu
                    key={paket.id}
                    paket={paket}
                    onMulaiCBT={handleMulaiCBT}
                    onMulaiLatihan={handleMulaiLatihan}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
