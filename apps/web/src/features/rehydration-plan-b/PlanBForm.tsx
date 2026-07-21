"use client";

import { useState } from "react";
import { viewPlanB } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";

/** Feature: Rencana B (rehidrasi ringan–sedang) — gaya v17. */
export function PlanBForm() {
  const [weight, setWeight] = useState("");
  const [rows, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    const result = viewPlanB(weight === "" ? NaN : Number(weight));
    setRows(result.rows);
    setRincian(result.rincian ?? []);
    setError(result.error);
    setTotal(result.total ? `${result.total.toFixed(0)} mL` : "");
    setDuration(result.duration ? `${result.duration} jam` : "");
    setCalculated(true);
  }

  return (
    <div>
      <div className="kartu">
        <NumberField
          label="Berat Badan (kg)"
          value={weight}
          onValueChange={setWeight}
          placeholder="cth: 12"
        />
        <button type="button" className="btn-hitung" onClick={hitung}>
          Hitung Rencana B
        </button>
        {calculated ? (
          error ? (
            <ResultList rows={[]} error={error} />
          ) : (
            <div className="hasil-box-cairan tampil">
              <div className="hasil-label">HASIL PERHITUNGAN — RENCANA B</div>
              <div className="hasil-dosis">{total}</div>
              <span className="hasil-sub">Diberikan dalam {duration}</span>
              <hr className="hasil-divider" />
              <div className="hasil-rincian-label">Rincian:</div>
              <ul className="hasil-rincian">
                {rincian.map((row, i) => (
                  <li key={i}>
                    <strong>{row.label}</strong> — {row.value}
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : null}
      </div>
      <div className="kartu info-metode">
        <h3>Tentang Rencana Terapi B</h3>
        <ul>
          <li>Dosis total: 75 mL/kgBB</li>
          <li>Diberikan dalam: 3 jam</li>
          <li>Untuk dehidrasi ringan–sedang</li>
        </ul>
        <p className="catatan-metode">
          Untuk dehidrasi ringan–sedang. Cairan diberikan sedikit-sedikit tapi
          sering secara oral/nasogastrik. Nilai ulang setiap 1–2 jam.
        </p>
      </div>
    </div>
  );
}
