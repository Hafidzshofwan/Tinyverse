"use client";

import { useState } from "react";
import { MchatForm } from "@/features/mchat-r";

interface AlatSkrining {
  id: string;
  emoji: string;
  nama: string;
  ringkas: string;
  usiaSasaran: string;
}

const DAFTAR_ALAT: AlatSkrining[] = [
  {
    id: "mchat",
    emoji: "\uD83E\uDDE9",
    nama: "M-CHAT-R",
    ringkas: "Skrining risiko autisme (ASD) \u2014 20 pertanyaan ya/tidak.",
    usiaSasaran: "16\u201330 bulan",
  },
  // Lapis berikutnya (belum tersedia): KPSP, Denver II, dst.
];

/**
 * Katalog Skrining Perkembangan. Saat ini hanya M-CHAT-R yang tersedia;
 * struktur ini dibuat generik supaya alat skrining lain (KPSP, Denver II)
 * tinggal ditambahkan ke DAFTAR_ALAT tanpa mengubah tab induk di
 * GrowthPanel.
 */
export function ScreeningPanel() {
  const [aktif, setAktif] = useState<string | null>(null);

  if (aktif === "mchat") {
    return <MchatForm onBack={() => setAktif(null)} />;
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="judul-section">
        <div className="ikon-bulat" style={{ background: "#D936A61A", color: "#D936A6" }} aria-hidden>
          {"\uD83E\uDDE9"}
        </div>
        <div>
          <h2>Skrining Perkembangan</h2>
          <p>Pilih alat skrining perkembangan anak yang sesuai.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DAFTAR_ALAT.map((alat) => (
          <button
            key={alat.id}
            type="button"
            onClick={() => setAktif(alat.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              textAlign: "left",
              border: "1px solid #E2E8F0",
              background: "#fff",
              borderRadius: 18,
              padding: "16px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 26 }}>{alat.emoji}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: "#0a0b4f" }}>{alat.nama}</span>
              <span style={{ fontSize: 12.5, color: "#667085" }}>{alat.ringkas}</span>
              <span style={{ fontSize: 11.5, color: "#98A2B3", fontWeight: 600 }}>
                Usia sasaran: {alat.usiaSasaran}
              </span>
            </span>
          </button>
        ))}

        <div
          style={{
            border: "1px dashed #E2E8F0",
            borderRadius: 18,
            padding: "16px 18px",
            color: "#98A2B3",
            fontSize: 12.5,
            textAlign: "center",
          }}
        >
          Alat skrining lain (mis. KPSP, Denver II) menyusul.
        </div>
      </div>
    </div>
  );
}
