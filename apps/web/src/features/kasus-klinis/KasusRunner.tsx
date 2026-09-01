"use client";

import { useState } from "react";
import type { Kasus } from "./types";

const IKON_KATEGORI: Record<string, string> = {
  dehidrasi: "💧", neonatus: "👶", respirasi: "🫁",
  "tumbuh-kembang": "📏", neurologi: "🧠", farmakologi: "💊",
};
const IKON_TINGKAT: Record<string, string> = {
  dasar: "🟢 Dasar", menengah: "🟡 Menengah", lanjut: "🔴 Lanjut",
};

interface KasusRunnerProps {
  kasus: Kasus;
  onKembali: () => void;
  onSelesai: (kasusId: string) => void;
}

export function KasusRunner({ kasus, onKembali, onSelesai }: KasusRunnerProps) {
  const [langkahIdx, setLangkahIdx] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<string, string | number>>({});
  const [sudahCek, setSudahCek] = useState(false);
  const [inputNumerik, setInputNumerik] = useState("");
  const [selesai, setSelesai] = useState(false);

  const langkah = kasus.langkah;
  const lk = langkah[langkahIdx];
  const totalLangkah = langkah.length;
  const isLastLangkah = langkahIdx === totalLangkah - 1;
  const progress = ((langkahIdx + 1) / totalLangkah) * 100;

  const jawabanLangkahIni = jawabanUser[lk.id];
  const sudahPilih = jawabanLangkahIni !== undefined && jawabanLangkahIni !== "";

  function cekJawaban() {
    setSudahCek(true);
  }

  function lanjut() {
    if (isLastLangkah) {
      setSelesai(true);
      onSelesai(kasus.id);
    } else {
      setLangkahIdx((i) => i + 1);
      setSudahCek(false);
      setInputNumerik("");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pilihMcq(opsiId: string) {
    if (sudahCek) return;
    setJawabanUser((prev) => ({ ...prev, [lk.id]: opsiId }));
  }

  function inputNumerikChange(val: string) {
    setInputNumerik(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setJawabanUser((prev) => ({ ...prev, [lk.id]: num }));
    }
  }

  function jawabanNumerikBenar(): boolean {
    const userNum = typeof jawabanLangkahIni === "number" ? jawabanLangkahIni : parseFloat(String(jawabanLangkahIni));
    const benar = lk.jawabanBenar as number;
    const tol = lk.toleransi ?? 0;
    return Math.abs(userNum - benar) <= tol;
  }

  // ── Layar selesai ──────────────────────────────────────────────────────
  if (selesai) {
    return (
      <div className="tv-kasus-runner">
        <div className="tv-kasus-selesai">
          <div className="tv-kasus-selesai-ikon">🎉</div>
          <h2 className="tv-kasus-selesai-judul">Kasus Selesai!</h2>
          <p className="tv-kasus-selesai-sub">
            Kamu berhasil menyelesaikan kasus <strong>{kasus.judul}</strong>.
          </p>
          <div className="tv-kasus-ref-box">
            <p className="tv-kasus-ref-label">Referensi:</p>
            <ul className="tv-kasus-ref-list">
              {kasus.referensi.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="tv-kasus-selesai-aksi">
            <button className="tv-btn" onClick={onKembali}>← Pilih Kasus Lain</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Layar langkah ──────────────────────────────────────────────────────
  const bisaCek = lk.tipeInput === "info" || sudahPilih;
  const bisaLanjut = lk.tipeInput === "info" || sudahCek;

  return (
    <div className="tv-kasus-runner">
      {/* Header */}
      <div className="tv-kasus-runner-header">
        <button className="tv-kuis-back-btn" onClick={onKembali}>← Kasus Lain</button>
        <div className="tv-kasus-meta">
          <span>{IKON_KATEGORI[kasus.kategori] ?? "📋"} {kasus.judul}</span>
          <span className="tv-kasus-tingkat-badge">{IKON_TINGKAT[kasus.tingkat]}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="tv-kuis-progress-wrap">
        <div className="tv-kuis-progress-bar">
          <div className="tv-kuis-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="tv-kuis-progress-label">Langkah {langkahIdx + 1} / {totalLangkah}</span>
      </div>

      {/* Kartu langkah */}
      <div className="tv-kasus-langkah-kartu">
        <h3 className="tv-kasus-langkah-judul">{lk.judul}</h3>
        <p className="tv-kasus-narasi">{lk.narasi}</p>

        {lk.pertanyaan && (
          <p className="tv-kasus-pertanyaan">{lk.pertanyaan}</p>
        )}

        {/* MCQ */}
        {lk.tipeInput === "mcq" && lk.opsi && (
          <div className="tv-kuis-opsi-list" role="radiogroup">
            {lk.opsi.map((opsi) => {
              const dipilih = jawabanLangkahIni === opsi.id;
              const isBenar = opsi.id === lk.jawabanBenar;
              let extraCls = "";
              if (sudahCek) {
                if (isBenar) extraCls = " jawaban-benar";
                else if (dipilih && !isBenar) extraCls = " jawaban-salah";
              } else if (dipilih) {
                extraCls = " dipilih";
              }
              return (
                <label key={opsi.id} className={`tv-kuis-opsi${extraCls}`} onClick={() => pilihMcq(opsi.id)}>
                  <input type="radio" name={lk.id} value={opsi.id} checked={dipilih} onChange={() => pilihMcq(opsi.id)} className="tv-kuis-opsi-radio" />
                  <span className="tv-kuis-opsi-huruf">{opsi.id.toUpperCase()}</span>
                  <span className="tv-kuis-opsi-teks">{opsi.teks}</span>
                  {sudahCek && isBenar && <span className="tv-kasus-opsi-check">✓</span>}
                  {sudahCek && dipilih && !isBenar && <span className="tv-kasus-opsi-cross">✗</span>}
                </label>
              );
            })}
          </div>
        )}

        {/* Numerik */}
        {lk.tipeInput === "numerik" && (
          <div className="tv-kasus-numerik-wrap">
            <input
              type="number"
              className={`tv-kasus-numerik-input${sudahCek ? (jawabanNumerikBenar() ? " benar" : " salah") : ""}`}
              value={inputNumerik}
              onChange={(e) => inputNumerikChange(e.target.value)}
              placeholder="Masukkan angka..."
              disabled={sudahCek}
            />
            {sudahCek && (
              <span className={`tv-kasus-numerik-icon${jawabanNumerikBenar() ? " benar" : " salah"}`}>
                {jawabanNumerikBenar() ? "✓" : "✗"}
              </span>
            )}
          </div>
        )}

        {/* Penjelasan setelah cek / atau untuk info */}
        {(sudahCek || lk.tipeInput === "info") && (
          <div className="tv-kasus-penjelasan">
            <p className="tv-kasus-penjelasan-label">💡 Penjelasan:</p>
            <p className="tv-kasus-penjelasan-teks">{lk.penjelasan}</p>
            {lk.linkKalkulator && (
              <a href={lk.linkKalkulator.href} className="tv-kasus-kalkulator-link" target="_blank" rel="noopener noreferrer">
                🔗 {lk.linkKalkulator.label}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer aksi */}
      <div className="tv-kuis-runner-footer">
        {lk.tipeInput !== "info" && !sudahCek && (
          <button className="tv-btn" onClick={cekJawaban} disabled={!bisaCek}>
            Cek Jawaban
          </button>
        )}
        {bisaLanjut && (
          <button className="tv-btn tv-kuis-lanjut-btn" onClick={lanjut}>
            {isLastLangkah ? "Selesai 🎉" : "Lanjut →"}
          </button>
        )}
      </div>
    </div>
  );
}
