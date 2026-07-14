import { InMemoryDrugRepository } from "./drugs/in-memory"
import type { DrugRepository } from "./drugs/repository"
import type { DrugRecord } from "./drugs/types"
import { InMemoryUserRepository } from "./users/in-memory"
import type { UserRepository } from "./users/repository"

/** Kumpulan semua repository yang dipakai aplikasi. */
export type Repositories = {
	drugs: DrugRepository
	users: UserRepository
}

/**
 * Buat set repository in-memory (untuk dev/test/preview tanpa Firebase).
 * Versi Firebase akan punya factory sendiri saat adapter diisi (P11+).
 */
export function createInMemoryRepositories(
	seed: { drugs?: readonly DrugRecord[] } = {},
): Repositories {
	return {
		drugs: new InMemoryDrugRepository(seed.drugs ?? []),
		users: new InMemoryUserRepository(),
	}
}
