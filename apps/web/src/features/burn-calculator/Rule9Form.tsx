"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  BurnMechanism,
  DripType,
  RuleOfNinesArea,
} from "@tinyverse/clinical-core";
import { DRIP_OPTIONS } from "@tinyverse/clinical-core";
import {
  NumberField,
  RedFlagCrossLink,
  ReferensiBlok,
  REFERENSI_LUKA_BAKAR_RULE9,
} from "@/shared/ui";
import {
  usePatientProfile,
  usePatientKey,
  useSyncedField,
} from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { Rule9SvgMap } from "./Rule9SvgMap";
import { viewRule9 } from "./rule9-view";

const MEKANISME: ReadonlyArray<{ id: BurnMechanism; label: string }> = [
  { id: "termal", label: "Termal / api / air panas" },
  { id: "listrik", label: "Listrik" },
];

function bulat(n: number): number {
  return Math.round(n);
}

function formatTbsa(n: number): string {
  return String(Math.round(n * 100) / 100).replace(".", ",");
}

export function Rule9Form() {
  const profile = usePatientProfile();
  const usiaTahun =
    profile.usiaBulan != null
      ? Math.round((profile.usiaBulan / 12) * 10) / 10
      : null;
  const [usia, setUsia] = useSyncedField(usiaTahun);
  const [berat, setBerat] = useSyncedField(profile.bb);
  const [selected, setSelected] = useState<ReadonlyArray<RuleOfNinesArea>>([]);
  const [mekanisme, setMekanisme] = useState<BurnMechanism>("termal");
  const [jamKejadian, setJamKejadian] = useState("");
  const [praRs, setPraRs] = useState("");
  const [dripType, setDripType] = useState<DripType>("makro");
  const [ditambahkan, setDitambahkan] = useState(false);

  /*
   * WHY: sama seperti peta Lund, pilihan area dan riwayat kejadian milik
   * pasien lama tidak boleh terbawa ke pasien baru. Kalau hanya kolom angka
   * yang direset, luas luka pasien sebelumnya akan dihitung memakai berat
   * pasien baru - kombinasi yang tidak pernah ada pada pasien mana pun.
   */
  const kunciPasien = usePatientKey();
  useEffect(() => {
    setSelected([]);
    setMekanisme("termal");
    setJamKejadian("");
    setPraRs("");
    setDitambahkan(false);
  }, [kunciPasien]);

  function toggle(area: RuleOfNinesArea) {
    setSelected((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  const view = useMemo(
    () =>
      viewRule9(selected, usia, berat, {
        mekanisme,
        jamSejakKejadian: jamKejadian,
        praRsMl: praRs,
        dripType,
      }),
    [selected, usia, berat, mekanisme, jamKejadian, praRs, dripType],
  );

  const usiaAngka = Number(usia);
  const usiaPeta = Number.isFinite(usiaAngka) ? usiaAngka : 1;
  const inputsReady = usia.trim() !== "" && berat.trim() !== "";
  const showResults = inputsReady && (selected.length > 0 || view.error != null);
  const atls = view.atls;

  const handleTambahRingkasan = () => {
    if (view.error != null || atls == null) return;
    const bodyText = [
      `Usia: ${usia} thn | BB: ${berat} kg`,
      `Metode luas: Rule of Nines (${view.chartLabel})`,
      ...view.rows.slice(1).map((r) => `${r.label}: ${r.value}`),
    ].join("\n");

    addRingkasanItem({
      title: `Luka Bakar Rule of Nines - TBSA ${formatTbsa(view.tbsaPercent)}%`,
      source: "Terapi Cairan",
      body: bodyText,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

  return (
    <div>
      <div className="kartu burn-card">
        <h3 className="kartu-title">Rule of Nines + Resusitasi ATLS</h3>

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

        <div className="form-row-group">
          <NumberField
            label="Jam sejak kejadian"
            value={jamKejadian}
            onValueChange={setJamKejadian}
            placeholder="cth: 2"
            step={0.5}
          />
          <NumberField
            label="Cairan sudah masuk (mL)"
            value={praRs}
            onValueChange={setPraRs}
            placeholder="cth: 200"
            step={10}
          />
        </div>

        <div className="form-group">
          <label>Mekanisme cedera</label>
          <div className="segmented-toggle">
            {MEKANISME.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`segmented-btn ${mekanisme === m.id ? "aktif" : ""}`}
                onClick={() => setMekanisme(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Set infus untuk hitungan tetesan</label>
          <div className="segmented-toggle">
            {DRIP_OPTIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`segmented-btn ${dripType === d.id ? "aktif" : ""}`}
                onClick={() => setDripType(d.id)}
              >
                {d.label} ({d.dropFactor})
              </button>
            ))}
          </div>
        </div>

        <p className="catatan-metode" style={{ marginTop: 2 }}>
          Pilih bidang yang terkena luka bakar derajat 2/3. Rule of Nines adalah
          metode cepat: angka kepala dan tungkai sudah disesuaikan usia (bayi
          kepala 18%, tiap tungkai 13,5%; menyamai dewasa pada usia 9 tahun).
          Untuk luka yang tersebar atau kecil-kecil, chart Lund &amp; Browder
          lebih teliti.
        </p>

        <Rule9SvgMap
          selected={selected}
          onToggle={toggle}
          ageYears={usiaPeta}
        />

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
          <h3>HASIL RESUSITASI LUKA BAKAR (ATLS)</h3>

          {view.error != null ? (
            <div
              className="hasil-rincian"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {view.error}
            </div>
          ) : atls != null ? (
            <>
              <div className="burn-result-grid">
                <div className="burn-result-card">
                  <div className="ikon-title">
                    <span className="ikon fire">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C12 2 7 7 7 12C7 15.9 10.1 19 14 19C17.9 19 21 15.9 21 12C21 8 18 4 18 4C18 4 17 8 15 9C13 10 12 2 12 2Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
                        <path d="M12 12C12 12 9 14 9 16.5C9 18.4 10.3 20 12 20C13.7 20 15 18.4 15 16.5C15 14 12 12 12 12Z" fill="#EF4444" />
                      </svg>
                    </span>
                    Luas Luka Bakar (TBSA)
                  </div>
                  <div className="burn-result-value">
                    {formatTbsa(view.tbsaPercent)}%
                  </div>
                  <div className="hasil-rincian">
                    Bagan usia: <strong>{view.chartLabel}</strong>
                    {view.kontribusi.length > 0 ? (
                      <ul className="burn-rincian-list">
                        {view.kontribusi.map((k) => (
                          <li key={k.label}>
                            {k.label} = {formatTbsa(k.percent)}%
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
                    Cairan Resusitasi (ATLS)
                  </div>
                  <div className="burn-result-value">
                    {bulat(atls.total24h)} mL
                  </div>
                  <div className="hasil-rincian">
                    {atls.faktor} × {berat} × {formatTbsa(view.tbsaPercent)} ={" "}
                    {bulat(atls.total24h)} mL
                    <br />
                    <strong>Faktor:</strong> {atls.faktorAlasan}
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
                    Laju 8 Jam Pertama
                  </div>
                  <div className="burn-result-value">
                    {bulat(atls.fase1LajuMlPerJam)} mL/jam
                  </div>
                  <div className="hasil-rincian">
                    <strong>Jatah fase 1:</strong> {bulat(atls.fase1Ml)} mL
                    <br />
                    {atls.praRsMl > 0
                      ? `Sudah masuk ${bulat(atls.praRsMl)} mL, sisa ${bulat(atls.fase1SisaMl)} mL.`
                      : "Belum ada cairan yang masuk."}
                    <br />
                    {atls.fase1Terlewat
                      ? "8 jam pertama sudah lewat. Kejar sisa defisit dan titrasi ketat."
                      : `Sisa waktu fase 1: ${atls.sisaJamFase1} jam.`}
                    {atls.tetesFase1 != null ? (
                      <>
                        <br />
                        <strong>{atls.tetesFase1} tetes/menit</strong> ({atls.dripLabel})
                      </>
                    ) : null}
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
                    16 Jam Berikutnya
                  </div>
                  <div className="burn-result-value">
                    {bulat(atls.fase2LajuMlPerJam)} mL/jam
                  </div>
                  <div className="hasil-rincian">
                    <strong>Jatah fase 2:</strong> {bulat(atls.fase2Ml)} mL
                    {atls.tetesFase2 != null ? (
                      <>
                        <br />
                        <strong>{atls.tetesFase2} tetes/menit</strong> ({atls.dripLabel})
                      </>
                    ) : null}
                  </div>
                </div>

                {atls.rumatanBerlaku ? (
                  <div className="burn-result-card">
                    <div className="ikon-title">
                      <span className="ikon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 3H15V6H9V3Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
                        <rect x="7" y="6" width="10" height="14" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                        <path d="M7 11H17" stroke="#38BDF8" strokeWidth="1.5" />
                      </svg>
                    </span>
                      Rumatan 4-2-1
                    </div>
                    <div className="burn-result-value">
                      {bulat(atls.rumatanMlPerJam)} mL/jam
                    </div>
                    <div className="hasil-rincian">
                      {atls.rumatanRincian}
                      <br />
                      Berat ≤ 30 kg: rumatan berdekstrosa lewat jalur terpisah,
                      tidak ikut dititrasi.
                      {atls.tetesRumatan != null ? (
                        <>
                          <br />
                          <strong>{atls.tetesRumatan} tetes/menit</strong> ({atls.dripLabel})
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}

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
                    {Math.round(atls.urinMin * 10) / 10}–
                    {Math.round(atls.urinMax * 10) / 10} mL/jam
                  </div>
                  <div className="hasil-rincian">
                    Target: {atls.urinLabel}
                    <br />
                    Titrasi laju naik-turun 20-33% mengikuti urin, tanpa bolus.
                  </div>
                </div>

                {atls.melampauiCreep ? (
                  <div className="burn-result-card">
                    <div className="ikon-title">
                      <span className="ikon fire">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C12 2 7 7 7 12C7 15.9 10.1 19 14 19C17.9 19 21 15.9 21 12C21 8 18 4 18 4C18 4 17 8 15 9C13 10 12 2 12 2Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" />
                        <path d="M12 12C12 12 9 14 9 16.5C9 18.4 10.3 20 12 20C13.7 20 15 18.4 15 16.5C15 14 12 12 12 12Z" fill="#EF4444" />
                      </svg>
                    </span>
                      Waspada Fluid Creep
                    </div>
                    <div className="burn-result-value">
                      &gt; {bulat(atls.batasCreepMlPerJam)} mL/jam
                    </div>
                    <div className="hasil-rincian">
                      Laju awal sudah melewati ambang 6 mL/kg/%TBSA. Risiko edema,
                      sindrom kompartemen, dan gagal napas meningkat. Pertimbangkan
                      koloid dan konsultasi pusat luka bakar.
                    </div>
                  </div>
                ) : null}
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

              {view.tbsaPercent >= 10 ? (
                <RedFlagCrossLink
                  badge="RED-FLAG KLINIS (TBSA ≥ 10%)"
                  title="Indikasi Resusitasi Cairan Agresif & Pemantauan Urin"
                  description="Luka bakar ≥10% TBSA berisiko tinggi syok hipovolemik cepat. Mulai RL hangat sesuai kerangka ATLS, pasang kateter urin dan titrasi laju mengikuti produksi urin, serta siapkan rujukan Unit Luka Bakar."
                  actions={[
                    {
                      label: "Hitung Cairan Rumatan",
                      href: "/preview/fluids",
                      primary: true,
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 3C12 3 6 10 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 10 12 3 12 3Z"
                            fill="#FFFFFF"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Mode Darurat Resusitasi",
                      href: "/preview/darurat",
                      icon: (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      ),
                    },
                  ]}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="kartu info-metode">
        <h3>Rumus yang digunakan</h3>
        <ul>
          <li>
            <b>Luas luka (Rule of Nines).</b> Kepala 18% pada bayi, berkurang 1%
            tiap tahun usia dan dialihkan ke kedua tungkai (0,5% per tungkai),
            sampai menyamai angka dewasa kepala 9% dan tiap tungkai 18% pada
            usia 9 tahun. Batang tubuh depan 18%, belakang 18%, tiap lengan 9%,
            perineum 1%.
          </li>
          <li>
            <b>Volume resusitasi (kerangka ATLS).</b> Faktor 3 mL/kg/%TBSA untuk
            anak di bawah 14 tahun, 2 mL/kg/%TBSA untuk usia 14 tahun ke atas,
            dan 4 mL/kg/%TBSA untuk cedera listrik pada segala usia. Ringer
            Laktat hangat.
          </li>
          <li>
            <b>Pembagian waktu.</b> Separuh volume diberikan dalam 8 jam pertama
            dihitung sejak jam kejadian, bukan sejak pasien tiba. Separuh sisanya
            dalam 16 jam berikutnya.
          </li>
          <li>
            <b>Rumatan 4-2-1.</b> Anak dengan berat 30 kg ke bawah mendapat
            cairan rumatan mengandung dekstrosa lewat jalur terpisah, karena
            cadangan glikogennya kecil. Rumatan tidak ikut dititrasi.
          </li>
          <li>
            <b>Titrasi.</b> Angka rumus hanya titik awal. Laju disesuaikan
            naik-turun 20-33% tiap jam mengikuti produksi urin, tanpa bolus
            kecuali ada syok.
          </li>
        </ul>
        <p className="catatan-metode">
          Rule of Nines dipakai untuk penilaian cepat. Chart Lund &amp; Browder
          pada tab sebelah tetap menjadi rujukan yang lebih teliti, terutama pada
          anak kecil dan luka yang tersebar.
        </p>
      </div>

      <ReferensiBlok
        sumber={REFERENSI_LUKA_BAKAR_RULE9}
        catatan="Pembagian sembilan persen berasal dari Wallace (1951); penyesuaian usia kepala dan tungkai serta laju 2-3-4 mL/kg/%TBSA mengikuti ATLS edisi ke-10 (2018)."
      />

    </div>
  );
}
