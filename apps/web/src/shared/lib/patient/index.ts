"use client";

import { useEffect, useState, useCallback } from "react";

/** Kunci localStorage profil pasien terpusat & daftar pasien tersimpan. */
export const PASIEN_AKTIF_KEY = "tv_pasien_aktif";
export const PASIEN_LIST_KEY = "tv_pasien_list";

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
    const raw = window.localStorage.getItem(PASIEN_LIST_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    
    let needsSave = false;
    const cleanList = list.map((item, idx) => {
      if (!item || typeof item !== "object") return item;
      if (!item.id) {
        needsSave = true;
        return {
          ...item,
          id: `p_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        };
      }
      return item;
    }).filter(Boolean);

    if (needsSave) {
      window.localStorage.setItem(PASIEN_LIST_KEY, JSON.stringify(cleanList));
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

export function pilihPasienAktif(p: PatientProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PASIEN_AKTIF_KEY, JSON.stringify(p));
  } catch {
    /* abaikan */
  }
  sebarKeIsland();
}

export function simpanDaftarPasien(list: PatientProfile[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PASIEN_LIST_KEY, JSON.stringify(list));
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
    pilihPasienAktif(itemBaru);
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
      pilihPasienAktif(listBaru[0]!);
    } else {
      pilihPasienAktif({});
    }
  }
}

/**
 * Membaca profil pasien terpusat secara reaktif.
 */
export function usePatientProfile(): PatientProfile {
  const [profile, setProfile] = useState<PatientProfile>({});

  useEffect(() => {
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
    return () => {
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
    muat();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === PASIEN_LIST_KEY) muat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("tv-pasien-list-change", muat);
    return () => {
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

