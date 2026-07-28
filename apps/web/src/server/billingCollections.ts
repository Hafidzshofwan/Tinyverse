import "server-only";

/**
 * Nama koleksi penagihan, terkumpul di satu tempat.
 *
 * Nama koleksi yang ditulis sebagai teks lepas di banyak berkas adalah sumber
 * salah ketik yang tidak akan ditangkap TypeScript: Firestore dengan senang
 * hati membuat koleksi baru bernama "subscription" (tanpa s), dan data pun
 * tersimpan di tempat yang salah tanpa satu pun pesan error.
 */
export const KOLEKSI_BILLING = {
  plans: "plans",
  subscriptions: "subscriptions",
  orders: "orders",
  paymentEvents: "paymentEvents",
  webhookInbox: "webhookInbox",
} as const;
