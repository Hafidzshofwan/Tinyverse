"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  GrowthRecord,
  Gender,
  WHO_BBU_MALE_0_60,
  WHO_BBU_FEMALE_0_60,
  WHO_TBU_MALE_0_60,
  WHO_TBU_FEMALE_0_60,
} from "./longitudinal";
import { tkInterpolasiZscoreRow } from "./zscore";

export type ChartMetric = "bbu" | "tbu" | "zscore";

interface LongitudinalGrowthChartProps {
  records: GrowthRecord[];
  gender?: Gender;
  isFaltering?: boolean;
}

export function LongitudinalGrowthChart({
  records,
  gender = "male",
}: LongitudinalGrowthChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("bbu");

  // Urutkan catatan pasien
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.usiaBulan - b.usiaBulan);
  }, [records]);

  // Tentukan batas usia maksimum untuk grafik
  const maxAgeRecorded = useMemo(() => {
    if (sortedRecords.length === 0) return 12;
    const maxAge = Math.max(...sortedRecords.map((r) => r.usiaBulan));
    return Math.min(60, Math.max(12, Math.ceil(maxAge + 2)));
  }, [sortedRecords]);

  // Membangun dataset grafik (kombinasi Kurva WHO + Titik Pasien)
  const chartData = useMemo(() => {
    const data: Record<string, number | string | null>[] = [];

    const tableBBU = gender === "female" ? WHO_BBU_FEMALE_0_60 : WHO_BBU_MALE_0_60;
    const tableTBU = gender === "female" ? WHO_TBU_FEMALE_0_60 : WHO_TBU_MALE_0_60;

    // Buat titik referensi WHO per bulan (0 s/d maxAgeRecorded)
    for (let m = 0; m <= maxAgeRecorded; m += 0.5) {
      const point: Record<string, number | string | null> = {
        usia: m,
        usiaLabel: `${m} bln`,
      };

      if (metric === "bbu") {
        const row = tkInterpolasiZscoreRow(tableBBU, m);
        if (row) {
          point["sdMinus3"] = row[0] ?? null;
          point["sdMinus2"] = row[1] ?? null;
          point["sdMinus1"] = row[2] ?? null;
          point["sdMedian"] = row[3] ?? null;
          point["sdPlus1"] = row[4] ?? null;
          point["sdPlus2"] = row[5] ?? null;
          point["sdPlus3"] = row[6] ?? null;
        }
      } else if (metric === "tbu") {
        const row = tkInterpolasiZscoreRow(tableTBU, m);
        if (row) {
          point["sdMinus3"] = row[0] ?? null;
          point["sdMinus2"] = row[1] ?? null;
          point["sdMinus1"] = row[2] ?? null;
          point["sdMedian"] = row[3] ?? null;
          point["sdPlus1"] = row[4] ?? null;
          point["sdPlus2"] = row[5] ?? null;
          point["sdPlus3"] = row[6] ?? null;
        }
      } else if (metric === "zscore") {
        point["sdMinus3"] = -3;
        point["sdMinus2"] = -2;
        point["sdMinus1"] = -1;
        point["sdMedian"] = 0;
        point["sdPlus1"] = 1;
        point["sdPlus2"] = 2;
        point["sdPlus3"] = 3;
      }

      // Cari apakah ada catatan pasien dekat usia bulan ini
      const matchedRecord = sortedRecords.find((r) => Math.abs(r.usiaBulan - m) < 0.25);
      if (matchedRecord) {
        if (metric === "bbu") point["pasienNilai"] = matchedRecord.bb;
        else if (metric === "tbu") point["pasienNilai"] = matchedRecord.tb;
        else if (metric === "zscore") point["pasienNilai"] = matchedRecord.bbuZ ?? 0;

        point["pasienTanggal"] = matchedRecord.tanggal;
        point["pasienCatatan"] = matchedRecord.catatan || "";
      } else {
        point["pasienNilai"] = null;
      }

      data.push(point);
    }

    // Masukkan data pasien eksak yang belum terpetakan persis di step 0.5
    sortedRecords.forEach((r) => {
      const exists = data.some((d) => Math.abs((d["usia"] as number) - r.usiaBulan) < 0.25);
      if (!exists) {
        const rowB = metric === "bbu" ? tkInterpolasiZscoreRow(tableBBU, r.usiaBulan) : metric === "tbu" ? tkInterpolasiZscoreRow(tableTBU, r.usiaBulan) : null;
        const pt: Record<string, number | string | null> = {
          usia: r.usiaBulan,
          usiaLabel: `${r.usiaBulan} bln`,
          pasienNilai: metric === "bbu" ? r.bb : metric === "tbu" ? r.tb : (r.bbuZ ?? 0),
          pasienTanggal: r.tanggal,
          pasienCatatan: r.catatan || "",
        };

        if (metric === "zscore") {
          pt["sdMinus3"] = -3;
          pt["sdMinus2"] = -2;
          pt["sdMinus1"] = -1;
          pt["sdMedian"] = 0;
          pt["sdPlus1"] = 1;
          pt["sdPlus2"] = 2;
          pt["sdPlus3"] = 3;
        } else if (rowB) {
          pt["sdMinus3"] = rowB[0] ?? null;
          pt["sdMinus2"] = rowB[1] ?? null;
          pt["sdMinus1"] = rowB[2] ?? null;
          pt["sdMedian"] = rowB[3] ?? null;
          pt["sdPlus1"] = rowB[4] ?? null;
          pt["sdPlus2"] = rowB[5] ?? null;
          pt["sdPlus3"] = rowB[6] ?? null;
        }
        data.push(pt);
      }
    });

    return data.sort((a, b) => (a["usia"] as number) - (b["usia"] as number));
  }, [sortedRecords, metric, gender, maxAgeRecorded]);

  // Rendering tooltip kustom
  interface TooltipPayloadItem {
    dataKey?: string | number;
    value?: number | string;
    payload?: Record<string, unknown>;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const pasienData = payload.find((p) => p.dataKey === "pasienNilai");
      const medianData = payload.find((p) => p.dataKey === "sdMedian");

      const ptObj = payload[0]?.payload as Record<string, string | number | null> | undefined;
      const tglLabel = ptObj?.pasienTanggal ? String(ptObj.pasienTanggal) : "Pemeriksaan";
      const catLabel = ptObj?.pasienCatatan ? String(ptObj.pasienCatatan) : "";

      return (
        <div style={{ background: "#1E293B", color: "#fff", padding: "10px 14px", borderRadius: 10, fontSize: "0.82rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", maxWidth: 260 }}>
          <div style={{ fontWeight: 700, color: "#38BDF8", marginBottom: 4 }}>
            Usia: {label} ({tglLabel})
          </div>
          {pasienData && pasienData.value != null && (
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#A855F7", marginBottom: 4 }}>
              📌 Hasil Pasien: {String(pasienData.value)} {metric === "bbu" ? "kg" : metric === "tbu" ? "cm" : "SD"}
            </div>
          )}
          {medianData && medianData.value != null && (
            <div style={{ color: "#22C55E" }}>
              🟢 Median WHO (0 SD): {String(medianData.value)} {metric === "bbu" ? "kg" : metric === "tbu" ? "cm" : "SD"}
            </div>
          )}
          {catLabel && (
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #334155", fontStyle: "italic", color: "#94A3B8" }}>
              Catatan: {catLabel}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "16px", marginBottom: 16 }}>
      {/* Chart Selector Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: 6 }}>
            📈 Grafik Tren Pertumbuhan Longitudinal WHO
          </h4>
          <span style={{ fontSize: "0.76rem", color: "#64748B" }}>
            Mengeplot pemeriksaan berulang pasien di atas kurva acuan WHO ({gender === "female" ? "Anak Perempuan" : "Anak Laki-Laki"})
          </span>
        </div>

        {/* Tab Metric Switcher */}
        <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 4, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setMetric("bbu")}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              background: metric === "bbu" ? "#0A0B5F" : "transparent",
              color: metric === "bbu" ? "#fff" : "#475569",
              transition: "all 0.15s",
            }}
          >
            ⚖️ BB vs Usia
          </button>

          <button
            type="button"
            onClick={() => setMetric("tbu")}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              background: metric === "tbu" ? "#0A0B5F" : "transparent",
              color: metric === "tbu" ? "#fff" : "#475569",
              transition: "all 0.15s",
            }}
          >
            📏 TB vs Usia
          </button>

          <button
            type="button"
            onClick={() => setMetric("zscore")}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              background: metric === "zscore" ? "#0A0B5F" : "transparent",
              color: metric === "zscore" ? "#fff" : "#475569",
              transition: "all 0.15s",
            }}
          >
            📉 Z-Score (SD)
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="usiaLabel" stroke="#94A3B8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "0.75rem" }} />

            {/* WHO Standard Lines */}
            <Line type="monotone" dataKey="sdPlus3" name="+3 SD (Persentil 97th)" stroke="#EF4444" strokeDasharray="3 3" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdPlus2" name="+2 SD (Persentil 85th)" stroke="#F59E0B" strokeDasharray="3 3" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdPlus1" name="+1 SD" stroke="#94A3B8" strokeDasharray="2 2" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMedian" name="Median / 0 SD (Persentil 50th)" stroke="#10B981" dot={false} strokeWidth={2.5} />
            <Line type="monotone" dataKey="sdMinus1" name="-1 SD" stroke="#94A3B8" strokeDasharray="2 2" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMinus2" name="-2 SD (Persentil 15th)" stroke="#F59E0B" strokeDasharray="3 3" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMinus3" name="-3 SD (Persentil 3rd)" stroke="#EF4444" strokeDasharray="3 3" dot={false} strokeWidth={1} />

            {/* Patient Recorded Trend Line */}
            <Line
              type="monotone"
              dataKey="pasienNilai"
              name="📍 Pasien (Riwayat Pemeriksaan)"
              stroke="#8B5CF6"
              strokeWidth={3.5}
              connectNulls
              dot={{ r: 6, fill: "#8B5CF6", stroke: "#FFFFFF", strokeWidth: 2 }}
              activeDot={{ r: 9, fill: "#D946EF", stroke: "#FFFFFF", strokeWidth: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: "0.74rem", color: "#64748B", background: "#F8FAFC", padding: "8px 12px", borderRadius: 10 }}>
        <span>🟢 <b>Garis Hijau Tegas:</b> Median WHO (Persentil 50)</span>
        <span>🟡 <b>Garis Putus-Putus Oranye:</b> Batas ±2 SD (Normal Zone)</span>
        <span>🔴 <b>Garis Putus-Putus Merah:</b> Batas Extreme ±3 SD</span>
        <span>🟣 <b>Titik Ungu Tegas:</b> Hasil Penimbangan/Pengukuran Pasien</span>
      </div>
    </div>
  );
}
