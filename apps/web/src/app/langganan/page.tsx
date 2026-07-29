/**
 * Halaman status langganan.
 *
 * Server Component dengan sengaja. Statusnya dibaca di server sebelum HTML
 * dikirim, sehingga halaman tidak pernah berkedip "belum berlangganan" lalu
 * berubah, dan status sesungguhnya tidak pernah bergantung pada apa pun yang
 * dijalankan di browser.
 *
 * Tombol beli adalah satu-satunya bagian yang berjalan di browser, dan ia
 * hanya meminta server membuatkan pesanan. Yang membuka akses tetap hanya
 * webhook Midtrans, setelah uangnya benar-benar masuk.
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

  if (!status.masuk) {
    return (
      <main className={gaya.wrap}>
        <h1 className={gaya.judul}>Langganan</h1>
        <p className={gaya.sub}>Masuk terlebih dahulu untuk melihat status langganan.</p>
      </main>
    );
  }

  const e = status.entitlement;

  /* Kata kerjanya mengikuti keadaan: pelanggan yang masih aktif sedang
     menambah masa, bukan membeli dari nol. Masa baru ditumpuk di atas sisa
     yang ada, sehingga membeli lebih awal tidak pernah merugikan. */
  const labelTombol = e.status === "aktif" ? "Perpanjang" : "Beli";

  return (
    <main className={gaya.wrap}>
      <h1 className={gaya.judul}>Langganan</h1>
      <p className={gaya.sub}>Status akses akun Anda.</p>

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
            <TombolBeli planId={p.id} label={labelTombol} />
          </div>
        ))}
        <p className={gaya.catatan}>
          Sekali bayar. Bila tidak diperpanjang, tidak ada tagihan berikutnya dan tidak
          ada penarikan otomatis. Pembayaran diproses oleh Midtrans; masa aktif terbuka
          setelah pembayaran dikonfirmasi, yang untuk transfer bank dan gerai ritel bisa
          memerlukan beberapa menit.
        </p>
      </section>
    </main>
  );
}
