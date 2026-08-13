/**
 * Hapus akun milik pemanggil sendiri -- dipicu tombol "Hapus akun" di
 * halaman /profil.
 *
 * WHY hanya milik sendiri: rute ini SENGAJA tidak menerima uid dari body.
 * uid selalu diturunkan dari cookie sesi, sehingga tidak ada cara bagi
 * siapa pun menghapus akun orang lain lewat rute ini, termasuk admin.
 * Admin yang perlu menonaktifkan akun lain memakai toggle Aktif/Nonaktif
 * di Kelola Pengguna -- itu bisa dibalik, ini tidak.
 *
 * WHY memberships dihapus tapi accounts/subscriptions TIDAK: satu accountId
 * bisa dipakai lebih dari satu uid (anggota tim). Menghapus langganan
 * berdasarkan satu uid yang keluar berisiko mencabut akses anggota tim lain
 * yang masih aktif. Baris keanggotaan uid ini sendiri aman dihapus karena
 * hanya menunjuk dirinya sendiri. Pola yang sama seperti endpoint
 * /api/admin/pengguna/sinkron.
 *
 * Urutan penghapusan penting: data Firestore dulu (selagi sesi masih sah),
 * baru akun Authentication, baru cookie. Membalik urutan ini membuat sesi
 * kedaluwarsa di tengah proses sementara sebagian data belum sempat terhapus.
 */
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebaseAdmin";
import { KOLEKSI } from "@/server/accountsAdmin";
import { atributCookie, wajibSesi } from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  let sesi;
  try {
    sesi = await wajibSesi();
  } catch {
    return NextResponse.json({ error: "Tidak masuk." }, { status: 401 });
  }

  const uid = sesi.uid;
  const db = adminDb();

  try {
    const snapMemberships = await db
      .collection(KOLEKSI.memberships)
      .where("uid", "==", uid)
      .get();

    const batch = db.batch();
    snapMemberships.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection(KOLEKSI.users).doc(uid));
    await batch.commit();
  } catch (e) {
    return NextResponse.json(
      { error: "Gagal menghapus data akun: " + (e as Error).message },
      { status: 500 },
    );
  }

  try {
    await adminAuth().deleteUser(uid);
  } catch (e) {
    /* Data Firestore sudah terhapus di titik ini. Kegagalan di sini paling
       sering berarti akunnya sudah lebih dulu terhapus (mis. lewat Firebase
       Console) -- bukan alasan menampilkan galat ke pengguna yang memang
       ingin akunnya hilang. */
    console.error("Gagal menghapus akun Authentication:", e);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...atributCookie(0), value: "" });
  return res;
}
