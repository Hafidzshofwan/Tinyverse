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
  const usiaTahunProfil = profile.usiaBulan != null ? Math.round((profile.usiaBulan / 12) * 100) / 100 : null;
  const [usiaTahun, setUsiaTahun] = useSyncedField(usiaTahunProfil);
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

  const scrMgDl = useMemo(() => {
    if (scrValue.trim() === "") return NaN;
    const v = Number(scrValue);
    return scrUnit === "mgdl" ? v : creatinineUmolToMgDl(v);
  }, [scrValue, scrUnit]);

  const hasil: EgfrComputeResult | null = useMemo(() => {
    if (!dihitung) return null;
    return computeEgfr({
      ageYears: usiaTahun.trim() === "" ? NaN : Number(usiaTahun),
      sex,
      heightCm: tinggi.trim() === "" ? NaN : Number(tinggi),
      scrMgDl,
      cysCMgL: cysC.trim() === "" ? null : Number(cysC),
      upcrMgMg: upcr.trim() === "" ? null : Number(upcr),
      isGlomerular: glomerular === "unknown" ? null : glomerular === "glomerular",
    });
  }, [dihitung, usiaTahun, sex, tinggi, scrMgDl, cysC, upcr, glomerular]);

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
            <path
              d="M12 3.5C9 6.8 6.2 10.3 6.2 14C6.2 17.6 8.8 20.3 12 20.3C15.2 20.3 17.8 17.6 17.8 14C17.8 10.3 15 6.8 12 3.5Z"
              fill="#CFFAFE"
              stroke="#0891B2"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9.3 11.6C9.3 14.4 10.4 16.3 12 16.3"
              stroke="#0E7490"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="12" cy="9.4" r="1.05" fill="#0E7490" />
            <circle cx="14.6" cy="13.1" r="0.85" fill="#22D3EE" />
            <circle cx="10" cy="14.6" r="0.7" fill="#22D3EE" />
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
          <Medan label="Usia" value={usiaTahun} onChange={setUsiaTahun} placeholder="cth. 8" satuan="tahun" step="0.1" />
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

