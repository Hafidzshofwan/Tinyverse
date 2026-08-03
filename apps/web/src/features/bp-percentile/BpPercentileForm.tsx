"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { NumberField, ReferensiBlok } from "@/shared/ui";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  AAP_DISCLAIMER,
  AAP_MEASUREMENT_CHECKLIST,
  BP_CATEGORY_LABEL,
  evaluateBP,
  generateIndonesianExplanation,
  type BPCategory,
  type BPMethod,
  type BPReadingCount,
  type BPResult,
  type Sex,
} from "@/entities/blood-pressure";

/**
 * Feature: Kalkulator Persentil Tekanan Darah Anak (AAP 2017).
 *
 * WHY gaya inline seperti GcsForm, bukan kelas v17-cairan: alat ini berdiri
 * sendiri di halamannya, tidak menumpang berkas CSS milik menu terapi cairan.
 * Semua warna memakai token yang sudah ada supaya mode gelap ikut otomatis.
 */

const REFERENSI_AAP_2017 = [
  {
    teks:
      "Flynn JT, Kaelber DC, Baker-Smith CM, dkk; Subcommittee on Screening and Management of High Blood Pressure in Children. Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children and Adolescents. Pediatrics. 2017;140(3):e20171904.",
    tautan: "https://doi.org/10.1542/peds.2017-1904",
    labelTautan: "DOI 10.1542/peds.2017-1904",
  },
] as const;

/**
 * Warna kategori.
 *
 * WHY memakai rgba dengan alfa rendah, bukan hex pekat: latar tipis tetap
 * terbaca di mode terang maupun gelap, sedangkan warna teks dipilih pada
 * tingkat kecerahan menengah agar kontras di kedua mode.
 */
const WARNA_KATEGORI: Record<BPCategory, { garis: string; latar: string; teks: string }> = {
  normal: { garis: "#12957E", latar: "rgba(18, 149, 126, 0.12)", teks: "#12957E" },
  elevated: { garis: "#C99000", latar: "rgba(201, 144, 0, 0.14)", teks: "#B57400" },
  stage1: { garis: "#E06C1F", latar: "rgba(224, 108, 31, 0.14)", teks: "#D2620F" },
  stage2: { garis: "#DC2626", latar: "rgba(220, 38, 38, 0.14)", teks: "#DC2626" },
};

const wrapStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 16 };
const kartuStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  border: "1px solid var(--etail-line)",
  borderRadius: 14,
  padding: 14,
  background: "var(--putih)",
};
const barisStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 12,
};
const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--teks)",
};
const pillWrapStyle: CSSProperties = { display: "flex", gap: 6, flexWrap: "wrap" };
const pillBase: CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 999,
  border: "1px solid var(--etail-line)",
  background: "var(--putih)",
  color: "var(--teks-lembut)",
  cursor: "pointer",
};
const pillActive: CSSProperties = {
  ...pillBase,
  background: "var(--etail-navy)",
  borderColor: "var(--etail-navy)",
  color: "#FFFFFF",
};
const catatanStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.55,
  color: "var(--teks-lembut)",
  margin: 0,
};
const judulKartuStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "var(--teks)",
  margin: 0,
};
const tabelStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12.5,
  color: "var(--teks)",
};
const selStyle: CSSProperties = {
  border: "1px solid var(--etail-line)",
  padding: "6px 8px",
  textAlign: "center",
};
const selKepalaStyle: CSSProperties = {
  ...selStyle,
  fontWeight: 700,
  background: "var(--etail-soft)",
  color: "var(--teks-lembut)",
};

function Pilihan<T extends string>(props: {
  label: string;
  nilai: T;
  opsi: ReadonlyArray<{ nilai: T; label: string }>;
  onPilih: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={labelStyle}>{props.label}</span>
      <div style={pillWrapStyle}>
        {props.opsi.map((o) => (
          <button
            key={o.nilai}
            type="button"
            aria-pressed={props.nilai === o.nilai}
            onClick={() => props.onPilih(o.nilai)}
            style={props.nilai === o.nilai ? pillActive : pillBase}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BpPercentileForm() {
  const profile = usePatientProfile();
  const [usiaBulan, setUsiaBulan] = useSyncedField(profile.usiaBulan);
  const [berat, setBerat] = useSyncedField(profile.bb);
  const [sex, setSex] = useState<Sex>("male");
  const [tinggi, setTinggi] = useState("");
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [metode, setMetode] = useState<BPMethod>("auskultasi");
  const [jumlah, setJumlah] = useState<BPReadingCount>("rerata");
  const [bergejala, setBergejala] = useState(false);
  const [dihitung, setDihitung] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  const totalBulan = usiaBulan.trim() === "" ? null : Number(usiaBulan);
  const tahunTeks = totalBulan === null ? "" : String(Math.floor(totalBulan / 12));
  const sisaBulanTeks = totalBulan === null ? "" : String(totalBulan % 12);

  function ubahTahun(v: string) {
    const t = v.trim() === "" ? 0 : Number(v);
    const sisa = totalBulan === null ? 0 : totalBulan % 12;
    setUsiaBulan(String(t * 12 + sisa));
  }
  function ubahBulan(v: string) {
    const b = v.trim() === "" ? 0 : Number(v);
    const tahun = totalBulan === null ? 0 : Math.floor(totalBulan / 12);
    setUsiaBulan(String(tahun * 12 + b));
  }

  const hasil: BPResult | null = useMemo(() => {
    if (!dihitung) return null;
    return evaluateBP({
      ageYears: tahunTeks === "" ? NaN : Number(tahunTeks),
      ageMonths: sisaBulanTeks === "" ? 0 : Number(sisaBulanTeks),
      sex,
      heightCm: tinggi.trim() === "" ? NaN : Number(tinggi),
      sbp: sbp.trim() === "" ? NaN : Number(sbp),
      dbp: dbp.trim() === "" ? NaN : Number(dbp),
      weightKg: berat.trim() === "" ? undefined : Number(berat),
      method: metode,
      readingCount: jumlah,
      symptomatic: bergejala,
    });
  }, [dihitung, tahunTeks, sisaBulanTeks, sex, tinggi, sbp, dbp, berat, metode, jumlah, bergejala]);

  const ringkas = hasil && hasil.status === "ok" ? hasil : null;
  const warna = ringkas ? WARNA_KATEGORI[ringkas.classification.finalCategory] : null;

  function tambahRingkasan() {
    if (!ringkas) return;
    const t = ringkas.thresholds;
    addRingkasanItem({
      title: `Persentil Tekanan Darah (AAP 2017) - ${sbp}/${dbp} mmHg`,
      source: "Tekanan Darah Anak",
      body: [
        `Kategori: ${BP_CATEGORY_LABEL[ringkas.classification.finalCategory]}`,
        `SBP: ${BP_CATEGORY_LABEL[ringkas.classification.sbpCategory]} | DBP: ${BP_CATEGORY_LABEL[ringkas.classification.dbpCategory]}`,
        ringkas.usesHeightPercentile && ringkas.heightPercentile
          ? `Persentil tinggi dipakai: P${ringkas.heightPercentile.percentile}`
          : "Ambang absolut Table 3 (usia >= 13 tahun)",
        t
          ? `Ambang SBP P90/P95/P95+12: ${t.sbpP90}/${t.sbpP95}/${t.sbpP95plus12} mmHg`
          : "",
        t
          ? `Ambang DBP P90/P95/P95+12: ${t.dbpP90}/${t.dbpP95}/${t.dbpP95plus12} mmHg`
          : "",
        `Tindak lanjut: ${ringkas.followUp.teks}`,
        AAP_DISCLAIMER,
      ]
        .filter((x) => x !== "")
        .join("\n"),
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  }

  return (
    <div style={wrapStyle}>
      <div style={kartuStyle}>
        <div style={barisStyle}>
          <NumberField
            label="Usia (tahun)"
            value={tahunTeks}
            onValueChange={ubahTahun}
            placeholder="cth: 8"
            step={1}
          />
          <NumberField
            label="Usia (bulan)"
            value={sisaBulanTeks}
            onValueChange={ubahBulan}
            placeholder="0 - 11"
            step={1}
          />
        </div>

        <Pilihan<Sex>
          label="Jenis kelamin"
          nilai={sex}
          opsi={[
            { nilai: "male", label: "Laki-laki" },
            { nilai: "female", label: "Perempuan" },
          ]}
          onPilih={setSex}
        />

        <div style={barisStyle}>
          <NumberField
            label="Tinggi badan (cm)"
            value={tinggi}
            onValueChange={setTinggi}
            placeholder="cth: 131"
          />
          <NumberField
            label="Berat badan (kg, opsional)"
            value={berat}
            onValueChange={setBerat}
            placeholder="cth: 25"
          />
        </div>

        <div style={barisStyle}>
          <NumberField
            label="Sistolik / SBP (mmHg)"
            value={sbp}
            onValueChange={setSbp}
            placeholder="cth: 116"
            step={1}
          />
          <NumberField
            label="Diastolik / DBP (mmHg)"
            value={dbp}
            onValueChange={setDbp}
            placeholder="cth: 76"
            step={1}
          />
        </div>

        <Pilihan<BPMethod>
          label="Metode pengukuran (opsional)"
          nilai={metode}
          opsi={[
            { nilai: "auskultasi", label: "Auskultasi / manual" },
            { nilai: "osilometrik", label: "Osilometrik / digital" },
          ]}
          onPilih={setMetode}
        />

        <Pilihan<BPReadingCount>
          label="Jumlah pengukuran (opsional)"
          nilai={jumlah}
          opsi={[
            { nilai: "tunggal", label: "Satu kali" },
            { nilai: "rerata", label: "Rata-rata beberapa" },
          ]}
          onPilih={setJumlah}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--teks)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={bergejala}
            onChange={(e) => setBergejala(e.target.checked)}
          />
          Ada gejala penyerta (nyeri kepala hebat, gangguan penglihatan, kejang, sesak)
        </label>

        <button
          type="button"
          className="btn-hitung"
          onClick={() => setDihitung(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H8L10 6L14 18L16 12H21"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Hitung Kategori Tekanan Darah
        </button>
      </div>

      {hasil && hasil.status === "invalid" && (
        <div
          style={{
            ...kartuStyle,
            borderLeft: "3px solid #D97706",
            background: "rgba(217, 119, 6, 0.10)",
          }}
        >
          <p style={judulKartuStyle}>Periksa kembali isian</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--teks)" }}>
            {hasil.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {hasil &&
        (hasil.status === "unsupported-infant" ||
          hasil.status === "unsupported-adult" ||
          hasil.status === "no-data") && (
          <div
            style={{
              ...kartuStyle,
              borderLeft: "3px solid #6D4CBB",
              background: "rgba(109, 76, 187, 0.10)",
            }}
          >
            <p style={judulKartuStyle}>Di luar cakupan kalkulator</p>
            <p style={catatanStyle}>{hasil.message}</p>
          </div>
        )}

      {ringkas && warna && (
        <>
          <div
            style={{
              ...kartuStyle,
              borderLeft: `3px solid ${warna.garis}`,
              background: warna.latar,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--teks-lembut)" }}>
              Kategori pembacaan
            </span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: warna.teks }}>
              {BP_CATEGORY_LABEL[ringkas.classification.finalCategory]}
            </strong>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
              <span style={{ color: "var(--teks)" }}>
                SBP: <strong>{BP_CATEGORY_LABEL[ringkas.classification.sbpCategory]}</strong>
              </span>
              <span style={{ color: "var(--teks)" }}>
                DBP: <strong>{BP_CATEGORY_LABEL[ringkas.classification.dbpCategory]}</strong>
              </span>
              <span style={{ color: "var(--teks)" }}>
                Persentil tinggi:{" "}
                <strong>
                  {ringkas.usesHeightPercentile && ringkas.heightPercentile
                    ? `P${ringkas.heightPercentile.percentile}`
                    : "tidak dipakai"}
                </strong>
              </span>
            </div>
            <p style={{ ...catatanStyle, color: "var(--teks)" }}>
              {generateIndonesianExplanation(ringkas)}
            </p>
            <div>
              <button
                type="button"
                className="tv-btn"
                style={{
                  background: "#0A0B5F",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onClick={tambahRingkasan}
              >
                {ditambahkan ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#4ADE80"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Ditambahkan ke Ringkasan!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2V8H20"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M8 13H16M8 17H13" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Tambahkan ke Ringkasan
                  </>
                )}
              </button>
            </div>
          </div>

          {ringkas.thresholds && (
            <div style={kartuStyle}>
              <p style={judulKartuStyle}>
                Ambang referensi{" "}
                {ringkas.usesHeightPercentile
                  ? `(Table ${sex === "male" ? "4" : "5"}, usia ${ringkas.ageYearsUsed} tahun, kolom P${ringkas.heightPercentile?.percentile ?? "-"})`
                  : "(pembanding, tidak dipakai untuk klasifikasi usia 13 tahun ke atas)"}
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={tabelStyle}>
                  <thead>
                    <tr>
                      <th style={selKepalaStyle}>Komponen</th>
                      <th style={selKepalaStyle}>P50</th>
                      <th style={selKepalaStyle}>P90</th>
                      <th style={selKepalaStyle}>P95</th>
                      <th style={selKepalaStyle}>P95 + 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={selStyle}>SBP (mmHg)</td>
                      <td style={selStyle}>{ringkas.thresholds.sbpP50}</td>
                      <td style={selStyle}>{ringkas.thresholds.sbpP90}</td>
                      <td style={selStyle}>{ringkas.thresholds.sbpP95}</td>
                      <td style={selStyle}>{ringkas.thresholds.sbpP95plus12}</td>
                    </tr>
                    <tr>
                      <td style={selStyle}>DBP (mmHg)</td>
                      <td style={selStyle}>{ringkas.thresholds.dbpP50}</td>
                      <td style={selStyle}>{ringkas.thresholds.dbpP90}</td>
                      <td style={selStyle}>{ringkas.thresholds.dbpP95}</td>
                      <td style={selStyle}>{ringkas.thresholds.dbpP95plus12}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {ringkas.usesHeightPercentile && (
                <p style={catatanStyle}>
                  Kategori memakai angka yang lebih rendah antara ambang persentil di atas
                  dan ambang absolut 120/80, 130/80, serta 140/90 mmHg, sesuai Table 3.
                </p>
              )}
            </div>
          )}

          <div
            style={{
              ...kartuStyle,
              borderLeft: `3px solid ${ringkas.urgent ? "#DC2626" : "#0A0B5F"}`,
            }}
          >
            <p style={judulKartuStyle}>Tindak lanjut menurut AAP 2017</p>
            <p style={{ ...catatanStyle, color: "var(--teks)" }}>{ringkas.followUp.teks}</p>
            {ringkas.notes.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--teks-lembut)" }}>
                {ringkas.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div style={kartuStyle}>
        <p style={judulKartuStyle}>Teknik pengukuran yang benar (Table 7 AAP 2017)</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--teks-lembut)", lineHeight: 1.6 }}>
          {AAP_MEASUREMENT_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ ...kartuStyle, borderLeft: "3px solid #6D4CBB" }}>
        <p style={judulKartuStyle}>Catatan penting</p>
        <p style={catatanStyle}>{AAP_DISCLAIMER}</p>
        <ReferensiBlok
          sumber={REFERENSI_AAP_2017}
          catatan="Table 6 pedoman ini hanya dipakai sebagai nilai skrining awal, bukan untuk klasifikasi akhir. Klasifikasi usia 1 sampai kurang dari 13 tahun memakai Table 4 atau Table 5, dan usia 13 tahun ke atas memakai Table 3."
        />
      </div>
    </div>
  );
}
