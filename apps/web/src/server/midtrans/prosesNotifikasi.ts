/**
 * Inti keputusan webhook Midtrans.
 *
 * Berkas ini sengaja tidak mengenal HTTP, Firebase, jam sistem, maupun
 * environment variable. Semua kebergantungan masuk lewat argumen, sehingga
 * seluruh skenario uang - notifikasi ganda, notifikasi yang tiba terbalik,
 * nominal yang tidak cocok - dapat diuji tanpa jaringan sama sekali.
 *
 * ATURAN PENTING: fungsi ini TIDAK PERNAH melempar untuk kondisi yang sudah
 * diperkirakan. Setiap kemungkinan dijawab dengan sebuah hasil. Alasannya ada
 * di lapisan rute: balasan selain 200 membuat Midtrans mengirim ulang
 * notifikasi yang sama berulang kali. Kesalahan yang tidak akan pernah membaik
 * dengan pengulangan harus tetap dijawab 200, cukup dicatat untuk manusia.
 */
import {
  bolehBeralih,
  langgananKosong,
  petakanStatusMidtrans,
  terapkanPembelian,
} from "@tinyverse/billing";
import type { Plan, StatusPesanan } from "@tinyverse/billing";
import type {
  OrderRepository,
  SubscriptionRepository,
} from "@tinyverse/data-access";

/** Bentuk notifikasi setelah tanda tangannya terbukti sah. */
export type NotifikasiTerverifikasi = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
};

export type KodeHasil =
  | "diterapkan"
  | "status_diperbarui"
  | "diabaikan"
  | "pesanan_tidak_ada"
  | "nominal_tidak_cocok";

export type HasilProses = {
  kode: KodeHasil;
  pesan: string;
  orderId: string;
  statusPesanan: StatusPesanan | null;
  berakhirPada: string | null;
};

export async function prosesNotifikasiMidtrans(args: {
  notifikasi: NotifikasiTerverifikasi;
  sekarang: string;
  orderRepo: OrderRepository;
  subRepo: SubscriptionRepository;
}): Promise<HasilProses> {
  const { notifikasi: n, sekarang, orderRepo, subRepo } = args;

  const jawab = (
    kode: KodeHasil,
    pesan: string,
    statusPesanan: StatusPesanan | null = null,
    berakhirPada: string | null = null,
  ): HasilProses => ({
    kode,
    pesan,
    orderId: n.order_id,
    statusPesanan,
    berakhirPada,
  });

  /*
   * Satu pembacaan dokumen langsung, tanpa query dan tanpa indeks: id pesanan
   * memang sengaja dibuat sama dengan midtransOrderId saat checkout.
   */
  const pesanan = await orderRepo.findById(n.order_id);
  if (!pesanan) {
    /* Pesanan selalu ditulis SEBELUM transaksi Snap dibuat, jadi ini bukan
       perlombaan waktu melainkan kejanggalan. Tetap dijawab 200: mengirim
       ulang selamanya tidak akan memunculkan pesanan yang tidak ada. */
    return jawab("pesanan_tidak_ada", "Pesanan tidak ditemukan di basis data.");
  }

  /*
   * Nominal wajib dicocokkan. Tanda tangan hanya membuktikan pesan berasal
   * dari Midtrans, bukan bahwa jumlahnya benar. Tanpa pemeriksaan ini, sebuah
   * pesanan yang nominalnya sempat berubah bisa membuka akses penuh.
   */
  const dibayarkan = Number(n.gross_amount);
  if (
    !Number.isFinite(dibayarkan) ||
    Math.round(dibayarkan) !== pesanan.snapshotHarga.hargaRupiah
  ) {
    return jawab(
      "nominal_tidak_cocok",
      `Nominal notifikasi (${n.gross_amount}) berbeda dari harga pesanan ` +
        `(${pesanan.snapshotHarga.hargaRupiah}). Perlu ditinjau manusia.`,
      pesanan.status,
    );
  }

  const target = petakanStatusMidtrans({
    transaction_status: n.transaction_status,
    fraud_status: n.fraud_status,
  });

  if (target === null) {
    /* Termasuk capture+challenge, refund, dan chargeback: belum ada keputusan,
       atau keputusannya bukan milik mesin. */
    return jawab(
      "diabaikan",
      `Status "${n.transaction_status}" tidak mengubah apa pun.`,
      pesanan.status,
    );
  }

  if (target === "dibayar") {
    /*
     * status_code ikut ditandatangani, sehingga tepercaya setelah SHA512 lolos.
     * Pemeriksaannya diletakkan di sini, bukan dengan mengubah
     * petakanStatusMidtrans yang sengaja dijaga murni.
     */
    if (n.status_code !== "200") {
      return jawab(
        "diabaikan",
        `Status pembayaran terbaca lunas tetapi status_code ${n.status_code}.`,
        pesanan.status,
      );
    }

    if (pesanan.status === "menunggu") {
      const naik = await orderRepo.updateStatus({
        id: pesanan.id,
        dariStatus: "menunggu",
        keStatus: "dibayar",
        padaWaktu: sekarang,
      });
      /* Penulisan bersyarat di dalam transaksi Firestore. Bila dua notifikasi
         tiba bersamaan, hanya satu yang menang; yang kalah berhenti di sini. */
      if (!naik) {
        return jawab(
          "diabaikan",
          "Pesanan sedang diproses notifikasi lain.",
          pesanan.status,
        );
      }
    } else if (pesanan.status !== "dibayar") {
      return jawab(
        "diabaikan",
        `Pesanan sudah berstatus "${pesanan.status}"; tidak diubah lagi.`,
        pesanan.status,
      );
    }

    /* Sampai titik ini pesanan pasti berstatus "dibayar". Status "dibayar"
       yang tertinggal - misalnya karena penulisan langganan sempat gagal -
       sengaja dipulihkan di sini, bukan diabaikan. */
    const langganan =
      (await subRepo.get(pesanan.accountId)) ??
      langgananKosong(pesanan.accountId, sekarang);

    /*
     * Kunci anti-perpanjangan-ganda. Bila langganan sudah mencatat pesanan ini
     * sebagai pembelian terakhirnya, masa aktif sudah pernah ditambahkan dan
     * tidak boleh ditambahkan lagi - berapa kali pun notifikasi diulang.
     */
    if (langganan.lastOrderId === pesanan.id) {
      await orderRepo.updateStatus({
        id: pesanan.id,
        dariStatus: "dibayar",
        keStatus: "selesai",
        padaWaktu: sekarang,
      });
      return jawab(
        "diabaikan",
        "Pembelian ini sudah pernah diterapkan.",
        "selesai",
        langganan.periodeBerakhir,
      );
    }

    /*
     * Paket disusun dari snapshot harga yang dibekukan saat pesanan dibuat,
     * BUKAN dibaca ulang dari katalog. Bila harga atau durasi paket berubah
     * setelah pelanggan membayar, yang berlaku tetap yang mereka setujui.
     */
    const s = pesanan.snapshotHarga;
    const plan: Plan = {
      id: s.planId,
      nama: s.nama,
      durasiHari: s.durasiHari,
      hargaRupiah: s.hargaRupiah,
      aktif: true,
    };

    const sesudah = terapkanPembelian({
      langganan,
      plan,
      orderId: pesanan.id,
      sekarang,
    });
    await subRepo.save(sesudah);

    /* Urutannya disengaja: langganan disimpan lebih dulu, baru pesanan
       ditandai selesai. Bila proses terputus di antara keduanya, pesanan
       tertinggal di "dibayar" dan notifikasi ulang akan merapikannya lewat
       pemeriksaan lastOrderId di atas. Urutan sebaliknya akan kehilangan
       jejak bahwa masa aktif belum sempat ditambahkan. */
    await orderRepo.updateStatus({
      id: pesanan.id,
      dariStatus: "dibayar",
      keStatus: "selesai",
      padaWaktu: sekarang,
    });

    return jawab(
      "diterapkan",
      `Akses aktif sampai ${sesudah.periodeBerakhir ?? "-"}.`,
      "selesai",
      sesudah.periodeBerakhir,
    );
  }

  /*
   * Sisanya - menunggu, gagal, dibatalkan, kedaluwarsa - hanya mengubah status
   * pesanan. bolehBeralih dipakai alih-alih beralih() karena beralih()
   * melempar, dan lemparan di sini akan berubah menjadi balasan 500 yang
   * membuat Midtrans mengirim ulang selamanya. Contoh nyatanya: notifikasi
   * "pending" yang tiba terlambat setelah "settlement" sudah diproses.
   */
  if (target === pesanan.status) {
    return jawab("diabaikan", "Status sudah sesuai.", pesanan.status);
  }

  if (!bolehBeralih(pesanan.status, target)) {
    return jawab(
      "diabaikan",
      `Peralihan "${pesanan.status}" ke "${target}" tidak diizinkan; ` +
        "notifikasi ini tiba terlambat.",
      pesanan.status,
    );
  }

  const berhasil = await orderRepo.updateStatus({
    id: pesanan.id,
    dariStatus: pesanan.status,
    keStatus: target,
    padaWaktu: sekarang,
  });

  return berhasil
    ? jawab("status_diperbarui", `Status menjadi "${target}".`, target)
    : jawab(
        "diabaikan",
        "Pesanan sedang diproses notifikasi lain.",
        pesanan.status,
      );
}
