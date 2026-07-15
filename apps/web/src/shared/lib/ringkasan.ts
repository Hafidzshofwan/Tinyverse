"use client";

// Kontrak data Ringkasan Klinis.
// Semua alat (island iframe maupun fitur React native) menulis poin klinis
// TERKURASI ke localStorage lewat addRingkasanItem(). Halaman Ringkasan membaca
// key yang sama. Karena seluruh island berada di origin yang sama, localStorage
// otomatis dibagikan lintas iframe -> tidak perlu server.

export const RINGKASAN_KEY = "tinyverse_ringkasan_klinis_v1";
export const RINGKASAN_PASIEN_KEY = "tinyverse_ringkasan_pasien_v1";
const PASIEN_AKTIF_KEY = "tv_pasien_aktif";
export const RINGKASAN_EVENT = "tv-ringkasan-change";

export interface RingkasanItem {
  id: string;
  title: string;
  body: string; // poin klinis terkurasi (teks polos, multi-baris)
  source?: string; // nama alat asal, mis. "Dosis Obat"
  time: string; // waktu lokal saat ditambahkan
}

export interface PasienRingkas {
  nama: string;
  noRm: string;
  usia: string;
  bbTb: string;
  catatan: string;
}

interface PasienAktif {
  nama?: string;
  usiaBulan?: number | null;
  bb?: number | null;
  tb?: number | null;
  jk?: "male" | "female" | null;
}

function browser(): boolean {
  return typeof window !== "undefined";
}

function emitChange(): void {
  if (!browser()) return;
  try {
    window.dispatchEvent(new Event(RINGKASAN_EVENT));
  } catch {
    /* abaikan */
  }
}

// ---------- Item hasil ----------
export function loadItems(): RingkasanItem[] {
  if (!browser()) return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(RINGKASAN_KEY) || "[]");
    return Array.isArray(raw) ? (raw as RingkasanItem[]) : [];
  } catch {
    return [];
  }
}

export function saveItems(items: RingkasanItem[]): void {
  if (!browser()) return;
  window.localStorage.setItem(RINGKASAN_KEY, JSON.stringify(items));
  emitChange();
}

function nowLabel(): string {
  return new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Dipanggil alat mana pun untuk mengirim poin klinis terkurasi ke Ringkasan.
export function addRingkasanItem(input: {
  title: string;
  body: string;
  source?: string;
}): RingkasanItem | null {
  const body = (input.body || "").trim();
  if (!body) return null;
  const item: RingkasanItem = {
    id: genId(),
    title: (input.title || "Hasil").trim(),
    body,
    source: input.source,
    time: nowLabel(),
  };
  const items = loadItems();
  items.unshift(item);
  saveItems(items);
  return item;
}

export function removeItem(id: string): RingkasanItem[] {
  const items = loadItems().filter((x) => x.id !== id);
  saveItems(items);
  return items;
}

export function clearItems(): void {
  saveItems([]);
}

// ---------- Pasien ----------
export function loadPasienAktif(): PasienAktif {
  if (!browser()) return {};
  try {
    return (
      (JSON.parse(
        window.localStorage.getItem(PASIEN_AKTIF_KEY) || "{}",
      ) as PasienAktif) || {}
    );
  } catch {
    return {};
  }
}

export function formatUsia(usiaBulan?: number | null): string {
  if (usiaBulan == null || !isFinite(usiaBulan)) return "";
  const th = Math.floor(usiaBulan / 12);
  const bl = Math.round(usiaBulan % 12);
  const bag: string[] = [];
  if (th > 0) bag.push(`${th} tahun`);
  if (bl > 0) bag.push(`${bl} bulan`);
  return bag.length ? bag.join(" ") : "0 bulan";
}

export function pasienFromProfil(): Pick<
  PasienRingkas,
  "nama" | "usia" | "bbTb"
> {
  const p = loadPasienAktif();
  const bbTb = [
    p.bb != null ? `${p.bb} kg` : "",
    p.tb != null ? `${p.tb} cm` : "",
  ]
    .filter(Boolean)
    .join(" / ");
  return { nama: p.nama || "", usia: formatUsia(p.usiaBulan), bbTb };
}

function loadPasienTersimpan(): Partial<PasienRingkas> {
  if (!browser()) return {};
  try {
    return (
      (JSON.parse(
        window.localStorage.getItem(RINGKASAN_PASIEN_KEY) || "{}",
      ) as Partial<PasienRingkas>) || {}
    );
  } catch {
    return {};
  }
}

// Gabung: nilai tersimpan diprioritaskan; bila kosong, ambil dari Profil Pasien.
export function loadPasienRingkas(): PasienRingkas {
  const saved = loadPasienTersimpan();
  const prof = pasienFromProfil();
  return {
    nama: saved.nama || prof.nama || "",
    noRm: saved.noRm || "",
    usia: saved.usia || prof.usia || "",
    bbTb: saved.bbTb || prof.bbTb || "",
    catatan: saved.catatan || "",
  };
}

export function savePasienRingkas(p: PasienRingkas): void {
  if (!browser()) return;
  window.localStorage.setItem(RINGKASAN_PASIEN_KEY, JSON.stringify(p));
}

// ---------- Teks export ----------
export function buildRingkasanText(
  pasien: PasienRingkas,
  items: RingkasanItem[],
): string {
  const lines: string[] = [];
  lines.push("RINGKASAN KLINIS TINYVERSE");
  lines.push(`Dibuat: ${nowLabel()}`);
  lines.push("");
  lines.push("DATA PASIEN");
  lines.push(`Nama/Inisial: ${pasien.nama || "-"}`);
  lines.push(`No. RM/ID: ${pasien.noRm || "-"}`);
  lines.push(`Usia: ${pasien.usia || "-"}`);
  lines.push(`BB/TB: ${pasien.bbTb || "-"}`);
  lines.push(`Catatan: ${pasien.catatan || "-"}`);
  lines.push("");
  lines.push("HASIL KALKULATOR");
  if (!items.length) {
    lines.push("- Belum ada hasil yang ditambahkan.");
  } else {
    items.forEach((it, i) => {
      lines.push("");
      lines.push(`${i + 1}. ${it.title}${it.source ? ` (${it.source})` : ""}`);
      lines.push(`Waktu: ${it.time}`);
      lines.push(it.body);
    });
  }
  lines.push("");
  lines.push(
    "Catatan: Ringkasan ini adalah alat bantu dokumentasi. Keputusan klinis tetap berdasarkan penilaian tenaga kesehatan.",
  );
  return lines.join("\n");
}

// ---------- Langganan perubahan (lintas iframe & dalam-tab) ----------
export function onRingkasanChange(cb: () => void): () => void {
  if (!browser()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key === RINGKASAN_KEY) cb();
  };
  const onLocal = () => cb();
  const onMsg = (e: MessageEvent) => {
    const d = e.data as { __tvRingkasan?: boolean } | null;
    if (d && d.__tvRingkasan) cb();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(RINGKASAN_EVENT, onLocal);
  window.addEventListener("message", onMsg);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(RINGKASAN_EVENT, onLocal);
    window.removeEventListener("message", onMsg);
  };
}
