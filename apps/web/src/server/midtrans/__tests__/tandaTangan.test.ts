import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { hitungTandaTangan, tandaTanganCocok } from "../tandaTangan";

const KUNCI = "SB-Mid-server-kunci-uji";

describe("hitungTandaTangan", () => {
  it("mengikuti rumus SHA512 Midtrans apa adanya", () => {
    const harapan = createHash("sha512")
      .update("TV-ABC" + "200" + "15000.00" + KUNCI, "utf8")
      .digest("hex");

    expect(
      hitungTandaTangan({
        orderId: "TV-ABC",
        statusCode: "200",
        grossAmount: "15000.00",
        serverKey: KUNCI,
      }),
    ).toBe(harapan);
  });

  it("membedakan '15000.00' dari '15000'", () => {
    /* Inilah jebakan yang paling sering menghabiskan waktu berjam-jam:
       gross_amount harus dipakai sebagai teks mentah dari badan permintaan. */
    const a = hitungTandaTangan({
      orderId: "TV-ABC",
      statusCode: "200",
      grossAmount: "15000.00",
      serverKey: KUNCI,
    });
    const b = hitungTandaTangan({
      orderId: "TV-ABC",
      statusCode: "200",
      grossAmount: "15000",
      serverKey: KUNCI,
    });

    expect(a).not.toBe(b);
  });
});

describe("tandaTanganCocok", () => {
  const sah = hitungTandaTangan({
    orderId: "TV-ABC",
    statusCode: "200",
    grossAmount: "15000.00",
    serverKey: KUNCI,
  });

  it("menerima tanda tangan yang benar", () => {
    expect(tandaTanganCocok(sah, sah)).toBe(true);
  });

  it("menerima huruf besar dan spasi di tepi", () => {
    expect(tandaTanganCocok(`  ${sah.toUpperCase()}  `, sah)).toBe(true);
  });

  it("menolak tanda tangan yang salah satu karakter", () => {
    const rusak = (sah[0] === "a" ? "b" : "a") + sah.slice(1);
    expect(tandaTanganCocok(rusak, sah)).toBe(false);
  });

  it("menolak panjang yang berbeda tanpa melempar", () => {
    expect(tandaTanganCocok("", sah)).toBe(false);
    expect(tandaTanganCocok(sah + "00", sah)).toBe(false);
  });
});
