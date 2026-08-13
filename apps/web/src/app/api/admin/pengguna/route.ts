/**
 * Daftar pengguna beserta status langganannya, untuk modal Kelola Pengguna.
 *
 * WHY route ini ada dan bukan query langsung dari klien: koleksi
 * `subscriptions` hanya boleh disentuh Admin SDK, dan Admin SDK melewati
 * Security Rules sehingga tidak boleh ikut terbundel ke peramban. Modal admin
 * adalah komponen klien, jadi satu-satunya jalan yang aman adalah bertanya ke
 * server.
 *
 * WHY status langganan dihitung di sini, bukan dibaca dari sebuah kolom:
 * dokumen langganan sengaja TIDAK punya field `status` (lihat
 * packages/billing/src/subscription/types.ts). Langganan yang berakhir pukul
 * 00:00 tidak mengirim sinyal apa pun ke basis data, sehingga kolom status yang
 * disimpan pasti akan basi. Karena itu tabel ini memanggil `hitungEntitlement`,
 * fungsi yang sama persis dengan penentu hak akses sungguhan - daftar admin
 * mustahil menampilkan kesimpulan yang berbeda dari gerbang berbayar.
 *
 * Kewenangan diambil dari custom claim `role === "admin"`, BUKAN dari dokumen
 * users/{uid}. Pengguna dapat menulis dokumennya sendiri, jadi status admin
 * yang diambil dari sana bisa diangkat sendiri lewat satu operasi tulis dari
 * peramban.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PERCOBAAN_PLAN_ID,
  hitungEntitlement,
  langgananKosong,
  type Langganan,
  type StatusLangganan,
} from "@tinyverse/billing";
import { KOLEKSI } from "@/server/accountsAdmin";
import { KOLEKSI_BILLING } from "@/server/billingCollections";
import { adminAuth, adminDb } from "@/server/firebaseAdmin";
import { NAMA_COOKIE_SESI } from "@/server/session";
import { ambilWaktuBuatAuth } from "@/server/authUsers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type RingkasLangganan = {
  status: StatusLangganan;
  /** Hanya untuk label. Jangan dipakai membuka atau menutup fitur. */
  percobaan: boolean;
  berakhirPada: string | null;
  sisaHari: number;
  planId: string | null;
};

export type BarisPenggunaAdmin = {
  id: string;
  nama: string;
  email: string;
  role: string;
  aktif: boolean;
  saya: boolean;
  accountId: string | null;
  dibuat: number;
  langganan: RingkasLangganan;
};

/* Riwayat: sebelumnya diurutkan berdasarkan status langganan (kedaluwarsa di
   atas). Diganti atas permintaan pemilik menjadi urutan waktu pendaftaran
   akun, terbaru di atas -- lihat sort di bawah. */

export async function GET() {
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
    /* 404, bukan 403: keberadaan endpoint administratif tidak perlu
       dikonfirmasi kepada orang yang tidak berhak memakainya. */
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  }

  const db = adminDb();
  const sekarang = new Date().toISOString();

  /* Empat pembacaan menyeluruh sekaligus, lalu dijodohkan di memori. Alternatifnya
     satu query langganan per pengguna, yang berarti N perjalanan ke Firestore
     untuk satu kali buka modal. */
  const [snapUsers, snapMemberships, snapSubs, waktuBuatAuth] = await Promise.all([
    db.collection(KOLEKSI.users).get(),
    db.collection(KOLEKSI.memberships).get(),
    db.collection(KOLEKSI_BILLING.subscriptions).get(),
    ambilWaktuBuatAuth(),
  ]);
  const uidAuth = new Set(waktuBuatAuth.keys());

  /* Dokumen users/{uid} TIDAK otomatis ikut terhapus saat akun
     Authentication-nya dihapus manual (mis. lewat Firebase Console). Baris
     yang uid-nya sudah tidak ada di Authentication disaring di sini supaya
     akun yang sudah dihapus tidak tampil lagi -- lihat juga endpoint
     /api/admin/pengguna/sinkron yang benar-benar membersihkan dokumennya. */
  const dokumenPenggunaAktif = snapUsers.docs.filter((doc) =>
    uidAuth.has(doc.id),
  );

  const akunPerUid = new Map<string, string>();
  snapMemberships.forEach((d) => {
    const data = d.data() as { uid?: unknown; accountId?: unknown };
    if (typeof data.uid === "string" && typeof data.accountId === "string") {
      if (!akunPerUid.has(data.uid)) akunPerUid.set(data.uid, data.accountId);
    }
  });

  const langgananPerAkun = new Map<string, Langganan>();
  snapSubs.forEach((d) => {
    langgananPerAkun.set(d.id, d.data() as Langganan);
  });

  const baris: BarisPenggunaAdmin[] = dokumenPenggunaAktif.map((doc) => {
    const d = doc.data() as Record<string, unknown>;
    const accountId = akunPerUid.get(doc.id) ?? null;

    /* Cadangan memakai uid sebagai id dokumen langganan: akun yang disediakan
       sebelum koleksi memberships terisi tetap terbaca, alih-alih tampil
       sebagai "belum mulai" padahal sebenarnya berlangganan. */
    const langganan =
      (accountId ? langgananPerAkun.get(accountId) : undefined) ??
      langgananPerAkun.get(doc.id) ??
      null;

    const ent = hitungEntitlement(
      langganan ?? langgananKosong(accountId ?? doc.id, sekarang),
      sekarang,
    );

    return {
      id: doc.id,
      nama: typeof d.nama === "string" && d.nama ? d.nama : "-",
      email: typeof d.email === "string" ? d.email : "",
      role: d.role === "admin" ? "admin" : "user",
      aktif: d.aktif !== false,
      saya: doc.id === klaim.uid,
      accountId,
      dibuat: waktuBuatAuth.get(doc.id) ?? 0,
      langganan: {
        status: ent.status,
        percobaan:
          langganan !== null &&
          langganan.planId === PERCOBAAN_PLAN_ID &&
          langganan.lastOrderId === null,
        berakhirPada: ent.berakhirPada,
        sisaHari: ent.sisaHari,
        planId: langganan?.planId ?? null,
      },
    };
  });

  /* Terbaru duluan. Akun tanpa `dibuat` tercatat (data lama) jatuh ke paling
     bawah, bukan ke atas -- dianggap seolah "paling lama" agar tidak
     menutupi pendaftar baru yang sungguhan. */
  baris.sort((a, b) => b.dibuat - a.dibuat);

  return NextResponse.json({ ok: true, sekarang, baris });
}
