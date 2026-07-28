/**
 * @tinyverse/data-access
 *
 * Lapisan repository yang membungkus sumber data (Firebase) di balik
 * kontrak (port) yang stabil. Kode aplikasi memakai interface
 * `DrugRepository` / `UserRepository`, bukan Firebase langsung, sehingga
 * sumber data bisa ditukar & diuji tanpa mengubah pemakai. Lihat README.md.
 */
export * from "./shared/types"
export * from "./shared/errors"
export * from "./drugs"
export * from "./users"
export * from "./accounts"
export * from "./subscriptions"
export * from "./orders"

export { createInMemoryRepositories } from "./factory"
export type { Repositories } from "./factory"
