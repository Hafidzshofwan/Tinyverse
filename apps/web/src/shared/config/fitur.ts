/**
 * Saklar fitur (feature flag) tingkat aplikasi.
 *
 * AUTH_WAJIB: apakah pengguna WAJIB login untuk memakai aplikasi.
 * - Default: true (perilaku saat ini — wajib login).
 * - Set env `NEXT_PUBLIC_AUTH_ENABLED=false` untuk mematikan wajib-login
 *   (berguna saat pengembangan / demo). Nilai NEXT_PUBLIC_* diproses saat build,
 *   sehingga aman dibaca baik di server maupun di browser.
 */
export const AUTH_WAJIB: boolean =
  String(process.env.NEXT_PUBLIC_AUTH_ENABLED ?? "true").toLowerCase() !==
  "false";
