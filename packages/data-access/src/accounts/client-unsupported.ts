import { NotImplementedError } from "../shared/errors"
import type { AccountRepository } from "./repository"
import type { Account, Membership } from "./types"

/**
 * Implementasi AccountRepository untuk sisi KLIEN yang sengaja selalu menolak.
 *
 * WHY ada sama sekali:
 * `Repositories` mewajibkan field `accounts`, sedangkan akun dan keanggotaan
 * hanya boleh disentuh oleh server lewat Admin SDK. Firestore Security Rules
 * menutup kedua koleksi itu dari klien, jadi adapter Firestore sisi klien akan
 * selalu gagal di tengah jalan.
 *
 * WHY melempar, bukan mengembalikan null atau array kosong:
 * Nilai kosong yang "sopan" akan tampak seperti "pengguna ini tidak punya
 * akun" dan diam-diam membuat pengecekan hak akses meleset. Kegagalan yang
 * berisik jauh lebih aman untuk sistem langganan - salah di sisi ini berarti
 * memberi atau mencabut akses berbayar tanpa jejak.
 *
 * Implementasi sungguhannya ada di apps/web/src/server/accountsAdmin.ts.
 */
export class ClientUnsupportedAccountRepository implements AccountRepository {
	private tolak(metode: string): never {
		throw new NotImplementedError(
			"AccountRepository." +
				metode +
				" di sisi klien. Akun hanya dapat diakses dari server (Admin SDK)",
		)
	}

	async getAccount(_id: string): Promise<Account | null> {
		return this.tolak("getAccount")
	}

	async saveAccount(_account: Account): Promise<void> {
		return this.tolak("saveAccount")
	}

	async listMembershipsByUid(_uid: string): Promise<Membership[]> {
		return this.tolak("listMembershipsByUid")
	}

	async saveMembership(_membership: Membership): Promise<void> {
		return this.tolak("saveMembership")
	}
}
