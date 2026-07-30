"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

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
            <span className="tv-auth-chip">{"\uD83E\uDDEE"} Kalkulator</span>
            <span className="tv-auth-chip">{"\uD83E\uDE7A"} Guideline</span>
            <span className="tv-auth-chip">{"\uD83D\uDCC8"} Tumbuh Kembang</span>
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
