"use client";

import { useState } from "react";
import { viewMaintenance } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

/** Feature: kalkulator cairan rumatan (Holliday–Segar) — gaya v17. */
export function MaintenanceForm() {
  const profile = usePatientProfile();
  const [weight, setWeight] = useSyncedField(profile.bb);
  const [rows, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  function hitung() {
    if (weight.trim() === "") {
      setError("Isi berat badan terlebih dahulu.");
      setRows([]);
      setRincian([]);
      setCalculated(true);
      return;
    }
    try {
      const result = viewMaintenance(Number(weight));
      setRows(result.rows);
      setRincian(result.rincian ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Input tidak valid");
      setRows([]);
      setRincian([]);
    }
    setCalculated(true);
  }

  const handleTambahRingkasan = () => {
    if (!rows.length || error) return;
    const summary = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
    addRingkasanItem({
      title: `Cairan Rumatan (Holliday-Segar) - BB ${weight} kg`,
      source: "Terapi Cairan",
      body: summary,
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
          placeholder="cth: 12.5"
        />
        <button type="button" className="btn-hitung" onClick={hitung} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C12 3 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 3 12 3Z" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="1.8" />
          </svg>
          Hitung Kebutuhan Cairan
        </button>
        {calculated ? (
          <>
            <ResultList rows={rows} rincian={rincian} error={error} />
            {!error && rows.length > 0 && (
              <div style={{ marginTop: 12 }}>
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
            )}
          </>
        ) : null}
      </div>
      <div className="kartu info-metode">
        <h3>Tentang metode Holliday–Segar</h3>
        <ul>
          <li>10 kg pertama → 100 mL/kgBB/hari</li>
          <li>10 kg kedua (11–20 kg) → tambahan 50 mL/kgBB/hari</li>
          <li>Setiap kg di atas 20 kg → tambahan 20 mL/kgBB/hari</li>
        </ul>
        <p className="catatan-metode">
          Hasil adalah estimasi kebutuhan cairan rumatan harian dalam kondisi
          normal (tanpa dehidrasi/kehilangan cairan tambahan). Penyesuaian
          klinis tetap diperlukan sesuai kondisi pasien.
        </p>
      </div>
    </div>
  );
}
