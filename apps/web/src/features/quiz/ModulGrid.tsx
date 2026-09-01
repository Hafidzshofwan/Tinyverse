"use client";

import { useState } from "react";
import { SEMUA_KUIS } from "./data";
import { QuizRunner } from "./QuizRunner";
import { useKuisStorage } from "./useKuisStorage";
import { ClinicalSvgIcon } from "@/shared/ui";

// ─── Kartu per modul (baca skor terbaik dari localStorage) ────────────────

function ModulKartu({
  modulId,
  judul,
  deskripsi,
  jumlahSoal,
  onMulai,
}: {
  modulId: string;
  judul: string;
  deskripsi: string;
  jumlahSoal: number;
  onMulai: () => void;
}) {
  const { skorTerbaik, jumlahPercobaan } = useKuisStorage(modulId);

  return (
    <div className="tv-kuis-modul-kartu">
      <div
        className="tv-kuis-modul-icon"
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ClinicalSvgIcon name={modulId} size={32} />
      </div>
      <div className="tv-kuis-modul-konten">
        <h3 className="tv-kuis-modul-judul">{judul}</h3>
        <p className="tv-kuis-modul-desk">{deskripsi}</p>
        <p className="tv-kuis-modul-meta">{jumlahSoal} soal MCQ · Level Koas</p>
        {skorTerbaik !== null ? (
          <div className="tv-kuis-modul-skor">
            <span className={`tv-kuis-modul-skor-chip${skorTerbaik >= 80 ? " bagus" : skorTerbaik >= 60 ? " cukup" : " kurang"}`}>
              Terbaik: {skorTerbaik}%
            </span>
            <span className="tv-kuis-modul-percobaan">{jumlahPercobaan}× dikerjakan</span>
          </div>
        ) : (
          <p className="tv-kuis-modul-belum">Belum pernah dikerjakan</p>
        )}
      </div>
      <button className="tv-btn tv-kuis-modul-btn" onClick={onMulai}>
        {skorTerbaik !== null ? "Kerjakan Lagi" : "Mulai Kuis"} →
      </button>
    </div>
  );
}

// ─── Grid semua modul + Quiz Runner ───────────────────────────────────────

export function ModulGrid() {
  const [aktifModulId, setAktifModulId] = useState<string | null>(null);

  const modulAktif = aktifModulId
    ? SEMUA_KUIS.find((k) => k.modulId === aktifModulId) ?? null
    : null;

  if (modulAktif) {
    return (
      <QuizRunner
        modul={modulAktif}
        onKembali={() => setAktifModulId(null)}
      />
    );
  }

  return (
    <div className="tv-kuis-page">
      <div className="tv-kuis-page-header">
        <h1 className="tv-kuis-page-judul">Uji Pemahaman</h1>
        <p className="tv-kuis-page-sub">
          Latihan soal pilihan ganda untuk menguji pemahaman klinis pada tiap topik pediatri. Hasil dan progres tersimpan langsung di perangkat.
        </p>
      </div>

      <div className="tv-kuis-modul-grid">
        {SEMUA_KUIS.map((modul) => (
          <ModulKartu
            key={modul.modulId}
            modulId={modul.modulId}
            judul={modul.judul}
            deskripsi={modul.deskripsi}
            jumlahSoal={modul.soal.length}
            onMulai={() => setAktifModulId(modul.modulId)}
          />
        ))}
      </div>

      <div className="tv-kuis-info-box">
        <span
          className="tv-kuis-info-ikon"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClinicalSvgIcon name="lightbulb" size={24} />
        </span>
        <p className="tv-kuis-info-teks">
          Soal dirancang untuk level koas (dokter muda) dan mengacu pada panduan{" "}
          <strong>IDAI, WHO, AAP, dan ESPGHAN</strong> terbaru. Skor tersimpan di
          perangkatmu dan tidak dikirim ke server.
        </p>
      </div>
    </div>
  );
}
