"use client";

import { useMemo, useState } from "react";
import { ReferensiBlok } from "@/shared/ui";
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
 * WHY kelas CSS, bukan style inline: kotak isian butuh :focus, ::placeholder,
 * dan varian mode gelap. Gayanya ada di app/preview/tekanan-darah/tekanan-darah.css.
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
 * Warna kategori. Latar memakai rgba beralfa rendah supaya tetap terbaca di
 * mode terang maupun gelap, dengan garis tepi kiri sebagai penanda utama.
 */
const WARNA_KATEGORI: Record<BPCategory, { garis: string; latar: string; teks: string }> = {
  normal: { garis: "#12957E", latar: "rgba(18, 149, 126, 0.12)", teks: "#15A88E" },
  elevated: { garis: "#C99000", latar: "rgba(201, 144, 0, 0.14)", teks: "#C99000" },
  stage1: { garis: "#E06C1F", latar: "rgba(224, 108, 31, 0.14)", teks: "#E06C1F" },
  stage2: { garis: "#DC2626", latar: "rgba(220, 38, 38, 0.14)", teks: "#EF4444" },
};

function Medan(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  satuan?: string;
  step?: string;
}) {
  return (
    <div className="tv-bp-medan">
      <label className="tv-bp-label">{props.label}</label>
      <div className="tv-bp-satuan">
        <input
          className="tv-bp-input"
          type="number"
          inputMode="decimal"
          step={props.step ?? "1"}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
        {props.satuan ? <span className="tv-bp-satuan-teks">{props.satuan}</span> : null}
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
    <div className="tv-bp-medan">
      <span className="tv-bp-label">{props.label}</span>
      <div className="tv-bp-pilihan">
        {props.opsi.map((o) => (
          <button
            key={o.nilai}
            type="button"
            aria-pressed={props.nilai === o.nilai}
            className={props.nilai === o.nilai ? "tv-bp-pil aktif" : "tv-bp-pil"}
            onClick={() => props.onPilih(o.nilai)}
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
  const [tinggi, setTinggi] = useSyncedField(profile.tb);
  /**
   * WHY jenis kelamin memakai null sebagai "belum disentuh": selama pengguna
   * belum memilih manual, nilainya mengikuti profil pasien yang aktif dan ikut
   * berubah bila pasien diganti. Begitu dipilih manual, pilihan itu menang.
   */
  const [sexManual, setSexManual] = useState<Sex | null>(null);
  const sex: Sex = sexManual ?? (profile.jk === "female" ? "female" : "male");
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
          : "Ambang absolut Table 3 (usia 13 tahun ke atas)",
        t ? `Ambang SBP P90/P95/P95+12: ${t.sbpP90}/${t.sbpP95}/${t.sbpP95plus12} mmHg` : "",
        t ? `Ambang DBP P90/P95/P95+12: ${t.dbpP90}/${t.dbpP95}/${t.dbpP95plus12} mmHg` : "",
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
    <div className="tv-bp">
      <div className="tv-bp-kartu">
        <div className="tv-bp-grid">
          <Medan label="Usia (tahun)" value={tahunTeks} onChange={ubahTahun} placeholder="8" satuan="th" />
          <Medan label="Usia (bulan)" value={sisaBulanTeks} onChange={ubahBulan} placeholder="0" satuan="bln" />
        </div>

        <Pilihan<Sex>
          label="Jenis kelamin"
          nilai={sex}
          opsi={[
            { nilai: "male", label: "Laki-laki" },
            { nilai: "female", label: "Perempuan" },
          ]}
          onPilih={setSexManual}
        />

        <div className="tv-bp-grid">
          <Medan
            label="Tinggi badan"
            value={tinggi}
            onChange={setTinggi}
            placeholder="131"
            satuan="cm"
            step="0.1"
          />
          <Medan
            label="Berat badan (opsional)"
            value={berat}
            onChange={setBerat}
            placeholder="25"
            satuan="kg"
            step="0.1"
          />
        </div>

        <div className="tv-bp-grid">
          <Medan label="Sistolik / SBP" value={sbp} onChange={setSbp} placeholder="116" satuan="mmHg" />
          <Medan label="Diastolik / DBP" value={dbp} onChange={setDbp} placeholder="76" satuan="mmHg" />
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

        <label className="tv-bp-centang">
          <input
            type="checkbox"
            checked={bergejala}
            onChange={(e) => setBergejala(e.target.checked)}
          />
          Ada gejala penyerta (nyeri kepala hebat, gangguan penglihatan, kejang, sesak)
        </label>

        <button type="button" className="tv-bp-hitung" onClick={() => setDihitung(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H8L10 6L14 18L16 12H21"
              stroke="currentColor"
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
          className="tv-bp-hasil"
          style={{ borderLeftColor: "#D97706", background: "rgba(217, 119, 6, 0.10)" }}
        >
          <p className="tv-bp-judul">Periksa kembali isian</p>
          <ul className="tv-bp-daftar">
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
            className="tv-bp-hasil"
            style={{ borderLeftColor: "#6D4CBB", background: "rgba(109, 76, 187, 0.10)" }}
          >
            <p className="tv-bp-judul">Di luar cakupan kalkulator</p>
            <p className="tv-bp-teks">{hasil.message}</p>
          </div>
        )}

      {ringkas && warna && (
        <>
          <div
            className="tv-bp-hasil"
            style={{ borderLeftColor: warna.garis, background: warna.latar }}
          >
            <span className="tv-bp-hasil-label">Kategori pembacaan</span>
            <strong className="tv-bp-hasil-kategori" style={{ color: warna.teks }}>
              {BP_CATEGORY_LABEL[ringkas.classification.finalCategory]}
            </strong>
            <div className="tv-bp-hasil-baris">
              <span>
                SBP: <strong>{BP_CATEGORY_LABEL[ringkas.classification.sbpCategory]}</strong>
              </span>
              <span>
                DBP: <strong>{BP_CATEGORY_LABEL[ringkas.classification.dbpCategory]}</strong>
              </span>
              <span>
                Persentil tinggi:{" "}
                <strong>
                  {ringkas.usesHeightPercentile && ringkas.heightPercentile
                    ? `P${ringkas.heightPercentile.percentile}`
                    : "tidak dipakai"}
                </strong>
              </span>
            </div>
            <p className="tv-bp-teks">{generateIndonesianExplanation(ringkas)}</p>
            <button type="button" className="tv-bp-simpan" onClick={tambahRingkasan}>
              {ditambahkan ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
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
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Tambahkan ke Ringkasan
                </>
              )}
            </button>
          </div>

          {ringkas.thresholds && (
            <div className="tv-bp-kartu">
              <p className="tv-bp-judul">
                {ringkas.usesHeightPercentile
                  ? `Ambang referensi (Table ${sex === "male" ? "4" : "5"}, usia ${ringkas.ageYearsUsed} tahun, kolom P${ringkas.heightPercentile?.percentile ?? "-"})`
                  : "Ambang referensi (pembanding, klasifikasi usia 13 tahun ke atas memakai Table 3)"}
              </p>
              <div className="tv-bp-tabel-bungkus">
                <table className="tv-bp-tabel">
                  <thead>
                    <tr>
                      <th>Komponen</th>
                      <th>P50</th>
                      <th>P90</th>
                      <th>P95</th>
                      <th>P95 + 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SBP (mmHg)</td>
                      <td>{ringkas.thresholds.sbpP50}</td>
                      <td>{ringkas.thresholds.sbpP90}</td>
                      <td>{ringkas.thresholds.sbpP95}</td>
                      <td>{ringkas.thresholds.sbpP95plus12}</td>
                    </tr>
                    <tr>
                      <td>DBP (mmHg)</td>
                      <td>{ringkas.thresholds.dbpP50}</td>
                      <td>{ringkas.thresholds.dbpP90}</td>
                      <td>{ringkas.thresholds.dbpP95}</td>
                      <td>{ringkas.thresholds.dbpP95plus12}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {ringkas.usesHeightPercentile && (
                <p className="tv-bp-catatan">
                  Kategori memakai angka yang lebih rendah antara ambang persentil di atas dan
                  ambang absolut 120/80, 130/80, serta 140/90 mmHg, sesuai Table 3.
                </p>
              )}
            </div>
          )}

          <div
            className="tv-bp-hasil"
            style={{
              borderLeftColor: ringkas.urgent ? "#DC2626" : "#0A0B5F",
              background: "var(--putih)",
            }}
          >
            <p className="tv-bp-judul">Tindak lanjut menurut AAP 2017</p>
            <p className="tv-bp-teks">{ringkas.followUp.teks}</p>
            {ringkas.notes.length > 0 && (
              <ul className="tv-bp-daftar">
                {ringkas.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className="tv-bp-kartu">
        <p className="tv-bp-judul">Teknik pengukuran yang benar (Table 7 AAP 2017)</p>
        <ul className="tv-bp-daftar">
          {AAP_MEASUREMENT_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="tv-bp-hasil" style={{ borderLeftColor: "#6D4CBB", background: "var(--putih)" }}>
        <p className="tv-bp-judul">Catatan penting</p>
        <p className="tv-bp-catatan">{AAP_DISCLAIMER}</p>
        <ReferensiBlok
          sumber={REFERENSI_AAP_2017}
          catatan="Table 6 pedoman ini hanya dipakai sebagai nilai skrining awal, bukan untuk klasifikasi akhir. Klasifikasi usia 1 sampai kurang dari 13 tahun memakai Table 4 atau Table 5, dan usia 13 tahun ke atas memakai Table 3."
        />
      </div>
    </div>
  );
}
