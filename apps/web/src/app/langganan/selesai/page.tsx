/**
 * Halaman kepulangan setelah pelanggan selesai di halaman Midtrans.
 *
 * PENTING: halaman ini TIDAK MENGAKTIFKAN APA PUN. Ia hanya membaca keadaan
 * yang sudah ada. Alamatnya diketahui pelanggan dan bisa dibuka kapan saja
 * dengan order_id apa pun - menjadikannya pemicu aktivasi sama saja dengan
 * membagikan akses gratis. Yang membuka akses hanya webhook.
 *
 * Karena pembayaran sebagian - misalnya transfer bank atau gerai ritel -
 * belum tentu tercatat pada detik pelanggan kembali ke sini, halaman ini
 * harus tetap masuk akal saat statusnya belum aktif.
 */
import Link from "next/link";

import { statusAksesSaatIni } from "@/server/entitlementServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HalamanSelesai() {
  const akses = await statusAksesSaatIni();
  const aktif = akses.entitlement.bolehAkses;

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px" }}>
      <h1>{aktif ? "Pembayaran diterima" : "Menunggu konfirmasi pembayaran"}</h1>

      {aktif ? (
        <>
          <p>
            Akses Anda aktif sampai{" "}
            <strong>{akses.entitlement.berakhirPada ?? "-"}</strong> (
            {akses.entitlement.sisaHari} hari lagi).
          </p>
          <p>
            <Link href="/preview">Mulai memakai alat klinis</Link>
          </p>
        </>
      ) : (
        <>
          <p>
            Kami belum menerima konfirmasi dari penyedia pembayaran. Untuk
            transfer bank dan pembayaran di gerai, konfirmasi biasanya datang
            beberapa menit setelah pembayaran diselesaikan.
          </p>
          <p>
            Halaman ini tidak perlu dibiarkan terbuka. Muat ulang beberapa saat
            lagi, atau buka kembali halaman langganan untuk memeriksa status
            terbaru.
          </p>
        </>
      )}

      <p>
        <Link href="/langganan">Kembali ke halaman langganan</Link>
      </p>
    </main>
  );
}
