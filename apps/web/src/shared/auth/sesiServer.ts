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

/** Apakah server sudah punya cookie sesi yang sah untuk permintaan ini? */
export async function sesiServerAda(): Promise<boolean> {
  try {
    const res = await fetch(RUTE, { method: "GET", credentials: "same-origin" });
    if (!res.ok) return false;
    const data = (await res.json()) as { masuk?: boolean };
    return data.masuk === true;
  } catch {
    return false;
  }
}

/**
 * Pastikan cookie sesi ada. Aman dipanggil berkali-kali.
 *
 * Diperiksa lebih dulu sebelum menukar, karena penukaran memanggil Firebase
 * Admin dan menambah beban pada setiap pemuatan halaman. Cookie berlaku
 * beberapa hari, jadi sebagian besar kunjungan tidak perlu menukar apa pun.
 */
export async function pastikanSesiServer(user: Any): Promise<boolean> {
  if (!user || typeof user.getIdToken !== "function") return false;
  if (await sesiServerAda()) return true;

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
