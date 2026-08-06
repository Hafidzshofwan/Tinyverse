"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui";
import { usePatientProfile, usePatientKey, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  computeNeonatalTpn,
  calculateDayOfLife,
  postmenstrualAgeWeeks,
  parseNum,
  fmt,
} from "@/entities/nutrition";
import type { TpnCategory } from "@/entities/nutrition";

const resultTitle: CSSProperties = {
  fontSize: "0.78rem",
  color: "var(--navy)",
  fontWeight: 800,
  letterSpacing: "0.04em",
  margin: "0 0 10px",
  fontFamily: "'Fredoka','Quicksand',sans-serif",
};
const resultText: CSSProperties = {
  margin: "0 0 6px",
  color: "var(--navy-soft)",
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.5,
};
const errorBoxStyle: CSSProperties = {
  border: "2px solid #e63946",
  background: "linear-gradient(135deg,#ffe0e0,#fff7f7)",
};

function statusLabel(status: "rendah" | "dalam-rentang" | "tinggi"): string {
  if (status === "rendah") return "di bawah rentang";
  if (status === "tinggi") return "di atas rentang";
  return "dalam rentang";
}

function statusColor(status: "rendah" | "dalam-rentang" | "tinggi"): string {
  if (status === "dalam-rentang") return "#10B981";
  return "#e63946";
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function DateField({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="date"
        className="tv-date-input"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
}

function BeratField({
  label,
  kgValue,
  onKgChange,
  gramValue,
  onGramChange,
  totalKg,
}: {
  label: string;
  kgValue: string;
  onKgChange: (value: string) => void;
  gramValue: string;
  onGramChange: (value: string) => void;
  totalKg: number | null;
}) {
  return (
    <div className="form-group berat-kg-gram">
      <label>{label}</label>
      <div className="berat-kg-gram-row">
        <div className="berat-kg-gram-input">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            placeholder="cth: 1"
            value={kgValue}
            onChange={(e) => onKgChange(e.target.value)}
          />
          <span>kg</span>
        </div>
        <span className="berat-kg-gram-plus">+</span>
        <div className="berat-kg-gram-input">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={999}
            step={1}
            placeholder="cth: 850"
            value={gramValue}
            onChange={(e) => onGramChange(e.target.value)}
          />
          <span>gram</span>
        </div>
      </div>
      <p className="berat-kg-gram-total">
        {totalKg != null
          ? `Jadi total: ${fmt(totalKg, 3)} kg`
          : "Isi kg saja, gram saja, atau keduanya untuk dijumlah otomatis."}
      </p>
    </div>
  );
}

export function TpnNeonatusForm() {
  const profile = usePatientProfile();
  const [bb, setBb] = useSyncedField(profile.bb);
  const [bbGram, setBbGram] = useState("");
  const [beratLahirKg, setBeratLahirKg] = useState("");
  const [beratLahirGram, setBeratLahirGram] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tanggalSaatIni, setTanggalSaatIni] = useState(() => todayIso());
  const [usiaKehamilanMinggu, setUsiaKehamilanMinggu] = useState("");
  const [kategori, setKategori] = useState<TpnCategory>("preterm");
  const [volumeCairan, setVolumeCairan] = useState("");
  const [dekstrosa, setDekstrosa] = useState("");
  const [asamAmino, setAsamAmino] = useState("");
  const [lipid, setLipid] = useState("");
  const [tpnResult, setTpnResult] = useState<{
    error: string | null;
    result: ReturnType<typeof computeNeonatalTpn>["result"];
  }>({ error: null, result: null });
  const [ditambahkan, setDitambahkan] = useState(false);

  /*
   * WHY: hasil TPN dihitung dari berat pasien SEBELUMNYA. Kolom beratnya kini
   * berganti otomatis, jadi membiarkan hasil lama tetap di layar membuat
   * angka itu terbaca seolah-olah milik pasien yang baru dipilih.
   */
  const kunciPasien = usePatientKey();
  useEffect(() => {
    setBbGram("");
    setBeratLahirKg("");
    setBeratLahirGram("");
    setTanggalLahir("");
    setTanggalSaatIni(todayIso());
    setUsiaKehamilanMinggu("");
    setKategori("preterm");
    setVolumeCairan("");
    setDekstrosa("");
    setAsamAmino("");
    setLipid("");
    setTpnResult({ error: null, result: null });
    setDitambahkan(false);
  }, [kunciPasien]);

  const bbNum = parseNum(bb);
  const bbGramNum = parseNum(bbGram);
  const weightKgTotal =
    bbNum != null || bbGramNum != null
      ? (bbNum ?? 0) + (bbGramNum ?? 0) / 1000
      : null;
  const beratLahirKgNum = parseNum(beratLahirKg);
  const beratLahirGramNum = parseNum(beratLahirGram);
  const beratLahirTotalKg =
    beratLahirKgNum != null || beratLahirGramNum != null
      ? (beratLahirKgNum ?? 0) + (beratLahirGramNum ?? 0) / 1000
      : null;
  const usiaKehamilanNum = parseNum(usiaKehamilanMinggu);

  let dayOfLifeValue: number | null = null;
  let dayOfLifeError: string | null = null;
  if (tanggalLahir && tanggalSaatIni) {
    try {
      dayOfLifeValue = calculateDayOfLife(tanggalLahir, tanggalSaatIni);
    } catch (e) {
      dayOfLifeError = e instanceof Error ? e.message : "Tanggal tidak valid.";
    }
  }

  const postmenstrualWeeks =
    kategori === "preterm" && usiaKehamilanNum != null && dayOfLifeValue != null
      ? postmenstrualAgeWeeks(usiaKehamilanNum, dayOfLifeValue)
      : null;

  return (
    <div>
      <div className="kartu">
        <div className="segmented-toggle" style={{ marginBottom: 14 }}>
          <button
            type="button"
            className={`segmented-btn ${kategori === "preterm" ? "aktif" : ""}`}
            onClick={() => setKategori("preterm")}
          >
            <span>Preterm</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${kategori === "term" ? "aktif" : ""}`}
            onClick={() => setKategori("term")}
          >
            <span>Aterm</span>
          </button>
        </div>
        <div className="form-row-group">
          <DateField label="Tanggal Lahir" value={tanggalLahir} onValueChange={setTanggalLahir} />
          <DateField label="Tanggal Saat Ini" value={tanggalSaatIni} onValueChange={setTanggalSaatIni} />
        </div>
        {tanggalLahir && tanggalSaatIni ? (
          dayOfLifeError ? (
            <p className="catatan-metode" style={{ marginTop: 0, color: "#e63946", fontWeight: 700 }}>
              {dayOfLifeError}
            </p>
          ) : (
            <p className="catatan-metode" style={{ marginTop: 0 }}>
              Hari ke-{dayOfLifeValue} kehidupan.
              {postmenstrualWeeks != null
                ? ` Usia koreksi (postmenstrual): ${fmt(postmenstrualWeeks, 1)} minggu.`
                : ""}
            </p>
          )
        ) : null}
        {kategori === "preterm" ? (
          <div className="form-row-group">
            <NumberField
              label="Usia kehamilan saat lahir (minggu)"
              value={usiaKehamilanMinggu}
              onValueChange={setUsiaKehamilanMinggu}
              placeholder="cth: 32"
              step={1}
            />
          </div>
        ) : null}
        <BeratField
          label="Berat Lahir"
          kgValue={beratLahirKg}
          onKgChange={setBeratLahirKg}
          gramValue={beratLahirGram}
          onGramChange={setBeratLahirGram}
          totalKg={beratLahirTotalKg}
        />
        <BeratField
          label="Berat Badan Saat Ini"
          kgValue={bb}
          onKgChange={setBb}
          gramValue={bbGram}
          onGramChange={setBbGram}
          totalKg={weightKgTotal}
        />
        <div className="form-row-group">
          <NumberField
            label="Volume cairan (mL/kg/hari)"
            value={volumeCairan}
            onValueChange={setVolumeCairan}
            placeholder="cth: 100"
          />
          <NumberField
            label="Konsentrasi dekstrosa (%)"
            value={dekstrosa}
            onValueChange={setDekstrosa}
            placeholder="cth: 10"
          />
        </div>
        <div className="form-row-group">
          <NumberField
            label="Asam amino (g/kg/hari)"
            value={asamAmino}
            onValueChange={setAsamAmino}
            placeholder="cth: 2.5"
          />
          <NumberField
            label="Lipid (g/kg/hari)"
            value={lipid}
            onValueChange={setLipid}
            placeholder="cth: 2"
          />
        </div>
        <button
          type="button"
          className="btn-hitung"
          onClick={() => {
            if (dayOfLifeError) {
              setTpnResult({ error: dayOfLifeError, result: null });
              return;
            }
            setTpnResult(
              computeNeonatalTpn({
                weightKg: weightKgTotal ?? undefined,
                category: kategori,
                dayOfLife: dayOfLifeValue ?? undefined,
                fluidVolumeMlPerKgPerDay: parseNum(volumeCairan) ?? undefined,
                dextrosePercent: parseNum(dekstrosa) ?? undefined,
                aminoAcidGPerKgPerDay: parseNum(asamAmino) ?? undefined,
                lipidGPerKgPerDay: parseNum(lipid) ?? undefined,
              }),
            );
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-4px", marginRight: "6px" }}>
            <path d="M12 2C10 6 7 8 7 13C7 16.5 9.5 19.5 13 20C17 20.5 20 17 20 13C20 8 16 5 14 2C14 5 12 6.5 12 8C12 6 12 2 12 2Z" fill="#FF5722" />
            <path d="M12 9C11 11 9.5 12 9.5 14.5C9.5 16.5 11 18.5 13 18.5C15 18.5 16.5 16.8 16.5 14.5C16.5 11.5 14 10 13 8.5C13 10 12 11 12 11" fill="#FFC107" />
          </svg>
          Hitung TPN
        </button>
        {tpnResult.error ? (
          <div className="hasil-box-cairan" style={errorBoxStyle}>
            <p style={{ margin: 0, color: "#e63946", fontWeight: 700 }}>
              {tpnResult.error}
            </p>
          </div>
        ) : null}
        {tpnResult.result ? (
          <div className="hasil-box-cairan">
            <h3 style={resultTitle}>HASIL PERHITUNGAN</h3>
            <p style={resultText}>
              BB saat ini: {fmt(tpnResult.result.weightKg, 3)} kg
              {beratLahirTotalKg != null ? ` | BB lahir: ${fmt(beratLahirTotalKg, 3)} kg` : ""}
            </p>
            <p style={resultText}>
              Kategori: {kategori === "preterm" ? "Preterm" : "Term"}
              {usiaKehamilanNum != null ? ` (usia kehamilan saat lahir ${usiaKehamilanNum} minggu)` : ""}
              {" "}| Hari ke-{dayOfLifeValue ?? "-"}
              {postmenstrualWeeks != null ? ` | Usia koreksi: ${fmt(postmenstrualWeeks, 1)} minggu` : ""}
            </p>
            <p style={resultText}>
              Total volume: {fmt(tpnResult.result.totalVolumeMlPerDay, 0)}{" "}
              mL/hari.
            </p>
            <p style={resultText}>
              GIR:{" "}
              <b>{fmt(tpnResult.result.girMgKgMin, 2)} mg/kg/menit</b> (
              <span style={{ color: statusColor(tpnResult.result.girRange.status), fontWeight: 800 }}>
                {statusLabel(tpnResult.result.girRange.status)}
              </span>
              , acuan {tpnResult.result.girRange.min}
              {tpnResult.result.girRange.max != null ? `-${tpnResult.result.girRange.max}` : ""}{" "}
              mg/kg/menit).
            </p>
            <p style={resultText}>
              Dekstrosa: {fmt(tpnResult.result.dextroseGPerDay, 1)} g/hari ≈{" "}
              {fmt(tpnResult.result.dextroseKcalPerDay, 0)} kkal/hari.
            </p>
            <p style={resultText}>
              Asam amino: {fmt(tpnResult.result.aminoAcidGPerDay, 1)} g/hari ≈{" "}
              {fmt(tpnResult.result.aminoAcidKcalPerDay, 0)} kkal/hari (
              <span style={{ color: statusColor(tpnResult.result.aminoAcidRange.status), fontWeight: 800 }}>
                {statusLabel(tpnResult.result.aminoAcidRange.status)}
              </span>
              , acuan {tpnResult.result.aminoAcidRange.min}
              {tpnResult.result.aminoAcidRange.max != null ? `-${tpnResult.result.aminoAcidRange.max}` : "+"}{" "}
              g/kg/hari).
            </p>
            <p style={resultText}>
              Lipid: {fmt(tpnResult.result.lipidGPerDay, 1)} g/hari ≈{" "}
              {fmt(tpnResult.result.lipidKcalPerDay, 0)} kkal/hari (
              <span style={{ color: statusColor(tpnResult.result.lipidStatus), fontWeight: 800 }}>
                {statusLabel(tpnResult.result.lipidStatus)}
              </span>
              , maks {tpnResult.result.lipidMaxGPerKgPerDay} g/kg/hari). Porsi dari kalori
              non-protein: {fmt(tpnResult.result.lipidPercentOfNonProteinKcal, 0)}% (
              <span style={{ color: statusColor(tpnResult.result.lipidRatioStatus), fontWeight: 800 }}>
                {statusLabel(tpnResult.result.lipidRatioStatus)}
              </span>
              , anjuran 25-50%).
            </p>
            <p style={{ ...resultText, margin: 0 }}>
              Total kalori: <b>{fmt(tpnResult.result.totalKcalPerDay, 0)} kkal/hari</b> (
              {fmt(tpnResult.result.totalKcalPerKgPerDay, 1)} kkal/kg/hari).
            </p>
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="tv-btn"
                style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
                onClick={() => {
                  if (!tpnResult.result) return;
                  const res = tpnResult.result;
                  const bodyText = [
                    `BB saat ini: ${fmt(res.weightKg, 3)} kg${beratLahirTotalKg != null ? ` | BB lahir: ${fmt(beratLahirTotalKg, 3)} kg` : ""}`,
                    `Kategori: ${kategori === "preterm" ? "Preterm" : "Term"}${usiaKehamilanNum != null ? ` (UK lahir ${usiaKehamilanNum} minggu)` : ""} | Hari ke-${dayOfLifeValue ?? "-"}${tanggalLahir ? ` (lahir ${tanggalLahir})` : ""}`,
                    postmenstrualWeeks != null ? `Usia koreksi (postmenstrual): ${fmt(postmenstrualWeeks, 1)} minggu` : "",
                    `Volume: ${fmt(res.totalVolumeMlPerDay, 0)} mL/hari`,
                    `GIR: ${fmt(res.girMgKgMin, 2)} mg/kg/menit (${statusLabel(res.girRange.status)}, acuan ${res.girRange.min}${res.girRange.max != null ? `-${res.girRange.max}` : ""} mg/kg/menit)`,
                    `Dekstrosa: ${fmt(res.dextroseGPerDay, 1)} g/hari (${fmt(res.dextroseKcalPerDay, 0)} kkal/hari)`,
                    `Asam Amino: ${fmt(res.aminoAcidGPerDay, 1)} g/hari (${fmt(res.aminoAcidKcalPerDay, 0)} kkal/hari, ${statusLabel(res.aminoAcidRange.status)})`,
                    `Lipid: ${fmt(res.lipidGPerDay, 1)} g/hari (${fmt(res.lipidKcalPerDay, 0)} kkal/hari, ${statusLabel(res.lipidStatus)})`,
                    `Total Kalori: ${fmt(res.totalKcalPerDay, 0)} kkal/hari (${fmt(res.totalKcalPerKgPerDay, 1)} kkal/kg/hari)`,
                  ].filter(Boolean).join("\n");

                  addRingkasanItem({
                    title: `TPN Neonatus (BB ${fmt(res.weightKg, 3)} kg)`,
                    source: "TPN Neonatus",
                    body: bodyText,
                  });
                  setDitambahkan(true);
                  setTimeout(() => setDitambahkan(false), 2200);
                }}
              >
                {ditambahkan ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                      <circle cx="12" cy="12" r="10" fill="#10B981" />
                      <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Ditambahkan ke Ringkasan!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "6px" }}>
                      <rect x="4" y="3" width="16" height="18" rx="2" fill="#3B82F6" fillOpacity="0.25" stroke="#60A5FA" strokeWidth="1.6" />
                      <path d="M8 8H16M8 12H16M8 16H12" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="17" cy="16" r="3.5" fill="#10B981" />
                      <path d="M17 14.5V17.5M15.5 16H18.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Tambahkan ke Ringkasan
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="kartu info-metode">
        <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="M6 12v-4" />
            <path d="M10 12v-2" />
            <path d="M14 12v-4" />
            <path d="M18 12v-2" />
          </svg>
          Metode
        </h3>
        <ul>
          <li>
            GIR (Glucose Infusion Rate) dihitung dari konsentrasi dekstrosa
            dan volume cairan: GIR (mg/kg/menit) = %dekstrosa × volume
            (mL/kg/hari) ÷ 144.
          </li>
          <li>
            Hari ke- (day of life) dihitung otomatis dari selisih Tanggal
            Lahir dan Tanggal Saat Ini (tanggal lahir dihitung sebagai hari
            ke-1).
          </li>
          <li>
            Berat badan (lahir maupun saat ini) dapat diisi dalam kombinasi
            Kg + gram (mis. 1 Kg 850 gram), atau gram saja, sesuai
            kebiasaan pencatatan berat neonatus.
          </li>
          <li>
            Usia koreksi (postmenstrual age) untuk bayi preterm = usia
            kehamilan saat lahir (minggu) + (hari ke- − 1) hari ÷ 7.
          </li>
          <li>
            Rentang GIR acuan: preterm hari 1 = 4-8, hari ≥2 = 8-10 mg/kg/menit;
            term hari 1 = 2,5-5, hari ≥2 = 5-10 mg/kg/menit.
          </li>
          <li>
            Asam amino: preterm hari 1 ≥1,5 g/kg/hari, hari ≥2 = 2,5-3,5
            g/kg/hari; term = 1,5-3,0 g/kg/hari.
          </li>
          <li>Lipid: maksimal 4 g/kg/hari untuk preterm maupun term.</li>
          <li>
            Kalori: dekstrosa 3,4 kkal/g, asam amino 4 kkal/g, lipid (emulsi
            20%) 10 kkal/g.
          </li>
        </ul>
        <p className="catatan-metode">
          Estimasi edukatif berbasis ESPGHAN/ESPEN/ESPR/CSPEN 2018; bukan
          pengganti penilaian klinis. Elektrolit, mikronutrien, dan
          osmolaritas jalur akses tetap harus dinilai terpisah.
        </p>
      </div>

      <div className="kartu info-metode">
        <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Sumber Rujukan
        </h3>
        <ul>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Carbohydrates (Clinical Nutrition
            37, 2018): rentang GIR neonatus (R5.4).
          </li>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Amino acids (Clinical Nutrition 37,
            2018): dosis asam amino neonatus (R3.1-R3.4).
          </li>
          <li>
            ESPGHAN/ESPEN/ESPR/CSPEN 2018 - Lipids (Clinical Nutrition 37,
            2018): dosis maksimal & rasio kalori lipid (R4.3, pendahuluan bab
            Lipid).
          </li>
        </ul>
        <p className="catatan-metode">
          Disclaimer: estimasi kebutuhan nutrisi parenteral, bukan pengganti
          penilaian klinis.
        </p>
      </div>
    </div>
  );
}
