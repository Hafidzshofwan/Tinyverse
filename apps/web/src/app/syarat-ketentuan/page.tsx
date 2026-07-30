/**
 * Halaman Syarat & Ketentuan.
 *
 * Halaman statis tanpa data pengguna, sehingga boleh dibaca siapa saja tanpa
 * masuk. Keterbukaannya diatur oleh RUTE_PUBLIK di AppShell.
 *
 * WHY halaman ini ada: Midtrans mensyaratkan setiap merchant memiliki syarat &
 * ketentuan yang dapat diakses publik sebelum pendaftaran disetujui. Selain
 * itu, calon pembeli berhak tahu apa yang ia beli sebelum membayar.
 *
 * ATURAN PEMELIHARAAN: setiap kali katalog paket di planKatalog.ts berubah,
 * bagian 4 di halaman ini WAJIB ikut diperiksa. Menjual paket yang tidak
 * disebut dalam syarat & ketentuan adalah ketidaksesuaian yang justru dicari
 * oleh peninjau pendaftaran merchant.
 */
import Link from "next/link";

import gaya from "../legal/legal.module.css";

export const metadata = {
  title: "Syarat & Ketentuan — Tinyverse",
  description:
    "Ketentuan penggunaan layanan Tinyverse, alat bantu klinis pediatri berlangganan.",
};

export default function HalamanSyaratKetentuan() {
  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Syarat & Ketentuan</h1>
      <p className={gaya.berlaku}>Berlaku sejak 30 Juli 2026</p>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>1. Tentang layanan</h2>
        <p className={gaya.teks}>
          Tinyverse adalah kumpulan alat bantu hitung dan rujukan klinis pediatri
          berbasis web, ditujukan bagi tenaga kesehatan dan mahasiswa kedokteran.
        </p>
        <p className={gaya.teks}>
          Tinyverse <strong>bukan alat diagnosis</strong> dan bukan pengganti
          penilaian klinis. Seluruh hasil perhitungan, kurva, dan interpretasi
          yang ditampilkan wajib diperiksa ulang oleh pengguna sebelum dipakai
          dalam keputusan perawatan pasien. Tanggung jawab atas keputusan klinis
          sepenuhnya berada pada pengguna.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>2. Akun</h2>
        <ul className={gaya.daftar}>
          <li>Satu akun ditujukan untuk satu orang pengguna.</li>
          <li>
            Anda bertanggung jawab menjaga kerahasiaan surel dan kata sandi
            akun Anda, serta atas seluruh aktivitas yang terjadi di dalamnya.
          </li>
          <li>
            Data pasien yang Anda simpan terikat pada akun Anda dan tidak dapat
            dilihat oleh pengguna lain.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>3. Masa percobaan gratis</h2>
        <ul className={gaya.daftar}>
          <li>
            Setiap akun baru memperoleh <strong>masa percobaan 2 hari</strong>
            {" "}dengan akses penuh ke seluruh alat klinis, tanpa biaya.
          </li>
          <li>
            Masa percobaan diberikan otomatis saat Anda pertama kali masuk. Anda
            <strong> tidak perlu memasukkan data pembayaran</strong>, dan tidak
            ada penarikan dana apa pun ketika masa percobaan berakhir.
          </li>
          <li>
            Masa percobaan diberikan <strong>satu kali untuk setiap akun</strong>
            {" "}dan tidak dapat diperpanjang maupun diaktifkan ulang.
          </li>
          <li>
            Setelah 2 hari, akses ke alat klinis berhenti dengan sendirinya.
            Data pasien yang telah Anda simpan tetap utuh dan dapat diakses
            kembali setelah Anda berlangganan.
          </li>
          <li>
            Bila Anda membeli paket sebelum masa percobaan habis, durasi paket
            ditambahkan di atas sisa masa percobaan, sehingga tidak ada hari
            yang hangus.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>4. Langganan dan pembayaran</h2>
        <ul className={gaya.daftar}>
          <li>
            Langganan bersifat <strong>sekali bayar</strong> untuk jangka waktu
            tertentu: 1 bulan, 3 bulan, 6 bulan, atau 1 tahun.
          </li>
          <li>
            <strong>Tidak ada perpanjangan otomatis dan tidak ada penarikan
            dana berulang.</strong> Bila masa aktif berakhir dan Anda tidak
            memperpanjang, akses ke alat klinis berhenti tanpa tagihan apa pun.
          </li>
          <li>
            Pembayaran diproses oleh Midtrans. Tinyverse tidak menyimpan nomor
            kartu maupun data instrumen pembayaran Anda.
          </li>
          <li>
            Akses terbuka otomatis setelah Midtrans mengonfirmasi pembayaran
            berhasil. Untuk metode tertentu, konfirmasi dapat memakan waktu
            beberapa menit.
          </li>
          <li>
            Memperpanjang sebelum masa aktif habis akan menambahkan durasi baru
            di atas sisa masa yang ada, sehingga tidak ada hari yang hangus.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>5. Pengembalian dana</h2>
        <p className={gaya.teks}>
          Ketentuan pengembalian dana diatur pada halaman{" "}
          <Link href="/pengembalian-dana">Kebijakan Pengembalian Dana</Link>,
          yang merupakan bagian tidak terpisahkan dari syarat ini.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>6. Larangan penggunaan</h2>
        <ul className={gaya.daftar}>
          <li>
            Membagikan akun kepada orang lain, atau memakainya secara bersamaan
            oleh lebih dari satu orang.
          </li>
          <li>
            Menyalin, menjual kembali, atau mendistribusikan ulang isi Tinyverse
            tanpa izin tertulis.
          </li>
          <li>
            Upaya membuka akses berbayar tanpa membayar, atau mengganggu
            jalannya layanan.
          </li>
          <li>
            Membuat akun berulang kali dengan tujuan memperoleh masa percobaan
            gratis lebih dari sekali.
          </li>
        </ul>
        <p className={gaya.teks}>
          Pelanggaran dapat berakibat penonaktifan akun tanpa pengembalian dana.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>7. Ketersediaan dan perubahan</h2>
        <p className={gaya.teks}>
          Layanan diberikan sebagaimana adanya. Kami berupaya menjaga
          ketersediaan, namun tidak menjanjikan layanan bebas gangguan.
          Pemeliharaan terencana akan diumumkan bila memungkinkan.
        </p>
        <p className={gaya.teks}>
          Harga dan isi paket dapat berubah sewaktu-waktu. Perubahan harga
          <strong> tidak berlaku surut</strong> terhadap langganan yang sudah
          dibayar; masa aktif yang sedang berjalan tetap dihormati sampai habis.
        </p>
        <p className={gaya.teks}>
          Ketentuan masa percobaan, termasuk durasinya, dapat kami ubah atau
          hentikan untuk akun baru di kemudian hari. Masa percobaan yang sedang
          berjalan tetap dihormati sampai habis.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>8. Batasan tanggung jawab</h2>
        <p className={gaya.teks}>
          Sejauh diizinkan hukum yang berlaku, tanggung jawab Tinyverse atas
          kerugian apa pun yang timbul dari penggunaan layanan dibatasi paling
          banyak sebesar biaya langganan yang telah Anda bayarkan untuk periode
          berjalan.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>9. Hukum yang berlaku</h2>
        <p className={gaya.teks}>
          Syarat ini tunduk pada hukum Republik Indonesia. Perselisihan
          diupayakan diselesaikan secara musyawarah terlebih dahulu.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>10. Kontak</h2>
        <p className={gaya.teks}>
          Pertanyaan mengenai ketentuan ini dapat disampaikan melalui halaman{" "}
          <Link href="/kontak">Kontak</Link>.
        </p>
      </section>

      <Link href="/langganan" className={gaya.kembali}>
        ← Kembali ke halaman langganan
      </Link>
    </div>
  );
}
