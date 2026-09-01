"use client";

import { useState, useEffect } from "react";
import type { KuisModul, FaseKuis } from "./types";
import { useKuisStorage } from "./useKuisStorage";

function SkorBadge({ persentase }: { persentase: number }) {
  let cls = "tv-kuis-skor-badge";
  let label = "";
  if (persentase >= 80) { cls += " lulus-baik"; label = "Lulus dengan baik 🎉"; }
  else if (persentase >= 60) { cls += " lulus-cukup"; label = "Lulus 👍"; }
  else { cls += " perlu-belajar"; label = "Perlu lebih banyak latihan 📖"; }
  return (
    <div className={cls}>
      <span className="tv-kuis-skor-angka">{persentase}%</span>
      <span className="tv-kuis-skor-label">{label}</span>
    </div>
  );
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

  // Guard untuk memastikan soalSaat tidak undefined sebelum digunakan.
  if (!soalSaat) return null;

  const totalSoal = soal.length;
  const jawabanSaat = jawaban[soalSaat.id] ?? null;
  const sudahJawab = jawabanSaat !== null;
  const isLast = soalAktif === totalSoal - 1;

  useEffect(() => {
    setFase("kuis");
    setSoalAktif(0);
    setJawaban({});
  }, [modul.modulId]);

  function pilihJawaban(opsiId: string) {
    if (fase !== "kuis") return;
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
      <div className="tv-kuis-runner">
        <div className="tv-kuis-runner-header">
          <button className="tv-kuis-back-btn" onClick={onKembali}>
            ← Pilih Modul
          </button>
          <span className="tv-kuis-modul-nama">{modul.icon} {modul.judul}</span>
        </div>

        <div className="tv-kuis-progress-wrap">
          <div className="tv-kuis-progress-bar">
            <div className="tv-kuis-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="tv-kuis-progress-label">Soal {soalAktif + 1} / {totalSoal}</span>
        </div>

        <div className="tv-kuis-soal-kartu">
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
          <button className="tv-btn tv-kuis-lanjut-btn" onClick={lanjut} disabled={!sudahJawab}>
            {isLast ? "Lihat Hasil →" : "Lanjut →"}
          </button>
          <p className="tv-kuis-hint">{sudahJawab ? "" : "Pilih salah satu jawaban untuk melanjutkan"}</p>
        </div>
      </div>
    );
  }

  // ── Layar Hasil ─────────────────────────────────────────────────────────
  return (
    <div className="tv-kuis-runner">
      <div className="tv-kuis-runner-header">
        <button className="tv-kuis-back-btn" onClick={onKembali}>← Pilih Modul</button>
        <span className="tv-kuis-modul-nama">{modul.icon} {modul.judul}</span>
      </div>

      <div className="tv-kuis-hasil-header">
        <h2 className="tv-kuis-hasil-judul">Hasil Kuis</h2>
        <SkorBadge persentase={hasilSkor.persentase} />
        <p className="tv-kuis-hasil-ringkasan">
          Kamu menjawab <strong>{hasilSkor.benar} dari {totalSoal}</strong> soal dengan benar.
        </p>
      </div>

      <div className="tv-kuis-review-list">
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
                <p className="tv-kuis-review-referensi">📚 {s.referensi}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="tv-kuis-hasil-aksi">
        <button className="tv-btn tv-kuis-ulangi-btn" onClick={ulangi}>🔄 Ulangi Kuis</button>
        <button className="tv-kuis-back-btn-outline" onClick={onKembali}>Pilih Modul Lain</button>
      </div>
    </div>
  );
}
