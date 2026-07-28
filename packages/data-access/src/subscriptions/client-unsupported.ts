import type { Langganan } from "@tinyverse/billing"
import { NotImplementedError } from "../shared/errors"
import type { SubscriptionRepository } from "./repository"

/**
 * Penolak sisi klien. Langganan hanya boleh disentuh server (Admin SDK);
 * Security Rules menutup koleksi ini dari browser.
 *
 * Melempar, bukan mengembalikan null: null akan terbaca sebagai "akun ini
 * belum berlangganan" dan diam-diam mencabut akses pelanggan yang membayar.
 */
export class ClientUnsupportedSubscriptionRepository implements SubscriptionRepository {
	async get(_accountId: string): Promise<Langganan | null> {
		throw new NotImplementedError("SubscriptionRepository.get di sisi klien")
	}
	async save(_langganan: Langganan): Promise<void> {
		throw new NotImplementedError("SubscriptionRepository.save di sisi klien")
	}
}
