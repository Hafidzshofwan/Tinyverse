/**
 * Halaman status langganan sekaligus halaman harga.
 *
 * Server Component dengan sengaja. Statusnya dibaca di server sebelum HTML
 * dikirim, sehingga halaman tidak pernah berkedip "belum berlangganan" lalu
 * berubah, dan status sesungguhnya tidak pernah bergantung pada apa pun yang
 * dijalankan di browser.
 *
 * Daftar paket dan harganya ditampilkan kepada SIAPA PUN, termasuk pengunjung
 * yang belum masuk. Ada dua alasan, dan keduanya penting:
 *
 *   1. Calon pembeli tidak akan membuat akun demi mengetahui harga. Harga yang
 *      disembunyikan di balik pintu masuk adalah harga yang tidak pernah
 *      dibaca.
 *   2. Penyedia pembayaran mensyaratkan situs yang dapat diakses dengan
 *      informasi produk dan harga rupiah yang terlihat. Situs yang seluruhnya
 *      terkunci tampak seperti situs kosong bagi peninjau mereka.
 *
 * Yang tetap dijaga adalah pembeliannya, bukan informasinya. Tombol beli hanya
 * muncul bagi yang sudah masuk, dan akses ke alat klinis tetap diputuskan di
 * server oleh gerbang berbayar.
 */
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

  /* Kata kerjanya mengikuti keadaan: pelanggan yang masih aktif sedang
     menambah masa, bukan membeli dari nol. Masa baru ditumpuk di atas sisa
     yang ada, sehingga membeli lebih awal tidak pernah merugikan. */
  const labelTombol = masuk && e.status === "aktif" ? "Perpanjang" : "Beli";

  return (
    <main className={gaya.wrap}>
      <h1 className={gaya.judul}>Langganan</h1>
      <p className={gaya.sub}>
        {masuk
          ? "Status akses akun Anda."
          : "Akses penuh ke seluruh alat klinis Tinyverse."}
      </p>

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
        <div className={gaya.baris}>
          <strong>Paket</strong>
        </div>
        {KATALOG_PLAN.filter((p) => p.aktif).map((p) => (
          <div className={gaya.barisPaket} key={p.id}>
            <div>
              <div className={gaya.namaPaket}>{p.nama}</div>
              <div className={gaya.detailPaket}>
                {p.durasiHari} hari · {rupiah(p.hargaRupiah)}
              </div>
            </div>
            {masuk ? <TombolBeli planId={p.id} label={labelTombol} /> : null}
          </div>
        ))}

        {masuk ? null : (
          <p className={gaya.ajakan}>
            Masuk ke akun Anda untuk membeli paket.
          </p>
        )}

        <p className={gaya.catatan}>
          Sekali bayar. Bila tidak diperpanjang, tidak ada tagihan berikutnya dan tidak
          ada penarikan otomatis. Pembayaran diproses oleh Midtrans; masa aktif terbuka
          setelah pembayaran dikonfirmasi, yang untuk transfer bank dan gerai ritel bisa
          memerlukan beberapa menit.
        </p>
      </section>

      <section className={gaya.kartu}>
        <div className={gaya.baris}>
          <strong>Yang Anda dapatkan</strong>
        </div>
        <p className={gaya.catatan}>
          Kalkulator dosis obat, terapi cairan, racik puyer, kurva pertumbuhan WHO dan
          CDC dengan pemantauan longitudinal, skrining perkembangan, skoring klinis,
          interpretasi laboratorium, kalkulator nutrisi, jadwal imunisasi, alur tata
          laksana, mode darurat, dan asisten AI. Seluruhnya dalam bahasa Indonesia.
        </p>
        <p className={gaya.catatan}>
          Tinyverse adalah alat bantu hitung untuk tenaga kesehatan. Hasilnya tidak
          menggantikan penilaian klinis, dan setiap keputusan tetap berada pada dokter
          yang merawat.
        </p>
      </section>
    </main>
  );
}
