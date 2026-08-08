/**
 * Membersihkan dokumen users/ dan memberships/ yang akunnya sudah dihapus
 * dari Firebase Authentication, tapi dokumennya sendiri tertinggal.
 *
 * WHY dokumen bisa tertinggal: menghapus akun lewat Firebase Console (atau
 * lewat Admin SDK di tempat lain) hanya menghapus rekam Authentication-nya.
 * Firestore tidak tahu-menahu soal itu, jadi dokumen users/{uid} dan
 * memberships-nya tetap ada selamanya kecuali ada yang membersihkannya --
 * itulah tugas route ini, dipicu tombol "Sinkronkan" di Kelola Pengguna.
 *
 * WHY subscriptions TIDAK ikut dibersihkan: satu accountId bisa dipakai
 * lebih dari satu uid (anggota tim), jadi menghapus langganan berdasarkan
 * satu uid yang basi berisiko mencabut akses anggota tim lain yang masih
 * aktif. Koleksi itu sengaja dibiarkan.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KOLEKSI } from "@/server/accountsAdmin";
import { adminAuth, adminDb } from "@/server/firebaseAdmin";
import { ambilSemuaUidAuth } from "@/server/authUsers";
import { NAMA_COOKIE_SESI } from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const cookie = cookies().get(NAMA_COOKIE_SESI)?.value;
  if (!cookie) {
    return NextResponse.json({ error: "Tidak masuk." }, { status: 401 });
  }

  let klaim;
  try {
    klaim = await adminAuth().verifySessionCookie(cookie, true);
  } catch {
    return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
  }

  if (klaim.role !== "admin") {
    /* 404, bukan 403: sama seperti GET /api/admin/pengguna, keberadaan
       endpoint administratif tidak perlu dikonfirmasi ke yang tidak berhak. */
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  }

  const db = adminDb();
  const uidAuth = await ambilSemuaUidAuth();

  const [snapUsers, snapMemberships] = await Promise.all([
    db.collection(KOLEKSI.users).get(),
    db.collection(KOLEKSI.memberships).get(),
  ]);

  const penggunaBasi = snapUsers.docs.filter((doc) => !uidAuth.has(doc.id));
  const keanggotaanBasi = snapMemberships.docs.filter((doc) => {
    const data = doc.data() as { uid?: unknown };
    return typeof data.uid === "string" && !uidAuth.has(data.uid);
  });

  const semuaRef = [...penggunaBasi, ...keanggotaanBasi].map((doc) => doc.ref);

  /* Firestore membatasi 500 operasi tulis per batch. */
  for (let i = 0; i < semuaRef.length; i += 500) {
    const batch = db.batch();
    semuaRef.slice(i, i + 500).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }

  return NextResponse.json({
    ok: true,
    penggunaDihapus: penggunaBasi.map((doc) => doc.id),
    jumlahKeanggotaanDihapus: keanggotaanBasi.length,
  });
}
