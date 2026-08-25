"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import gaya from "./verifikasi.module.css";

const TUTUP_KEY = "tv-verif-email-tutup";

/**
 * Spanduk pengingat verifikasi email.
 *
 * Tampil hanya bila pengguna sudah masuk TAPI emailnya belum diverifikasi
 * (pasti akun email/sandi -- akun Google selalu terverifikasi otomatis).
 *
 * WHY ditempatkan di sisi klien (Client Component):
 * Status emailVerified dibaca langsung dari Firebase Auth dan dipantau oleh
 * AuthProvider; tidak ada di cookie server. Komponen ini tidak perlu data
 * apapun dari server, hanya state yang sudah tersedia di context.
 *
 * WHY "Saya sudah verifikasi" perlu tombol manual:
 * Firebase tidak mengirimkan event real-time ke aplikasi yang sedang berjalan
 * ketika pengguna mengklik link verifikasi di tab/perangkat lain. Satu-satunya
 * cara aplikasi tahu adalah dengan memanggil u.reload() -- itulah yang
 * dilakukan periksaVerifikasiEmail(). Tombol ini menjadi jembatan antara
 * "sudah klik di email" dan "banner menghilang".
 */
export function SpandukVerifikasiEmail() {
  const { status, emailVerified, kirimUlangVerifikasiEmail, periksaVerifikasiEmail } =
    useAuth();

  const [sibukKirim, setSibukKirim] = useState(false);
  const [sibukPeriksa, setSibukPeriksa] = useState(false);
  const [pesan, setPesan] = useState<{ txt: string; jenis: "sukses" | "galat" } | null>(
    null,
  );
  const [ditutup, setDitutup] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(TUTUP_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Hanya tampil bila: sudah masuk, email belum terverifikasi, belum ditutup
  if (status !== "signedIn" || emailVerified || ditutup) return null;

  function tutup() {
    setDitutup(true);
    try {
      window.localStorage.setItem(TUTUP_KEY, "1");
    } catch {
      /* Mode privat: abaikan */
    }
  }

  async function kirimUlang() {
    setSibukKirim(true);
    setPesan(null);
    try {
      await kirimUlangVerifikasiEmail();
      setPesan({
        txt: "Email verifikasi sudah dikirim ulang. Periksa kotak masuk dan folder spam.",
        jenis: "sukses",
      });
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
    }
    setSibukKirim(false);
  }

  async function periksa() {
    setSibukPeriksa(true);
    setPesan(null);
    try {
      const terverifikasi = await periksaVerifikasiEmail();
      if (!terverifikasi) {
        setPesan({
          txt: "Email Anda belum diverifikasi. Klik tautan di email yang sudah dikirim, lalu coba lagi.",
          jenis: "galat",
        });
      } else {
        // Berhasil terverifikasi: hapus flag "ditutup" agar tidak meninggalkan
        // entri localStorage yang tidak relevan di browser pengguna.
        try {
          window.localStorage.removeItem(TUTUP_KEY);
        } catch {
          /* abaikan */
        }
        // emailVerified di context berubah jadi true → komponen tidak render lagi.
      }
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
    }
    setSibukPeriksa(false);
  }

  return (
    <div className={gaya.spanduk} role="status" aria-live="polite">
      <span className={gaya.ikon} aria-hidden>
        ✉️
      </span>
      <div className={gaya.teks}>
        <strong className={gaya.judul}>Verifikasi email Anda</strong>
        <span className={gaya.pesan}>
          Kami sudah mengirim tautan verifikasi ke email Anda. Klik tautan tersebut
          untuk mengaktifkan akun sepenuhnya.
        </span>
        {pesan && (
          <span className={`${gaya.info} ${gaya[pesan.jenis]}`}>{pesan.txt}</span>
        )}
      </div>
      <div className={gaya.aksi}>
        <button
          type="button"
          className={`${gaya.tombol} ${gaya.tombolSekunder}`}
          onClick={kirimUlang}
          disabled={sibukKirim || sibukPeriksa}
        >
          {sibukKirim ? "Mengirim…" : "Kirim ulang email"}
        </button>
        <button
          type="button"
          className={gaya.tombol}
          onClick={periksa}
          disabled={sibukKirim || sibukPeriksa}
        >
          {sibukPeriksa ? "Memeriksa…" : "Saya sudah verifikasi"}
        </button>
        <button
          type="button"
          className={gaya.tutup}
          onClick={tutup}
          aria-label="Tutup pengingat verifikasi"
          title="Tutup (untuk sesi ini)"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </div>
  );
}
