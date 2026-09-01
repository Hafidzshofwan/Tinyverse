"use client";

import { useState, useEffect, useRef } from "react";
import type { PaketTryOut, HasilTryOut, OpsiId, StatusJawabanUser, SubdivisiSKDI, SubdivisiScore } from "./types";
import {
  TryoutTimerIcon,
  TryoutGridSheetIcon,
  TryoutFlagIcon,
  TryoutExitIcon,
  TryoutExamCardIcon,
  TryoutWarningAlertIcon,
} from "./TryoutIcons";

interface TryoutExamRunnerProps {
  paket: PaketTryOut;
  mode: "cbt" | "latihan";
  onSelesai: (hasil: HasilTryOut) => void;
  onKeluar: () => void;
}

export function TryoutExamRunner({
  paket,
  mode,
  onSelesai,
  onKeluar,
}: TryoutExamRunnerProps) {
  const [indexSoal, setIndexSoal] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<number, StatusJawabanUser>>({});
  const [detikTersisa, setDetikTersisa] = useState(paket.durasiMenit * 60);
  const [tampilkanModalSubmit, setTampilkanModalSubmit] = useState(false);
  const [tampilkanGridDrawer, setTampilkanGridDrawer] = useState(false);
  const waktuMulaiRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleFinalSubmitRef = useRef<() => void>(() => {});

  const totalSoal = paket.daftarSoal.length;
  const safeIndex = Math.min(Math.max(0, indexSoal), Math.max(0, totalSoal - 1));
  const soalAktif = paket.daftarSoal[safeIndex];

  // Inisialisasi status jawaban jika belum ada
  function getStatus(nomor: number): StatusJawabanUser {
    return jawabanUser[nomor] || { pilihan: null, raguRagu: false };
  }

  // Hitung statistik jawaban saat ini
  const jumlahTerjawab = Object.values(jawabanUser).filter((s) => s.pilihan !== null).length;
  const jumlahRagu = Object.values(jawabanUser).filter((s) => s.raguRagu).length;
  const jumlahKosong = totalSoal - jumlahTerjawab;

  // Timer countdown untuk Mode CBT
  useEffect(() => {
    if (mode !== "cbt") return;

    timerRef.current = setInterval(() => {
      setDetikTersisa((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  function handlePilihJawaban(opsiId: OpsiId) {
    if (!soalAktif) return;
    setJawabanUser((prev) => {
      const current = prev[soalAktif.nomor] || { pilihan: null, raguRagu: false };
      return {
        ...prev,
        [soalAktif.nomor]: {
          ...current,
          pilihan: opsiId,
        },
      };
    });
  }

  function handleToggleRagu() {
    if (!soalAktif) return;
    setJawabanUser((prev) => {
      const current = prev[soalAktif.nomor] || { pilihan: null, raguRagu: false };
      return {
        ...prev,
        [soalAktif.nomor]: {
          ...current,
          raguRagu: !current.raguRagu,
        },
      };
    });
  }

  function handleFinalSubmit() {
    if (timerRef.current) clearInterval(timerRef.current);

    const detikDigunakan = Math.round((Date.now() - waktuMulaiRef.current) / 1000);

    let benar = 0;
    let salah = 0;
    let kosong = 0;

    const mapSubdivisi: Record<string, { total: number; benar: number; label: string }> = {};

    paket.daftarSoal.forEach((soal) => {
      const subKey = soal.subdivisi;
      if (!mapSubdivisi[subKey]) {
        mapSubdivisi[subKey] = { total: 0, benar: 0, label: soal.subdivisiLabel };
      }
      mapSubdivisi[subKey].total += 1;

      const userState = jawabanUser[soal.nomor];
      if (!userState || userState.pilihan === null) {
        kosong += 1;
      } else if (userState.pilihan === soal.jawabanBenar) {
        benar += 1;
        mapSubdivisi[subKey].benar += 1;
      } else {
        salah += 1;
      }
    });

    const skorPersen = Math.round((benar / totalSoal) * 100);
    const lulus = skorPersen >= paket.passingGradePersen;

    const rincianSubdivisi: SubdivisiScore[] = Object.entries(mapSubdivisi).map(
      ([key, val]) => ({
        subdivisi: key as SubdivisiSKDI,
        label: val.label,
        total: val.total,
        benar: val.benar,
        persen: Math.round((val.benar / val.total) * 100),
      })
    );

    const hasil: HasilTryOut = {
      paketId: paket.id,
      tanggalISO: new Date().toISOString(),
      totalSoal,
      jumlahBenar: benar,
      jumlahSalah: salah,
      jumlahKosong: kosong,
      skorPersen,
      lulus,
      durasiDetikDigunakan: detikDigunakan,
      rincianSubdivisi,
      jawabanUser,
    };

    onSelesai(hasil);
  }

  handleFinalSubmitRef.current = handleFinalSubmit;

  const menitTersisa = Math.floor(detikTersisa / 60);
  const sisaDetikFormat = (detikTersisa % 60).toString().padStart(2, "0");
  const isKritisTimer = detikTersisa < 180 && mode === "cbt"; // di bawah 3 menit

  if (!soalAktif) {
    return null;
  }

  const statusSoalAktif = getStatus(soalAktif.nomor);

  return (
    <div className="tv-tryout-exam-wrap">
      {/* ── CBT Top Header Bar ────────────────────────────────────────── */}
      <div className="tv-tryout-cbt-header">
        <div className="tv-tryout-cbt-header-left">
          <button
            className="tv-tryout-cbt-exit-btn"
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin keluar dari sesi Try Out ini?")) {
                onKeluar();
              }
            }}
            title="Keluar dari ujian"
          >
            <TryoutExitIcon size={13} />
            <span>Keluar</span>
          </button>
          <div className="tv-tryout-cbt-title-block">
            <h2 className="tv-tryout-cbt-title">{paket.judul}</h2>
            <span className="tv-tryout-cbt-mode-badge">
              {mode === "cbt" ? "Mode Ujian CBT" : "Mode Latihan Mandiri"}
            </span>
          </div>
        </div>

        <div className="tv-tryout-cbt-header-right">
          {mode === "cbt" && (
            <div className={`tv-tryout-timer-pill ${isKritisTimer ? "kritis" : ""}`}>
              <TryoutTimerIcon size={16} />
              <span className="tv-tryout-timer-text">
                {menitTersisa}:{sisaDetikFormat}
              </span>
            </div>
          )}

          <button
            className="tv-tryout-toggle-grid-btn"
            onClick={() => setTampilkanGridDrawer(!tampilkanGridDrawer)}
          >
            <TryoutGridSheetIcon size={16} />
            <span>Nomor Soal ({jumlahTerjawab}/{totalSoal})</span>
          </button>

          <button
            className="tv-btn tv-btn-primary tv-tryout-cbt-submit-btn"
            onClick={() => setTampilkanModalSubmit(true)}
          >
            Selesai Ujian
          </button>
        </div>
      </div>

      {/* ── Main Exam Body (2-Column Desktop, 1-Column Mobile) ────────── */}
      <div className="tv-tryout-exam-body">
        {/* Kolom Soal */}
        <div className="tv-tryout-question-pane">
          {/* Bar Info Nomor & Subdivisi */}
          <div className="tv-tryout-soal-top-bar">
            <div className="tv-tryout-soal-indicators">
              <span className="tv-tryout-soal-no-badge">
                Soal No. {soalAktif.nomor} dari {totalSoal}
              </span>
              <span className="tv-tryout-soal-subdiv-badge">
                {soalAktif.subdivisiLabel}
              </span>
            </div>

            <label className="tv-tryout-ragu-toggle">
              <input
                type="checkbox"
                checked={statusSoalAktif.raguRagu}
                onChange={handleToggleRagu}
              />
              <TryoutFlagIcon size={14} />
              <span className="tv-tryout-ragu-label">
                Tandai Ragu-ragu
              </span>
            </label>
          </div>

          {/* Vignette Pasien */}
          <div className="tv-tryout-vignette-card">
            <p className="tv-tryout-vignette-body">{soalAktif.vignette}</p>
          </div>

          {/* Pertanyaan Klinis */}
          <h3 className="tv-tryout-question-heading">{soalAktif.pertanyaan}</h3>

          {/* Opsi Jawaban A - E */}
          <div className="tv-tryout-options-list" role="radiogroup">
            {soalAktif.opsi.map((opsi) => {
              const isSelected = statusSoalAktif.pilihan === opsi.id;
              return (
                <button
                  key={opsi.id}
                  role="radio"
                  aria-checked={isSelected}
                  className={`tv-tryout-option-btn ${isSelected ? "terpilih" : ""}`}
                  onClick={() => handlePilihJawaban(opsi.id)}
                >
                  <span className="tv-tryout-option-circle">
                    {opsi.id.toUpperCase()}
                  </span>
                  <span className="tv-tryout-option-label">{opsi.teks}</span>
                </button>
              );
            })}
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="tv-tryout-nav-bottom-bar">
            <button
              className="tv-btn tv-btn-secondary tv-tryout-nav-btn"
              disabled={indexSoal === 0}
              onClick={() => setIndexSoal((prev) => Math.max(0, prev - 1))}
            >
              ← Soal Sebelumnya
            </button>

            {indexSoal < totalSoal - 1 ? (
              <button
                className="tv-btn tv-btn-primary tv-tryout-nav-btn"
                onClick={() => setIndexSoal((prev) => Math.min(totalSoal - 1, prev + 1))}
              >
                Soal Berikutnya →
              </button>
            ) : (
              <button
                className="tv-btn tv-btn-primary tv-tryout-nav-btn submit"
                onClick={() => setTampilkanModalSubmit(true)}
              >
                Selesai Ujian →
              </button>
            )}
          </div>
        </div>

        {/* Kolom Lembar Nomor Soal (Grid) */}
        <div className={`tv-tryout-grid-pane ${tampilkanGridDrawer ? "buka" : ""}`}>
          <div className="tv-tryout-grid-header">
            <h4 className="tv-tryout-grid-title">Nomor Soal</h4>
            <button
              className="tv-tryout-grid-close-btn"
              onClick={() => setTampilkanGridDrawer(false)}
            >
              ✕
            </button>
          </div>

          <div className="tv-tryout-grid-legend">
            <span className="tv-legend-item">
              <span className="tv-legend-dot terjawab" /> Terjawab
            </span>
            <span className="tv-legend-item">
              <span className="tv-legend-dot ragu" /> Ragu
            </span>
            <span className="tv-legend-item">
              <span className="tv-legend-dot kosong" /> Belum
            </span>
          </div>

          <div className="tv-tryout-number-grid">
            {paket.daftarSoal.map((soal, idx) => {
              const st = getStatus(soal.nomor);
              const isAktif = idx === indexSoal;
              let statusClass = "kosong";
              if (st.raguRagu) statusClass = "ragu";
              else if (st.pilihan !== null) statusClass = "terjawab";

              return (
                <button
                  key={soal.id}
                  className={`tv-tryout-grid-num ${statusClass} ${isAktif ? "aktif" : ""}`}
                  onClick={() => {
                    setIndexSoal(idx);
                    setTampilkanGridDrawer(false);
                  }}
                >
                  <span className="tv-num-val">{soal.nomor}</span>
                  {st.pilihan && <span className="tv-num-choice">{st.pilihan.toUpperCase()}</span>}
                </button>
              );
            })}
          </div>

          <div className="tv-tryout-grid-summary">
            <div className="tv-grid-stat-row">
              <span>Terjawab:</span>
              <strong>{jumlahTerjawab} dari {totalSoal}</strong>
            </div>
            <div className="tv-grid-stat-row">
              <span>Ragu-ragu:</span>
              <strong>{jumlahRagu}</strong>
            </div>
            <div className="tv-grid-stat-row">
              <span>Belum diisi:</span>
              <strong>{jumlahKosong}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal Konfirmasi Akhiri Ujian ────────────────────────────── */}
      {tampilkanModalSubmit && (
        <div className="tv-tryout-modal-overlay">
          <div className="tv-tryout-modal-card">
            <div className="tv-tryout-modal-header">
              <TryoutExamCardIcon size={36} />
              <h3 className="tv-tryout-modal-title">Konfirmasi Selesai Ujian</h3>
            </div>

            <p className="tv-tryout-modal-desc">
              Apakah Anda yakin ingin mengakhiri sesi Try Out ini? Pastikan seluruh soal telah Anda periksa.
            </p>

            <div className="tv-tryout-modal-summary-box">
              <div className="tv-modal-stat-item">
                <span className="tv-modal-stat-val hijau">{jumlahTerjawab}</span>
                <span className="tv-modal-stat-label">Terjawab</span>
              </div>
              <div className="tv-modal-stat-item">
                <span className="tv-modal-stat-val kuning">{jumlahRagu}</span>
                <span className="tv-modal-stat-label">Ragu-ragu</span>
              </div>
              <div className="tv-modal-stat-item">
                <span className="tv-modal-stat-val abu">{jumlahKosong}</span>
                <span className="tv-modal-stat-label">Belum Diisi</span>
              </div>
            </div>

            {jumlahKosong > 0 && (
              <div className="tv-tryout-warning-alert">
                <TryoutWarningAlertIcon size={16} />
                <span>Masih ada <strong>{jumlahKosong} soal</strong> yang belum Anda jawab.</span>
              </div>
            )}

            <div className="tv-tryout-modal-actions">
              <button
                className="tv-btn tv-btn-secondary"
                onClick={() => setTampilkanModalSubmit(false)}
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                className="tv-btn tv-btn-primary"
                onClick={handleFinalSubmit}
              >
                Ya, Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
