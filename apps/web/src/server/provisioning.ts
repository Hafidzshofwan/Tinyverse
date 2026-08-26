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
 * Kunci dokumen riwayat trial untuk sebuah email.
 *
 * Dinormalkan huruf kecil + tanpa spasi tepi supaya "Nama@Contoh.com" dan
 * " nama@contoh.com " dianggap email yang sama persis -- keduanya memang
 * alamat yang sama, dan pengecekan yang peka huruf besar/kecil di sini
 * hanya akan membuka celah yang sama lewat variasi kapitalisasi.
 */
function kunciRiwayatTrial(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Berikan masa percobaan bila akun ini belum pernah punya catatan langganan
 * DAN emailnya belum pernah menerima trial sebelumnya (termasuk lewat akun
 * lama yang sudah dihapus).
 *
 * WHY di sini, bukan pada saat akun dibuat: pengguna yang sudah terdaftar
 * sebelum fitur ini ada tidak akan pernah "dibuat" lagi. Bila hadiahnya
 * dibagikan di pintu pendaftaran, mereka tidak akan pernah kebagian. Karena
 * pemeriksaannya melihat ada-tidaknya dokumen langganan - bukan baru-tidaknya
 * akun - satu jalur kode ini melayani pengguna baru dan pengguna lama
 * sekaligus, dan tetap mustahil memberi dua kali.
 *
 * WHY pengecekan email ini perlu, padahal bolehDapatPercobaan(accountId)
 * sudah ada: accountId sama dengan uid (lihat idAkunPersonal), dan uid selalu
 * berupa nilai baru setiap kali akun Authentication dibuat -- termasuk saat
 * seseorang menghapus akunnya lalu mendaftar ulang dengan email yang persis
 * sama. Tanpa pengecekan tambahan ini, accountId yang baru itu tidak pernah
 * punya dokumen langganan, sehingga bolehDapatPercobaan selalu menjawab
 * "boleh" - trial bisa didapat berulang kali hanya dengan hapus-lalu-daftar
 * ulang. Riwayat berbasis email inilah yang bertahan melewati siklus
 * hapus-akun, karena disimpan di koleksi yang sengaja tidak pernah disentuh
 * oleh /api/auth/hapus-akun.
 *
 * WHY tidak digabung ke dalam bolehDapatPercobaan di packages/billing:
 * fungsi itu sengaja murni (tanpa Firestore, tanpa I/O apa pun) - itulah yang
 * membuatnya gampang diuji dan gampang dipercaya. Pengecekan riwayat email
 * perlu membaca Firestore, jadi tempatnya di sini, di lapisan yang memang
 * sudah melakukan I/O untuk urusan ini.
 *
 * WHY penulisan ke subscriptions boleh terjadi di luar alur pembayaran:
 * dokumen langganan adalah catatan MASA AKSES, bukan catatan uang. Masa
 * percobaan adalah masa akses yang harganya nol. Yang tetap dijaga ketat:
 * hanya alur pembayaran yang boleh menulis lastOrderId, dan masa percobaan
 * membiarkannya null.
 *
 * Bila dua permintaan masuk bersamaan, keduanya menulis nilai yang praktis
 * sama (beda beberapa milidetik pada tanggal mulai) ke dokumen subscriptions
 * yang sama, jadi lomba ini tidak bisa menghasilkan dua masa percobaan atau
 * memperpanjangnya. Untuk dokumen riwayat email berlaku hal yang sama: dua
 * penulisan yang beriringan hanya saling menimpa dengan nilai yang praktis
 * identik, bukan menciptakan dua catatan.
 *
 * Bila email tidak ada (kasus yang seharusnya tidak pernah terjadi untuk akun
 * email/sandi maupun Google, tapi dijaga untuk berjaga-jaga), pengecekan
 * riwayat ini dilewati dan hanya bolehDapatPercobaan(accountId) yang berlaku
 * -- lebih aman membiarkan jalur lama berjalan daripada menolak trial tanpa
 * kunci yang jelas untuk dicatat.
 */
async function tanamPercobaanBilaPerlu(
  accountId: string,
  email: string | null,
  sekarang: string,
): Promise<boolean> {
  const repo = new FirestoreSubscriptionRepository();
  const langganan = await repo.get(accountId);
  if (!bolehDapatPercobaan(langganan)) return false;

  const db = adminDb();
  const kunciEmail = email ? kunciRiwayatTrial(email) : null;

  if (kunciEmail) {
    const refRiwayat = db.collection(KOLEKSI.trialEmailHistory).doc(kunciEmail);
    const sudahPernah = (await refRiwayat.get()).exists;
    if (sudahPernah) return false;

    await repo.save(buatLanggananPercobaan(accountId, sekarang));
    await refRiwayat.set({
      email: kunciEmail,
      accountIdPertama: accountId,
      waktuPertama: sekarang,
    });
    return true;
  }

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

  const percobaanDitanam = await tanamPercobaanBilaPerlu(accountId, sesi.email, sekarang);

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
