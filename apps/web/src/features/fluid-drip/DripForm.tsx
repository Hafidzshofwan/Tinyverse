"use client";

import { useState } from "react";
import { DRIP_OPTIONS, viewDrip } from "@/entities/fluid";
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

  // Label & faktor tetes selalu diambil dari tabel domain, tidak ditulis ulang di UI.
  const setTerpilih = DRIP_OPTIONS.find((o) => o.id === factor);
  const teksSetTerpilih = setTerpilih
    ? `${setTerpilih.label} (${setTerpilih.dropFactor} tpm/mL)`
    : factor;

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
      `Set Drip: ${teksSetTerpilih}`,
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
        <div className="form-group" style={{ marginTop: 4, marginBottom: 8 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3V10M12 10C10.3 10 9 11.3 9 13C9 15.5 12 19 12 19C12 19 15 15.5 15 13C15 11.3 13.7 10 12 10Z" stroke="#0A0B5F" strokeWidth="1.8" fill="#BAE6FD" />
              <circle cx="12" cy="13" r="1.5" fill="#0369A1" />
            </svg>
            Ukuran Drip Set
          </label>
        </div>
        <div className="segmented-toggle" style={{ marginBottom: 18 }}>
          {DRIP_OPTIONS.map((opsi) => (
            <button
              key={opsi.id}
              type="button"
              className={`segmented-btn ${factor === opsi.id ? "aktif" : ""}`}
              style={{ flexDirection: "column", gap: "2px", padding: "8px 10px" }}
              onClick={() => setFactor(opsi.id)}
            >
              <span>{opsi.label}</span>
              <small style={{ fontSize: "0.72rem", display: "block" }}>{opsi.dropFactor} tpm/mL</small>
            </button>
          ))}
        </div>
        <button type="button" className="btn-hitung" onClick={hitung} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V10M12 10C10.3 10 9 11.3 9 13C9 15.5 12 19 12 19C12 19 15 15.5 15 13C15 11.3 13.7 10 12 10Z" stroke="#FFFFFF" strokeWidth="1.8" fill="#7DD3FC" />
            <circle cx="12" cy="13" r="1.5" fill="#FFFFFF" />
          </svg>
          Hitung Faktor Tetes
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
        <h3>Rumus faktor tetes</h3>
        <ul>
          <li>
            Tetes/menit = volume cairan (mL) × faktor tetes ÷ waktu (menit)
          </li>
          <li>Blood set: 15 tetes/mL</li>
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
