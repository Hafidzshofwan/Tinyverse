import { describe, expect, it } from "vitest"
import { createInMemoryRepositories } from "../factory"
import { InMemoryAccountRepository } from "../accounts/in-memory"
import type { Account, Membership } from "../accounts/types"

const SEKARANG = "2026-01-01T00:00:00.000Z"

function akun(id: string, uid: string): Account {
	return { id, kind: "personal", name: "Akun " + id, ownerUid: uid, createdAt: SEKARANG }
}

function anggota(accountId: string, uid: string): Membership {
	return { accountId, uid, role: "owner", createdAt: SEKARANG }
}

describe("AccountRepository (in-memory)", () => {
	it("mengembalikan null untuk akun yang tidak ada", async () => {
		const repo = new InMemoryAccountRepository()
		expect(await repo.getAccount("tidak-ada")).toBeNull()
	})

	it("menyimpan lalu membaca kembali akun", async () => {
		const repo = new InMemoryAccountRepository()
		await repo.saveAccount(akun("a1", "u1"))
		expect(await repo.getAccount("a1")).toMatchObject({ id: "a1", ownerUid: "u1" })
	})

	/*
	 * Penyediaan akun dipanggil setiap kali sesi ditukar, jadi penyimpanan
	 * berulang HARUS idempoten. Bila tidak, satu orang bisa berakhir dengan
	 * banyak baris keanggotaan dan pengecekan hak akses menjadi kacau.
	 */
	it("menyimpan keanggotaan secara idempoten", async () => {
		const repo = new InMemoryAccountRepository()
		await repo.saveMembership(anggota("a1", "u1"))
		await repo.saveMembership(anggota("a1", "u1"))
		await repo.saveMembership(anggota("a1", "u1"))
		expect(await repo.listMembershipsByUid("u1")).toHaveLength(1)
	})

	it("memperbarui peran tanpa menambah baris", async () => {
		const repo = new InMemoryAccountRepository()
		await repo.saveMembership(anggota("a1", "u1"))
		await repo.saveMembership({ ...anggota("a1", "u1"), role: "member" })
		const hasil = await repo.listMembershipsByUid("u1")
		expect(hasil).toHaveLength(1)
		expect(hasil[0]?.role).toBe("member")
	})

	it("memisahkan keanggotaan antar pengguna", async () => {
		const repo = new InMemoryAccountRepository()
		await repo.saveMembership(anggota("a1", "u1"))
		await repo.saveMembership(anggota("a2", "u2"))
		expect(await repo.listMembershipsByUid("u1")).toHaveLength(1)
		expect(await repo.listMembershipsByUid("u3")).toHaveLength(0)
	})

	it("mendukung satu pengguna di banyak akun (jalur institusi kelak)", async () => {
		const repo = new InMemoryAccountRepository()
		await repo.saveMembership(anggota("pribadi", "u1"))
		await repo.saveMembership({ ...anggota("rs-harapan", "u1"), role: "member" })
		expect(await repo.listMembershipsByUid("u1")).toHaveLength(2)
	})

	it("terdaftar di factory in-memory", async () => {
		const repos = createInMemoryRepositories()
		expect(repos.accounts).toBeDefined()
		await repos.accounts.saveAccount(akun("a1", "u1"))
		expect(await repos.accounts.getAccount("a1")).not.toBeNull()
	})
})
