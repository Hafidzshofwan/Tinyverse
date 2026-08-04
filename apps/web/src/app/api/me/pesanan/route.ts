/**
 * GET /api/me/pesanan
 *
 * Riwayat pesanan milik pengguna yang sedang masuk, terbaru lebih dulu.
 *
 * WHY accountId tidak diterima dari klien: sama seperti /api/me/entitlement,
 * accountId SELALU diturunkan dari cookie sesi, supaya seseorang tidak bisa
 * meminta riwayat pembayaran milik akun orang lain.
 */
import { NextResponse } from "next/server";

import { riwayatPesanan } from "@/server/pesananRiwayat";
import { akunAktif } from "@/server/provisioning";
import { bacaSesi } from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ masuk: false, daftar: [] }, { status: 401 });
  }

  const accountId = await akunAktif(sesi);
  const daftar = await riwayatPesanan(accountId);

  return NextResponse.json({ masuk: true, daftar });
}
