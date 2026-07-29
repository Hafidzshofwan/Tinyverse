/**
 * GET /api/cron/rekonsiliasi
 *
 * Jaring pengaman pembayaran. Dipanggil otomatis oleh penjadwal Vercel, dan
 * boleh juga dipanggil manual saat ada pelanggan mengeluh aksesnya tidak
 * terbuka.
 *
 * KEAMANAN: alamat ini publik, sedangkan pekerjaannya berwenang memperpanjang
 * langganan. Pembedanya hanya satu, yaitu rahasia CRON_SECRET yang dikirim
 * Vercel sebagai header Authorization. Tanpa rahasia yang cocok, rute ini
 * berpura-pura tidak ada - mengikuti pola rute administratif yang sudah
 * dipakai webhook.
 */
import { NextResponse } from "next/server";

import { envCron } from "@/server/env";
import { ambilStatusTransaksi } from "@/server/midtrans/getStatus";
import { rekonsiliasiPesanan } from "@/server/midtrans/rekonsiliasi";
import { FirestoreOrderRepository } from "@/server/ordersAdmin";
import { FirestoreSubscriptionRepository } from "@/server/subscriptionsAdmin";
import { catatHasilPembayaran } from "@/server/webhookInboxAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(permintaan: Request) {
  const { secret } = envCron();

  if (permintaan.headers.get("authorization") !== "Bearer " + secret) {
    return NextResponse.json({ pesan: "Tidak ditemukan." }, { status: 404 });
  }

  const sekarang = new Date().toISOString();

  try {
    const ringkasan = await rekonsiliasiPesanan({
      sekarang,
      orderRepo: new FirestoreOrderRepository(),
      subRepo: new FirestoreSubscriptionRepository(),
      ambilStatus: (orderId) => ambilStatusTransaksi(orderId),
      catat: async (baris) => {
        /* Yang tidak berubah sengaja tidak dicatat. Menulis satu dokumen untuk
           setiap pesanan yang ternyata baik-baik saja hanya akan menenggelamkan
           kejadian sungguhan di antara ribuan catatan kosong. */
        if (baris.kode === "tidak_berubah") return;

        await catatHasilPembayaran({
          orderId: baris.orderId,
          kode: "rekonsiliasi_" + baris.kode,
          pesan: baris.pesan,
          transactionStatus: baris.transactionStatus,
          sekarang,
        });
      },
    });

    /* Dicetak ke log Vercel juga, supaya hasilnya terbaca tanpa membuka
       Firestore. */
    console.info("[rekonsiliasi] selesai", {
      diperiksa: ringkasan.diperiksa,
      diterapkan: ringkasan.diterapkan,
      ditandaiKedaluwarsa: ringkasan.ditandaiKedaluwarsa,
      perluDitinjau: ringkasan.perluDitinjau,
      gagal: ringkasan.gagal,
    });

    return NextResponse.json(ringkasan);
  } catch (kesalahan) {
    /* Kegagalan menyeluruh - Firestore tak terjangkau, kredensial salah.
       Dijawab 500 supaya terlihat merah di riwayat penjadwal Vercel. */
    console.error("[rekonsiliasi] gagal dijalankan", { kesalahan });
    return NextResponse.json(
      { pesan: "Rekonsiliasi gagal dijalankan." },
      { status: 500 },
    );
  }
}
