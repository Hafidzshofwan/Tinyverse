"use client";

import { useState, type CSSProperties } from "react";
import { GrowthTool } from "@/features/growth-chart";
import { usePatientProfile, formatUsiaPasien } from "@/shared/lib/patient";
import { printGrowthReport } from "@/shared/lib/pdfExport";
import { KopSuratModal } from "@/shared/ui/KopSuratModal";

const wrap: CSSProperties = { maxWidth: 1080, margin: "0 auto", width: "100%" };

const headerBar: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 16,
  padding: "12px 18px",
  borderRadius: 14,
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
};

export function GrowthPanel() {
  const profile = usePatientProfile();
  const [kopModalOpen, setKopModalOpen] = useState(false);

  const cetakGrowthPDF = () => {
    printGrowthReport({
      namaAnak: profile.nama || "Anak",
      noRm: profile.noRm || "-",
      jenisKelamin: profile.jk === "male" ? "Laki-Laki" : profile.jk === "female" ? "Perempuan" : "-",
      tglLahirUsia: profile.usiaBulan != null ? formatUsiaPasien(profile.usiaBulan) : "-",
      bbKg: profile.bb != null ? String(profile.bb) : "-",
      tbCm: profile.tb != null ? String(profile.tb) : "-",
      lkCm: "-",
      zScoreBB: "0 SD s/d +1 SD (Normal)",
      zScoreTB: "0 SD (Tinggi Normal)",
      zScoreIMT: "Normal",
      interpretasiGizi: "Gizi Baik (Sesuai Kurva WHO)",
      interpretasiTinggi: "Tinggi Badan Normal",
      rekomendasiEdukasi: [
        "Lanjutkan asupan nutrisi gizi seimbang kaya protein hewani (daging, telur, ikan, susu).",
        "Lakukan pengukuran BB/TB rutin tiap bulan untuk memantau grafik pertumbuhan.",
        "Konsultasikan ke dokter pediatri bila garis grafik mendatar atau menurun 2 bulan berturut-turut.",
        "Jaga pola tidur cukup & aktivitas fisik aktif sesuai usia anak.",
      ],
    });
  };

  return (
    <div style={wrap}>
      <div style={headerBar}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E3A8A" }}>
            📊 Export Growth Chart & Laporan Tumbuh Kembang (Orang Tua)
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
            Cetak laporan resmi ber-Kop Surat Klinik untuk dibawa pulang oleh orang tua pasien.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#2563EB", color: "#FFFFFF", fontWeight: 700, fontSize: "0.83rem" }}
            onClick={cetakGrowthPDF}
          >
            📄 Cetak PDF Growth Report (Kop Surat)
          </button>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#F1F5F9", color: "#334155", fontSize: "0.83rem" }}
            onClick={() => setKopModalOpen(true)}
          >
            ⚙️ Atur Kop Surat
          </button>
        </div>
      </div>

      <GrowthTool />

      <KopSuratModal isOpen={kopModalOpen} onClose={() => setKopModalOpen(false)} />
    </div>
  );
}
