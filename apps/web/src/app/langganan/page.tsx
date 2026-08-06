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
import type { StatusLangganan } from "@tinyverse/billing";
import type { StatusPesanan } from "@tinyverse/billing";
import type { Plan } from "@tinyverse/billing";

import { statusAksesSaatIni } from "@/server/entitlementServer";
import { envMidtrans } from "@/server/env";
import { KATALOG_PLAN } from "@/server/planKatalog";
import { riwayatPesanan } from "@/server/pesananRiwayat";

import { LanggananClientView } from "./LanggananClientView";
import gaya from "./langganan.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LABEL_STATUS: Record<StatusLangganan, string> = {
  belum: "Belum berlangganan",
  aktif: "Aktif",
  kedaluwarsa: "Kedaluwarsa",
};

const KELAS_RIWAYAT: Partial<Record<StatusPesanan, string>> = {
  selesai: gaya.riwayatSelesai ?? "",
  dibayar: gaya.riwayatMenunggu ?? "",
  menunggu: gaya.riwayatMenunggu ?? "",
  gagal: gaya.riwayatGagal ?? "",
};

const AMBANG_PERINGATAN_HARI = 7;

const ISI_LANGGANAN: readonly string[] = [
  "Asisten AI Co-Pilot Klinis",
  "Mode Darurat & Resusitasi Pediatri",
  "Alur Tata Laksana Interaktif",
  "Dosis Obat & Racik Puyer",
  "Terapi Cairan: Rumatan, Rehidrasi, dan Luka Bakar",
  "Tumbuh Kembang: Kurva WHO & CDC",
  "Skrining Perkembangan: KPSP, Denver II, dan M-CHAT-R",
  "Skoring Klinis (10 Skor Pediatri)",
  "Tekanan Darah: Persentil AAP 2017",
  "Interpretasi Lab & Analisis Gas Darah (AGD)",
  "Kalkulator Susu Formula",
  "Tool Neonatus: TPN & Bilirubin (AAP 2022)",
  "Guideline Tata Laksana Penyakit Anak",
  "Jadwal Imunisasi & Catch-Up",
  "Ringkasan Klinis Otomatis",
];

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
}

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

function labelLencana(status: StatusLangganan, percobaan: boolean): string {
  if (!percobaan) return LABEL_STATUS[status];
  if (status === "aktif") return "Masa percobaan";
  if (status === "kedaluwarsa") return "Masa percobaan berakhir";
  return LABEL_STATUS[status];
}

type Peringatan = { judul: string; teks: string; kedaluwarsa: boolean };

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
  const labelTombol =
    masuk && e.status === "aktif" && !percobaan ? "Perpanjang" : "Beli";

  const formattedRiwayat = daftarPesanan.map((p) => ({
    id: p.id,
    nama: p.nama,
    tanggal: tanggal(p.createdAt),
    harga: rupiah(p.hargaRupiah),
    labelStatus: p.labelStatus,
    kelasStatus: KELAS_RIWAYAT[p.status] ?? "",
  }));

  return (
    <LanggananClientView
      masuk={masuk}
      status={e.status}
      berakhirPada={e.berakhirPada ? tanggal(e.berakhirPada) : null}
      sisaHari={e.sisaHari}
      percobaan={percobaan}
      labelLencana={labelLencana(e.status, percobaan)}
      peringatan={peringatan}
      daftarPesanan={formattedRiwayat}
      paketAktif={paketAktif}
      idPalingHemat={idPalingHemat}
      labelTombol={labelTombol}
      clientKey={clientKey}
      urlSnapJs={urlSnapJs}
      isiLangganan={ISI_LANGGANAN}
    />
  );
}
