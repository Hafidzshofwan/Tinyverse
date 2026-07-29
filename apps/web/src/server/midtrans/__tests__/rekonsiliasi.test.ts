/**
 * Uji jaring pengaman pembayaran, tanpa Firebase dan tanpa jaringan.
 *
 * Skenario di sini semuanya berakhir pada uang: pembayaran yang webhooknya
 * hilang, pesanan yang dananya sudah masuk tetapi aksesnya belum terbuka, dan
 * - yang paling berbahaya - godaan untuk menutup pesanan hanya karena jam kita
 * sudah lewat, padahal pembayarannya masih mungkin masuk.
 */
import type { Pesanan } from "@tinyverse/billing";
import {
  InMemoryOrderRepository,
  InMemorySubscriptionRepository,
} from "@tinyverse/data-access";
import { beforeEach, describe, expect, it } from "vitest";

import {
  rekonsiliasiPesanan,
  type StatusResmi,
} from "../rekonsiliasi";

const AKUN = "akun-uji-1";
const SEKARANG = "2026-01-10T05:00:00.000Z";
/* Lewat tempo, dan sudah melampaui jeda aman 30 menit. */
const LEWAT_TEMPO = "2026-01-10T03:00:00.000Z";

function pesananContoh(
  id: string,
  status: Pesanan["status"],
  expiresAt = LEWAT_TEMPO,
): Pesanan {
  return {
    id,
    accountId: AKUN,
    createdByUid: "uid-uji",
    snapshotHarga: {
      planId: "bulanan",
      nama: "1 Bulan",
      durasiHari: 30,
      hargaRupiah: 15000,
    },
    status,
    midtransOrderId: id,
    createdAt: "2026-01-10T02:00:00.000Z",
    expiresAt,
    updatedAt: "2026-01-10T02:00:00.000Z",
  };
}

const LUNAS: StatusResmi = {
  status_code: "200",
  gross_amount: "15000.00",
  transaction_status: "settlement",
};

let orderRepo: InMemoryOrderRepository;
let subRepo: InMemorySubscriptionRepository;

beforeEach(() => {
  orderRepo = new InMemoryOrderRepository();
  subRepo = new InMemorySubscriptionRepository();
});

function jalankan(
  ambilStatus: (orderId: string) => Promise<StatusResmi | null>,
  sekarang = SEKARANG,
) {
  return rekonsiliasiPesanan({ sekarang, orderRepo, subRepo, ambilStatus });
}

describe("rekonsiliasiPesanan", () => {
  it("menyusulkan pembayaran yang notifikasinya tidak pernah sampai", async () => {
    await orderRepo.create(pesananContoh("TV-A", "menunggu"));

    const ringkasan = await jalankan(async () => LUNAS);

    expect(ringkasan.diperiksa).toBe(1);
    expect(ringkasan.diterapkan).toBe(1);

    const sesudah = await orderRepo.findById("TV-A");
    expect(sesudah?.status).toBe("selesai");

    const langganan = await subRepo.get(AKUN);
    expect(langganan?.lastOrderId).toBe("TV-A");
    expect(langganan?.periodeBerakhir).toBeTruthy();
  });

  it("menyelamatkan pesanan yang dananya masuk tetapi aksesnya belum terbuka", async () => {
    /* Status "dibayar" berarti penulisan langganan sempat gagal. Umurnya tidak
       relevan - inilah kegagalan yang paling merugikan pelanggan. */
    await orderRepo.create(
      pesananContoh("TV-B", "dibayar", "2026-01-10T04:59:00.000Z"),
    );

    const ringkasan = await jalankan(async () => LUNAS);

    expect(ringkasan.diterapkan).toBe(1);
    expect((await orderRepo.findById("TV-B"))?.status).toBe("selesai");
  });

  it("TIDAK menutup pesanan selama Midtrans masih menyatakan pending", async () => {
    /* Penjagaan terpenting di seluruh berkas ini. Virtual Account dan QRIS
       lazim dibayar belakangan. Menutup pesanan hanya karena jam kita sudah
       lewat akan membuat pembayaran yang sungguhan masuk ditolak oleh mesin
       status kita sendiri - dan uang pelanggan hilang tanpa akses. */
    await orderRepo.create(pesananContoh("TV-C", "menunggu"));

    const ringkasan = await jalankan(async () => ({
      status_code: "201",
      gross_amount: "15000.00",
      transaction_status: "pending",
    }));

    expect(ringkasan.ditandaiKedaluwarsa).toBe(0);
    expect((await orderRepo.findById("TV-C"))?.status).toBe("menunggu");
  });

  it("merapikan pesanan yang transaksinya tidak pernah ada di Midtrans", async () => {
    await orderRepo.create(pesananContoh("TV-D", "menunggu"));

    const ringkasan = await jalankan(async () => null);

    expect(ringkasan.ditandaiKedaluwarsa).toBe(1);
    expect((await orderRepo.findById("TV-D"))?.status).toBe("kedaluwarsa");
  });

  it("tidak mengusik pesanan yang baru saja lewat tempo", async () => {
    /* Jeda aman 30 menit: pesanan ini lewat tempo lima menit lalu. */
    await orderRepo.create(
      pesananContoh("TV-E", "menunggu", "2026-01-10T04:55:00.000Z"),
    );

    const ringkasan = await jalankan(async () => null);

    expect(ringkasan.diperiksa).toBe(0);
    expect((await orderRepo.findById("TV-E"))?.status).toBe("menunggu");
  });

  it("satu pesanan yang gagal dibaca tidak menghentikan pesanan lain", async () => {
    await orderRepo.create(pesananContoh("TV-F", "dibayar"));
    await orderRepo.create(pesananContoh("TV-G", "menunggu"));

    const ringkasan = await jalankan(async (orderId) => {
      if (orderId === "TV-F") throw new Error("jaringan putus");
      return LUNAS;
    });

    expect(ringkasan.gagal).toBe(1);
    expect(ringkasan.diterapkan).toBe(1);
    expect((await orderRepo.findById("TV-G"))?.status).toBe("selesai");
  });

  it("dijalankan dua kali tidak memperpanjang masa aktif dua kali", async () => {
    await orderRepo.create(pesananContoh("TV-H", "menunggu"));

    await jalankan(async () => LUNAS);
    const pertama = (await subRepo.get(AKUN))?.periodeBerakhir;

    const kedua = await jalankan(async () => LUNAS);

    /* Putaran kedua tidak lagi menemukan pesanan itu, karena statusnya sudah
       final. Andai pun menemukannya, lastOrderId yang menahan. */
    expect(kedua.diterapkan).toBe(0);
    expect((await subRepo.get(AKUN))?.periodeBerakhir).toBe(pertama);
  });

  it("menandai nominal yang tidak cocok sebagai perlu ditinjau", async () => {
    await orderRepo.create(pesananContoh("TV-I", "menunggu"));

    const ringkasan = await jalankan(async () => ({
      status_code: "200",
      gross_amount: "1000.00",
      transaction_status: "settlement",
    }));

    expect(ringkasan.perluDitinjau).toBe(1);
    expect((await orderRepo.findById("TV-I"))?.status).toBe("menunggu");
  });
});
