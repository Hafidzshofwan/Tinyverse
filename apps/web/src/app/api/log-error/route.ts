/**
 * Penerima laporan error dari klien (browser) — dipakai oleh
 * `shared/lib/errorMonitoring`, `app/error.tsx`, dan `app/global-error.tsx`.
 *
 * WHY route publik tanpa gerbang sesi: error bisa terjadi pada siapa pun,
 * termasuk pengunjung yang belum masuk (mis. di halaman publik/landing).
 * Menahannya di belakang sesi berarti justru kelas pengguna yang paling
 * rawan menemui bug — pengunjung baru — yang laporannya paling sering hilang.
 *
 * WHY ditulis dengan Admin SDK, bukan langsung dari klien ke Firestore:
 * kalau klien menulis langsung, Security Rules koleksi ini terpaksa dibuka
 * untuk penulisan publik tanpa autentikasi, yang berarti siapa pun bisa
 * menulis dokumen apa pun ke koleksi ini lewat DevTools, bukan hanya laporan
 * error yang sah. Lewat route ini, tulisannya tetap dijaga: bentuknya
 * divalidasi & dipangkas di server, sedangkan Rules boleh menolak SEMUA akses
 * klien ke koleksi ini.
 *
 * WHY digabung per sidik jari (fingerprint) alih-alih satu dokumen per
 * kejadian: bug produksi yang sama biasanya terpicu berkali-kali dalam
 * hitungan menit (mis. dipanggil di setiap render yang gagal). Tanpa
 * penggabungan, satu bug bisa menulis ribuan dokumen dan membanjiri koleksi
 * sebelum ada yang sempat membacanya. Dengan digabung, banyaknya dokumen
 * dibatasi oleh banyaknya JENIS error yang berbeda, bukan oleh berapa kali
 * masing-masing terjadi — dan jumlah kejadian tetap tersimpan lewat `count`.
 */
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/server/firebaseAdmin";
import { bacaSesi } from "@/server/session";
import { KOLEKSI_ERROR } from "@/server/errorLogsCollections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Pangkas semua nilai teks: laporan error dari peramban tidak boleh dipercaya
   begitu saja, dan Firestore memberi harga per byte yang ditulis. */
const MAKS = {
  message: 500,
  stack: 4000,
  pathname: 300,
  userAgent: 300,
  type: 60,
};

function potong(nilai: unknown, maks: number): string {
  if (typeof nilai !== "string") return "";
  const bersih = nilai.trim();
  return bersih.length > maks ? bersih.slice(0, maks) : bersih;
}

/*
 * Pembatas laju sangat sederhana, disimpan di memori proses.
 *
 * Ini BUKAN pembatas laju yang kuat: setiap instans server tanpa-server
 * (Vercel) punya memorinya sendiri dan bisa didaur ulang kapan saja, sehingga
 * batas ini paling banter mencegah satu sumber membanjiri satu instans yang
 * sedang hangat. Pertahanan utama terhadap banjir tetap penggabungan per
 * sidik jari di atas — pembatas ini hanya lapisan kedua untuk kasus banyak
 * error yang BERBEDA-beda dari sumber yang sama.
 */
const JENDELA_MS = 60_000;
const MAKS_PER_JENDELA = 40;
const pelacakLaju = new Map<string, { mulai: number; jumlah: number }>();

function melebihiLaju(kunci: string): boolean {
  const sekarang = Date.now();
  const catatan = pelacakLaju.get(kunci);
  if (!catatan || sekarang - catatan.mulai > JENDELA_MS) {
    pelacakLaju.set(kunci, { mulai: sekarang, jumlah: 1 });
    return false;
  }
  catatan.jumlah += 1;
  return catatan.jumlah > MAKS_PER_JENDELA;
}

/* Peta sederhana bisa terus tumbuh bila banyak IP berbeda memanggil endpoint
   ini. Dibersihkan sesekali agar tidak jadi kebocoran memori yang lambat. */
function bersihkanPelacakLaju() {
  const sekarang = Date.now();
  if (pelacakLaju.size < 500) return;
  for (const [kunci, catatan] of pelacakLaju) {
    if (sekarang - catatan.mulai > JENDELA_MS) pelacakLaju.delete(kunci);
  }
}

function sidikJari(type: string, message: string, stack: string): string {
  /* Baris pertama stack biasanya memuat nama fungsi + lokasi — cukup stabil
     untuk membedakan bug yang berbeda tanpa ikut membedakan nomor baris yang
     bisa bergeser antar build. */
  const barisPertama = stack.split("\n")[0] ?? "";
  const bahan = type + "|" + message + "|" + barisPertama;
  return createHash("sha1").update(bahan).digest("hex").slice(0, 24);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "tidak-diketahui";

  bersihkanPelacakLaju();
  if (melebihiLaju(ip)) {
    /* 204: peramban pelapor tidak perlu tahu ia sedang dibatasi — ini bukan
       kesalahan pengguna, dan tidak ada yang bisa mereka lakukan soal itu. */
    return new NextResponse(null, { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Isi permintaan tidak valid." }, { status: 400 });
  }

  const message = potong(body.message, MAKS.message) || "(tanpa pesan)";
  const stack = potong(body.stack, MAKS.stack);
  const pathname = potong(body.pathname, MAKS.pathname) || "(tidak diketahui)";
  const userAgent = potong(body.userAgent, MAKS.userAgent);
  const type = potong(body.type, MAKS.type) || "unknown";

  /* Sesi bersifat opsional: laporan tetap diterima dari pengunjung yang belum
     masuk. `bacaSesi` sendiri tidak pernah melempar, tapi dibungkus try/catch
     lagi di sini karena endpoint ini tidak boleh gagal hanya gara-gara
     pembacaan sesi bermasalah — laporan error jauh lebih penting untuk
     tersimpan daripada mengetahui siapa pelapornya. */
  let email: string | null = null;
  try {
    const sesi = await bacaSesi();
    email = sesi?.email ?? null;
  } catch {
    email = null;
  }

  const fingerprint = sidikJari(type, message, stack);
  const sekarang = new Date().toISOString();
  const db = adminDb();
  const ref = db.collection(KOLEKSI_ERROR.logs).doc(fingerprint);

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        tx.set(ref, {
          fingerprint,
          type,
          message,
          stack,
          pathname,
          userAgent,
          email,
          count: 1,
          firstSeenAt: sekarang,
          lastSeenAt: sekarang,
          resolved: false,
        });
      } else {
        /* `resolved` sengaja dikembalikan ke false: bug yang tadinya ditandai
           selesai lalu muncul lagi berarti belum benar-benar selesai — admin
           yang menutupnya sebelumnya perlu tahu ia terbuka kembali. */
        tx.update(ref, {
          message,
          stack,
          pathname,
          userAgent,
          email,
          count: FieldValue.increment(1),
          lastSeenAt: sekarang,
          resolved: false,
        });
      }
    });
  } catch (e) {
    /* Kegagalan mencatat error tidak boleh berubah jadi error kedua yang
       terlihat pengguna. Cukup catat di log server (Vercel) dan kembalikan
       sukses semu ke klien. */
    console.error("Gagal mencatat error produksi:", e);
  }

  return new NextResponse(null, { status: 204 });
}
