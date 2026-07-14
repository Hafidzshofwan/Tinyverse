"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthProvider";
import type { RiwayatItem } from "./AuthProvider";
import { avatarProps, fotoKeDataUrl } from "./avatar";

type Tab = "info" | "pref" | "riwayat";

function fmtWaktu(ms: number): string {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ProfileModal({ onTutup }: { onTutup: () => void }) {
  const { profil, simpanProfil, simpanPref, muatRiwayat } = useAuth();
  const [tab, setTab] = useState<Tab>("info");
  const [nama, setNama] = useState(profil?.nama || "");
  const [inst, setInst] = useState(profil?.institusi || "");
  const [avatarSementara, setAvatarSementara] = useState<string | null>(null);
  const [pesan, setPesan] = useState<{ txt: string; jenis: "galat" | "info" }>(
    { txt: "", jenis: "info" },
  );
  const [sibuk, setSibuk] = useState(false);

  const [dekor, setDekor] = useState(
    !!(profil?.preferensi && profil.preferensi.sembunyikanDekorasi),
  );
  const [prefSibuk, setPrefSibuk] = useState(false);

  const [riwayat, setRiwayat] = useState<RiwayatItem[] | null>(null);
  const [riwayatGalat, setRiwayatGalat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pasang, setPasang] = useState(false);
  useEffect(() => setPasang(true), []);

  // Muat riwayat saat tab dibuka pertama kali.
  useEffect(() => {
    if (tab !== "riwayat" || riwayat !== null) return;
    let batal = false;
    muatRiwayat()
      .then((r) => {
        if (!batal) setRiwayat(r);
      })
      .catch((e) => {
        if (!batal) setRiwayatGalat((e as Error).message);
      });
    return () => {
      batal = true;
    };
  }, [tab, riwayat, muatRiwayat]);

  if (!profil) return null;

  const avaSumber = avatarSementara || profil.avatar;
  const ava = avatarProps(avaSumber, profil.nama);

  async function pilihFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const dataUrl = await fotoKeDataUrl(f);
      setAvatarSementara(dataUrl);
      setPesan({ txt: "Foto siap disimpan. Klik Simpan perubahan.", jenis: "info" });
    } catch (err) {
      setPesan({ txt: (err as Error).message, jenis: "galat" });
    }
  }

  async function onSimpanProfil() {
    setSibuk(true);
    try {
      await simpanProfil({
        nama,
        institusi: inst,
        avatar: avatarSementara || undefined,
      });
      setAvatarSementara(null);
      setPesan({ txt: "Profil berhasil disimpan.", jenis: "info" });
      setTimeout(onTutup, 400);
    } catch (err) {
      setPesan({ txt: "Gagal menyimpan: " + (err as Error).message, jenis: "galat" });
    } finally {
      setSibuk(false);
    }
  }

  async function onSimpanPref() {
    setPrefSibuk(true);
    try {
      await simpanPref({ sembunyikanDekorasi: dekor });
      onTutup();
    } catch (err) {
      setPesan({ txt: "Gagal menyimpan: " + (err as Error).message, jenis: "galat" });
    } finally {
      setPrefSibuk(false);
    }
  }

  if (!pasang) return null;

  return createPortal(
    <div
      className="tv-modal tampil"
      onClick={(e) => {
        if (e.target === e.currentTarget) onTutup();
      }}
    >
      <div className="tv-modal-kartu">
        <button className="tv-modal-tutup" onClick={onTutup} aria-label="Tutup">
          {"\u00D7"}
        </button>
        <h2>{"\uD83D\uDC64"} Profil Saya</h2>
        <div className="tv-tab-bar">
          <button
            className={"tv-tab" + (tab === "info" ? " aktif" : "")}
            onClick={() => setTab("info")}
          >
            Identitas
          </button>
          <button
            className={"tv-tab" + (tab === "pref" ? " aktif" : "")}
            onClick={() => setTab("pref")}
          >
            Preferensi
          </button>
          <button
            className={"tv-tab" + (tab === "riwayat" ? " aktif" : "")}
            onClick={() => setTab("riwayat")}
          >
            Riwayat
          </button>
        </div>

        {tab === "info" && (
          <div>
            {pesan.txt && (
              <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
            )}
            <div className="tv-ava-aksi">
              <div
                className={"tv-ava-besar" + (ava.teks ? "" : " tv-user-av-foto")}
                style={ava.style}
              >
                {ava.teks}
              </div>
              <label className="tv-foto-btn">
                {"\uD83D\uDCF7"} Ganti foto
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="tv-sembunyi"
                  onChange={pilihFoto}
                />
              </label>
            </div>
            <div className="tv-field">
              <label>Nama lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="tv-field">
              <label>Institusi / jabatan</label>
              <input
                type="text"
                value={inst}
                onChange={(e) => setInst(e.target.value)}
              />
            </div>
            <div className="tv-field">
              <label>Email</label>
              <input type="text" value={profil.email || ""} disabled />
            </div>
            <button className="tv-btn" disabled={sibuk} onClick={onSimpanProfil}>
              {sibuk ? "Menyimpan\u2026" : "Simpan perubahan"}
            </button>
          </div>
        )}

        {tab === "pref" && (
          <div>
            <label className="tv-cek">
              <input
                type="checkbox"
                checked={dekor}
                onChange={(e) => setDekor(e.target.checked)}
              />{" "}
              Sembunyikan dekorasi background (tampilan fokus)
            </label>
            <button
              className="tv-btn"
              disabled={prefSibuk}
              onClick={onSimpanPref}
            >
              {prefSibuk ? "Menyimpan\u2026" : "Simpan preferensi"}
            </button>
          </div>
        )}

        {tab === "riwayat" && (
          <div className="tv-riwayat">
            {riwayatGalat ? (
              <div className="tv-kosong">
                Gagal memuat riwayat: {riwayatGalat}
              </div>
            ) : riwayat === null ? (
              <div className="tv-kosong">{"Memuat\u2026"}</div>
            ) : riwayat.length === 0 ? (
              <div className="tv-kosong">Belum ada riwayat perhitungan.</div>
            ) : (
              riwayat.map((d, i) => (
                <div className="tv-riwayat-item" key={i}>
                  <div className="tipe">{d.tipe}</div>
                  <div className="judul">{d.judul}</div>
                  <div className="detail">{d.detail}</div>
                  <div className="waktu">{fmtWaktu(d.waktuLokal)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
