/**
 * Penyediaan akun saat pengguna pertama kali masuk.
 *
 * Dijalankan pada penukaran sesi, bukan pada pendaftaran di klien. Alasannya:
 * pendaftaran terjadi di browser dan bisa saja tidak pernah sampai ke server
 * (jaringan putus, tab ditutup). Penukaran sesi PASTI melewati server, jadi
 * di situlah tempat paling andal untuk memastikan akun ada.
 *
 * Sifatnya idempoten: dipanggil sekali atau seratus kali, hasilnya sama.
 */
import "server-only";
import type { Account, Membership } from "@tinyverse/data-access";
import { FirestoreAccountRepository, KOLEKSI } from "./accountsAdmin";
import { adminDb } from "./firebaseAdmin";
import type { Sesi } from "./session";

/**
 * Id akun personal sengaja dibuat SAMA dengan uid.
 *
 * WHY: membuatnya dapat dihitung tanpa query, sehingga penyediaan menjadi
 * idempoten secara alami — tidak mungkin tercipta dua akun personal untuk satu
 * orang, bahkan bila dua permintaan datang bersamaan. Yang penting adalah
 * SELURUH kode di atasnya tetap memakai accountId, tidak pernah uid. Dengan
 * begitu akun institusi (yang id-nya acak) berjalan di jalur yang sama persis.
 */
export function idAkunPersonal(uid: string): string {
  return uid;
}

export type HasilPenyediaan = {
  accountId: string;
  baru: boolean;
};

export async function pastikanUserDanAkun(sesi: Sesi): Promise<HasilPenyediaan> {
  const sekarang = new Date().toISOString();
  const accountId = idAkunPersonal(sesi.uid);
  const db = adminDb();

  const refAkun = db.collection(KOLEKSI.accounts).doc(accountId);
  const sudahAda = (await refAkun.get()).exists;

  /* Profil aplikasi. Sengaja TIDAK memuat status langganan apa pun — status
     itu milik koleksi subscriptions dan hanya ditulis oleh alur pembayaran. */
  await db.collection(KOLEKSI.users).doc(sesi.uid).set(
    {
      uid: sesi.uid,
      email: sesi.email,
      emailTerverifikasi: sesi.emailTerverifikasi,
      lastLoginAt: sekarang,
      ...(sudahAda ? {} : { createdAt: sekarang }),
    },
    { merge: true },
  );

  if (!sudahAda) {
    const repo = new FirestoreAccountRepository();
    const akun: Account = {
      id: accountId,
      kind: "personal",
      name: sesi.email ?? "Akun saya",
      ownerUid: sesi.uid,
      createdAt: sekarang,
    };
    const anggota: Membership = {
      accountId,
      uid: sesi.uid,
      role: "owner",
      createdAt: sekarang,
    };
    await repo.saveAccount(akun);
    await repo.saveMembership(anggota);
  }

  return { accountId, baru: !sudahAda };
}

/**
 * Akun aktif milik sesi ini. Untuk sekarang selalu akun personal; saat fitur
 * institusi datang, di sinilah pemilihan akun aktif akan ditambahkan tanpa
 * mengubah satu pun pemanggilnya.
 */
export async function akunAktif(sesi: Sesi): Promise<string> {
  return idAkunPersonal(sesi.uid);
}
