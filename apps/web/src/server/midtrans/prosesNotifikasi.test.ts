/**
 * Uji inti keputusan webhook Midtrans.
 *
 * WHY berkas ini ada: prosesNotifikasiMidtrans adalah satu-satunya tempat di
 * seluruh aplikasi yang mengubah pembayaran menjadi hak akses, dan sampai
 * sekarang ia belum punya satu pun uji. orders.test.ts hanya menguji fungsi
 * murni di sekelilingnya - mesin status dan pemetaan status Midtrans - bukan
 * urutan pemanggilan yang sesungguhnya menentukan siapa mendapat berapa hari.
 *
 * Seluruh repositori di sini adalah tiruan di dalam memori, jadi tidak ada
 * jaringan, tidak ada Firestore, dan tidak ada jam sistem yang dibaca.
 * updateStatus tiruan meniru penulisan bersyarat Firestore: ia menolak bila
 * status di penyimpanan bukan lagi dariStatus, persis seperti transaksi
 * sungguhan di ordersAdmin.ts.
 */
import { describe, expect, it } from "vitest";
import type {
  Langganan,
  Pesanan,
  SnapshotHarga,
  StatusPesanan,
} from "@tinyverse/billing";
import type {
  OrderRepository,
  SubscriptionRepository,
} from "@tinyverse/data-access";
import {
  prosesNotifikasiMidtrans,
  type NotifikasiTerverifikasi,
} from "./prosesNotifikasi";

const AKUN = "akun-1";
const ID_PESANAN = "TV-akun0001-m5xk1-9f3a";
const SEKARANG = "2026-01-10T00:00:00.000Z";
/* SEKARANG + 30 hari, dihitung tangan. tambahHari memakai penjumlahan
   milidetik UTC, sehingga hasilnya pasti dan tidak bergantung kalender lokal. */
const PLUS_30_HARI = "2026-02-09T00:00:00.000Z";

const HARGA: SnapshotHarga = {
  planId: "bulanan",
  nama: "Bulanan",
  durasiHari: 30,
  hargaRupiah: 15000,
};

function buatPesanan(ubah: Partial<Pesanan> = {}): Pesanan {
  return {
    id: ID_PESANAN,
    accountId: AKUN,
    createdByUid: "uid-1",
    snapshotHarga: HARGA,
    status: "menunggu",
    midtransOrderId: ID_PESANAN,
    createdAt: "2026-01-09T00:00:00.000Z",
    expiresAt: "2026-01-09T00:30:00.000Z",
    updatedAt: "2026-01-09T00:00:00.000Z",
    ...ubah,
  };
}

function buatNotifikasi(
  ubah: Partial<NotifikasiTerverifikasi> = {},
): NotifikasiTerverifikasi {
  return {
    order_id: ID_PESANAN,
    status_code: "200",
    gross_amount: "15000.00",
    transaction_status: "settlement",
    ...ubah,
  };
}

class OrderRepoPalsu implements OrderRepository {
  readonly isi = new Map<string, Pesanan>();
  jumlahUpdateSukses = 0;

  constructor(...pesanan: Pesanan[]) {
    for (const p of pesanan) this.isi.set(p.id, p);
  }

  async create(pesanan: Pesanan): Promise<void> {
    if (this.isi.has(pesanan.id)) throw new Error("id pesanan sudah dipakai");
    this.isi.set(pesanan.id, pesanan);
  }

  async findById(id: string): Promise<Pesanan | null> {
    return this.isi.get(id) ?? null;
  }

  async findByMidtransOrderId(midtransOrderId: string): Promise<Pesanan | null> {
    for (const p of this.isi.values()) {
      if (p.midtransOrderId === midtransOrderId) return p;
    }
    return null;
  }

  async listByAccount(accountId: string): Promise<Pesanan[]> {
    return [...this.isi.values()].filter((p) => p.accountId === accountId);
  }

  async updateStatus(args: {
    id: string;
    dariStatus: StatusPesanan;
    keStatus: StatusPesanan;
    padaWaktu: string;
  }): Promise<boolean> {
    const p = this.isi.get(args.id);
    if (!p) return false;
    /* Inilah bagian yang ditiru dari transaksi Firestore: status di
       penyimpanan yang menentukan, bukan status yang dipegang pemanggil. */
    if (p.status !== args.dariStatus) return false;
    this.isi.set(args.id, {
      ...p,
      status: args.keStatus,
      updatedAt: args.padaWaktu,
    });
    this.jumlahUpdateSukses += 1;
    return true;
  }

  async listPerluRekonsiliasi(args: {
    sampai: string;
    batas: number;
  }): Promise<Pesanan[]> {
    return [...this.isi.values()]
      .filter(
        (p) =>
          p.status === "dibayar" ||
          (p.status === "menunggu" && p.expiresAt <= args.sampai),
      )
      .slice(0, args.batas);
  }

  status(id: string): StatusPesanan | null {
    return this.isi.get(id)?.status ?? null;
  }
}

class SubRepoPalsu implements SubscriptionRepository {
  isi: Langganan | null;
  jumlahSimpan = 0;

  constructor(awal: Langganan | null = null) {
    this.isi = awal;
  }

  async get(accountId: string): Promise<Langganan | null> {
    return this.isi && this.isi.accountId === accountId ? this.isi : null;
  }

  async save(langganan: Langganan): Promise<void> {
    this.isi = langganan;
    this.jumlahSimpan += 1;
  }

  /* Tiruan dari transaksi Firestore di subscriptionsAdmin.ts: penjaga
     lastOrderId dan penulisan digabung sebagai satu langkah atomik. */
  async terapkanSekaliSaja(args: {
    accountId: string;
    orderId: string;
    hitung: (langganan: Langganan | null) => Langganan;
  }): Promise<{ diterapkan: boolean; langganan: Langganan }> {
    const ada =
      this.isi && this.isi.accountId === args.accountId ? this.isi : null;

    if (ada && ada.lastOrderId === args.orderId) {
      return { diterapkan: false, langganan: ada };
    }

    const sesudah = args.hitung(ada);
    this.isi = sesudah;
    this.jumlahSimpan += 1;
    return { diterapkan: true, langganan: sesudah };
  }
}

function buatLangganan(ubah: Partial<Langganan> = {}): Langganan {
  return {
    accountId: AKUN,
    planId: "bulanan",
    periodeMulai: "2025-12-01T00:00:00.000Z",
    periodeBerakhir: "2026-01-20T00:00:00.000Z",
    lastOrderId: "TV-akun0001-lama-0001",
    updatedAt: "2025-12-01T00:00:00.000Z",
    ...ubah,
  };
}

describe("prosesNotifikasiMidtrans - pembayaran lunas", () => {
  it("membuka akses 30 hari untuk pembayaran pertama", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diterapkan");
    expect(hasil.statusPesanan).toBe("selesai");
    expect(hasil.berakhirPada).toBe(PLUS_30_HARI);
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
    expect(subRepo.isi?.periodeBerakhir).toBe(PLUS_30_HARI);
    expect(subRepo.isi?.lastOrderId).toBe(ID_PESANAN);
  });

  it("menerima capture dengan fraud_status accept", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({
        transaction_status: "capture",
        fraud_status: "accept",
      }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diterapkan");
    expect(subRepo.jumlahSimpan).toBe(1);
  });

  it("menyambung dari sisa masa aktif, bukan dari hari ini", async () => {
    /* Pelanggan yang memperpanjang lebih awal tidak boleh kehilangan sisa
       harinya: berakhir 20 Jan + 30 hari = 19 Feb, bukan 9 Feb. */
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu(buatLangganan());

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.berakhirPada).toBe("2026-02-19T00:00:00.000Z");
  });

  it("mulai dari hari ini bila masa aktif sudah lewat", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu(
      buatLangganan({ periodeBerakhir: "2025-07-01T00:00:00.000Z" }),
    );

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.berakhirPada).toBe(PLUS_30_HARI);
  });

  it("memulihkan pesanan yang tertinggal di status dibayar", async () => {
    /* Terjadi bila penulisan langganan gagal setelah dana masuk. Notifikasi
       ulang atau rekonsiliasi harus menyelesaikannya, bukan mengabaikannya. */
    const orderRepo = new OrderRepoPalsu(buatPesanan({ status: "dibayar" }));
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diterapkan");
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
    expect(subRepo.isi?.periodeBerakhir).toBe(PLUS_30_HARI);
  });
});

describe("prosesNotifikasiMidtrans - notifikasi berulang", () => {
  it("tidak menambah masa aktif dua kali untuk satu pembayaran", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const pertama = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });
    const kedua = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: "2026-01-10T00:05:00.000Z",
      orderRepo,
      subRepo,
    });

    expect(pertama.kode).toBe("diterapkan");
    expect(kedua.kode).toBe("diabaikan");
    expect(subRepo.jumlahSimpan).toBe(1);
    expect(subRepo.isi?.periodeBerakhir).toBe(PLUS_30_HARI);
  });

  it("menolak menerapkan ulang lewat penjaga lastOrderId", async () => {
    /* Pesanan tertinggal di dibayar TETAPI langganan sudah mencatatnya:
       masa aktif sudah pernah ditambahkan, jadi hanya statusnya dirapikan. */
    const orderRepo = new OrderRepoPalsu(buatPesanan({ status: "dibayar" }));
    const subRepo = new SubRepoPalsu(
      buatLangganan({
        lastOrderId: ID_PESANAN,
        periodeBerakhir: PLUS_30_HARI,
      }),
    );

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi(),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(hasil.berakhirPada).toBe(PLUS_30_HARI);
    expect(subRepo.jumlahSimpan).toBe(0);
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
  });

  it("mengabaikan notifikasi pending yang tiba setelah lunas", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan({ status: "selesai" }));
    const subRepo = new SubRepoPalsu(
      buatLangganan({ lastOrderId: ID_PESANAN }),
    );

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "pending" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
    expect(subRepo.jumlahSimpan).toBe(0);
  });

  it("mengabaikan pembatalan yang tiba setelah lunas", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan({ status: "selesai" }));
    const subRepo = new SubRepoPalsu(
      buatLangganan({ lastOrderId: ID_PESANAN }),
    );

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "expire" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
  });
});

describe("prosesNotifikasiMidtrans - penolakan", () => {
  it("menolak nominal yang tidak cocok tanpa menyentuh langganan", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ gross_amount: "1000.00" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("nominal_tidak_cocok");
    expect(orderRepo.status(ID_PESANAN)).toBe("menunggu");
    expect(orderRepo.jumlahUpdateSukses).toBe(0);
    expect(subRepo.jumlahSimpan).toBe(0);
  });

  it("menerima gross_amount tanpa desimal", async () => {
    /* Midtrans mengirim "15000.00", tetapi Get Status pernah menjawab "15000".
       Keduanya harus lolos pencocokan nominal. */
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ gross_amount: "15000" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diterapkan");
  });

  it("menahan capture yang masih challenge", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({
        transaction_status: "capture",
        fraud_status: "challenge",
      }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.status(ID_PESANAN)).toBe("menunggu");
    expect(subRepo.jumlahSimpan).toBe(0);
  });

  it("menolak status lunas yang status_code-nya bukan 200", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ status_code: "202" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.status(ID_PESANAN)).toBe("menunggu");
    expect(subRepo.jumlahSimpan).toBe(0);
  });

  it("menjawab pesanan_tidak_ada tanpa melempar", async () => {
    const orderRepo = new OrderRepoPalsu();
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ order_id: "TV-tidak-ada-0000" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("pesanan_tidak_ada");
    expect(hasil.orderId).toBe("TV-tidak-ada-0000");
  });
});

describe("prosesNotifikasiMidtrans - status bukan lunas", () => {
  it("menandai gagal untuk deny", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "deny" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("status_diperbarui");
    expect(hasil.statusPesanan).toBe("gagal");
    expect(orderRepo.status(ID_PESANAN)).toBe("gagal");
    expect(subRepo.jumlahSimpan).toBe(0);
  });

  it("menandai kedaluwarsa untuk expire", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "expire" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.statusPesanan).toBe("kedaluwarsa");
    expect(orderRepo.status(ID_PESANAN)).toBe("kedaluwarsa");
  });

  it("tidak mengubah apa pun bila status sudah sesuai", async () => {
    const orderRepo = new OrderRepoPalsu(buatPesanan());
    const subRepo = new SubRepoPalsu();

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "pending" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.jumlahUpdateSukses).toBe(0);
  });

  it("mengabaikan refund tanpa mengubah status", async () => {
    /* Refund dan chargeback sengaja tidak dipetakan: keputusannya bukan milik
       mesin, dan menutup akses otomatis atas dasar itu bisa salah. */
    const orderRepo = new OrderRepoPalsu(buatPesanan({ status: "selesai" }));
    const subRepo = new SubRepoPalsu(
      buatLangganan({ lastOrderId: ID_PESANAN }),
    );

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: buatNotifikasi({ transaction_status: "refund" }),
      sekarang: SEKARANG,
      orderRepo,
      subRepo,
    });

    expect(hasil.kode).toBe("diabaikan");
    expect(orderRepo.status(ID_PESANAN)).toBe("selesai");
    expect(subRepo.jumlahSimpan).toBe(0);
  });
});
