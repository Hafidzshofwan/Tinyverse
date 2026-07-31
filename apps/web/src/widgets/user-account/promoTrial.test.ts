import { describe, expect, it } from "vitest";

import { HARI_PERCOBAAN } from "@tinyverse/billing";

import { HARI_TRIAL } from "./promoTrial";

/*
 * Uji ini menjaga satu hal saja, dan hal itu menyangkut kejujuran.
 *
 * Spanduk di layar login menjanjikan "Gratis N hari untuk pendaftar baru".
 * Angka N diambil dari HARI_TRIAL, sedangkan durasi yang benar-benar diberikan
 * kepada pengguna ditentukan oleh HARI_PERCOBAAN di sisi server. Keduanya
 * sengaja tidak digabung supaya paket billing tidak ikut terseret ke dalam
 * bundel peramban - alasannya ditulis lengkap di promoTrial.ts.
 *
 * Pemisahan itu menyisakan satu risiko: seseorang menaikkan durasi di server
 * dan lupa memperbarui teks promo, atau sebaliknya. Akibatnya bukan sekadar
 * salah tulis. Halaman login akan menjanjikan sesuatu yang tidak diberikan
 * sistem, dan janji itu tampil justru kepada orang yang belum mengenal produk
 * ini sama sekali.
 *
 * Karena itu perbedaan sekecil apa pun harus menghentikan CI.
 */
describe("angka trial pada spanduk login", () => {
  it("sama persis dengan durasi yang diberikan server", () => {
    expect(HARI_TRIAL).toBe(HARI_PERCOBAAN);
  });

  it("berupa bilangan bulat positif, karena dicetak apa adanya ke layar", () => {
    expect(Number.isInteger(HARI_TRIAL)).toBe(true);
    expect(HARI_TRIAL).toBeGreaterThan(0);
  });
});
