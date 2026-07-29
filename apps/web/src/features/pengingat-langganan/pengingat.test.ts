import { describe, expect, it } from "vitest";

import {
  BATAS_HARI_PENGINGAT,
  hitungPengingat,
  sisaHariSampai,
} from "./pengingat";

/* Semua waktu di uji ini dititipkan sebagai teks, bukan diambil dari jam
   sistem. Uji yang bergantung pada "hari ini" akan lulus hari ini dan gagal
   bulan depan tanpa ada kode yang berubah. */
const KINI = "2026-07-29T00:00:00.000Z";

function aktif(berakhirPada: string | null) {
  return { status: "aktif" as const, berakhirPada };
}

describe("sisaHariSampai", () => {
  it("menghitung selisih hari bulat", () => {
    expect(sisaHariSampai(KINI, "2026-08-05T00:00:00.000Z")).toBe(7);
    expect(sisaHariSampai(KINI, "2026-07-30T00:00:00.000Z")).toBe(1);
  });

  it("membulatkan ke atas, sehingga sisa beberapa jam tetap terhitung satu hari", () => {
    expect(sisaHariSampai(KINI, "2026-07-29T12:00:00.000Z")).toBe(1);
    expect(sisaHariSampai(KINI, "2026-07-29T00:30:00.000Z")).toBe(1);
  });

  it("bernilai nol atau minus untuk tanggal yang sudah lewat", () => {
    expect(sisaHariSampai(KINI, "2026-07-29T00:00:00.000Z")).toBe(0);
    expect(sisaHariSampai(KINI, "2026-07-20T00:00:00.000Z")).toBe(-9);
  });

  it("mengembalikan null bila tanggal tidak bisa dibaca", () => {
    expect(sisaHariSampai(KINI, "bukan tanggal")).toBeNull();
    expect(sisaHariSampai("", "2026-08-05T00:00:00.000Z")).toBeNull();
  });
});

describe("hitungPengingat - batas kemunculan", () => {
  it("batasnya tujuh hari", () => {
    expect(BATAS_HARI_PENGINGAT).toBe(7);
  });

  it("tidak muncul saat sisa delapan hari", () => {
    expect(hitungPengingat(aktif("2026-08-06T00:00:00.000Z"), KINI)).toBeNull();
  });

  it("tidak muncul saat sisa masih lama", () => {
    expect(hitungPengingat(aktif("2026-08-28T00:00:00.000Z"), KINI)).toBeNull();
  });

  it("muncul tepat saat sisa tujuh hari", () => {
    const p = hitungPengingat(aktif("2026-08-05T00:00:00.000Z"), KINI);
    expect(p).not.toBeNull();
    expect(p?.nada).toBe("peringatan");
    expect(p?.sisaHari).toBe(7);
    expect(p?.judul).toContain("7 hari lagi");
  });

  it("muncul saat sisa tiga hari", () => {
    const p = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), KINI);
    expect(p?.sisaHari).toBe(3);
    expect(p?.judul).toContain("3 hari lagi");
  });
});

describe("hitungPengingat - hari terakhir", () => {
  it("memakai kalimat khusus saat sisa kurang dari sehari", () => {
    const p = hitungPengingat(aktif("2026-07-29T10:00:00.000Z"), KINI);
    expect(p?.nada).toBe("peringatan");
    expect(p?.sisaHari).toBe(1);
    expect(p?.judul).toContain("kurang dari 24 jam");
  });

  it("tidak pernah menampilkan angka nol atau minus meski jam berselisih", () => {
    const p = hitungPengingat(aktif("2026-07-28T23:00:00.000Z"), KINI);
    expect(p?.sisaHari).toBe(1);
    expect(p?.judul).toContain("kurang dari 24 jam");
  });
});

describe("hitungPengingat - sudah berakhir", () => {
  it("menampilkan pita merah tanpa peduli tanggalnya", () => {
    const p = hitungPengingat(
      { status: "kedaluwarsa", berakhirPada: "2026-07-01T00:00:00.000Z" },
      KINI
    );
    expect(p?.nada).toBe("berakhir");
    expect(p?.sisaHari).toBe(0);
    expect(p?.judul).toContain("telah berakhir");
    expect(p?.pesan).toContain("Data pasien");
  });

  it("tetap tampil walau tanggal berakhirnya tidak tercatat", () => {
    const p = hitungPengingat({ status: "kedaluwarsa", berakhirPada: null }, KINI);
    expect(p?.nada).toBe("berakhir");
  });
});

describe("hitungPengingat - keadaan yang harus diam", () => {
  it("tidak mengganggu pengguna yang belum pernah berlangganan", () => {
    expect(hitungPengingat({ status: "belum", berakhirPada: null }, KINI)).toBeNull();
    expect(
      hitungPengingat({ status: "belum", berakhirPada: "2026-08-01T00:00:00.000Z" }, KINI)
    ).toBeNull();
  });

  it("diam bila langganan aktif tanpa tanggal berakhir", () => {
    expect(hitungPengingat(aktif(null), KINI)).toBeNull();
  });

  it("diam bila tanggal berakhir rusak, bukan menampilkan angka ngawur", () => {
    expect(hitungPengingat(aktif("31-08-2026"), KINI)).toBeNull();
    expect(hitungPengingat(aktif(""), KINI)).toBeNull();
  });
});

describe("hitungPengingat - penanda tombol tutup", () => {
  it("penandanya sama sepanjang hari yang sama", () => {
    const pagi = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), "2026-07-29T01:00:00.000Z");
    const malam = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), "2026-07-29T22:00:00.000Z");
    expect(pagi?.kunci).toBe(malam?.kunci);
  });

  it("penandanya berganti keesokan harinya, sehingga pengingat muncul lagi", () => {
    const hariIni = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), "2026-07-29T01:00:00.000Z");
    const besok = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), "2026-07-30T01:00:00.000Z");
    expect(hariIni?.kunci).not.toBe(besok?.kunci);
  });

  it("penanda pita merah berbeda dari pita peringatan", () => {
    const peringatan = hitungPengingat(aktif("2026-08-01T00:00:00.000Z"), KINI);
    const berakhir = hitungPengingat({ status: "kedaluwarsa", berakhirPada: null }, KINI);
    expect(peringatan?.kunci).not.toBe(berakhir?.kunci);
    expect(berakhir?.kunci).toContain("berakhir");
  });
});
