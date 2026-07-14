import { type Firestore, doc, getDoc, setDoc } from "firebase/firestore"
import type { Id } from "../shared/types"
import { DEFAULT_USER_SETTINGS } from "./types"
import type { UserAccount, UserSettings } from "./types"
import type { UserRepository } from "./repository"

/** Dependensi adapter Firestore pengguna. */
export type FirebaseUserRepositoryDeps = {
	/** Instance Firestore (dari `getFirestore(app)`). */
	firestore: Firestore
	/** Koleksi akun pengguna; default "users". */
	usersCollection?: string
	/** Koleksi pengaturan pengguna; default "userSettings". */
	settingsCollection?: string
}

/**
 * Adapter Firestore untuk akun & pengaturan pengguna.
 *
 * - Akun disimpan di `users/{uid}` (bentuk `UserAccount`).
 * - Pengaturan disimpan di `userSettings/{uid}` (bentuk `UserSettings`).
 *
 * `updateSettings` memakai baca-ubah-tulis (shallow merge) agar semantiknya
 * identik dengan adapter in-memory.
 */
export class FirebaseUserRepository implements UserRepository {
	private readonly firestore: Firestore
	private readonly usersCollection: string
	private readonly settingsCollection: string

	constructor(deps: FirebaseUserRepositoryDeps) {
		this.firestore = deps.firestore
		this.usersCollection = deps.usersCollection ?? "users"
		this.settingsCollection = deps.settingsCollection ?? "userSettings"
	}

	async getAccount(uid: Id): Promise<UserAccount | null> {
		const snap = await getDoc(doc(this.firestore, this.usersCollection, uid))
		return snap.exists() ? (snap.data() as UserAccount) : null
	}

	async saveAccount(account: UserAccount): Promise<void> {
		await setDoc(
			doc(this.firestore, this.usersCollection, account.uid),
			account,
			{ merge: true },
		)
	}

	async getSettings(uid: Id): Promise<UserSettings> {
		const snap = await getDoc(doc(this.firestore, this.settingsCollection, uid))
		if (!snap.exists()) return { ...DEFAULT_USER_SETTINGS }
		return { ...DEFAULT_USER_SETTINGS, ...(snap.data() as UserSettings) }
	}

	async updateSettings(
		uid: Id,
		patch: Partial<UserSettings>,
	): Promise<UserSettings> {
		const current = await this.getSettings(uid)
		const next: UserSettings = { ...current, ...patch }
		await setDoc(doc(this.firestore, this.settingsCollection, uid), next, {
			merge: true,
		})
		return next
	}
}
