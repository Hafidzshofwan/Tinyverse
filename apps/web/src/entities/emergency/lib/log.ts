const LOG_KEY = "tv_pasien_log";
export const NORM_KEY = "tv_darurat_norm";

/** Tambah entri ke riwayat pasien (localStorage) — port verbatim dari v17. */
export function tambahLog(entri: Record<string, unknown>): void {
  try {
    const arr = JSON.parse(
      window.localStorage.getItem(LOG_KEY) || "[]",
    ) as unknown[];
    arr.unshift(entri);
    window.localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(0, 200)));
  } catch {
    /* abaikan */
  }
}

export function bacaNoRm(): string {
  try {
    return window.localStorage.getItem(NORM_KEY) || "";
  } catch {
    return "";
  }
}
