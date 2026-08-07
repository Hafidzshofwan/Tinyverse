"use client";

import Link from "next/link";
import type { StatusLangganan, Plan } from "@tinyverse/billing";
import { TombolBeli } from "./TombolBeli";
import { RiwayatPembayaran, type BarisRiwayat } from "./RiwayatPembayaran";
import gaya from "./langganan-concepts.module.css";

type Peringatan = { judul: string; teks: string; kedaluwarsa: boolean };

/** Satu baris pada "Fitur Klinis yang Didapatkan". `baru` menandai fitur
 *  yang baru ditambahkan (lihat FITUR_BARU di widgets/app-shell/nav-config)
 *  sehingga ditandai lencana "Update" di daftar fitur. */
export type ItemFiturLangganan = { label: string; baru: boolean };

export type LanggananClientProps = {
  masuk: boolean;
  status: StatusLangganan;
  berakhirPada: string | null;
  sisaHari: number;
  percobaan: boolean;
  labelLencana: string;
  peringatan: Peringatan | null;
  daftarPesanan: BarisRiwayat[];
  paketAktif: readonly Plan[];
  idPalingHemat: string | null;
  labelTombol: string;
  clientKey: string;
  urlSnapJs: string;
  isiLangganan: readonly ItemFiturLangganan[];
};

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
}

/* SVG Icon Components */
function IconCrown({ size = 20, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function IconTag({ size = 20, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.3-7.3a1 1 0 0 0 0-1.41L12 2z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}

function IconSparkles({ size = 20, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  );
}

function IconCheck({ size = 16, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconReceipt({ size = 20, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8H8M16 12H8M13 16H8" />
    </svg>
  );
}

export function LanggananClientView(props: LanggananClientProps) {
  const {
    masuk,
    berakhirPada,
    sisaHari,
    percobaan,
    labelLencana,
    peringatan,
    daftarPesanan,
    paketAktif,
    idPalingHemat,
    labelTombol,
    clientKey,
    urlSnapJs,
    isiLangganan,
  } = props;

  return (
    <div className={gaya.conceptWrapper}>
      <div className={gaya.obsidianRoot}>
        {/* Header Title */}
        <div className={gaya.obsidianHeader}>
          <h1 className={gaya.obsidianTitle}>Langganan Tinyverse</h1>
          <p className={gaya.obsidianSub}>
            Akses tak terbatas ke seluruh alat bantu klinis, kalkulator medis, dan asisten AI pediatri.
          </p>
        </div>

        {/* Warning Banner if Expiring */}
        {peringatan && (
          <div className={gaya.obsidianPeringatan}>
            <span className={gaya.obsidianPeringatanJudul}>{peringatan.judul}</span>
            <span className={gaya.obsidianPeringatanTeks}>{peringatan.teks}</span>
          </div>
        )}

        {/* User Account Status */}
        {masuk && (
          <div className={gaya.obsidianCard}>
            <div className={gaya.obsidianCardTitle}>
              <IconCrown size={20} /> Status Langganan Anda
            </div>
            <div className={gaya.obsidianBaris}>
              <span className={gaya.obsidianLabel}>Status Akses</span>
              <span className={gaya.obsidianNilai}>
                <span className={gaya.obsidianLencanaAktif}>{labelLencana}</span>
              </span>
            </div>
            {berakhirPada && (
              <div className={gaya.obsidianBaris}>
                <span className={gaya.obsidianLabel}>Berlaku Sampai</span>
                <span className={gaya.obsidianNilai}>{berakhirPada}</span>
              </div>
            )}
            {sisaHari > 0 && (
              <div className={gaya.obsidianBaris}>
                <span className={gaya.obsidianLabel}>Sisa Masa Aktif</span>
                <span className={gaya.obsidianNilai}>{sisaHari} Hari</span>
              </div>
            )}
            {percobaan && (
              <p className={gaya.conceptCatatan}>
                Anda sedang mencoba Tinyverse secara gratis. Pilih paket di bawah untuk melanjutkan akses.
              </p>
            )}
          </div>
        )}

        {/* Grid Pricing Packages */}
        <div className={gaya.obsidianCard}>
          <div className={gaya.obsidianCardTitle}>
            <IconTag size={20} /> Pilih Paket Berlangganan
          </div>

          <div className={gaya.obsidianGrid}>
            {paketAktif.map((p) => {
              const perHari = Math.round(p.hargaRupiah / p.durasiHari);
              const unggulan = p.id === idPalingHemat;

              return (
                <div
                  key={p.id}
                  className={`${gaya.obsidianPaketCard} ${unggulan ? gaya.obsidianPaketFeatured : ""}`}
                >
                  {unggulan && (
                    <div className={gaya.obsidianBadgeFeatured}>
                      <IconCrown size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />
                      PALING HEMAT
                    </div>
                  )}
                  <div className={gaya.obsidianPaketNama}>{p.nama}</div>
                  <div className={gaya.obsidianPaketDurasi}>{p.durasiHari} Hari Akses</div>
                  <div className={gaya.obsidianPaketHarga}>{rupiah(p.hargaRupiah)}</div>
                  <div className={gaya.obsidianPaketPerHari}>
                    {"\u2248" + rupiah(perHari) + "/hari"}
                  </div>

                  {masuk ? (
                    <TombolBeli
                      planId={p.id}
                      label={labelTombol}
                      clientKey={clientKey}
                      urlSnapJs={urlSnapJs}
                      buttonClassName={`${gaya.obsidianBtn} ${!unggulan ? gaya.obsidianBtnSecondary : ""}`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          {masuk ? (
            <p className={gaya.conceptCatatan}>
              Sekali bayar, tanpa perpanjangan otomatis. Pembayaran aman diproses oleh Midtrans.
            </p>
          ) : (
            <div className={gaya.tautMasukBox}>
              <Link href="/" className={gaya.tautMasukBtn}>
                Masuk untuk Membeli
              </Link>
              <p className={gaya.conceptCatatan}>
                Sekali bayar, tanpa perpanjangan otomatis.
              </p>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className={gaya.obsidianCard}>
          <div className={gaya.obsidianCardTitle}>
            <IconSparkles size={20} /> Fitur Klinis yang Didapatkan
          </div>

          <div className={gaya.obsidianFeatureGrid}>
            {isiLangganan.map((item) => (
              <div key={item.label} className={gaya.obsidianFeatureItem}>
                <span className={gaya.obsidianIconCheck}>
                  <IconCheck size={16} />
                </span>
                <span>{item.label}</span>
                {item.baru && (
                  <span className={gaya.obsidianSoonBadge}>Update</span>
                )}
              </div>
            ))}
          </div>

          <div className={gaya.obsidianFeatureSoon}>
            <span className={gaya.obsidianSoonBadge}>Segera Hadir</span>
            <span>Dialisis pada Anak</span>
          </div>
        </div>

        {/* Payment History */}
        {masuk && (
          <div className={gaya.obsidianCard}>
            <div className={gaya.obsidianCardTitle}>
              <IconReceipt size={20} /> Riwayat Pembayaran
            </div>
            <RiwayatPembayaran daftar={daftarPesanan} />
          </div>
        )}
      </div>

      {/* Footer Legal Links & Disclaimer */}
      <div style={{ marginTop: 40 }}>
        <p className={gaya.conceptTautanLegal}>
          <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>
          <span aria-hidden>{" \u00B7 "}</span>
          <Link href="/pengembalian-dana">Kebijakan Pengembalian Dana</Link>
          <span aria-hidden>{" \u00B7 "}</span>
          <Link href="/kontak">Kontak</Link>
        </p>

        <p className={gaya.conceptPenyangkalan}>
          Tinyverse adalah alat bantu klinis pediatri, bukan pengganti penilaian klinis.
          Seluruh hasil perhitungan wajib diperiksa ulang oleh tenaga kesehatan.
        </p>
      </div>
    </div>
  );
}
