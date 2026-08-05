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

import type { StatusPesanan } from "@tinyverse/billing";

import type { Plan } from "@tinyverse/billing";

import { statusAksesSaatIni } from "@/server/entitlementServer";
import { envMidtrans } from "@/server/env";
import { KATALOG_PLAN } from "@/server/planKatalog";
import { riwayatPesanan } from "@/server/pesananRiwayat";

import { RiwayatPembayaran } from "./RiwayatPembayaran";
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

/** Hanya status yang butuh aksen warna berbeda dari netral bawaan. */
const KELAS_RIWAYAT: Partial<Record<StatusPesanan, string>> = {
  selesai: gaya.riwayatSelesai ?? "",
  dibayar: gaya.riwayatMenunggu ?? "",
  menunggu: gaya.riwayatMenunggu ?? "",
  gagal: gaya.riwayatGagal ?? "",
};

/** Sisa hari pada dan di bawah nilai ini memicu spanduk pengingat. */
const AMBANG_PERINGATAN_HARI = 7;

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

/**
 * Id paket dengan harga per hari termurah, untuk disorot sebagai "Paling
 * hemat". Dihitung, bukan ditulis tangan: katalog boleh berubah kapan saja,
 * dan sorotannya harus selalu mengikuti angka yang sesungguhnya berlaku.
 */
function planPalingHemat(daftar: readonly Plan[]): string | null {
  let idTerbaik: string | null = null;
  let rasioTerbaik = Infinity;
  for (const p of daftar) {
    const rasio = p.hargaRupiah / p.durasiHari;
    if (rasio < rasioTerbaik) {
      rasioTerbaik = rasio;
      idTerbaik = p.id;
    }
  }
  return idTerbaik;
}

function tanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Kalimat pada lencana status.
 *
 * Masa percobaan memakai kalimatnya sendiri: menuliskan "Aktif" kepada orang
 * yang belum pernah membayar membuat ia menyangka sudah berlangganan, dan
 * kekagetan itu datang tepat pada hari ketiga saat aksesnya tertutup. Warna
 * lencananya sengaja TIDAK diubah, supaya bahasa warna yang sudah dikenal
 * pengguna (hijau berjalan, merah berhenti) tetap berlaku.
 */
function labelLencana(status: StatusLangganan, percobaan: boolean): string {
  if (!percobaan) return LABEL_STATUS[status];
  if (status === "aktif") return "Masa percobaan";
  if (status === "kedaluwarsa") return "Masa percobaan berakhir";
  return LABEL_STATUS[status];
}

type Peringatan = { judul: string; teks: string; kedaluwarsa: boolean };

/**
 * Spanduk pengingat masa aktif.
 *
 * WHY ditaruh di halaman langganan, bukan di kerangka aplikasi: ini satu-
 * satunya tempat yang pasti dilalui pelanggan untuk memperpanjang, dan tidak
 * menuntut komponen bersama baru. Mengembalikan null memakai status "belum"
 * dengan sengaja -- orang yang belum pernah berlangganan tidak diingatkan
 * untuk "memperpanjang" sesuatu yang tidak pernah ia miliki.
 */
function peringatanMasaAktif(
  status: StatusLangganan,
  percobaan: boolean,
  sisaHari: number,
  berakhirPada: string | null,
): Peringatan | null {
  if (status === "kedaluwarsa") {
    return {
      judul: percobaan
        ? "Masa percobaan sudah berakhir"
        : "Masa aktif sudah berakhir",
      teks: "Pilih paket di bawah untuk membuka kembali akses ke seluruh alat klinis.",
      kedaluwarsa: true,
    };
  }

  if (status === "aktif" && sisaHari <= AMBANG_PERINGATAN_HARI) {
    return {
      judul: percobaan
        ? `Masa percobaan berakhir dalam ${sisaHari} hari`
        : `Masa aktif berakhir dalam ${sisaHari} hari`,
      teks: berakhirPada
        ? `Berlaku sampai ${tanggal(berakhirPada)}. Perpanjang sekarang agar akses tidak terputus.`
        : "Perpanjang sekarang agar akses tidak terputus.",
      kedaluwarsa: false,
    };
  }

  return null;
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
  const daftarPesanan = status.accountId
    ? await riwayatPesanan(status.accountId)
    : [];
  const e = status.entitlement;
  const percobaan = status.percobaan;
  const peringatan = masuk
    ? peringatanMasaAktif(e.status, percobaan, e.sisaHari, e.berakhirPada)
    : null;

  const paketAktif = KATALOG_PLAN.filter((pl) => pl.aktif);
  const idPalingHemat = planPalingHemat(paketAktif);

  const { clientKey, urlSnapJs } = konfigPembayaran();
  /* "Perpanjang" hanya benar bagi orang yang pernah membayar. Pengguna masa
     percobaan tetap membaca "Beli", karena itulah yang sesungguhnya ia lakukan. */
  const labelTombol =
    masuk && e.status === "aktif" && !percobaan ? "Perpanjang" : "Beli";

  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Langganan</h1>
      <p className={gaya.sub}>Akses penuh ke seluruh alat klinis Tinyverse.</p>

      {peringatan ? (
        <div
          className={`${gaya.peringatan} ${peringatan.kedaluwarsa ? gaya.peringatanKedaluwarsa : ""}`}
        >
          <span className={gaya.peringatanJudul}>{peringatan.judul}</span>
          <span className={gaya.peringatanTeks}>{peringatan.teks}</span>
        </div>
      ) : null}

      {masuk ? (
        <div className={gaya.kartu}>
          <div className={gaya.baris}>
            <span className={gaya.label}>Status</span>
            <span className={gaya.nilai}>
              <span className={`${gaya.lencana} ${KELAS_STATUS[e.status]}`}>
                {labelLencana(e.status, percobaan)}
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
          {percobaan && e.status === "aktif" ? (
            <p className={gaya.catatan}>
              Anda sedang mencoba Tinyverse secara gratis. Pilih paket di bawah
              untuk melanjutkan setelah masa percobaan berakhir.
            </p>
          ) : null}
        </div>
      ) : null}

      {masuk ? (
        <div className={gaya.kartu}>
          <div className={gaya.kepalaKartu}>Riwayat pembayaran</div>
          <RiwayatPembayaran
            daftar={daftarPesanan.map((p) => ({
              id: p.id,
              nama: p.nama,
              tanggal: tanggal(p.createdAt),
              harga: rupiah(p.hargaRupiah),
              labelStatus: p.labelStatus,
              kelasStatus: KELAS_RIWAYAT[p.status] ?? "",
            }))}
          />
        </div>
      ) : null}

      <div className={gaya.kartu}>
        <div className={gaya.kepalaKartu}>Paket</div>
        <div className={gaya.gridPaket}>
          {paketAktif.map((p) => {
            const perHari = Math.round(p.hargaRupiah / p.durasiHari);
            const unggulan = p.id === idPalingHemat;
            return (
              <div
                key={p.id}
                className={`${gaya.kartuPaket} ${unggulan ? gaya.kartuPaketUnggulan : ""}`}
              >
                {unggulan ? (
                  <span className={gaya.lencanaUnggulan}>Paling hemat</span>
                ) : null}
                <div className={gaya.namaPaketGrid}>{p.nama}</div>
                <div className={gaya.durasiPaketGrid}>{p.durasiHari} hari</div>
                <div className={gaya.hargaPaketGrid}>{rupiah(p.hargaRupiah)}</div>
                <div className={gaya.perHariPaketGrid}>
                  {"\u2248" + rupiah(perHari) + "/hari"}
                </div>
                {masuk ? (
                  <TombolBeli
                    planId={p.id}
                    label={labelTombol}
                    clientKey={clientKey}
                    urlSnapJs={urlSnapJs}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

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
        <div className={gaya.kepalaKartu}>Yang Anda dapatkan di semua paket</div>
        <ul className={gaya.daftar}>
          {ISI_LANGGANAN.map((butir) => (
            <li key={butir}>{butir}</li>
          ))}
        </ul>
      </div>

      <p className={gaya.tautanLegal}>
        <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>
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
