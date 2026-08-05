"use client";

/**
 * Tombol pembelian satu paket.
 *
 * Client Component seminimal mungkin. Ia hanya meminta server membuatkan
 * pesanan, lalu memunculkan jendela pembayaran Midtrans di atas halaman ini.
 * Tidak ada satu pun keputusan uang di berkas ini - seluruhnya diputuskan di
 * server, karena apa pun yang berjalan di peramban dapat diubah oleh
 * pemakainya.
 *
 * WHY popup, bukan pindah halaman: pelanggan tetap berada di domain Tinyverse
 * selama membayar. Bila snap.js gagal dimuat -- pemblokir skrip, jaringan
 * kantor, peramban tua -- kita tidak menyerah, melainkan jatuh ke jalur lama
 * dengan mengalihkan peramban ke halaman Midtrans. Pesanannya sudah terlanjur
 * dibuat, dan membuangnya hanya akan menyakiti pelanggan yang sudah berniat
 * membayar.
 *
 * Yang TIDAK pernah dilakukan di sini: menyimpulkan pembayaran berhasil.
 * Callback onSuccess hanya memindahkan halaman; masa aktif tetap ditentukan
 * oleh webhook di server.
 */
import { useState } from "react";

import gaya from "./langganan.module.css";

type JawabanCheckout = {
  orderId?: string;
  token?: string;
  redirectUrl?: string;
  pesan?: string;
};

type OpsiSnap = {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
};

type SnapGlobal = { pay: (token: string, opsi?: OpsiSnap) => void };

declare global {
  interface Window {
    snap?: SnapGlobal;
  }
}

const ID_SKRIP = "midtrans-snap-js";

/**
 * Memuat snap.js sekali saja, lalu memakai ulang yang sudah ada.
 *
 * Menolak (reject) bila gagal, sehingga pemanggilnya bisa memilih jalur
 * cadangan alih-alih menggantung tanpa kabar.
 */
function muatSnap(urlSnapJs: string, clientKey: string): Promise<SnapGlobal> {
  return new Promise((selesai, gagal) => {
    if (window.snap) {
      selesai(window.snap);
      return;
    }

    const adaSebelumnya = document.getElementById(
      ID_SKRIP,
    ) as HTMLScriptElement | null;
    const skrip = adaSebelumnya ?? document.createElement("script");

    skrip.addEventListener(
      "load",
      () => {
        if (window.snap) selesai(window.snap);
        else gagal(new Error("snap.js dimuat tetapi window.snap tidak ada."));
      },
      { once: true },
    );
    skrip.addEventListener(
      "error",
      () => gagal(new Error("snap.js gagal dimuat.")),
      { once: true },
    );

    if (!adaSebelumnya) {
      skrip.id = ID_SKRIP;
      skrip.src = urlSnapJs;
      skrip.async = true;
      /* Nama atribut ini ditentukan Midtrans dan tidak boleh diubah. */
      skrip.setAttribute("data-client-key", clientKey);
      document.body.appendChild(skrip);
    }
  });
}

export function TombolBeli({
  planId,
  label,
  clientKey,
  urlSnapJs,
  buttonClassName,
  containerClassName,
}: {
  planId: string;
  label: string;
  clientKey: string;
  urlSnapJs: string;
  buttonClassName?: string;
  containerClassName?: string;
}) {
  const [sibuk, setSibuk] = useState(false);
  const [kesalahan, setKesalahan] = useState<string | null>(null);

  /** Meminta server membuat pesanan. Mengembalikan null bila gagal. */
  async function mintaPesanan(): Promise<JawabanCheckout | null> {
    try {
      const jawaban = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = (await jawaban.json()) as JawabanCheckout;

      if (!jawaban.ok || (!data.token && !data.redirectUrl)) {
        setKesalahan(data.pesan ?? "Gagal memulai pembayaran. Coba lagi.");
        return null;
      }

      return data;
    } catch {
      setKesalahan("Tidak dapat menghubungi server. Periksa koneksi Anda.");
      return null;
    }
  }

  async function beli() {
    setSibuk(true);
    setKesalahan(null);

    const data = await mintaPesanan();
    if (!data) {
      setSibuk(false);
      return;
    }

    const halamanSelesai = data.orderId
      ? `/langganan/selesai?order_id=${encodeURIComponent(data.orderId)}`
      : "/langganan/selesai";
    const alamatCadangan = data.redirectUrl ?? "";
    const token = data.token ?? "";

    /* Jalur cadangan: pindah ke halaman Midtrans. Sengaja tidak memanggil
       setSibuk(false) saat berhasil -- halaman sedang ditinggalkan, dan
       mengaktifkan kembali tombolnya hanya membuka peluang satu klik terakhir
       yang melahirkan pesanan kedua. */
    function pindahKeMidtrans() {
      if (alamatCadangan) {
        window.location.href = alamatCadangan;
        return;
      }
      setKesalahan("Jendela pembayaran gagal dibuka. Muat ulang lalu coba lagi.");
      setSibuk(false);
    }

    if (!clientKey || !urlSnapJs || !token) {
      pindahKeMidtrans();
      return;
    }

    try {
      const snap = await muatSnap(urlSnapJs, clientKey);

      snap.pay(token, {
        /* Dua callback pertama hanya memindahkan halaman. Yang menentukan masa
           aktif tetap webhook, sehingga pelanggan yang memalsukan callback ini
           pun tidak mendapat apa-apa. */
        onSuccess: () => {
          window.location.href = halamanSelesai;
        },
        onPending: () => {
          window.location.href = halamanSelesai;
        },
        onError: () => {
          setKesalahan("Pembayaran gagal diproses. Silakan coba lagi.");
          setSibuk(false);
        },
        /* Pelanggan menutup jendela tanpa membayar. Pesanan dibiarkan
           "menunggu" dan akan kedaluwarsa sendiri di Midtrans. Tombol
           diaktifkan kembali agar ia bisa mencoba lagi. */
        onClose: () => {
          setSibuk(false);
        },
      });
    } catch {
      pindahKeMidtrans();
    }
  }

  return (
    <div className={containerClassName || gaya.aksi}>
      <button
        type="button"
        className={buttonClassName || gaya.tombol}
        onClick={beli}
        /* Penjaga terhadap klik ganda. Setiap klik melahirkan satu nomor
           pesanan baru di Midtrans, dan nomor pesanan tidak bisa dipakai
           ulang selamanya. */
        disabled={sibuk}
      >
        {sibuk ? "Menyiapkan\u2026" : label}
      </button>
      {kesalahan ? <p className={gaya.kesalahan}>{kesalahan}</p> : null}
    </div>
  );
}
