/**
 * Uji keputusan uang tanpa Firebase dan tanpa jaringan.
 *
 * Seluruh skenario di sini pernah menjadi bug nyata di banyak integrasi
 * pembayaran: notifikasi ganda, notifikasi yang tiba terbalik urutannya,
 * pembayaran yang sudah lunas lalu diikuti kabar kedaluwarsa, dan nominal
 * yang tidak sesuai. Semuanya harus berakhir tanpa lemparan.
 */
import type { Pesanan } from "@tinyverse/billing";
import {
  InMemoryOrderRepository,
  InMemorySubscriptionRepository,
} from "@tinyverse/data-access";
import { beforeEach, describe, expect, it } from "vitest";

import {
  prosesNotifikasiMidtrans,
  type NotifikasiTerverifikasi,
} from "../prosesNotifikasi";

const AKUN = "akun-uji-1";
const ORDER = "TV-AKUNUJI1-ABC-1234";
const SEKARANG = "2026-01-10T00:00:00.000Z";

function pesananContoh(status: Pesanan["status"] = "menunggu"): Pesanan {
  return {
    id: ORDER,
    accountId: AKUN,
    createdByUid: "uid-uji",
    snapshotHarga: {
      planId: "bulanan",
      nama: "1 Bulan",
      durasiHari: 30,
      hargaRupiah: 15000,
    },
    status,
    midtransOrderId: ORDER,
    createdAt: SEKARANG,
    expiresAt: "2026-01-10T01:10:00.000Z",
    updatedAt: SEKARANG,
  };
}

function notifikasi(
  ubah: Partial<NotifikasiTerverifikasi> = {},
): NotifikasiTerverifikasi {
  return {
    order_id: ORDER,
    status_code: "200",
    gross_amount: "15000.00",
    transaction_status: "settlement",
    ...ubah,
  };
}

let orderRepo: InMemoryOrderRepository;
let subRepo: InMemorySubscriptionRepository;

beforeEach(() => {
  orderRepo = new InMemoryOrderRepository();
  subRepo = new InMemorySubscriptionRepository();
});

function proses(n: NotifikasiTerverifikasi, sekarang = SEKARANG) {
  return prosesNotifikasiMidtrans({
    notifikasi: n,
    sekarang,
    orderRepo,
    subRepo,
  });
}

describe("pembayaran berhasil", () => {
  it("membuka akses dan menutup pesanan", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi());

    expect(hasil.kode).toBe("diterapkan");
    expect(hasil.berakhirPada).toBe("2026-02-09T00:00:00.000Z");

    const pesanan = await orderRepo.findById(ORDER);
    expect(pesanan?.status).toBe("selesai");

    const langganan = await subRepo.get(AKUN);
    expect(langganan?.lastOrderId).toBe(ORDER);
  });

  it("menerima capture dengan fraud_status accept", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(
      notifikasi({ transaction_status: "capture", fraud_status: "accept" }),
    );

    expect(hasil.kode).toBe("diterapkan");
  });

  it("menahan capture yang berstatus challenge", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(
      notifikasi({ transaction_status: "capture", fraud_status: "challenge" }),
    );

    /* Terbaca seperti berhasil, padahal dananya belum tentu cair. */
    expect(hasil.kode).toBe("diabaikan");
    expect((await orderRepo.findById(ORDER))?.status).toBe("menunggu");
    expect(await subRepo.get(AKUN)).toBeNull();
  });

  it("menolak lunas bila status_code bukan 200", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ status_code: "201" }));

    expect(hasil.kode).toBe("diabaikan");
    expect(await subRepo.get(AKUN)).toBeNull();
  });
});

describe("pengulangan notifikasi", () => {
  it("tidak memperpanjang dua kali walau dikirim tiga kali", async () => {
    await orderRepo.create(pesananContoh());

    await proses(notifikasi());
    const kedua = await proses(notifikasi());
    const ketiga = await proses(notifikasi());

    expect(kedua.kode).toBe("diabaikan");
    expect(ketiga.kode).toBe("diabaikan");

    const langganan = await subRepo.get(AKUN);
    expect(langganan?.periodeBerakhir).toBe("2026-02-09T00:00:00.000Z");
  });

  it("memulihkan pesanan yang tertinggal di status dibayar", async () => {
    /* Terjadi bila proses terputus setelah status naik menjadi "dibayar"
       tetapi sebelum langganan sempat disimpan. Notifikasi ulang harus
       menyelesaikannya, bukan mengabaikannya. */
    await orderRepo.create(pesananContoh("dibayar"));

    const hasil = await proses(notifikasi());

    expect(hasil.kode).toBe("diterapkan");
    expect((await orderRepo.findById(ORDER))?.status).toBe("selesai");
  });
});

describe("notifikasi yang tiba terbalik", () => {
  it("tidak melempar saat pending menyusul settlement", async () => {
    await orderRepo.create(pesananContoh());
    await proses(notifikasi());

    /* Peralihan "selesai" ke "menunggu" dilarang mesin status. Bila ini
       melempar, rute akan menjawab 500 dan Midtrans mengulanginya selamanya. */
    const hasil = await proses(notifikasi({ transaction_status: "pending" }));

    expect(hasil.kode).toBe("diabaikan");
    expect((await orderRepo.findById(ORDER))?.status).toBe("selesai");
  });

  it("tidak mencabut akses saat expire menyusul settlement", async () => {
    await orderRepo.create(pesananContoh());
    await proses(notifikasi());

    const hasil = await proses(notifikasi({ transaction_status: "expire" }));

    expect(hasil.kode).toBe("diabaikan");
    const langganan = await subRepo.get(AKUN);
    expect(langganan?.periodeBerakhir).toBe("2026-02-09T00:00:00.000Z");
  });
});

describe("kegagalan dan kejanggalan", () => {
  it("menandai kedaluwarsa atas kabar expire dari Midtrans", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ transaction_status: "expire" }));

    expect(hasil.kode).toBe("status_diperbarui");
    expect((await orderRepo.findById(ORDER))?.status).toBe("kedaluwarsa");
  });

  it("menandai gagal atas deny", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ transaction_status: "deny" }));

    expect(hasil.kode).toBe("status_diperbarui");
    expect(await subRepo.get(AKUN)).toBeNull();
  });

  it("menolak nominal yang tidak cocok", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ gross_amount: "1000.00" }));

    expect(hasil.kode).toBe("nominal_tidak_cocok");
    expect(await subRepo.get(AKUN)).toBeNull();
  });

  it("menerima nominal yang sama meski ditulis tanpa desimal", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ gross_amount: "15000" }));

    expect(hasil.kode).toBe("diterapkan");
  });

  it("tidak melempar bila pesanan tidak ada", async () => {
    const hasil = await proses(notifikasi());

    expect(hasil.kode).toBe("pesanan_tidak_ada");
  });

  it("mengabaikan status yang tidak dikenal", async () => {
    await orderRepo.create(pesananContoh());

    const hasil = await proses(notifikasi({ transaction_status: "refund" }));

    expect(hasil.kode).toBe("diabaikan");
  });
});

describe("perpanjangan menumpuk", () => {
  it("menambah masa aktif dari tanggal berakhir, bukan dari hari ini", async () => {
    await orderRepo.create(pesananContoh());
    await proses(notifikasi());

    const pesananKedua = { ...pesananContoh(), id: `${ORDER}-2`, midtransOrderId: `${ORDER}-2` };
    await orderRepo.create(pesananKedua);

    const hasil = await proses(
      notifikasi({ order_id: pesananKedua.id }),
      "2026-01-20T00:00:00.000Z",
    );

    expect(hasil.kode).toBe("diterapkan");
    /* 9 Feb + 30 hari, bukan 20 Jan + 30 hari. */
    expect(hasil.berakhirPada).toBe("2026-03-11T00:00:00.000Z");
  });
});
