"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { LoadingAnimation } from "@/shared/ui";

/**
 * Layar penuh gerbang verifikasi email.
 *
 * Tampil setelah pendaftaran email/sandi berhasil, SEBELUM pengguna masuk ke
 * aplikasi. Hanya berlaku untuk akun email/sandi -- akun Google dikecualikan
 * otomatis karena Google selalu menetapkan emailVerified = true.
 *
 * WHY layar penuh, bukan sekadar spanduk:
 * SpandukVerifikasiEmail (yang sudah ada) tampil DI DALAM aplikasi dan mudah
 * diabaikan -- pengguna bisa langsung pakai fitur tanpa pernah memverifikasi.
 * Gerbang ini menutup seluruh aplikasi sampai email terverifikasi, memastikan
 * hanya alamat email yang benar-benar dimiliki pengguna yang bisa dipakai.
 *
 * WHY tidak menampilkan email pengguna secara utuh:
 * Profil bisa saja belum termuat saat layar ini tampil (race condition tipis).
 * Diambil dari profil bila tersedia, dengan fallback ke string kosong -- UI
 * tetap fungsional tanpa email.
 */
export function VerifikasiEmailScreen() {
  const { profil, kirimUlangVerifikasiEmail, periksaVerifikasiEmail, keluar } =
    useAuth();

  const [sibukKirim, setSibukKirim] = useState(false);
  const [sibukPeriksa, setSibukPeriksa] = useState(false);
  const [pesan, setPesan] = useState<{
    txt: string;
    jenis: "sukses" | "galat";
  } | null>(null);

  const sibuk = sibukKirim || sibukPeriksa;

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
      }
      // Bila terverifikasi: emailVerified di context berubah jadi true →
      // AppShell tidak lagi merender layar ini, pengguna masuk ke aplikasi.
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
    }
    setSibukPeriksa(false);
  }

  if (sibuk) {
    return (
      <LoadingAnimation
        fullScreen
        message={
          sibukKirim
            ? "Mengirim email verifikasi..."
            : "Memeriksa status verifikasi..."
        }
      />
    );
  }

  return (
    <div className="tv-auth">
      <div className="tv-auth-kartu">
        {/* Panel kiri: brand sama persis seperti AuthScreen */}
        <aside className="tv-auth-brand" aria-hidden>
          <div className="tv-auth-logo">
            <span className="tv-auth-logo-badge">{"\u2726"}</span>
            <span>Tinyverse</span>
          </div>
          <div className="tv-auth-brand-copy">
            <h3>Satu langkah lagi.</h3>
            <p>
              Verifikasi email Anda untuk mengaktifkan akun dan mengakses
              seluruh fitur Tinyverse.
            </p>
          </div>
          <div className="tv-auth-chips">
            <span className="tv-auth-chip">✉️ Cek kotak masuk</span>
            <span className="tv-auth-chip">🔒 Akun aman</span>
          </div>
        </aside>

        {/* Panel kanan: instruksi verifikasi */}
        <main className="tv-auth-panel">
          <div>
            {/* Ikon amplop besar */}
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "12px",
                lineHeight: 1,
              }}
              aria-hidden
            >
              ✉️
            </div>

            <h2>Verifikasi email Anda</h2>

            <p className="tv-auth-sub">
              Kami sudah mengirim tautan verifikasi ke{" "}
              {profil?.email ? (
                <strong>{profil.email}</strong>
              ) : (
                "alamat email Anda"
              )}
              . Buka email tersebut dan klik tautan di dalamnya, lalu kembali
              ke sini dan tekan tombol di bawah.
            </p>

            {pesan && (
              <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
            )}

            {/* Tombol utama: sudah verifikasi */}
            <button
              className="tv-btn"
              disabled={sibuk}
              onClick={periksa}
              style={{ marginBottom: "10px" }}
            >
              {sibukPeriksa ? "Memeriksa\u2026" : "Saya sudah verifikasi \u2713"}
            </button>

            {/* Tombol sekunder: kirim ulang */}
            <button
              className="tv-btn sekunder"
              disabled={sibuk}
              onClick={kirimUlang}
            >
              {sibukKirim ? "Mengirim\u2026" : "Kirim ulang email verifikasi"}
            </button>

            <p
              className="tv-tukar"
              style={{ marginTop: "20px", fontSize: "12px", opacity: 0.7 }}
            >
              Email salah atau ingin ganti akun?{" "}
              <a
                onClick={keluar}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && keluar()}
              >
                Keluar
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
