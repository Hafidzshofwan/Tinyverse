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

	/**
	 * Atomik secara cuma-cuma: JavaScript berjalan satu utas, dan tidak ada
	 * satu pun `await` di antara pembacaan dan penulisan di bawah. Tidak ada
	 * pemroses lain yang bisa menyela di tengahnya.
	 */
	async terapkanSekaliSaja(args: {
		accountId: Id
		orderId: string
		hitung: (langganan: Langganan | null) => Langganan
	}): Promise<{ diterapkan: boolean; langganan: Langganan }> {
		const ada = this.data.get(args.accountId) ?? null
		if (ada && ada.lastOrderId === args.orderId) {
			return { diterapkan: false, langganan: { ...ada } }
		}
		const sesudah = args.hitung(ada ? { ...ada } : null)
		this.data.set(args.accountId, { ...sesudah })
		return { diterapkan: true, langganan: { ...sesudah } }
	}
}
