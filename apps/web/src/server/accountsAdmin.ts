/**
 * Adapter Firestore (Admin SDK) untuk port AccountRepository.
 *
 * WHY adapter ini tinggal di apps/web dan bukan di packages/data-access:
 * package data-access memakai SDK Firebase KLIEN. Mencampur Admin SDK ke sana
 * berisiko membuatnya ikut terbundel ke browser — dan Admin SDK membawa
 * kewenangan penuh yang melewati Security Rules. Port-nya tetap di
 * data-access; hanya implementasinya yang di sini.
 */
import "server-only";
import type { Account, AccountRepository, Membership } from "@tinyverse/data-access";
import { adminDb } from "./firebaseAdmin";

export const KOLEKSI = {
  users: "users",
  accounts: "accounts",
  memberships: "memberships",
} as const;

/** Id keanggotaan dibuat gabungan agar satu user hanya bisa punya satu baris
 *  per akun — duplikat dicegah oleh struktur, bukan oleh pengecekan. */
function idMembership(accountId: string, uid: string): string {
  return `${accountId}__${uid}`;
}

export class FirestoreAccountRepository implements AccountRepository {
  async getAccount(accountId: string): Promise<Account | null> {
    const snap = await adminDb().collection(KOLEKSI.accounts).doc(accountId).get();
    return snap.exists ? (snap.data() as Account) : null;
  }

  async saveAccount(account: Account): Promise<void> {
    await adminDb()
      .collection(KOLEKSI.accounts)
      .doc(account.id)
      .set(account, { merge: true });
  }

  async listMembershipsByUid(uid: string): Promise<Membership[]> {
    const snap = await adminDb()
      .collection(KOLEKSI.memberships)
      .where("uid", "==", uid)
      .get();
    return snap.docs.map((d) => d.data() as Membership);
  }

  async saveMembership(membership: Membership): Promise<void> {
    await adminDb()
      .collection(KOLEKSI.memberships)
      .doc(idMembership(membership.accountId, membership.uid))
      .set(membership, { merge: true });
  }
}
