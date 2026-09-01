"use client";

import { useState, useEffect } from "react";
import { SEMUA_KASUS } from "./data";
import { KasusRunner } from "./KasusRunner";
import type { Kasus } from "./types";
import { ClinicalSvgIcon } from "@/shared/ui";

const WARNA_TINGKAT: Record<string, string> = {
  dasar: "hijau", menengah: "kuning", lanjut: "merah",
};
const LABEL_TINGKAT: Record<string, string> = {
  dasar: "Dasar", menengah: "Menengah", lanjut: "Lanjut",
};

const STORAGE_KEY = "tv_kasus_selesai";

function bacaSelesai(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch { return new Set(); }
}

function simpanSelesai(id: string) {
  if (typeof window === "undefined") return;
  const set = bacaSelesai();
  set.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function KasusKartu({ kasus, selesai, onMulai }: { kasus: Kasus; selesai: boolean; onMulai: () => void }) {
  return (
    <div className={`tv-kasus-kartu${selesai ? " selesai" : ""}`}>
      <div className="tv-kasus-kartu-atas">
        <span
          className="tv-kasus-icon"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ClinicalSvgIcon name={kasus.kategori} size={28} />
        </span>
        <div className="tv-kasus-badge-group">
          <span className={`tv-kasus-tingkat tv-kasus-tingkat-${WARNA_TINGKAT[kasus.tingkat]}`}>
            {LABEL_TINGKAT[kasus.tingkat]}
          </span>
          {selesai && (
            <span
              className="tv-kasus-selesai-chip"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <ClinicalSvgIcon name="check-badge" size={14} />
              <span>Selesai</span>
            </span>
          )}
        </div>
      </div>
      <h3 className="tv-kasus-kartu-judul">{kasus.judul}</h3>
      <p className="tv-kasus-kartu-desk">{kasus.deskripsi}</p>
      <p className="tv-kasus-langkah-info">{kasus.langkah.length} langkah klinis</p>
      <button className="tv-btn tv-kasus-mulai-btn" onClick={onMulai}>
        {selesai ? "Ulangi Kasus" : "Mulai Kasus →"}
      </button>
    </div>
  );
}

export function KasusGrid() {
  const [aktifKasusId, setAktifKasusId] = useState<string | null>(null);
  const [kasusSelesai, setKasusSelesai] = useState<Set<string>>(new Set());

  useEffect(() => {
    setKasusSelesai(bacaSelesai());
  }, []);

  function tandaiSelesai(id: string) {
    simpanSelesai(id);
    setKasusSelesai((prev) => new Set([...prev, id]));
  }

  const kasusAktif = aktifKasusId ? SEMUA_KASUS.find((k) => k.id === aktifKasusId) ?? null : null;

  if (kasusAktif) {
    return (
      <KasusRunner
        kasus={kasusAktif}
        onKembali={() => setAktifKasusId(null)}
        onSelesai={tandaiSelesai}
      />
    );
  }

  const jumlahSelesai = SEMUA_KASUS.filter((k) => kasusSelesai.has(k.id)).length;

  return (
    <div className="tv-kasus-page">
      <div className="tv-kuis-page-header">
        <h1 className="tv-kuis-page-judul">Pembelajaran Berbasis Kasus</h1>
        <p className="tv-kuis-page-sub">
          Simulasi kasus klinis pediatri terstruktur mulai dari anamnesis hingga tatalaksana, lengkap dengan panduan dan pembahasan klinis.
        </p>
        {jumlahSelesai > 0 && (
          <p
            className="tv-kasus-progress-global"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <ClinicalSvgIcon name="check-badge" size={16} />
            <span>
              Diselesaikan: <strong>{jumlahSelesai} / {SEMUA_KASUS.length}</strong> kasus
            </span>
          </p>
        )}
      </div>

      <div className="tv-kasus-grid">
        {SEMUA_KASUS.map((kasus) => (
          <KasusKartu
            key={kasus.id}
            kasus={kasus}
            selesai={kasusSelesai.has(kasus.id)}
            onMulai={() => setAktifKasusId(kasus.id)}
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
          <ClinicalSvgIcon name="kasus" size={24} />
        </span>
        <p className="tv-kuis-info-teks">
          Kasus dirancang berdasarkan skenario klinis nyata dan mengacu pada panduan{" "}
          <strong>IDAI, WHO, AAP, dan GINA</strong>. Setiap kasus dapat diulang kapan saja untuk memperkuat pemahaman.
        </p>
      </div>
    </div>
  );
}
