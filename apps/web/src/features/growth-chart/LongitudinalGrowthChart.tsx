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
  WHO_IMTU_MALE_0_60,
  WHO_IMTU_FEMALE_0_60,
} from "./longitudinal";
import { tkInterpolasiZscoreRow, tkHitungZscoreNumerik, hitungIMT } from "./zscore";

export type ChartMetric = "bbu" | "tbu" | "imtu";

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
    const tableIMTU = gender === "female" ? WHO_IMTU_FEMALE_0_60 : WHO_IMTU_MALE_0_60;

    const currentTable = metric === "bbu" ? tableBBU : metric === "tbu" ? tableTBU : tableIMTU;

    // Buat titik referensi WHO per bulan (0 s/d maxAgeRecorded)
    for (let m = 0; m <= maxAgeRecorded; m += 0.5) {
      const point: Record<string, number | string | null> = {
        usia: m,
        usiaLabel: `${m} bln`,
      };

      const row = tkInterpolasiZscoreRow(currentTable, m);

      if (row) {
        point["sdMinus3"] = row[0] ?? null;
        point["sdMinus2"] = row[1] ?? null;
        point["sdMinus1"] = row[2] ?? null;
        point["sdMedian"] = row[3] ?? null;
        point["sdPlus1"] = row[4] ?? null;
        point["sdPlus2"] = row[5] ?? null;
        point["sdPlus3"] = row[6] ?? null;
      }

      // Cari apakah ada catatan pasien dekat usia bulan ini
      const matchedRecord = sortedRecords.find((r) => Math.abs(r.usiaBulan - m) < 0.25);
      if (matchedRecord) {
        let nilFisik: number | null = null;
        if (metric === "bbu") nilFisik = matchedRecord.bb;
        else if (metric === "tbu") nilFisik = matchedRecord.tb;
        else if (metric === "imtu") nilFisik = hitungIMT(matchedRecord.bb, matchedRecord.tb);

        if (nilFisik !== null && row) {
          const zscoreVal = Math.round(tkHitungZscoreNumerik(row, nilFisik) * 100) / 100;
          point["pasienNilai"] = nilFisik;
          point["pasienFisik"] = nilFisik;
          point["pasienZscore"] = zscoreVal;
          point["medianFisik"] = row[3] ?? null;
        } else {
          point["pasienNilai"] = null;
        }

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
        const rowB = tkInterpolasiZscoreRow(currentTable, r.usiaBulan);
        let nilFisik: number | null = null;
        if (metric === "bbu") nilFisik = r.bb;
        else if (metric === "tbu") nilFisik = r.tb;
        else if (metric === "imtu") nilFisik = hitungIMT(r.bb, r.tb);

        const pt: Record<string, number | string | null> = {
          usia: r.usiaBulan,
          usiaLabel: `${r.usiaBulan} bln`,
          pasienTanggal: r.tanggal,
          pasienCatatan: r.catatan || "",
        };

        if (rowB) {
          pt["sdMinus3"] = rowB[0] ?? null;
          pt["sdMinus2"] = rowB[1] ?? null;
          pt["sdMinus1"] = rowB[2] ?? null;
          pt["sdMedian"] = rowB[3] ?? null;
          pt["sdPlus1"] = rowB[4] ?? null;
          pt["sdPlus2"] = rowB[5] ?? null;
          pt["sdPlus3"] = rowB[6] ?? null;
        }

        if (nilFisik !== null && rowB) {
          const zscoreVal = Math.round(tkHitungZscoreNumerik(rowB, nilFisik) * 100) / 100;
          pt["pasienNilai"] = nilFisik;
          pt["pasienFisik"] = nilFisik;
          pt["pasienZscore"] = zscoreVal;
          pt["medianFisik"] = rowB[3] ?? null;
        } else {
          pt["pasienNilai"] = null;
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
      const ptObj = payload[0]?.payload as Record<string, string | number | null> | undefined;
      const tglLabel = ptObj?.pasienTanggal ? String(ptObj.pasienTanggal) : "Pemeriksaan";
      const catLabel = ptObj?.pasienCatatan ? String(ptObj.pasienCatatan) : "";
      const unitStr = metric === "bbu" ? "kg" : metric === "tbu" ? "cm" : "kg/m²";

      const pasienZscore = ptObj?.pasienZscore != null ? Number(ptObj.pasienZscore) : null;
      const pasienFisik = ptObj?.pasienFisik != null ? Number(ptObj.pasienFisik) : null;
      const medianFisik = ptObj?.medianFisik != null ? Number(ptObj.medianFisik) : null;

      return (
        <div style={{ background: "#1E293B", color: "#fff", padding: "10px 14px", borderRadius: 10, fontSize: "0.82rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", maxWidth: 280 }}>
          <div style={{ fontWeight: 700, color: "#38BDF8", marginBottom: 6 }}>
            Usia: {label} ({tglLabel})
          </div>
          {pasienZscore !== null && (
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#A855F7", marginBottom: 3 }}>
              📌 Z-Score Pasien: {pasienZscore > 0 ? `+${pasienZscore}` : pasienZscore} SD
            </div>
          )}
          {pasienFisik !== null && (
            <div style={{ color: "#E2E8F0", marginBottom: 3 }}>
              ⚖️ Hasil Terukur: {pasienFisik} {unitStr}
            </div>
          )}
          {medianFisik !== null && (
            <div style={{ color: "#22C55E" }}>
              🟢 Median WHO (0 SD): {medianFisik} {unitStr}
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

  const metricLabel = metric === "bbu" ? "Berat Badan (kg)" : metric === "tbu" ? "Tinggi Badan (cm)" : "IMT (kg/m²)";

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "16px", marginBottom: 16 }}>
      {/* Chart Selector Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontFamily: "Fredoka, sans-serif", color: "#0A0B5F", fontSize: "1.05rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            Kurva Pertumbuhan WHO
          </h4>
          <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#64748B" }}>
            Plotting riwayat penimbangan terhadap standar acuan WHO ({gender === "female" ? "Anak Perempuan" : "Anak Laki-Laki"})
          </p>
        </div>

        {/* Indikator Metric Switcher */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 3, background: "#F1F5F9", padding: 3, borderRadius: 10 }}>
            <button
              type="button"
              onClick={() => setMetric("bbu")}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                background: metric === "bbu" ? "#0A0B5F" : "transparent",
                color: metric === "bbu" ? "#FFFFFF" : "#64748B",
                transition: "all 0.15s ease",
              }}
            >
              BB / Usia
            </button>

            <button
              type="button"
              onClick={() => setMetric("tbu")}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                background: metric === "tbu" ? "#0A0B5F" : "transparent",
                color: metric === "tbu" ? "#FFFFFF" : "#64748B",
                transition: "all 0.15s ease",
              }}
            >
              TB / Usia
            </button>

            <button
              type="button"
              onClick={() => setMetric("imtu")}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                background: metric === "imtu" ? "#0A0B5F" : "transparent",
                color: metric === "imtu" ? "#FFFFFF" : "#64748B",
                transition: "all 0.15s ease",
              }}
            >
              IMT / Usia
            </button>
          </div>
        </div>
      </div>

      {/* Axis Information Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0FDFA", border: "1px solid #CCFBF1", padding: "6px 12px", borderRadius: 8, marginBottom: 12, fontSize: "0.75rem", color: "#0F766E", fontWeight: 600 }}>
        <span>
          📌 <b>Garis Vertikal (Sumbu Y):</b> Nilai Terukur ({metricLabel})
        </span>
        <span>
          <b>Sumbu X:</b> Usia (Bulan)
        </span>
      </div>

      {/* Recharts Container */}
      <div style={{ width: "100%", height: 330 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="usiaLabel" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: "0.75rem", paddingBottom: "8px" }} />

            {/* WHO Standard Lines */}
            <Line type="monotone" dataKey="sdPlus3" name="+3 SD" stroke="#F87171" strokeDasharray="4 4" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdPlus2" name="+2 SD" stroke="#FBBF24" strokeDasharray="4 4" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdPlus1" name="+1 SD" stroke="#CBD5E1" strokeDasharray="2 2" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMedian" name="Median (0 SD)" stroke="#059669" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="sdMinus1" name="-1 SD" stroke="#CBD5E1" strokeDasharray="2 2" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMinus2" name="-2 SD" stroke="#FBBF24" strokeDasharray="4 4" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="sdMinus3" name="-3 SD" stroke="#F87171" strokeDasharray="4 4" dot={false} strokeWidth={1} />

            {/* Patient Recorded Trend Line */}
            <Line
              type="monotone"
              dataKey="pasienNilai"
              name="Grafik Pasien"
              stroke="#4F46E5"
              strokeWidth={3}
              connectNulls
              dot={{ r: 5, fill: "#4F46E5", stroke: "#FFFFFF", strokeWidth: 2 }}
              activeDot={{ r: 7, fill: "#4338CA", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: "0.75rem", color: "#64748B", background: "#F8FAFC", padding: "8px 12px", borderRadius: 8, border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4F46E5", display: "inline-block" }}></span>
          <span><b>Pasien:</b> Riwayat {metricLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 2, background: "#059669", display: "inline-block" }}></span>
          <span><b>Median (0 SD):</b> Standar Rujukan WHO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 2, background: "#FBBF24", display: "inline-block" }}></span>
          <span><b>Batas ±2 SD:</b> Normal (-2 SD s/d +2 SD)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 2, background: "#F87171", display: "inline-block" }}></span>
          <span><b>Batas ±3 SD:</b> Gizi Buruk / Sangat Pendek</span>
        </div>
      </div>
    </div>
  );
}

