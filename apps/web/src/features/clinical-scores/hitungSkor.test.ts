import { describe, it, expect } from "vitest";
import { hitungSkor } from "./hitungSkor";
import { DAFTAR_SKOR } from "./data";

const nolUntuk = (id: string) =>
  DAFTAR_SKOR.find((s) => s.id === id)!.items.map(() => 0);
const maxUntuk = (id: string) =>
  DAFTAR_SKOR.find((s) => s.id === id)!.items.map((p) => p.opsi.length - 1);

describe("hitungSkor - katalog skor klinis (mirror v17)", () => {
  it("CDS semua normal -> 0, tanpa dehidrasi (ok)", () => {
    const r = hitungSkor("cds", nolUntuk("cds"));
    expect(r.total).toBe(0);
    expect(r.level).toBe("ok");
    expect(r.kategori).toContain("Tanpa dehidrasi");
  });

  it("CDS semua maksimal -> 8, dehidrasi sedang-berat (crit)", () => {
    const r = hitungSkor("cds", maxUntuk("cds"));
    expect(r.total).toBe(8);
    expect(r.level).toBe("crit");
  });

  it("Croup: kesadaran disorientasi saja -> 5, croup sedang (warn)", () => {
    const r = hitungSkor("croup", [1, 0, 0, 0, 0]);
    expect(r.total).toBe(5);
    expect(r.kategori).toContain("Croup sedang");
  });

  it("PAS semua Ya -> 10, kemungkinan tinggi (crit)", () => {
    const r = hitungSkor("pas", maxUntuk("pas"));
    expect(r.total).toBe(10);
    expect(r.level).toBe("crit");
  });

  it("Downes semua normal -> 0, distres ringan (ok)", () => {
    const r = hitungSkor("downes", nolUntuk("downes"));
    expect(r.total).toBe(0);
    expect(r.level).toBe("ok");
  });

  it("PASS semua berat -> 6, serangan berat (crit)", () => {
    const r = hitungSkor("pass", maxUntuk("pass"));
    expect(r.total).toBe(6);
    expect(r.level).toBe("crit");
  });

  it("Kawasaki: demam + 4 kriteria -> memenuhi KD klasik (crit)", () => {
    const r = hitungSkor("kawasaki", [1, 1, 1, 1, 1, 0]);
    expect(r.kategori).toContain("KD klasik");
    expect(r.level).toBe("crit");
  });

  it("Kawasaki: tanpa demam -> kriteria belum terpenuhi (warn)", () => {
    const r = hitungSkor("kawasaki", [0, 1, 1, 1, 1, 1]);
    expect(r.kategori).toContain("belum terpenuhi");
    expect(r.level).toBe("warn");
  });

  it("Centor: nilai bisa negatif (usia >=45)", () => {
    const r = hitungSkor("centor", [2, 0, 0, 0, 0]);
    expect(r.total).toBe(-1);
    expect(r.level).toBe("ok");
  });

  it("TB Anak: kontak BTA(+) + tuberkulin positif -> 6, diagnosis TB (crit)", () => {
    const r = hitungSkor("tbanak", [2, 1, 0, 0, 0, 0, 0, 0]);
    expect(r.total).toBe(6);
    expect(r.kategori).toContain("Diagnosis TB");
  });

  it("menolak id skor yang tidak dikenal", () => {
    expect(() => hitungSkor("ngawur", [])).toThrow();
  });
});
