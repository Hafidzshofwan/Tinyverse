import type { Id } from "../shared/types"
import type { Account, Membership } from "./types"

/**
 * Port akses akun & keanggotaan.
 *
 * Sengaja TIDAK memuat SDK apa pun. Adapter Firestore sisi server (Admin SDK)
 * hidup di apps/web/src/server, karena Admin SDK hanya boleh dimuat di server
 * dan tidak boleh ikut terbundel ke browser.
 */
export type AccountRepository = {
	getAccount(accountId: Id): Promise<Account | null>
	saveAccount(account: Account): Promise<void>
	/** Semua akun yang diikuti seorang user (biasanya satu). */
	listMembershipsByUid(uid: Id): Promise<Membership[]>
	saveMembership(membership: Membership): Promise<void>
}
