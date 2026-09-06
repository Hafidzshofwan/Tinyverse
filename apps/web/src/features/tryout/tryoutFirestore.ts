/**
 * tryoutFirestore.ts
 * ------------------
 * Helper untuk membaca & menulis riwayat tryout ke Firestore,
 * menggunakan compat SDK yang sudah ada di proyek.
 *
 * Struktur koleksi:
 *   tryoutHistory/{uid}/paket/{paketId}
 *     → field: riwayat  (HasilTryOut[])   — maks 10 sesi terbaru
 *     → field: updatedAt (number)          — timestamp Unix ms
 *
 * Alasan flat-doc (bukan sub-koleksi per sesi):
 *  - Satu read/write per paket cukup untuk dashboard evaluasi.
 *  - Menghindari biaya banyak dokumen kecil.
 *  - Mudah migrate ke struktur lain bila perlu.
 */

import { initFirebase } from "@/shared/firebase/firebaseClient";
import type { HasilTryOut } from "./types";

const KOLEKSI_ROOT = "tryoutHistory";
const MAX_RIWAYAT = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = any;

/** Ambil riwayat satu paket milik user. */
export async function ambilRiwayatPaket(
  uid: string,
  paketId: string,
): Promise<HasilTryOut[]> {
  const { db } = await initFirebase();
  const ref = db
    .collection(KOLEKSI_ROOT)
    .doc(uid)
    .collection("paket")
    .doc(paketId);
  const snap = await ref.get();
  if (!snap.exists) return [];
  const data: AnyDoc = snap.data();
  if (!Array.isArray(data?.riwayat)) return [];
  return data.riwayat as HasilTryOut[];
}

/** Tambahkan satu hasil baru ke riwayat paket (simpan maks 10 terbaru). */
export async function simpanHasilPaket(
  uid: string,
  paketId: string,
  hasilBaru: HasilTryOut,
): Promise<HasilTryOut[]> {
  const { db } = await initFirebase();
  const ref = db
    .collection(KOLEKSI_ROOT)
    .doc(uid)
    .collection("paket")
    .doc(paketId);

  // Baca dulu agar tidak overwrite riwayat lain dari perangkat berbeda
  const snap = await ref.get();
  const existing: HasilTryOut[] = snap.exists
    ? ((snap.data() as AnyDoc)?.riwayat ?? [])
    : [];

  const updated = [hasilBaru, ...existing].slice(0, MAX_RIWAYAT);

  await ref.set(
    { riwayat: updated, updatedAt: Date.now() },
    { merge: false }, // tulis ulang field ini sepenuhnya
  );

  return updated;
}

/** Ambil riwayat SEMUA paket milik user (untuk dashboard evaluasi global). */
export async function ambilSemuaRiwayat(
  uid: string,
): Promise<Record<string, HasilTryOut[]>> {
  const { db } = await initFirebase();
  const snapshot = await db
    .collection(KOLEKSI_ROOT)
    .doc(uid)
    .collection("paket")
    .get();

  const hasil: Record<string, HasilTryOut[]> = {};
  snapshot.forEach((doc: AnyDoc) => {
    const data: AnyDoc = doc.data();
    if (Array.isArray(data?.riwayat)) {
      hasil[doc.id] = data.riwayat as HasilTryOut[];
    }
  });
  return hasil;
}
