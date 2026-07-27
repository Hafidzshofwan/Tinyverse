"use client";

import { useMemo, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  DENVER_SECTORS,
  getDenverItemsForAge,
  hitungUsiaDenver,
  hitungDenver,
  type DenverSector,
  type DenverItemResult,
} from "./data";
import { SectorIcon } from "./SectorIcon";

interface DenverFormProps {
  onBack: () => void;
}

export function DenverForm({ onBack }: DenverFormProps) {
  const profile = usePatientProfile();

  // Input Tgl Lahir & Tgl Tes
  const todayStr: string = useMemo(() => new Date().toISOString().split("T")[0] || "2026-07-25", []);

  // Estimasi tglLahir dari profil pasien jika ada usiaBulan
  const defaultTglLahir: string = useMemo(() => {
    if (profile?.usiaBulan) {
      const d = new Date();
      d.setMonth(d.getMonth() - profile.usiaBulan);
      return d.toISOString().split("T")[0] || "2024-01-15";
    }
    return "2024-01-15";
  }, [profile?.usiaBulan]);

  const [tglLahir, setTglLahir] = useState<string>(defaultTglLahir);
  const [tglTes, setTglTes] = useState<string>(todayStr);
  const [isPrematur, setIsPrematur] = useState<boolean>(false);
  const [mingguPrematur, setMingguPrematur] = useState<number>(32);

  // Tab Sektor Filter
  const [sektorAktif, setSektorAktif] = useState<DenverSector | "semua">("semua");
  const useSvgIcons = true; // Tetapkan vector SVG untuk keseluruhan menu skrining Denver II

  // State Jawaban Item: { [itemId]: 'pass' | 'fail' | 'refusal' | 'no-opportunity' }
  const [jawaban, setJawaban] = useState<Record<string, DenverItemResult>>({});

  // Kalkulasi Usia Denver
  const calcUsia = useMemo(() => {
    return hitungUsiaDenver(tglLahir, tglTes, isPrematur ? mingguPrematur : 0);
  }, [tglLahir, tglTes, isPrematur, mingguPrematur]);

  const effectiveAgeMonths = calcUsia.koreksiPrematur
    ? calcUsia.usiaBulanKoreksi
    : calcUsia.usiaBulanEksak;

  // Daftar Item Denver II yang relevan dengan usia anak saat ini
  const relevantItems = useMemo(() => {
    if (effectiveAgeMonths <= 0) return [];
    return getDenverItemsForAge(effectiveAgeMonths);
  }, [effectiveAgeMonths]);

  // Items terfilter berdasarkan Sektor
  const displayedItems = useMemo(() => {
    if (sektorAktif === "semua") return relevantItems;
    return relevantItems.filter((item) => item.sektor === sektorAktif);
  }, [relevantItems, sektorAktif]);

  // Total item diisi
  const totalDiisi = useMemo(() => {
    return relevantItems.filter((item) => jawaban[item.id] !== undefined && jawaban[item.id] !== null).length;
  }, [relevantItems, jawaban]);

  // Kalkulasi Hasil
  const hasil = useMemo(() => {
    if (relevantItems.length === 0) return null;
    return hitungDenver(relevantItems, jawaban, effectiveAgeMonths);
  }, [relevantItems, jawaban, effectiveAgeMonths]);

  const handleSetJawaban = (itemId: string, res: DenverItemResult) => {
    setJawaban((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === res ? null : res,
    }));
  };

  const handleReset = () => {
    setJawaban({});
  };

  const handleSimpanRingkasan = () => {
    if (!hasil) return;

    let delayItemsStr = "";
    const delays = hasil.evaluasiList.filter((e) => e.isDelay);
    const cautions = hasil.evaluasiList.filter((e) => e.isCaution);

    if (delays.length > 0) {
      delayItemsStr = ` Item Delay: ${delays.map((d) => d.item.namaIndo).join(", ")}.`;
    }
    if (cautions.length > 0) {
      delayItemsStr += ` Item Caution: ${cautions.map((c) => c.item.namaIndo).join(", ")}.`;
    }

    const ageStr = calcUsia.koreksiPrematur
      ? `${calcUsia.usiaBulanKoreksi} Bulan (Koreksi Prematur)`
      : `${calcUsia.usiaBulanEksak} Bulan`;

    addRingkasanItem({
      title: `Skrining Perkembangan Denver II (Usia ${ageStr})`,
      body: `Hasil: ${hasil.labelKategori}. Pass: ${hasil.totalPass}, Fail: ${hasil.totalFail}, Delay: ${hasil.delaysCount}, Caution: ${hasil.cautionsCount}.${delayItemsStr} ${hasil.saranKlinis}`,
      source: "Denver Development Screening Test II (Denver II)",
    });

    alert("Hasil Denver II berhasil disimpan ke Ringkasan Medis!");
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 48, fontFamily: "Quicksand, system-ui, sans-serif" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "#FFFFFF",
            border: "1px solid #EAECF0",
            borderRadius: 12,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 700,
            color: "#0A0B5F",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
          }}
        >
          ← Kembali
        </button>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
              color: "var(--tv-navy, #0A0B5F)",
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            Skrining Perkembangan Denver II
          </h2>
          <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: "var(--tv-soft-teks, #667085)", fontWeight: 600 }}>
            Denver Development Screening Test (DDST II)
          </p>
        </div>
      </div>

      {/* Form Informasi Usia & Prematuritas */}
      <div
        className="kartu"
        style={{
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(10, 11, 95, 0.08)",
              color: "var(--tv-navy, #0A0B5F)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            📅
          </div>
          <h3 style={{ margin: 0, fontSize: 15, color: "var(--tv-navy, #0A0B5F)", fontWeight: 700, fontFamily: "Fredoka, Quicksand, sans-serif" }}>
            Data Tanggal & Usia Pemeriksaan
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--tv-teks, #344054)", marginBottom: 6 }}>
              Tanggal Lahir Anak
            </label>
            <input
              type="date"
              value={tglLahir}
              onChange={(e) => setTglLahir(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--tv-teks, #344054)", marginBottom: 6 }}>
              Tanggal Tes / Pemeriksaan
            </label>
            <input
              type="date"
              value={tglTes}
              onChange={(e) => setTglTes(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", paddingTop: 2 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "#344054", fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={isPrematur}
                onChange={(e) => setIsPrematur(e.target.checked)}
                style={{ width: 17, height: 17, accentColor: "#0A0B5F", borderRadius: 4, cursor: "pointer" }}
              />
              Lahir Prematur (&lt; 37 Minggu Usia Kehamilan)?
            </label>

            {isPrematur && (
              <div className="tv-prematur-box" style={{ marginTop: 12, padding: "12px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "#93370D", fontWeight: 700 }}>Usia Kehamilan Saat Lahir:</span>
                <select
                  value={mingguPrematur}
                  onChange={(e) => setMingguPrematur(Number(e.target.value))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #F79009",
                    fontSize: 13,
                    fontWeight: 700,
                    background: "#FFFFFF",
                    color: "#7A2E0E",
                  }}
                >
                  {Array.from({ length: 13 }, (_, i) => 24 + i).map((wk) => (
                    <option key={wk} value={wk}>
                      {wk} Minggu (Koreksi -{40 - wk} mg)
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: 11.5, color: "#B45309", fontWeight: 600 }}>
                  *Koreksi prematuritas otomatis dihitung untuk usia kronologis &lt; 24 bulan.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Display Banner Usia */}
        <div
          className="tv-denver-age-banner"
          style={{
            marginTop: 18,
            padding: "14px 18px",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11.5, color: "var(--tv-soft-teks, #667085)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Usia Kronologis Anak
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--tv-navy, #0A0B5F)", marginTop: 2 }}>
              {calcUsia.usiaTahun > 0 ? `${calcUsia.usiaTahun} Tahun ` : ""}
              {calcUsia.sisaBulan} Bulan {calcUsia.sisaHari} Hari ({calcUsia.usiaBulanEksak} Bln)
            </div>
          </div>

          {calcUsia.koreksiPrematur && (
            <div>
              <div style={{ fontSize: 11.5, color: "#B45309", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Usia Koreksi Denver II
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#D97706", marginTop: 2 }}>
                {calcUsia.usiaBulanKoreksi} Bulan
              </div>
            </div>
          )}

          <div
            style={{
              padding: "6px 14px",
              background: "var(--tv-navy, #0A0B5F)",
              color: "#FFFFFF",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            📋 {relevantItems.length} Item pada Garis Usia ({effectiveAgeMonths} Bln)
          </div>
        </div>
      </div>

      {/* Sektor Filter Tabs & Status Pengisian */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tv-teks, #344054)" }}>
            Pilih Sektor Perkembangan ({totalDiisi} dari {relevantItems.length} item dinilai)
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {totalDiisi > 0 && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D92D20",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Reset Jawaban
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          <button
            type="button"
            onClick={() => setSektorAktif("semua")}
            className={`tv-age-btn ${sektorAktif === "semua" ? "active" : ""}`}
            style={{
              padding: "8px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span>Semua Sektor ({relevantItems.length})</span>
          </button>

          {(Object.keys(DENVER_SECTORS) as DenverSector[]).map((secKey) => {
            const secInfo = DENVER_SECTORS[secKey];
            const itemCount = relevantItems.filter((i) => i.sektor === secKey).length;
            const isSelected = sektorAktif === secKey;

            return (
              <button
                key={secKey}
                type="button"
                onClick={() => setSektorAktif(secKey)}
                className={`tv-age-btn ${isSelected ? "active" : ""}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                <SectorIcon
                  sektor={secKey}
                  useSvg={useSvgIcons}
                  size={18}
                  color={isSelected ? "#FFFFFF" : secInfo.warna}
                />
                <span>{secInfo.nama}</span>
                <span
                  style={{
                    fontSize: 11,
                    background: isSelected ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
                    color: "inherit",
                    padding: "1px 7px",
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  {itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daftar Item Denver II Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        {displayedItems.length === 0 ? (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1px solid #EAECF0",
              color: "#667085",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Tidak ada item tes Denver II pada rentang usia ini untuk sektor yang dipilih.
          </div>
        ) : (
          displayedItems.map((item) => {
            const currentRes = jawaban[item.id] || null;
            const secInfo = DENVER_SECTORS[item.sektor];

            // Hitung status visual keterlambatan jika dinilai gagal/refusal
            const isDelayEligible = effectiveAgeMonths > item.p90;
            const isCautionEligible = effectiveAgeMonths >= item.p75 && effectiveAgeMonths <= item.p90;

            return (
              <div
                key={item.id}
                className="kartu tv-denver-card"
                style={{
                  border: currentRes === "fail" && isDelayEligible
                    ? "1.5px solid #FDA29B"
                    : currentRes === "fail" && isCautionEligible
                    ? "1.5px solid #FEC84B"
                    : currentRes === "pass"
                    ? "1.5px solid #6EE7B7"
                    : undefined,
                  borderRadius: 18,
                  padding: "18px 20px",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Sector Header & Item Name */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: secInfo.bgWarna,
                        color: secInfo.warna,
                        fontSize: 11.5,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <SectorIcon
                        sektor={item.sektor}
                        useSvg={useSvgIcons}
                        size={15}
                        color={secInfo.warna}
                      />
                      <span>{secInfo.nama}</span>
                    </span>
                    {item.tipe && (
                      <span className="tv-denver-type-tag" style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                        {item.tipe === "langsung" ? "Pengamatan Langsung" : item.tipe === "laporan" ? "Laporan Orang Tua" : "Pengamatan / Laporan"}
                      </span>
                    )}
                  </div>

                  {/* Flag Tag (Delay / Caution) jika ada */}
                  {currentRes === "fail" && isDelayEligible && (
                    <span style={{ background: "#FEF3F2", color: "#B42318", border: "1px solid #FECDCA", fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                      🚨 DELAY (Keterlambatan)
                    </span>
                  )}
                  {currentRes === "fail" && isCautionEligible && (
                    <span style={{ background: "#FFFAEB", color: "#B45309", border: "1px solid #FEDF89", fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                      ⚠️ CAUTION (Peringatan)
                    </span>
                  )}
                </div>

                <h4 className="tv-denver-item-title" style={{ margin: "0 0 6px 0", fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>
                  {item.namaIndo}
                </h4>

                {item.petunjuk && (
                  <p className="tv-denver-item-desc" style={{ margin: "0 0 14px 0", fontSize: 12.5, lineHeight: 1.5 }}>
                    {item.petunjuk}
                  </p>
                )}

                {/* Colorful Denver II Milestone Scale */}
                <div
                  className="tv-denver-milestone-box"
                  style={{
                    borderRadius: 14,
                    padding: "12px 16px",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <span className="tv-denver-milestone-title" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span>📊</span> Skala Persentil Milestone:
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700 }}>
                      <span style={{ background: "#E0F2FE", color: "#0369A1", padding: "2px 7px", borderRadius: 6 }}>25%: {item.p25} bln</span>
                      <span style={{ background: "#DBEAFE", color: "#1D4ED8", padding: "2px 7px", borderRadius: 6 }}>50%: {item.p50} bln</span>
                      <span style={{ background: "#FEF3C7", color: "#B45309", padding: "2px 7px", borderRadius: 6 }}>75%: {item.p75} bln</span>
                      <span style={{ background: "#FEE2E2", color: "#B91C1C", padding: "2px 7px", borderRadius: 6 }}>90%: {item.p90} bln</span>
                    </div>
                  </div>

                  {/* Multi-color Progress Segment Bar */}
                  {(() => {
                    const maxScale = Math.max(item.p90 * 1.3, effectiveAgeMonths * 1.1, 1);
                    const p25Pos = Math.min(100, Math.max(0, (item.p25 / maxScale) * 100));
                    const p50Pos = Math.min(100, Math.max(0, (item.p50 / maxScale) * 100));
                    const p75Pos = Math.min(100, Math.max(0, (item.p75 / maxScale) * 100));
                    const p90Pos = Math.min(100, Math.max(0, (item.p90 / maxScale) * 100));
                    const agePos = Math.min(100, Math.max(0, (effectiveAgeMonths / maxScale) * 100));

                    return (
                      <div style={{ position: "relative", padding: "6px 0" }}>
                        {/* Track Background */}
                        <div className="tv-denver-track" style={{ position: "relative", height: 16, borderRadius: 999, overflow: "hidden" }}>
                          {/* Segment 25% - 50% (Sky Blue) */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${p25Pos}%`,
                              width: `${Math.max(0, p50Pos - p25Pos)}%`,
                              height: "100%",
                              background: "#38BDF8",
                            }}
                            title={`25% - 50% (${item.p25} - ${item.p50} bln)`}
                          />

                          {/* Segment 50% - 75% (Royal Blue) */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${p50Pos}%`,
                              width: `${Math.max(0, p75Pos - p50Pos)}%`,
                              height: "100%",
                              background: "#2563EB",
                            }}
                            title={`50% - 75% (${item.p50} - ${item.p75} bln)`}
                          />

                          {/* Segment 75% - 90% (Warning Amber) */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${p75Pos}%`,
                              width: `${Math.max(0, p90Pos - p75Pos)}%`,
                              height: "100%",
                              background: "#F59E0B",
                            }}
                            title={`75% - 90% Caution (${item.p75} - ${item.p90} bln)`}
                          />

                          {/* Vertical marker lines for percentiles on track */}
                          <div style={{ position: "absolute", left: `${p25Pos}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.8)" }} />
                          <div style={{ position: "absolute", left: `${p50Pos}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.8)" }} />
                          <div style={{ position: "absolute", left: `${p75Pos}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.8)" }} />
                          <div style={{ position: "absolute", left: `${p90Pos}%`, top: 0, bottom: 0, width: 1.5, background: "#DC2626" }} />
                        </div>

                        {/* Child Age Marker Line & Badge */}
                        <div
                          style={{
                            position: "absolute",
                            left: `${agePos}%`,
                            top: -2,
                            bottom: -2,
                            width: 3,
                            background: "#E11D48",
                            borderRadius: 2,
                            zIndex: 10,
                            boxShadow: "0 0 6px rgba(225, 29, 72, 0.6)",
                          }}
                          title={`Garis Usia Anak (${effectiveAgeMonths} Bln)`}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: -10,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: 8,
                              height: 8,
                              background: "#E11D48",
                              borderRadius: "50%",
                              border: "2px solid #FFFFFF",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  <div className="tv-denver-milestone-footer" style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginTop: 4, fontWeight: 700 }}>
                    <span>0 bln</span>
                    <span style={{ color: "#E11D48", fontWeight: 800 }}>
                      Garis Usia: {effectiveAgeMonths} Bln
                    </span>
                    <span>{Math.round(item.p90 * 1.3)} bln</span>
                  </div>
                </div>

                {/* Scoring Option Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleSetJawaban(item.id, "pass")}
                    className={`tv-opt-btn ${currentRes === "pass" ? "selected-pass" : ""}`}
                    style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textTransform: "none" }}
                  >
                    <span>✅</span>
                    <span>Lulus (P)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetJawaban(item.id, "fail")}
                    className={`tv-opt-btn ${currentRes === "fail" ? "selected-fail" : ""}`}
                    style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textTransform: "none" }}
                  >
                    <span>❌</span>
                    <span>Gagal (F)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetJawaban(item.id, "refusal")}
                    className={`tv-opt-btn ${currentRes === "refusal" ? "selected-tidak" : ""}`}
                    style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textTransform: "none" }}
                  >
                    <span>🚫</span>
                    <span>Menolak (R)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetJawaban(item.id, "no-opportunity")}
                    className={`tv-opt-btn ${currentRes === "no-opportunity" ? "selected-tidak" : ""}`}
                    style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textTransform: "none" }}
                  >
                    <span>⚪</span>
                    <span>Tak Kesempatan</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ringkasan & Interpretasi Hasil Skrining */}
      {hasil && (
        <div
          className="kartu tv-denver-card"
          style={{
            border: hasil.kategori === "suspect"
              ? "1.5px solid #FDA29B"
              : hasil.kategori === "untestable"
              ? "1.5px solid #FEC84B"
              : "1.5px solid #6EE7B7",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 4px 12px rgba(16, 24, 40, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--tv-navy, #0A0B5F)", fontFamily: "Fredoka, Quicksand, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📊</span> Interpretasi Hasil Denver II
            </h3>

            <div
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                background: hasil.kategori === "suspect"
                  ? "#FEF2F2"
                  : hasil.kategori === "untestable"
                  ? "#FFFBEB"
                  : "#ECFDF5",
                color: hasil.kategori === "suspect"
                  ? "#B42318"
                  : hasil.kategori === "untestable"
                  ? "#B45309"
                  : "#047857",
                border: hasil.kategori === "suspect"
                  ? "1px solid #FECDCA"
                  : hasil.kategori === "untestable"
                  ? "1px solid #FEDF89"
                  : "1px solid #A7F3D0",
              }}
            >
              {hasil.labelKategori}
            </div>
          </div>

          {/* Metric Summary Counter */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 18 }}>
            <div className="tv-denver-metric-box" style={{ padding: "10px 12px", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--tv-soft-teks, #667085)", fontWeight: 700 }}>Item Diuji</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--tv-teks, #101828)", marginTop: 2 }}>{hasil.totalItemDiuji}</div>
            </div>
            <div style={{ background: "#ECFDF5", padding: "10px 12px", borderRadius: 12, textAlign: "center", border: "1px solid #A7F3D0" }}>
              <div style={{ fontSize: 11, color: "#047857", fontWeight: 700 }}>Lulus (P)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginTop: 2 }}>{hasil.totalPass}</div>
            </div>
            <div style={{ background: "#FEF2F2", padding: "10px 12px", borderRadius: 12, textAlign: "center", border: "1px solid #FECDCA" }}>
              <div style={{ fontSize: 11, color: "#B42318", fontWeight: 700 }}>Gagal (F)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#B42318", marginTop: 2 }}>{hasil.totalFail}</div>
            </div>
            <div style={{ background: "#FFFBEB", padding: "10px 12px", borderRadius: 12, textAlign: "center", border: "1px solid #FEDF89" }}>
              <div style={{ fontSize: 11, color: "#B45309", fontWeight: 700 }}>Caution ⚠️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#B45309", marginTop: 2 }}>{hasil.cautionsCount}</div>
            </div>
            <div style={{ background: "#FEF2F2", padding: "10px 12px", borderRadius: 12, textAlign: "center", border: "1px solid #FECDCA" }}>
              <div style={{ fontSize: 11, color: "#B42318", fontWeight: 700 }}>Delay 🚨</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#B42318", marginTop: 2 }}>{hasil.delaysCount}</div>
            </div>
          </div>

          <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "var(--tv-teks, #344054)", lineHeight: 1.5, fontWeight: 500 }}>
            <strong style={{ color: "var(--tv-navy, #101828)" }}>Penjelasan:</strong> {hasil.penjelasan}
          </p>

          <div className="tv-denver-rekomendasi" style={{ margin: "0 0 20px 0", fontSize: 13, lineHeight: 1.55, padding: 14, borderRadius: 12, fontWeight: 500 }}>
            <strong style={{ color: "var(--tv-navy, #0A0B5F)" }}>💡 Rekomendasi Klinis:</strong> {hasil.saranKlinis}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSimpanRingkasan}
              style={{
                background: "#0A0B5F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                padding: "11px 20px",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 2px 6px rgba(10, 11, 95, 0.2)",
              }}
            >
              <span>📌</span>
              <span>Simpan ke Ringkasan Medis Pasien</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
