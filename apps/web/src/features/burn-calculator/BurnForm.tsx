"use client";

import { useMemo, useState } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";
import { NumberField } from "@/shared/ui";
import { viewBurn } from "@/entities/burn";
import { BurnSvgMap } from "./BurnSvgMap";

function formatTbsa(n: number): string {
  return n.toFixed(1).replace(".0", "");
}

export function BurnForm() {
  const [usia, setUsia] = useState("");
  const [berat, setBerat] = useState("");
  const [selected, setSelected] = useState<ReadonlyArray<BurnArea>>([]);

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
  const showChart = inputsReady;

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
            <div className="hasil-rincian">⚠️ {view.error}</div>
          ) : (
            <div className="burn-result-grid">
              <div className="burn-result-card">
                <div className="ikon-title">
                  <span className="ikon fire">🔥</span>
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
                  <span className="ikon water">💧</span>
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
                  <span className="ikon clock">⏰</span>
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
                  <span className="ikon">🧃</span>
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
                  <span className="ikon">💉</span>
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
                  <span className="ikon urine">🚻</span>
                  Target Produksi Urin
                </div>
                <div className="burn-result-value">
                  {view.urineMin.toFixed(1)}–{view.urineMax.toFixed(1)} mL/jam
                </div>
                <div className="hasil-rincian">Target: {view.urineLabel}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="kartu info-metode">
        <h3>Rumus yang digunakan</h3>
        <div className="burn-tbsa-chart-block">
          <h4>TBSA: Lund-Browder sesuai chart</h4>
          <svg
            className="burn-tbsa-chart-img"
            viewBox="0 0 600 340"
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
    </div>
  );
}
