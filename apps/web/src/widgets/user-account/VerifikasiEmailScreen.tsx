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
        {/* Panel kiri: brand */}
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
            <div
              style={{ fontSize: "3rem", marginBottom: "12px", lineHeight: 1 }}
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

            {/* Hint spam — kotak tersendiri agar mata langsung tertuju */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                margin: "12px 0 16px",
                padding: "10px 13px",
                borderRadius: "10px",
                background: "#fefce8",
                border: "1px solid #fde68a",
                borderLeft: "3px solid #f59e0b",
                fontSize: "0.83rem",
                color: "#78350f",
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }} aria-hidden>
                📂
              </span>
              <span>
                Tidak ketemu emailnya?{" "}
                <strong>Cek folder Spam atau Promosi</strong>.
              </span>
            </div>

            {pesan && (
              <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
            )}

            <button
              className="tv-btn"
              disabled={sibuk}
              onClick={periksa}
              style={{ marginBottom: "10px" }}
            >
              {sibukPeriksa ? "Memeriksa\u2026" : "Saya sudah verifikasi \u2713"}
            </button>

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
