"use client";

/**
 * Pencatat error produksi sisi klien.
 *
 * WHY ada di luar app/error.tsx: dua penangkap error React (`app/error.tsx`
 * dan `app/global-error.tsx`) hanya menangkap error yang terlempar SAAT
 * render. Error di dalam penangan event (`onClick`), kode async
 * (`setTimeout`, `.then`), atau Promise yang ditolak tanpa `catch` tidak
 * pernah sampai ke batas React itu — React memang tidak dirancang untuk
 * menangkapnya. Satu-satunya cara menangkap kelas error ini adalah listener
 * global `window.onerror` dan `unhandledrejection`, yang dipasang di sini.
 *
 * WHY dedup & batas di sisi klien, padahal server sudah menggabungkan per
 * sidik jari: server hanya bisa menghemat PENYIMPANAN. Tanpa batas di sini,
 * satu bug yang terpicu di dalam sebuah loop render bisa mengirim ribuan
 * permintaan jaringan dalam hitungan detik, membebani peramban pengguna itu
 * sendiri — justru saat mereka sedang mengalami bug. Batas di sisi klien
 * melindungi PENGALAMAN pengguna yang melapor, bukan hanya basis data kita.
 */

export type LaporanError = {
  message: string;
  stack?: string;
  type: "window.onerror" | "unhandledrejection" | "boundary" | "manual";
};

const MAKS_LAPORAN_PER_SESI = 25;
const JEDA_DUPLIKAT_MS = 30_000;

let jumlahTerkirim = 0;
const terakhirDikirim = new Map<string, number>();
let listenerTerpasang = false;

function kunciDedup(pesan: string, stack: string): string {
  return (pesan + "|" + stack.split("\n")[0]).slice(0, 300);
}

/**
 * Pola pesan/stack yang DIKETAHUI bukan bug Tinyverse, melainkan noise dari
 * browser (bug WebKit di IndexedDB, internal autofill Safari) atau skrip
 * pihak ketiga (Google gapi, atau error lintas-origin generik tanpa detail).
 *
 * WHY difilter di sini dan bukan "diperbaiki": pesan-pesan ini tidak
 * mengandung informasi apa pun yang bisa ditelusuri ke baris kode kita, dan
 * beberapa di antaranya adalah bug yang sudah diakui pihak browser/vendor
 * sendiri. Membiarkannya lolos hanya menghabiskan jatah MAKS_LAPORAN_PER_SESI
 * milik pengguna yang sedang mengalami bug SUNGGUHAN di kode kita.
 */
const POLA_KEBISINGAN_DIKENAL: RegExp[] = [
  /attempt to get records from database without an in-progress transaction/i,
  /connection to indexed database server (was )?lost/i,
  /an internal error was encountered in the indexed database server/i,
  /_autofillcallbackhandler/i,
  /^script error\.?$/i,
];

function apakahKebisingan(message: string, stack: string): boolean {
  if (POLA_KEBISINGAN_DIKENAL.some((pola) => pola.test(message))) return true;
  if (/apis\.google\.com|gapi\.loaded|accounts\.google\.com/i.test(stack)) return true;
  return false;
}

/**
 * Kirim satu laporan error ke server. Aman dipanggil dari mana saja di
 * klien — termasuk dari `catch` manual di luar boundary React.
 */
export function catatErrorProduksi(laporan: LaporanError): void {
  if (typeof window === "undefined") return;

  const message = String(laporan.message || "").slice(0, 500);
  const stack = String(laporan.stack || "").slice(0, 4000);
  if (!message) return;
  if (apakahKebisingan(message, stack)) return;

  const kunci = kunciDedup(message, stack);
  const sekarang = Date.now();
  const terakhir = terakhirDikirim.get(kunci);
  if (terakhir && sekarang - terakhir < JEDA_DUPLIKAT_MS) return;

  if (jumlahTerkirim >= MAKS_LAPORAN_PER_SESI) return;
  jumlahTerkirim += 1;
  terakhirDikirim.set(kunci, sekarang);

  const payload = JSON.stringify({
    message,
    stack,
    type: laporan.type,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
  });

  /* `sendBeacon` diutamakan: laporan tetap terkirim walau halaman langsung
     ditinggalkan (mis. pengguna menutup tab setelah melihat layar error).
     `fetch` dengan `keepalive` sebagai cadangan bila `sendBeacon` tidak
     tersedia atau gagal karena payload/tipe konten tidak didukungnya. */
  try {
    const terkirimLewatBeacon =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(
        "/api/log-error",
        new Blob([payload], { type: "application/json" }),
      );
    if (terkirimLewatBeacon) return;
  } catch {
    // lanjut ke fallback fetch di bawah
  }

  try {
    void fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Pencatatan error tidak boleh melempar error baru.
  }
}

function padaErrorGlobal(event: ErrorEvent) {
  catatErrorProduksi({
    message: event.message || (event.error && event.error.message) || "Error tidak dikenal",
    stack: event.error && event.error.stack ? String(event.error.stack) : undefined,
    type: "window.onerror",
  });
}

function padaPromiseDitolak(event: PromiseRejectionEvent) {
  const alasan = event.reason;
  const pesan =
    alasan instanceof Error
      ? alasan.message
      : typeof alasan === "string"
        ? alasan
        : "Promise ditolak tanpa alasan yang jelas";
  catatErrorProduksi({
    message: pesan,
    stack: alasan instanceof Error ? alasan.stack : undefined,
    type: "unhandledrejection",
  });
}

/**
 * Pasang listener global sekali per muat halaman. Aman dipanggil berkali-kali
 * (mis. dari React Strict Mode yang menjalankan efek dua kali) karena dijaga
 * dengan bendera modul.
 */
export function pasangPemantauErrorGlobal(): void {
  if (typeof window === "undefined" || listenerTerpasang) return;
  listenerTerpasang = true;
  window.addEventListener("error", padaErrorGlobal);
  window.addEventListener("unhandledrejection", padaPromiseDitolak);
}
