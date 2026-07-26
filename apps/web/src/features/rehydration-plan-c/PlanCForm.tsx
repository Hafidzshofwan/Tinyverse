"use client";

import { useState } from "react";
import { viewPlanC } from "@/entities/fluid";
import type { PlanCAgeCategory } from "@/entities/fluid";
import { NumberField, RedFlagCrossLink } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

/** Feature: Rencana C (dehidrasi berat) — gaya v17. */
export function PlanCForm() {
  const profile = usePatientProfile();
  const [weight, setWeight] = useSyncedField(profile.bb);
  const [age, setAge] = useState<PlanCAgeCategory>("anak");
  const [result, setResult] = useState<ReturnType<typeof viewPlanC> | null>(
    null,
  );
  const [calculated, setCalculated] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  function hitung() {
    const r = viewPlanC(weight === "" ? NaN : Number(weight), age);
    setResult(r);
    setCalculated(true);
  }

  const handleTambahRingkasan = () => {
    if (!result || result.error || !result.total) return;
    const bodyText = [
      `Kategori: ${ageLabel} (${ageDetail}) | BB: ${weight} kg`,
      `Total Cairan IV: ${result.total.toFixed(0)} mL dalam ${result.totalHours} jam`,
      `Tahap 1 (${result.stage1?.hours} jam): ${result.stage1?.volumeMl.toFixed(0)} mL (${result.stage1?.mlPerHour.toFixed(1)} mL/jam)`,
      `Tahap 2 (${result.stage2?.hours} jam): ${result.stage2?.volumeMl.toFixed(0)} mL (${result.stage2?.mlPerHour.toFixed(1)} mL/jam)`,
      `Cairan: Ringer Laktat (RL) / NaCl 0,9%`,
    ].join("\n");

    addRingkasanItem({
      title: `Rehidrasi WHO - Rencana C (${ageLabel} BB ${weight} kg)`,
      source: "Terapi Cairan",
      body: bodyText,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

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
              <div className="hasil-rincian" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {result.error}
              </div>
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

        {calculated && result && !result.error && (
          <RedFlagCrossLink
            badge="PENANGANAN KRITIS DEHIDRASI BERAT"
            title="Evaluasi Tanda Syok Hipovolemik & Akses Vaskuler"
            description="Jika ditemukan akral dingin, CRT > 3 detik, atau nadi teraba lemah: Berikan Bolus RL 20 mL/kg dalam 15-30 menit & pertimbangkan pendorongan jalur intraoseus (IO) bila IV sulit."
            actions={[
              {
                label: "Buka Mode Darurat Resusitasi",
                href: "/preview/darurat",
                primary: true,
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
                  </svg>
                ),
              },
              {
                label: "Cek Elektrolit / Lab",
                href: "/preview/lab",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 3V8L4.5 17C3.8 18.4 4.8 20 6.4 20H17.6C19.2 20 20.2 18.4 19.5 17L15 8V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 3H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M7 14H17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                ),
              },
            ]}
          />
        )}
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
