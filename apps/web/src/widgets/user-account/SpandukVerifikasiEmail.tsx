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
        try {
          window.localStorage.removeItem(TUTUP_KEY);
        } catch {
          /* abaikan */
        }
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
        {/* Hint spam — dibedakan visual agar tidak terlewat */}
        <span className={gaya.hintSpam}>
          <span className={gaya.hintSpamIkon} aria-hidden>📂</span>
          Tidak ketemu? Email verifikasi kadang nyasar ke{" "}
          <strong>folder Spam atau Promosi</strong> — coba cek di sana juga.
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
