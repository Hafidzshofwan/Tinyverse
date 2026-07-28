import { describe, it, expect } from "vitest";
import {
  tkInterpolasiZscoreRow,
  tkHitungZscoreNumerik,
  hitungIMT,
  type ZscoreTable,
  type ZscoreRow,
} from "./zscore";

/**
 * Ambil satu baris tabel golden dengan penjagaan eksplisit.
 *
 * WHY: `noUncheckedIndexedAccess` membuat `TABEL[0]` bertipe `ZscoreRow |
 * undefined`. Kami TIDAK memakai non-null assertion (`!`) di sini karena bila
 * suatu saat baris golden terhapus, test akan gagal dengan pesan samar
 * ("cannot read property of undefined") alih-alih menunjuk usia yang hilang.
 */
function baris(table: ZscoreTable, usiaBulan: number): ZscoreRow {
  const row = table[usiaBulan];
  if (!row) throw new Error(`Baris golden usia ${usiaBulan} bln tidak ada di tabel uji`);
  return row;
}

// Golden vectors dari WHO BB/U laki-laki 0-60 bln (potongan awal, sama persis v17).
const WHO_BBU_MALE: ZscoreTable = {
  0: [2.1, 2.5, 3.0, 3.3, 3.9, 4.4, 5.0],
  1: [2.9, 3.4, 3.9, 4.5, 5.1, 5.8, 6.6],
};

describe("tkHitungZscoreNumerik (garis SD)", () => {
  const row = baris(WHO_BBU_MALE, 0);
  it("tepat di median -> z = 0", () => {
    expect(tkHitungZscoreNumerik(row, 3.3)).toBeCloseTo(0, 6);
  });
  it("tepat di -3 SD -> z = -3", () => {
    expect(tkHitungZscoreNumerik(row, 2.1)).toBeCloseTo(-3, 6);
  });
  it("tepat di +3 SD -> z = 3", () => {
    expect(tkHitungZscoreNumerik(row, 5.0)).toBeCloseTo(3, 6);
  });
  it("pertengahan median..+1 SD -> z = 0,5", () => {
    expect(tkHitungZscoreNumerik(row, 3.6)).toBeCloseTo(0.5, 6);
  });
  it("di bawah -3 SD -> ekstrapolasi negatif", () => {
    // interval = 2.5 - 2.1 = 0.4 ; z = -3 + (1.8 - 2.1)/0.4 = -3.75
    expect(tkHitungZscoreNumerik(row, 1.8)).toBeCloseTo(-3.75, 6);
  });
  it("di atas +3 SD -> ekstrapolasi positif", () => {
    // interval = 5.0 - 4.4 = 0.6 ; z = 3 + (5.6 - 5.0)/0.6 = 4
    expect(tkHitungZscoreNumerik(row, 5.6)).toBeCloseTo(4, 6);
  });
});

describe("tkInterpolasiZscoreRow (usia pecahan)", () => {
  it("usia bulat -> baris apa adanya", () => {
    expect(tkInterpolasiZscoreRow(WHO_BBU_MALE, 1)).toEqual(baris(WHO_BBU_MALE, 1));
  });
  it("usia 0,5 bln -> rata-rata dua baris", () => {
    const r = tkInterpolasiZscoreRow(WHO_BBU_MALE, 0.5);
    expect(r).not.toBeNull();
    expect(r?.[0]).toBeCloseTo(2.5, 6);
    expect(r?.[3]).toBeCloseTo(3.9, 6);
    expect(r?.[6]).toBeCloseTo(5.8, 6);
  });
  it("usia di luar tabel -> null", () => {
    expect(tkInterpolasiZscoreRow(WHO_BBU_MALE, 5)).toBeNull();
  });
});

// Golden vectors WHO IMT/U (BMI-for-age) laki-laki, baris tervalidasi via LMS.
const WHO_IMTU_MALE: ZscoreTable = {
  0: [10.2, 11.1, 12.2, 13.4, 14.8, 16.3, 18.1],
  24: [12.9, 13.8, 14.8, 16.0, 17.3, 18.9, 20.6],
  60: [12.0, 12.9, 14.0, 15.2, 16.6, 18.3, 20.3],
};

describe("IMT/U z-score (garis SD WHO)", () => {
  it("lahir: tepat di median -> z = 0", () => {
    expect(tkHitungZscoreNumerik(baris(WHO_IMTU_MALE, 0), 13.4)).toBeCloseTo(0, 6);
  });
  it("lahir: tepat di -3 SD -> z = -3 (gizi buruk)", () => {
    expect(tkHitungZscoreNumerik(baris(WHO_IMTU_MALE, 0), 10.2)).toBeCloseTo(-3, 6);
  });
  it("lahir: tepat di +3 SD -> z = 3 (obesitas)", () => {
    expect(tkHitungZscoreNumerik(baris(WHO_IMTU_MALE, 0), 18.1)).toBeCloseTo(3, 6);
  });
  it("24 bln: pertengahan median..+1 SD -> z = 0,5", () => {
    // median 16.0, +1 SD 17.3 ; nilai 16.65 -> z = 0,5
    expect(tkHitungZscoreNumerik(baris(WHO_IMTU_MALE, 24), 16.65)).toBeCloseTo(0.5, 6);
  });
  it("60 bln: tepat di -2 SD -> z = -2 (gizi kurang)", () => {
    expect(tkHitungZscoreNumerik(baris(WHO_IMTU_MALE, 60), 12.9)).toBeCloseTo(-2, 6);
  });
});

describe("hitungIMT (BB & TB -> IMT)", () => {
  it("BB 16 kg, TB 100 cm -> 16,0", () => {
    expect(hitungIMT(16, 100)).toBe(16.0);
  });
  it("BB 12,5 kg, TB 90 cm -> 15,4 (1 desimal)", () => {
    expect(hitungIMT(12.5, 90)).toBe(15.4);
  });
  it("TB 0 atau tak valid -> null", () => {
    expect(hitungIMT(16, 0)).toBeNull();
    expect(hitungIMT(NaN, 100)).toBeNull();
  });
});
