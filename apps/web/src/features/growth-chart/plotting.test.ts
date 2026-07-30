import { describe, expect, it } from "vitest";
import { GROWTH_CHART_CONFIG } from "./chartConfig";
import { tkHitungKoordinatTitik, tkKalibrasiValid, tkTargetGarisHorizontal } from "./plotting";

/**
 * Uji "golden" posisi titik plotting.
 *
 * WHY: berkas ini adalah jaring pengaman posisi titik. Angka yang diharapkan
 * dihitung langsung dari angka kalibrasi terkini (mis. 230.59/1754 × 100),
 * hasil pengukuran gridline gambar chart WHO.
 * Bila suatu saat ada yang mengubah kalibrasi, gambar chart, atau rumus
 * pemetaan, uji ini gagal — sehingga pergeseran titik pasien ketahuan sebelum
 * sampai ke pengguna.
 */

const waBbu = GROWTH_CHART_CONFIG.who?.genders.male?.indicators.bbtbu?.charts.find((c) => c.id === "bbu");
const kalBbu = waBbu?.calibration.berat;

function kalibrasiBbu() {
  if (!kalBbu) throw new Error("Kalibrasi WHO laki-laki BB/U tidak ditemukan");
  return kalBbu;
}

describe("angka kalibrasi WHO laki-laki BB/U tidak berubah", () => {
  it("cocok persis dengan nilai v17", () => {
    expect(kalibrasiBbu()).toEqual({
      imgWidth: 1754,
      imgHeight: 1241,
      plot: { x0: 230.59, x1: 1489.87, y0: 249.63, y1: 1055.74 },
      xRange: [0, 60],
      yRange: [1, 29],
    });
  });
});

describe("tkHitungKoordinatTitik", () => {
  it("menempatkan nilai minimum tepat di sudut kiri-bawah area kurva", () => {
    const t = tkHitungKoordinatTitik(kalibrasiBbu(), 0, 1);
    expect(t.leftPercent).toBeCloseTo(13.1465, 3); // 230.59 / 1754
    expect(t.topPercent).toBeCloseTo(85.0717, 3); // 1055.74 / 1241
  });

  it("menempatkan nilai maksimum tepat di sudut kanan-atas area kurva", () => {
    const t = tkHitungKoordinatTitik(kalibrasiBbu(), 60, 29);
    expect(t.leftPercent).toBeCloseTo(84.9413, 3); // 1489.87 / 1754
    expect(t.topPercent).toBeCloseTo(20.1152, 3); // 249.63 / 1241
  });

  it("menempatkan nilai tengah tepat di tengah area kurva", () => {
    const t = tkHitungKoordinatTitik(kalibrasiBbu(), 30, 15);
    expect(t.leftPercent).toBeCloseTo(49.0439, 3);
    expect(t.topPercent).toBeCloseTo(52.5935, 3);
  });

  it("menjepit nilai di luar rentang ke tepi terdekat sambil menandainya", () => {
    const t = tkHitungKoordinatTitik(kalibrasiBbu(), 72, 40);
    expect(t.diLuarBatasX).toBe(true);
    expect(t.diLuarBatasY).toBe(true);
    expect(t.leftPercent).toBeCloseTo(84.9413, 3);
    expect(t.topPercent).toBeCloseTo(20.1152, 3);
  });

  it("memakai usiaLineY pada chart CDC untuk pangkal garis bantu vertikal", () => {
    const cdc = GROWTH_CHART_CONFIG.cdc?.genders.male?.indicators.bbtbu?.charts[0];
    const kal = cdc?.calibration.berat;
    expect(kal).toBeDefined();
    if (!kal) return;
    const t = tkHitungKoordinatTitik(kal, 120, 40);
    expect(t.sumbuUsiaPersen).toBeCloseTo(88.9158, 3); // 1467.11 / 1650
    // Pada chart BERAT CDC, baris tick bulan memang BERIMPIT dengan tepi bawah
    // area kurva: pengukuran gridline memberi plot.y1 = 1467.11 dan
    // usiaLineY = 1467.11. Jadi keduanya wajib sama, bukan berbeda.
    expect(t.sumbuBawahPersen).toBeCloseTo(88.9158, 3); // 1467.11 / 1650
  });

  it("membedakan baris tick bulan dari tepi bawah pada chart TINGGI CDC", () => {
    const cdc = GROWTH_CHART_CONFIG.cdc?.genders.male?.indicators.bbtbu?.charts[0];
    const kal = cdc?.calibration.tinggi;
    expect(kal).toBeDefined();
    if (!kal) return;
    const t = tkHitungKoordinatTitik(kal, 120, 150);
    expect(t.sumbuUsiaPersen).toBeCloseTo(88.9158, 3); // usiaLineY 1467.11 / 1650
    expect(t.sumbuBawahPersen).toBeCloseTo(73.6236, 3); // plot.y1 1214.79 / 1650
    expect(t.sumbuUsiaPersen).not.toBeCloseTo(t.sumbuBawahPersen, 3);
  });
});

describe("tkKalibrasiValid", () => {
  it("menerima kalibrasi bawaan", () => {
    expect(tkKalibrasiValid(kalibrasiBbu())).toBe(true);
  });

  it("menolak kalibrasi kosong atau berskala nol", () => {
    expect(tkKalibrasiValid(undefined)).toBe(false);
    expect(
      tkKalibrasiValid({
        imgWidth: 100,
        imgHeight: 100,
        plot: { x0: 10, x1: 10, y0: 0, y1: 50 },
        xRange: [0, 60],
        yRange: [1, 29],
      }),
    ).toBe(false);
  });
});

describe("tkTargetGarisHorizontal", () => {
  const titik = tkHitungKoordinatTitik(kalibrasiBbu(), 30, 15);

  it("menarik garis berat badan CDC ke sumbu kanan", () => {
    expect(tkTargetGarisHorizontal(titik, "Berat Badan", "kg", 15, "cdc")).toBe(titik.sumbuKananPersen);
  });

  it("menarik garis horizontal WHO ke sumbu kiri", () => {
    expect(tkTargetGarisHorizontal(titik, "Berat Badan", "kg", 15, "bbu")).toBe(titik.sumbuKiriPersen);
    expect(tkTargetGarisHorizontal(titik, "Tinggi Badan", "cm", 150, "tbu")).toBe(titik.sumbuKiriPersen);
  });
});
