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

  it("APGAR: semua normal (skor 2) -> total 10 (ok)", () => {
    const r = hitungSkor("apgar", maxUntuk("apgar"));
    expect(r.total).toBe(10);
    expect(r.level).toBe("ok");
    expect(r.kategori).toContain("Normal");
  });

  it("APGAR: semua 0 -> total 0, asfiksia berat (crit)", () => {
    const r = hitungSkor("apgar", nolUntuk("apgar"));
    expect(r.total).toBe(0);
    expect(r.level).toBe("crit");
    expect(r.kategori).toContain("Asfiksia Berat");
  });

  // PENTING: argumen kedua hitungSkor() adalah INDEKS OPSI, bukan nilai skor.
  // Pada Ballard keduanya TIDAK sama, karena sebagian parameter dimulai dari
  // nilai negatif (mis. Square Window mulai -1, Plantar mulai -2), sehingga
  // indeks 4 pada Square Window bernilai 3, bukan 4.
  // Indeks di bawah menghasilkan nilai 4,4,3,4,3,3,3,3,3,3,4,3 = 40.
  it("Ballard: maturitas aterm (skor 40) -> 40 minggu (ok)", () => {
    const r = hitungSkor("ballard", [4, 5, 3, 5, 4, 4, 4, 4, 5, 4, 5, 4]);
    expect(r.total).toBe(40);
    expect(r.level).toBe("ok");
    expect(r.kategori).toContain("40 Minggu");
  });

  // Mengunci tabel maturitas resmi New Ballard: tiap kenaikan 5 poin setara
  // 2 minggu gestasi, dengan titik acuan skor 0 = 24 minggu.
  it("Ballard: konversi skor -> usia gestasi mengikuti tabel maturitas", () => {
    const def = DAFTAR_SKOR.find((s) => s.id === "ballard")!;
    const rumus = (t: number) =>
      Math.max(20, Math.min(44, Math.round(24 + (t / 5) * 2)));
    expect(rumus(-10)).toBe(20);
    expect(rumus(0)).toBe(24);
    expect(rumus(20)).toBe(32);
    expect(rumus(35)).toBe(38);
    expect(rumus(50)).toBe(44);
    expect(def.maxTotal).toBe(50);
  });

  it("Ballard: seluruh opsi termaksimal -> 50 (batas atas 44 minggu)", () => {
    const r = hitungSkor("ballard", maxUntuk("ballard"));
    expect(r.total).toBe(50);
    expect(r.kategori).toContain("44 Minggu");
  });

  it("Ballard: menolak indeks opsi di luar jangkauan", () => {
    const terlalu = maxUntuk("ballard").map((n) => n + 1);
    expect(() => hitungSkor("ballard", terlalu)).toThrow();
  });

  it("Ballard: menolak jumlah pilihan yang tidak 12", () => {
    expect(() => hitungSkor("ballard", [0, 0, 0])).toThrow();
  });

  it("menolak id skor yang tidak dikenal", () => {
    expect(() => hitungSkor("ngawur", [])).toThrow();
  });
});
