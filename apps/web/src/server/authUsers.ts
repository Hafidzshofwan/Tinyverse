import "server-only";
import { adminAuth } from "./firebaseAdmin";

/**
 * Mengambil waktu buat akun (creationTime) setiap UID langsung dari Firebase
 * Authentication, dalam milidetik epoch.
 *
 * WHY tidak memakai field `dibuat` di dokumen Firestore users/{uid}: dokumen
 * itu bisa "dibuat ulang" belakangan -- misalnya saat dokumennya sempat
 * hilang lalu pengguna login lagi, kode menganggapnya akun baru dan menulis
 * `dibuat: Date.now()` saat itu juga. Untuk akun lama, ini membuat nilainya
 * meleset jauh dari tanggal pendaftaran sungguhan. Authentication tidak
 * punya masalah ini: `metadata.creationTime` dicatat sekali oleh Firebase
 * sendiri saat akun dibuat dan tidak pernah berubah, persis kolom "Created"
 * yang terlihat di Firebase Console.
 */
export async function ambilWaktuBuatAuth(): Promise<Map<string, number>> {
  const waktu = new Map<string, number>();
  let pageToken: string | undefined;
  do {
    const hasil = await adminAuth().listUsers(1000, pageToken);
    hasil.users.forEach((pengguna) => {
      const t = Date.parse(pengguna.metadata.creationTime);
      waktu.set(pengguna.uid, Number.isNaN(t) ? 0 : t);
    });
    pageToken = hasil.pageToken || undefined;
  } while (pageToken);
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
