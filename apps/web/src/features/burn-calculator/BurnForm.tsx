"use client";

import { useEffect, useMemo, useState } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";
import {
  NumberField,
  RedFlagCrossLink,
  ReferensiBlok,
  REFERENSI_LUKA_BAKAR_LUND,
} from "@/shared/ui";
import { usePatientProfile, usePatientKey, useSyncedField } from "@/shared/lib/patient";
import { viewBurn } from "@/entities/burn";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { BurnSvgMap } from "./BurnSvgMap";

function formatTbsa(n: number): string {
  return n.toFixed(1).replace(".0", "");
}

export function BurnForm() {
  const profile = usePatientProfile();
  const usiaTahun =
    profile.usiaBulan != null
      ? Math.round((profile.usiaBulan / 12) * 10) / 10
      : null;
  const [usia, setUsia] = useSyncedField(usiaTahun);
  const [berat, setBerat] = useSyncedField(profile.bb);
  const [selected, setSelected] = useState<ReadonlyArray<BurnArea>>([]);
  const [ditambahkan, setDitambahkan] = useState(false);

  /*
   * WHY: berat dan usia kini sudah ikut berganti pasien, tetapi PILIHAN AREA
   * LUKA BAKAR tidak. Bila hanya kolom angka yang direset, luas luka milik
   * pasien sebelumnya akan terhitung memakai berat pasien baru - kombinasi yang
   * tidak pernah ada pada pasien mana pun, dan justru dipakai untuk menghitung
   * resusitasi cairan. Karena itu peta luka ikut dikosongkan.
   */
  const kunciPasien = usePatientKey();
  useEffect(() => {
    setSelected([]);
    setDitambahkan(false);
  }, [kunciPasien]);

  function toggle(area: BurnArea) {
    setSelected((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  const view = useMemo(
    () => viewBurn(selected, usia, berat),
    [selected, usia, berat],
  );

  const inputsReady = usia.trim() !== "" && berat.trim() !== "";
  const showResults = inputsReady && (selected.length > 0 || view.error);

  const handleTambahRingkasan = () => {
    if (view.error || view.tbsaPercent === 0) return;
    const bodyText = [
      `Usia: ${usia} thn | BB: ${berat} kg`,
      `Luas Luka Bakar (TBSA): ${formatTbsa(view.tbsaPercent)}%`,
      `Parkland (24j): ${Math.round(view.parkland)} mL (8j pertama: ${Math.round(view.first8h)} mL, 16j berikut: ${Math.round(view.next16h)} mL)`,
      `Maintenance: ${Math.round(view.maintenance)} mL/hari`,
      `Total 24j: ${Math.round(view.total24h)} mL`,
      `Target Urin: ${view.urineMin.toFixed(1)}–${view.urineMax.toFixed(1)} mL/jam`,
    ].join("\n");

    addRingkasanItem({
      title: `Rehidrasi Luka Bakar - TBSA ${formatTbsa(view.tbsaPercent)}%`,
      source: "Terapi Cairan",
      body: bodyText,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

  return (
    <div>
      <div className="kartu burn-card">
        <h3 className="kartu-title">Rehidrasi Luka Bakar</h3>
        <div className="form-row-group">
          <NumberField
            label="Usia (tahun)"
            value={usia}
            onValueChange={setUsia}
            placeholder="cth: 4"
            step={0.1}
          />
          <NumberField
            label="Berat Badan (kg)"
            value={berat}
            onValueChange={setBerat}
            placeholder="cth: 20"
            step={0.1}
          />
        </div>

        <p className="catatan-metode" style={{ marginTop: 2 }}>
          Pilih area luka bakar derajat 2/3 langsung pada body map. Kepala
          depan, kepala belakang, leher depan, dan leher belakang kini bisa
          dipilih masing-masing; area lengan, tangan, tungkai, dan kaki juga
          bisa dipilih detail sesuai chart Lund &amp; Browder: A = ½ kepala, B =
          ½ paha, C = ½ tungkai bawah. Luka bakar superfisial/derajat 1 tidak
          dimasukkan.
        </p>

        <BurnSvgMap selected={selected} onToggle={toggle} />

        <div className="burn-map-actions">
          <button
            type="button"
            className="burn-reset-btn"
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
          >
            Reset pilihan area
          </button>
        </div>

        <div className={`hasil-box-cairan ${showResults ? "tampil" : ""}`}>
          <h3>HASIL REHIDRASI LUKA BAKAR</h3>

          {view.error ? (
            <div className="hasil-rincian" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {view.error}
            </div>
          ) : (
            <div className="burn-result-grid">
              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon fire">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C12 2 7 7 7 12C7 15.9 10.1 19 14 19C17.9 19 21 15.9 21 12C21 8 18 4 18 4C18 4 17 8 15 9C13 10 12 2 12 2Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
                      <path d="M12 12C12 12 9 14 9 16.5C9 18.4 10.3 20 12 20C13.7 20 15 18.4 15 16.5C15 14 12 12 12 12Z" fill="#EF4444" />
                    </svg>
                  </span>
                  Luas Luka Bakar
                </div>
                <div className="burn-result-value">
                  {formatTbsa(view.tbsaPercent)}%
                </div>
                <div className="hasil-rincian">
                  {view.chart ? (
                    <>
                      Kelompok chart: <strong>{view.chart.label}</strong>
                      <br />
                      Nilai aktif: A={view.chart.A}%, B={view.chart.B}%, C=
                      {view.chart.C}%
                    </>
                  ) : null}
                  {view.areas.length > 0 ? (
                    <ul className="burn-rincian-list">
                      {view.areas.map((a) => (
                        <li key={a.label}>
                          {a.label} = {formatTbsa(a.percent)}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="catatan-metode">
                      Belum ada area luka bakar yang dipilih.
                    </p>
                  )}
                </div>
              </div>

              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon water">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C12 3 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 3 12 3Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.5" />
                    </svg>
                  </span>
                  Cairan Resusitasi (Parkland)
                </div>
                <div className="burn-result-value">
                  {Math.round(view.parkland)} mL
                </div>
                <div className="hasil-rincian">
                  4 × {view.weightKg.toFixed(1)} × {view.tbsaPercent.toFixed(1)}{" "}
                  = {Math.round(view.parkland)} mL
                  <br />
                  <strong>Cairan:</strong> Ringer Laktat (RL) hangat.
                </div>
              </div>

              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon clock">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="13" r="8" stroke="#0369A1" strokeWidth="1.8" fill="#E0F2FE" />
                      <path d="M12 9V13L15 15" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  Pembagian Cairan
                </div>
                <div className="hasil-rincian">
                  <strong>8 jam pertama:</strong> {Math.round(view.first8h)} mL
                  <br />
                  <strong>16 jam berikutnya:</strong> {Math.round(view.next16h)}{" "}
                  mL
                </div>
              </div>

              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 3H15V6H9V3Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
                      <rect x="7" y="6" width="10" height="14" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                      <path d="M7 11H17" stroke="#38BDF8" strokeWidth="1.5" />
                    </svg>
                  </span>
                  Maintenance
                </div>
                <div className="burn-result-value">
                  {Math.round(view.maintenance)} mL/hari
                </div>
                <div className="hasil-rincian">
                  {view.maintenanceRincian.map((r, i) => (
                    <div key={i}>{r}</div>
                  ))}
                </div>
              </div>

              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3V10M12 10C10.3 10 9 11.3 9 13C9 15.5 12 19 12 19C12 19 15 15.5 15 13C15 11.3 13.7 10 12 10Z" stroke="#0284C7" strokeWidth="1.5" fill="#7DD3FC" />
                      <circle cx="12" cy="13" r="1.5" fill="#0369A1" />
                    </svg>
                  </span>
                  Total 24 Jam Pertama
                </div>
                <div className="burn-result-value">
                  {Math.round(view.total24h)} mL/24 jam
                </div>
                <div className="hasil-rincian">
                  Parkland {Math.round(view.parkland)} + maintenance{" "}
                  {Math.round(view.maintenance)} mL
                </div>
              </div>

              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon urine">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4C12 4 7 10 7 14.5C7 17.5 9.2 20 12 20C14.8 20 17 17.5 17 14.5C17 10 12 4 12 4Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
                    </svg>
                  </span>
                  Target Produksi Urin
                </div>
                <div className="burn-result-value">
                  {view.urineMin.toFixed(1)}–{view.urineMax.toFixed(1)} mL/jam
                </div>
                <div className="hasil-rincian">Target: {view.urineLabel}</div>
              </div>
            </div>
          )}

          {!view.error && view.tbsaPercent > 0 && (
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
          )}

          {view.tbsaPercent >= 10 && (
            <RedFlagCrossLink
              badge="RED-FLAG KLINIS (TBSA ≥ 10%)"
              title="Indikasi Resusitasi Cairan Agresif & Pemantauan Urin"
              description="Luka bakar ≥10% TBSA berisiko tinggi syok hipovolemik cepat. Berikan resusitasi Parkland (RL hangat), pantau kateter urin ketat (target 1–2 mL/kg/jam), & siapkan rujukan Unit Luka Bakar."
              actions={[
                {
                  label: "Hitung Cairan Rumatan",
                  href: "/preview/fluids",
                  primary: true,
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C12 3 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 3 12 3Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
                    </svg>
                  ),
                },
                {
                  label: "Mode Darurat Resusitasi",
                  href: "/preview/darurat",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      <div className="kartu info-metode">
        <h3>Rumus yang digunakan</h3>
        <div
          className="burn-tbsa-chart-block"
          style={{
            width: "fit-content",
            maxWidth: "100%",
            marginLeft: 0,
            marginRight: "auto",
            textAlign: "left",
          }}
        >
          <h4>TBSA: Lund-Browder sesuai chart</h4>
          <svg
            className="burn-tbsa-chart-img"
            viewBox="0 0 600 340"
            style={{ width: "100%", maxWidth: 560, display: "block", margin: 0 }}
            aria-label="Tabel nilai A kepala, B paha, dan C tungkai pada chart Lund-Browder berdasarkan usia"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F6F0FF" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <rect
              x="10"
              y="10"
              width="580"
              height="320"
              rx="18"
              fill="url(#chartGrad)"
              stroke="rgba(130,92,230,0.18)"
              strokeWidth="2"
            />
            <text
              x="300"
              y="50"
              textAnchor="middle"
              fontFamily="Fredoka, Quicksand, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="#25245C"
            >
              Lund-Browder Chart
            </text>
            <text
              x="300"
              y="80"
              textAnchor="middle"
              fontFamily="Quicksand, sans-serif"
              fontSize="14"
              fontWeight="700"
              fill="#8A7868"
            >
              A = ½ kepala, B = ½ paha, C = ½ tungkai bawah
            </text>
            <g transform="translate(60, 120)">
              <rect
                width="480"
                height="160"
                rx="14"
                fill="#FFFFFF"
                stroke="rgba(130,92,230,0.12)"
              />
              <text
                x="20"
                y="30"
                fontFamily="Fredoka, Quicksand, sans-serif"
                fontSize="16"
                fontWeight="700"
                fill="#6D4CBB"
              >
                Usia
              </text>
              <text
                x="140"
                y="30"
                fontFamily="Fredoka, Quicksand, sans-serif"
                fontSize="16"
                fontWeight="700"
                fill="#6D4CBB"
              >
                A (%)
              </text>
              <text
                x="240"
                y="30"
                fontFamily="Fredoka, Quicksand, sans-serif"
                fontSize="16"
                fontWeight="700"
                fill="#6D4CBB"
              >
                B (%)
              </text>
              <text
                x="340"
                y="30"
                fontFamily="Fredoka, Quicksand, sans-serif"
                fontSize="16"
                fontWeight="700"
                fill="#6D4CBB"
              >
                C (%)
              </text>

              {[
                ["0 tahun", 9.5, 2.75, 2.5],
                ["1 tahun", 8.5, 3.25, 2.5],
                ["5 tahun", 6.5, 4, 2.75],
                ["10 tahun", 5.5, 4.25, 3],
                ["15 tahun", 4.5, 4.5, 3.25],
                ["Dewasa", 3.5, 4.75, 3.5],
              ].map((row, i) => (
                <g key={row[0]} transform={`translate(0, ${50 + i * 22})`}>
                  <text
                    x="20"
                    y="0"
                    fontFamily="Quicksand, sans-serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="#4A3728"
                  >
                    {row[0]}
                  </text>
                  <text
                    x="150"
                    y="0"
                    textAnchor="middle"
                    fontFamily="Quicksand, sans-serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="#4A3728"
                  >
                    {row[1]}
                  </text>
                  <text
                    x="250"
                    y="0"
                    textAnchor="middle"
                    fontFamily="Quicksand, sans-serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="#4A3728"
                  >
                    {row[2]}
                  </text>
                  <text
                    x="350"
                    y="0"
                    textAnchor="middle"
                    fontFamily="Quicksand, sans-serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="#4A3728"
                  >
                    {row[3]}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
        <ul>
          <li>
            <strong>Parkland:</strong> 4 × BB × %TBSA = cairan resusitasi 24 jam
            pertama.
          </li>
          <li>
            <strong>Pembagian:</strong> 50% dalam 8 jam pertama, 50% dalam 16
            jam berikutnya.
          </li>
          <li>
            <strong>Maintenance:</strong> Holliday–Segar ditambahkan ke
            kebutuhan resusitasi.
          </li>
        </ul>
        <p className="catatan-metode">
          Gunakan sebagai alat bantu hitung cepat. Pilih hanya area luka bakar
          derajat 2/3; jangan masukkan luka superfisial/eritema. Waktu 8 jam
          pertama dihitung sejak kejadian luka bakar, bukan sejak pasien tiba di
          fasilitas kesehatan.
        </p>
      </div>

      <ReferensiBlok
        sumber={REFERENSI_LUKA_BAKAR_LUND}
        catatan="Persentase tiap regio pada chart mengikuti tabel usia Lund &amp; Browder (1944); volume resusitasi mengikuti rumus Parkland (Baxter &amp; Shires, 1968) dengan rumatan Holliday-Segar."
      />

    </div>
  );
}
