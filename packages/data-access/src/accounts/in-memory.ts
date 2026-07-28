import { type Id } from "../shared/types"
import type { AccountRepository } from "./repository"
import type { Account, Membership } from "./types"

/** Adapter in-memory untuk dev & pengujian, tanpa Firebase. */
export class InMemoryAccountRepository implements AccountRepository {
	private accounts = new Map<Id, Account>()
	private memberships: Membership[] = []

	async getAccount(accountId: Id): Promise<Account | null> {
		return this.accounts.get(accountId) ?? null
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.set(account.id, account)
	}

	async listMembershipsByUid(uid: Id): Promise<Membership[]> {
		return this.memberships.filter((m) => m.uid === uid)
	}

	async saveMembership(membership: Membership): Promise<void> {
		const i = this.memberships.findIndex(
			(m) => m.accountId === membership.accountId && m.uid === membership.uid,
		)
		if (i >= 0) this.memberships[i] = membership
		else this.memberships.push(membership)
	}
}
