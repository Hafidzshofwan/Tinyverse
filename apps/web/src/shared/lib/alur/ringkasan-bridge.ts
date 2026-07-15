import type { Pasien } from "./tipe";

// Kontrak sama dengan shared/lib/ringkasan.ts (Ringkasan Klinis)
const RINGKASAN_KEY = "tinyverse_ringkasan_klinis_v1";
const RINGKASAN_EVENT = "tv-ringkasan-change";
export const PASIEN_AKTIF_KEY = "tv_pasien_aktif";

export type RingkasanItem = {
  id: string;
  title: string;
  body: string;
  source?: string;
  time: string;
};

function idBaru(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function tambahKeRingkasan(input: { title: string; body: string; source?: string }): void {
  if (typeof window === "undefined") return;
  const item: RingkasanItem = {
    id: idBaru(),
    title: input.title,
    body: input.body,
    source: input.source,
    time: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
  };
  let daftar: RingkasanItem[] = [];
  try {
    const mentah = window.localStorage.getItem(RINGKASAN_KEY);
    if (mentah) daftar = JSON.parse(mentah) as RingkasanItem[];
  } catch {
    daftar = [];
  }
  daftar.unshift(item);
  try {
    window.localStorage.setItem(RINGKASAN_KEY, JSON.stringify(daftar));
  } catch {
    /* abaikan */
  }
  window.dispatchEvent(new Event(RINGKASAN_EVENT));
}

export function bacaPasienAktif(): Pasien | null {
  if (typeof window === "undefined") return null;
  try {
    const mentah = window.localStorage.getItem(PASIEN_AKTIF_KEY);
    if (!mentah) return null;
    return (JSON.parse(mentah) as Pasien) ?? null;
  } catch {
    return null;
  }
}
