"use client";

import { useEffect, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import {
  BANDS,
  LAB,
  bandFromMonths,
  checkValue,
  refTableRows,
} from "@/entities/lab";
import type { BandId, DxLine } from "@/entities/lab";

export function ReferenceTab() {
  const profile = usePatientProfile();
  const profBand = bandFromMonths(profile.usiaBulan);
  const [band, setBand] = useState<BandId>(profBand ?? "anak");
  useEffect(() => {
    if (profBand) setBand(profBand);
  }, [profBand]);

  const [test, setTest] = useState<string>(LAB[0]!.key);
  const [val, setVal] = useState("");
  const [hasil, setHasil] = useState<DxLine | null>(null);

  const rows = refTableRows(band);

  function cek() {
    const n = parseFloat(val.replace(",", "."));
    setHasil(checkValue(band, test, isFinite(n) ? n : null));
  }

  return (
    <>
      <div className="kartu">
        <div className="form-group">
          <label>Kelompok usia</label>
          <select
            value={band}
            onChange={(e) => setBand(e.target.value as BandId)}
          >
            {BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <table className="dx-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Rujukan</th>
              <th>Satuan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.range}</td>
                <td>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="dx-note">
          Rentang mengacu Harriet Lane Handbook & AAP/ACCP; ambang anemia
          mengikuti WHO 2024. Selalu sesuaikan dengan rentang laboratorium
          setempat.
        </p>
      </div>

      <div className="kartu">
        <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          Cek Cepat Satu Nilai
        </div>
        <div className="form-group">
          <label>Parameter</label>
          <select value={test} onChange={(e) => setTest(e.target.value)}>
            {LAB.map((t) => (
              <option key={t.key} value={t.key}>
                {t.name} ({t.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Nilai hasil</label>
          <input
            type="number"
            inputMode="decimal"
            value={val}
            step={0.1}
            placeholder="mis. 11.2"
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
        <button type="button" className="btn-hitung" onClick={cek}>
          Cek Nilai
        </button>
        {hasil ? (
          <div
            className={"dx-res " + hasil.cls}
            dangerouslySetInnerHTML={{ __html: hasil.html }}
          />
        ) : null}
      </div>
    </>
  );
}
