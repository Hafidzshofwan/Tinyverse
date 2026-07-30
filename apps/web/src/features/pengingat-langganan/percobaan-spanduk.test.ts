import { describe, expect, it } from "vitest";

import { hitungPengingat } from "./pengingat";

/* Waktu selalu dititipkan sebagai teks, sama seperti pengingat.test.ts, supaya
   uji ini tidak berubah hasilnya bulan depan. */
const KINI = "2026-07-29T00:00:00.000Z";

describe("spanduk selama masa percobaan berjalan", () => {
  it("diam pada hari pertama masa percobaan", () => {
    const p = hitungPengingat(
      {
        status: "aktif",
        berakhirPada: "2026-07-31T00:00:00.000Z",
        percobaan: true,
      },
      KINI
    );
    expect(p).toBeNull();
  });

  it("tetap diam pada jam-jam terakhir masa percobaan", () => {
    const p = hitungPengingat(
      {
        status: "aktif",
        berakhirPada: "2026-07-29T06:00:00.000Z",
        percobaan: true,
      },
      KINI
    );
    expect(p).toBeNull();
  });

  /*
   * Pagar pengaman: pelanggan berbayar TIDAK boleh ikut terdiam. Tanpa uji ini,
   * satu salah tempat pada pemeriksaan percobaan akan membungkam peringatan
   * bagi seluruh pelanggan yang membayar - dan mereka baru menyadarinya saat
   * aksesnya sudah terputus.
   */
  it("tidak mengubah apa pun bagi pelanggan berbayar", () => {
    const p = hitungPengingat(
      {
        status: "aktif",
        berakhirPada: "2026-08-01T00:00:00.000Z",
        percobaan: false,
      },
      KINI
    );
    expect(p?.nada).toBe("peringatan");
    expect(p?.judul).toContain("3 hari lagi");
  });

  it("berperilaku seperti pelanggan berbayar bila keterangan percobaan tidak disebutkan", () => {
    const p = hitungPengingat(
      { status: "aktif", berakhirPada: "2026-08-01T00:00:00.000Z" },
      KINI
    );
    expect(p?.nada).toBe("peringatan");
    expect(p?.sisaHari).toBe(3);
  });
});

describe("spanduk setelah masa percobaan berakhir", () => {
  it("tetap memberi tahu, dengan kalimatnya sendiri", () => {
    const p = hitungPengingat(
      {
        status: "kedaluwarsa",
        berakhirPada: "2026-07-28T00:00:00.000Z",
        percobaan: true,
      },
      KINI
    );
    expect(p).not.toBeNull();
    expect(p?.nada).toBe("berakhir");
    expect(p?.sisaHari).toBe(0);
    expect(p?.judul).toContain("Masa percobaan");
    expect(p?.judul).toContain("telah berakhir");
  });

  it("mengajak berlangganan, bukan memperpanjang, dan menenangkan soal data pasien", () => {
    const p = hitungPengingat(
      { status: "kedaluwarsa", berakhirPada: null, percobaan: true },
      KINI
    );
    expect(p?.pesan).toContain("Berlangganan");
    expect(p?.pesan).toContain("Data pasien");
  });

  it("tidak menyebut kata langganan kepada orang yang belum pernah berlangganan", () => {
    const p = hitungPengingat(
      { status: "kedaluwarsa", berakhirPada: null, percobaan: true },
      KINI
    );
    expect(p?.judul).not.toContain("Masa langganan");
  });

  it("kalimat pelanggan berbayar tidak berubah", () => {
    const p = hitungPengingat(
      {
        status: "kedaluwarsa",
        berakhirPada: "2026-07-01T00:00:00.000Z",
        percobaan: false,
      },
      KINI
    );
    expect(p?.judul).toContain("Masa langganan Anda telah berakhir");
    expect(p?.pesan).toContain("Perpanjang");
  });

  it("memakai penanda tutup pita merah yang sama, sehingga tombol tutup tetap bekerja", () => {
    const percobaan = hitungPengingat(
      { status: "kedaluwarsa", berakhirPada: null, percobaan: true },
      KINI
    );
    const berbayar = hitungPengingat(
      { status: "kedaluwarsa", berakhirPada: null, percobaan: false },
      KINI
    );
    expect(percobaan?.kunci).toContain("berakhir");
    expect(percobaan?.kunci).toBe(berbayar?.kunci);
  });
});
