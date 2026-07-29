/** Adapter Firestore (Admin SDK) untuk port OrderRepository. */
import "server-only";
import type { Pesanan, StatusPesanan } from "@tinyverse/billing";
import type { OrderRepository } from "@tinyverse/data-access";
import { KOLEKSI_BILLING } from "./billingCollections";
import { adminDb } from "./firebaseAdmin";

/** Berapa pesanan termuda yang dipindai untuk mencari yang lewat tempo. */
const PINDAI_TERBARU = 200;

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

  /**
   * Daftar pesanan yang perlu ditanyakan ulang kepada Midtrans.
   *
   * WHY tidak memakai query gabungan "status == menunggu DAN expiresAt <= ...":
   * gabungan kesamaan dan rentang pada dua field berbeda menuntut composite
   * index di Firestore. Index itu harus dibuat dan diterbitkan lebih dulu, dan
   * bila terlupa, query melempar error justru saat pertama kali dijalankan di
   * produksi. Untuk volume pesanan sekecil ini, memindai sejumlah dokumen
   * terbaru lalu menyaringnya di memori jauh lebih murah daripada menambah satu
   * berkas konfigurasi yang bisa tertinggal.
   *
   * Bila kelak pesanan sudah puluhan ribu, inilah tempat yang harus diubah
   * menjadi query ber-index.
   */
  async listPerluRekonsiliasi(args: {
    sampai: string;
    batas: number;
  }): Promise<Pesanan[]> {
    const col = adminDb().collection(KOLEKSI_BILLING.orders);

    /* Kesamaan pada satu field saja - Firestore sudah meng-index-nya sendiri. */
    const tertahanSnap = await col
      .where("status", "==", "dibayar")
      .limit(args.batas)
      .get();

    /* Pengurutan pada satu field saja, juga tanpa index tambahan. Menurun,
       supaya yang diperiksa adalah pesanan termuda: pesanan lama hampir
       seluruhnya sudah berstatus final dan tidak perlu ditanyakan lagi. */
    const terbaruSnap = await col
      .orderBy("expiresAt", "desc")
      .limit(PINDAI_TERBARU)
      .get();

    /* Perbandingan teks pada waktu ISO-8601 UTC sah secara leksikografis:
       seluruh waktu di sistem ini ditulis dengan toISOString(), sehingga
       panjang dan zona waktunya selalu sama. */
    const lewatTempo = terbaruSnap.docs
      .map((d) => d.data() as Pesanan)
      .filter((p) => p.status === "menunggu" && p.expiresAt <= args.sampai);

    const tertahan = tertahanSnap.docs.map((d) => d.data() as Pesanan);

    /* Yang "dibayar" didahulukan: di sanalah dana sudah masuk tetapi akses
       belum terbuka. Dedup berjaga-jaga bila satu pesanan lolos dua saringan. */
    const terkumpul = new Map<string, Pesanan>();
    for (const p of [...tertahan, ...lewatTempo]) {
      if (!terkumpul.has(p.id)) terkumpul.set(p.id, p);
    }

    return [...terkumpul.values()].slice(0, args.batas);
  }
}
