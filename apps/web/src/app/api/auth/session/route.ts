/**
 * Penukaran sesi: ID Token (klien) -> cookie sesi httpOnly (server).
 *
 * POST   = masuk. Browser mengirim ID Token satu kali saja, lalu melupakannya.
 * DELETE = keluar. Cookie dihapus dan sesi Firebase dicabut.
 *
 * WHY runtime nodejs: Firebase Admin SDK tidak bisa berjalan di Edge Runtime.
 * WHY dynamic force: rute ini membaca cookie, jadi tidak boleh dipraberkas.
 */
import { NextResponse } from "next/server";
import { adminAuth } from "@/server/firebaseAdmin";
import { pastikanUserDanAkun } from "@/server/provisioning";
import {
  atributCookie,
  bacaSesi,
  buatCookieSesi,
  NAMA_COOKIE_SESI,
} from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let idToken: unknown;
  try {
    ({ idToken } = await request.json());
  } catch {
    return NextResponse.json({ error: "Body bukan JSON yang sah." }, { status: 400 });
  }

  if (typeof idToken !== "string" || idToken.length < 20) {
    return NextResponse.json({ error: "idToken tidak sah." }, { status: 400 });
  }

  try {
    /*
     * Verifikasi token DULU, baru buat cookie. Urutan ini penting: kita perlu
     * klaim di dalamnya untuk menyediakan akun, dan kita tidak mau membuat
     * cookie untuk token yang ternyata tidak sah.
     *
     * Argumen kedua = checkRevoked.
     */
    const klaim = await adminAuth().verifyIdToken(idToken, true);

    const { nilai, maxAgeDetik } = await buatCookieSesi(idToken);

    const { accountId, baru } = await pastikanUserDanAkun({
      uid: klaim.uid,
      email: klaim.email ?? null,
      emailTerverifikasi: klaim.email_verified === true,
    });

    /*
     * accountId boleh dikirim ke klien karena ia hanya penunjuk, bukan
     * kewenangan. Setiap permintaan berikutnya tetap menurunkan accountId dari
     * cookie di sisi server — nilai dari klien tidak pernah dipercaya.
     */
    const res = NextResponse.json({ ok: true, accountId, akunBaru: baru });
    res.cookies.set({ ...atributCookie(maxAgeDetik), value: nilai });
    return res;
  } catch (e) {
    const pesan = e instanceof Error ? e.message : String(e);

    /* Firebase menolak ID Token yang lebih tua dari 5 menit. Ini kasus yang
       wajar terjadi, jadi dibedakan agar klien bisa memuat token baru. */
    if (pesan.includes("recent") || pesan.includes("expired")) {
      return NextResponse.json(
        { error: "Token kedaluwarsa. Silakan masuk ulang.", kode: "TOKEN_BASI" },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: "Autentikasi gagal." }, { status: 401 });
  }
}

/**
 * Apakah permintaan ini membawa cookie sesi yang sah?
 *
 * Dipakai klien untuk memutuskan perlu-tidaknya menukar ID Token. Cookie
 * bersifat httpOnly sehingga JavaScript tidak bisa memeriksanya sendiri; tanpa
 * endpoint ini, klien terpaksa menukar sesi pada SETIAP pemuatan halaman.
 *
 * Mengembalikan uid pemilik cookie. Ini bukan kebocoran: uid yang diberikan
 * adalah milik pemanggil sendiri, diturunkan dari cookie-nya sendiri. Klien
 * memerlukannya untuk mengenali cookie milik akun lain yang masih tertinggal di
 * browser yang sama.
 */
export async function GET() {
  const sesi = await bacaSesi();
  return NextResponse.json({
    masuk: sesi !== null,
    uid: sesi ? sesi.uid : null,
  });
}

export async function DELETE() {
  const sesi = await bacaSesi();

  /*
   * Cabut seluruh sesi refresh milik uid ini. Dampaknya: keluar di satu
   * perangkat mengeluarkan semua perangkat. Untuk aplikasi klinis berbayar,
   * sisi aman lebih diutamakan daripada kenyamanan.
   */
  if (sesi) {
    try {
      await adminAuth().revokeRefreshTokens(sesi.uid);
    } catch {
      /* Pencabutan gagal bukan alasan menahan pengguna tetap masuk. */
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...atributCookie(0), value: "" });
  return res;
}
