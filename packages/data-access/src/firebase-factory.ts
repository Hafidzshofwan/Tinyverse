import { type Firestore } from "firebase/firestore"
import { FirebaseDrugRepository } from "./drugs/firebase"
import { ClientUnsupportedAccountRepository } from "./accounts/client-unsupported"
import { ClientUnsupportedOrderRepository } from "./orders/client-unsupported"
import { ClientUnsupportedSubscriptionRepository } from "./subscriptions/client-unsupported"
import { FirebaseUserRepository } from "./users/firebase"
import type { Repositories } from "./factory"

/** Dependensi untuk membuat set repository Firestore. */
export type FirebaseRepositoriesDeps = {
	firestore: Firestore
	drugsCollection?: string
	usersCollection?: string
	settingsCollection?: string
}

/**
 * Buat set repository yang didukung Firestore.
 * Bentuk hasilnya identik dengan `createInMemoryRepositories`, jadi lapisan
 * aplikasi bisa menukar keduanya tanpa mengubah kode pemakai.
 */
export function createFirebaseRepositories(
	deps: FirebaseRepositoriesDeps,
): Repositories {
	return {
		drugs: new FirebaseDrugRepository({
			firestore: deps.firestore,
			collectionName: deps.drugsCollection,
		}),
		users: new FirebaseUserRepository({
			firestore: deps.firestore,
			usersCollection: deps.usersCollection,
			settingsCollection: deps.settingsCollection,
		}),
		/* Akun & keanggotaan tertutup bagi klien; lihat accounts/client-unsupported.ts. */
		accounts: new ClientUnsupportedAccountRepository(),
		subscriptions: new ClientUnsupportedSubscriptionRepository(),
		orders: new ClientUnsupportedOrderRepository(),
	}
}
