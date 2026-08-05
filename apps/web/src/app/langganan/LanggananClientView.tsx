"use client";

import Link from "next/link";
import type { StatusLangganan, Plan } from "@tinyverse/billing";
import { TombolBeli } from "./TombolBeli";
import { RiwayatPembayaran, type BarisRiwayat } from "./RiwayatPembayaran";
import gaya from "./langganan-concepts.module.css";

type Peringatan = { judul: string; teks: string; kedaluwarsa: boolean };

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
  isiLangganan: readonly string[];
};

function rupiah(nilai: number): string {
  return "Rp" + nilai.toLocaleString("id-ID");
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
              <span>👑</span> Status Langganan Anda
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
            <span>🏷️</span> Pilih Paket Berlangganan
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
                  {unggulan && <div className={gaya.obsidianBadgeFeatured}>👑 PALING HEMAT</div>}
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
            <span>⚡</span> Fitur & Fitur Klinis yang Didapatkan
          </div>

          <div className={gaya.obsidianFeatureGrid}>
            {isiLangganan.map((item) => (
              <div key={item} className={gaya.obsidianFeatureItem}>
                <span className={gaya.obsidianIconCheck}>✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        {masuk && (
          <div className={gaya.obsidianCard}>
            <div className={gaya.obsidianCardTitle}>
              <span>📜</span> Riwayat Pembayaran
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
