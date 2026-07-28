import type { Pesanan, StatusPesanan } from "@tinyverse/billing"
import { NotImplementedError } from "../shared/errors"
import type { OrderRepository } from "./repository"

/** Penolak sisi klien; pesanan hanya dibuat & diubah oleh server. */
export class ClientUnsupportedOrderRepository implements OrderRepository {
	private tolak(m: string): never {
		throw new NotImplementedError("OrderRepository." + m + " di sisi klien")
	}
	async create(_p: Pesanan): Promise<void> {
		return this.tolak("create")
	}
	async findById(_id: string): Promise<Pesanan | null> {
		return this.tolak("findById")
	}
	async findByMidtransOrderId(_id: string): Promise<Pesanan | null> {
		return this.tolak("findByMidtransOrderId")
	}
	async listByAccount(_accountId: string): Promise<Pesanan[]> {
		return this.tolak("listByAccount")
	}
	async updateStatus(_args: {
		id: string
		dariStatus: StatusPesanan
		keStatus: StatusPesanan
		padaWaktu: string
	}): Promise<boolean> {
		return this.tolak("updateStatus")
	}
}
