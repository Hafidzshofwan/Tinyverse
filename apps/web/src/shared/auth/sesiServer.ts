"use client";

/**
 * Jembatan antara login di browser dan sesi di server.
 *
 * Login Firebase terjadi sepenuhnya di browser. Server sama sekali tidak tahu
 * hal itu sampai ID Token ditukar menjadi cookie sesi httpOnly. Tanpa
 * penukaran ini, halaman dan API sisi server (status langganan, gerbang akses
 * premium) akan selalu menganggap pengguna belum masuk — meskipun di layar
 * ia sudah masuk.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const RUTE = "/api/auth/session";

/**
 * UID pemilik cookie sesi di server, atau null bila tidak ada cookie yang sah.
 *
 * Mengembalikan UID, bukan sekadar ada/tidak ada. Versi sebelumnya hanya
 * menjawab "ada cookie atau tidak", dan itu adalah cacat serius: bila pengguna
 * berganti akun di browser yang sama, cookie akun LAMA masih ada, jawabannya
 * tetap "ada", dan penukaran dilewati. Server pun terus mengenali pengguna
 * sebagai akun sebelumnya — termasuk status langganannya.
 */
export async function uidSesiServer(): Promise<string | null> {
  try {
    const res = await fetch(RUTE, { method: "GET", credentials: "same-origin" });
    if (!res.ok) return null;
    const data = (await res.json()) as { masuk?: boolean; uid?: string | null };
    if (data.masuk !== true || typeof data.uid !== "string") return null;
    return data.uid;
  } catch {
    return null;
  }
}

/**
 * Pastikan cookie sesi ada DAN milik pengguna yang sedang masuk.
 * Aman dipanggil berkali-kali.
 *
 * Penukaran hanya dilewati bila UID di cookie sama dengan UID pengguna saat
 * ini. Kunjungan biasa tetap murah karena cookie berlaku beberapa hari, tetapi
 * pergantian akun selalu memaksa penukaran ulang.
 */
export async function pastikanSesiServer(user: Any): Promise<boolean> {
  if (!user || typeof user.getIdToken !== "function") return false;
  const uidCookie = await uidSesiServer();
  if (uidCookie && uidCookie === user.uid) return true;

  /*
   * Argumen true = paksa segarkan. Firebase menolak ID Token yang dibuat lebih
   * dari 5 menit lalu saat membuat cookie sesi. Token dari cache bisa saja
   * sudah berumur satu jam, dan penukarannya akan gagal tanpa sebab yang
   * kelihatan.
   */
  let idToken: string;
  try {
    idToken = await user.getIdToken(true);
  } catch {
    return false;
  }

  try {
    const res = await fetch(RUTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Hapus cookie sesi di server. Dipanggil SEBELUM signOut di klien. */
export async function akhiriSesi(): Promise<void> {
  try {
    await fetch(RUTE, { method: "DELETE", credentials: "same-origin" });
  } catch {
    /* Gagal menghapus cookie bukan alasan menahan pengguna tetap masuk.
       Cookie tetap kedaluwarsa sendiri, dan sesi Firebase sudah dicabut. */
  }
}
