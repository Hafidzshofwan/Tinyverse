"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Pengingat } from "./pengingat";
import gaya from "./spanduk.module.css";

export interface SpandukLanggananProps {
  pengingat: Pengingat;
}

/**
 * Pita pengingat masa langganan.
 *
 * Isi pitanya dihitung di server dan dititipkan lewat prop, bukan diambil
 * sendiri di sini. WHY: status langganan hanya boleh berasal dari cookie sesi
 * `tv_sesi` yang dibaca di server. Bila komponen ini memanggil sebuah rute API
 * untuk menanyakannya, akan lahir sumber kebenaran kedua tentang siapa yang
 * masih berlangganan -- dan sumber kedua itu cepat atau lambat akan berbeda
 * jawaban dengan gerbang /preview.
 *
 * Yang dikerjakan di sisi klien hanya satu: mengingat bahwa pengguna sudah
 * menutup pita ini hari ini. Penanda hariannya sengaja ditaruh di localStorage,
 * bukan di Firestore, karena ini murni urusan kenyamanan tampilan dan tidak
 * layak menambah satu operasi tulis basis data per klik.
 */
export function SpandukLangganan({ pengingat }: SpandukLanggananProps) {
  /* Mulai dari keadaan tidak tampil, lalu baru ditampilkan setelah komponen
     terpasang di browser dan localStorage sudah dibaca. Bila urutannya dibalik,
     pita akan sempat berkedip muncul lalu hilang bagi pengguna yang sudah
     menutupnya. */
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(pengingat.kunci) === "1") return;
    } catch {
      /* Mode privat pada beberapa peramban melarang localStorage. Pengingat
         tetap ditampilkan; kehilangan tombol tutup jauh lebih ringan
         akibatnya daripada kehilangan pengingatnya. */
    }
    setTampil(true);
  }, [pengingat.kunci]);

  function tutup() {
    setTampil(false);
    try {
      window.localStorage.setItem(pengingat.kunci, "1");
    } catch {
      /* Diabaikan dengan sengaja: lihat alasan di atas. */
    }
  }

  if (!tampil) return null;

  const kelasNada = pengingat.nada === "berakhir" ? gaya.berakhir : gaya.peringatan;

  return (
    <div className={`${gaya.spanduk} ${kelasNada}`} role="status">
      <div className={gaya.teks}>
        <strong className={gaya.judul}>{pengingat.judul}</strong>
        <span className={gaya.pesan}>{pengingat.pesan}</span>
      </div>
      <div className={gaya.aksi}>
        <Link href="/langganan" className={gaya.tombol}>
          Perpanjang
        </Link>
        <button
          type="button"
          className={gaya.tutup}
          onClick={tutup}
          aria-label="Tutup pengingat untuk hari ini"
        >
          <span aria-hidden>{"\u00D7"}</span>
        </button>
      </div>
    </div>
  );
}
