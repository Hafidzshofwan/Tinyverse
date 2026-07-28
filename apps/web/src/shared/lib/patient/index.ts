"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, pastikanAuthData } from "../firebase";
import {
  akunPasien,
  uidPasien,
  dengarAkunPasien,
  kunciDaftarPasien,
  jalurKoleksiPasien,
  jalurPasien,
  jalurPasienAktif,
} from "./skope";

export { setAkunPasien, akunPasien } from "./skope";

export { validateAntropometri } from "./validation";
export type { ValidationAlert } from "./validation";

/** Kunci localStorage profil pasien terpusat & daftar pasien tersimpan. */
export const PASIEN_AKTIF_KEY = "tv_pasien_aktif";
/**
 * Kunci daftar pasien kini dipisah per akun lewat kunciDaftarPasien().
 * Nama lama disimpan hanya sebagai catatan; jangan dipakai untuk menulis.
 */
export const PASIEN_LIST_KEY_LAMA = "tv_pasien_list";

export type PatientProfile = {
  id?: string;
  nama?: string;
  noRm?: string; // Nomor Rekam Medis / Kamar / Bed
  usiaBulan?: number | null;
  bb?: number | null;
  tb?: number | null;
  jk?: "male" | "female" | null;
  catatan?: string; // Diagnosa singkat / lokasi
  updatedAt?: string;
};

export function formatUsiaPasien(ub?: number | null): string {
  if (ub == null) return "-";
  if (ub < 24) return `${ub} bln`;
  const th = Math.floor(ub / 12);
  const s = ub % 12;
  return s > 0 ? `${th} th ${s} bln` : `${th} th`;
}

export function bacaProfil(): PatientProfile {
  if (typeof window === "undefined") return {};
  try {
    return (
      (JSON.parse(
        window.localStorage.getItem(PASIEN_AKTIF_KEY) || "{}",
      ) as PatientProfile) || {}
    );
  } catch {
    return {};
  }
}

export function bacaDaftarPasien(): PatientProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(kunciDaftarPasien());
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    let needsSave = false;
    const cleanList = list
      .map((item, idx) => {
        if (!item || typeof item !== "object") return item;
        if (!item.id) {
          needsSave = true;
          return {
            ...item,
            id: `p_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          };
        }
        return item;
      })
      .filter(Boolean);

    if (needsSave) {
      window.localStorage.setItem(kunciDaftarPasien(), JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return [];
  }
}

export function sebarKeIsland() {
  if (typeof window === "undefined") return;
  try {
    document.querySelectorAll("iframe").forEach((f) => {
      f.contentWindow?.postMessage({ __tvPasien: true }, "*");
    });
  } catch {
    /* abaikan */
  }
  try {
    window.dispatchEvent(new CustomEvent("tv-pasien-change"));
  } catch {
    /* abaikan */
  }
}

export function sebarPerubahanDaftarPasien() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("tv-pasien-list-change"));
  } catch {
    /* abaikan */
  }
}

export function pilihPasienAktif(p: PatientProfile, syncToFirebase = true) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PASIEN_AKTIF_KEY, JSON.stringify(p));
  } catch {
    /* abaikan */
  }
  sebarKeIsland();

  const jalurAktif = jalurPasienAktif();
  if (syncToFirebase && db && jalurAktif) {
    try {
      const activeRef = doc(db, jalurAktif);
      void pastikanAuthData(uidPasien()).then((siap) => {
        if (!siap) return;
        setDoc(
          activeRef,
          {
            patient: p,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        ).catch((err) => {
          console.warn("Firebase active patient sync error:", err);
        });
      });
    } catch (e) {
      console.warn("Firebase active patient sync error:", e);
    }
  }
}

export function simpanDaftarPasien(list: PatientProfile[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(kunciDaftarPasien(), JSON.stringify(list));
  } catch {
    /* abaikan */
  }
  sebarPerubahanDaftarPasien();
}

export function tambahAtauUpdatePasienInList(
  pasien: PatientProfile,
  setAktif = true,
): PatientProfile {
  const list = bacaDaftarPasien();
  const nowStr = new Date().toISOString();

  const id = pasien.id || `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const itemBaru: PatientProfile = {
    ...pasien,
    id,
    updatedAt: nowStr,
  };

  const idx = list.findIndex((item) => item.id === id);
  let listBaru: PatientProfile[];
  if (idx >= 0) {
    listBaru = [...list];
    listBaru[idx] = itemBaru;
  } else {
    listBaru = [itemBaru, ...list];
  }

  simpanDaftarPasien(listBaru);

  if (setAktif) {
    pilihPasienAktif(itemBaru, true);
  }

  // Sync item ke Firestore
  const jalurSimpan = jalurPasien(id);
  if (db && jalurSimpan) {
    try {
      const pRef = doc(db, jalurSimpan);
      void pastikanAuthData(uidPasien()).then((siap) => {
        if (!siap) return;
        setDoc(pRef, itemBaru, { merge: true }).catch((err) => {
          console.warn("Firebase patient save error:", err);
        });
      });
    } catch (e) {
      console.warn("Firebase patient save error:", e);
    }
  }

  return itemBaru;
}

export function hapusPasienFromList(id: string) {
  const list = bacaDaftarPasien();
  const deletedItem = list.find((p) => p.id === id);
  const listBaru = list.filter((p) => p.id !== id);
  simpanDaftarPasien(listBaru);

  // Jika pasien yang dihapus adalah pasien aktif, ganti ke pasien lain atau kosongkan
  const aktif = bacaProfil();
  const isAktifDeleted =
    aktif.id === id ||
    (deletedItem && aktif.nama && deletedItem.nama === aktif.nama && deletedItem.bb === aktif.bb);

  if (isAktifDeleted) {
    if (listBaru.length > 0) {
      pilihPasienAktif(listBaru[0]!, true);
    } else {
      pilihPasienAktif({}, true);
    }
  }

  // Hapus dari Firestore
  const jalurHapus = jalurPasien(id);
  if (db && jalurHapus) {
    try {
      const pRef = doc(db, jalurHapus);
      void pastikanAuthData(uidPasien()).then((siap) => {
        if (!siap) return;
        deleteDoc(pRef).catch((err) => {
          console.warn("Firebase patient delete error:", err);
        });
      });
    } catch (e) {
      console.warn("Firebase patient delete error:", e);
    }
  }
}

/** Listener yang sedang aktif, dan akun yang sedang tersinkron. */
let unsubAktif: Array<() => void> = [];
let akunTersinkron: string | null = null;

export function matikanSinkronPasien(): void {
  unsubAktif.forEach((f) => {
    try {
      f();
    } catch {
      /* abaikan */
    }
  });
  unsubAktif = [];
  akunTersinkron = null;
}

/**
 * Membersihkan jejak pasien di browser saat pengguna keluar.
 *
 * Daftar pasien sudah dipisah per akun, tetapi pasien AKTIF masih memakai satu
 * kunci bersama, jadi ia wajib dihapus. Tanpa ini, pengguna berikutnya di
 * komputer yang sama akan menemukan pasien orang lain sudah terpilih.
 */
export function bersihkanPasienLokal(): void {
  if (typeof window === "undefined") return;
  matikanSinkronPasien();
  try {
    window.localStorage.removeItem(PASIEN_AKTIF_KEY);
  } catch {
    /* abaikan */
  }
  sebarKeIsland();
  sebarPerubahanDaftarPasien();
}

/**
 * Inisialisasi listener real-time Firestore untuk sinkronisasi antar-perangkat.
 * Dipasang ulang setiap kali akun berganti, dan tidak dipasang sama sekali
 * sebelum ada akun yang masuk.
 */
export function initFirebasePatientSync() {
  if (typeof window === "undefined" || !db) return;
  const akun = akunPasien();
  if (!akun || akunTersinkron === akun) return;

  matikanSinkronPasien();
  akunTersinkron = akun;

  void pastikanAuthData(uidPasien()).then((siap) => {
    // Akun bisa berganti selagi token diterbitkan; jangan pasang listener basi.
    if (!siap || akunPasien() !== akun || akunTersinkron !== akun) return;
    pasangListenerPasien();
  });
}

function pasangListenerPasien() {
  const jalurKoleksi = jalurKoleksiPasien();
  const jalurAktif = jalurPasienAktif();
  if (!db || !jalurKoleksi || !jalurAktif) return;

  try {
    // 1. Dengar perubahan koleksi pasien milik akun ini
    const patientsCol = collection(db, jalurKoleksi);
    const unsub1 = onSnapshot(
      patientsCol,
      (snapshot) => {
        const remotePatients: PatientProfile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PatientProfile;
          if (data && data.id) {
            remotePatients.push(data);
          }
        });

        // Urutkan berdasarkan updatedAt terbaru
        remotePatients.sort((a, b) => {
          const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return tB - tA;
        });

        // Jika Firestore masih kosong tetapi localStorage memiliki data, migrasi data lokal ke Firebase
        if (remotePatients.length === 0) {
          const localList = bacaDaftarPasien();
          if (localList.length > 0) {
            localList.forEach((item) => {
              const jalurItem = item.id ? jalurPasien(item.id) : null;
              if (jalurItem) {
                const pRef = doc(db, jalurItem);
                setDoc(pRef, item, { merge: true }).catch(() => {});
              }
            });
          }
        } else {
          // Perbarui localStorage dari data Firestore
          window.localStorage.setItem(
            kunciDaftarPasien(),
            JSON.stringify(remotePatients),
          );
          sebarPerubahanDaftarPasien();
        }
      },
      (err) => {
        console.warn("Firestore patients subscription warning:", err);
      },
    );

    unsubAktif.push(unsub1);

    // 2. Dengar perubahan pasien aktif milik akun ini
    const activeDocRef = doc(db, jalurAktif);
    const unsub2 = onSnapshot(
      activeDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { patient?: PatientProfile };
          if (data && data.patient) {
            const currentLocal = bacaProfil();
            if (JSON.stringify(currentLocal) !== JSON.stringify(data.patient)) {
              window.localStorage.setItem(
                PASIEN_AKTIF_KEY,
                JSON.stringify(data.patient),
              );
              sebarKeIsland();
            }
          }
        }
      },
      (err) => {
        console.warn("Firestore active patient subscription warning:", err);
      },
    );
    unsubAktif.push(unsub2);
  } catch (e) {
    console.warn("Firebase sync init error:", e);
  }
}

/**
 * Membaca profil pasien terpusat secara reaktif.
 */
export function usePatientProfile(): PatientProfile {
  const [profile, setProfile] = useState<PatientProfile>({});

  useEffect(() => {
    initFirebasePatientSync();
    const muat = () => setProfile(bacaProfil());
    muat();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === PASIEN_AKTIF_KEY) muat();
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __tvPasien?: boolean } | null;
      if (d && d.__tvPasien) muat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("message", onMsg);
    window.addEventListener("tv-pasien-change", muat);
    const lepasAkun = dengarAkunPasien(() => {
      initFirebasePatientSync();
      muat();
    });
    return () => {
      lepasAkun();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
      window.removeEventListener("tv-pasien-change", muat);
    };
  }, []);

  return profile;
}

/**
 * Membaca daftar pasien tersimpan secara reaktif.
 */
export function usePatientList(): PatientProfile[] {
  const [list, setList] = useState<PatientProfile[]>([]);

  const muat = useCallback(() => {
    setList(bacaDaftarPasien());
  }, []);

  useEffect(() => {
    initFirebasePatientSync();
    muat();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === kunciDaftarPasien()) muat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("tv-pasien-list-change", muat);
    const lepasAkun = dengarAkunPasien(() => {
      initFirebasePatientSync();
      muat();
    });
    return () => {
      lepasAkun();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("tv-pasien-list-change", muat);
    };
  }, [muat]);

  return list;
}

/**
 * Field input yang tersinkron dengan profil pasien terpusat.
 */
export function useSyncedField(
  profileValue: number | null | undefined,
): [string, (v: string) => void] {
  const profStr = profileValue != null ? String(profileValue) : "";
  const [value, setValue] = useState(profStr);

  useEffect(() => {
    setValue(profStr);
  }, [profStr]);

  return [value, setValue];
}
