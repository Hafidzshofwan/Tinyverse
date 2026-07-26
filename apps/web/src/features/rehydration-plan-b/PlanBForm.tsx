"use client";

import { useState } from "react";
import { viewPlanB } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

/** Feature: Rencana B (rehidrasi ringan–sedang) — gaya v17. */
export function PlanBForm() {
  const profile = usePatientProfile();
  const [weight, setWeight] = useSyncedField(profile.bb);
  const [, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [calculated, setCalculated] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  function hitung() {
    const result = viewPlanB(weight === "" ? NaN : Number(weight));
    setRows(result.rows);
    setRincian(result.rincian ?? []);
    setError(result.error);
    setTotal(result.total ? `${result.total.toFixed(0)} mL` : "");
    setDuration(result.duration ? `${result.duration} jam` : "");
    setCalculated(true);
  }

  const handleTambahRingkasan = () => {
    if (error || !total) return;
    const details = rincian.map((r) => `${r.label}: ${r.value}`).join("\n");
    addRingkasanItem({
      title: `Rehidrasi WHO - Rencana B (BB ${weight} kg)`,
      source: "Terapi Cairan",
      body: `Total Cairan Oralit: ${total} (Diberikan dalam ${duration})\n${details}`,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

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
              <div style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className="tv-btn"
                  style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  onClick={handleTambahRingkasan}
                >
                  {ditambahkan ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Ditambahkan ke Ringkasan!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 13H16M8 17H13" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Tambahkan ke Ringkasan
                    </>
                  )}
                </button>
              </div>
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
