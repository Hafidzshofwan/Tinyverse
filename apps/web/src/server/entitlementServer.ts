/**
 * Gerbang akses premium sisi server.
 *
 * SELURUH keputusan boleh/tidak boleh memakai fitur berbayar melewati berkas
 * ini. Pemeriksaan di komponen klien hanya untuk kenyamanan tampilan; siapa pun
 * bisa melewatinya dengan devtools dalam hitungan detik. Yang menentukan adalah
 * pemeriksaan di sini, karena kode ini tidak pernah sampai ke browser.
 */
import "server-only";
import {
  PERCOBAAN_PLAN_ID,
  hitungEntitlement,
  langgananKosong,
  type Entitlement,
  type Langganan,
} from "@tinyverse/billing";
import { akunAktif } from "./provisioning";
import { bacaSesi, type Sesi } from "./session";
import { FirestoreSubscriptionRepository } from "./subscriptionsAdmin";

export type StatusAkses = {
  masuk: boolean;
  accountId: string | null;
  entitlement: Entitlement;
  /**
   * True bila masa akses ini berasal dari masa percobaan gratis, bukan dari
   * pembelian - baik yang masih berjalan maupun yang sudah berakhir.
   *
   * WHY ada di sini dan BUKAN di dalam Entitlement: `hitungEntitlement` adalah
   * satu-satunya penentu boleh/tidak boleh masuk, dan ia sudah terbukti benar
   * serta terkunci uji. Menambah field ke dalamnya berarti menyentuh jantung
   * gerbang berbayar demi urusan tampilan. Berkas ini toh sudah memuat dokumen
   * langganan untuk keperluannya sendiri, jadi keterangannya cukup ikut
   * dibawa dari sini.
   *
   * PENTING: field ini hanya untuk KALIMAT dan LABEL. Ia tidak boleh dipakai
   * untuk membuka atau menutup fitur apa pun; itu tetap tugas
   * `entitlement.bolehAkses`.
   */
  percobaan: boolean;
};

/**
 * Apakah catatan langganan ini lahir dari masa percobaan?
 *
 * Dua syarat sekaligus, bukan satu: paketnya bertanda percobaan DAN tidak ada
 * nomor pesanan. Nomor pesanan hanya ditulis oleh alur pembayaran, jadi
 * syarat kedua itu memastikan langganan yang sudah pernah dibayar tidak akan
 * pernah salah dibaca sebagai percobaan, sekalipun ada sisa data lama.
 */
function dariPercobaan(langganan: Langganan): boolean {
  return langganan.planId === PERCOBAAN_PLAN_ID && langganan.lastOrderId === null;
}

/** Entitlement untuk sesi tertentu. */
export async function entitlementUntuk(sesi: Sesi): Promise<StatusAkses> {
  const accountId = await akunAktif(sesi);
  const repo = new FirestoreSubscriptionRepository();
  const sekarang = new Date().toISOString();

  /* Belum pernah membeli bukan keadaan istimewa: ia hanyalah langganan kosong.
     Dengan begitu jalur kode di bawahnya cuma satu, bukan bercabang dua. */
  const langganan =
    (await repo.get(accountId)) ?? langgananKosong(accountId, sekarang);

  return {
    masuk: true,
    accountId,
    entitlement: hitungEntitlement(langganan, sekarang),
    percobaan: dariPercobaan(langganan),
  };
}

/** Entitlement untuk permintaan saat ini; aman dipanggil tanpa sesi. */
export async function statusAksesSaatIni(): Promise<StatusAkses> {
  const sesi = await bacaSesi();
  if (!sesi) {
    const sekarang = new Date().toISOString();
    return {
      masuk: false,
      accountId: null,
      entitlement: hitungEntitlement(langgananKosong("", sekarang), sekarang),
      percobaan: false,
    };
  }
  return entitlementUntuk(sesi);
}

/**
 * Penjaga untuk Server Component halaman premium.
 * Alasan penolakan dibedakan agar pemanggil mengalihkan ke tempat yang tepat:
 * masuk dulu, atau berlangganan dulu.
 */
export async function wajibAkses(): Promise<StatusAkses> {
  const status = await statusAksesSaatIni();
  if (!status.masuk) throw new Error("TIDAK_LOGIN");
  if (!status.entitlement.bolehAkses) throw new Error("TIDAK_BERLANGGANAN");
  return status;
}
