/**
 * Gerbang berbayar untuk SELURUH alat klinis.
 *
 * WHY di layout, bukan di tiap halaman: ada enam belas alat di bawah /preview,
 * dan akan bertambah. Bila penjagaan ditulis di masing-masing halaman, cukup
 * satu halaman baru dibuat tanpa mengingat pemeriksaan ini untuk membuka
 * seluruh isi berbayar. Layout membungkus semua rute di bawahnya tanpa kecuali,
 * termasuk rute yang belum ada. Aman secara bawaan, bukan aman bila diingat.
 *
 * WHY Server Component: keputusan diambil sebelum HTML dikirim, sehingga markup
 * alat berbayar tidak pernah sampai ke browser pengguna yang belum berlangganan.
 * Penjagaan di sisi klien hanya menyembunyikan tampilan — datanya tetap terkirim
 * dan bisa dibaca lewat devtools dalam hitungan detik.
 *
 * Tidak ada jalan pintas untuk admin. Pemilik yang perlu menguji cukup
 * mengaktifkan langganannya sendiri lewat aktivasi manual. Setiap jalan pintas
 * adalah cabang kode yang tidak pernah dilalui pengguna sungguhan, sehingga
 * kerusakan di jalur utama bisa lama tidak tertangkap.
 *
 * SATU-SATUNYA pengecualian ada di `gerbangDimatikan()` di bawah, khusus untuk
 * lingkungan pengembangan. Alasannya praktis: penyunting seperti Google AI
 * Studio menjalankan aplikasi pada host lain dan di dalam iframe, sehingga
 * cookie sesi `tv_sesi` tidak pernah ikut terkirim dan seluruh alat klinis
 * terkunci meski penyuntingnya sudah masuk.
 *
 * Pengecualian itu dibuat mustahil menyentuh produksi: syaratnya NODE_ENV harus
 * bukan "production". Vercel selalu membangun dengan NODE_ENV=production, baik
 * untuk domain utama maupun untuk deployment pratinjau, jadi situs yang diakses
 * pengguna tetap terjaga tanpa perlu mengingat mematikan saklar apa pun. Inilah
 * sebabnya saya tidak memakai environment variable: saklar yang harus diingat
 * cepat atau lambat akan lupa dimatikan.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { statusAksesSaatIni } from "@/server/entitlementServer";
import { KATALOG_PLAN } from "@/server/planKatalog";
import gaya from "./gerbang.module.css";

/* Admin SDK tidak bisa berjalan di Edge Runtime. */
export const runtime = "nodejs";
/* Tanpa ini, Next boleh menyajikan hasil render lama dari cache — dan hasil
   render itu bisa berasal dari pengguna dengan status langganan berbeda. */
export const dynamic = "force-dynamic";

function KunciIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16.5" r="1.5" />
    </svg>
  );
}

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
}

function tanggal(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Benar hanya saat aplikasi dijalankan lewat `next dev` (mesin sendiri atau
 * penyunting daring). Selalu salah pada hasil build produksi.
 */
function gerbangDimatikan(): boolean {
  return process.env.NODE_ENV !== "production";
}

export default async function LayoutPreview({ children }: { children: ReactNode }) {
  if (gerbangDimatikan()) return <>{children}</>;

  const status = await statusAksesSaatIni();

  /* Belum masuk. AppShell sudah menampilkan layar masuk di sisi klien, tetapi
     server tidak boleh bergantung pada itu: pemeriksaan klien tidak menghalangi
     siapa pun mengambil HTML halaman ini langsung. */
  if (!status.masuk) {
    return (
      <main className={gaya.wrap}>
        <div className={gaya.ikon} aria-hidden>
          <KunciIcon />
        </div>
        <h1 className={gaya.judul}>Masuk terlebih dahulu</h1>
        <p className={gaya.sub}>
          Alat klinis Tinyverse hanya tersedia bagi pengguna yang sudah masuk.
        </p>
      </main>
    );
  }

  const e = status.entitlement;

  if (!e.bolehAkses) {
    const kedaluwarsa = e.status === "kedaluwarsa";
    return (
      <main className={gaya.wrap}>
        <div className={gaya.ikon} aria-hidden>
          <KunciIcon />
        </div>
        <h1 className={gaya.judul}>
          {kedaluwarsa ? "Masa langganan berakhir" : "Fitur berlangganan"}
        </h1>
        <p className={gaya.sub}>
          {kedaluwarsa
            ? `Langganan Anda berakhir pada ${tanggal(e.berakhirPada)}. Perpanjang untuk memakai alat klinis kembali.`
            : "Seluruh alat klinis Tinyverse tersedia untuk pelanggan. Data pasien yang sudah Anda simpan tetap utuh."}
        </p>

        <section className={gaya.kartu}>
          {KATALOG_PLAN.filter((p) => p.aktif).map((p) => (
            <div className={gaya.baris} key={p.id}>
              <span className={gaya.label}>
                {p.nama} &middot; {p.durasiHari} hari
              </span>
              <span className={gaya.nilai}>{rupiah(p.hargaRupiah)}</span>
            </div>
          ))}
        </section>

        <Link href="/langganan" className={gaya.tombol}>
          Lihat langganan
        </Link>

        <p className={gaya.catatan}>
          Sekali bayar. Bila tidak diperpanjang, tidak ada tagihan berikutnya dan
          tidak ada penarikan otomatis.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
