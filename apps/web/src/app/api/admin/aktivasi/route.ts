/**
 * Aktivasi manual langganan — HANYA untuk masa sebelum pembayaran menyala.
 *
 * Fase ini sengaja belum menyentuh uang. Tujuannya membuktikan bahwa penyediaan
 * akun, penyimpanan langganan, perhitungan entitlement, dan gerbang akses sudah
 * bekerja utuh SEBELUM Midtrans ditambahkan. Bila keduanya dinyalakan sekaligus
 * lalu ada yang salah, tidak akan jelas mana yang bermasalah — dan mencari
 * tahunya dilakukan sambil uang sungguhan berpindah tangan.
 *
 * Kewenangan berasal dari custom claim `role === "admin"`, BUKAN dari dokumen
 * users/{uid}. Pengguna dapat menulis dokumennya sendiri, sehingga bila status
 * admin diambil dari sana, siapa pun bisa mengangkat dirinya menjadi admin
 * dengan satu operasi tulis dari browser. Custom claim hanya bisa diubah oleh
 * Admin SDK di server.
 *
 * HAPUS berkas ini setelah Fase 5 berjalan.
 */
import { NextResponse } from "next/server";
import { terapkanPembelian } from "@tinyverse/billing";
import { adminAuth } from "@/server/firebaseAdmin";
import { cariPlan } from "@/server/planKatalog";
import { NAMA_COOKIE_SESI } from "@/server/session";
import { FirestoreSubscriptionRepository } from "@/server/subscriptionsAdmin";
import { langgananKosong } from "@tinyverse/billing";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

  let body: { accountId?: unknown; planId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON yang sah." }, { status: 400 });
  }

  const accountId = typeof body.accountId === "string" ? body.accountId : "";
  const planId = typeof body.planId === "string" ? body.planId : "";
  if (!accountId || !planId) {
    return NextResponse.json(
      { error: "accountId dan planId wajib diisi." },
      { status: 400 },
    );
  }

  const plan = cariPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: `Paket "${planId}" tidak dikenal.` }, { status: 400 });
  }

  const repo = new FirestoreSubscriptionRepository();
  const sekarang = new Date().toISOString();
  const sebelumnya =
    (await repo.get(accountId)) ?? langgananKosong(accountId, sekarang);

  /* Memakai fungsi domain yang sama persis dengan yang akan dipakai webhook
     Midtrans nanti. Menulis logika perpanjangan kedua kali di sini berarti
     menguji jalur yang berbeda dari jalur yang kelak dipakai sungguhan. */
  const sesudah = terapkanPembelian({
    langganan: sebelumnya,
    plan,
    orderId: `manual-${sekarang}`,
    sekarang,
  });

  await repo.save(sesudah);

  return NextResponse.json({
    ok: true,
    accountId,
    planId,
    periodeBerakhir: sesudah.periodeBerakhir,
  });
}
