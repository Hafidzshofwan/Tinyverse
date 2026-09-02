"use client";

import { useState, useEffect } from "react";
import type { KuisModul, FaseKuis, SoalKuis, StatistikDivisiKuis } from "./types";
import { useKuisStorage } from "./useKuisStorage";
import { ClinicalSvgIcon } from "@/shared/ui";

function SkorBadge({ persentase }: { persentase: number }) {
  let cls = "tv-kuis-skor-badge";
  let label = "";
  if (persentase >= 80) { cls += " lulus-baik"; label = "Lulus dengan baik"; }
  else if (persentase >= 60) { cls += " lulus-cukup"; label = "Lulus kompeten"; }
  else { cls += " perlu-belajar"; label = "Perlu lebih banyak latihan"; }
  return (
    <div className={cls}>
      <span className="tv-kuis-skor-angka">{persentase}%</span>
      <span className="tv-kuis-skor-label" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        {persentase >= 80 ? (
          <ClinicalSvgIcon name="trophy" size={18} />
        ) : (
          <ClinicalSvgIcon name="check-badge" size={18} />
        )}
        <span>{label}</span>
      </span>
    </div>
  );
}

function hitungStatistikDivisi(soal: SoalKuis[], jawaban: Record<string, string>): StatistikDivisiKuis[] {
  const mapDivisi: Record<string, { total: number; benar: number }> = {};

  soal.forEach((s) => {
    const divisiName = s.divisi || "Umum";
    if (!mapDivisi[divisiName]) {
      mapDivisi[divisiName] = { total: 0, benar: 0 };
    }
    mapDivisi[divisiName].total += 1;
    if (jawaban[s.id] === s.jawabanBenar) {
      mapDivisi[divisiName].benar += 1;
    }
  });

  return Object.entries(mapDivisi).map(([divisi, data]) => {
    const salah = data.total - data.benar;
    const persentase = Math.round((data.benar / data.total) * 100);
    let status: "bagus" | "cukup" | "kurang" = "kurang";
    let saranEvaluasi = "";

    if (persentase >= 75) {
      status = "bagus";
      saranEvaluasi = `Pemahaman topik ${divisi} sudah sangat baik. Pertahankan ketelitian penegakan diagnosis & dosis.`;
    } else if (persentase >= 50) {
      status = "cukup";
      saranEvaluasi = `Konsep dasar ${divisi} cukup dipahami, namun perlu pendalaman pada alur tatalaksana dan skoring klinis.`;
    } else {
      status = "kurang";
      saranEvaluasi = `Fokus kelemahan terdeteksi di divisi ${divisi}. Sangat disarankan mengulang materi dan panduan praktis terkait.`;
    }

    return {
      divisi,
      total: data.total,
      benar: data.benar,
      salah,
      persentase,
      status,
      saranEvaluasi,
    };
  }).sort((a, b) => a.persentase - b.persentase);
}

interface QuizRunnerProps {
  modul: KuisModul;
  onKembali: () => void;
}

export function QuizRunner({ modul, onKembali }: QuizRunnerProps) {
  const [fase, setFase] = useState<FaseKuis>("kuis");
  const [soalAktif, setSoalAktif] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [hasilSkor, setHasilSkor] = useState({ benar: 0, persentase: 0 });
  const { simpan } = useKuisStorage(modul.modulId);

  const soal = modul.soal;
  const soalSaat = soal[soalAktif];
  const totalSoal = soal.length;
  const jawabanSaat = jawaban[soalSaat?.id ?? ""] ?? null;
  const sudahJawab = jawabanSaat !== null;
  const isLast = soalAktif === totalSoal - 1;

  useEffect(() => {
    setFase("kuis");
    setSoalAktif(0);
    setJawaban({});
  }, [modul.modulId]);

  // Guard setelah seluruh Hook agar urutan Hook tetap konsisten.
  if (!soalSaat) return null;

  function pilihJawaban(opsiId: string) {
    if (fase !== "kuis" || !soalSaat) return;
    setJawaban((prev) => ({ ...prev, [soalSaat.id]: opsiId }));
  }

  function lanjut() {
    if (!sudahJawab) return;
    if (isLast) selesaikan();
    else setSoalAktif((n) => n + 1);
  }

  function selesaikan() {
    let benar = 0;
    soal.forEach((s) => { if (jawaban[s.id] === s.jawabanBenar) benar++; });
    const persentase = Math.round((benar / totalSoal) * 100);
    setHasilSkor({ benar, persentase });
    simpan(benar, totalSoal);
    setFase("hasil");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ulangi() {
    setFase("kuis");
    setSoalAktif(0);
    setJawaban({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Layar Soal ──────────────────────────────────────────────────────────
  if (fase === "kuis") {
    const progress = ((soalAktif + 1) / totalSoal) * 100;
    return (
      <div className="tv-kuis-runner" id="quiz-runner-container">
        <div className="tv-kuis-runner-header">
          <button className="tv-kuis-back-btn" onClick={onKembali} id="btn-back-modul">
            ← Pilih Modul
          </button>
          <span className="tv-kuis-modul-nama" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <ClinicalSvgIcon name={modul.modulId} size={22} />
            <span>{modul.judul}</span>
          </span>
        </div>

        <div className="tv-kuis-progress-wrap">
          <div className="tv-kuis-progress-bar">
            <div className="tv-kuis-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="tv-kuis-progress-label">Soal {soalAktif + 1} / {totalSoal}</span>
        </div>

        <div className="tv-kuis-soal-kartu" id={`kartu-soal-${soalSaat.id}`}>
          {soalSaat.divisi && (
            <div className="tv-kuis-soal-divisi-badge">
              <ClinicalSvgIcon name="stethoscope" size={14} />
              <span>{soalSaat.divisi}</span>
            </div>
          )}
          <p className="tv-kuis-pertanyaan">{soalSaat.pertanyaan}</p>
          <div className="tv-kuis-opsi-list" role="radiogroup">
            {soalSaat.opsi.map((opsi) => {
              const dipilih = jawabanSaat === opsi.id;
              return (
                <label key={opsi.id} className={`tv-kuis-opsi${dipilih ? " dipilih" : ""}`}>
                  <input
                    type="radio"
                    name={`soal-${soalSaat.id}`}
                    value={opsi.id}
                    checked={dipilih}
                    onChange={() => pilihJawaban(opsi.id)}
                    className="tv-kuis-opsi-radio"
                  />
                  <span className="tv-kuis-opsi-huruf">{opsi.id.toUpperCase()}</span>
                  <span className="tv-kuis-opsi-teks">{opsi.teks}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="tv-kuis-runner-footer">
          <button className="tv-btn tv-kuis-lanjut-btn" onClick={lanjut} disabled={!sudahJawab} id="btn-quiz-next">
            {isLast ? "Lihat Hasil →" : "Lanjut →"}
          </button>
          <p className="tv-kuis-hint">{sudahJawab ? "" : "Pilih salah satu jawaban untuk melanjutkan"}</p>
        </div>
      </div>
    );
  }

  // ── Layar Hasil ─────────────────────────────────────────────────────────
  const statsDivisi = hitungStatistikDivisi(soal, jawaban);
  const kelemahanDivisi = statsDivisi.filter((d) => d.status === "kurang");
  const cukupDivisi = statsDivisi.filter((d) => d.status === "cukup");
  const unggulDivisi = statsDivisi.filter((d) => d.status === "bagus");

  return (
    <div className="tv-kuis-runner" id="quiz-result-view">
      <div className="tv-kuis-runner-header">
        <button className="tv-kuis-back-btn" onClick={onKembali} id="btn-back-to-modul">← Pilih Modul</button>
        <span className="tv-kuis-modul-nama" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <ClinicalSvgIcon name={modul.modulId} size={22} />
          <span>{modul.judul}</span>
        </span>
      </div>

      <div className="tv-kuis-hasil-header" id="quiz-result-header">
        <h2 className="tv-kuis-hasil-judul">Hasil Kuis</h2>
        <SkorBadge persentase={hasilSkor.persentase} />
        <p className="tv-kuis-hasil-ringkasan">
          Kamu menjawab <strong>{hasilSkor.benar} dari {totalSoal}</strong> soal dengan benar.
        </p>
      </div>

      {/* ── Visualisasi Statistik Hasil per Divisi ────────────────── */}
      <div className="tv-kuis-divisi-card" id="quiz-division-stats-card">
        <div className="tv-kuis-divisi-header">
          <div className="tv-kuis-divisi-header-title">
            <ClinicalSvgIcon name="bar-chart" size={20} />
            <h3 className="tv-kuis-divisi-title">Statistik & Evaluasi Divisi</h3>
          </div>
          <p className="tv-kuis-divisi-subtitle">
            Visualisasi distribusi skor per divisi pediatri untuk memetakan kekuatan dan mengevaluasi kelemahan belajarmu.
          </p>
        </div>

        {/* Visual Chart Bars */}
        <div className="tv-kuis-divisi-chart-list" id="quiz-division-chart-list">
          {statsDivisi.map((stat) => (
            <div key={stat.divisi} className="tv-kuis-divisi-row" id={`divisi-stat-${stat.divisi.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
              <div className="tv-kuis-divisi-info">
                <span className="tv-kuis-divisi-nama">{stat.divisi}</span>
                <div className="tv-kuis-divisi-meta">
                  <span className={`tv-kuis-divisi-badge ${stat.status}`}>
                    {stat.status === "bagus" ? "Kuasai" : stat.status === "cukup" ? "Cukup" : "Perlu Belajar"}
                  </span>
                  <span className="tv-kuis-divisi-skor-label">
                    {stat.benar}/{stat.total} Benar ({stat.persentase}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar Visual Chart */}
              <div className="tv-kuis-divisi-bar-track">
                <div
                  className={`tv-kuis-divisi-bar-fill ${stat.status}`}
                  style={{ width: `${Math.max(stat.persentase, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Evaluasi & Rekomendasi Pintar */}
        <div className="tv-kuis-evaluasi-panel" id="quiz-evaluation-panel">
          {kelemahanDivisi.length > 0 && (
            <div className="tv-kuis-evaluasi-box alert-kelemahan">
              <div className="tv-kuis-evaluasi-box-header">
                <span className="tv-kuis-evaluasi-icon">⚠️</span>
                <span className="tv-kuis-evaluasi-title">Fokus Evaluasi Kelemahan:</span>
              </div>
              <ul className="tv-kuis-evaluasi-list">
                {kelemahanDivisi.map((d) => (
                  <li key={d.divisi}>
                    <strong>{d.divisi} ({d.persentase}%):</strong> {d.saranEvaluasi}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cukupDivisi.length > 0 && kelemahanDivisi.length === 0 && (
            <div className="tv-kuis-evaluasi-box alert-cukup">
              <div className="tv-kuis-evaluasi-box-header">
                <span className="tv-kuis-evaluasi-icon">💡</span>
                <span className="tv-kuis-evaluasi-title">Saran Peningkatan:</span>
              </div>
              <ul className="tv-kuis-evaluasi-list">
                {cukupDivisi.map((d) => (
                  <li key={d.divisi}>
                    <strong>{d.divisi} ({d.persentase}%):</strong> {d.saranEvaluasi}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {unggulDivisi.length > 0 && (
            <div className="tv-kuis-evaluasi-box alert-unggul">
              <div className="tv-kuis-evaluasi-box-header">
                <span className="tv-kuis-evaluasi-icon">🎯</span>
                <span className="tv-kuis-evaluasi-title">Divisi Unggulan:</span>
              </div>
              <p className="tv-kuis-evaluasi-text">
                Kamu menguasai dengan sangat baik:{" "}
                <strong>{unggulDivisi.map((d) => d.divisi).join(", ")}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="tv-kuis-review-list" id="quiz-question-review-list">
        <h3 className="tv-kuis-review-section-title">Pembahasan & Referensi Jawaban</h3>
        {soal.map((s, idx) => {
          const pilihanUser = jawaban[s.id];
          const benar = pilihanUser === s.jawabanBenar;
          const opsiDipilih = s.opsi.find((o) => o.id === pilihanUser);
          const opsiBenar = s.opsi.find((o) => o.id === s.jawabanBenar);
          return (
            <div key={s.id} className={`tv-kuis-review-item${benar ? " benar" : " salah"}`}>
              <div className="tv-kuis-review-status">
                <span className={`tv-kuis-review-ikon${benar ? " benar" : " salah"}`}>
                  {benar ? "✓" : "✗"}
                </span>
                <span className="tv-kuis-review-nomor">Soal {idx + 1}</span>
                {s.divisi && (
                  <span className="tv-kuis-review-divisi-tag">{s.divisi}</span>
                )}
              </div>
              <p className="tv-kuis-review-pertanyaan">{s.pertanyaan}</p>
              {!benar && opsiDipilih && (
                <p className="tv-kuis-review-pilihan-salah">
                  Jawabanmu: <strong>{opsiDipilih.id.toUpperCase()}. {opsiDipilih.teks}</strong>
                </p>
              )}
              <p className="tv-kuis-review-pilihan-benar">
                Jawaban benar: <strong>{opsiBenar!.id.toUpperCase()}. {opsiBenar!.teks}</strong>
              </p>
              <p className="tv-kuis-review-penjelasan">{s.penjelasan}</p>
              {s.referensi && (
                <p className="tv-kuis-review-referensi" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ClinicalSvgIcon name="book" size={16} />
                  <span>{s.referensi}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="tv-kuis-hasil-aksi">
        <button className="tv-btn tv-kuis-ulangi-btn" onClick={ulangi} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }} id="btn-repeat-quiz">
          <ClinicalSvgIcon name="refresh" size={16} />
          <span>Ulangi Kuis</span>
        </button>
        <button className="tv-kuis-back-btn-outline" onClick={onKembali} id="btn-back-other-module">Pilih Modul Lain</button>
      </div>
    </div>
  );
}
