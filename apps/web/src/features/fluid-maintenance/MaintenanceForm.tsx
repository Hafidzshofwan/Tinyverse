"use client";

import { useState } from "react";
import { viewMaintenance } from "@/entities/fluid";
import { NumberField, ResultList, type ResultRow } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";

/** Feature: kalkulator cairan rumatan (Holliday–Segar) — gaya v17. */
export function MaintenanceForm() {
  const profile = usePatientProfile();
  const [weight, setWeight] = useSyncedField(profile.bb);
  const [rows, setRows] = useState<ReadonlyArray<ResultRow>>([]);
  const [rincian, setRincian] = useState<ReadonlyArray<ResultRow>>([]);
  const [error, setError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

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

  return (
    <div>
      <div className="kartu">
        <NumberField
          label="Berat Badan (kg)"
          value={weight}
          onValueChange={setWeight}
          placeholder="cth: 12.5"
        />
        <button type="button" className="btn-hitung" onClick={hitung}>
          💧 Hitung Kebutuhan Cairan
        </button>
        {calculated ? (
          <ResultList rows={rows} rincian={rincian} error={error} />
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
