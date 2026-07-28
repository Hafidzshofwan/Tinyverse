import { describe, expect, it } from "vitest"
import type { Pesanan } from "@tinyverse/billing"
import { createInMemoryRepositories } from "../factory"
import { InMemoryOrderRepository } from "../orders/in-memory"
import { InMemorySubscriptionRepository } from "../subscriptions/in-memory"

const T0 = "2026-06-01T00:00:00.000Z"
const T1 = "2026-06-02T00:00:00.000Z"

function pesanan(over: Partial<Pesanan> = {}): Pesanan {
	return {
		id: "order-1",
		accountId: "akun-1",
		createdByUid: "uid-1",
		snapshotHarga: {
			planId: "bulanan",
			nama: "Bulanan",
			durasiHari: 30,
			hargaRupiah: 49000,
		},
		status: "menunggu",
		midtransOrderId: "TV-0001",
		createdAt: T0,
		expiresAt: T1,
		updatedAt: T0,
		...over,
	}
}

describe("SubscriptionRepository (in-memory)", () => {
	it("mengembalikan null untuk akun yang belum membeli", async () => {
		const repo = new InMemorySubscriptionRepository()
		expect(await repo.get("akun-1")).toBeNull()
	})

	it("menyimpan lalu membaca kembali", async () => {
		const repo = new InMemorySubscriptionRepository()
		await repo.save({
			accountId: "akun-1",
			planId: "bulanan",
			periodeMulai: T0,
			periodeBerakhir: "2026-07-01T00:00:00.000Z",
			lastOrderId: "order-1",
			updatedAt: T0,
		})
		expect((await repo.get("akun-1"))?.periodeBerakhir).toBe("2026-07-01T00:00:00.000Z")
	})

	/* Penyimpanan harus mengembalikan salinan; kalau tidak, pemanggil bisa
	   mengubah isi "basis data" tanpa melakukan operasi tulis. */
	it("tidak membocorkan referensi ke penyimpanan", async () => {
		const repo = new InMemorySubscriptionRepository()
		await repo.save({
			accountId: "akun-1",
			planId: "bulanan",
			periodeMulai: T0,
			periodeBerakhir: "2026-07-01T00:00:00.000Z",
			lastOrderId: "order-1",
			updatedAt: T0,
		})
		const a = await repo.get("akun-1")
		if (a) a.periodeBerakhir = "2099-01-01T00:00:00.000Z"
		expect((await repo.get("akun-1"))?.periodeBerakhir).toBe("2026-07-01T00:00:00.000Z")
	})
})

describe("OrderRepository (in-memory)", () => {
	it("membuat lalu menemukan berdasarkan id", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan())
		expect((await repo.findById("order-1"))?.midtransOrderId).toBe("TV-0001")
	})

	it("menolak id ganda", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan())
		await expect(repo.create(pesanan())).rejects.toThrow(/sudah ada/)
	})

	/* Webhook hanya membawa order_id versi Midtrans, bukan id dokumen kita. */
	it("menemukan berdasarkan midtransOrderId", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan())
		expect((await repo.findByMidtransOrderId("TV-0001"))?.id).toBe("order-1")
		expect(await repo.findByMidtransOrderId("TV-9999")).toBeNull()
	})

	it("mendaftar pesanan akun, terbaru lebih dulu", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan({ id: "a", midtransOrderId: "A", createdAt: T0 }))
		await repo.create(pesanan({ id: "b", midtransOrderId: "B", createdAt: T1 }))
		await repo.create(pesanan({ id: "c", midtransOrderId: "C", accountId: "akun-lain" }))
		const hasil = await repo.listByAccount("akun-1")
		expect(hasil.map((p) => p.id)).toEqual(["b", "a"])
	})

	it("updateStatus berhasil bila status masih sesuai", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan())
		const ok = await repo.updateStatus({
			id: "order-1",
			dariStatus: "menunggu",
			keStatus: "dibayar",
			padaWaktu: T1,
		})
		expect(ok).toBe(true)
		expect((await repo.findById("order-1"))?.status).toBe("dibayar")
	})

	/*
	 * Inti dari penulisan bersyarat: dua notifikasi Midtrans yang tiba nyaris
	 * bersamaan sama-sama membaca status "menunggu". Hanya SATU yang boleh
	 * berhasil menulis; yang kalah harus dijawab false, bukan ikut menulis -
	 * kalau tidak, langganan diperpanjang dua kali untuk satu pembayaran.
	 */
	it("menolak pembaruan kedua yang kalah lomba", async () => {
		const repo = new InMemoryOrderRepository()
		await repo.create(pesanan())
		const arg = {
			id: "order-1",
			dariStatus: "menunggu" as const,
			keStatus: "dibayar" as const,
			padaWaktu: T1,
		}
		expect(await repo.updateStatus(arg)).toBe(true)
		expect(await repo.updateStatus(arg)).toBe(false)
	})

	it("mengembalikan false untuk pesanan yang tidak ada", async () => {
		const repo = new InMemoryOrderRepository()
		expect(
			await repo.updateStatus({
				id: "hantu",
				dariStatus: "menunggu",
				keStatus: "dibayar",
				padaWaktu: T1,
			}),
		).toBe(false)
	})

	it("terdaftar di factory in-memory", async () => {
		const repos = createInMemoryRepositories()
		expect(repos.subscriptions).toBeDefined()
		expect(repos.orders).toBeDefined()
		await repos.orders.create(pesanan())
		expect(await repos.orders.findById("order-1")).not.toBeNull()
	})
})
