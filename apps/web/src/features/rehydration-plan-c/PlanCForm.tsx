"use client";

import { useState } from "react";
import { viewPlanC } from "@/entities/fluid";
import type { PlanCAgeCategory } from "@/entities/fluid";
import { NumberField } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";

/** Feature: Rencana C (dehidrasi berat) — gaya v17. */
export function PlanCForm() {
  const profile = usePatientProfile();
  const [weight, setWeight] = useSyncedField(profile.bb);
  const [age, setAge] = useState<PlanCAgeCategory>("anak");
  const [result, setResult] = useState<ReturnType<typeof viewPlanC> | null>(
    null,
  );
  const [calculated, setCalculated] = useState(false);

  function hitung() {
    const r = viewPlanC(weight === "" ? NaN : Number(weight), age);
    setResult(r);
    setCalculated(true);
  }

  const ageLabel = age === "bayi" ? "Bayi" : "Anak";
  const ageDetail = age === "bayi" ? "< 1 tahun" : "≥ 1 tahun";

  return (
    <div>
      <div className="kartu">
        <NumberField
          label="Berat Badan (kg)"
          value={weight}
          onValueChange={setWeight}
          placeholder="cth: 12"
        />
        <div className="segmented-toggle" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className={`segmented-btn ${age === "bayi" ? "aktif" : ""}`}
            onClick={() => setAge("bayi")}
          >
            Bayi
            <br />
            <small style={{ fontSize: "0.72rem" }}>&lt; 1 tahun</small>
          </button>
          <button
            type="button"
            className={`segmented-btn ${age === "anak" ? "aktif" : ""}`}
            onClick={() => setAge("anak")}
          >
            Anak
            <br />
            <small style={{ fontSize: "0.72rem" }}>≥ 1 tahun</small>
          </button>
        </div>
        <button type="button" className="btn-hitung" onClick={hitung}>
          Hitung Rencana C
        </button>

        {calculated ? (
          result?.error ? (
            <div className="hasil-box-cairan tampil">
              <div className="hasil-rincian">⚠️ {result.error}</div>
            </div>
          ) : (
            <div className="hasil-box-cairan tampil">
              <div className="hasil-label">
                HASIL PERHITUNGAN — RENCANA C ({ageLabel} / {ageDetail})
              </div>
              <div className="hasil-dosis">{result?.total?.toFixed(0)} mL</div>
              <span className="hasil-sub">
                total dalam {result?.totalHours} jam
              </span>
              <hr className="hasil-divider" />

              <div className="stage-row">
                <span className="stage-name">
                  Tahap 1 = {result?.stage1?.hours} jam
                </span>
                <span className="stage-value">
                  Volume ({result?.stage1?.mlPerKg} mL/kg){" "}
                  {result?.stage1?.volumeMl.toFixed(0)} mL
                  <br />
                  Laju ≈ {result?.stage1?.mlPerHour.toFixed(1)} mL/jam
                </span>
              </div>
              <div className="stage-row">
                <span className="stage-name">
                  Tahap 2 = {result?.stage2?.hours} jam
                </span>
                <span className="stage-value">
                  Volume ({result?.stage2?.mlPerKg} mL/kg){" "}
                  {result?.stage2?.volumeMl.toFixed(0)} mL
                  <br />
                  Laju ≈ {result?.stage2?.mlPerHour.toFixed(1)} mL/jam
                </span>
              </div>

              <div className="stage-note">
                <strong>Cairan:</strong> Ringer Laktat (RL) hangat; bila tidak
                tersedia gunakan NaCl 0,9%.
              </div>
              <div className="stage-note">
                <strong>Total:</strong> {Number(weight).toFixed(1)} kg × 100
                mL/kg = {result?.total?.toFixed(0)} mL, diberikan dalam{" "}
                {result?.totalHours} jam ({result?.stage1?.hours} jam +{" "}
                {result?.stage2?.hours} jam).
              </div>
            </div>
          )
        ) : null}
      </div>
      <div className="kartu info-metode">
        <h3>Tentang Rencana Terapi C</h3>
        <ul>
          <li>Dosis total: 100 mL/kgBB, diberikan dalam 2 tahap</li>
          <li>Bayi (&lt; 1 tahun): Tahap 1 → 30 mL/kg, Tahap 2 → 70 mL/kg</li>
          <li>Anak (≥ 1 tahun): Tahap 1 → 30 mL/kg, Tahap 2 → 70 mL/kg</li>
        </ul>
        <p className="catatan-metode">
          Untuk dehidrasi berat, jalur IV. Nilai ulang anak setiap 1–2 jam; jika
          hidrasi belum membaik, ulangi tahap 1.
        </p>
      </div>
    </div>
  );
}
