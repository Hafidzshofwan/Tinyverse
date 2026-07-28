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
}
