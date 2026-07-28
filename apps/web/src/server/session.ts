/**
 * Sesi pengguna berbasis session cookie Firebase.
 *
 * WHY cookie, bukan ID Token di localStorage:
 *  1. localStorage bisa dibaca JavaScript mana pun — satu celah XSS berarti
 *     akun terbajak. Cookie httpOnly tidak bisa disentuh JavaScript.
 *  2. Cookie ikut terkirim otomatis saat navigasi, sehingga Server Component
 *     sudah tahu siapa penggunanya SEBELUM HTML dikirim. Tanpa itu, halaman
 *     premium akan berkedip: tampil sekejap lalu baru dialihkan.
 *  3. Cookie sesi bisa dicabut server-side; ID Token tidak.
 */
import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";
import { SESI_BERLAKU_HARI } from "./env";

export const NAMA_COOKIE_SESI = "tv_sesi";

const MS_PER_HARI = 24 * 60 * 60 * 1000;

export type Sesi = {
  uid: string;
  email: string | null;
  emailTerverifikasi: boolean;
};

/**
 * Tukar ID Token (dari SDK klien) menjadi cookie sesi.
 *
 * Firebase menolak ID Token yang dibuat lebih dari 5 menit lalu. Ini disengaja:
 * memaksa penukaran terjadi tepat setelah login sungguhan, bukan dari token
 * lama yang mungkin sudah bocor.
 */
export async function buatCookieSesi(idToken: string): Promise<{
  nilai: string;
  maxAgeDetik: number;
}> {
  const expiresIn = SESI_BERLAKU_HARI * MS_PER_HARI;
  const nilai = await adminAuth().createSessionCookie(idToken, { expiresIn });
  return { nilai, maxAgeDetik: Math.floor(expiresIn / 1000) };
}

/**
 * Baca sesi dari cookie permintaan saat ini. Mengembalikan null bila tidak ada
 * cookie, cookie palsu, kedaluwarsa, atau sudah dicabut.
 *
 * Fungsi ini TIDAK melempar error saat sesi tidak sah — pemanggil cukup
 * memeriksa null. Perilaku ini disengaja agar penjagaan halaman menjadi
 * sederhana dan tidak ada jalur error yang terlewat.
 */
export async function bacaSesi(): Promise<Sesi | null> {
  const cookie = cookies().get(NAMA_COOKIE_SESI)?.value;
  if (!cookie) return null;

  try {
    /*
     * Argumen kedua = checkRevoked. Ini yang membuat "keluar dari semua
     * perangkat" benar-benar berlaku seketika, dengan biaya satu kali
     * pemeriksaan ke Firebase.
     */
    const klaim = await adminAuth().verifySessionCookie(cookie, true);
    return {
      uid: klaim.uid,
      email: (klaim.email as string | undefined) ?? null,
      emailTerverifikasi: klaim.email_verified === true,
    };
  } catch {
    return null;
  }
}

/** Varian tegas untuk API premium: melempar bila tidak ada sesi sah. */
export async function wajibSesi(): Promise<Sesi> {
  const sesi = await bacaSesi();
  if (!sesi) throw new Error("TIDAK_LOGIN");
  return sesi;
}

/** Atribut cookie. Sengaja dikumpulkan agar seragam di semua tempat. */
export function atributCookie(maxAgeDetik: number) {
  return {
    name: NAMA_COOKIE_SESI,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeDetik,
  };
}
