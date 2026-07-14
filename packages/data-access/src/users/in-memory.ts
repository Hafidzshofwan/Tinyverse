import type { Id } from "../shared/types"
import { DEFAULT_USER_SETTINGS } from "./types"
import type { UserAccount, UserSettings } from "./types"
import type { UserRepository } from "./repository"

/** Implementasi in-memory untuk pengembangan, preview, & pengujian. */
export class InMemoryUserRepository implements UserRepository {
	private readonly accounts = new Map<Id, UserAccount>()
	private readonly settings = new Map<Id, UserSettings>()

	constructor(seed?: {
		accounts?: readonly UserAccount[]
		settings?: ReadonlyArray<readonly [Id, UserSettings]>
	}) {
		for (const a of seed?.accounts ?? []) this.accounts.set(a.uid, a)
		for (const [uid, s] of seed?.settings ?? []) this.settings.set(uid, s)
	}

	async getAccount(uid: Id): Promise<UserAccount | null> {
		return this.accounts.get(uid) ?? null
	}

	async saveAccount(account: UserAccount): Promise<void> {
		this.accounts.set(account.uid, account)
	}

	async getSettings(uid: Id): Promise<UserSettings> {
		const found = this.settings.get(uid)
		return found ?? { ...DEFAULT_USER_SETTINGS }
	}

	async updateSettings(
		uid: Id,
		patch: Partial<UserSettings>,
	): Promise<UserSettings> {
		const current = await this.getSettings(uid)
		const next: UserSettings = { ...current, ...patch }
		this.settings.set(uid, next)
		return next
	}
}
