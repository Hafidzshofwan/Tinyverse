"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { PromoTrial } from "./PromoTrial";

type Mode = "masuk" | "daftar" | "lupa";

/**
 * Layar penuh login/daftar. Karena login wajib, layar ini menutup seluruh
 * aplikasi sampai pengguna berhasil masuk. Setia dengan v17 (dua kolom:
 * brand + form).
 */
export function AuthScreen() {
  const { status, errorMsg, masuk, masukGoogle, kirimResetSandi, daftar } =
    useAuth();
  const [mode, setMode] = useState<Mode>("masuk");
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState<{ txt: string; jenis: "galat" | "info" }>(
    { txt: "", jenis: "galat" },
  );

  // Form masuk
  const [mEmail, setMEmail] = useState("");
  const [mPass, setMPass] = useState("");
  // Form lupa kata sandi
  const [lEmail, setLEmail] = useState("");
  // Form daftar
  const [dNama, setDNama] = useState("");
  const [dInst, setDInst] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [dPass, setDPass] = useState("");

  const memuat = status === "loading";

  async function submitMasuk() {
    if (!mEmail.trim() || !mPass) {
      setPesan({ txt: "Lengkapi email dan kata sandi.", jenis: "galat" });
      return;
    }
    setPesan({ txt: "", jenis: "galat" });
    setSibuk(true);
    try {
      await masuk(mEmail.trim(), mPass);
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
      setSibuk(false);
    }
  }

  async function submitDaftar() {
    if (!dNama.trim()) {
      setPesan({ txt: "Mohon isi nama lengkap.", jenis: "galat" });
      return;
    }
    if (!dEmail.trim() || !dPass) {
      setPesan({ txt: "Lengkapi email dan kata sandi.", jenis: "galat" });
      return;
    }
    if (dPass.length < 6) {
      setPesan({ txt: "Kata sandi minimal 6 karakter.", jenis: "galat" });
      return;
    }
    setPesan({ txt: "", jenis: "galat" });
    setSibuk(true);
    try {
      await daftar(dNama.trim(), dInst.trim(), dEmail.trim(), dPass);
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
      setSibuk(false);
    }
  }

  async function submitGoogle() {
    setPesan({ txt: "", jenis: "galat" });
    setSibuk(true);
    try {
      await masukGoogle();
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
      setSibuk(false);
    }
  }

  async function submitLupa() {
    if (!lEmail.trim()) {
      setPesan({ txt: "Masukkan email Anda.", jenis: "galat" });
      return;
    }
    setPesan({ txt: "", jenis: "galat" });
    setSibuk(true);
    try {
      await kirimResetSandi(lEmail.trim());
      /*
       * Pesan sengaja netral: tidak menyebut apakah email itu terdaftar atau
       * tidak, supaya halaman ini tidak bisa dipakai memeriksa keberadaan akun.
       */
      setPesan({
        txt: "Bila email tersebut terdaftar, tautan penyetelan ulang kata sandi sudah dikirim. Periksa kotak masuk dan folder spam.",
        jenis: "info",
      });
    } catch (e) {
      setPesan({ txt: (e as Error).message, jenis: "galat" });
    }
    setSibuk(false);
  }

  function gantiMode(m: Mode) {
    setMode(m);
    setPesan({ txt: "", jenis: "galat" });
  }

  return (
    <div className="tv-auth">
      <div className="tv-auth-kartu">
        <aside className="tv-auth-brand" aria-hidden>
          <div className="tv-auth-logo">
            <span className="tv-auth-logo-badge">{"\u2726"}</span>
            <span>Tinyverse</span>
          </div>
          <div className="tv-auth-brand-copy">
            <h3>Toolkit klinis pediatri dalam satu ruang.</h3>
            <p>
              Akses kalkulator, guideline, dan tumbuh kembang dalam satu
              dashboard bernuansa profesional.
            </p>
          </div>
          <div className="tv-auth-chips">
            <span className="tv-auth-chip">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <defs>
                  <linearGradient id="tv-calc-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="tv-calc-screen" x1="6" y1="5" x2="18" y2="9" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F0F9FF" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                  </linearGradient>
                </defs>
                <rect x="3.5" y="2" width="17" height="20" rx="3.5" fill="url(#tv-calc-bg)" />
                <rect x="6" y="4.5" width="12" height="4.5" rx="1.5" fill="url(#tv-calc-screen)" />
                <rect x="7.5" y="6.2" width="5" height="1" rx="0.5" fill="#0284C7" />
                <circle cx="8" cy="12" r="1.3" fill="#FFFFFF" />
                <circle cx="12" cy="12" r="1.3" fill="#FFFFFF" />
                <circle cx="16" cy="12" r="1.3" fill="#F59E0B" />
                <circle cx="8" cy="15.5" r="1.3" fill="#FFFFFF" />
                <circle cx="12" cy="15.5" r="1.3" fill="#FFFFFF" />
                <circle cx="16" cy="15.5" r="1.3" fill="#34D399" />
                <circle cx="8" cy="19" r="1.3" fill="#FFFFFF" />
                <circle cx="12" cy="19" r="1.3" fill="#FFFFFF" />
                <circle cx="16" cy="19" r="1.3" fill="#F43F5E" />
              </svg>
              Kalkulator
            </span>
            <span className="tv-auth-chip">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <defs>
                  <linearGradient id="tv-guide-bg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 19.5C4 18.12 5.12 17 6.5 17H20V3H6.5C5.12 3 4 4.12 4 5.5V19.5Z"
                  fill="url(#tv-guide-bg)"
                />
                <path
                  d="M4 19.5C4 18.12 5.12 17 6.5 17H20V21H6.5C5.12 21 4 19.88 4 19.5Z"
                  fill="#4C1D95"
                  fillOpacity="0.4"
                />
                <path d="M6.5 3H8V21H6.5C5.12 21 4 19.88 4 19.5V5.5C4 4.12 5.12 3 6.5 3Z" fill="#FFFFFF" fillOpacity="0.2" />
                <rect x="11.5" y="7" width="4" height="8" rx="1" fill="#FFFFFF" />
                <rect x="9.5" y="9" width="8" height="4" rx="1" fill="#FFFFFF" />
                <rect x="12" y="7.5" width="3" height="7" rx="0.5" fill="#34D399" />
                <rect x="10" y="9.5" width="7" height="3" rx="0.5" fill="#34D399" />
                <path d="M16 3V8L18 6.5L20 8V3H16Z" fill="#F59E0B" />
              </svg>
              Guideline
            </span>
            <span className="tv-auth-chip">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <defs>
                  <linearGradient id="tv-growth-bg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="tv-growth-area" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F472B6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#tv-growth-bg)" />
                <line x1="5" y1="18" x2="19" y2="18" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" />
                <line x1="5" y1="13" x2="19" y2="13" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="5" y1="8" x2="19" y2="8" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M5 16L9.5 12.5L13.5 14L19 7.5V18H5V16Z" fill="url(#tv-growth-area)" />
                <path
                  d="M5 16L9.5 12.5L13.5 14L19 7.5"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="5" cy="16" r="1.5" fill="#38BDF8" />
                <circle cx="9.5" cy="12.5" r="1.5" fill="#38BDF8" />
                <circle cx="13.5" cy="14" r="1.5" fill="#38BDF8" />
                <circle cx="19" cy="7.5" r="2" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
              </svg>
              Tumbuh Kembang
            </span>
          </div>
        </aside>
        <main className="tv-auth-panel">
          {memuat ? (
            <div className="tv-muat">
              <div className="tv-spinner" />
              <div>{"Memuat\u2026"}</div>
            </div>
          ) : status === "error" ? (
            <div>
              <h2>Tidak dapat memuat</h2>
              <p className="tv-auth-sub">{errorMsg}</p>
              <button
                className="tv-btn sekunder"
                onClick={() => window.location.reload()}
              >
                Muat ulang
              </button>
            </div>
          ) : mode === "masuk" ? (
            <div>
              <h2>Welcome back, Meds!</h2>
              <p className="tv-auth-sub">
                Masuk untuk melanjutkan ke Tinyverse dengan tampilan terbaru
                yang lebih elegan dan fokus.
              </p>
              <PromoTrial ringkas />
              {(pesan.txt || errorMsg) && (
                <div className={"tv-pesan " + (pesan.txt ? pesan.jenis : "galat")}>
                  {pesan.txt || errorMsg}
                </div>
              )}
              <div className="tv-field">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="nama@contoh.com"
                  value={mEmail}
                  onChange={(e) => setMEmail(e.target.value)}
                />
              </div>
              <div className="tv-field">
                <label>Kata sandi</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  value={mPass}
                  onChange={(e) => setMPass(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitMasuk();
                  }}
                />
              </div>
              <button className="tv-btn" disabled={sibuk} onClick={submitMasuk}>
                {sibuk ? "Memproses\u2026" : "Masuk ke Tinyverse"}
              </button>
              <p className="tv-tukar" style={{ marginTop: "8px", marginBottom: "4px" }}>
                <a onClick={() => gantiMode("lupa")}>Lupa kata sandi?</a>
              </p>
              <div className="tv-divider">atau</div>
              <button
                className="tv-btn sekunder tv-btn-google"
                disabled={sibuk}
                onClick={submitGoogle}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
              <p className="tv-tukar">
                Belum punya akun?{" "}
                <a onClick={() => gantiMode("daftar")}>Daftar di sini</a>
              </p>
            </div>
          ) : mode === "lupa" ? (
            <div>
              <h2>Lupa kata sandi</h2>
              <p className="tv-auth-sub">
                Masukkan email akun Anda. Kami kirimkan tautan untuk menyetel
                ulang kata sandi.
              </p>
              {pesan.txt && (
                <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
              )}
              <div className="tv-field">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="nama@contoh.com"
                  value={lEmail}
                  onChange={(e) => setLEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitLupa();
                  }}
                />
              </div>
              <button className="tv-btn" disabled={sibuk} onClick={submitLupa}>
                {sibuk ? "Mengirim\u2026" : "Kirim tautan reset"}
              </button>
              <p className="tv-tukar">
                Ingat kata sandi Anda?{" "}
                <a onClick={() => gantiMode("masuk")}>Kembali ke masuk</a>
              </p>
            </div>
          ) : (
            <div>
              <h2>Buat akun Tinyverse</h2>
              <p className="tv-auth-sub">
                Lengkapi data berikut untuk menyiapkan profil Anda.
              </p>
              <PromoTrial />
              {pesan.txt && (
                <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
              )}
              <div className="tv-field">
                <label>Nama lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={dNama}
                  onChange={(e) => setDNama(e.target.value)}
                />
              </div>
              <div className="tv-field">
                <label>Institusi / jabatan</label>
                <input
                  type="text"
                  placeholder="dokter spesialis / dokter umum / perawat"
                  value={dInst}
                  onChange={(e) => setDInst(e.target.value)}
                />
              </div>
              <div className="tv-field">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="nama@contoh.com"
                  value={dEmail}
                  onChange={(e) => setDEmail(e.target.value)}
                />
              </div>
              <div className="tv-field">
                <label>Kata sandi</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={dPass}
                  onChange={(e) => setDPass(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitDaftar();
                  }}
                />
              </div>
              <button className="tv-btn" disabled={sibuk} onClick={submitDaftar}>
                {sibuk ? "Memproses\u2026" : "Buat akun"}
              </button>
              <div className="tv-divider">atau</div>
              <button
                className="tv-btn sekunder tv-btn-google"
                disabled={sibuk}
                onClick={submitGoogle}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
              <p className="tv-tukar">
                Sudah punya akun?{" "}
                <a onClick={() => gantiMode("masuk")}>Masuk di sini</a>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
