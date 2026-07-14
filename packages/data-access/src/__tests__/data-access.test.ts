import { describe, it, expect } from "vitest"
import {
	InMemoryDrugRepository,
	InMemoryUserRepository,
	NotFoundError,
	createInMemoryRepositories,
	DEFAULT_USER_SETTINGS,
	type DrugRecord,
} from ".."

// Catatan: adapter Firestore (FirebaseDrugRepository/FirebaseUserRepository)
// diuji terhadap Firebase Emulator pada langkah integrasi terpisah, bukan di
// unit test ini — unit test cukup memakai adapter in-memory yang deterministik.

const sampleDrugs: DrugRecord[] = [
	{
		id: "paracetamol",
		nama: "Paracetamol",
		jenis: "Analgesik-Antipiretik",
		doseType: "perKg",
		indikasi: "demam dan nyeri",
	},
	{
		id: "albendazole",
		nama: "Albendazole",
		jenis: "Anthelmintik",
		doseType: "flat",
		indikasi: "infeksi cacing",
	},
]

describe("InMemoryDrugRepository", () => {
	it("getById mengembalikan obat yang ada", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		expect((await repo.getById("paracetamol")).nama).toBe("Paracetamol")
	})

	it("getById melempar NotFoundError bila tak ada", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		await expect(repo.getById("tidak-ada")).rejects.toBeInstanceOf(NotFoundError)
	})

	it("findById mengembalikan null bila tak ada", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		expect(await repo.findById("tidak-ada")).toBeNull()
	})

	it("list terurut berdasarkan nama", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		const page = await repo.list()
		expect(page.items.map((d) => d.id)).toEqual(["albendazole", "paracetamol"])
		expect(page.nextCursor).toBeNull()
	})

	it("list menghormati limit & kursor", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		const first = await repo.list({ limit: 1 })
		expect(first.items.map((d) => d.id)).toEqual(["albendazole"])
		expect(first.nextCursor).toBe("1")
		const second = await repo.list({ limit: 1, cursor: first.nextCursor })
		expect(second.items.map((d) => d.id)).toEqual(["paracetamol"])
		expect(second.nextCursor).toBeNull()
	})

	it("search mencocokkan nama atau indikasi", async () => {
		const repo = new InMemoryDrugRepository(sampleDrugs)
		expect((await repo.search("cacing")).items.map((d) => d.id)).toEqual([
			"albendazole",
		])
		expect((await repo.search("para")).items.map((d) => d.id)).toEqual([
			"paracetamol",
		])
	})
})

describe("InMemoryUserRepository", () => {
	it("getSettings mengembalikan default bila belum diset", async () => {
		const repo = new InMemoryUserRepository()
		expect(await repo.getSettings("u1")).toEqual(DEFAULT_USER_SETTINGS)
	})

	it("updateSettings melakukan merge & persist", async () => {
		const repo = new InMemoryUserRepository()
		const next = await repo.updateSettings("u1", { theme: "warm" })
		expect(next.theme).toBe("warm")
		expect((await repo.getSettings("u1")).theme).toBe("warm")
	})

	it("saveAccount lalu getAccount", async () => {
		const repo = new InMemoryUserRepository()
		await repo.saveAccount({ uid: "u1", email: "a@b.co", displayName: "A" })
		expect((await repo.getAccount("u1"))?.email).toBe("a@b.co")
	})
})

describe("factory", () => {
	it("createInMemoryRepositories menyediakan drugs & users", async () => {
		const repos = createInMemoryRepositories({ drugs: sampleDrugs })
		expect((await repos.drugs.list()).items).toHaveLength(2)
		expect(await repos.users.getSettings("u1")).toEqual(DEFAULT_USER_SETTINGS)
	})
})
