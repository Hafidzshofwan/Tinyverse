"use client";

/**
 * Tombol pembelian satu paket.
 *
 * Client Component seminimal mungkin. Ia hanya meminta server membuatkan
 * pesanan, lalu memindahkan peramban ke halaman Midtrans. Tidak ada satu pun
 * keputusan uang di berkas ini - seluruhnya diputuskan di server, karena apa
 * pun yang berjalan di peramban dapat diubah oleh pemakainya.
 */
import { useState } from "react";

import gaya from "./langganan.module.css";

type JawabanCheckout = {
  redirectUrl?: string;
  pesan?: string;
};

export function TombolBeli({
  planId,
  label,
}: {
  planId: string;
  label: string;
}) {
  const [sibuk, setSibuk] = useState(false);
  const [kesalahan, setKesalahan] = useState<string | null>(null);

  async function beli() {
    setSibuk(true);
    setKesalahan(null);

    try {
      const jawaban = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = (await jawaban.json()) as JawabanCheckout;

      if (!jawaban.ok || !data.redirectUrl) {
        setKesalahan(data.pesan ?? "Gagal memulai pembayaran. Coba lagi.");
        setSibuk(false);
        return;
      }

      /* Sengaja tidak memanggil setSibuk(false) di sini. Halaman sedang
         ditinggalkan; mengaktifkan kembali tombolnya hanya membuka peluang
         satu klik terakhir yang melahirkan pesanan kedua. */
      window.location.href = data.redirectUrl;
    } catch {
      setKesalahan("Tidak dapat menghubungi server. Periksa koneksi Anda.");
      setSibuk(false);
    }
  }

  return (
    <div className={gaya.aksi}>
      <button
        type="button"
        className={gaya.tombol}
        onClick={beli}
        /* Penjaga terhadap klik ganda. Setiap klik melahirkan satu nomor
           pesanan baru di Midtrans, dan nomor pesanan tidak bisa dipakai
           ulang selamanya. */
        disabled={sibuk}
      >
        {sibuk ? "Menyiapkan…" : label}
      </button>
      {kesalahan ? <p className={gaya.kesalahan}>{kesalahan}</p> : null}
    </div>
  );
}
