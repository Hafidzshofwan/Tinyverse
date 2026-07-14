import { type Firestore } from "firebase/firestore"
import { FirebaseDrugRepository } from "./drugs/firebase"
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
	}
}
