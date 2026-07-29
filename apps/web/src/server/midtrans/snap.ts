/**
 * Pembuatan transaksi Snap.
 *
 * Berkas ini hanya berbicara dari SERVER ke server. Ia menukar rincian pesanan
 * dengan sepasang nilai dari Midtrans:
 *
 *   - token       dipakai snap.js untuk memunculkan jendela pembayaran di atas
 *                 halaman Tinyverse (mode popup, jalur utama);
 *   - redirectUrl halaman pembayaran milik Midtrans, dipakai sebagai jalur
 *                 cadangan bila snap.js gagal dimuat -- misalnya karena
 *                 pemblokir skrip di peramban pelanggan.
 *
 * Server Key tidak pernah meninggalkan berkas ini. Yang boleh sampai ke
 * peramban hanyalah token pesanan dan Client Key.
 *
 * Tidak ada dependensi baru: pemanggilan HTTP memakai fetch bawaan Node 20.
 */
import "server-only";

import { envMidtrans } from "@/server/env";

/**
 * Berapa lama pesanan boleh dibayar sebelum Midtrans menutupnya.
 *
 * Angka ini dikirim ke Midtrans DAN dipakai menghitung expiresAt lokal, agar
 * keduanya berakhir pada saat yang kira-kira sama.
 */
export const DURASI_BAYAR_MENIT = 60;

/**
 * Selisih pengaman: expiresAt lokal sengaja dibuat lebih LAMBAT daripada masa
 * berlaku di Midtrans.
 *
 * WHY arahnya tidak boleh terbalik: bila jam kita menyatakan kedaluwarsa lebih
 * dulu, sebuah pembayaran yang masuk di menit terakhir akan ditolak oleh mesin
 * status kita sendiri - pelanggan sudah membayar tetapi akses tidak pernah
 * terbuka. Status "kedaluwarsa" karena itu hanya ditulis atas notifikasi
 * `expire` dari Midtrans, tidak pernah atas keputusan jam kita.
 */
export const SELISIH_PENGAMAN_MENIT = 10;

export type HasilSnap = { token: string; redirectUrl: string };

/** Header Basic Auth Midtrans: Server Key sebagai nama pengguna, sandi kosong. */
export function otorisasiBasic(serverKey: string): string {
  return "Basic " + Buffer.from(`${serverKey}:`, "utf8").toString("base64");
}

function potong(teks: string, maks: number): string {
  return teks.length <= maks ? teks : teks.slice(0, maks);
}

export async function buatTransaksiSnap(args: {
  orderId: string;
  hargaRupiah: number;
  planId: string;
  namaPaket: string;
  email: string | null;
  finishUrl: string;
}): Promise<HasilSnap> {
  const { serverKey, urlSnap } = envMidtrans();

  const badan = {
    transaction_details: {
      order_id: args.orderId,
      gross_amount: args.hargaRupiah,
    },
    item_details: [
      {
        id: potong(args.planId, 50),
        price: args.hargaRupiah,
        quantity: 1,
        /* Midtrans membatasi nama barang 50 karakter dan menolak seluruh
           permintaan bila dilanggar. */
        name: potong(args.namaPaket, 50),
      },
    ],
    ...(args.email ? { customer_details: { email: args.email } } : {}),
    credit_card: { secure: true },
    /* callbacks.finish tetap dikirim meski jalur utama kini popup. Ia dipakai
       oleh jalur cadangan redirect, dan oleh metode pembayaran yang memang
       memindahkan pelanggan ke aplikasi lain (mis. dompet digital) lalu
       memulangkannya. */
    callbacks: { finish: args.finishUrl },
    /* start_time sengaja tidak dikirim: formatnya menuntut zona waktu eksplisit
       dan mudah salah. Tanpa start_time, Midtrans menghitung dari saat
       transaksi dibuat, yang justru lebih tepat. */
    expiry: { unit: "minute", duration: DURASI_BAYAR_MENIT },
  };

  const jawaban = await fetch(`${urlSnap}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: otorisasiBasic(serverKey),
    },
    body: JSON.stringify(badan),
    cache: "no-store",
  });

  const teks = await jawaban.text();

  if (!jawaban.ok) {
    throw new Error(
      `Midtrans menolak pembuatan transaksi (HTTP ${jawaban.status}): ` +
        potong(teks, 500),
    );
  }

  let data: { token?: unknown; redirect_url?: unknown };
  try {
    data = JSON.parse(teks) as { token?: unknown; redirect_url?: unknown };
  } catch {
    throw new Error(`Jawaban Snap bukan JSON: ${potong(teks, 300)}`);
  }

  if (typeof data.token !== "string" || typeof data.redirect_url !== "string") {
    throw new Error(`Jawaban Snap tidak lengkap: ${potong(teks, 300)}`);
  }

  return { token: data.token, redirectUrl: data.redirect_url };
}
