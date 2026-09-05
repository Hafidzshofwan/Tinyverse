"use client";

import { useState } from "react";
import type { PaketTryOut, HasilTryOut } from "./types";
import { ClinicalSvgIcon, SidebarIcon, type SidebarIconSlug } from "@/shared/ui";
import {
  TryoutReviewDiscussionIcon,
  TryoutCheckIcon,
  TryoutCrossIcon,
  TryoutMinusIcon,
  TryoutAccuracyIcon,
} from "./TryoutIcons";
import Link from "next/link";

function dapatkanIconSlugUntukMenu(
  href: string,
  label?: string,
  explicitIcon?: string
): SidebarIconSlug {
  if (explicitIcon) {
    const validSlugs: SidebarIconSlug[] = [
      "beranda",
      "ai-assistant",
      "darurat",
      "alur",
      "dosis",
      "cairan",
      "puyer",
      "obat",
      "tekanan-darah",
      "egfr",
      "neonatus",
      "tumbuh-kembang",
      "kpsp",
      "skoring",
      "lab",
      "protokol",
      "imunisasi",
      "ringkasan",
      "pembelajaran",
    ];
    if (validSlugs.includes(explicitIcon as SidebarIconSlug)) {
      return explicitIcon as SidebarIconSlug;
    }
  }

  const path = (href || "").toLowerCase();
  const lbl = (label || "").toLowerCase();

  // 1. Prioritas pemetaan spesifik KPSP (Skrining Perkembangan Anak / SDIDTK)
  if (
    path.includes("kpsp") ||
    lbl.includes("kpsp") ||
    lbl.includes("skrining perkembangan") ||
    lbl.includes("sdidtk")
  ) {
    return "kpsp";
  }

  // 2. Prioritas pemetaan berdasarkan rute halaman / path URL
  if (path.includes("/skoring")) return "skoring";
  if (path.includes("/bilirubin") || path.includes("/tpn-neonatus") || path.includes("/neonatus")) return "neonatus";
  if (path.includes("/fluids") || path.includes("/cairan") || path.includes("/burn")) return "cairan";
  if (path.includes("/puyer")) return "puyer";
  if (path.includes("/dosis") || path.includes("/dosing")) return "dosis";
  if (path.includes("/obat")) return "obat";
  if (path.includes("/pertumbuhan") || path.includes("/tumbuh-kembang")) return "tumbuh-kembang";
  if (path.includes("/imunisasi")) return "imunisasi";
  if (path.includes("/darurat") || path.includes("/gcs")) return "darurat";
  if (path.includes("/tekanan-darah")) return "tekanan-darah";
  if (path.includes("/egfr")) return "egfr";
  if (path.includes("/lab") || path.includes("/agd")) return "lab";
  if (path.includes("/guideline") || path.includes("/protokol")) return "protokol";
  if (path.includes("/ringkasan")) return "ringkasan";
  if (path.includes("/ai-assistant")) return "ai-assistant";
  if (path.includes("/pembelajaran") || path.includes("/kasus") || path.includes("/kuis")) return "pembelajaran";
  if (path.includes("/alur")) return "alur";

  // 3. Pemetaan sekunder berdasarkan teks judul/label tautan alat
  if (lbl.includes("skoring") || lbl.includes("downes") || lbl.includes("score")) return "skoring";
  if (lbl.includes("neonatus") || lbl.includes("bilirubin") || lbl.includes("ikterus") || lbl.includes("bayi")) return "neonatus";
  if (lbl.includes("cairan") || lbl.includes("rehidrasi") || lbl.includes("dehidrasi") || lbl.includes("diare")) return "cairan";
  if (lbl.includes("puyer") || lbl.includes("racik")) return "puyer";
  if (lbl.includes("obat") || lbl.includes("dosis") || lbl.includes("farmakologi") || lbl.includes("antibiotik")) return "obat";
  if (lbl.includes("tumbuh") || lbl.includes("kembang") || lbl.includes("gizi") || lbl.includes("antropometri") || lbl.includes("pertumbuhan")) return "tumbuh-kembang";
  if (lbl.includes("imunisasi") || lbl.includes("vaksin")) return "imunisasi";
  if (lbl.includes("darurat") || lbl.includes("resusitasi") || lbl.includes("emergency") || lbl.includes("pals")) return "darurat";
  if (lbl.includes("tekanan darah") || lbl.includes("tensi") || lbl.includes("hipertensi")) return "tekanan-darah";
  if (lbl.includes("egfr") || lbl.includes("ginjal") || lbl.includes("schwartz")) return "egfr";
  if (lbl.includes("lab") || lbl.includes("hematologi") || lbl.includes("analisis gas")) return "lab";
  if (lbl.includes("guideline") || lbl.includes("pedoman") || lbl.includes("protokol")) return "protokol";
  if (lbl.includes("ringkasan") || lbl.includes("resume")) return "ringkasan";
  if (lbl.includes("asisten") || lbl.includes("ai")) return "ai-assistant";
  if (lbl.includes("ruang belajar") || lbl.includes("pembelajaran") || lbl.includes("tryout") || lbl.includes("drill")) return "pembelajaran";
  if (lbl.includes("alur") || lbl.includes("tatalaksana") || lbl.includes("tata laksana") || lbl.includes("algoritma")) return "alur";

  return "alur";
}

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
  const [filterReview, setFilterReview] = useState<"semua" | "salah" | "benar">("semua");
  const [bukaSoalId, setBukaSoalId] = useState<string | null>(null);

  // Filter soal untuk daftar review
  const soalFiltered = paket.daftarSoal.filter((soal) => {
    const userState = hasil.jawabanUser[soal.nomor];
    const isBenar = userState?.pilihan === soal.jawabanBenar;

    if (filterReview === "benar") return isBenar;
    if (filterReview === "salah") return !isBenar;
    return true;
  });

  const durasiMenit = Math.floor(hasil.durasiDetikDigunakan / 60);
  const durasiDetikSisa = hasil.durasiDetikDigunakan % 60;
  const durasiFormat = `${durasiMenit}m ${durasiDetikSisa}d`;

  const akurasiClass =
    hasil.skorPersen >= 80 ? "tinggi" : hasil.skorPersen >= 60 ? "sedang" : "perlu-evaluasi";

  return (
    <div className="tv-tryout-result-page">
      {/* ── 1. Banner Hasil Pengerjaan ─────────────────────────────────── */}
      <div id="tv-tryout-eval-banner" className={`tv-tryout-result-banner ${akurasiClass}`}>
        <div className="tv-tryout-result-badge-row">
          <span className="tv-tryout-chip-kategori">{paket.kategoriLabel}</span>
          <span className="tv-tryout-chip-eval">Hasil Pengerjaan</span>
        </div>

        <div className="tv-tryout-result-main">
          <div className="tv-tryout-score-circle">
            <span className="tv-tryout-score-number">{hasil.skorPersen}%</span>
            <span className="tv-tryout-score-target">
              Passing: {paket.passingGradePersen}%
            </span>
          </div>

          <div className="tv-tryout-result-meta">
            <h2 className="tv-tryout-status-title">
              {hasil.lulus
                ? "Selamat! Anda Memenuhi Nilai Kelulusan"
                : "Hasil Try Out: Perlu Evaluasi Materi"}
            </h2>
            <p className="tv-tryout-status-desc">
              Menjawab {hasil.jumlahBenar} benar dari total {hasil.totalSoal} butir soal kasus klinis.
            </p>

            {/* Metriks Kebenaran Jawaban */}
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
                  <span>{hasil.jumlahKosong} Tidak Dijawab</span>
                </span>
              )}
              <span className="tv-tryout-stat-pill total">
                <TryoutAccuracyIcon size={14} />
                <span>{hasil.totalSoal} Total Soal</span>
              </span>
              <span className="tv-tryout-stat-pill waktu">
                <ClinicalSvgIcon name="history" size={14} />
                <span>{durasiFormat}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Review Kunci Jawaban & Pembahasan ──────────────────────── */}
      <div id="tv-tryout-review-section" className="tv-tryout-review-section">
        <div className="tv-tryout-review-header-wrap">
          <div className="tv-tryout-section-head">
            <TryoutReviewDiscussionIcon size={24} />
            <div>
              <h3 className="tv-tryout-section-title">Kunci Jawaban & Pembahasan Kasus</h3>
              <p className="tv-tryout-section-sub">
                Pelajari analisis diagnosis, rasionalisasi penanganan, dan eliminasi opsi
              </p>
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
          </div>
        </div>

        <div className="tv-tryout-review-list">
          {soalFiltered.length === 0 ? (
            <div className="tv-tryout-review-empty">
              <p>Tidak ada soal yang sesuai dengan filter yang dipilih.</p>
            </div>
          ) : (
            soalFiltered.map((soal) => {
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
                      <span className="tv-tryout-item-subdiv">Divisi: {soal.subdivisiLabel}</span>
                      <span className="tv-tryout-soal-skdi-badge">SKDI {soal.tingkatSKDI}</span>
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
                            <SidebarIcon
                              slug={dapatkanIconSlugUntukMenu(
                                soal.linkAlatTerkait.href,
                                soal.linkAlatTerkait.label,
                                soal.linkAlatTerkait.iconSlug || soal.linkAlatTerkait.icon
                              )}
                              size={18}
                            />
                            <span>{soal.linkAlatTerkait.label}</span>
                            <span aria-hidden="true" className="tv-tryout-tool-arrow">→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 3. Tombol Aksi Bawah ──────────────────────────────────────── */}
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
