/**
 * Verifikasi ganda: menanyakan langsung status transaksi kepada Midtrans.
 *
 * WHY meski tanda tangan sudah lolos: tanda tangan membuktikan pesan itu
 * pernah dibuat dengan Server Key kita, tetapi tidak membuktikan pesan itu
 * masih mutakhir. Sebuah notifikasi lama yang direkam lalu dikirim ulang tetap
 * membawa tanda tangan yang sah. Menanyakan ulang ke Midtrans menjadikan
 * keputusan uang selalu berdasar keadaan terkini di sisi mereka.
 */
import "server-only";

import { envMidtrans } from "@/server/env";
import { otorisasiBasic } from "@/server/midtrans/snap";

export type StatusMidtrans = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
};

function teksAtau(nilai: unknown, bawaan: string): string {
  return typeof nilai === "string" ? nilai : bawaan;
}

/**
 * Mengembalikan null bila Midtrans menyatakan transaksi tidak ada.
 * Melempar hanya untuk kegagalan infrastruktur - pemanggil menerjemahkannya
 * menjadi balasan yang meminta Midtrans mencoba lagi nanti.
 */
export async function ambilStatusTransaksi(
  orderId: string,
): Promise<StatusMidtrans | null> {
  const { serverKey, urlApi } = envMidtrans();

  const jawaban = await fetch(
    `${urlApi}/${encodeURIComponent(orderId)}/status`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: otorisasiBasic(serverKey),
      },
      cache: "no-store",
    },
  );

  const teks = await jawaban.text();

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(teks) as Record<string, unknown>;
  } catch {
    throw new Error(
      `Jawaban Get Status bukan JSON (HTTP ${jawaban.status}): ` +
        teks.slice(0, 300),
    );
  }

  const kode = teksAtau(data["status_code"], "");

  if (kode === "404") return null;

  if (kode === "401" || jawaban.status === 401) {
    /* Bukan kegagalan sementara: kunci salah atau lingkungannya tertukar.
       Mengulanginya tidak akan pernah berhasil. */
    throw new Error(
      "Midtrans menolak Server Key saat membaca status. Periksa " +
        "MIDTRANS_MODE dan MIDTRANS_SERVER_KEY.",
    );
  }

  const status = teksAtau(data["transaction_status"], "");
  if (!kode || !status) {
    throw new Error(
      `Jawaban Get Status tidak lengkap (HTTP ${jawaban.status}): ` +
        teks.slice(0, 300),
    );
  }

  const fraud = data["fraud_status"];
  const bayar = data["payment_type"];
  const trx = data["transaction_id"];

  return {
    order_id: teksAtau(data["order_id"], orderId),
    status_code: kode,
    gross_amount: teksAtau(data["gross_amount"], ""),
    transaction_status: status,
    ...(typeof fraud === "string" ? { fraud_status: fraud } : {}),
    ...(typeof bayar === "string" ? { payment_type: bayar } : {}),
    ...(typeof trx === "string" ? { transaction_id: trx } : {}),
  };
}
