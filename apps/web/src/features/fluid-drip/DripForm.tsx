"use client";

import { useState } from "react";
import { viewDrip } from "@/entities/fluid";
import type { DripType } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

/** Feature: kalkulator faktor tetes — gaya v17. */
export function DripForm() {
  const [volume, setVolume] = useState("");
  const [hours, setHours] = useState("");
  const [factor, setFactor] = useState<DripType>("makro");
  const [rows, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  function hitung() {
    const result = viewDrip(
      volume === "" ? NaN : Number(volume),
      hours === "" ? NaN : Number(hours),
      factor,
    );
    setRows(result.rows);
    setRincian(result.rincian ?? []);
    setError(result.error);
    setCalculated(true);
  }

  const handleTambahRingkasan = () => {
    if (error || !rows.length) return;
    const bodyText = [
      `Volume Cairan: ${volume} mL | Durasi: ${hours} jam`,
      `Set Drip: ${factor === "makro" ? "Makro (20 tpm/mL)" : "Mikro (60 tpm/mL)"}`,
      ...rows.map((r) => `${r.label}: ${r.value}`),
    ].join("\n");

    addRingkasanItem({
      title: `Faktor Tetes Cairan (${volume} mL / ${hours} jam)`,
      source: "Terapi Cairan",
      body: bodyText,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

  return (
    <div>
      <div className="kartu">
        <div className="form-row-group">
          <NumberField
            label="💧 Kebutuhan Cairan (mL)"
            value={volume}
            onValueChange={setVolume}
            placeholder="cth: 500"
          />
          <NumberField
            label="⏱️ Lama Pemberian (jam)"
            value={hours}
            onValueChange={setHours}
            placeholder="cth: 8"
          />
        </div>
        <div className="form-group" style={{ marginTop: 4, marginBottom: 8 }}>
          <label>💉 Ukuran Drip Set</label>
        </div>
        <div className="segmented-toggle" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className={`segmented-btn ${factor === "makro" ? "aktif" : ""}`}
            onClick={() => setFactor("makro")}
          >
            Makro drip
            <br />
            <small style={{ fontSize: "0.72rem" }}>20 tpm/mL</small>
          </button>
          <button
            type="button"
            className={`segmented-btn ${factor === "mikro" ? "aktif" : ""}`}
            onClick={() => setFactor("mikro")}
          >
            Mikro drip
            <br />
            <small style={{ fontSize: "0.72rem" }}>60 tpm/mL</small>
          </button>
        </div>
        <button type="button" className="btn-hitung" onClick={hitung}>
          💉 Hitung Faktor Tetes
        </button>
        {calculated ? (
          <>
            <ResultList
              rows={rows}
              rincian={rincian}
              error={error}
              title="HASIL PERHITUNGAN — FAKTOR TETES"
            />
            {!error && rows.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="tv-btn"
                  style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
                  onClick={handleTambahRingkasan}
                >
                  {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="kartu info-metode">
        <h3>Rumus faktor tetes</h3>
        <ul>
          <li>
            Tetes/menit = volume cairan (mL) × faktor tetes ÷ waktu (menit)
          </li>
          <li>Makro drip umum: 20 tetes/mL</li>
          <li>Mikro drip umum: 60 tetes/mL</li>
        </ul>
        <p className="catatan-metode">
          Hasil adalah estimasi kecepatan tetesan manual. Sesuaikan dengan drip
          set yang benar-benar digunakan dan kondisi klinis pasien.
        </p>
      </div>
    </div>
  );
}
