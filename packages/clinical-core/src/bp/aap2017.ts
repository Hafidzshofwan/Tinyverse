/**
 * Mesin klasifikasi tekanan darah anak dan remaja menurut AAP 2017.
 *
 * Referensi tunggal: Flynn JT, Kaelber DC, Baker-Smith CM, dkk. Clinical
 * Practice Guideline for Screening and Management of High Blood Pressure in
 * Children and Adolescents. Pediatrics. 2017;140(3):e20171904.
 * Table 3 (definisi kategori), Table 4/5 (ambang per usia dan persentil
 * tinggi), Table 7 (teknik pengukuran).
 *
 * Table 6 sengaja TIDAK dipakai untuk klasifikasi. Table 6 hanya nilai skrining
 * yang menandakan perlunya evaluasi lanjutan.
 */

import {
  AAP2017_BP_ROWS,
  AAP_ADOLESCENT_AGE,
  AAP_TABLE_MAX_AGE,
  AAP_TABLE_MIN_AGE,
  HEIGHT_PERCENTILES,
  type BPThresholdRow,
  type HeightPercentile,
  type Sex,
} from "./aap2017-data";

export type { HeightPercentile, Sex, BPThresholdRow };

export type BPMethod = "auskultasi" | "osilometrik";
export type BPReadingCount = "tunggal" | "rerata";

export type BPCategory = "normal" | "elevated" | "stage1" | "stage2";

/** Istilah yang dipakai di UI. Sengaja memakai kata "range", bukan diagnosis. */
export const BP_CATEGORY_LABEL: Record<BPCategory, string> = {
  normal: "Normal",
  elevated: "Elevated BP",
  stage1: "Stage 1 HTN range",
  stage2: "Stage 2 HTN range",
};

const URUTAN_KATEGORI: Record<BPCategory, number> = {
  normal: 0,
  elevated: 1,
  stage1: 2,
  stage2: 3,
};

/** Ambang absolut Table 3 untuk usia >= 13 tahun. */
export const AAP_ABSOLUTE_CUTOFF = {
  sbp: { elevated: 120, stage1: 130, stage2: 140 },
  dbp: { elevated: 80, stage1: 80, stage2: 90 },
} as const;

/** Batas krisis hipertensi pada remaja menurut AAP 2017. */
export const AAP_CRISIS_ADOLESCENT = { sbp: 180, dbp: 120 } as const;

/** Selisih di atas P95 yang menandakan perlu evaluasi segera. */
export const AAP_URGENT_ABOVE_P95 = 30;

export type BPInput = {
  ageYears: number;
  ageMonths?: number;
  sex: Sex;
  heightCm: number;
  sbp: number;
  dbp: number;
  weightKg?: number;
  method?: BPMethod;
  readingCount?: BPReadingCount;
  symptomatic?: boolean;
};

export type BPValidation = {
  valid: boolean;
  errors: string[];
  ageInYears: number;
};

/**
 * Validasi input. Rentang sengaja longgar tetapi masih fisiologis, supaya salah
 * ketik tertangkap tanpa menolak pasien yang memang ekstrem.
 */
export function validateBPInput(input: BPInput): BPValidation {
  const errors: string[] = [];
  const tahun = Number(input.ageYears);
  const bulan = Number(input.ageMonths ?? 0);

  if (!Number.isFinite(tahun) || tahun < 0) {
    errors.push("Usia dalam tahun belum diisi dengan benar.");
  }
  if (!Number.isFinite(bulan) || bulan < 0 || bulan > 11) {
    errors.push("Usia dalam bulan harus berada di antara 0 sampai 11.");
  }
  if (input.sex !== "male" && input.sex !== "female") {
    errors.push("Jenis kelamin belum dipilih.");
  }
  if (!Number.isFinite(input.heightCm) || input.heightCm < 40 || input.heightCm > 220) {
    errors.push("Tinggi badan harus berada di antara 40 sampai 220 cm.");
  }
  if (!Number.isFinite(input.sbp) || input.sbp < 40 || input.sbp > 300) {
    errors.push("Tekanan sistolik harus berada di antara 40 sampai 300 mmHg.");
  }
  if (!Number.isFinite(input.dbp) || input.dbp < 20 || input.dbp > 200) {
    errors.push("Tekanan diastolik harus berada di antara 20 sampai 200 mmHg.");
  }
  if (
    Number.isFinite(input.sbp) &&
    Number.isFinite(input.dbp) &&
    input.sbp <= input.dbp
  ) {
    errors.push("Tekanan sistolik harus lebih tinggi daripada diastolik.");
  }
  if (
    input.weightKg !== undefined &&
    (!Number.isFinite(input.weightKg) || input.weightKg <= 0 || input.weightKg > 250)
  ) {
    errors.push("Berat badan harus berada di antara 0 sampai 250 kg.");
  }

  const ageInYears =
    Number.isFinite(tahun) && Number.isFinite(bulan) ? tahun + bulan / 12 : NaN;

  return { valid: errors.length === 0, errors, ageInYears };
}

function cariBaris(age: number, sex: Sex): BPThresholdRow | null {
  const usia = Math.min(Math.max(Math.floor(age), AAP_TABLE_MIN_AGE), AAP_TABLE_MAX_AGE);
  const baris = AAP2017_BP_ROWS.find((r) => r.age === usia && r.sex === sex);
  return baris ?? null;
}

export type HeightPercentileResult = {
  percentile: HeightPercentile;
  measuredHeightCm: number;
  outOfRange: "below" | "above" | null;
  note: string | null;
};

/**
 * Memilih kolom persentil tinggi terdekat pada Table 4/5.
 *
 * WHY terdekat, bukan interpolasi: Table 4/5 adalah tabel kolom diskret. AAP
 * tidak menyediakan rumus interpolasi antar kolom, jadi memilih kolom terdekat
 * adalah pembacaan tabel yang paling jujur.
 */
export function findNearestHeightPercentile(
  age: number,
  sex: Sex,
  heightCm: number,
): HeightPercentileResult | null {
  const baris = cariBaris(age, sex);
  if (!baris) return null;

  const terkecil = baris.heightsCm[5];
  const terbesar = baris.heightsCm[95];

  if (heightCm < terkecil) {
    return {
      percentile: 5,
      measuredHeightCm: terkecil,
      outOfRange: "below",
      note: "Tinggi di bawah rentang tabel. Kolom persentil ke-5 dipakai sebagai pendekatan.",
    };
  }
  if (heightCm > terbesar) {
    return {
      percentile: 95,
      measuredHeightCm: terbesar,
      outOfRange: "above",
      note: "Tinggi di atas rentang tabel. Kolom persentil ke-95 dipakai sebagai pendekatan.",
    };
  }

  let pilihan: HeightPercentile = 5;
  let selisih = Number.POSITIVE_INFINITY;
  for (const p of HEIGHT_PERCENTILES) {
    const jarak = Math.abs(baris.heightsCm[p] - heightCm);
    if (jarak < selisih) {
      selisih = jarak;
      pilihan = p;
    }
  }

  return {
    percentile: pilihan,
    measuredHeightCm: baris.heightsCm[pilihan],
    outOfRange: null,
    note: null,
  };
}

export type BPThresholds = {
  sbpP50: number;
  sbpP90: number;
  sbpP95: number;
  sbpP95plus12: number;
  dbpP50: number;
  dbpP90: number;
  dbpP95: number;
  dbpP95plus12: number;
};

export function getAAPBPThresholds(
  age: number,
  sex: Sex,
  heightPercentile: HeightPercentile,
): BPThresholds | null {
  const baris = cariBaris(age, sex);
  if (!baris) return null;
  return {
    sbpP50: baris.sbp.p50[heightPercentile],
    sbpP90: baris.sbp.p90[heightPercentile],
    sbpP95: baris.sbp.p95[heightPercentile],
    sbpP95plus12: baris.sbp.p95plus12[heightPercentile],
    dbpP50: baris.dbp.p50[heightPercentile],
    dbpP90: baris.dbp.p90[heightPercentile],
    dbpP95: baris.dbp.p95[heightPercentile],
    dbpP95plus12: baris.dbp.p95plus12[heightPercentile],
  };
}

export type ComponentCutoff = { elevated: number; stage1: number; stage2: number };

export type BPClassification = {
  sbpCategory: BPCategory;
  dbpCategory: BPCategory;
  finalCategory: BPCategory;
  determinedBy: Array<"sbp" | "dbp">;
  sbpCutoff: ComponentCutoff;
  dbpCutoff: ComponentCutoff;
};

function kategoriKomponen(nilai: number, batas: ComponentCutoff): BPCategory {
  if (nilai >= batas.stage2) return "stage2";
  if (nilai >= batas.stage1) return "stage1";
  if (nilai >= batas.elevated) return "elevated";
  return "normal";
}

function gabung(
  sbp: number,
  dbp: number,
  sbpCutoff: ComponentCutoff,
  dbpCutoff: ComponentCutoff,
): BPClassification {
  const sbpCategory = kategoriKomponen(sbp, sbpCutoff);
  const dbpCategory = kategoriKomponen(dbp, dbpCutoff);
  const finalCategory =
    URUTAN_KATEGORI[sbpCategory] >= URUTAN_KATEGORI[dbpCategory]
      ? sbpCategory
      : dbpCategory;
  const determinedBy: Array<"sbp" | "dbp"> = [];
  if (sbpCategory === finalCategory) determinedBy.push("sbp");
  if (dbpCategory === finalCategory) determinedBy.push("dbp");
  return { sbpCategory, dbpCategory, finalCategory, determinedBy, sbpCutoff, dbpCutoff };
}

/**
 * Usia 1 sampai <13 tahun.
 *
 * WHY memakai Math.min terhadap ambang absolut: Table 3 AAP 2017 meminta
 * "whichever is lower" antara ambang persentil dan angka absolut 120/80,
 * 130/80, serta 140/90. Pada anak besar yang tinggi, ambang persentil bisa
 * melewati angka dewasa, dan aturan ini mencegah hasil yang terlalu longgar.
 */
export function classifyBPUnder13(
  sbp: number,
  dbp: number,
  thresholds: BPThresholds,
): BPClassification {
  const sbpCutoff: ComponentCutoff = {
    elevated: Math.min(thresholds.sbpP90, AAP_ABSOLUTE_CUTOFF.sbp.elevated),
    stage1: Math.min(thresholds.sbpP95, AAP_ABSOLUTE_CUTOFF.sbp.stage1),
    stage2: Math.min(thresholds.sbpP95plus12, AAP_ABSOLUTE_CUTOFF.sbp.stage2),
  };
  const dbpCutoff: ComponentCutoff = {
    elevated: Math.min(thresholds.dbpP90, AAP_ABSOLUTE_CUTOFF.dbp.elevated),
    stage1: Math.min(thresholds.dbpP95, AAP_ABSOLUTE_CUTOFF.dbp.stage1),
    stage2: Math.min(thresholds.dbpP95plus12, AAP_ABSOLUTE_CUTOFF.dbp.stage2),
  };
  return gabung(sbp, dbp, sbpCutoff, dbpCutoff);
}

/** Usia >= 13 tahun: ambang absolut Table 3, tanpa persentil tinggi. */
export function classifyBPAge13Plus(sbp: number, dbp: number): BPClassification {
  return gabung(
    sbp,
    dbp,
    { ...AAP_ABSOLUTE_CUTOFF.sbp },
    { ...AAP_ABSOLUTE_CUTOFF.dbp },
  );
}

/*
 * Tindak lanjut AAP 2017 bukan satu kalimat, melainkan alur bertingkat:
 * tindakan awal, jadwal cek ulang dengan auskultasi, lalu percabangan bila
 * kategori yang sama masih bertahan pada kunjungan berikutnya. Struktur ini
 * dibuat menyerupai pedoman supaya tidak ada tahapan yang hilang saat
 * ditampilkan. Medan `teks` dipertahankan sebagai ringkasan satu kalimat agar
 * pemanggil lama tetap berjalan.
 */
export type FollowUp = {
  teks: string;
  segera: boolean;
  /** Jadwal pengukuran ulang. Null bila tindakan harus segera. */
  cekUlang: string | null;
  /** Percabangan bila kategori bertahan pada kunjungan berikutnya. */
  lanjutan: string[];
  /** Pembatasan aktivitas terkait LVH dan olahraga kompetitif. */
  catatanAktivitas: string | null;
};

export const AAP_CATATAN_OLAHRAGA =
  "Pasien dengan bukti hipertrofi ventrikel kiri (LVH) tidak boleh mengikuti olahraga kompetitif sampai tekanan darah kembali normal dengan terapi. Atlet dengan hipertensi Stage 2, sekalipun tanpa bukti kerusakan organ target, tidak boleh mengikuti olahraga kompetitif sampai hipertensi terkendali dengan modifikasi gaya hidup atau terapi farmakologis.";

export function getAAPFollowUpRecommendation(
  category: BPCategory,
  age: number,
  symptoms = false,
): FollowUp {
  if (symptoms) {
    return {
      teks: "Ada gejala yang menyertai. Lakukan evaluasi medis segera, pertimbangkan rujukan ke instalasi gawat darurat.",
      segera: true,
      cekUlang: null,
      lanjutan: [],
      catatanAktivitas: null,
    };
  }
  if (category === "stage2") {
    return {
      teks: "Bila tanpa gejala, mulai intervensi gaya hidup: pengaturan gizi, tidur cukup, dan aktivitas fisik.",
      segera: false,
      cekUlang:
        "Ulangi pengukuran dengan auskultasi dalam 1 minggu, atau rujuk langsung ke subspesialis dalam 1 minggu.",
      lanjutan: [
        "Bila masih Stage 2 pada 1 minggu, ukur tekanan darah ekstremitas atas dan bawah, lakukan ABPM (pemantauan tekanan darah ambulatorik 24 jam) beserta evaluasi diagnostik, lalu mulai terapi, atau rujuk ke layanan subspesialis dalam 1 minggu.",
      ],
      catatanAktivitas: AAP_CATATAN_OLAHRAGA,
    };
  }
  if (category === "stage1") {
    return {
      teks: "Bila tanpa gejala, mulai intervensi gaya hidup: pengaturan gizi, tidur cukup, dan aktivitas fisik.",
      segera: false,
      cekUlang: "Ulangi pengukuran dengan auskultasi dalam 1 sampai 2 minggu.",
      lanjutan: [
        "Bila masih Stage 1 pada 1 sampai 2 minggu, ukur tekanan darah ekstremitas atas dan bawah, lalu periksa ulang dengan auskultasi dalam 3 bulan, dengan pertimbangan rujukan gizi atau tata laksana berat badan.",
        "Bila tetap Stage 1 setelah 3 kunjungan, lakukan ABPM beserta evaluasi diagnostik, mulai terapi, dan pertimbangkan rujukan subspesialis.",
      ],
      catatanAktivitas: AAP_CATATAN_OLAHRAGA,
    };
  }
  if (category === "elevated") {
    return {
      teks: "Mulai intervensi gaya hidup: pengaturan gizi, tidur cukup, dan aktivitas fisik.",
      segera: false,
      cekUlang: "Ulangi pengukuran dengan auskultasi dalam 6 bulan.",
      lanjutan: [
        "Bila masih Elevated pada 6 bulan, ukur tekanan darah ekstremitas atas dan bawah, lalu ulangi tata laksana gaya hidup.",
        "Bila masih Elevated 12 bulan sejak pengukuran awal, lakukan ABPM beserta evaluasi diagnostik, dan pertimbangkan rujukan subspesialis.",
      ],
      catatanAktivitas: null,
    };
  }
  return {
    teks: "Tidak diperlukan tindakan tambahan.",
    segera: false,
    cekUlang:
      age >= AAP_ADOLESCENT_AGE
        ? "Ulangi pengukuran pada kunjungan rutin berikutnya."
        : "Ulangi pengukuran pada kunjungan rutin berikutnya, sesuai jadwal pemantauan anak sehat.",
    lanjutan: [],
    catatanAktivitas: null,
  };
}

export type BPResultOk = {
  status: "ok";
  ageYearsUsed: number;
  usesHeightPercentile: boolean;
  heightPercentile: HeightPercentileResult | null;
  thresholds: BPThresholds | null;
  classification: BPClassification;
  followUp: FollowUp;
  urgent: boolean;
  needsAuscultationConfirmation: boolean;
  notes: string[];
  input: BPInput;
};

export type BPResult =
  | BPResultOk
  | { status: "invalid"; errors: string[] }
  | { status: "unsupported-infant"; message: string }
  | { status: "unsupported-adult"; message: string }
  | { status: "no-data"; message: string };

export function evaluateBP(input: BPInput): BPResult {
  const validasi = validateBPInput(input);
  if (!validasi.valid) {
    return { status: "invalid", errors: validasi.errors };
  }

  const usia = validasi.ageInYears;

  if (usia < AAP_TABLE_MIN_AGE) {
    return {
      status: "unsupported-infant",
      message:
        "Kalkulator ini belum mendukung neonatus dan bayi di bawah 1 tahun. AAP 2017 menyatakan kelompok usia tersebut memerlukan referensi tekanan darah neonatal atau bayi tersendiri.",
    };
  }
  if (usia > AAP_TABLE_MAX_AGE + 1 - 1e-9) {
    return {
      status: "unsupported-adult",
      message:
        "Usia sudah di luar cakupan pedoman anak. Gunakan klasifikasi tekanan darah dewasa.",
    };
  }

  const remaja = usia >= AAP_ADOLESCENT_AGE;
  const notes: string[] = [];
  let heightPercentile: HeightPercentileResult | null = null;
  let thresholds: BPThresholds | null = null;
  let classification: BPClassification;

  if (remaja) {
    classification = classifyBPAge13Plus(input.sbp, input.dbp);
    notes.push(
      "Usia 13 tahun ke atas diklasifikasikan dengan ambang absolut Table 3 AAP 2017, tanpa persentil tinggi.",
    );
    // Ambang persentil tetap ditampilkan sebagai pembanding, bukan penentu.
    heightPercentile = findNearestHeightPercentile(usia, input.sex, input.heightCm);
    if (heightPercentile) {
      thresholds = getAAPBPThresholds(usia, input.sex, heightPercentile.percentile);
    }
  } else {
    heightPercentile = findNearestHeightPercentile(usia, input.sex, input.heightCm);
    if (!heightPercentile) {
      return {
        status: "no-data",
        message: "Data Table 4 atau Table 5 untuk usia dan jenis kelamin ini tidak ditemukan.",
      };
    }
    thresholds = getAAPBPThresholds(usia, input.sex, heightPercentile.percentile);
    if (!thresholds) {
      return {
        status: "no-data",
        message: "Ambang tekanan darah untuk kombinasi ini tidak ditemukan.",
      };
    }
    if (heightPercentile.note) notes.push(heightPercentile.note);
    classification = classifyBPUnder13(input.sbp, input.dbp, thresholds);
  }

  const kategori = classification.finalCategory;

  const lewatP95 =
    thresholds !== null &&
    !remaja &&
    (input.sbp - thresholds.sbpP95 > AAP_URGENT_ABOVE_P95 ||
      input.dbp - thresholds.dbpP95 > AAP_URGENT_ABOVE_P95);
  const krisisRemaja =
    remaja &&
    (input.sbp > AAP_CRISIS_ADOLESCENT.sbp || input.dbp > AAP_CRISIS_ADOLESCENT.dbp);
  const bergejala = input.symptomatic === true;

  const followUp = getAAPFollowUpRecommendation(
    kategori,
    usia,
    bergejala || lewatP95 || krisisRemaja,
  );
  const urgent = followUp.segera;

  if (lewatP95) {
    notes.push(
      "Nilai tekanan darah lebih dari 30 mmHg di atas persentil ke-95. AAP menganjurkan evaluasi segera.",
    );
  }
  if (krisisRemaja) {
    notes.push(
      "Tekanan darah remaja melewati 180/120 mmHg. AAP menganjurkan evaluasi segera.",
    );
  }

  const needsAuscultationConfirmation =
    input.method === "osilometrik" && kategori !== "normal";
  if (needsAuscultationConfirmation) {
    notes.push(
      "Pengukuran memakai alat digital (osilometrik). Hasil di atas normal perlu dikonfirmasi dengan auskultasi manual.",
    );
  }
  if (input.readingCount === "tunggal" && kategori !== "normal") {
    notes.push(
      "Hasil berasal dari satu kali pengukuran. AAP menganjurkan merata-ratakan beberapa pengukuran pada kunjungan yang sama.",
    );
  }

  return {
    status: "ok",
    ageYearsUsed: Math.floor(usia),
    usesHeightPercentile: !remaja,
    heightPercentile,
    thresholds,
    classification,
    followUp,
    urgent,
    needsAuscultationConfirmation,
    notes,
    input,
  };
}

const NAMA_KELAMIN: Record<Sex, string> = {
  male: "anak laki-laki",
  female: "anak perempuan",
};

function sebutKomponen(k: Array<"sbp" | "dbp">): string {
  if (k.length === 2) return "SBP dan DBP";
  return k[0] === "dbp" ? "DBP" : "SBP";
}

export function generateIndonesianExplanation(result: BPResultOk): string {
  const { input, classification, thresholds, heightPercentile } = result;
  const kategori = BP_CATEGORY_LABEL[classification.finalCategory];
  const bagian: string[] = [];

  bagian.push(
    `Pembacaan tekanan darah ${input.sbp}/${input.dbp} mmHg pada ${
      NAMA_KELAMIN[input.sex]
    } usia ${result.ageYearsUsed} tahun dengan tinggi ${input.heightCm} cm berada pada kategori ${kategori} berdasarkan AAP 2017.`,
  );

  if (result.usesHeightPercentile && thresholds && heightPercentile) {
    bagian.push(
      `Klasifikasi memakai kolom persentil tinggi ke-${heightPercentile.percentile} pada tabel usia ${result.ageYearsUsed} tahun, dengan ambang SBP P90 ${thresholds.sbpP90}, P95 ${thresholds.sbpP95}, dan P95 + 12 sebesar ${thresholds.sbpP95plus12} mmHg, serta ambang DBP P90 ${thresholds.dbpP90}, P95 ${thresholds.dbpP95}, dan P95 + 12 sebesar ${thresholds.dbpP95plus12} mmHg.`,
    );
  } else {
    bagian.push(
      "Untuk usia 13 tahun ke atas, AAP 2017 memakai ambang absolut Table 3, yaitu 120/80, 130/80, dan 140/90 mmHg.",
    );
  }

  if (classification.finalCategory === "normal") {
    bagian.push("Nilai SBP maupun DBP berada di bawah ambang kategori berikutnya.");
  } else {
    bagian.push(
      `Kategori akhir ditentukan oleh ${sebutKomponen(
        classification.determinedBy,
      )}, yaitu komponen dengan rentang tekanan darah paling berat.`,
    );
  }

  bagian.push(
    "Hasil ini bukan diagnosis final. Diagnosis hipertensi pada anak memerlukan pembacaan auskultasi yang terkonfirmasi pada 3 kunjungan berbeda serta evaluasi tenaga kesehatan.",
  );

  if (result.needsAuscultationConfirmation) {
    bagian.push(
      "Karena pengukuran memakai alat digital, konfirmasi dengan auskultasi manual dianjurkan.",
    );
  }

  bagian.push(`Tindak lanjut: ${result.followUp.teks}`);
  if (result.followUp.cekUlang) bagian.push(result.followUp.cekUlang);
  for (const langkah of result.followUp.lanjutan) bagian.push(langkah);
  if (result.followUp.catatanAktivitas) bagian.push(result.followUp.catatanAktivitas);

  return bagian.join(" ");
}

/** Table 7 AAP 2017: praktik pengukuran tekanan darah yang dianjurkan. */
export const AAP_MEASUREMENT_CHECKLIST: ReadonlyArray<string> = [
  "Anak duduk tenang di ruangan yang tenang selama 3 sampai 5 menit sebelum pengukuran.",
  "Punggung tersangga.",
  "Kaki tidak menyilang dan menapak di lantai.",
  "Pengukuran dilakukan di lengan kanan.",
  "Lengan sejajar jantung, disangga, dan tidak tertutup pakaian.",
  "Pasien dan pemeriksa tidak berbicara selama pengukuran.",
  "Manset sesuai ukuran: panjang bladder 80 sampai 100 persen lingkar lengan, lebar minimal 40 persen.",
  "Pada auskultasi, Korotkoff fase I adalah SBP dan fase V adalah DBP.",
];

export const AAP_DISCLAIMER =
  "Kalkulator ini hanya untuk edukasi dan bantuan perhitungan berdasarkan AAP 2017. Hasil menunjukkan kategori pembacaan tekanan darah saat ini, bukan diagnosis final. Diagnosis hipertensi pada anak memerlukan pengukuran auskultasi terkonfirmasi pada 3 kunjungan berbeda dan evaluasi tenaga kesehatan.";
