/**
 * Status langganan pengguna yang sedang masuk.
 *
 * WHY accountId tidak diterima dari klien: bila endpoint ini menerima
 * accountId sebagai parameter, siapa pun bisa menanyakan (dan kelak memakai)
 * langganan milik akun orang lain. accountId SELALU diturunkan dari cookie.
 */
import { NextResponse } from "next/server";
import { statusAksesSaatIni } from "@/server/entitlementServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await statusAksesSaatIni();

  if (!status.masuk) {
    return NextResponse.json(
      { masuk: false, bolehAkses: false, status: "belum" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    masuk: true,
    status: status.entitlement.status,
    bolehAkses: status.entitlement.bolehAkses,
    berakhirPada: status.entitlement.berakhirPada,
    sisaHari: status.entitlement.sisaHari,
  });
}
