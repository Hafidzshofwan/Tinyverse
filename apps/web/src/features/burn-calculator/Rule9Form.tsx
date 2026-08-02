"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  BurnMechanism,
  DripType,
  RuleOfNinesArea,
} from "@tinyverse/clinical-core";
import { DRIP_OPTIONS } from "@tinyverse/clinical-core";
import { NumberField, RedFlagCrossLink } from "@/shared/ui";
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
              {view.error}
            </div>
          ) : atls != null ? (
            <>
              <div className="burn-result-grid">
                <div className="burn-result-card">
                  <h4 className="ikon-title fire">Luas Luka Bakar (TBSA)</h4>
                  <div className="burn-result-value">
                    {formatTbsa(view.tbsaPercent)}%
                  </div>
                  <div className="burn-result-detail">
                    Bagan usia: {view.chartLabel}
                  </div>
                  <ul className="burn-rincian-list">
                    {view.kontribusi.map((k) => (
                      <li key={k.label}>
                        {k.label} - {formatTbsa(k.percent)}%
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="burn-result-card">
                  <h4 className="ikon-title water">Cairan Resusitasi (ATLS)</h4>
                  <div className="burn-result-value">
                    {bulat(atls.total24h)} mL
                  </div>
                  <div className="burn-result-detail">
                    {atls.faktor} mL x {berat} kg x {formatTbsa(view.tbsaPercent)}%
                    <br />
                    {atls.faktorAlasan}
                    <br />
                    Cairan: Ringer Laktat (RL) hangat.
                  </div>
                </div>

                <div className="burn-result-card">
                  <h4 className="ikon-title clock">Laju 8 Jam Pertama</h4>
                  <div className="burn-result-value">
                    {bulat(atls.fase1LajuMlPerJam)} mL/jam
                  </div>
                  <div className="burn-result-detail">
                    Jatah fase 1: {bulat(atls.fase1Ml)} mL (separuh total).
                    <br />
                    {atls.praRsMl > 0
                      ? `Sudah masuk ${bulat(atls.praRsMl)} mL, sisa ${bulat(atls.fase1SisaMl)} mL.`
                      : "Belum ada cairan yang masuk."}
                    <br />
                    {atls.fase1Terlewat
                      ? "8 jam pertama sudah lewat. Kejar sisa defisit dan titrasi ketat."
                      : `Sisa waktu fase 1: ${atls.sisaJamFase1} jam sejak kejadian.`}
                    {atls.tetesFase1 != null ? (
                      <>
                        <br />
                        {atls.tetesFase1} tetes/menit ({atls.dripLabel})
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="burn-result-card">
                  <h4 className="ikon-title clock">16 Jam Berikutnya</h4>
                  <div className="burn-result-value">
                    {bulat(atls.fase2LajuMlPerJam)} mL/jam
                  </div>
                  <div className="burn-result-detail">
                    Jatah fase 2: {bulat(atls.fase2Ml)} mL.
                    {atls.tetesFase2 != null ? (
                      <>
                        <br />
                        {atls.tetesFase2} tetes/menit ({atls.dripLabel})
                      </>
                    ) : null}
                  </div>
                </div>

                {atls.rumatanBerlaku ? (
                  <div className="burn-result-card">
                    <h4 className="ikon-title water">Rumatan 4-2-1</h4>
                    <div className="burn-result-value">
                      {bulat(atls.rumatanMlPerJam)} mL/jam
                    </div>
                    <div className="burn-result-detail">
                      {atls.rumatanRincian}
                      <br />
                      Berat &le; 30 kg: rumatan mengandung dekstrosa diberikan
                      lewat jalur terpisah dan TIDAK ikut dititrasi.
                      {atls.tetesRumatan != null ? (
                        <>
                          <br />
                          {atls.tetesRumatan} tetes/menit ({atls.dripLabel})
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="burn-result-card">
                  <h4 className="ikon-title urine">Target Produksi Urin</h4>
                  <div className="burn-result-value">{atls.urinLabel}</div>
                  <div className="burn-result-detail">
                    Setara {Math.round(atls.urinMin * 10) / 10} -{" "}
                    {Math.round(atls.urinMax * 10) / 10} mL/jam. Titrasi laju
                    naik-turun 20-33% mengikuti urin, tanpa bolus.
                  </div>
                </div>

                {atls.melampauiCreep ? (
                  <div className="burn-result-card">
                    <h4 className="ikon-title fire">Waspada Fluid Creep</h4>
                    <div className="burn-result-value">
                      &gt; {bulat(atls.batasCreepMlPerJam)} mL/jam
                    </div>
                    <div className="burn-result-detail">
                      Laju awal sudah melewati ambang 6 mL/kg/%TBSA. Risiko
                      edema, sindrom kompartemen, dan gagal napas meningkat.
                      Pertimbangkan koloid dan konsultasi pusat luka bakar.
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className="tv-btn-ringkasan"
                onClick={handleTambahRingkasan}
                style={{ background: "#0A0B5F" }}
              >
                {ditambahkan
                  ? "Sudah ditambahkan ke Ringkasan"
                  : "Tambahkan ke Ringkasan"}
              </button>

              {view.tbsaPercent >= 10 ? (
                <RedFlagCrossLink
                  badge="RED-FLAG KLINIS (TBSA >= 10%)"
                  actions={[
                    {
                      label: "Cek rehidrasi & syok",
                      href: "/preview/fluids",
                    },
                    {
                      label: "Buka panel kegawatan",
                      href: "/preview/darurat",
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
    </div>
  );
}
