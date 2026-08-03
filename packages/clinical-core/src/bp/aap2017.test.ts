import { describe, expect, it } from "vitest";

import {
  AAP2017_BP_ROWS,
} from "./aap2017-data";
import {
  classifyBPAge13Plus,
  evaluateBP,
  findNearestHeightPercentile,
  getAAPBPThresholds,
  validateBPInput,
  type BPInput,
} from "./aap2017";

/** Anak laki-laki 8 tahun, tinggi 131 cm = persis kolom persentil ke-50. */
function anak8(sbp: number, dbp: number, tambahan: Partial<BPInput> = {}): BPInput {
  return {
    ageYears: 8,
    ageMonths: 0,
    sex: "male",
    heightCm: 131,
    sbp,
    dbp,
    ...tambahan,
  };
}

function remaja(sbp: number, dbp: number): BPInput {
  return { ageYears: 13, ageMonths: 0, sex: "male", heightCm: 160, sbp, dbp };
}

describe("data Table 4 dan Table 5 AAP 2017", () => {
  it("memuat 17 usia untuk kedua jenis kelamin", () => {
    expect(AAP2017_BP_ROWS).toHaveLength(34);
    for (const sex of ["male", "female"] as const) {
      const usia = AAP2017_BP_ROWS.filter((r) => r.sex === sex).map((r) => r.age);
      expect(usia).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    }
  });

  it("cocok dengan angka acuan yang dibaca langsung dari pedoman", () => {
    const l8 = getAAPBPThresholds(8, "male", 50);
    expect(l8).toEqual({
      sbpP50: 98,
      sbpP90: 110,
      sbpP95: 114,
      sbpP95plus12: 126,
      dbpP50: 59,
      dbpP90: 71,
      dbpP95: 74,
      dbpP95plus12: 86,
    });

    const p17 = getAAPBPThresholds(17, "female", 50);
    expect(p17?.sbpP95).toBe(127);
    expect(p17?.dbpP95).toBe(81);
  });

  it("selalu menjaga P95 + 12 tepat 12 mmHg di atas P95", () => {
    for (const baris of AAP2017_BP_ROWS) {
      for (const p of [5, 10, 25, 50, 75, 90, 95] as const) {
        expect(baris.sbp.p95plus12[p] - baris.sbp.p95[p]).toBe(12);
        expect(baris.dbp.p95plus12[p] - baris.dbp.p95[p]).toBe(12);
      }
    }
  });
});

describe("batas usia", () => {
  it("menolak bayi di bawah 1 tahun", () => {
    const r = evaluateBP({ ...anak8(90, 50), ageYears: 0, ageMonths: 6 });
    expect(r.status).toBe("unsupported-infant");
  });

  it("mengarahkan usia dewasa ke klasifikasi dewasa", () => {
    const r = evaluateBP({ ...anak8(120, 70), ageYears: 18, heightCm: 170 });
    expect(r.status).toBe("unsupported-adult");
  });
});

describe("klasifikasi usia 1 sampai kurang dari 13 tahun", () => {
  it("normal ketika SBP dan DBP di bawah P90", () => {
    const r = evaluateBP(anak8(100, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.heightPercentile?.percentile).toBe(50);
    expect(r.classification.finalCategory).toBe("normal");
  });

  it("elevated ketika hanya SBP yang melewati P90", () => {
    const r = evaluateBP(anak8(112, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.sbpCategory).toBe("elevated");
    expect(r.classification.dbpCategory).toBe("normal");
    expect(r.classification.finalCategory).toBe("elevated");
    expect(r.classification.determinedBy).toEqual(["sbp"]);
  });

  it("stage 1 ketika hanya DBP yang melewati P95", () => {
    const r = evaluateBP(anak8(100, 75));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.sbpCategory).toBe("normal");
    expect(r.classification.dbpCategory).toBe("stage1");
    expect(r.classification.finalCategory).toBe("stage1");
  });

  it("stage 2 ketika SBP melewati P95 + 12", () => {
    const r = evaluateBP(anak8(130, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("stage2");
  });

  it("mencocokkan contoh 116/76 pada anak laki-laki 8 tahun tinggi 131 cm", () => {
    const r = evaluateBP(anak8(116, 76));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("stage1");
  });

  it("memakai kolom P5 dan memberi catatan bila tinggi di bawah rentang tabel", () => {
    const h = findNearestHeightPercentile(8, "male", 100);
    expect(h?.percentile).toBe(5);
    expect(h?.outOfRange).toBe("below");
    expect(h?.note).toContain("di bawah rentang tabel");
  });

  it("memakai kolom P95 dan memberi catatan bila tinggi di atas rentang tabel", () => {
    const h = findNearestHeightPercentile(8, "male", 160);
    expect(h?.percentile).toBe(95);
    expect(h?.outOfRange).toBe("above");
    expect(h?.note).toContain("di atas rentang tabel");
  });
});

describe("klasifikasi usia 13 tahun ke atas", () => {
  it("128/78 masuk Elevated BP", () => {
    expect(classifyBPAge13Plus(128, 78).finalCategory).toBe("elevated");
  });

  it("132/78 masuk Stage 1", () => {
    expect(classifyBPAge13Plus(132, 78).finalCategory).toBe("stage1");
  });

  it("118/82 masuk Stage 1 karena DBP", () => {
    const c = classifyBPAge13Plus(118, 82);
    expect(c.sbpCategory).toBe("normal");
    expect(c.dbpCategory).toBe("stage1");
    expect(c.finalCategory).toBe("stage1");
    expect(c.determinedBy).toEqual(["dbp"]);
  });

  it("142/92 masuk Stage 2", () => {
    expect(classifyBPAge13Plus(142, 92).finalCategory).toBe("stage2");
  });

  it("tidak memakai persentil tinggi sebagai penentu", () => {
    const r = evaluateBP(remaja(128, 78));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.usesHeightPercentile).toBe(false);
  });

  it("menandai krisis di atas 180/120 sebagai perlu evaluasi segera", () => {
    const r = evaluateBP(remaja(190, 100));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.urgent).toBe(true);
  });
});

describe("catatan dan validasi", () => {
  it("meminta konfirmasi auskultasi bila alat digital dan hasil di atas normal", () => {
    const r = evaluateBP(anak8(112, 60, { method: "osilometrik" }));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.needsAuscultationConfirmation).toBe(true);
    expect(r.notes.join(" ")).toContain("auskultasi");
  });

  it("tidak meminta konfirmasi auskultasi bila hasil normal", () => {
    const r = evaluateBP(anak8(100, 60, { method: "osilometrik" }));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.needsAuscultationConfirmation).toBe(false);
  });

  it("menolak SBP yang tidak lebih tinggi daripada DBP", () => {
    const v = validateBPInput(anak8(70, 80));
    expect(v.valid).toBe(false);
    expect(v.errors.join(" ")).toContain("lebih tinggi");
    expect(evaluateBP(anak8(70, 80)).status).toBe("invalid");
  });

  it("menganjurkan evaluasi segera bila ada gejala", () => {
    const r = evaluateBP(anak8(112, 60, { symptomatic: true }));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.urgent).toBe(true);
    expect(r.followUp.teks).toContain("segera");
  });

  it("memberi alur tindak lanjut bertingkat untuk Elevated BP", () => {
    const r = evaluateBP(anak8(111, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("elevated");
    expect(r.followUp.cekUlang).toContain("6 bulan");
    expect(r.followUp.lanjutan).toHaveLength(2);
    expect(r.followUp.lanjutan.join(" ")).toContain("12 bulan");
    expect(r.followUp.lanjutan.join(" ")).toContain("ABPM");
    expect(r.followUp.catatanAktivitas).toBeNull();
  });

  it("memberi alur 1 sampai 2 minggu lalu 3 bulan untuk Stage 1", () => {
    const r = evaluateBP(anak8(115, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("stage1");
    expect(r.followUp.cekUlang).toContain("1 sampai 2 minggu");
    expect(r.followUp.lanjutan.join(" ")).toContain("3 bulan");
    expect(r.followUp.lanjutan.join(" ")).toContain("3 kunjungan");
    expect(r.followUp.catatanAktivitas).toContain("LVH");
  });

  it("memberi opsi rujukan 1 minggu dan larangan olahraga untuk Stage 2", () => {
    const r = evaluateBP(anak8(130, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("stage2");
    expect(r.urgent).toBe(false);
    expect(r.followUp.cekUlang).toContain("1 minggu");
    expect(r.followUp.lanjutan).toHaveLength(1);
    expect(r.followUp.catatanAktivitas).toContain("olahraga kompetitif");
  });

  it("tidak menambah tindakan apa pun pada hasil normal", () => {
    const r = evaluateBP(anak8(100, 60));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.classification.finalCategory).toBe("normal");
    expect(r.followUp.lanjutan).toEqual([]);
    expect(r.followUp.cekUlang).toContain("kunjungan rutin");
    expect(r.followUp.catatanAktivitas).toBeNull();
  });

  it("menghapus jadwal cek ulang bila keadaan menuntut evaluasi segera", () => {
    const r = evaluateBP(anak8(115, 60, { symptomatic: true }));
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.urgent).toBe(true);
    expect(r.followUp.cekUlang).toBeNull();
    expect(r.followUp.lanjutan).toEqual([]);
  });
});
