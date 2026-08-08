"use client";

/**
 * Banner + jam hitung mundur promo peluncuran, khusus halaman /langganan.
 *
 * WHY dihitung di klien, bukan dikirim sudah jadi dari server: nilai
 * "sisa waktu" berubah setiap detik. Mengirim string statis dari server
 * berarti angkanya sudah basi begitu HTML sampai di layar. Client Component
 * ini menghitung ulang setiap detik dari `berakhirPada` (ISO tetap yang sama
 * untuk semua pengguna) memakai jam perangkat pengunjung.
 *
 * WHY state awal `null`: render pertama di server dan render pertama di
 * klien harus identik supaya React tidak mengeluh soal hydration mismatch.
 * Angka sungguhan baru dihitung di `useEffect`, yang hanya berjalan di
 * peramban -- banner muncul sepersekian detik setelah halaman aktif, dan itu
 * jauh lebih aman daripada risiko selisih jam server/klien.
 */
import { useEffect, useState } from "react";

import gaya from "./langganan-concepts.module.css";

type SisaWaktu = {
  hari: number;
  jam: number;
  menit: number;
  detik: number;
  sudahHabis: boolean;
};

function hitungSisa(berakhirPada: string): SisaWaktu {
  const sisaMs = new Date(berakhirPada).getTime() - Date.now();
  if (sisaMs <= 0) {
    return { hari: 0, jam: 0, menit: 0, detik: 0, sudahHabis: true };
  }
  const detikTotal = Math.floor(sisaMs / 1000);
  return {
    hari: Math.floor(detikTotal / 86400),
    jam: Math.floor((detikTotal % 86400) / 3600),
    menit: Math.floor((detikTotal % 3600) / 60),
    detik: detikTotal % 60,
    sudahHabis: false,
  };
}

function duaDigit(n: number): string {
  return n.toString().padStart(2, "0");
}

export function PromoCountdown({
  berakhirPada,
  diskonPersen,
}: {
  berakhirPada: string;
  diskonPersen: number;
}) {
  const [sisa, setSisa] = useState<SisaWaktu | null>(null);

  useEffect(() => {
    setSisa(hitungSisa(berakhirPada));
    const id = setInterval(() => setSisa(hitungSisa(berakhirPada)), 1000);
    return () => clearInterval(id);
  }, [berakhirPada]);

  /* Belum dihitung (render pertama di klien) atau promo sudah lewat waktunya
     menurut jam pengunjung sendiri -- pada kedua kasus ini banner tidak
     ditampilkan. Bila jam server masih menganggap promo aktif tetapi jam
     pengunjung sudah lewat, halaman tetap benar: harga di kartu paket tetap
     memakai keputusan server, hanya banner ini yang bersembunyi lebih awal. */
  if (!sisa || sisa.sudahHabis) return null;

  return (
    <div className={gaya.promoBanner}>
      <div className={gaya.promoBannerGlow} aria-hidden="true" />
      <div className={gaya.promoBannerIsi}>
        <span className={gaya.promoBadge}>Promo Peluncuran</span>
        <p className={gaya.promoJudul}>
          Diskon {diskonPersen}% untuk semua paket, waktu terbatas!
        </p>

        <div className={gaya.promoTimer} role="timer" aria-live="off">
          <div className={gaya.promoTimerUnit}>
            <span className={gaya.promoTimerAngka}>{duaDigit(sisa.hari)}</span>
            <span className={gaya.promoTimerLabel}>Hari</span>
          </div>
          <span className={gaya.promoTimerTitik} aria-hidden="true">:</span>
          <div className={gaya.promoTimerUnit}>
            <span className={gaya.promoTimerAngka}>{duaDigit(sisa.jam)}</span>
            <span className={gaya.promoTimerLabel}>Jam</span>
          </div>
          <span className={gaya.promoTimerTitik} aria-hidden="true">:</span>
          <div className={gaya.promoTimerUnit}>
            <span className={gaya.promoTimerAngka}>{duaDigit(sisa.menit)}</span>
            <span className={gaya.promoTimerLabel}>Menit</span>
          </div>
          <span className={gaya.promoTimerTitik} aria-hidden="true">:</span>
          <div className={gaya.promoTimerUnit}>
            <span className={gaya.promoTimerAngka}>{duaDigit(sisa.detik)}</span>
            <span className={gaya.promoTimerLabel}>Detik</span>
          </div>
        </div>

        <p className={gaya.promoCatatan}>
          Harga otomatis kembali normal setelah waktu promo berakhir.
        </p>
      </div>
    </div>
  );
}
