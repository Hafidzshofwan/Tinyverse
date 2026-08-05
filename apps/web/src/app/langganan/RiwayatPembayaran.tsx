/**
 * Daftar riwayat pembayaran, dengan batas tampilan awal.
 *
 * WHY Client Component terpisah, bukan langsung di page.tsx: menyembunyikan
 * baris lama di balik tombol "Lihat semua" butuh state (terbuka/tertutup),
 * dan Server Component tidak bisa punya state. Pemformatan tanggal/harga
 * tetap dilakukan di server (page.tsx) sebelum dikirim ke sini, supaya
 * berkas ini hanya berisi kode tampilan -- bukan duplikat logika format.
 */
"use client";

import { useState } from "react";

import gaya from "./langganan.module.css";

export type BarisRiwayat = {
  id: string;
  nama: string;
  tanggal: string;
  harga: string;
  labelStatus: string;
  kelasStatus: string;
};

/** Baris yang langsung tampil tanpa perlu memencet "Lihat semua". */
const JUMLAH_AWAL = 5;

export function RiwayatPembayaran({ daftar }: { daftar: BarisRiwayat[] }) {
  const [terbuka, setTerbuka] = useState(false);

  if (daftar.length === 0) {
    return <p className={gaya.riwayatKosong}>Belum ada pesanan.</p>;
  }

  const tampil = terbuka ? daftar : daftar.slice(0, JUMLAH_AWAL);
  const sisa = daftar.length - JUMLAH_AWAL;

  return (
    <>
      <div className={gaya.riwayatDaftar}>
        {tampil.map((p) => (
          <div
            key={p.id}
            className={`${gaya.barisRiwayat} ${p.kelasStatus}`}
          >
            <div className={gaya.riwayatInfoUtama}>
              <span className={gaya.riwayatNama}>{p.nama}</span>
              <span className={gaya.riwayatTanggal}>{p.tanggal}</span>
            </div>
            <div className={gaya.riwayatKanan}>
              <span className={gaya.riwayatHarga}>{p.harga}</span>
              <span className={gaya.riwayatStatus}>{p.labelStatus}</span>
            </div>
          </div>
        ))}
      </div>
      {sisa > 0 ? (
        <button
          type="button"
          className={gaya.tombolLihatSemua}
          onClick={() => setTerbuka((v) => !v)}
        >
          {terbuka ? "Sembunyikan" : `Lihat semua (${daftar.length})`}
        </button>
      ) : null}
    </>
  );
}
