import "server-only";
import { adminAuth } from "./firebaseAdmin";

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
