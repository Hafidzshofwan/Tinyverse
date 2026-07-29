/**
 * Halaman langganan.
 *
 * Server Component. Halaman ini boleh dibuka tanpa masuk -- calon pelanggan,
 * dan peninjau pendaftaran merchant Midtrans, harus bisa melihat paket beserta
 * harganya sebelum membuat akun. Keterbukaannya diatur oleh RUTE_PUBLIK di
 * AppShell.
 *
 * Bagian yang menyangkut akun (status langganan dan tombol beli) hanya
 * ditampilkan kepada pengguna yang sudah masuk.
 */
import Link from "next/link";

import type { StatusLangganan } from "@tinyverse/billing";

import { statusAksesSaatIni } from "@/server/entitlementServer";
import { envMidtrans } from "@/server/env";
import { KATALOG_PLAN } from "@/server/planKatalog";

import { TombolBeli } from "./TombolBeli";
import gaya from "./langganan.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LABEL_STATUS: Record<StatusLangganan, string> = {
  belum: "Belum berlangganan",
  aktif: "Aktif",
  kedaluwarsa: "Kedaluwarsa",
};

const KELAS_STATUS: Record<StatusLangganan, string> = {
  belum: gaya.belum ?? "",
  aktif: gaya.aktif ?? "",
  kedaluwarsa: gaya.kedaluwarsa ?? "",
};

const ISI_LANGGANAN: readonly string[] = [
  "Dosis Obat, Terapi Cairan, dan Racik Puyer",
  "Tumbuh Kembang: kurva WHO & CDC serta pemantauan longitudinal",
  "Skoring Klinis dan Interpretasi Lab",
  "Kalkulator Nutrisi dan Jadwal Imunisasi",
  "Guideline, Alur Tata Laksana, dan Mode Darurat",
  "Asisten AI dan pencarian global lintas alat",
];

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
}

function tanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Konfigurasi jendela pembayaran.
 *
 * Dibungkus try/catch dengan sengaja: halaman ini kini terbuka untuk umum, dan
 * satu variabel lingkungan yang belum terpasang tidak boleh menjatuhkan
 * halaman harga. Bila konfigurasinya tidak lengkap, tombol beli otomatis
 * kembali ke cara lama, yaitu mengalihkan ke halaman Midtrans.
 */
function konfigPembayaran(): { clientKey: string; urlSnapJs: string } {
  try {
    const { clientKey, urlSnapJs } = envMidtrans();
    return { clientKey, urlSnapJs };
  } catch {
    return { clientKey: "", urlSnapJs: "" };
  }
}

export default async function HalamanLangganan() {
  const status = await statusAksesSaatIni();
  const masuk = status.masuk;
  const e = status.entitlement;

  const { clientKey, urlSnapJs } = konfigPembayaran();
  const labelTombol = masuk && e.status === "aktif" ? "Perpanjang" : "Beli";

  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Langganan</h1>
      <p className={gaya.sub}>Akses penuh ke seluruh alat klinis Tinyverse.</p>

      {masuk ? (
        <div className={gaya.kartu}>
          <div className={gaya.baris}>
            <span className={gaya.label}>Status</span>
            <span className={gaya.nilai}>
              <span className={`${gaya.lencana} ${KELAS_STATUS[e.status]}`}>
                {LABEL_STATUS[e.status]}
              </span>
            </span>
          </div>
          {e.berakhirPada ? (
            <div className={gaya.baris}>
              <span className={gaya.label}>Berlaku sampai</span>
              <span className={gaya.nilai}>{tanggal(e.berakhirPada)}</span>
            </div>
          ) : null}
          {e.status === "aktif" ? (
            <div className={gaya.baris}>
              <span className={gaya.label}>Sisa</span>
              <span className={gaya.nilai}>{e.sisaHari} hari</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={gaya.kartu}>
        <div className={gaya.kepalaKartu}>Paket</div>
        {KATALOG_PLAN.filter((p) => p.aktif).map((p) => (
          <div key={p.id} className={gaya.barisPaket}>
            <div>
              <div className={gaya.namaPaket}>{p.nama}</div>
              <div className={gaya.detailPaket}>{p.durasiHari} hari</div>
            </div>
            <div className={gaya.aksi}>
              <div className={gaya.hargaPaket}>{rupiah(p.hargaRupiah)}</div>
              {masuk ? (
                <TombolBeli
                  planId={p.id}
                  label={labelTombol}
                  clientKey={clientKey}
                  urlSnapJs={urlSnapJs}
                />
              ) : null}
            </div>
          </div>
        ))}

        {masuk ? (
          <p className={gaya.catatan}>
            Sekali bayar, tanpa perpanjangan otomatis. Pembayaran diproses oleh
            Midtrans dan akses terbuka segera setelah pembayaran dikonfirmasi.
          </p>
        ) : (
          <div className={gaya.ajakan}>
            <Link href="/" className={gaya.tautMasuk}>
              Masuk untuk membeli
            </Link>
            <p className={gaya.catatan}>
              Sekali bayar, tanpa perpanjangan otomatis. Pembayaran diproses
              oleh Midtrans.
            </p>
          </div>
        )}
      </div>

      <div className={gaya.kartu}>
        <div className={gaya.kepalaKartu}>Yang Anda dapatkan</div>
        <ul className={gaya.daftar}>
          {ISI_LANGGANAN.map((butir) => (
            <li key={butir}>{butir}</li>
          ))}
        </ul>
      </div>

      <p className={gaya.tautanLegal}>
        <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
        <span aria-hidden>{" \u00B7 "}</span>
        <Link href="/pengembalian-dana">Kebijakan Pengembalian Dana</Link>
        <span aria-hidden>{" \u00B7 "}</span>
        <Link href="/kontak">Kontak</Link>
      </p>

      <p className={gaya.penyangkalan}>
        Tinyverse adalah alat bantu klinis pediatri, bukan pengganti penilaian
        klinis. Seluruh hasil perhitungan wajib diperiksa ulang oleh tenaga
        kesehatan.
      </p>
    </div>
  );
}
