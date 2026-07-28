/**
 * Menukar cookie sesi httpOnly menjadi custom token Firebase.
 *
 * WHY rute ini ada: aplikasi memakai dua SDK Firebase yang terpisah. Login
 * memakai compat SDK, sementara data pasien memakai modular SDK. Keduanya
 * menyimpan status login sendiri-sendiri dan tidak bisa saling melihat, jadi
 * SDK data tidak pernah tahu siapa yang sedang masuk. Akibatnya Security Rules
 * tidak bisa memeriksa pemilik data.
 *
 * Custom token menjembataninya: server memastikan sesi sah lewat cookie, lalu
 * menerbitkan token yang membuat SDK data masuk sebagai UID yang sama persis.
 *
 * UID diambil HANYA dari cookie sesi, tidak pernah dari badan permintaan. Kalau
 * klien boleh menyebut UID sendiri, siapa pun bisa meminta token milik orang
 * lain dan membaca seluruh data pasien mereka.
 */
import { NextResponse } from "next/server";
import { bacaSesi } from "@/server/session";
import { adminAuth } from "@/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ error: "Tidak masuk." }, { status: 401 });
  }

  try {
    const token = await adminAuth().createCustomToken(sesi.uid);
    return NextResponse.json({ token, uid: sesi.uid });
  } catch (e) {
    const pesan = e instanceof Error ? e.message : String(e);
    console.error("Gagal menerbitkan custom token:", pesan);
    return NextResponse.json({ error: "Gagal menerbitkan token." }, { status: 500 });
  }
}
