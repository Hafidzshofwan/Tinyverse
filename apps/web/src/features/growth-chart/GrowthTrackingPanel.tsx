"use client";

import { useEffect, useState, useMemo } from "react";
import {
  GrowthRecord,
  Gender,
  detectGrowthFaltering,
  loadGrowthRecords,
  saveGrowthRecords,
  getSampleGrowthRecords,
  hitungAllZscores,
} from "./longitudinal";
import { LongitudinalGrowthChart } from "./LongitudinalGrowthChart";
import { usePatientProfile, PatientProfile } from "@/shared/lib/patient";

export function GrowthTrackingPanel() {
  const patientProfile: PatientProfile = usePatientProfile();
  const patientId = patientProfile.id || "default_patient";

  const [records, setRecords] = useState<GrowthRecord[]>([]);
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

  // Muat data riwayat saat pasien aktif berubah
  useEffect(() => {
    const loaded = loadGrowthRecords(patientId);
    if (loaded.length > 0) {
      setRecords(loaded);
    } else {
      // Default gunakan sampel normal agar pengguna langsung melihat grafik
      const defaultSamples = getSampleGrowthRecords(patientId, false);
      setRecords(defaultSamples);
      saveGrowthRecords(patientId, defaultSamples);
    }
  }, [patientId]);

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
    setRecords(updated);
    saveGrowthRecords(patientId, updated);

    // Reset form
    setCatatan("");
    setShowAddForm(false);
  };

  // Hapus entri riwayat
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveGrowthRecords(patientId, updated);
  };

  // Muat sampel preset untuk pengujian cepat
  const handleLoadSample = (faltering: boolean) => {
    const samples = getSampleGrowthRecords(patientId, faltering);
    setRecords(samples);
    saveGrowthRecords(patientId, samples);
  };

  // Salin ringkasan ke clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(falteringResult.summaryText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div style={{ fontFamily: "Quicksand, sans-serif", maxWidth: 1080, margin: "0 auto" }}>
      {/* Top Header Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
          color: "#fff",
          borderRadius: 20,
          padding: "20px 24px",
          marginBottom: 20,
          boxShadow: "0 10px 30px rgba(30,27,75,0.25)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, fontSize: "0.76rem", fontWeight: 700, marginBottom: 8 }}>
              📈 FEATURE TIER 1 — LONGITUDINAL MONITORING
            </div>
            <h2 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", fontSize: "1.45rem" }}>
              Pemantauan Pertumbuhan Longitudinal &amp; Alert Growth Faltering
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.86rem", color: "rgba(255,255,255,0.8)" }}>
              Pasien: <b>{patientProfile.nama || "An. Tanpa Nama"}</b> {patientProfile.noRm ? `(${patientProfile.noRm})` : ""} &bull;{" "}
              {gender === "female" ? "♀ Perempuan" : "♂ Laki-Laki"} &bull; {records.length} Catatan Pemeriksaan
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleLoadSample(true)}
              style={{
                background: "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              }}
              title="Simulasi Kasus Gagal Tumbuh"
            >
              ⚠️ Contoh Gagal Tumbuh
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Muat Tren Normal"
            >
              ✨ Contoh Normal
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              style={{
                background: "#7C5CFC",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: "0.84rem",
                fontWeight: 800,
                fontFamily: "Fredoka, sans-serif",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124,92,252,0.4)",
              }}
            >
              + Tambah Data
            </button>
          </div>
        </div>
      </div>

      {/* AUTOMATED GROWTH FALTERING ALERT BANNER */}
      {falteringResult.isFaltering ? (
        <div
          style={{
            background: "#FEF2F2",
            border: "2px solid #FCA5A5",
            borderRadius: 18,
            padding: "20px",
            marginBottom: 20,
            boxShadow: "0 10px 25px rgba(239,68,68,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ fontSize: "2rem", lineHeight: 1 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: "#DC2626", color: "#fff", fontWeight: 800, fontSize: "0.8rem", padding: "3px 10px", borderRadius: 8, fontFamily: "Fredoka, sans-serif" }}>
                  WARNING: Indikasi Growth Faltering (Gagal Tumbuh)
                </span>
                <span style={{ fontSize: "0.78rem", color: "#991B1B", fontWeight: 700 }}>
                  Terdeteksi {falteringResult.alerts.length} Kriteria Klinis
                </span>
              </div>

              {/* Detail Kriteria Terdeteksi */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "10px 0" }}>
                {falteringResult.alerts.map((al, idx) => (
                  <div key={idx} style={{ background: "#FFF5F5", borderLeft: "4px solid #DC2626", padding: "8px 12px", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ fontWeight: 700, color: "#991B1B", fontSize: "0.86rem" }}>
                      📌 {al.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#450A0A", marginTop: 2 }}>
                      {al.details}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ringkasan Narasi */}
              <p style={{ margin: "12px 0 8px", fontSize: "0.86rem", lineHeight: 1.5, color: "#1F2937", background: "#FFFFFF", padding: "10px 14px", borderRadius: 10, border: "1px solid #FECACA" }}>
                <b>Ringkasan Klinis:</b> {falteringResult.summaryText}
              </p>

              {/* Rekomendasi Klinis */}
              <div style={{ marginTop: 10, fontSize: "0.82rem", color: "#7F1D1D" }}>
                <b>Langkah Evaluasi Klinis Direkomendasikan:</b>
                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                  {falteringResult.recommendations.map((rec, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Tombol Aksi */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  style={{
                    background: "#991B1B",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copiedNote ? "✓ Ringkasan Tersalin!" : "📋 Salin Catatan Ringkasan (CPPT)"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  style={{
                    background: "#FFFFFF",
                    color: "#991B1B",
                    border: "1px solid #FCA5A5",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  📄 Cetak Laporan Rujukan (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderRadius: 16,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.4rem" }}>✅</span>
            <div>
              <div style={{ fontWeight: 800, color: "#065F46", fontSize: "0.9rem", fontFamily: "Fredoka, sans-serif" }}>
                Tren Pertumbuhan Sesuai Kurva WHO (Normal)
              </div>
              <div style={{ fontSize: "0.8rem", color: "#047857" }}>
                Kenaikan berat dan tinggi badan berada pada jalur kurva normal tanpa indikasi defleksi / gagal tumbuh.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            style={{
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📄 Lihat Laporan PDF
          </button>
        </div>
      )}

      {/* PLOTTING TREN LONGITUDINAL (RECHARTS CHART) */}
      <LongitudinalGrowthChart records={records} gender={gender} isFaltering={falteringResult.isFaltering} />

      {/* RIWAYAT PEMERIKSAAN DATA TABLE */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.02rem" }}>
            📋 Riwayat Catatan Pemeriksaan ({records.length})
          </h4>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            style={{ background: "#EEF2FF", color: "#4F46E5", border: "1px solid #C7D2FE", borderRadius: 8, padding: "5px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
          >
            + Tambah Catatan
          </button>
        </div>

        {records.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94A3B8", fontSize: "0.85rem" }}>
            Belum ada riwayat pemeriksaan. Klik <b>+ Tambah Data</b> di atas.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                  <th style={{ padding: "10px 12px" }}>Tanggal</th>
                  <th style={{ padding: "10px 12px" }}>Usia (Bulan)</th>
                  <th style={{ padding: "10px 12px" }}>BB (kg)</th>
                  <th style={{ padding: "10px 12px" }}>TB (cm)</th>
                  <th style={{ padding: "10px 12px" }}>Z-Score BB/U</th>
                  <th style={{ padding: "10px 12px" }}>Status WHO</th>
                  <th style={{ padding: "10px 12px" }}>Catatan</th>
                  <th style={{ padding: "10px 12px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[...records]
                  .sort((a, b) => b.usiaBulan - a.usiaBulan)
                  .map((r) => {
                    const z = r.bbuZ ?? 0;
                    const statusColor = z < -3 ? "#DC2626" : z < -2 ? "#D97706" : z > 2 ? "#2563EB" : "#16A34A";
                    const statusText = z < -3 ? "Sangat Kurang" : z < -2 ? "BB Kurang" : z > 2 ? "Risiko Lebih" : "BB Normal";

                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{r.tanggal}</td>
                        <td style={{ padding: "10px 12px" }}>{r.usiaBulan} bln</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1E293B" }}>{r.bb} kg</td>
                        <td style={{ padding: "10px 12px" }}>{r.tb} cm</td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: statusColor }}>
                          {z > 0 ? `+${z}` : z} SD
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: `${statusColor}18`, color: statusColor, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: "0.75rem" }}>
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
                              background: "#FEF2F2",
                              border: "1px solid #FCA5A5",
                              color: "#DC2626",
                              borderRadius: "8px",
                              padding: "4px 10px",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.15s ease",
                            }}
                            title="Hapus entri pemeriksaan ini"
                          >
                            🗑️ Hapus
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

      {/* FORM MODAL: TAMBAH DATA PEMERIKSAAN */}
      {showAddForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)", fontFamily: "Quicksand, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.15rem" }}>
                ➕ Tambah Catatan Pemeriksaan Baru
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
                  <div style={{ display: "flex", gap: 12, marginTop: 4, fontWeight: 700 }}>
                    <span>BB/U: {previewZscores.bbuZ > 0 ? `+${previewZscores.bbuZ}` : previewZscores.bbuZ} SD</span>
                    <span>TB/U: {previewZscores.tbuZ > 0 ? `+${previewZscores.tbuZ}` : previewZscores.tbuZ} SD</span>
                    <span>BB/TB: {previewZscores.bbtbZ > 0 ? `+${previewZscores.bbtbZ}` : previewZscores.bbtbZ} SD</span>
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
        <div style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.35)", fontFamily: "Quicksand, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #E2E8F0", paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.2rem" }}>
                  📄 Laporan Pemantauan Pertumbuhan &amp; Evaluasi Gagal Tumbuh
                </h3>
                <span style={{ fontSize: "0.76rem", color: "#64748B" }}>TINYVERSE CLINICAL PEDIATRIC REPORT</span>
              </div>
              <button type="button" onClick={() => setShowReportModal(false)} style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#64748B" }}>
                ✕
              </button>
            </div>

            {/* Content Printable */}
            <div id="printableReport" style={{ color: "#1E293B", fontSize: "0.85rem", lineHeight: 1.5 }}>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, marginBottom: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><b>Nama Pasien:</b> {patientProfile.nama || "An. Tanpa Nama"}</div>
                <div><b>No. RM / Bed:</b> {patientProfile.noRm || "-"}</div>
                <div><b>Jenis Kelamin:</b> {gender === "female" ? "Perempuan" : "Laki-Laki"}</div>
                <div><b>Tanggal Cetak:</b> {new Date().toLocaleDateString("id-ID")}</div>
              </div>

              {/* Status Alert Header */}
              <div style={{ background: falteringResult.isFaltering ? "#FEF2F2" : "#ECFDF5", border: `1px solid ${falteringResult.isFaltering ? "#FCA5A5" : "#A7F3D0"}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ fontWeight: 800, color: falteringResult.isFaltering ? "#991B1B" : "#065F46", fontSize: "0.95rem", marginBottom: 4 }}>
                  {falteringResult.isFaltering ? "⚠️ TERDETEKSI INDIKASI GROWTH FALTERING (GAGAL TUMBUH)" : "✅ STATUS PERTUMBUHAN SESUAI KURVA WHO (NORMAL)"}
                </div>
                <div style={{ color: falteringResult.isFaltering ? "#7F1D1D" : "#047857" }}>
                  {falteringResult.summaryText}
                </div>
              </div>

              {/* Tabel Riwayat */}
              <h4 style={{ margin: "16px 0 8px", fontFamily: "Fredoka, sans-serif", color: "#0A0B5F" }}>
                Riwayat Pengukuran Antropometri:
              </h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", marginBottom: 16 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "1.5px solid #CBD5E1" }}>
                    <th style={{ padding: 6, textAlign: "left" }}>Tanggal</th>
                    <th style={{ padding: 6, textAlign: "left" }}>Usia</th>
                    <th style={{ padding: 6, textAlign: "left" }}>BB (kg)</th>
                    <th style={{ padding: 6, textAlign: "left" }}>TB (cm)</th>
                    <th style={{ padding: 6, textAlign: "left" }}>Z BB/U</th>
                    <th style={{ padding: 6, textAlign: "left" }}>Catatan</th>
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

              <h4 style={{ margin: "12px 0 6px", fontFamily: "Fredoka, sans-serif", color: "#0A0B5F" }}>
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
                style={{ flex: 1, background: "#7C5CFC", color: "#fff", border: "none", borderRadius: 10, padding: 10, fontWeight: 700, cursor: "pointer" }}
              >
                🖨️ Cetak / Simpan ke PDF
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}
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
