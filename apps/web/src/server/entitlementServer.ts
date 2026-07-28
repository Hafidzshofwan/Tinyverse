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
  hitungEntitlement,
  langgananKosong,
  type Entitlement,
} from "@tinyverse/billing";
import { akunAktif } from "./provisioning";
import { bacaSesi, type Sesi } from "./session";
import { FirestoreSubscriptionRepository } from "./subscriptionsAdmin";

export type StatusAkses = {
  masuk: boolean;
  accountId: string | null;
  entitlement: Entitlement;
};

/** Entitlement untuk sesi tertentu. */
export async function entitlementUntuk(sesi: Sesi): Promise<StatusAkses> {
  const accountId = await akunAktif(sesi);
  const repo = new FirestoreSubscriptionRepository();
  const sekarang = new Date().toISOString();

  /* Belum pernah membeli bukan keadaan istimewa: ia hanyalah langganan kosong.
     Dengan begitu jalur kode di bawahnya cuma satu, bukan bercabang dua. */
  const langganan =
    (await repo.get(accountId)) ?? langgananKosong(accountId, sekarang);

  return { masuk: true, accountId, entitlement: hitungEntitlement(langganan, sekarang) };
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
