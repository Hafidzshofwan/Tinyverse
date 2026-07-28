/** Adapter Firestore (Admin SDK) untuk port OrderRepository. */
import "server-only";
import type { Pesanan, StatusPesanan } from "@tinyverse/billing";
import type { OrderRepository } from "@tinyverse/data-access";
import { KOLEKSI_BILLING } from "./billingCollections";
import { adminDb } from "./firebaseAdmin";

export class FirestoreOrderRepository implements OrderRepository {
  async create(pesanan: Pesanan): Promise<void> {
    /* create(), bukan set(): Firestore menolak bila id sudah dipakai.
       Menimpa pesanan lama berarti menghapus jejak transaksi bernilai uang. */
    await adminDb().collection(KOLEKSI_BILLING.orders).doc(pesanan.id).create(pesanan);
  }

  async findById(id: string): Promise<Pesanan | null> {
    const snap = await adminDb().collection(KOLEKSI_BILLING.orders).doc(id).get();
    return snap.exists ? (snap.data() as Pesanan) : null;
  }

  async findByMidtransOrderId(midtransOrderId: string): Promise<Pesanan | null> {
    const snap = await adminDb()
      .collection(KOLEKSI_BILLING.orders)
      .where("midtransOrderId", "==", midtransOrderId)
      .limit(1)
      .get();
    const doc = snap.docs[0];
    return doc ? (doc.data() as Pesanan) : null;
  }

  async listByAccount(accountId: string): Promise<Pesanan[]> {
    const snap = await adminDb()
      .collection(KOLEKSI_BILLING.orders)
      .where("accountId", "==", accountId)
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => d.data() as Pesanan);
  }

  /**
   * Penulisan bersyarat sungguhan, di dalam transaksi Firestore.
   *
   * Membaca lalu menulis sebagai dua operasi terpisah TIDAK cukup: dua
   * notifikasi Midtrans yang tiba bersamaan bisa sama-sama membaca "menunggu"
   * sebelum salah satunya sempat menulis, lalu keduanya memperpanjang langganan
   * untuk satu pembayaran yang sama. Transaksi menyatukan baca-dan-tulis; yang
   * kalah diulang otomatis oleh Firestore, membaca status yang sudah berubah,
   * lalu mundur dengan jawaban false.
   */
  async updateStatus(args: {
    id: string;
    dariStatus: StatusPesanan;
    keStatus: StatusPesanan;
    padaWaktu: string;
  }): Promise<boolean> {
    const db = adminDb();
    const ref = db.collection(KOLEKSI_BILLING.orders).doc(args.id);

    return db.runTransaction(async (trx) => {
      const snap = await trx.get(ref);
      if (!snap.exists) return false;

      const status = (snap.data() as Pesanan).status;
      if (status !== args.dariStatus) return false;

      trx.update(ref, { status: args.keStatus, updatedAt: args.padaWaktu });
      return true;
    });
  }
}
