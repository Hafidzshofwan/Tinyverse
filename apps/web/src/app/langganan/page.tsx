import type { Metadata } from "next";

import { statusAksesSaatIni } from "@/server/entitlementServer";
import { riwayatPesanan } from "@/server/pesananRiwayat";
import { KATALOG_PLAN } from "@/server/planKatalog";
import { envMidtrans } from "@/server/env";
import { hitungPengingat } from "@/features/pengingat-langganan/pengingat";
import { FITUR_TERSEDIA } from "@/widgets/app-shell/nav-config";

import { LanggananClientView } from "./LanggananClientView";
import type { BarisRiwayat } from "./RiwayatPembayaran";
import gaya from "./langganan.module.css";

/* Admin SDK tidak bisa berjalan di Edge Runtime, sama seperti gerbang di
   app/preview/layout.tsx. */
export const runtime = "nodejs";
/* Halaman ini menampilkan status akun yang sedang masuk -- tidak boleh
   disajikan dari cache lintas pengguna. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Langganan",
  description:
    "Pilih paket langganan Tinyverse, pantau status akses, dan lihat riwayat pembayaran Anda.",
};

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
}

function tanggalIndo(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Memetakan status pesanan (StatusPesanan di @tinyverse/billing) ke kelas
 *  warna baris riwayat yang sudah ada di langganan.module.css. */
function kelasStatusPesanan(status: string): string {
  switch (status) {
    case "selesai":
    case "dibayar":
      return gaya.riwayatSelesai!;
    case "menunggu":
      return gaya.riwayatMenunggu!;
    default:
      // gagal, kedaluwarsa, dibatalkan
      return gaya.riwayatGagal!;
  }
}

function labelLencanaUntuk(status: "belum" | "aktif" | "kedaluwarsa", percobaan: boolean): string {
  if (status === "aktif") return percobaan ? "Trial" : "Aktif";
  if (status === "kedaluwarsa") return percobaan ? "Trial Habis" : "Kedaluwarsa";
  return "Belum Berlangganan";
}

export default async function LanggananPage() {
  const akses = await statusAksesSaatIni();
  const { masuk, accountId, entitlement, percobaan } = akses;

  const daftarPesananMentah =
    masuk && accountId ? await riwayatPesanan(accountId) : [];
  const daftarPesanan: BarisRiwayat[] = daftarPesananMentah.map((p) => ({
    id: p.id,
    nama: p.nama,
    tanggal: tanggalIndo(p.createdAt),
    harga: rupiah(p.hargaRupiah),
    labelStatus: p.labelStatus,
    kelasStatus: kelasStatusPesanan(p.status),
  }));

  const pengingat = hitungPengingat(
    {
      status: entitlement.status,
      berakhirPada: entitlement.berakhirPada,
      percobaan,
    },
    new Date().toISOString(),
  );
  const peringatan = pengingat
    ? {
        judul: pengingat.judul,
        teks: pengingat.pesan,
        kedaluwarsa: pengingat.nada === "berakhir",
      }
    : null;

  const paketAktif = KATALOG_PLAN.filter((p) => p.aktif);
  const idPalingHemat =
    paketAktif.reduce<{ id: string; perHari: number } | null>((termurah, p) => {
      const perHari = p.hargaRupiah / p.durasiHari;
      if (!termurah || perHari < termurah.perHari) return { id: p.id, perHari };
      return termurah;
    }, null)?.id ?? null;

  const { clientKey, urlSnapJs } = envMidtrans();

  return (
    <LanggananClientView
      masuk={masuk}
      status={entitlement.status}
      berakhirPada={entitlement.berakhirPada}
      sisaHari={entitlement.sisaHari}
      percobaan={percobaan}
      labelLencana={labelLencanaUntuk(entitlement.status, percobaan)}
      peringatan={peringatan}
      daftarPesanan={daftarPesanan}
      paketAktif={paketAktif}
      idPalingHemat={idPalingHemat}
      labelTombol="Beli Sekarang"
      clientKey={clientKey}
      urlSnapJs={urlSnapJs}
      isiLangganan={FITUR_TERSEDIA.map((f) => f.label)}
    />
  );
}
