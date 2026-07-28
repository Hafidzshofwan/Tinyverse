import type { Langganan } from "@tinyverse/billing"
import type { Id } from "../shared/types"

/**
 * Port akses langganan. Satu akun memiliki paling banyak satu langganan,
 * sehingga accountId sekaligus menjadi id dokumennya.
 *
 * Sengaja TIDAK ada metode `setStatus` atau sejenisnya. Status langganan tidak
 * pernah disimpan - ia dihitung dari periodeBerakhir oleh @tinyverse/billing.
 * Menyediakan metode untuk menulis status akan mengundang orang memakainya,
 * dan sejak itu ada dua sumber kebenaran yang pasti akan berselisih.
 */
export type SubscriptionRepository = {
	/** Langganan sebuah akun; null bila akun belum pernah membeli. */
	get(accountId: Id): Promise<Langganan | null>
	/** Simpan/perbarui langganan (upsert). */
	save(langganan: Langganan): Promise<void>
}
