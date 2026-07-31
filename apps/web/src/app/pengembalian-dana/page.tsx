/**
 * Halaman Kebijakan Pengembalian Dana.
 *
 * Halaman statis tanpa data pengguna, boleh dibaca tanpa masuk.
 *
 * WHY kebijakannya sempit: Tinyverse adalah produk digital yang aksesnya
 * terbuka seketika setelah pembayaran dikonfirmasi. Karena tidak ada barang
 * yang bisa dikembalikan, pengembalian dana dibatasi pada keadaan yang memang
 * merupakan kesalahan kami. Yang dituntut Midtrans bukan kebijakan yang
 * longgar, melainkan kebijakan yang JELAS dan dapat dibaca sebelum membayar.
 *
 * Masa percobaan 7 hari memperkuat dasar kebijakan ini: pembeli sudah dapat
 * menilai seluruh alat klinis tanpa mengeluarkan uang sepeser pun, sehingga
 * "berubah pikiran setelah membayar" bukan lagi keadaan yang tak terhindarkan.
 */
import Link from "next/link";

import gaya from "../legal/legal.module.css";

export const metadata = {
  title: "Kebijakan Pengembalian Dana — Tinyverse",
  description:
    "Ketentuan pengembalian dana langganan Tinyverse dan cara mengajukannya.",
};

export default function HalamanPengembalianDana() {
  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Kebijakan Pengembalian Dana</h1>
      <p className={gaya.berlaku}>Berlaku sejak 30 Juli 2026</p>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Sifat produk</h2>
        <p className={gaya.teks}>
          Tinyverse adalah produk digital berlangganan. Akses ke seluruh alat
          klinis terbuka seketika setelah pembayaran dikonfirmasi, sehingga
          layanan dianggap telah diterima sejak saat itu.
        </p>
        <p className={gaya.teks}>
          Langganan bersifat sekali bayar. Tidak ada perpanjangan otomatis dan
          tidak ada penarikan dana berulang, sehingga tidak akan pernah ada
          tagihan yang muncul tanpa Anda kehendaki.
        </p>
        <p className={gaya.teks}>
          Setiap akun baru memperoleh <strong>masa percobaan 7 hari</strong>
          {" "}dengan akses penuh dan tanpa biaya. Anda dianjurkan menilai
          seluruh alat klinis pada masa itu sebelum memutuskan membeli. Masa
          percobaan tidak melibatkan pembayaran, sehingga tidak ada dana yang
          perlu dikembalikan ketika masa percobaan berakhir.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Kapan dana dikembalikan</h2>
        <p className={gaya.teks}>
          Pengembalian dana diberikan bila kegagalan berasal dari pihak kami,
          yaitu dalam keadaan berikut:
        </p>
        <ul className={gaya.daftar}>
          <li>
            <strong>Pembayaran berhasil tetapi akses tidak aktif</strong>, dan
            kami tidak berhasil memperbaikinya dalam 3 hari kerja sejak Anda
            melapor.
          </li>
          <li>
            <strong>Tagihan ganda</strong> untuk satu masa langganan yang sama.
            Kelebihan pembayaran dikembalikan penuh.
          </li>
          <li>
            <strong>Layanan berhenti total</strong> di tengah masa aktif dan
            tidak dapat kami pulihkan. Pengembalian dihitung sebanding dengan
            sisa hari yang belum terpakai.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Kapan dana tidak dikembalikan</h2>
        <ul className={gaya.daftar}>
          <li>
            Berubah pikiran setelah pembayaran berhasil, sementara masa
            percobaan gratis sudah tersedia untuk menilai layanan lebih dahulu.
          </li>
          <li>Salah memilih paket, sementara akses sudah terbuka.</li>
          <li>Tidak sempat memakai layanan selama masa aktif berjalan.</li>
          <li>
            Berakhirnya masa percobaan gratis, karena tidak ada pembayaran yang
            terjadi pada masa tersebut.
          </li>
          <li>
            Akun dinonaktifkan karena pelanggaran{" "}
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>.
          </li>
          <li>
            Kendala dari sisi perangkat atau jaringan Anda sendiri, selama
            layanan kami berjalan normal.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Cara mengajukan</h2>
        <p className={gaya.teks}>
          Ajukan paling lambat <strong>7 hari kalender</strong> sejak tanggal
          pembayaran, melalui surel atau WhatsApp yang tercantum di halaman{" "}
          <Link href="/kontak">Kontak</Link>. Sertakan:
        </p>
        <ul className={gaya.daftar}>
          <li>Nomor pesanan (diawali <code>TV-</code>), tercantum pada bukti pembayaran.</li>
          <li>Surel yang Anda pakai mendaftar.</li>
          <li>Penjelasan singkat mengenai kendala yang dialami.</li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Proses dan jangka waktu</h2>
        <ul className={gaya.daftar}>
          <li>Permohonan kami tanggapi paling lambat 3 hari kerja.</li>
          <li>
            Bila disetujui, dana dikembalikan ke metode pembayaran asal melalui
            Midtrans.
          </li>
          <li>
            Dana lazimnya diterima dalam 7–14 hari kerja, bergantung pada bank
            atau penyedia pembayaran Anda.
          </li>
          <li>
            Setelah pengembalian dana diproses, masa aktif langganan yang
            bersangkutan dihentikan.
          </li>
        </ul>
      </section>

      <Link href="/langganan" className={gaya.kembali}>
        ← Kembali ke halaman langganan
      </Link>
    </div>
  );
}
