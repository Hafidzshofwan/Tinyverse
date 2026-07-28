/**
 * POST /api/midtrans/webhook
 *
 * Satu-satunya jalan masuk yang boleh membuka akses berbayar.
 *
 * Alamat ini publik: siapa pun boleh mengirim POST ke sini. Karena itu
 * urutan penjagaannya tidak boleh dibalik:
 *   1. tanda tangan SHA512 - membuktikan pengirimnya Midtrans;
 *   2. Get Status API   - membuktikan keadaannya masih mutakhir;
 *   3. pemrosesan       - keputusan uang, di berkas terpisah yang dapat diuji.
 *
 * ATURAN BALASAN, dan ini yang paling mudah salah:
 * Midtrans mengirim ulang notifikasi selama balasannya bukan 200. Maka hanya
 * kegagalan yang MASUK AKAL DIULANG - Firestore tak terjangkau, Get Status
 * mati - yang boleh dijawab selain 200. Notifikasi yang tiba terlambat,
 * nominal yang tidak cocok, atau pesanan yang tidak ada tetap dijawab 200:
 * mengulanginya seribu kali tidak akan mengubah hasilnya, dan hanya akan
 * membanjiri riwayat notifikasi sampai kejadian sungguhan tenggelam.
 */
import { BillingError } from "@tinyverse/billing";
import { NextResponse } from "next/server";

import { envMidtrans } from "@/server/env";
import { ambilStatusTransaksi } from "@/server/midtrans/getStatus";
import { prosesNotifikasiMidtrans } from "@/server/midtrans/prosesNotifikasi";
import {
  hitungTandaTangan,
  tandaTanganCocok,
} from "@/server/midtrans/tandaTangan";
import { FirestoreOrderRepository } from "@/server/ordersAdmin";
import { FirestoreSubscriptionRepository } from "@/server/subscriptionsAdmin";
import {
  catatHasilPembayaran,
  catatWebhookMentah,
} from "@/server/webhookInboxAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* 404 dipakai alih-alih 401, mengikuti pola rute administratif yang sudah ada:
   endpoint ini sebaiknya tidak mengakui keberadaan dirinya kepada pemindai. */
const TIDAK_DIKENALI = () =>
  NextResponse.json({ pesan: "Tidak ditemukan." }, { status: 404 });

function teksAtau(nilai: unknown, bawaan: string): string {
  return typeof nilai === "string" ? nilai : bawaan;
}

export async function POST(permintaan: Request) {
  let mentah: Record<string, unknown>;
  try {
    mentah = (await permintaan.json()) as Record<string, unknown>;
  } catch {
    return TIDAK_DIKENALI();
  }

  const orderId = teksAtau(mentah["order_id"], "");
  const statusCode = teksAtau(mentah["status_code"], "");
  /* gross_amount dipakai APA ADANYA sebagai teks. Midtrans mengirim
     "15000.00"; mengubahnya menjadi angka lalu kembali ke teks menghasilkan
     "15000" dan tanda tangan tidak akan pernah cocok. */
  const grossAmount = teksAtau(mentah["gross_amount"], "");
  const tandaTangan = teksAtau(mentah["signature_key"], "");

  if (!orderId || !statusCode || !grossAmount || !tandaTangan) {
    return TIDAK_DIKENALI();
  }

  const { serverKey } = envMidtrans();

  const seharusnya = hitungTandaTangan({
    orderId,
    statusCode,
    grossAmount,
    serverKey,
  });

  if (!tandaTanganCocok(tandaTangan, seharusnya)) {
    /* Sengaja tidak mencatat apa pun ke Firestore di sini. Menulis setiap
       kiriman yang gagal berarti mengizinkan orang luar menggemukkan basis
       data kita sesuka hati. */
    console.warn("[midtrans] tanda tangan tidak sah", { orderId });
    return TIDAK_DIKENALI();
  }

  const sekarang = new Date().toISOString();

  try {
    await catatWebhookMentah({ orderId, payload: mentah, sekarang });

    /*
     * Verifikasi ganda. Yang dipakai untuk mengambil keputusan adalah jawaban
     * Get Status, bukan isi notifikasi - sebuah notifikasi lama yang direkam
     * lalu dikirim ulang tetap membawa tanda tangan yang sah.
     */
    const resmi = await ambilStatusTransaksi(orderId);

    if (!resmi) {
      /* Tanda tangannya sah tetapi Midtrans tidak mengenal transaksinya.
         Janggal, dan tidak akan membaik dengan diulang. */
      await catatHasilPembayaran({
        orderId,
        kode: "tidak_ada_di_midtrans",
        pesan: "Get Status menyatakan transaksi tidak ada.",
        transactionStatus: teksAtau(mentah["transaction_status"], ""),
        sekarang,
      });
      return NextResponse.json({ kode: "tidak_ada_di_midtrans" });
    }

    const hasil = await prosesNotifikasiMidtrans({
      notifikasi: {
        order_id: orderId,
        status_code: resmi.status_code,
        gross_amount: resmi.gross_amount || grossAmount,
        transaction_status: resmi.transaction_status,
        ...(resmi.fraud_status ? { fraud_status: resmi.fraud_status } : {}),
      },
      sekarang,
      orderRepo: new FirestoreOrderRepository(),
      subRepo: new FirestoreSubscriptionRepository(),
    });

    await catatHasilPembayaran({
      orderId,
      kode: hasil.kode,
      pesan: hasil.pesan,
      transactionStatus: resmi.transaction_status,
      sekarang,
    });

    return NextResponse.json({
      kode: hasil.kode,
      pesan: hasil.pesan,
      status: hasil.statusPesanan,
    });
  } catch (kesalahan) {
    if (kesalahan instanceof BillingError) {
      /* Pelanggaran aturan domain berarti datanya memang begitu; mengulang
         notifikasi yang sama tidak akan mengubahnya. Dijawab 200 agar tidak
         terulang selamanya, tetapi dicatat keras supaya terlihat manusia. */
      console.error("[midtrans] aturan billing menolak", {
        orderId,
        code: kesalahan.code,
        message: kesalahan.message,
      });
      return NextResponse.json({ kode: "ditolak_aturan" });
    }

    /* Kegagalan infrastruktur. Inilah satu-satunya keadaan yang pantas
       diulang, jadi balasannya sengaja bukan 200. */
    console.error("[midtrans] gagal memproses notifikasi", {
      orderId,
      kesalahan,
    });
    return NextResponse.json(
      { pesan: "Gagal memproses. Silakan kirim ulang." },
      { status: 503 },
    );
  }
}
