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
import { bolehDapatPercobaan, buatLanggananPercobaan } from "@tinyverse/billing";
import type { Account, Membership } from "@tinyverse/data-access";
import { FirestoreAccountRepository, KOLEKSI } from "./accountsAdmin";
import { adminDb } from "./firebaseAdmin";
import type { Sesi } from "./session";
import { FirestoreSubscriptionRepository } from "./subscriptionsAdmin";

/**
 * Id akun personal sengaja dibuat SAMA dengan uid.
 *
 * WHY: membuatnya dapat dihitung tanpa query, sehingga penyediaan menjadi
 * idempoten secara alami - tidak mungkin tercipta dua akun personal untuk satu
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
  /** True hanya pada panggilan yang benar-benar menanam masa percobaan. */
  percobaanDitanam: boolean;
};

/**
 * Berikan masa percobaan bila akun ini belum pernah punya catatan langganan.
 *
 * WHY di sini, bukan pada saat akun dibuat: pengguna yang sudah terdaftar
 * sebelum fitur ini ada tidak akan pernah "dibuat" lagi. Bila hadiahnya
 * dibagikan di pintu pendaftaran, mereka tidak akan pernah kebagian. Karena
 * pemeriksaannya melihat ada-tidaknya dokumen langganan - bukan baru-tidaknya
 * akun - satu jalur kode ini melayani pengguna baru dan pengguna lama
 * sekaligus, dan tetap mustahil memberi dua kali.
 *
 * WHY penulisan ke subscriptions boleh terjadi di luar alur pembayaran:
 * dokumen langganan adalah catatan MASA AKSES, bukan catatan uang. Masa
 * percobaan adalah masa akses yang harganya nol. Yang tetap dijaga ketat:
 * hanya alur pembayaran yang boleh menulis lastOrderId, dan masa percobaan
 * membiarkannya null.
 *
 * Bila dua permintaan masuk bersamaan, keduanya menulis nilai yang praktis
 * sama (beda beberapa milidetik pada tanggal mulai) ke dokumen yang sama, jadi
 * lomba ini tidak bisa menghasilkan dua masa percobaan atau memperpanjangnya.
 */
async function tanamPercobaanBilaPerlu(
  accountId: string,
  sekarang: string,
): Promise<boolean> {
  const repo = new FirestoreSubscriptionRepository();
  const langganan = await repo.get(accountId);
  if (!bolehDapatPercobaan(langganan)) return false;

  await repo.save(buatLanggananPercobaan(accountId, sekarang));
  return true;
}

export async function pastikanUserDanAkun(sesi: Sesi): Promise<HasilPenyediaan> {
  const sekarang = new Date().toISOString();
  const accountId = idAkunPersonal(sesi.uid);
  const db = adminDb();

  const refAkun = db.collection(KOLEKSI.accounts).doc(accountId);
  const sudahAda = (await refAkun.get()).exists;

  /* Profil aplikasi. Sengaja TIDAK memuat status langganan apa pun - status
     itu milik koleksi subscriptions dan hanya dibaca dari sana. */
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

  const percobaanDitanam = await tanamPercobaanBilaPerlu(accountId, sekarang);

  return { accountId, baru: !sudahAda, percobaanDitanam };
}

/**
 * Akun aktif milik sesi ini. Untuk sekarang selalu akun personal; saat fitur
 * institusi datang, di sinilah pemilihan akun aktif akan ditambahkan tanpa
 * mengubah satu pun pemanggilnya.
 */
export async function akunAktif(sesi: Sesi): Promise<string> {
  return idAkunPersonal(sesi.uid);
}
