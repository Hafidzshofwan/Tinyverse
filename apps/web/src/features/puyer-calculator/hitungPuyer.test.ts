import { describe, it, expect } from "vitest";
import { hitungPuyer } from "./hitungPuyer";

describe("hitungPuyer - golden vectors", () => {
  it("setengah tablet, 3x selama 5 hari -> 0,5 tablet/bungkus, 15 bungkus, 7,5 tablet", () => {
    const r = hitungPuyer({
      dosisPerKaliMg: 250,
      kekuatanTabletMg: 500,
      frekuensiPerHari: 3,
      jumlahHari: 5,
    });
    expect(r.tabletPerBungkus).toBe(0.5);
    expect(r.totalBungkus).toBe(15);
    expect(r.totalTablet).toBe(7.5);
    expect(r.peringatan).toHaveLength(0);
  });

  it("seperempat tablet -> total 3,75 tablet dengan peringatan kelipatan 0,5", () => {
    const r = hitungPuyer({
      dosisPerKaliMg: 125,
      kekuatanTabletMg: 500,
      frekuensiPerHari: 3,
      jumlahHari: 5,
    });
    expect(r.tabletPerBungkus).toBe(0.25);
    expect(r.totalBungkus).toBe(15);
    expect(r.totalTablet).toBe(3.75);
    expect(r.peringatan.length).toBeGreaterThan(0);
  });

  it("satu tablet penuh, 2x selama 3 hari -> 6 tablet", () => {
    const r = hitungPuyer({
      dosisPerKaliMg: 500,
      kekuatanTabletMg: 500,
      frekuensiPerHari: 2,
      jumlahHari: 3,
    });
    expect(r.tabletPerBungkus).toBe(1);
    expect(r.totalBungkus).toBe(6);
    expect(r.totalTablet).toBe(6);
    expect(r.peringatan).toHaveLength(0);
  });

  it("menolak kekuatan tablet 0", () => {
    expect(() =>
      hitungPuyer({
        dosisPerKaliMg: 100,
        kekuatanTabletMg: 0,
        frekuensiPerHari: 3,
        jumlahHari: 5,
      })
    ).toThrow();
  });

  it("menolak frekuensi bukan bilangan bulat", () => {
    expect(() =>
      hitungPuyer({
        dosisPerKaliMg: 100,
        kekuatanTabletMg: 500,
        frekuensiPerHari: 2.5,
        jumlahHari: 5,
      })
    ).toThrow();
  });
});
