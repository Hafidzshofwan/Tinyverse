import type { Pesanan } from "@tinyverse/billing"
import type { Id } from "../shared/types"
import { RepositoryError } from "../shared/errors"
import type { OrderRepository } from "./repository"

/** Adapter in-memory untuk dev & pengujian, tanpa Firebase. */
export class InMemoryOrderRepository implements OrderRepository {
	private data = new Map<Id, Pesanan>()

	async create(pesanan: Pesanan): Promise<void> {
		/* Menolak id ganda meniru perilaku create Firestore. Diam-diam menimpa
		   pesanan lama akan menghapus jejak transaksi yang sudah ada. */
		if (this.data.has(pesanan.id)) {
			throw new RepositoryError(
				"sudah_ada",
				'Pesanan "' + pesanan.id + '" sudah ada.',
			)
		}
		this.data.set(pesanan.id, { ...pesanan })
	}

	async findById(id: Id): Promise<Pesanan | null> {
		const p = this.data.get(id)
		return p ? { ...p } : null
	}

	async findByMidtransOrderId(midtransOrderId: string): Promise<Pesanan | null> {
		for (const p of this.data.values()) {
			if (p.midtransOrderId === midtransOrderId) return { ...p }
		}
		return null
	}

	async listByAccount(accountId: Id): Promise<Pesanan[]> {
		return [...this.data.values()]
			.filter((p) => p.accountId === accountId)
			.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
			.map((p) => ({ ...p }))
	}

	async updateStatus(args: {
		id: Id
		dariStatus: Pesanan["status"]
		keStatus: Pesanan["status"]
		padaWaktu: string
	}): Promise<boolean> {
		const p = this.data.get(args.id)
		if (!p) return false
		/* Inilah penulisan bersyaratnya: kalah lomba dijawab false, bukan error. */
		if (p.status !== args.dariStatus) return false
		this.data.set(args.id, { ...p, status: args.keStatus, updatedAt: args.padaWaktu })
		return true
	}
}
