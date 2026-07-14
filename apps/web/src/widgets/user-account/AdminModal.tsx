"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthProvider";
import type { PenggunaRow } from "./AuthProvider";

/**
 * Modal kelola pengguna (khusus admin). Setia dengan v17: daftar semua
 * pengguna, ubah peran (Pengguna/Admin), aktif/nonaktifkan akun. Akun sendiri
 * tidak bisa diubah dari sini.
 */
export function AdminModal({ onTutup }: { onTutup: () => void }) {
  const { muatPengguna, ubahPeran, toggleAktif } = useAuth();
  const [rows, setRows] = useState<PenggunaRow[] | null>(null);
  const [galat, setGalat] = useState("");
  const [pasang, setPasang] = useState(false);
  useEffect(() => setPasang(true), []);

  const muat = useCallback(() => {
    setGalat("");
    setRows(null);
    muatPengguna()
      .then(setRows)
      .catch((e) => setGalat((e as Error).message));
  }, [muatPengguna]);

  useEffect(() => {
    muat();
  }, [muat]);

  async function onUbahPeran(id: string, peran: string) {
    try {
      await ubahPeran(id, peran);
      muat();
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
      muat();
    }
  }

  async function onToggleAktif(id: string, aktif: boolean) {
    try {
      await toggleAktif(id, aktif);
      muat();
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
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
      <div className="tv-modal-kartu tv-modal-lebar">
        <button className="tv-modal-tutup" onClick={onTutup} aria-label="Tutup">
          {"\u00D7"}
        </button>
        <h2>{"\uD83D\uDEE1\uFE0F"} Kelola Pengguna</h2>
        {galat ? (
          <div className="tv-kosong">
            Gagal memuat daftar pengguna. Pastikan aturan keamanan Firestore
            mengizinkan admin membaca koleksi <b>users</b>.
            <br />
            <br />
            {galat}
          </div>
        ) : rows === null ? (
          <div className="tv-kosong">{"Memuat\u2026"}</div>
        ) : (
          <table className="tv-tabel">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Peran</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b>{r.nama}</b>
                    <br />
                    <span className="tv-sub">{r.email}</span>
                  </td>
                  <td>
                    <select
                      value={r.role}
                      disabled={r.saya}
                      onChange={(e) => onUbahPeran(r.id, e.target.value)}
                    >
                      <option value="user">Pengguna</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    {r.saya ? (
                      <span className="tv-sub">akun Anda</span>
                    ) : (
                      <button
                        className={"tv-mini " + (r.aktif ? "on" : "off")}
                        title={
                          r.aktif
                            ? "Klik untuk menonaktifkan akun ini"
                            : "Klik untuk mengaktifkan akun ini"
                        }
                        onClick={() => onToggleAktif(r.id, !r.aktif)}
                      >
                        {r.aktif ? "Aktif" : "Nonaktif"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>,
    document.body,
  );
}
