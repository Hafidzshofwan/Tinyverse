"use client";

import { useMemo, useState } from "react";
import { ReferensiBlok } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  computeEgfr,
  creatinineUmolToMgDl,
  type CkdStage,
  type EgfrComputeResult,
  type ProgressionRiskBand,
  type Sex,
} from "@/entities/egfr";

/**
 * Feature: Kalkulator eGFR Pediatrik (CKiD U25 & Bedside Schwartz).
 *
 * WHY kelas CSS, bukan style inline: pola yang sama dipakai di
 * BpPercentileForm - kotak isian butuh :focus, ::placeholder, dan varian
 * mode gelap. Gayanya ada di app/preview/egfr/egfr.css dengan root class
 * .tv-egfr (berdiri sendiri, tidak menumpuk .tv-page-cairan/.tv-bp).
 */

const REFERENSI_EGFR = [
  {
    teks: "Kidney International. 2021.",
    tautan: "https://doi.org/10.1016/j.kint.2020.10.047",
    labelTautan: "DOI 10.1016/j.kint.2020.10.047",
  },
  {
    teks: "Journal of the American Society of Nephrology (JASN). 2009.",
    tautan: "https://doi.org/10.1681/ASN.2008030287",
    labelTautan: "DOI 10.1681/ASN.2008030287",
  },
  {
    teks: "American Journal of Kidney Diseases (AJKD). 2018.",
    tautan: "https://doi.org/10.1053/j.ajkd.2017.12.011",
    labelTautan: "DOI 10.1053/j.ajkd.2017.12.011",
  },
] as const;

const EGFR_DISCLAIMER =
  "Hasil kalkulator ini hanya estimasi berbasis rumus populasi (CKiD U25 / Bedside Schwartz) dan BUKAN pengganti diagnosis, pemeriksaan GFR terukur (mGFR), atau keputusan klinis dokter. Selalu korelasikan dengan kondisi klinis, tren serial, dan penilaian dokter yang merawat.";

type ScrUnit = "mgdl" | "umol";

const WARNA_STAGE: Record<CkdStage, { garis: string; latar: string; teks: string }> = {
  G1: { garis: "#12957E", latar: "rgba(18, 149, 126, 0.12)", teks: "#15A88E" },
  G2: { garis: "#5B9BD5", latar: "rgba(91, 155, 213, 0.14)", teks: "#3C7DB8" },
  G3a: { garis: "#C99000", latar: "rgba(201, 144, 0, 0.14)", teks: "#C99000" },
  G3b: { garis: "#E06C1F", latar: "rgba(224, 108, 31, 0.14)", teks: "#E06C1F" },
  G4: { garis: "#DC2626", latar: "rgba(220, 38, 38, 0.14)", teks: "#EF4444" },
  G5: { garis: "#9F1239", latar: "rgba(159, 18, 57, 0.16)", teks: "#BE123C" },
};

const RISK_BAND_WARNA: Record<ProgressionRiskBand, { garis: string; latar: string; teks: string }> = {
  rendah: { garis: "#12957E", latar: "rgba(18, 149, 126, 0.12)", teks: "#15A88E" },
  sedang: { garis: "#C99000", latar: "rgba(201, 144, 0, 0.14)", teks: "#C99000" },
  tinggi: { garis: "#E06C1F", latar: "rgba(224, 108, 31, 0.14)", teks: "#E06C1F" },
  "sangat-tinggi": { garis: "#DC2626", latar: "rgba(220, 38, 38, 0.14)", teks: "#EF4444" },
};

function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("id-ID", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function Medan(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  satuan?: string;
  step?: string;
}) {
  return (
    <div className="tv-egfr-medan">
      <label className="tv-egfr-label">{props.label}</label>
      <div className="tv-egfr-satuan">
        <input
          className="tv-egfr-input"
          type="number"
          inputMode="decimal"
          step={props.step ?? "0.1"}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {props.satuan ? <span className="tv-egfr-satuan-teks">{props.satuan}</span> : null}
      </div>
    </div>
  );
}

function Pilihan<T extends string>(props: {
  label: string;
  nilai: T;
  opsi: ReadonlyArray<{ nilai: T; label: string }>;
  onPilih: (v: T) => void;
}) {
  return (
    <div className="tv-egfr-medan">
      <span className="tv-egfr-label">{props.label}</span>
      <div className="tv-egfr-pilihan">
        {props.opsi.map((o) => (
          <button
            key={o.nilai}
            type="button"
            aria-pressed={props.nilai === o.nilai}
            className={props.nilai === o.nilai ? "tv-egfr-pil aktif" : "tv-egfr-pil"}
            onClick={() => props.onPilih(o.nilai)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EgfrForm() {
  const profile = usePatientProfile();
  const [usiaBulanTotal, setUsiaBulanTotal] = useSyncedField(profile.usiaBulan);
  const [tinggi, setTinggi] = useSyncedField(profile.tb);
  const [sexManual, setSexManual] = useState<Sex | null>(null);
  const sex: Sex = sexManual ?? (profile.jk === "female" ? "female" : "male");

  const [scrUnit, setScrUnit] = useState<ScrUnit>("mgdl");
  const [scrValue, setScrValue] = useState("");
  const [cysC, setCysC] = useState("");
  const [upcr, setUpcr] = useState("");
  const [glomerular, setGlomerular] = useState<"unknown" | "glomerular" | "nonglomerular">("unknown");

  const [dihitung, setDihitung] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  const totalBulan = usiaBulanTotal.trim() === "" ? null : Number(usiaBulanTotal);
  const tahunTeks = totalBulan === null || Number.isNaN(totalBulan) ? "" : String(Math.floor(totalBulan / 12));
  const bulanTeks = totalBulan === null || Number.isNaN(totalBulan) ? "" : String(totalBulan % 12);

  function ubahTahun(v: string) {
    if (v.trim() === "") {
      const sisa = bulanTeks === "" ? 0 : Math.max(0, parseInt(bulanTeks, 10) || 0);
      setUsiaBulanTotal(sisa === 0 ? "" : String(sisa));
      return;
    }
    const t = Math.max(0, parseFloat(v) || 0);
    const sisa = bulanTeks === "" ? 0 : Math.max(0, parseInt(bulanTeks, 10) || 0);
    setUsiaBulanTotal(String(Math.round(t * 12 + sisa)));
  }

  function ubahBulan(v: string) {
    if (v.trim() === "") {
      const th = tahunTeks === "" ? 0 : Math.max(0, parseInt(tahunTeks, 10) || 0);
      setUsiaBulanTotal(th === 0 ? "" : String(th * 12));
      return;
    }
    const b = Math.max(0, parseInt(v, 10) || 0);
    const th = tahunTeks === "" ? 0 : Math.max(0, parseInt(tahunTeks, 10) || 0);
    setUsiaBulanTotal(String(th * 12 + b));
  }

  const ageYears = useMemo(() => {
    if (totalBulan === null || Number.isNaN(totalBulan) || totalBulan <= 0) return NaN;
    return totalBulan / 12;
  }, [totalBulan]);

  const scrMgDl = useMemo(() => {
    if (scrValue.trim() === "") return NaN;
    const v = Number(scrValue);
    return scrUnit === "mgdl" ? v : creatinineUmolToMgDl(v);
  }, [scrValue, scrUnit]);

  const hasil: EgfrComputeResult | null = useMemo(() => {
    if (!dihitung) return null;
    return computeEgfr({
      ageYears,
      sex,
      heightCm: tinggi.trim() === "" ? NaN : Number(tinggi),
      scrMgDl,
      cysCMgL: cysC.trim() === "" ? null : Number(cysC),
      upcrMgMg: upcr.trim() === "" ? null : Number(upcr),
      isGlomerular: glomerular === "unknown" ? null : glomerular === "glomerular",
    });
  }, [dihitung, ageYears, sex, tinggi, scrMgDl, cysC, upcr, glomerular]);

  function tambahRingkasan() {
    if (!hasil) return;
    const baris = [
      `eGFR CKiD U25 (Pierce 2021): ${fmt(hasil.ckidU25Scr.eGFR)} mL/min/1,73m\u00b2 - stadium ${hasil.ckidU25Scr.stage.stage} (${hasil.ckidU25Scr.stage.label})`,
      `eGFR Bedside Schwartz (Schwartz 2009): ${fmt(hasil.bedsideSchwartz.eGFR)} mL/min/1,73m\u00b2 - stadium ${hasil.bedsideSchwartz.stage.stage}`,
    ];
    if (hasil.ckidU25CysC) {
      baris.push(
        `eGFR CKiD U25 berbasis cystatin C: ${fmt(hasil.ckidU25CysC.eGFR)} mL/min/1,73m\u00b2 - stadium ${hasil.ckidU25CysC.stage.stage}`,
      );
    }
    if (hasil.prognosis) {
      baris.push(`Perkiraan pita risiko progresi (Furth 2018): ${hasil.prognosis.bandLabel}`);
    }
    addRingkasanItem({
      title: `eGFR Pediatrik - ${fmt(hasil.ckidU25Scr.eGFR)} mL/min/1,73m\u00b2`,
      source: "Kalkulator eGFR",
      body: baris.join("\n"),
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2000);
  }

  const stageWarna = hasil ? WARNA_STAGE[hasil.ckidU25Scr.stage.stage] : null;
  const riskWarna = hasil?.prognosis ? RISK_BAND_WARNA[hasil.prognosis.band] : null;

  return (
    <div className="tv-egfr">
      <div className="judul-section">
        <div className="ikon-bulat" aria-hidden="true" style={{ background: "transparent" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#ECFEFF" />
            {/* Left Kidney Organ */}
            <path
              d="M 8.5 6.2 C 5.8 6.2 4.8 8.5 4.8 11.5 C 4.8 14.5 5.8 16.8 8.5 16.8 C 9.6 16.8 9.6 14.8 8.6 13.5 C 7.6 12.2 7.6 10.8 8.6 9.5 C 9.6 8.2 9.6 6.2 8.5 6.2 Z"
              fill="#CFFAFE"
              stroke="#0891B2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Right Kidney Organ */}
            <path
              d="M 15.5 6.2 C 18.2 6.2 19.2 8.5 19.2 11.5 C 19.2 14.5 18.2 16.8 15.5 16.8 C 14.4 16.8 14.4 14.8 15.4 13.5 C 16.4 12.2 16.4 10.8 15.4 9.5 C 14.4 8.2 14.4 6.2 15.5 6.2 Z"
              fill="#CFFAFE"
              stroke="#0891B2"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Renal Cortex / Inner Calyx Details */}
            <path d="M 7.2 9.2 C 6.5 10.5 6.5 12.5 7.2 13.8" stroke="#0E7490" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 16.8 9.2 C 17.5 10.5 17.5 12.5 16.8 13.8" stroke="#0E7490" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Vessels & Ureters */}
            <path d="M 8.2 11.5 C 9.8 11.5 11 12.5 11.5 15.5 V 19" stroke="#0891B2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M 15.8 11.5 C 14.2 11.5 13 12.5 12.5 15.5 V 19" stroke="#0891B2" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            {/* eGFR Glomerular Filtration Sparkle Indicator */}
            <circle cx="12" cy="4.5" r="1.1" fill="#06B6D4" />
            <path d="M 10.5 8.2 L 12 6.8 L 13.5 8.2" stroke="#06B6D4" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div>
          <h2>eGFR Pediatrik</h2>
          <p>CKiD U25 (Pierce 2021) &amp; Bedside Schwartz (Schwartz 2009), usia 1-25 tahun</p>
        </div>
      </div>

      <div className="tv-egfr-kartu">
        <h3 className="tv-egfr-subjudul">Data Pasien</h3>
        <div className="tv-egfr-grid">
          <Medan label="Usia (tahun)" value={tahunTeks} onChange={ubahTahun} placeholder="cth. 8" satuan="th" step="1" />
          <Medan label="Usia (bulan)" value={bulanTeks} onChange={ubahBulan} placeholder="cth. 0" satuan="bln" step="1" />
          <Medan label="Tinggi badan" value={tinggi} onChange={setTinggi} placeholder="cth. 125" satuan="cm" step="0.1" />
          <Pilihan
            label="Jenis kelamin"
            nilai={sex}
            onPilih={setSexManual}
            opsi={[
              { nilai: "male", label: "Laki-laki" },
              { nilai: "female", label: "Perempuan" },
            ]}
          />
        </div>

        <h3 className="tv-egfr-subjudul">Kreatinin Serum (SCr)</h3>
        <div className="tv-egfr-grid">
          <Medan
            label="Kreatinin serum"
            value={scrValue}
            onChange={setScrValue}
            placeholder={scrUnit === "mgdl" ? "cth. 0.5" : "cth. 44"}
            satuan={scrUnit === "mgdl" ? "mg/dL" : "\u00b5mol/L"}
            step="0.01"
          />
          <Pilihan
            label="Satuan kreatinin"
            nilai={scrUnit}
            onPilih={setScrUnit}
            opsi={[
              { nilai: "mgdl", label: "mg/dL" },
              { nilai: "umol", label: "\u00b5mol/L" },
            ]}
          />
        </div>

        <h3 className="tv-egfr-subjudul">Opsional - Cystatin C &amp; Prognosis</h3>
        <p className="tv-egfr-ket">
          Isi cystatin C untuk menampilkan rumus CKiD U25 alternatif berbasis cystatin C. Isi UPCR untuk memunculkan
          modul perkiraan risiko progresi (Furth 2018).
        </p>
        <div className="tv-egfr-grid">
          <Medan label="Cystatin C" value={cysC} onChange={setCysC} placeholder="cth. 1.0" satuan="mg/L" step="0.01" />
          <Medan label="UPCR" value={upcr} onChange={setUpcr} placeholder="cth. 0.3" satuan="mg/mg" step="0.01" />
          <Pilihan
            label="Etiologi CKD (bila UPCR diisi)"
            nilai={glomerular}
            onPilih={setGlomerular}
            opsi={[
              { nilai: "unknown", label: "Tidak tahu" },
              { nilai: "glomerular", label: "Glomerular" },
              { nilai: "nonglomerular", label: "Non-glomerular" },
            ]}
          />
        </div>

        <button type="button" className="tv-egfr-tombol-hitung" onClick={() => setDihitung(true)}>
          Hitung eGFR
        </button>
      </div>

      {hasil ? (
        <div className="tv-egfr-kartu tv-egfr-hasil">
          <h3 className="tv-egfr-subjudul">Hasil</h3>

          {hasil.warnings.length > 0 ? (
            <div className="tv-egfr-peringatan">
              {hasil.warnings.map((w) => (
                <p key={w.field}>{w.message}</p>
              ))}
            </div>
          ) : null}

          <div className="tv-egfr-rumus" style={stageWarna ? { borderLeftColor: stageWarna.garis, background: stageWarna.latar } : undefined}>
            <div className="tv-egfr-rumus-judul">Rumus utama - CKiD U25 (Pierce 2021)</div>
            <div className="tv-egfr-nilai" style={stageWarna ? { color: stageWarna.teks } : undefined}>
              {fmt(hasil.ckidU25Scr.eGFR)} <span className="tv-egfr-satuan-nilai">mL/min/1,73m\u00b2</span>
            </div>
            <div className="tv-egfr-stage">
              Stadium {hasil.ckidU25Scr.stage.stage} - {hasil.ckidU25Scr.stage.label} ({hasil.ckidU25Scr.stage.rangeLabel})
            </div>
            {!hasil.ckidU25Scr.validForAge ? (
              <div className="tv-egfr-catatan-kecil">Usia di luar rentang validasi resmi rumus ini (1-25 tahun).</div>
            ) : null}
          </div>

          <div className="tv-egfr-rumus tv-egfr-rumus-sekunder">
            <div className="tv-egfr-rumus-judul">Rumus pembanding - Bedside Schwartz (Schwartz 2009)</div>
            <div className="tv-egfr-nilai-sekunder">
              {fmt(hasil.bedsideSchwartz.eGFR)} <span className="tv-egfr-satuan-nilai">mL/min/1,73m\u00b2</span>
            </div>
            <div className="tv-egfr-stage">
              Stadium {hasil.bedsideSchwartz.stage.stage} - {hasil.bedsideSchwartz.stage.label}
            </div>
            {!hasil.bedsideSchwartz.validForAge ? (
              <div className="tv-egfr-catatan-kecil">Rumus ini hanya divalidasi untuk usia 1-16 tahun.</div>
            ) : null}
          </div>

          {hasil.ckidU25CysC ? (
            <div className="tv-egfr-rumus tv-egfr-rumus-sekunder">
              <div className="tv-egfr-rumus-judul">Alternatif - CKiD U25 berbasis cystatin C (Pierce 2021)</div>
              <div className="tv-egfr-nilai-sekunder">
                {fmt(hasil.ckidU25CysC.eGFR)} <span className="tv-egfr-satuan-nilai">mL/min/1,73m\u00b2</span>
              </div>
              <div className="tv-egfr-stage">
                Stadium {hasil.ckidU25CysC.stage.stage} - {hasil.ckidU25CysC.stage.label}
              </div>
            </div>
          ) : null}

          {hasil.prognosis ? (
            <div
              className="tv-egfr-rumus tv-egfr-prognosis"
              style={riskWarna ? { borderLeftColor: riskWarna.garis, background: riskWarna.latar } : undefined}
            >
              <div className="tv-egfr-rumus-judul">Modul prognosis - perkiraan risiko progresi (Furth 2018)</div>
              <div className="tv-egfr-nilai-sekunder" style={riskWarna ? { color: riskWarna.teks } : undefined}>
                {hasil.prognosis.bandLabel}
              </div>
              <div className="tv-egfr-stage">
                Kategori eGFR: {hasil.prognosis.egfrCategoryLabel} &middot; Kategori UPCR: {hasil.prognosis.upcrCategoryLabel}
              </div>
              <p className="tv-egfr-catatan-kecil">{hasil.prognosis.note}</p>
              {hasil.prognosis.glomerularNote ? <p className="tv-egfr-catatan-kecil">{hasil.prognosis.glomerularNote}</p> : null}
            </div>
          ) : null}

          <button type="button" className="tv-egfr-tombol-ringkasan" onClick={tambahRingkasan}>
            {ditambahkan ? "Ditambahkan ke ringkasan\u2713" : "Tambahkan ke Ringkasan"}
          </button>

          <p className="tv-egfr-disclaimer">{EGFR_DISCLAIMER}</p>
        </div>
      ) : null}

      <ReferensiBlok
        sumber={REFERENSI_EGFR}
        catatan="Modul prognosis (Furth 2018) hanya menampilkan pita risiko relatif, bukan penomoran 6 stadium resmi, karena materi rujukan yang tersedia belum memuat tabel rinci median waktu per kombinasi eGFR-UPCR."
      />
    </div>
  );
}

