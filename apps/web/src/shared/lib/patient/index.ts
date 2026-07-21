"use client";

import { useEffect, useState } from "react";

/** Kunci localStorage profil pasien terpusat (sama dengan widget Profil Pasien). */
export const PASIEN_AKTIF_KEY = "tv_pasien_aktif";

export type PatientProfile = {
  nama?: string;
  usiaBulan?: number | null;
  bb?: number | null;
  tb?: number | null;
  jk?: "male" | "female" | null;
};

function bacaProfil(): PatientProfile {
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

/**
 * Membaca profil pasien terpusat secara reaktif. Ikut memperbarui saat profil
 * diubah di tab lain (event `storage`) maupun di dalam halaman/island yang sama
 * (pesan `__tvPasien` yang disebar widget Profil Pasien).
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
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
    };
  }, []);

  return profile;
}

/**
 * Field input yang tersinkron dengan profil pasien terpusat.
 * - Saat nilai profil berubah, field otomatis mengikuti nilai profil.
 * - Pengguna tetap dapat menimpa nilai secara manual sesudahnya.
 */
export function useSyncedField(
  profileValue: number | null | undefined,
): [string, (v: string) => void] {
  const profStr = profileValue != null ? String(profileValue) : "";
  const [value, setValue] = useState(profStr);

  useEffect(() => {
    // Setiap kali profil berubah, ikuti nilai profil terbaru.
    setValue(profStr);
  }, [profStr]);

  return [value, setValue];
}
