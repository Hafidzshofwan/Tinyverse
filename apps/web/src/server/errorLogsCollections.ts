import "server-only";

/**
 * Nama koleksi pemantauan error, terkumpul di satu tempat.
 *
 * Mengikuti pola yang sama dengan KOLEKSI_BILLING: nama koleksi yang ditulis
 * lepas di banyak berkas adalah sumber salah ketik yang tidak akan ditangkap
 * TypeScript.
 */
export const KOLEKSI_ERROR = {
  logs: "errorLogs",
} as const;
