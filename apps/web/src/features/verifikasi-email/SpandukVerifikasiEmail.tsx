/**
 * Re-export dari widgets/user-account.
 *
 * Komponen ini dipindah ke widgets karena membutuhkan useAuth dari
 * widgets/user-account, dan aturan boundaries/element-types melarang
 * features mengimpor dari widgets secara langsung.
 */
export { SpandukVerifikasiEmail } from "@/widgets/user-account";
