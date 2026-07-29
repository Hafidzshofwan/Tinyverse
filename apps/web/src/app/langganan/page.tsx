/**
 * Halaman langganan.
 *
 * Server Component dengan sengaja. Statusnya dibaca di server sebelum HTML
 * dikirim, sehingga halaman tidak pernah berkedip "belum berlangganan" lalu
 * berubah, dan status sesungguhnya tidak pernah bergantung pada apa pun yang
 * dijalankan di browser.
 *
 * WHY daftar harga tampil juga bagi yang belum masuk: calon pelanggan berhak
 * tahu harganya sebelum membuat akun, dan peninjau pendaftaran merchant
 * Midtrans mensyaratkan harga rupiah terlihat dari luar. Yang disembunyikan
 * dari pengunjung hanyalah kartu status miliknya sendiri dan tombol beli --
 * checkout menuntut sesi, jadi tombolnya tidak akan berguna tanpa masuk.
 *
 * Halaman ini tidak membuka akses apa pun. Alat klinis di /preview dijaga
 * Server Component terpisah yang memutuskan sebelum HTML dikirim.
 */
import Link from "next/link";

import type { StatusLangganan } from "@tinyverse/billing";
import { statusAksesSaatIni } from "@/server/entitlementServer";
import { KATALOG_PLAN } from "@/server/planKatalog";
import { TombolBeli } from "./TombolBeli";
import gaya from "./langganan.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Kedua peta di bawah diberi tipe Record<StatusLangganan, ...> secara eksplisit.
 * Manfaatnya bukan sekadar menyenangkan TypeScript: bila kelak ada nilai status
 * baru ditambahkan di @tinyverse/billing, kompilasi akan langsung menunjuk ke
 * baris ini. Tanpa itu, status baru akan tampil sebagai teks kosong di layar
 * dan tidak ada yang menyadarinya.
 */
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
  "Dosis obat, terapi cairan, dan racik puyer",
  "Kurva pertumbuhan WHO dan CDC dengan pemantauan longitudinal",
  "Skrining perkembangan dan skoring klinis",
  "Interpretasi lab dan kalkulator nutrisi",
  "Guideline, jadwal imunisasi, dan alur tata laksana",
  "Mode darurat dan asisten AI",
];

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

export default async function HalamanLangganan() {
  const status = await statusAksesSaatIni();
  const masuk = status.masuk;
  const e = status.entitlement;

  /* Pelanggan yang masih aktif tetap boleh membeli: masa berlakunya menumpuk
     di belakang periode berjalan, bukan menggantikannya. */
  const labelTombol = masuk && e.status === "aktif" ? "Perpanjang" : "Beli";

  return (
    <main className={gaya.wrap}>
      <h1 className={gaya.judul}>Langganan</h1>
      <p className={gaya.sub}>Akses penuh ke seluruh alat klinis Tinyverse.</p>

      {masuk ? (
        <section className={gaya.kartu}>
          <div className={gaya.baris}>
            <span className={gaya.label}>Status</span>
            <span className={`${gaya.lencana} ${KELAS_STATUS[e.status]}`}>
              {LABEL_STATUS[e.status]}
            </span>
          </div>
          <div className={gaya.baris}>
            <span className={gaya.label}>Berlaku sampai</span>
            <span className={gaya.nilai}>{tanggal(e.berakhirPada)}</span>
          </div>
          {e.status === "aktif" ? (
            <div className={gaya.baris}>
              <span className={gaya.label}>Sisa waktu</span>
              <span className={gaya.nilai}>{e.sisaHari} hari</span>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className={gaya.kartu}>
        <h2 className={gaya.kepalaKartu}>Paket</h2>

        {KATALOG_PLAN.filter((p) => p.aktif).map((p) => (
          <div className={gaya.barisPaket} key={p.id}>
            <div>
              <div className={gaya.namaPaket}>{p.nama}</div>
              <div className={gaya.detailPaket}>{p.durasiHari} hari</div>
            </div>
            <div className={gaya.aksi}>
              <div className={gaya.hargaPaket}>{rupiah(p.hargaRupiah)}</div>
              {masuk ? <TombolBeli planId={p.id} label={labelTombol} /> : null}
            </div>
          </div>
        ))}

        {masuk ? null : (
          <div className={gaya.ajakan}>
            {/* Halaman masuk Tinyverse berada di akar situs. */}
            <Link href="/" className={gaya.tautMasuk}>
              Masuk untuk membeli
            </Link>
          </div>
        )}

        <p className={gaya.catatan}>
          Sekali bayar. Bila tidak diperpanjang, tidak ada tagihan berikutnya dan
          tidak ada penarikan otomatis. Pembayaran diproses oleh Midtrans; untuk
          transfer bank dan pembayaran di gerai, konfirmasi bisa datang beberapa
          menit setelah pembayaran diselesaikan.
        </p>
      </section>

      <section className={gaya.kartu}>
        <h2 className={gaya.kepalaKartu}>Yang Anda dapatkan</h2>
        <ul className={gaya.daftar}>
          {ISI_LANGGANAN.map((butir) => (
            <li key={butir}>{butir}</li>
          ))}
        </ul>
        <p className={gaya.penyangkalan}>
          Tinyverse adalah alat bantu hitung untuk tenaga kesehatan. Hasilnya
          tidak menggantikan penilaian klinis, dan setiap keputusan tetap berada
          pada dokter yang merawat.
        </p>
      </section>
    </main>
  );
}
