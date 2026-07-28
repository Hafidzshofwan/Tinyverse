import type { Langganan } from "@tinyverse/billing"
import type { Id } from "../shared/types"
import type { SubscriptionRepository } from "./repository"

/** Adapter in-memory untuk dev & pengujian, tanpa Firebase. */
export class InMemorySubscriptionRepository implements SubscriptionRepository {
	private data = new Map<Id, Langganan>()

	async get(accountId: Id): Promise<Langganan | null> {
		const l = this.data.get(accountId)
		/* Salin agar pemanggil tidak bisa mengubah isi penyimpanan secara tidak
		   sengaja - meniru perilaku basis data sungguhan. */
		return l ? { ...l } : null
	}

	async save(langganan: Langganan): Promise<void> {
		this.data.set(langganan.accountId, { ...langganan })
	}
}
