const LOG_KEY = "tv_pasien_log";
export const NORM_KEY = "tv_darurat_norm";

function safeJsonStringify(obj: unknown): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  });
}

/** Tambah entri ke riwayat pasien (localStorage) — port verbatim dari v17. */
export function tambahLog(entri: Record<string, unknown>): void {
  try {
    const raw = window.localStorage.getItem(LOG_KEY) || "[]";
    let arr: unknown[] = [];
    try {
      arr = JSON.parse(raw);
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }
    arr.unshift(entri);
    window.localStorage.setItem(LOG_KEY, safeJsonStringify(arr.slice(0, 200)));
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
