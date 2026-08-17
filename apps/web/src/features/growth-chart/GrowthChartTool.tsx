"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import {
  GROWTH_CHART_CONFIG,
  type Chart,
  type Indikator,
  type Kalibrasi,
  type Kelamin,
  type SeriChart,
  type Standar,
} from "./chartConfig";
import { tkHitungKoordinatTitik, tkKalibrasiValid, tkTargetGarisHorizontal, type TitikPlot } from "./plotting";
import { amanNamaBerkas, unduhChartPNG } from "./unduhChart";
import {
  hitungMPH,
  tkInterpretasiCdcBbtb,
  tkInterpretasiCdcPercentile,
  tkInterpretasiZscore,
} from "./interpretasi";
import { hitungIMT } from "./zscore";
import { caraUkurDariUsia, type CaraUkurPanjang } from "./longitudinal";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { usePatientProfile, usePatientKey } from "@/shared/lib/patient";
import {
  IkonBmi,
  IkonBook,
  IkonCalendar,
  IkonCdc,
  IkonChart,
  IkonFemale,
  IkonJudulTumbuhKembang,
  IkonMale,
  IkonPin,
  IkonRuler,
  IkonScale,
  IkonWarning,
  IkonWho,
} from "./GrowthChartIcons";
import "./growth-chart.css";

/**
 * Alat "Kurva WHO & CDC" — versi React murni, menggantikan island iframe
 * public/growth-tool.html.
 *
 * WHY: sebelumnya alat ini dijalankan di dalam <iframe> agar mesin v17 yang
 * sangat imperatif tetap utuh. Konsekuensinya: dokumen terpisah, gaya ganda,
 * tinggi harus disinkronkan lewat postMessage, dan isinya tidak terbaca oleh
 * pencarian global maupun perkakas TypeScript. Kini mesin itu dipindahkan ke
 * React tanpa mengubah perilakunya.
 *
 * YANG DIJAGA TETAP SAMA PERSIS:
 *  - Berkas gambar chart (tidak satu piksel pun disentuh).
 *  - Seluruh angka kalibrasi → lihat chartConfig.ts.
 *  - Rumus posisi titik → plotting.ts.
 *  - Tabel Z-score & ambang status gizi → zscoreTables.ts + interpretasi.ts.
 *  - Struktur DOM dan nama kelas CSS, sehingga tampilannya identik.
 */

type KunciSeri = string;

interface TitikTergambar {
  seriKey: KunciSeri;
  titik: TitikPlot;
  warna: string;
  yLabel: string;
  yUnit: string;
  nilai: number;
}

interface HasilPlot {
  pesan?: string;
  nilaiX?: number;
  baris?: Array<{ yLabel: string; nilai: number; yUnit: string; warna: string }>;
  titikPerChart?: Record<string, TitikTergambar[]>;
  adaLuarBatas?: boolean;
  adaChartHilang?: boolean;
  belumKalibrasi?: string[];
  interpretasi?: ReactNode[];
  zTextSummary?: string[];
}

/** Format angka gaya v17: 1 desimal, koma sebagai pemisah desimal. */
function f(n: number | null | undefined, d: number): string {
  if (n == null || !isFinite(n)) return "\u2013";
  const p = Math.pow(10, d);
  return (Math.round(n * p) / p).toFixed(d).replace(".", ",");
}

function num(v: string): number | null {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isFinite(n) ? n : null;
}

/*
 * Ikon pemilih kurva.
 *
 * WHY: emoji dipakai lebih dulu karena cepat, tetapi bentuknya ditentukan
 * sistem operasi — lambang timbangan dan orang berdiri tampil berbeda di
 * Windows, macOS, dan Android, sebagiannya berwarna cerah dan bertabrakan
 * dengan tombol biru. SVG di bawah mewarisi currentColor, sehingga otomatis
 * ikut putih saat tombol terpilih dan abu-abu saat tidak, di terang maupun
 * gelap, tanpa satu pun aturan warna tambahan.
 *
 * Ikon sengaja tidak ditaruh di GrowthChartIcons.tsx: bentuknya khusus untuk
 * pemilih ini dan tidak dipakai layar lain.
 */
type PropsIkonSeg = { readonly ukuran?: number };

const dasarSvg = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Kurva pertumbuhan menaik pada sepasang sumbu: BB/U, TB/U, & IMT/U. */
function IkonSegKurva({ ukuran = 18 }: PropsIkonSeg) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" {...dasarSvg}>
      <path d="M4 3v15.5A1.5 1.5 0 0 0 5.5 20H21" />
      <path d="M7.5 16.5 11 12l2.6 2.2L19 7" />
      <circle cx="11" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="7" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Berat di atas mistar: berat badan terhadap panjang/tinggi. */
function IkonSegBbTb({ ukuran = 18 }: PropsIkonSeg) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" {...dasarSvg}>
      <path d="M8.2 9.5h7.6a2 2 0 0 1 2 2.2l-.5 4.6a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8l-.5-4.6a2 2 0 0 1 2-2.2Z" />
      <path d="M12 9.5V7" />
      <circle cx="12" cy="5.4" r="1.6" />
      <path d="M3 21h18" />
      <path d="M5.5 21v-2M9 21v-1.2M15 21v-1.2M18.5 21v-2" />
    </svg>
  );
}

/** Anak berbaring dengan panah ukur mendatar: panjang badan telentang. */
function IkonSegTelentang({ ukuran = 18 }: PropsIkonSeg) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" {...dasarSvg}>
      <circle cx="6.6" cy="9.5" r="2.1" />
      <path d="M9 11.4h5.2l2.2 2.4h2.6" />
      <path d="M3 15.5h18" />
      <path d="M4.6 19.4h14.8" />
      <path d="m6.4 17.9-1.8 1.5 1.8 1.5M17.6 17.9l1.8 1.5-1.8 1.5" />
    </svg>
  );
}

/** Anak berdiri menempel dinding ukur: tinggi badan berdiri. */
function IkonSegBerdiri({ ukuran = 18 }: PropsIkonSeg) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" {...dasarSvg}>
      <path d="M4 3v18" />
      <path d="M4 6.5h2.2M4 10h2.2M4 13.5h2.2M4 17h2.2" />
      <circle cx="14" cy="6.2" r="2.2" />
      <path d="M14 8.6v6.2" />
      <path d="M11.2 11h5.6" />
      <path d="m14 14.8-2 6.2M14 14.8l2 6.2" />
    </svg>
  );
}

/**
 * Ikon untuk sebuah indikator. Dipetakan lewat kunci indikator, dengan kurva
 * sebagai cadangan supaya indikator baru tetap tampil wajar walau ikonnya
 * belum sempat dibuatkan.
 */
function ikonIndikator(key: string) {
  if (key === "bbpbtb") return <IkonSegBbTb />;
  return <IkonSegKurva />;
}

/**
 * Nilai bawaan kolom sumbu X sesuai makna sumbu itu pada indikator terpilih.
 * xField "tinggi" berarti sumbu X sentimeter (BB/PB & BB/TB), selain itu umur.
 */
function nilaiXBawaan(
  xField: string | undefined,
  usiaBulan: number | null | undefined,
  tinggiCm: number | null | undefined,
): string {
  if (xField === "tinggi") return tinggiCm != null ? String(tinggiCm) : "";
  return usiaBulan != null ? String(usiaBulan) : "";
}

export function GrowthChartTool() {
  const [langkah, setLangkah] = useState<1 | 2 | 3>(1);
  const [standar, setStandar] = useState<Standar | null>(null);
  const [kelamin, setKelamin] = useState<Kelamin | null>(null);

  const [inputX, setInputX] = useState("");
  const [inputBerat, setInputBerat] = useState("");
  const [inputTinggi, setInputTinggi] = useState("");
  /** Menandai nilai yang diisi otomatis dari profil pasien (boleh ditimpa isi terbaru). */
  const auto = useRef({ x: true, berat: true, tinggi: true });

  const [hasil, setHasil] = useState<HasilPlot | null>(null);
  const [unduhSibuk, setUnduhSibuk] = useState<string | null>(null);
  const [unduhGagal, setUnduhGagal] = useState<string | null>(null);
  const [gambarGagal, setGambarGagal] = useState<Record<string, boolean>>({});

  /*
   * WHY: blok ini dulu mengambil Object.keys(inds)[0] alias indikator PERTAMA
   * saja. Selama tiap standar hanya punya satu indikator, bug itu tak terlihat.
   * Begitu WHO menerima indikator kedua (BB/PB & BB/TB), indikator itu akan
   * diabaikan diam-diam: ada di konfigurasi, tidak pernah muncul di layar.
   * Sekarang seluruh indikator didaftar dan pengguna yang memilih.
   */
  const [indikatorKey, setIndikatorKey] = useState<string | null>(null);

  const daftarIndikator = useMemo<Array<{ key: string; ind: Indikator }>>(() => {
    if (!standar || !kelamin) return [];
    const inds = GROWTH_CHART_CONFIG[standar]?.genders[kelamin]?.indicators;
    if (!inds) return [];
    return Object.keys(inds).flatMap((k) => {
      const ind = inds[k];
      return ind ? [{ key: k, ind }] : [];
    });
  }, [standar, kelamin]);

  /** Indikator terpilih, LENGKAP dengan seluruh chart-nya. */
  const indikatorPenuh: Indikator | null = useMemo(() => {
    if (daftarIndikator.length === 0) return null;
    const pilih = daftarIndikator.find((d) => d.key === indikatorKey);
    return (pilih ?? daftarIndikator[0])?.ind ?? null;
  }, [daftarIndikator, indikatorKey]);

  // Ganti standar atau jenis kelamin: kembali ke indikator pertama, sebab kunci
  // indikator milik kombinasi lama belum tentu ada di kombinasi yang baru.
  useEffect(() => {
    setIndikatorKey(null);
  }, [standar, kelamin]);

  /*
   * Cara ukur panjang/tinggi badan. WHO memakai TABEL BERBEDA untuk panjang
   * telentang dan tinggi berdiri, dan yang menentukan adalah cara pengukuran,
   * bukan umur anak. Umur hanya dipakai sebagai tebakan awal; pengguna yang
   * memutuskan. Selisihnya nyata: anak 90 cm 12 kg menghasilkan -0,74 SD bila
   * diukur telentang dan -0,9 SD bila diukur berdiri.
   */
  const [caraUkur, setCaraUkur] = useState<CaraUkurPanjang>("pb");

  /** Benar bila indikator ini menuntut pilihan PB/TB (dua chart, tak boleh bersamaan). */
  const perluCaraUkur =
    indikatorPenuh != null && indikatorPenuh.combined === false && indikatorPenuh.charts.length > 1;

  /*
   * Indikator yang BENAR-BENAR ditampilkan. Untuk BB/PB & BB/TB hanya satu chart
   * yang boleh tampil, sesuai cara ukur. Chart dipilih lewat zKey serinya, bukan
   * lewat c.id, supaya yang tampil selalu chart yang memang memakai tabel z-score
   * bersangkutan meskipun id-nya kelak berubah.
   */
  const indikator: Indikator | null = useMemo(() => {
    if (!indikatorPenuh) return null;
    if (!perluCaraUkur) return indikatorPenuh;
    const zk = caraUkur === "pb" ? "bbpb" : "bbtb";
    const c = indikatorPenuh.charts.find((x) => (x.series || []).some((s) => s.zKey === zk));
    return c ? { ...indikatorPenuh, charts: [c] } : indikatorPenuh;
  }, [indikatorPenuh, perluCaraUkur, caraUkur]);

  /* ---------------- Isi otomatis dari profil pasien ---------------- */

  const pasien = usePatientProfile();
  const kunciPasien = usePatientKey();

  const [mphKelamin, setMphKelamin] = useState<Kelamin>("male");

  /*
   * WHY: komponen ini dulu membaca localStorage sendiri lalu hanya menunggu
   * event "message" dan "storage". Keduanya TIDAK pernah menyala di tab yang
   * sama: postMessage hanya dikirim ke iframe, sedangkan event storage menurut
   * spesifikasi hanya sampai ke tab LAIN. Jadi mengganti pasien di tab ini
   * tidak membangunkan siapa pun, dan angkanya baru ikut berubah setelah
   * halaman dimuat ulang. Sekarang ia berlangganan ke profil pasien terpusat,
   * yang juga menyiarkan perubahan di dalam tab yang sama.
   */
  useEffect(() => {
    // Pasien berganti: kolom dikembalikan ke milik pasien baru - termasuk
    // dikosongkan bila pasien baru belum punya nilainya. Menahan angka lama
    // berisiko: angka milik pasien lain bisa ikut terplot.
    auto.current = { x: true, berat: true, tinggi: true };
    // Sumbu X tidak selalu umur: pada BB/PB & BB/TB isinya sentimeter.
    setInputX(nilaiXBawaan(indikatorPenuh?.xField, pasien.usiaBulan, pasien.tb));
    // Tebakan awal cara ukur dari umur; pengguna tetap bisa menimpanya.
    if (pasien.usiaBulan != null) setCaraUkur(caraUkurDariUsia(pasien.usiaBulan));
    setInputBerat(pasien.bb != null ? String(pasien.bb) : "");
    setInputTinggi(pasien.tb != null ? String(pasien.tb) : "");
    // Hasil plot milik pasien sebelumnya wajib ikut hilang; bila dibiarkan, ia
    // terbaca seolah-olah hasil pasien yang baru saja dipilih.
    setHasil(null);
    if (pasien.jk === "male" || pasien.jk === "female") setMphKelamin(pasien.jk);
    // Sengaja hanya bergantung pada identitas pasien: objek profil bisa saja
    // dibuat ulang tanpa isinya berubah, dan itu tidak boleh menghapus ketikan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunciPasien]);

  /*
   * Berpindah indikator dapat mengubah ARTI kolom X: dari umur (bulan) menjadi
   * panjang/tinggi (cm). Angka 18 yang tadinya berarti 18 bulan akan terbaca
   * sebagai 18 cm bila dibiarkan, jauh di luar tabel dan sangat menyesatkan.
   * Karena itu kolom X diisi ulang dari profil pasien, KECUALI bila pengguna
   * sudah mengetik sendiri (auto.current.x === false), yang tidak boleh ditimpa.
   */
  useEffect(() => {
    if (!auto.current.x) return;
    setInputX(nilaiXBawaan(indikatorPenuh?.xField, pasien.usiaBulan, pasien.tb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indikatorPenuh?.xField]);

  useEffect(() => {
    if (langkah === 3) setHasil(null);
  }, [langkah, indikator]);

  /* ---------------- Mode kalibrasi chart ---------------- */

  const [kalAktif, setKalAktif] = useState(false);
  const [kalMenangkap, setKalMenangkap] = useState(false);
  const [kalStep, setKalStep] = useState(-1);
  const [kalPilihan, setKalPilihan] = useState("");
  const [kalPx, setKalPx] = useState<Array<number | null>>([null, null, null, null]);
  const [kalMarker, setKalMarker] = useState<Array<{ left: number; top: number; nomor: number }>>([]);
  const [kalOutput, setKalOutput] = useState("");
  const [kalX0, setKalX0] = useState("");
  const [kalX1, setKalX1] = useState("");
  const [kalY0, setKalY0] = useState("");
  const [kalY1, setKalY1] = useState("");
  /** Kalibrasi hasil pengukuran ulang, menimpa nilai bawaan selama sesi ini. */
  const [kalOverride, setKalOverride] = useState<Record<string, Kalibrasi>>({});

  const opsiKalibrasi = useMemo(() => {
    const opsi: Array<{ value: string; label: string }> = [];
    indikator?.charts.forEach((c) =>
      (c.series || []).forEach((s) =>
        opsi.push({ value: `${c.id}::${s.key}`, label: `${c.title || c.id} \u2192 ${s.yLabel}` }),
      ),
    );
    return opsi;
  }, [indikator]);

  useEffect(() => {
    setKalPilihan(opsiKalibrasi[0]?.value ?? "");
  }, [opsiKalibrasi]);

  const kalChartId = kalPilihan.split("::")[0] ?? "";
  const kalSeriKey = kalPilihan.split("::")[1] ?? "";

  const resetKalibrasi = useCallback(() => {
    setKalMenangkap(false);
    setKalStep(-1);
    setKalPx([null, null, null, null]);
    setKalMarker([]);
    setKalOutput("");
  }, []);

  function mulaiKalibrasi() {
    const chart = indikator?.charts.find((c) => c.id === kalChartId);
    if (!chart || gambarGagal[chart.image]) {
      alert("Chart belum tersedia untuk area terpilih. Tambahkan gambar chart terlebih dahulu sebelum kalibrasi.");
      return;
    }
    resetKalibrasi();
    setKalMenangkap(true);
    setKalStep(0);
  }

  function toggleKalibrasi() {
    setKalAktif((a) => {
      if (a) resetKalibrasi();
      return !a;
    });
  }

  /**
   * Tangkap klik kalibrasi pada gambar chart.
   *
   * Koordinat dikonversi dari piksel tampilan ke piksel ASLI gambar
   * (naturalWidth/Height), persis seperti v17, sehingga hasil kalibrasi tidak
   * bergantung pada ukuran layar saat mengklik.
   */
  function tangkapKlikKalibrasi(e: ReactMouseEvent<HTMLDivElement>, chart: Chart) {
    if (!kalMenangkap || chart.id !== kalChartId || kalStep < 0) return;
    const imgEl = e.currentTarget.querySelector("img");
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();
    const xDisp = e.clientX - rect.left;
    const yDisp = e.clientY - rect.top;
    const natX = Math.round((xDisp / rect.width) * imgEl.naturalWidth);
    const natY = Math.round((yDisp / rect.height) * imgEl.naturalHeight);

    const pxBaru = [...kalPx];
    pxBaru[kalStep] = kalStep < 2 ? natX : natY;
    setKalPx(pxBaru);
    setKalMarker((m) => [
      ...m,
      { left: (xDisp / rect.width) * 100, top: (yDisp / rect.height) * 100, nomor: kalStep + 1 },
    ]);

    if (kalStep < 3) {
      setKalStep(kalStep + 1);
      return;
    }

    setKalMenangkap(false);
    setKalStep(-1);
    hasilkanKalibrasi(pxBaru, imgEl.naturalWidth, imgEl.naturalHeight);
  }

  function hasilkanKalibrasi(px: Array<number | null>, lebarAsli: number, tinggiAsli: number) {
    const x0val = num(kalX0);
    const x1val = num(kalX1);
    const y0val = num(kalY0);
    const y1val = num(kalY1);

    const plot = { x0: px[0] ?? 0, x1: px[1] ?? 0, y0: px[2] ?? 0, y1: px[3] ?? 0 };
    const objek = {
      imgWidth: lebarAsli,
      imgHeight: tinggiAsli,
      plot,
      xRange: [x0val ?? "X_MIN", x1val ?? "X_MAX"],
      yRange: [y0val ?? "Y_MIN", y1val ?? "Y_MAX"],
    };

    const fieldLabel = "calibration." + (kalSeriKey || "berat");
    const lengkap = x0val != null && x1val != null && y0val != null && y1val != null;

    setKalOutput(
      "\u2705 Salin ke field `" +
        fieldLabel +
        "` pada chart `" +
        (kalChartId || "") +
        "` di GROWTH_CHART_CONFIG:\n\n" +
        fieldLabel +
        ": " +
        JSON.stringify(objek).replace(
          /"(imgWidth|imgHeight|plot|x0|x1|y0|y1|xRange|yRange)":/g,
          "$1:",
        ) +
        "\n\n" +
        (lengkap
          ? "\u2728 Kalibrasi area ini diterapkan langsung. Ulangi untuk area lain bila perlu, lalu tekan PLOT untuk menguji."
          : "\u26A0\ufe0f Lengkapi nilai sumbu X/Y di atas agar engine dapat menghitung posisi titik."),
    );

    if (lengkap && kalChartId && kalSeriKey) {
      setKalOverride((lama) => ({
        ...lama,
        [`${kalChartId}::${kalSeriKey}`]: {
          imgWidth: lebarAsli,
          imgHeight: tinggiAsli,
          plot,
          xRange: [x0val, x1val],
          yRange: [y0val, y1val],
        },
      }));
    }
  }

  /** Kalibrasi yang berlaku: hasil pengukuran ulang bila ada, jika tidak nilai bawaan. */
  const ambilKalibrasi = useCallback(
    (chart: Chart, seri: SeriChart): Kalibrasi | undefined =>
      kalOverride[`${chart.id}::${seri.key}`] ?? chart.calibration[seri.key],
    [kalOverride],
  );

  /* ---------------- PLOT ---------------- */

  function jalankanPlot() {
    const ind = indikator;
    if (!ind || !standar || !kelamin) return;

    const nilaiX = parseFloat(inputX);
    if (!isFinite(nilaiX)) {
      setHasil({ pesan: `Mohon lengkapi ${ind.xLabel.toLowerCase()} terlebih dahulu.` });
      return;
    }

    const seriVal: Record<string, number> = {};
    const berat = parseFloat(inputBerat);
    const tinggi = parseFloat(inputTinggi);
    if (isFinite(berat)) seriVal.berat = berat;
    if (isFinite(tinggi)) seriVal.tinggi = tinggi;
    // IMT/U tidak diinput manual — dihitung dari BB & TB, sama seperti v17.
    const imt = hitungIMT(berat, tinggi);
    if (imt != null) seriVal.imt = imt;

    if (!Object.values(seriVal).some((v) => isFinite(v))) {
      setHasil({ pesan: "Mohon isi minimal salah satu data (berat atau tinggi badan)." });
      return;
    }

    const baris: HasilPlot["baris"] = [];
    const titikPerChart: Record<string, TitikTergambar[]> = {};
    const interpretasi: ReactNode[] = [];
    const zTextSummary: string[] = [];
    const belumKalibrasi: string[] = [];
    let adaLuarBatas = false;
    let adaChartHilang = false;
    const cdcSudah = new Set<string>();

    ind.charts.forEach((c) => {
      titikPerChart[c.id] = [];
      (c.series || []).forEach((s) => {
        const nilai = seriVal[s.key];
        if (nilai === undefined || !isFinite(nilai)) return;

        const cal = ambilKalibrasi(c, s);
        if (!tkKalibrasiValid(cal)) {
          belumKalibrasi.push(s.yLabel);
          return;
        }
        if (gambarGagal[c.image]) {
          adaChartHilang = true;
          return;
        }

        const titik = tkHitungKoordinatTitik(cal, nilaiX, nilai);
        if (titik.diLuarBatasX || titik.diLuarBatasY) adaLuarBatas = true;
        titikPerChart[c.id]?.push({
          seriKey: s.key,
          titik,
          warna: s.warna,
          yLabel: s.yLabel,
          yUnit: s.yUnit,
          nilai,
        });

        baris.push({ yLabel: s.yLabel, nilai, yUnit: s.yUnit, warna: s.warna });

        if (standar === "cdc") {
          const key = `${s.zKey}-${nilaiX}-${nilai}`;
          if (!cdcSudah.has(key)) {
            cdcSudah.add(key);
            const cdcInterp = tkInterpretasiCdcPercentile(kelamin, s.zKey, nilaiX, nilai);
            if (cdcInterp) {
              zTextSummary.push(
                `${cdcInterp.judul}: ${cdcInterp.pctMedian.toFixed(1)}% (${cdcInterp.judul === "TB/U CDC" ? "TB P50" : "BB P50"}: ${cdcInterp.median.toFixed(1)} ${cdcInterp.unit}) — Status: ${cdcInterp.status}`
              );
              interpretasi.push(
                <div className="tk-cdc-block" key={`cdc-${c.id}-${s.key}`}>
                  <div className="tk-cdc-row">
                    <span className="tk-cdc-label">Indikator</span>
                    <span className="tk-cdc-value">{cdcInterp.judul}</span>
                  </div>
                  <div className="tk-cdc-row">
                    <span className="tk-cdc-label">Hasil</span>
                    <span className="tk-cdc-value">{cdcInterp.pctMedian.toFixed(1)}%</span>
                  </div>
                  <div className="tk-cdc-row">
                    <span className="tk-cdc-label">{cdcInterp.judul === "TB/U CDC" ? "TB P50" : "BB P50"}</span>
                    <span className="tk-cdc-value">
                      {cdcInterp.median.toFixed(1)} {cdcInterp.unit}
                    </span>
                  </div>
                  <div
                    className="tk-cdc-status"
                    style={{ borderLeft: `4px solid ${cdcInterp.color}`, background: `${cdcInterp.color}18` }}
                  >
                    <span style={{ color: cdcInterp.color }}>● {cdcInterp.status}</span>
                  </div>
                </div>,
              );
            }
          }
        } else {
          const z = tkInterpretasiZscore(standar, kelamin, s.zKey, c.zAge, nilaiX, nilai);
          if (z) {
            const zSign = z.z >= 0 ? "+" : "";
            zTextSummary.push(
              `${s.yLabel}: Z-score ${zSign}${z.z} (${z.rentang || z.zonaLabel})${z.statusGizi ? ` — Status: ${z.statusGizi}` : ""}`
            );
            interpretasi.push(
              <div className="tk-zscore-block" key={`z-${c.id}-${s.key}`}>
                <div className="tk-zscore-row">
                  <span className="tk-zscore-label">{s.yLabel} \u2014 Z-score</span>
                  <span className="tk-zscore-nilai">
                    {zSign}
                    {z.z}
                  </span>
                </div>
                <div className="tk-zscore-row">
                  <span className="tk-zscore-label">Posisi</span>
                  <span className="tk-zscore-nilai">{z.rentang || z.zonaLabel}</span>
                </div>
                {z.statusGizi ? (
                  <div
                    className="tk-zscore-status"
                    style={{ borderLeft: `4px solid ${z.statusColor}`, background: `${z.statusColor}18` }}
                  >
                    <span style={{ color: z.statusColor, fontWeight: 700 }}>⬤ {z.statusGizi}</span>
                  </div>
                ) : null}
              </div>,
            );
          }
        }
      });
    });

    if (standar === "cdc" && isFinite(berat) && isFinite(tinggi)) {
      const bbtb = tkInterpretasiCdcBbtb(kelamin, berat, tinggi);
      if (bbtb) {
        zTextSummary.push(`BB/TB CDC: ${bbtb.pct.toFixed(1)}% (BB ideal: ${bbtb.standar.toFixed(1)} kg) — Status: ${bbtb.status}`);
        interpretasi.push(
          <div className="tk-cdc-block" key="cdc-bbtb">
            <div className="tk-cdc-row">
              <span className="tk-cdc-label">Indikator</span>
              <span className="tk-cdc-value">BB/TB CDC</span>
            </div>
            <div className="tk-cdc-row">
              <span className="tk-cdc-label">Hasil</span>
              <span className="tk-cdc-value">{bbtb.pct.toFixed(1)}%</span>
            </div>
            <div className="tk-cdc-row">
              <span className="tk-cdc-label">BB ideal sesuai tinggi</span>
              <span className="tk-cdc-value">{bbtb.standar.toFixed(1)} kg</span>
            </div>
            <div
              className="tk-cdc-status"
              style={{ borderLeft: `4px solid ${bbtb.color}`, background: `${bbtb.color}18` }}
            >
              <span style={{ color: bbtb.color }}> {bbtb.status}</span>
            </div>
          </div>,
        );
      }
      interpretasi.push(<MateriCdcWaterlow key="materi-cdc" />);
    }
    if (standar === "who" && interpretasi.length) {
      interpretasi.push(<MateriWhoZscore key="materi-who" />);
    }

    setHasil({
      nilaiX,
      baris,
      titikPerChart,
      adaLuarBatas,
      adaChartHilang,
      belumKalibrasi,
      interpretasi,
      zTextSummary,
    });
    setDitambahkanPlot(false);
  }

  /* ---------------- MPH ---------------- */

  const [mphAyah, setMphAyah] = useState("");
  const [mphIbu, setMphIbu] = useState("");
  const [mphHasil, setMphHasil] = useState<ReactNode>(null);
  const [mphData, setMphData] = useState<{ mph: number; lo: number; hi: number; kelamin: Kelamin; ayah: number; ibu: number } | null>(null);

  const [ditambahkanPlot, setDitambahkanPlot] = useState(false);
  const [ditambahkanMph, setDitambahkanMph] = useState(false);

  function klikHitungMph() {
    const a = num(mphAyah);
    const i = num(mphIbu);
    if (a == null || i == null) {
      setMphHasil(<div className="dx-res dx-neutral">Isi tinggi ayah &amp; ibu.</div>);
      setMphData(null);
      return;
    }
    const r = hitungMPH(a, i, mphKelamin);
    if (!r) return;

    setMphData({ mph: r.mph, lo: r.lo, hi: r.hi, kelamin: mphKelamin, ayah: a, ibu: i });
    setDitambahkanMph(false);

    setMphHasil(
      <div className="dx-res dx-ok">
        <b>MPH ≈ {f(r.mph, 1)} cm</b> ({mphKelamin === "female" ? "perempuan" : "laki-laki"})
        <br />
        Rentang target genetik:{" "}
        <b>
          {f(r.lo, 1)} – {f(r.hi, 1)} cm
        </b>{" "}
        (MPH ± 8,5 cm).
        <br />
        <span style={{ color: "#8a7a68" }}>
          Rumus Tanner: (tinggi ayah + tinggi ibu {mphKelamin === "female" ? "−" : "+"} 13) ÷ 2. Estimasi potensi
          genetik, bukan jaminan tinggi akhir.
        </span>
      </div>,
    );
  }

  const handleTambahPlotRingkasan = () => {
    if (!hasil || !indikator) return;

    const lines: string[] = [];
    const stdLabel = standar ? GROWTH_CHART_CONFIG[standar]?.label || standar.toUpperCase() : "Kurva Pertumbuhan";
    const kelLabel = kelamin === "female" ? "Perempuan" : "Laki-laki";

    lines.push(`Standar Kurva: ${stdLabel} (${kelLabel})`);
    lines.push(`Indikator: ${indikator.label}`);
    lines.push(`${indikator.xLabel}: ${hasil.nilaiX} ${indikator.xUnit}`);

    if (hasil.baris?.length) {
      hasil.baris.forEach((b) => {
        lines.push(`${b.yLabel}: ${b.nilai} ${b.yUnit}`);
      });
    }

    if (hasil.zTextSummary?.length) {
      lines.push("--- Evaluasi & Z-Score ---");
      hasil.zTextSummary.forEach((t) => lines.push(t));
    }

    addRingkasanItem({
      title: `Plotting ${stdLabel} — ${indikator.label}`,
      source: "Tumbuh Kembang",
      body: lines.join("\n"),
    });

    setDitambahkanPlot(true);
    setTimeout(() => setDitambahkanPlot(false), 2200);
  };

  const handleTambahMphRingkasan = () => {
    if (!mphData) return;
    const genderLabel = mphData.kelamin === "female" ? "Perempuan" : "Laki-laki";
    addRingkasanItem({
      title: "Prediksi Tinggi Dewasa (MPH)",
      source: "Tumbuh Kembang",
      body: `Tinggi Ayah: ${mphData.ayah} cm\nTinggi Ibu: ${mphData.ibu} cm\nJenis Kelamin Anak: ${genderLabel}\nMid-Parental Height (MPH): ~${f(mphData.mph, 1)} cm\nRentang Target Genetik (MPH ± 8,5 cm): ${f(mphData.lo, 1)} – ${f(mphData.hi, 1)} cm`,
    });

    setDitambahkanMph(true);
    setTimeout(() => setDitambahkanMph(false), 2200);
  };

  /* ---------------- Render ---------------- */

  function pindahLangkah(l: 1 | 2 | 3) {
    setLangkah(l);
  }

  const seriInput = useMemo(() => {
    const map: Record<string, SeriChart> = {};
    indikator?.charts.forEach((c) =>
      (c.series || []).forEach((s) => {
        if (!map[s.key] && !s.computed) map[s.key] = s;
      }),
    );
    return Object.values(map);
  }, [indikator]);

  const labelStandar = standar ? GROWTH_CHART_CONFIG[standar]?.label : "";
  const labelKelamin = standar && kelamin ? GROWTH_CHART_CONFIG[standar]?.genders[kelamin]?.label : "";

  /**
   * Unduh satu chart sebagai PNG pada resolusi ASLI gambarnya.
   *
   * WHY: chart ini dipakai koas untuk presentasi. Tangkapan layar hanya
   * merekam sebesar yang tampil (sekitar 900 px) sehingga pecah begitu
   * diproyeksikan. unduhChart.ts menggambar ulang overlay di atas gambar
   * berukuran penuh, memakai persen yang sama dari plotting.ts.
   */
  async function unduhChart(c: Chart) {
    const daftar = hasil?.titikPerChart?.[c.id] ?? [];
    if (daftar.length === 0) return;

    const stage = document.getElementById(`tkChartStage_${c.id}`);
    const img = stage?.querySelector("img") ?? null;
    if (!img) {
      setUnduhGagal("Gambar chart belum tersedia.");
      return;
    }

    setUnduhGagal(null);
    setUnduhSibuk(c.id);
    try {
      const namaChart = c.title || indikator?.label || c.id;
      // Satuan TIDAK diulang di sini: b.yLabel dari chartConfig sudah
      // menyertakan satuannya sendiri, mis. "Berat Badan (kg)". Menambahkan
      // b.yUnit lagi menghasilkan "...(kg): 19,0 kg" yang dobel dan berantakan
      // pada pita keterangan di berkas unduhan.
      const keterangan = (hasil?.baris ?? []).map(
        (b) => `${b.yLabel}: ${f(b.nilai, 1)}`,
      );
      if (hasil?.nilaiX != null && indikator) {
        keterangan.unshift(`${indikator.xLabel}: ${f(hasil.nilaiX, 1)}`);
      }

      await unduhChartPNG({
        img,
        titik: daftar.map((t) => ({
          titik: t.titik,
          targetX: tkTargetGarisHorizontal(t.titik, t.yLabel, t.yUnit, t.nilai, c.id),
          warna: t.warna,
          yLabel: t.yLabel,
          yUnit: t.yUnit,
          nilai: t.nilai,
        })),
        namaBerkas: amanNamaBerkas(`${labelStandar}-${namaChart}-${labelKelamin}`),
        judul: `${namaChart} — ${labelStandar} ${labelKelamin}`,
        subjudul: `Usia ${c.ageLabel || "-"}`,
        keterangan,
      });
    } catch (err) {
      setUnduhGagal(err instanceof Error ? err.message : "Gagal mengunduh chart.");
    } finally {
      setUnduhSibuk(null);
    }
  }

  return (
    <div className="tk-island-wrap">
      <div className="judul-section" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          className="ikon-bulat"
          style={{
            background: "transparent",
            boxShadow: "none",
            border: "none",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IkonJudulTumbuhKembang />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
              fontSize: "19.48px",
              fontWeight: 700,
              color: "var(--tv-navy, #0a0b5f)",
              lineHeight: 1.25,
            }}
          >
            Tumbuh Kembang
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "Quicksand, system-ui, sans-serif",
              fontSize: "10.24px",
              fontWeight: 600,
              color: "var(--tv-soft-teks, rgba(10, 11, 95, 0.62))",
              lineHeight: 1.4,
            }}
          >
            Kurva pertumbuhan WHO &amp; CDC
          </p>
        </div>
      </div>

      <div className="kartu">
        {/* ===== STEPPER ===== */}
        <div className="tk-stepper" id="tkStepper">
          {([1, 2, 3] as const).map((s) => {
            const kelas =
              s === langkah ? "tk-aktif" : s < langkah ? "tk-selesai" : "tk-terkunci";
            const nama = s === 1 ? "Standar" : s === 2 ? "Kelamin" : "Chart";
            return (
              <button
                key={s}
                className={`tk-step-dot ${kelas}`}
                data-step={s}
                type="button"
                onClick={() => {
                  if (kelas !== "tk-terkunci") pindahLangkah(s);
                }}
              >
                <span className="tk-step-num">{s}</span>
                {nama}
              </button>
            );
          })}
        </div>

        {/* ===== RINGKASAN PILIHAN (chip) ===== */}
        <div className="tk-ringkasan" id="tkRingkasan">
          {standar ? (
            <span className="tk-ringkasan-chip">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {standar === "who" ? <IkonWho /> : <IkonCdc />} <span>{labelStandar}</span>
              </span>
              <button type="button" title="Ganti pilihan ini" onClick={() => pindahLangkah(1)}>
                ✕
              </button>
            </span>
          ) : null}
          {kelamin ? (
            <span className="tk-ringkasan-chip">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {kelamin === "male" ? <IkonMale /> : <IkonFemale />} <span>{labelKelamin}</span>
              </span>
              <button type="button" title="Ganti pilihan ini" onClick={() => pindahLangkah(2)}>
                ✕
              </button>
            </span>
          ) : null}
        </div>

        {/* ===== PANEL 1: STANDAR ===== */}
        <div className={`tk-panel${langkah === 1 ? " tk-aktif" : ""}`} id="tkPanel1">
          <p className="catatan-metode" style={{ marginBottom: 14 }}>
            Pilih standar kurva pertumbuhan yang ingin digunakan.
          </p>
          <div className="tk-pilihan-besar" id="tkGridStandar">
            {(Object.keys(GROWTH_CHART_CONFIG) as Standar[]).map((key) => {
              const std = GROWTH_CHART_CONFIG[key];
              if (!std) return null;
              return (
                <div
                  key={key}
                  className={`tk-kartu-pilihan ${standar === key ? "tk-pilih-aktif" : ""}`}
                  data-standar={key}
                  onClick={() => {
                    setStandar(key);
                    setKelamin(null);
                    pindahLangkah(2);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {key === "who" ? <IkonWho /> : <IkonCdc />}
                  </div>
                  <div className="tk-nama-pilihan">{std.label}</div>
                  <div className="tk-sub-pilihan">{std.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== PANEL 2: JENIS KELAMIN ===== */}
        <div className={`tk-panel${langkah === 2 ? " tk-aktif" : ""}`} id="tkPanel2">
          <button className="tk-btn-kembali-mini" type="button" onClick={() => pindahLangkah(1)}>
            ⬅️ Ganti standar
          </button>
          <p className="catatan-metode" style={{ marginBottom: 14 }}>
            Pilih jenis kelamin anak.
          </p>
          <div className="tk-pilihan-besar" id="tkGridKelamin">
            {standar
              ? (Object.keys(GROWTH_CHART_CONFIG[standar]?.genders ?? {}) as Kelamin[]).map((key) => {
                  const g = GROWTH_CHART_CONFIG[standar]?.genders[key];
                  if (!g) return null;
                  return (
                    <div
                      key={key}
                      className={`tk-kartu-pilihan ${kelamin === key ? "tk-pilih-aktif" : ""}`}
                      data-kelamin={key}
                      onClick={() => {
                        setKelamin(key);
                        pindahLangkah(3);
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {key === "male" ? <IkonMale /> : <IkonFemale />}
                      </div>
                      <div className="tk-nama-pilihan">{g.label}</div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>

        {/* ===== PANEL 3: CHART + FORM PLOTTING ===== */}
        <div className={`tk-panel${langkah === 3 ? " tk-aktif" : ""}`} id="tkPanel3">
          <button className="tk-btn-kembali-mini" type="button" onClick={() => pindahLangkah(2)}>
            ⬅️ Ganti jenis kelamin
          </button>

          {/*
            Pemilih dibuat sebagai <button> sungguhan, bukan <div role="button">.
            Tombol asli sudah membawa fokus keyboard, Enter/Spasi, dan status
            tertekan tanpa satu pun penangan tambahan yang harus dirawat.
          */}
          {daftarIndikator.length > 1 ? (
            <div className="tk-seg" role="group" aria-label="Jenis kurva">
              {daftarIndikator.map((d) => {
                const aktif = d.ind === indikatorPenuh;
                return (
                  <button
                    key={d.key}
                    type="button"
                    className={`tk-seg-btn${aktif ? " tk-seg-aktif" : ""}`}
                    aria-pressed={aktif}
                    onClick={() => setIndikatorKey(d.key)}
                  >
                    <span className="tk-seg-ikon" aria-hidden="true">
                      {ikonIndikator(d.key)}
                    </span>
                    {/* Satuan sumbu X sengaja tidak diulang di sini: satuan itu
                        sudah tercetak pada label kolom masukan tepat di bawahnya. */}
                    <span className="tk-seg-nama">{d.ind.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {perluCaraUkur ? (
            <>
              <div className="tk-seg" role="group" aria-label="Cara pengukuran">
                {(
                  [
                    {
                      nilai: "pb" as CaraUkurPanjang,
                      Ikon: IkonSegTelentang,
                      nama: "Panjang badan (telentang)",
                      ket: "0\u20132 tahun",
                    },
                    {
                      nilai: "tb" as CaraUkurPanjang,
                      Ikon: IkonSegBerdiri,
                      nama: "Tinggi badan (berdiri)",
                      ket: "2\u20135 tahun",
                    },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.nilai}
                    type="button"
                    className={`tk-seg-btn${caraUkur === o.nilai ? " tk-seg-aktif" : ""}`}
                    aria-pressed={caraUkur === o.nilai}
                    onClick={() => setCaraUkur(o.nilai)}
                  >
                    <span className="tk-seg-ikon" aria-hidden="true">
                      <o.Ikon />
                    </span>
                    <span className="tk-seg-teks">
                      <span className="tk-seg-nama">{o.nama}</span>
                      <span className="tk-seg-ket">{o.ket}</span>
                    </span>
                  </button>
                ))}
              </div>
              {/*
                Catatan ini ringkas tetapi tidak boleh hilang: WHO memakai tabel
                berbeda untuk panjang telentang dan tinggi berdiri, dan penentunya
                adalah cara pengukuran, bukan umur anak. Rentang usia di atas hanya
                keterangan tabel.
              */}
              <p className="tk-seg-nota">Pilih sesuai cara anak diukur, bukan sesuai usianya.</p>
            </>
          ) : null}
          <div className="tk-plot-header" id="tkPlotHeader">
            {indikator ? (
              <>
                <div className="tk-plot-judul" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IkonChart />{" "}
                  <span>
                    {/* Judul mengikuti indikator terpilih. Dulu dipatok keras per
                        standar, sehingga indikator kedua tetap berjudul indikator pertama. */}
                    {labelStandar} {indikator.label} —{" "}
                    {labelKelamin}
                  </span>
                </div>
                <div className="tk-plot-sub">
                  Isi data anak satu kali, lalu tekan PLOT untuk menampilkan titik pada{" "}
                  {indikator.charts.length > 1 ? "semua chart" : "chart"} di bawah.
                </div>
                {unduhGagal ? (
                  <div className="tk-unduh-galat" role="alert">
                    ⚠️ {unduhGagal}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="tk-charts-wrap" id="tkChartsWrap">
            {indikator?.charts.map((c) => (
              <div className="tk-chart-blok" key={c.id}>
                <div className="tk-chart-kepala">
                  <span className="tk-chart-judul">{c.title || indikator.label}</span>
                  <span className="tk-chart-usia" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <IkonCalendar /> Usia {c.ageLabel || ""}
                  </span>
                  <button
                    type="button"
                    className="tk-btn-unduh"
                    onClick={() => void unduhChart(c)}
                    disabled={unduhSibuk !== null || (hasil?.titikPerChart?.[c.id]?.length ?? 0) === 0}
                    title="Unduh chart ini sebagai PNG resolusi penuh untuk presentasi"
                  >
                    {unduhSibuk === c.id ? "Menyiapkan…" : "⬇️ Unduh HD"}
                  </button>
                </div>
                <div
                  className={`tk-chart-stage${
                    kalMenangkap && c.id === kalChartId ? " mode-kalibrasi" : ""
                  }`}
                  id={`tkChartStage_${c.id}`}
                  data-chart-id={c.id}
                  data-image={c.image}
                  onClick={(e) => tangkapKlikKalibrasi(e, c)}
                >
                  {gambarGagal[c.image] ? (
                    <div className="tk-chart-belum">
                      <span style={{ fontSize: "2rem" }}>🚧</span>
                      <p>Growth chart untuk kombinasi ini belum ditambahkan.</p>
                      <code>{c.image}</code>
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={`${c.image}-${c.id}`}
                        src={c.image}
                        alt={`Growth chart ${c.title || indikator.label} ${labelKelamin}`}
                        onError={() => setGambarGagal((g) => ({ ...g, [c.image]: true }))}
                      />
                      {(hasil?.titikPerChart?.[c.id] ?? []).map((t) => {
                        const baseBawah = isFinite(t.titik.sumbuUsiaPersen)
                          ? t.titik.sumbuUsiaPersen
                          : t.titik.sumbuBawahPersen;
                        const targetX = tkTargetGarisHorizontal(t.titik, t.yLabel, t.yUnit, t.nilai, c.id);
                        const isGarisKeKanan = targetX === t.titik.sumbuKananPersen;
                        let pangkasKeKiri = false;
                        if (isGarisKeKanan) {
                          // Garis horizontal ke kanan (mis. Berat Badan CDC) -> div ke KIRI
                          pangkasKeKiri = true;
                          if (t.titik.leftPercent < 20) {
                            pangkasKeKiri = false;
                          }
                        } else {
                          // Garis horizontal ke kiri (mis. WHO, TB CDC) -> div ke KANAN
                          pangkasKeKiri = false;
                          if (t.titik.leftPercent > 72) {
                            pangkasKeKiri = true;
                          }
                        }
                        const pangkasKeBawah = t.titik.topPercent < 22;
                        const offsetX = pangkasKeKiri ? "calc(-100% - 16px)" : "16px";
                        const offsetY = pangkasKeBawah ? "16px" : "calc(-100% - 14px)";

                        return (
                          <div key={`${t.seriKey}-${t.nilai}-${t.titik.leftPercent}`}>
                            <div
                              className="tk-garis-bantu vertikal"
                              style={{
                                left: `${t.titik.leftPercent}%`,
                                top: `${Math.min(t.titik.topPercent, baseBawah)}%`,
                                height: `${Math.abs(baseBawah - t.titik.topPercent)}%`,
                                background: t.warna,
                              }}
                            />
                            <div
                              className="tk-garis-bantu horizontal"
                              style={{
                                top: `${t.titik.topPercent}%`,
                                left: `${Math.min(t.titik.leftPercent, targetX)}%`,
                                width: `${Math.abs(t.titik.leftPercent - targetX)}%`,
                                background: t.warna,
                              }}
                            />
                            <div
                              className="tk-titik-pasien"
                              style={{
                                left: `${t.titik.leftPercent}%`,
                                top: `${t.titik.topPercent}%`,
                                background: t.warna,
                              }}
                            />
                            <div
                              className="tk-label-pasien"
                              style={{
                                left: `${t.titik.leftPercent}%`,
                                top: `${t.titik.topPercent}%`,
                                transform: `translate(${offsetX}, ${offsetY})`,
                                borderColor: t.warna,
                              }}
                            >
                              <span style={{ color: t.warna }}>⬤</span> {t.yLabel}
                              <br />
                              {t.nilai} {t.yUnit}
                              {/* WHY khusus c.id === "bbtb": hanya chart BB/TB
                                  yang perlu ini. Chart lain (BB/U, IMT/U) sumbu-X-nya
                                  usia, dan menampilkan usia di box titik dianggap
                                  tidak perlu -- diminta dibatasi ke BB/TB saja. */}
                              {c.id === "bbtb" && indikator && hasil?.nilaiX != null && (
                                <>
                                  <br />
                                  {indikator.xLabel}: {hasil.nilaiX} {indikator.xUnit}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {c.id === kalChartId &&
                        kalMarker.map((m, i) => (
                          <div
                            key={`marker-${i}`}
                            className="tk-kalibrasi-marker"
                            style={{ left: `${m.left}%`, top: `${m.top}%` }}
                          >
                            {m.nomor}
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-row-group" id="tkFormPlot" style={{ marginTop: 18 }}>
            {indikator ? (
              <div className="form-group">
                <label htmlFor="tkInputX" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IkonCalendar /> {indikator.xLabel}
                </label>
                <input
                  type="number"
                  id="tkInputX"
                  placeholder={indikator.xUnit === "cm" ? "cth: 82" : "cth: 18"}
                  min="0"
                  step={indikator.xUnit === "cm" ? "0.1" : "0.5"}
                  inputMode="decimal"
                  value={inputX}
                  onChange={(e) => {
                    auto.current.x = false;
                    setInputX(e.target.value);
                  }}
                />
              </div>
            ) : null}
            {seriInput.map((s) => (
              <div className="form-group" key={s.key}>
                <label htmlFor={`tkInput_${s.key}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {s.key === "berat" ? <IkonScale /> : s.key === "tinggi" ? <IkonRuler /> : <IkonBmi />} {s.yLabel}
                </label>
                <input
                  type="number"
                  id={`tkInput_${s.key}`}
                  placeholder={s.key === "berat" ? "cth: 12.5" : "cth: 80"}
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  value={s.key === "berat" ? inputBerat : inputTinggi}
                  onChange={(e) => {
                    if (s.key === "berat") {
                      auto.current.berat = false;
                      setInputBerat(e.target.value);
                    } else {
                      auto.current.tinggi = false;
                      setInputTinggi(e.target.value);
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <button className="btn-hitung" id="btnPlotTumbuhKembang" type="button" onClick={jalankanPlot}>
            📍 PLOT
          </button>

          <div className={`tk-hasil-box${hasil ? " tampil" : ""}`} id="tkHasilBox">
            {hasil?.pesan ? (
              <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IkonWarning /> <span>{hasil.pesan}</span>
              </p>
            ) : null}
            {hasil && !hasil.pesan && indikator ? (
              <>
                <div className="tk-hasil-judul" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <IkonPin /> <span>Hasil Plotting</span>
                </div>
                <div className="tk-hasil-baris">
                  <span className="tk-hasil-label">{indikator.xLabel}</span>
                  <span className="tk-hasil-nilai">
                    {hasil.nilaiX} {indikator.xUnit}
                  </span>
                </div>
                {hasil.baris?.map((b, i) => (
                  <div className="tk-hasil-baris" key={`${b.yLabel}-${i}`}>
                    <span className="tk-hasil-label">{b.yLabel}</span>
                    <span className="tk-hasil-nilai" style={{ color: b.warna }}>
                      ⬤ {b.nilai} {b.yUnit}
                    </span>
                  </div>
                ))}
                <div className="tk-hasil-baris">
                  <span className="tk-hasil-label">Chart</span>
                  <span className="tk-hasil-nilai">
                    {labelStandar} · {indikator.label}
                  </span>
                </div>
                {hasil.adaChartHilang ? (
                  <div className="tk-hasil-peringatan" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <IkonWarning />{" "}
                    <span>
                      Sebagian gambar chart belum tersedia, sehingga titik tidak dapat ditampilkan di chart tersebut.
                    </span>
                  </div>
                ) : null}
                {hasil.adaLuarBatas ? (
                  <div className="tk-hasil-peringatan" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <IkonWarning />{" "}
                    <span>Sebagian nilai berada di luar rentang chart — titik ditampilkan pada batas terdekat.</span>
                  </div>
                ) : null}
                {hasil.belumKalibrasi?.length ? (
                  <div className="tk-hasil-peringatan" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <IkonWarning /> <span>Area chart untuk {hasil.belumKalibrasi.join(" & ")} belum dikalibrasi.</span>
                  </div>
                ) : null}
                {hasil.interpretasi}

                {/* Tambahkan ke Ringkasan Button */}
                <div style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className="tk-btn-ringkasan"
                    onClick={handleTambahPlotRingkasan}
                  >
                    {ditambahkanPlot ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
                  </button>
                </div>
              </>
            ) : null}
          </div>

          {/* ===== KARTU PREDIKSI TINGGI (MPH) — collapsible ===== */}
          <details className="kartu tk-mph-card" id="mphCard" style={{ marginTop: 16 }}>
            <summary className="tk-mph-summary">
              <span className="dx-sub-h" style={{ margin: 0 }}>
                {"   "}Prediksi Tinggi (MPH)
              </span>
              <span className="tk-mph-chevron" aria-hidden="true">
                ▸
              </span>
            </summary>
            <div className="tk-mph-body">
              <p className="catatan-metode" style={{ marginBottom: 12 }}>
                Perkiraan potensi tinggi dewasa anak dari tinggi kedua orang tua (rumus Tanner). Jenis kelamin terisi
                otomatis dari Profil Pasien.
              </p>
              <div className="form-group">
                <label htmlFor="mphAyah">Tinggi Ayah (cm)</label>
                <input
                  id="mphAyah"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="cth: 170"
                  value={mphAyah}
                  onChange={(e) => setMphAyah(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mphIbu">Tinggi Ibu (cm)</label>
                <input
                  id="mphIbu"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="cth: 158"
                  value={mphIbu}
                  onChange={(e) => setMphIbu(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mphKelamin">Jenis Kelamin Anak</label>
                <select
                  id="mphKelamin"
                  value={mphKelamin}
                  onChange={(e) => setMphKelamin(e.target.value as Kelamin)}
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <button className="btn-hitung" id="mphBtn" type="button" onClick={klikHitungMph}>
                🧬 Hitung MPH
              </button>
              <div className="dx-hasil" id="mphHasil">
                {mphHasil}
              </div>
              {mphData && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    type="button"
                    className="tk-btn-ringkasan"
                    onClick={handleTambahMphRingkasan}
                  >
                    {ditambahkanMph ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
                  </button>
                </div>
              )}
            </div>
          </details>

          {/* ===== ALAT KALIBRASI CHART ===== */}
          <button
            className={`tk-kalibrasi-toggle${kalAktif ? " aktif" : ""}`}
            id="tkKalibrasiToggle"
            type="button"
            onClick={toggleKalibrasi}
          >
            🎯 Mode Kalibrasi Chart
          </button>
          <div className={`tk-kalibrasi-box${kalAktif ? " tampil" : ""}`} id="tkKalibrasiBox">
            <h4>🎯 Kalibrasi Chart Baru</h4>
            <p>
              Saat menambahkan gambar chart baru, gunakan alat ini untuk menghasilkan data <code>calibration</code>{" "}
              otomatis — cukup klik 4 tepi area kurva pada chart, lalu salin hasilnya ke{" "}
              <code>GROWTH_CHART_CONFIG</code>. Tidak perlu menebak posisi piksel manual.
            </p>
            <div
              className="tk-kalibrasi-seri-wrap"
              id="tkKalSeriWrap"
              style={{ display: opsiKalibrasi.length ? "block" : "none", marginBottom: 10 }}
            >
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="tkKalSeri">Area kurva yang dikalibrasi</label>
                <select id="tkKalSeri" value={kalPilihan} onChange={(e) => setKalPilihan(e.target.value)}>
                  {opsiKalibrasi.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="tk-kalibrasi-range">
              <div className="form-group">
                <label htmlFor="tkKalX0">Nilai sumbu X minimum (kiri)</label>
                <input id="tkKalX0" inputMode="decimal" placeholder="cth: 0" type="number" value={kalX0} onChange={(e) => setKalX0(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="tkKalX1">Nilai sumbu X maksimum (kanan)</label>
                <input id="tkKalX1" inputMode="decimal" placeholder="cth: 60" type="number" value={kalX1} onChange={(e) => setKalX1(e.target.value)} />
              </div>
            </div>
            <div className="tk-kalibrasi-range">
              <div className="form-group">
                <label htmlFor="tkKalY0">Nilai sumbu Y minimum (bawah)</label>
                <input id="tkKalY0" inputMode="decimal" placeholder="cth: 5" type="number" value={kalY0} onChange={(e) => setKalY0(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="tkKalY1">Nilai sumbu Y maksimum (atas)</label>
                <input id="tkKalY1" inputMode="decimal" placeholder="cth: 30" type="number" value={kalY1} onChange={(e) => setKalY1(e.target.value)} />
              </div>
            </div>
            {[
              { step: 0, teks: <>Klik tepi <b>KIRI</b> area kurva (X minimum)</> },
              { step: 1, teks: <>Klik tepi <b>KANAN</b> area kurva (X maksimum)</> },
              { step: 2, teks: <>Klik tepi <b>ATAS</b> area kurva (Y maksimum)</> },
              { step: 3, teks: <>Klik tepi <b>BAWAH</b> area kurva (Y minimum)</> },
            ].map((l) => (
              <div
                key={l.step}
                className={`tk-kalibrasi-langkah${kalStep === l.step ? " aktif" : ""}${
                  kalPx[l.step] !== null ? " selesai" : ""
                }`}
                data-kal-step={l.step}
              >
                <span className="nomor">{l.step + 1}</span>
                <span>{l.teks}</span>
                <span className="nilai-px">{kalPx[l.step] !== null ? `${kalPx[l.step]} px` : "\u2014"}</span>
              </div>
            ))}
            <div className="tk-kalibrasi-aksi">
              <button className="tk-kalibrasi-btn mulai" id="tkKalMulai" type="button" onClick={mulaiKalibrasi}>
                ▶️ Mulai klik titik
              </button>
              <button className="tk-kalibrasi-btn reset" id="tkKalReset" type="button" onClick={resetKalibrasi}>
                ↺ Reset
              </button>
            </div>
            <div className={`tk-kalibrasi-output${kalOutput ? " tampil" : ""}`} id="tkKalOutput">
              {kalOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Materi interpretasi CDC — teks disalin persis dari v17. */
function MateriCdcWaterlow() {
  return (
    <div className="tk-cdc-materi">
      <div className="tk-cdc-materi-title">📚 Materi interpretasi CDC — % median / Waterlow</div>
      <p>
        <strong>BB/TB (Berat Badan menurut Tinggi Badan)</strong> mencerminkan proporsi tubuh dan status gizi saat
        ini. Indeks ini berguna untuk membedakan <em>wasting</em> (kurus akibat malnutrisi akut) dan <em>stunting</em>{" "}
        (perawakan pendek akibat gangguan pertumbuhan kronis).
      </p>
      <div className="tk-cdc-grid-kriteria">
        <div className="tk-cdc-kriteria-box">
          <strong>BB/U</strong>
          <ul>
            <li>&lt;60%: Gizi buruk</li>
            <li>60–80%: Gizi kurang</li>
            <li>80–120%: Gizi baik</li>
          </ul>
        </div>
        <div className="tk-cdc-kriteria-box">
          <strong>TB/U</strong>
          <ul>
            <li>&lt;70%: Tinggi badan sangat kurang</li>
            <li>70–90%: Tinggi badan kurang</li>
            <li>90–110%: Tinggi badan normal/baik</li>
          </ul>
        </div>
        <div className="tk-cdc-kriteria-box">
          <strong>BB/TB</strong>
          <ul>
            <li>&lt;70%: Gizi buruk</li>
            <li>70–90%: Gizi kurang</li>
            <li>90–110%: Gizi baik</li>
            <li>110–120%: Gizi lebih / overweight</li>
            <li>&gt;120%: Obesitas</li>
          </ul>
        </div>
      </div>
      <div className="tk-cdc-materi-note">
        Catatan: BB/TB merupakan indeks yang baik untuk menilai status gizi saat ini karena menggambarkan proporsi
        tubuh. Gunakan bersama tren pertumbuhan dan kondisi klinis pasien.
      </div>
    </div>
  );
}

/** Materi interpretasi WHO — teks disalin persis dari v17. */
function MateriWhoZscore() {
  return (
    <div className="tk-cdc-materi">
      <div className="tk-cdc-materi-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IkonBook /> <span>Materi interpretasi WHO — Z-score</span>
      </div>
      <p>
        <strong>Z-score</strong> menyatakan posisi nilai anak terhadap median populasi rujukan WHO dalam satuan simpang
        baku (SD). Rentang −2 SD s/d +1 SD umumnya tergolong normal. Interpretasikan bersama tren pertumbuhan dan
        kondisi klinis, bukan dari satu kali pengukuran saja.
      </p>
      <div className="tk-cdc-grid-kriteria">
        <div className="tk-cdc-kriteria-box">
          <strong>BB/U — Berat Badan menurut Umur</strong>
          <ul>
            <li>&lt; −3 SD: Berat badan sangat kurang</li>
            <li>−3 s/d &lt; −2 SD: Berat badan kurang</li>
            <li>−2 s/d +2 SD: Berat badan normal</li>
            <li>&gt; +2 SD: Berat badan lebih*</li>
          </ul>
        </div>
        <div className="tk-cdc-kriteria-box">
          <strong>TB/U — Tinggi/Panjang Badan menurut Umur</strong>
          <ul>
            <li>&lt; −3 SD: Sangat pendek (severely stunted)</li>
            <li>−3 s/d &lt; −2 SD: Pendek (stunted)</li>
            <li>−2 s/d +3 SD: Normal</li>
            <li>&gt; +3 SD: Tinggi</li>
          </ul>
        </div>
        <div className="tk-cdc-kriteria-box">
          <strong>IMT/U — Indeks Massa Tubuh menurut Umur</strong>
          <ul>
            <li>&lt; −3 SD: Gizi buruk (severely wasted)</li>
            <li>−3 s/d &lt; −2 SD: Gizi kurang (wasted)</li>
            <li>−2 s/d +1 SD: Gizi baik (normal)</li>
            <li>&gt; +1 s/d +2 SD: Berisiko gizi lebih</li>
            <li>&gt; +2 s/d +3 SD: Gizi lebih (overweight)</li>
            <li>&gt; +3 SD: Obesitas</li>
          </ul>
        </div>
        <div className="tk-cdc-kriteria-box">
          <strong>BB/PB &amp; BB/TB — Berat Badan menurut Panjang/Tinggi Badan</strong>
          <ul>
            <li>&lt; −3 SD: Gizi buruk (severely wasted)</li>
            <li>−3 s/d &lt; −2 SD: Gizi kurang (wasted)</li>
            <li>−2 s/d +1 SD: Gizi baik (normal)</li>
            <li>&gt; +1 s/d +2 SD: Berisiko gizi lebih</li>
            <li>&gt; +2 s/d +3 SD: Gizi lebih (overweight)</li>
            <li>&gt; +3 SD: Obesitas</li>
          </ul>
        </div>
      </div>
      <div className="tk-cdc-materi-note">
        *Pada BB/U, anak dengan z &gt; +2 SD sebaiknya dikonfirmasi memakai IMT/U atau BB/TB, karena BB/U saja tidak
        membedakan proporsi tubuh. Ambang BB/PB dan BB/TB memang sama dengan IMT/U pada standar ini. Pilih
        <strong> BB/PB</strong> bila anak diukur telentang (lazimnya usia &lt; 24 bulan) dan <strong>BB/TB</strong> bila
        diukur berdiri (lazimnya ≥ 24 bulan) — yang menentukan adalah cara pengukuran, bukan usianya, karena
        panjang telentang rata-rata sekitar 0,7 cm lebih besar daripada tinggi berdiri. Referensi: WHO Child Growth
        Standards (2006) &amp; Peraturan Menteri Kesehatan RI No. 2 Tahun 2020 tentang Standar Antropometri Anak.
      </div>
    </div>
  );
}
