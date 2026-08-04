/**
 * Adapter Firestore (Admin SDK) untuk port SubscriptionRepository.
 * Alasan penempatannya di apps/web sama dengan accountsAdmin.ts: Admin SDK
 * membawa kewenangan penuh yang melewati Security Rules, jadi ia tidak boleh
 * berada di package yang bisa ikut terbundel ke browser.
 */
import "server-only";
import type { Langganan } from "@tinyverse/billing";
import type { SubscriptionRepository } from "@tinyverse/data-access";
import { KOLEKSI_BILLING } from "./billingCollections";
import { adminDb } from "./firebaseAdmin";

export class FirestoreSubscriptionRepository implements SubscriptionRepository {
  async get(accountId: string): Promise<Langganan | null> {
    const snap = await adminDb()
      .collection(KOLEKSI_BILLING.subscriptions)
      .doc(accountId)
      .get();
    return snap.exists ? (snap.data() as Langganan) : null;
  }

  async save(langganan: Langganan): Promise<void> {
    /* Id dokumen = accountId, sehingga satu akun secara struktural mustahil
       memiliki dua langganan sekaligus. */
    await adminDb()
      .collection(KOLEKSI_BILLING.subscriptions)
      .doc(langganan.accountId)
      .set(langganan, { merge: true });
  }

  /**
   * Baca-periksa-tulis dalam SATU transaksi Firestore.
   *
   * WHY transaksi, bukan get() lalu save():
   * Notifikasi kiriman ulang dari Midtrans dan putaran rekonsiliasi terjadwal
   * dapat memproses satu pesanan yang sama nyaris bersamaan. Dengan dua
   * operasi terpisah, keduanya membaca langganan yang belum mencatat pesanan
   * itu, keduanya lolos pemeriksaan, dan masa aktif bertambah dua kali untuk
   * satu pembayaran. Firestore menolak transaksi yang dokumennya berubah sejak
   * dibaca, lalu mengulangnya di atas keadaan terbaru - dan pada percobaan
   * kedua itulah lastOrderId sudah tercatat, sehingga penerapan kedua gugur.
   *
   * Karena transaksi bisa diulang, args.hitung wajib murni dan sinkron. Jangan
   * pernah menaruh pemanggilan jaringan atau pencatatan di dalamnya.
   */
  async terapkanSekaliSaja(args: {
    accountId: string;
    orderId: string;
    hitung: (langganan: Langganan | null) => Langganan;
  }): Promise<{ diterapkan: boolean; langganan: Langganan }> {
    const db = adminDb();
    const ref = db
      .collection(KOLEKSI_BILLING.subscriptions)
      .doc(args.accountId);

    return db.runTransaction(async (trx) => {
      const snap = await trx.get(ref);
      const ada = snap.exists ? (snap.data() as Langganan) : null;

      if (ada && ada.lastOrderId === args.orderId) {
        return { diterapkan: false, langganan: ada };
      }

      const sesudah = args.hitung(ada);
      trx.set(ref, sesudah, { merge: true });
      return { diterapkan: true, langganan: sesudah };
    });
  }
}
