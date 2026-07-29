/**
 * Halaman Kebijakan Privasi.
 *
 * Halaman statis tanpa data pengguna, sehingga boleh dibaca siapa saja tanpa
 * masuk. Keterbukaannya diatur oleh RUTE_PUBLIK di AppShell.
 *
 * WHY halaman ini ada: Tinyverse menyimpan nama, tanggal lahir, berat, tinggi,
 * dan riwayat pertumbuhan anak. UU PDP No. 27/2022 menggolongkan data kesehatan
 * anak sebagai data pribadi spesifik, yang menuntut keterbukaan paling tinggi
 * tentang apa yang dikumpulkan, di mana disimpan, dan bagaimana dihapus.
 * Peninjau pendaftaran merchant juga mencari dokumen ini.
 *
 * ATURAN saat menyunting: setiap kalimat di halaman ini harus dapat dibuktikan
 * dari kode. Jangan menambahkan janji yang belum benar-benar dijalankan.
 */
import Link from "next/link";

import gaya from "../legal/legal.module.css";

export const metadata = {
  title: "Kebijakan Privasi — Tinyverse",
  description:
    "Bagaimana Tinyverse mengumpulkan, menyimpan, dan menghapus data akun serta data pasien yang Anda catat.",
};

export default function HalamanKebijakanPrivasi() {
  return (
    <div className={gaya.wrap}>
      <h1 className={gaya.judul}>Kebijakan Privasi</h1>
      <p className={gaya.berlaku}>Berlaku sejak 29 Juli 2026</p>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>Ringkasan</h2>
        <p className={gaya.teks}>
          Tinyverse menyimpan dua jenis data: data <strong>akun Anda</strong>{" "}
          sebagai tenaga kesehatan, dan data <strong>pasien</strong> yang Anda
          catat sendiri ke dalam aplikasi. Data pasien terikat pada akun Anda dan
          tidak dapat dibaca oleh pengguna lain.
        </p>
        <p className={gaya.teks}>
          Kami <strong>tidak menjual</strong> data Anda, tidak memakainya untuk
          periklanan, dan tidak membagikannya kepada pihak lain kecuali kepada
          penyedia layanan yang disebutkan di halaman ini atau bila diwajibkan
          hukum.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>1. Pengelola data</h2>
        <p className={gaya.teks}>
          Tinyverse dikelola secara perorangan oleh M. Hafidzuddin Shofwan,
          berkedudukan di Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan
          Timur, Indonesia. Pertanyaan mengenai kebijakan ini dapat disampaikan
          melalui halaman <Link href="/kontak">Kontak</Link>.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>2. Data yang kami kumpulkan</h2>
        <p className={gaya.teks}>
          <strong>Data akun.</strong> Alamat surel, nama tampilan, dan foto
          profil yang Anda berikan saat membuat akun, beserta waktu masuk
          terakhir. Kami tidak pernah menyimpan kata sandi Anda dalam bentuk yang
          dapat dibaca.
        </p>
        <p className={gaya.teks}>
          <strong>Data pasien yang Anda catat.</strong> Nama atau inisial, jenis
          kelamin, tanggal lahir, berat badan, tinggi atau panjang badan, lingkar
          kepala, dan catatan pengukuran berkala yang Anda masukkan sendiri untuk
          keperluan perhitungan dan pemantauan kurva pertumbuhan.
        </p>
        <p className={gaya.teks}>
          <strong>Data langganan.</strong> Nomor pesanan, paket yang dipilih,
          nominal, status pembayaran, serta tanggal mulai dan berakhirnya masa
          aktif. Kami <strong>tidak pernah menerima maupun menyimpan</strong>{" "}
          nomor kartu, nomor rekening, PIN, atau data instrumen pembayaran Anda.
        </p>
        <p className={gaya.teks}>
          <strong>Data teknis.</strong> Catatan teknis yang lazim pada layanan
          web, seperti alamat IP dan waktu permintaan, yang tercatat pada penyedia
          peladen kami dan dipakai untuk menjaga keamanan serta menelusuri
          gangguan.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>3. Tujuan pemrosesan</h2>
        <ul className={gaya.daftar}>
          <li>Menyediakan alat hitung dan kurva pertumbuhan yang Anda gunakan.</li>
          <li>Mengenali Anda saat masuk dan menjaga sesi tetap aman.</li>
          <li>Menentukan apakah masa langganan Anda masih aktif.</li>
          <li>Memproses pembayaran dan menyimpan bukti pesanan.</li>
          <li>Menjaga keamanan layanan dan menelusuri gangguan teknis.</li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>4. Tempat penyimpanan</h2>
        <p className={gaya.teks}>
          Data akun, data pasien, dan data langganan disimpan pada layanan basis
          data Google Cloud Firestore. Peladen aplikasi berjalan pada penyedia
          hosting Vercel. Keduanya dapat menempatkan data pada pusat data{" "}
          <strong>di luar wilayah Indonesia</strong>. Dengan menggunakan
          Tinyverse, Anda memahami adanya pengiriman data lintas negara ini.
        </p>
        <p className={gaya.teks}>
          Sebagian data pasien juga disimpan di dalam{" "}
          <strong>peramban di perangkat Anda sendiri</strong>, agar alat klinis
          tetap dapat dipakai saat jaringan terputus. Data ini ikut terhapus bila
          Anda menghapus data peramban. Karena itu, jangan memakai Tinyverse pada
          perangkat bersama atau komputer umum.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>5. Pihak ketiga yang kami gunakan</h2>
        <ul className={gaya.daftar}>
          <li>
            <strong>Google Firebase</strong> — pengelolaan akun, autentikasi, dan
            basis data.
          </li>
          <li>
            <strong>Vercel</strong> — hosting aplikasi dan pencatatan teknis
            peladen.
          </li>
          <li>
            <strong>Midtrans</strong> — pemrosesan pembayaran. Midtrans menerima
            data yang diperlukan untuk transaksi dan tunduk pada kebijakan
            privasinya sendiri.
          </li>
        </ul>
        <p className={gaya.teks}>
          Kami tidak memasang layanan periklanan maupun penjualan data kepada
          pihak mana pun.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>6. Tanggung jawab Anda atas data pasien</h2>
        <p className={gaya.teks}>
          Data pasien dimasukkan atas kehendak dan tanggung jawab Anda sebagai
          tenaga kesehatan. Anda yang menentukan data apa yang dicatat dan
          memastikan Anda berhak memprosesnya menurut ketentuan profesi serta
          peraturan yang berlaku.
        </p>
        <p className={gaya.teks}>
          Kami menyarankan Anda mencatat <strong>inisial</strong> alih-alih nama
          lengkap bila identitas penuh tidak diperlukan untuk perhitungan.
          Tinyverse berfungsi penuh tanpa nama lengkap pasien.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>7. Lama penyimpanan</h2>
        <ul className={gaya.daftar}>
          <li>
            Data akun dan data pasien disimpan selama akun Anda masih ada.
          </li>
          <li>
            Data pesanan dan pembayaran disimpan lebih lama sebagai bukti
            transaksi, meskipun masa langganan telah berakhir.
          </li>
          <li>
            Saat sebuah data pasien dihapus, isinya dihapus namun sebuah{" "}
            <strong>penanda penghapusan</strong> tetap disimpan, agar perangkat
            Anda yang lain tidak memunculkan kembali data yang sudah dihapus.
          </li>
        </ul>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>8. Hak Anda</h2>
        <p className={gaya.teks}>
          Sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data
          Pribadi, Anda berhak meminta akses atas data Anda, meminta perbaikan
          data yang tidak akurat, meminta penghapusan data, menarik persetujuan,
          dan mengajukan keberatan atas pemrosesan.
        </p>
        <p className={gaya.teks}>
          Permintaan disampaikan melalui halaman{" "}
          <Link href="/kontak">Kontak</Link>. Kami akan menanggapi dalam waktu
          yang wajar setelah memastikan permintaan benar berasal dari pemilik
          akun.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>9. Keamanan</h2>
        <p className={gaya.teks}>
          Sambungan ke Tinyverse dienkripsi. Akses ke data dibatasi aturan
          keamanan basis data yang memisahkan data setiap akun, sehingga satu
          akun tidak dapat membaca data akun lain. Sesi Anda disimpan dalam
          cookie yang tidak dapat dibaca oleh skrip di peramban.
        </p>
        <p className={gaya.teks}>
          Tidak ada sistem yang sepenuhnya bebas risiko. Bila terjadi kebocoran
          data pribadi, kami akan memberitahukannya kepada Anda dan kepada pihak
          berwenang sesuai ketentuan yang berlaku.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>10. Cookie</h2>
        <p className={gaya.teks}>
          Tinyverse hanya memakai cookie yang diperlukan agar layanan berfungsi,
          yaitu untuk menjaga sesi Anda tetap masuk. Kami tidak memakai cookie
          periklanan maupun pelacak lintas situs.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>11. Perubahan kebijakan</h2>
        <p className={gaya.teks}>
          Kebijakan ini dapat diperbarui bila layanan berubah. Tanggal berlaku di
          bagian atas halaman selalu menunjukkan versi terkini. Perubahan yang
          bersifat mendasar akan kami sampaikan di dalam aplikasi.
        </p>
      </section>

      <section className={gaya.bagian}>
        <h2 className={gaya.kepala}>12. Kontak</h2>
        <p className={gaya.teks}>
          Pertanyaan, permintaan hak, atau keberatan dapat disampaikan melalui
          halaman <Link href="/kontak">Kontak</Link>. Ketentuan penggunaan layanan
          diatur terpisah pada halaman{" "}
          <Link href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>.
        </p>
      </section>

      <Link href="/langganan" className={gaya.kembali}>
        &larr; Kembali ke halaman langganan
      </Link>
    </div>
  );
}
