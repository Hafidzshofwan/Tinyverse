/**
 * Daftar & kelola log error produksi, untuk halaman /admin/error-logs.
 *
 * Pola kewenangan disalin persis dari /api/admin/pengguna: custom claim
 * `role === "admin"` di cookie sesi, BUKAN dokumen users/{uid}. Lihat catatan
 * di route itu untuk alasannya.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/server/firebaseAdmin";
import { NAMA_COOKIE_SESI } from "@/server/session";
import { KOLEKSI_ERROR } from "@/server/errorLogsCollections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type BarisErrorLog = {
  id: string;
  type: string;
  message: string;
  stack: string;
  pathname: string;
  userAgent: string;
  email: string | null;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  resolved: boolean;
};

async function klaimAdmin() {
  const cookie = cookies().get(NAMA_COOKIE_SESI)?.value;
  if (!cookie) return null;
  try {
    const klaim = await adminAuth().verifySessionCookie(cookie, true);
    if (klaim.role !== "admin") return null;
    return klaim;
  } catch {
    return null;
  }
}

export async function GET() {
  const klaim = await klaimAdmin();
  if (!klaim) {
    /* 404, bukan 403: mengikuti pola route admin lain di proyek ini. */
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  }

  const snap = await adminDb()
    .collection(KOLEKSI_ERROR.logs)
    .orderBy("lastSeenAt", "desc")
    .limit(200)
    .get();

  const baris: BarisErrorLog[] = snap.docs.map((doc) => {
    const d = doc.data() as Record<string, unknown>;
    return {
      id: doc.id,
      type: typeof d.type === "string" ? d.type : "unknown",
      message: typeof d.message === "string" ? d.message : "",
      stack: typeof d.stack === "string" ? d.stack : "",
      pathname: typeof d.pathname === "string" ? d.pathname : "",
      userAgent: typeof d.userAgent === "string" ? d.userAgent : "",
      email: typeof d.email === "string" ? d.email : null,
      count: typeof d.count === "number" ? d.count : 0,
      firstSeenAt: typeof d.firstSeenAt === "string" ? d.firstSeenAt : "",
      lastSeenAt: typeof d.lastSeenAt === "string" ? d.lastSeenAt : "",
      resolved: d.resolved === true,
    };
  });

  return NextResponse.json({ ok: true, baris });
}

export async function PATCH(request: Request) {
  const klaim = await klaimAdmin();
  if (!klaim) {
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  }

  let body: { id?: unknown; resolved?: unknown };
  try {
    body = (await request.json()) as { id?: unknown; resolved?: unknown };
  } catch {
    return NextResponse.json({ error: "Isi permintaan tidak valid." }, { status: 400 });
  }

  if (typeof body.id !== "string" || !body.id) {
    return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
  }
  if (typeof body.resolved !== "boolean") {
    return NextResponse.json({ error: "resolved wajib boolean." }, { status: 400 });
  }

  await adminDb()
    .collection(KOLEKSI_ERROR.logs)
    .doc(body.id)
    .set({ resolved: body.resolved }, { merge: true });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const klaim = await klaimAdmin();
  if (!klaim) {
    return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
  }

  await adminDb().collection(KOLEKSI_ERROR.logs).doc(id).delete();

  return NextResponse.json({ ok: true });
}
