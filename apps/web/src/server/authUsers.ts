import "server-only";
import { adminAuth } from "./firebaseAdmin";

export type MetadataAuth = {
  /** Waktu pendaftaran akun dalam milidetik epoch. */
  dibuat: number;
  /**
   * Waktu login terakhir dalam milidetik epoch.
   * Firebase Auth mencatat ini secara otomatis setiap kali pengguna
   * berhasil masuk. Bernilai 0 bila belum pernah login sama sekali
   * (akun yang dibuat via Admin SDK tanpa pernah dipakai).
   */
  terakhirLogin: number;
};

/**
 * Mengambil metadata akun (waktu buat + terakhir login) setiap UID
 * dari Firebase Authentication dalam satu kali iterasi listUsers.
 *
 * WHY tidak memakai field `dibuat` di dokumen Firestore users/{uid}: dokumen
 * itu bisa "dibuat ulang" belakangan -- misalnya saat dokumennya sempat
 * hilang lalu pengguna login lagi, kode menganggapnya akun baru dan menulis
 * `dibuat: Date.now()` saat itu juga. Untuk akun lama, ini membuat nilainya
 * meleset jauh dari tanggal pendaftaran sungguhan. Authentication tidak
 * punya masalah ini: `metadata.creationTime` dicatat sekali oleh Firebase
 * sendiri saat akun dibuat dan tidak pernah berubah, persis kolom "Created"
 * yang terlihat di Firebase Console.
 *
 * WHY lastSignInTime diambil sekaligus di sini, bukan fungsi terpisah:
 * listUsers adalah operasi berpaginasi yang bisa memakan banyak round-trip
 * untuk basis pengguna besar. Menggabungkan keduanya dalam satu iterasi
 * memangkas separuh round-trip dibanding dua fungsi terpisah.
 */
export async function ambilMetadataAuth(): Promise<Map<string, MetadataAuth>> {
  const meta = new Map<string, MetadataAuth>();
  let pageToken: string | undefined;
  do {
    const hasil = await adminAuth().listUsers(1000, pageToken);
    hasil.users.forEach((pengguna) => {
      const dibuat = Date.parse(pengguna.metadata.creationTime);
      const terakhirLogin = Date.parse(pengguna.metadata.lastSignInTime);
      meta.set(pengguna.uid, {
        dibuat: Number.isNaN(dibuat) ? 0 : dibuat,
        terakhirLogin: Number.isNaN(terakhirLogin) ? 0 : terakhirLogin,
      });
    });
    pageToken = hasil.pageToken || undefined;
  } while (pageToken);
  return meta;
}

/**
 * Mengambil waktu buat akun (creationTime) setiap UID langsung dari Firebase
 * Authentication, dalam milidetik epoch.
 *
 * @deprecated Gunakan ambilMetadataAuth() yang sekaligus mengembalikan
 * terakhirLogin sehingga tidak ada round-trip tambahan ke Firebase.
 */
export async function ambilWaktuBuatAuth(): Promise<Map<string, number>> {
  const meta = await ambilMetadataAuth();
  const waktu = new Map<string, number>();
  meta.forEach((v, uid) => waktu.set(uid, v.dibuat));
  return waktu;
}

/**
 * Mengambil seluruh UID akun yang benar-benar masih ada di Firebase
 * Authentication.
 *
 * WHY ini perlu: dokumen Firestore users/{uid} TIDAK otomatis ikut terhapus
 * saat akun Authentication-nya dihapus (mis. lewat Firebase Console).
 * Tanpa pengecekan ini, akun yang sudah dihapus tetap tampil selamanya di
 * halaman Kelola Pengguna karena dokumennya masih ada, walau pemiliknya
 * sudah tidak bisa masuk lagi.
 */
export async function ambilSemuaUidAuth(): Promise<Set<string>> {
  const uid = new Set<string>();
  let pageToken: string | undefined;
  do {
    const hasil = await adminAuth().listUsers(1000, pageToken);
    hasil.users.forEach((pengguna) => uid.add(pengguna.uid));
    pageToken = hasil.pageToken || undefined;
  } while (pageToken);
  return uid;
}
