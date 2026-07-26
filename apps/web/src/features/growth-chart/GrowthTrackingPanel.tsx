"use client";

import { useEffect, useState, useMemo } from "react";
import {
  GrowthRecord,
  Gender,
  detectGrowthFaltering,
  saveGrowthRecords,
  getSampleGrowthRecords,
  hitungAllZscores,
  useGrowthRecords,
} from "./longitudinal";
import { LongitudinalGrowthChart } from "./LongitudinalGrowthChart";
import { usePatientProfile, PatientProfile } from "@/shared/lib/patient";
import { hitungIMT } from "./zscore";
import { ScreeningIcon, type IconStyleVariant } from "@/shared/ui";

interface GrowthTrackingPanelProps {
  iconVariant?: IconStyleVariant;
}

export function GrowthTrackingPanel({ iconVariant = "svg-v1" }: GrowthTrackingPanelProps) {
  const patientProfile: PatientProfile = usePatientProfile();
  const patientId = patientProfile.id || "";
  const belumPilihPasien = !patientId;

  const records = useGrowthRecords(patientId);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Form input state
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]!);
  const [usiaBulan, setUsiaBulan] = useState<string>("");
  const [bb, setBb] = useState<string>("");
  const [tb, setTb] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");

  const gender: Gender = patientProfile.jk === "female" ? "female" : "male";

  // Sinkronkan usia dari profil pasien jika ada
  useEffect(() => {
    if (patientProfile.usiaBulan != null && !usiaBulan) {
      setUsiaBulan(String(patientProfile.usiaBulan));
    }
    if (patientProfile.bb != null && !bb) {
      setBb(String(patientProfile.bb));
    }
    if (patientProfile.tb != null && !tb) {
      setTb(String(patientProfile.tb));
    }
  }, [patientProfile, usiaBulan, bb, tb]);

  // Hitung Z-score instant preview untuk form input
  const previewZscores = useMemo(() => {
    const u = parseFloat(usiaBulan);
    const w = parseFloat(bb);
    const h = parseFloat(tb);

    if (isFinite(u) && u >= 0 && isFinite(w) && w > 0 && isFinite(h) && h > 0) {
      return hitungAllZscores(u, w, h, gender);
    }
    return null;
  }, [usiaBulan, bb, tb, gender]);

  // Evaluasi Logika Automated Growth Faltering
  const falteringResult = useMemo(() => {
    return detectGrowthFaltering(records, gender);
  }, [records, gender]);

  // Simpan data pemeriksaan baru
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (belumPilihPasien) {
      alert("Pilih atau tambahkan Profil Pasien dulu supaya riwayat pertumbuhan tersimpan pada pasien yang benar.");
      return;
    }
    const u = parseFloat(usiaBulan);
    const w = parseFloat(bb);
    const h = parseFloat(tb);

    if (!isFinite(u) || u < 0 || !isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) {
      alert("Mohon isi Usia (bulan), BB (kg), dan TB (cm) dengan angka yang valid.");
      return;
    }

    const zscores = hitungAllZscores(u, w, h, gender);

    const newRecord: GrowthRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      tanggal,
      usiaBulan: u,
      bb: w,
      tb: h,
      bbuZ: zscores.bbuZ,
      tbuZ: zscores.tbuZ,
      bbtbZ: zscores.bbtbZ,
      catatan: catatan.trim(),
      createdAt: Date.now(),
    };

    const updated = [...records, newRecord].sort((a, b) => a.usiaBulan - b.usiaBulan);
    saveGrowthRecords(patientId, updated);

    // Reset form
    setCatatan("");
    setShowAddForm(false);
  };

  // Hapus entri riwayat
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveGrowthRecords(patientId, updated);
  };

  // Muat sampel preset untuk pengujian cepat
  const handleLoadSample = (faltering: boolean) => {
    if (belumPilihPasien) {
      alert("Pilih atau tambahkan Profil Pasien dulu sebelum memuat data contoh.");
      return;
    }
    const samples = getSampleGrowthRecords(patientId, faltering);
    saveGrowthRecords(patientId, samples);
  };

  // Salin ringkasan ke clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(falteringResult.summaryText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div style={{ fontFamily: "Quicksand, system-ui, -apple-system, sans-serif", maxWidth: 1080, margin: "0 auto" }}>
      {belumPilihPasien && (
        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: 12.5,
            fontWeight: 600,
            color: "#92400E",
          }}
        >
          ⚠️ Belum ada Profil Pasien aktif. Riwayat pertumbuhan TIDAK akan
          disimpan sampai kamu memilih/menambahkan pasien terlebih dahulu
          (mencegah data tercampur antar pasien).
        </div>
      )}
      {!belumPilihPasien && !patientProfile.jk && (
        <div
          style={{
            background: "#DBEAFE",
            border: "1px solid #93C5FD",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: 12.5,
            fontWeight: 600,
            color: "#1E3A8A",
          }}
        >
          ℹ️ Jenis kelamin pasien belum diisi di Profil Pasien — sementara
          memakai standar Z-score <b>laki-laki</b>. Isi jenis kelamin di
          profil supaya klasifikasi status gizi akurat.
        </div>
      )}
      {/* Top Header Section */}
      <div
        style={{
          padding: "8px 0 16px 0",
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Title & Icon Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* div.ikon-bulat 38x38 pink background */}
          <div
            className="ikon-bulat"
            style={{
              width: 38,
              height: 38,
              minWidth: 38,
              minHeight: 38,
              borderRadius: 10,
              background: "#D936A61A",
              color: "#D936A6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ScreeningIcon id="longitudinal" variant={iconVariant} fallbackEmoji="📈" size={24} />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
                fontSize: "18.32px",
                fontWeight: 700,
                color: "#0A0B5F",
                lineHeight: 1.25,
              }}
            >
              Tumbuh Kembang
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Quicksand, system-ui, sans-serif",
                fontSize: "10.24px",
                fontWeight: 600,
                color: "#0A0B5F9E",
                lineHeight: 1.4,
              }}
            >
              Pemantauan Pertumbuhan Longitudinal
            </p>
          </div>
        </div>

        {/* Patient Data Button & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Tombol Data Pasien */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: 8,
              padding: "7px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "13px",
              color: "#1E293B",
              fontWeight: 600,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: "14px" }}>👶</span>
            <div>
              <span style={{ color: "#0A0B5F", fontWeight: 700 }}>
                {patientProfile.nama || "An. Tanpa Nama"}
              </span>{" "}
              <span style={{ color: "#64748B", fontWeight: 500 }}>
                ({gender === "female" ? "Perempuan" : "Laki-Laki"} &bull; {records.length} Catatan)
              </span>
            </div>
          </div>

          {/* Tombol Tambah Data */}
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            style={{
              background: "#0A0B5F",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 5px rgba(10,11,95,0.2)",
              transition: "all 0.15s ease",
            }}
          >
            <span>+</span> Tambah Data
          </button>
        </div>
      </div>

      {/* AUTOMATED GROWTH FALTERING ALERT BANNER */}
      {falteringResult.isFaltering ? (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, borderBottom: "1px solid #FCA5A5", paddingBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#DC2626", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem", padding: "3px 10px", borderRadius: 6 }}>
                PERINGATAN KLINIS
              </span>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#991B1B" }}>
                Terdeteksi Indikasi Growth Faltering (Gagal Tumbuh)
              </h3>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#991B1B", fontWeight: 600 }}>
              {falteringResult.alerts.length} Kriteria Terpenuhi
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {falteringResult.alerts.map((al, idx) => (
              <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #FCA5A5", padding: "10px 12px", borderRadius: 8 }}>
                <div style={{ fontWeight: 700, color: "#991B1B", fontSize: "0.84rem" }}>
                  {al.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#7F1D1D", marginTop: 2 }}>
                  {al.details}
                </div>
              </div>
            ))}
          </div>

          <p style={{ margin: "0 0 12px", fontSize: "0.84rem", lineHeight: 1.5, color: "#1E293B", background: "#FFFFFF", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
            <b>Ringkasan Evaluasi:</b> {falteringResult.summaryText}
          </p>

          <div style={{ marginBottom: 12, fontSize: "0.8rem", color: "#7F1D1D" }}>
            <b>Rekomendasi Evaluasi:</b>
            <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
              {falteringResult.recommendations.map((rec, i) => (
                <li key={i} style={{ marginBottom: 2 }}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCopySummary}
              style={{
                background: "#991B1B",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                padding: "7px 12px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copiedNote ? "✓ Tersalin!" : "Salin Catatan CPPT"}
            </button>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              style={{
                background: "#FFFFFF",
                color: "#991B1B",
                border: "1px solid #FCA5A5",
                borderRadius: 6,
                padding: "7px 12px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cetak Laporan Rujukan
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: "#065F46", fontSize: "0.88rem" }}>
              Status Pertumbuhan Normal
            </div>
            <div style={{ fontSize: "0.78rem", color: "#047857", marginTop: 2 }}>
              Kenaikan berat dan tinggi badan berada pada jalur kurva WHO tanpa indikasi gagal tumbuh.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            style={{
              background: "#059669",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Lihat Laporan
          </button>
        </div>
      )}

      {/* PLOTTING TREN LONGITUDINAL (RECHARTS CHART) */}
      <LongitudinalGrowthChart records={records} gender={gender} isFaltering={falteringResult.isFaltering} />      {/* RIWAYAT PEMERIKSAAN DATA TABLE */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h4 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.02rem", fontWeight: 600 }}>
              Riwayat Catatan Pemeriksaan ({records.length})
            </h4>
            <span
              style={{
                fontSize: "0.72rem",
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                color: "#047857",
                padding: "2px 8px",
                borderRadius: "12px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
              }}
              title="Tersambung ke Firebase Firestore untuk sinkronisasi otomatis antar-perangkat"
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
              🔥 Firebase Cloud Synced
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            style={{ background: "#F1F5F9", color: "#0A0B5F", border: "1px solid #CBD5E1", borderRadius: 8, padding: "5px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
          >
            + Tambah Catatan
          </button>
        </div>

        {records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94A3B8", fontSize: "0.85rem" }}>
            Belum ada riwayat pemeriksaan. Klik <b>+ Tambah Data</b> untuk menambahkan.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>Tanggal</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>Usia</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>BB (kg)</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>TB (cm)</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>IMT/U</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>Status WHO</th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>Catatan</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[...records]
                  .sort((a, b) => b.usiaBulan - a.usiaBulan)
                  .map((r) => {
                    const z = r.bbuZ ?? 0;
                    const statusColor = z < -3 ? "#DC2626" : z < -2 ? "#D97706" : z > 2 ? "#2563EB" : "#059669";
                    const statusText = z < -3 ? "Sangat Kurang" : z < -2 ? "BB Kurang" : z > 2 ? "Risiko Lebih" : "BB Normal";
                    const imtVal = hitungIMT(r.bb, r.tb);

                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{r.tanggal}</td>
                        <td style={{ padding: "10px 12px" }}>{r.usiaBulan} bln</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1E293B" }}>{r.bb} kg</td>
                        <td style={{ padding: "10px 12px" }}>{r.tb} cm</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0A0B5F" }}>
                          {imtVal !== null ? `${imtVal} kg/m²` : "-"}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: `${statusColor}14`, color: statusColor, padding: "3px 8px", borderRadius: 6, fontWeight: 700, fontSize: "0.74rem" }}>
                            {statusText}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#64748B", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.catatan || "-"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <button
                            type="button"
                            aria-label={`Hapus catatan tanggal ${r.tanggal}`}
                            onClick={() => handleDeleteRecord(r.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid #FCA5A5",
                              color: "#DC2626",
                              borderRadius: "6px",
                              padding: "3px 8px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              transition: "all 0.15s ease",
                            }}
                            title="Hapus entri pemeriksaan ini"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOTTOM TOOLBAR: SIMULASI KASUS PERTUMBUHAN */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "0.95rem", fontWeight: 600 }}>
            Simulasi Kasus Pertumbuhan
          </h4>
          <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#64748B" }}>
            Uji skenario pertumbuhan longitudinal dengan dataset standar rujukan WHO
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => handleLoadSample(true)}
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title="Simulasi Kasus Gagal Tumbuh"
          >
            Simulasi Gagal Tumbuh
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(false)}
            style={{
              background: "#F8FAFC",
              color: "#475569",
              border: "1px solid #CBD5E1",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title="Muat Tren Normal"
          >
            Simulasi Normal
          </button>
        </div>
      </div>

      {/* FORM MODAL: TAMBAH DATA PEMERIKSAAN */}
      {showAddForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", fontFamily: "Quicksand, system-ui, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.1rem", fontWeight: 600 }}>
                Tambah Catatan Pemeriksaan
              </h3>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748B" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecord}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    Tanggal Pemeriksaan
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    Usia (Bulan)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="60"
                    required
                    placeholder="cth: 3.5"
                    value={usiaBulan}
                    onChange={(e) => setUsiaBulan(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    Berat Badan (BB - kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="40"
                    required
                    placeholder="cth: 6.2"
                    value={bb}
                    onChange={(e) => setBb(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    Tinggi/Panjang Badan (TB/PB - cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="140"
                    required
                    placeholder="cth: 61.5"
                    value={tb}
                    onChange={(e) => setTb(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              {/* Instant Z-Score Preview Card */}
              {previewZscores && (
                <div style={{ background: "#F0FDFA", border: "1px solid #99F6E4", padding: "10px 12px", borderRadius: 10, marginBottom: 12, fontSize: "0.8rem", color: "#0F766E" }}>
                  <b>⚡ Otomatis Terhitung (Kalkulasi WHO):</b>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4, fontWeight: 700 }}>
                    <span>BB/U: {previewZscores.bbuZ > 0 ? `+${previewZscores.bbuZ}` : previewZscores.bbuZ} SD</span>
                    <span>TB/U: {previewZscores.tbuZ > 0 ? `+${previewZscores.tbuZ}` : previewZscores.tbuZ} SD</span>
                    <span>IMT/U: {previewZscores.imtuZ > 0 ? `+${previewZscores.imtuZ}` : previewZscores.imtuZ} SD</span>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  Catatan Klinis (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="cth: Posyandu / Pasca diare 3 hari / ASI Eksklusif"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #CBD5E1", borderRadius: 8, fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: "#0A0B5F", color: "#fff", border: "none", borderRadius: 10, padding: 12, fontWeight: 800, fontFamily: "Fredoka, sans-serif", fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Simpan Catatan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINT / LAPORAN PDF RUJUKAN */}
      {showReportModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.18)", fontFamily: "Quicksand, system-ui, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.15rem", fontWeight: 600 }}>
                  Laporan Pemantauan Pertumbuhan &amp; Evaluasi Gagal Tumbuh
                </h3>
                <span style={{ fontSize: "0.74rem", color: "#64748B" }}>TINYVERSE CLINICAL PEDIATRIC REPORT</span>
              </div>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748B" }}>
                ✕
              </button>
            </div>

            {/* Content Printable */}
            <div id="printableReport" style={{ color: "#1E293B", fontSize: "0.85rem", lineHeight: 1.5 }}>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, marginBottom: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><b>Nama Pasien:</b> {patientProfile.nama || "An. Tanpa Nama"}</div>
                <div><b>No. RM / Bed:</b> {patientProfile.noRm || "-"}</div>
                <div><b>Jenis Kelamin:</b> {gender === "female" ? "Perempuan" : "Laki-Laki"}</div>
                <div><b>Tanggal Cetak:</b> {new Date().toLocaleDateString("id-ID")}</div>
              </div>

              {/* Status Alert Header */}
              <div style={{ background: falteringResult.isFaltering ? "#FEF2F2" : "#ECFDF5", border: `1px solid ${falteringResult.isFaltering ? "#FCA5A5" : "#A7F3D0"}`, borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, color: falteringResult.isFaltering ? "#991B1B" : "#065F46", fontSize: "0.9rem", marginBottom: 4 }}>
                  {falteringResult.isFaltering ? "TERDETEKSI INDIKASI GROWTH FALTERING (GAGAL TUMBUH)" : "STATUS PERTUMBUHAN SESUAI KURVA WHO (NORMAL)"}
                </div>
                <div style={{ color: falteringResult.isFaltering ? "#7F1D1D" : "#047857" }}>
                  {falteringResult.summaryText}
                </div>
              </div>

              {/* Tabel Riwayat */}
              <h4 style={{ margin: "14px 0 8px", fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontWeight: 600 }}>
                Riwayat Pengukuran Antropometri:
              </h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", marginBottom: 16 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #CBD5E1" }}>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>Tanggal</th>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>Usia</th>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>BB (kg)</th>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>TB (cm)</th>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>Z BB/U</th>
                    <th style={{ padding: 6, textAlign: "left", fontWeight: 700 }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: 6 }}>{r.tanggal}</td>
                      <td style={{ padding: 6 }}>{r.usiaBulan} bln</td>
                      <td style={{ padding: 6, fontWeight: 700 }}>{r.bb} kg</td>
                      <td style={{ padding: 6 }}>{r.tb} cm</td>
                      <td style={{ padding: 6, fontWeight: 700 }}>{r.bbuZ} SD</td>
                      <td style={{ padding: 6, color: "#64748B" }}>{r.catatan || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 style={{ margin: "12px 0 6px", fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontWeight: 600 }}>
                Rekomendasi Rujukan / Tatalaksana Nutrisi:
              </h4>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                {falteringResult.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{rec}</li>
                ))}
              </ol>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #E2E8F0" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ flex: 1, background: "#0A0B5F", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
              >
                Cetak / Simpan ke PDF
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
