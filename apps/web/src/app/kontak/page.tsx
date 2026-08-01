/**
 * Halaman Kontak.
 *
 * Halaman statis tanpa data pengguna, boleh dibaca tanpa masuk.
 *
 * WHY halaman ini ada: Midtrans mensyaratkan adanya informasi kontak bisnis
 * yang dapat dihubungi dan terlihat tanpa membuat akun. Alamat yang
 * ditampilkan sengaja hanya sampai tingkat kota -- alamat lengkap sudah
 * diserahkan kepada Midtrans lewat formulir pendaftaran, dan tidak ada alasan
 * memajangnya kepada umum.
 */
import Link from "next/link";

import gaya from "../legal/legal.module.css";

export const metadata = {
  title: "Kontak — Tinyverse",
  description: "Cara menghubungi pengelola Tinyverse.",
};

const SUREL = "tinyverse.app@gmail.com";
const IG_TAMPIL = "@tinyverse.app";
const IG_TAUTAN = "https://www.instagram.com/tinyverse.app";

export default function HalamanKontak() {
  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Kontak</h1>
      <p className={gaya.berlaku}>
        Kami menjawab setiap pertanyaan mengenai langganan, pembayaran, dan
        kendala teknis.
      </p>

      <div className={gaya.kartu}>
        <div className={gaya.baris}>
          <span className={gaya.label}>Pengelola</span>
          <span className={gaya.nilai}>M. Hafidzuddin Shofwan</span>
        </div>
        <div className={gaya.baris}>
          <span className={gaya.label}>Surel</span>
          <span className={gaya.nilai}>
            <a href={`mailto:${SUREL}`}>{SUREL}</a>
          </span>
        </div>
        <div className={gaya.baris}>
          <span className={gaya.label}>Instagram</span>
          <span className={gaya.nilai}>
            <a href={IG_TAUTAN} target="_blank" rel="noopener noreferrer">
              {IG_TAMPIL}
            </a>
          </span>
        </div>
        <div className={gaya.baris}>
          <span className={gaya.label}>Lokasi</span>
          <span className={gaya.nilai}>
            Tenggarong, Kutai Kartanegara, Kalimantan Timur, Indonesia
          </span>
        </div>
        <div className={gaya.baris}>
          <span className={gaya.label}>Jam layanan</span>
          <span className={gaya.nilai}>Senin–Jumat, 09.00–17.00 WITA</span>
        </div>
      </div>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Waktu tanggapan</h2>
        <p className={gaya.teks}>
          Pesan yang masuk kami balas paling lambat 1×24 jam kerja. Untuk
          kendala pembayaran, sertakan nomor pesanan Anda yang diawali{" "}
          <code>TV-</code> agar penelusuran lebih cepat.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Halaman terkait</h2>
        <ul className={gaya.daftar}>
          <li>
            <Link href="/langganan">Paket dan harga langganan</Link>
          </li>
          <li>
            <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </li>
          <li>
            <Link href="/pengembalian-dana">Kebijakan Pengembalian Dana</Link>
          </li>
        </ul>
      </section>

      <Link href="/langganan" className={gaya.kembali}>
        &larr; Kembali ke halaman langganan
      </Link>
    </div>
  );
}
