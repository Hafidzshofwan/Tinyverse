"use client";

import { useState } from "react";
import { viewDrip } from "@/entities/fluid";
import type { DripType } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";

/** Feature: kalkulator faktor tetes — gaya v17. */
export function DripForm() {
  const [volume, setVolume] = useState("");
  const [hours, setHours] = useState("");
  const [factor, setFactor] = useState<DripType>("makro");
  const [rows, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

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

  return (
    <div>
      <div className="kartu">
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
        <div className="form-row-group">
          <NumberField
            label="Kebutuhan Cairan (mL)"
            value={volume}
            onValueChange={setVolume}
            placeholder="cth: 500"
          />
          <NumberField
            label="Lama Pemberian (jam)"
            value={hours}
            onValueChange={setHours}
            placeholder="cth: 8"
          />
        </div>
        <button type="button" className="btn-hitung" onClick={hitung}>
          💉 Hitung Faktor Tetes
        </button>
        {calculated ? (
          <ResultList
            rows={rows}
            rincian={rincian}
            error={error}
            title="HASIL PERHITUNGAN — FAKTOR TETES"
          />
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
