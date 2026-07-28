"use client";

/**
 * Lingkup akun untuk data pasien.
 *
 * WHY ada berkas ini: sebelumnya seluruh data pasien tersimpan di koleksi datar
 * (`patients`, `growthRecords`, `appState`) tanpa penanda pemilik. Akibatnya
 * setiap pengguna yang masuk melihat pasien milik semua pengguna lain. Untuk
 * data medis, itu tidak bisa diterima.
 *
 * Sekarang setiap jalur Firestore dan setiap kunci localStorage mengandung
 * accountId. Untuk akun perorangan, accountId sama dengan UID pengguna.
 *
 * localStorage juga harus ikut dipisah, bukan hanya Firestore. Dua akun yang
 * dipakai di browser yang sama berbagi localStorage, jadi tanpa pemisahan ini
 * akun kedua tetap membaca daftar pasien akun pertama dari penyimpanan lokal —
 * meskipun Rules di server sudah benar.
 */

let akun: string | null = null;
let uidPengguna: string | null = null;
const pendengar = new Set<() => void>();

export function akunPasien(): string | null {
  return akun;
}

/**
 * UID pengguna yang sedang masuk.
 *
 * Dipisahkan dari accountId meski nilainya kini sama, karena keduanya menjawab
 * pertanyaan berbeda: accountId = "data ini milik siapa", uid = "siapa yang
 * sedang menulis". Saat akun institusi datang keduanya berbeda, dan pemanggil
 * tidak perlu diubah.
 */
export function uidPasien(): string | null {
  return uidPengguna;
}

/** Dipanggil AuthProvider saat pengguna masuk (uid) dan keluar (null). */
export function setAkunPasien(uid: string | null): void {
  if (akun === uid) return;
  akun = uid;
  uidPengguna = uid;
  pendengar.forEach((f) => {
    try {
      f();
    } catch {
      /* abaikan */
    }
  });
}

export function dengarAkunPasien(f: () => void): () => void {
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
  };
}

/* ---- Kunci localStorage, dipisah per akun ---- */

export function kunciDaftarPasien(): string {
  return akun ? `tv_pasien_list__${akun}` : "tv_pasien_list__tamu";
}

export function kunciRiwayatTumbuh(patientId: string): string {
  const p = patientId || "default";
  return akun ? `tv_growth__${akun}__${p}` : `tv_growth__tamu__${p}`;
}

/* ---- Jalur Firestore. Mengembalikan null bila belum ada akun, supaya
       pemanggil wajib menangani keadaan itu alih-alih menulis ke jalur salah. ---- */

export function jalurKoleksiPasien(): string | null {
  return akun ? `accounts/${akun}/patients` : null;
}

export function jalurPasien(id: string): string | null {
  return akun ? `accounts/${akun}/patients/${id}` : null;
}

export function jalurPasienAktif(): string | null {
  return akun ? `accounts/${akun}/appState/activePatient` : null;
}

export function jalurRiwayatTumbuh(patientId: string): string | null {
  return akun ? `accounts/${akun}/growthRecords/${patientId}` : null;
}
