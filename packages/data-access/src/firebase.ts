/**
 * Entri khusus Firebase (`@tinyverse/data-access/firebase`).
 *
 * Dipisah dari barrel utama supaya package inti tetap bisa dipakai & diuji
 * tanpa memuat SDK Firebase. Impor dari sini hanya di sisi yang memang
 * memakai Firestore (mis. inisialisasi aplikasi).
 */
export { FirebaseDrugRepository } from "./drugs/firebase"
export type { FirebaseDrugRepositoryDeps } from "./drugs/firebase"
export { seedDrugsToFirestore } from "./drugs/seed"
export { FirebaseUserRepository } from "./users/firebase"
export type { FirebaseUserRepositoryDeps } from "./users/firebase"
export { createFirebaseRepositories } from "./firebase-factory"
export type { FirebaseRepositoriesDeps } from "./firebase-factory"
