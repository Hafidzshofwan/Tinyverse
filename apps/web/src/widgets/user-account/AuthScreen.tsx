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
              <p className="tv-tukar">
                <a onClick={() => gantiMode("lupa")}>Lupa kata sandi?</a>
              </p>
              <button className="tv-btn" disabled={sibuk} onClick={submitMasuk}>
                {sibuk ? "Memproses\u2026" : "Masuk ke Tinyverse"}
              </button>
              <div className="tv-divider">atau</div>
              <button
                className="tv-btn sekunder"
                disabled={sibuk}
                onClick={submitGoogle}
              >
                Lanjutkan dengan Google
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
                className="tv-btn sekunder"
                disabled={sibuk}
                onClick={submitGoogle}
              >
                Lanjutkan dengan Google
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
