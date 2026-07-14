import { describe, it, expect } from "vitest";
import { tkInterpolasiZscoreRow, tkHitungZscoreNumerik, type ZscoreTable } from "./zscore";

// Golden vectors dari WHO BB/U laki-laki 0-60 bln (potongan awal, sama persis v17).
const WHO_BBU_MALE: ZscoreTable = {
  0: [2.1, 2.5, 3.0, 3.3, 3.9, 4.4, 5.0],
  1: [2.9, 3.4, 3.9, 4.5, 5.1, 5.8, 6.6],
};

describe("tkHitungZscoreNumerik (garis SD)", () => {
  const row = WHO_BBU_MALE[0];
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
    expect(tkInterpolasiZscoreRow(WHO_BBU_MALE, 1)).toEqual(WHO_BBU_MALE[1]);
  });
  it("usia 0,5 bln -> rata-rata dua baris", () => {
    const r = tkInterpolasiZscoreRow(WHO_BBU_MALE, 0.5)!;
    expect(r[0]).toBeCloseTo(2.5, 6);
    expect(r[3]).toBeCloseTo(3.9, 6);
    expect(r[6]).toBeCloseTo(5.8, 6);
  });
  it("usia di luar tabel -> null", () => {
    expect(tkInterpolasiZscoreRow(WHO_BBU_MALE, 5)).toBeNull();
  });
});
