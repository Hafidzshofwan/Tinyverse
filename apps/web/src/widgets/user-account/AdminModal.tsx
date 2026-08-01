"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthProvider";
import gaya from "./AdminModal.module.css";

/**
 * Modal kelola pengguna (khusus admin): daftar semua pengguna, ubah peran,
 * aktif/nonaktifkan akun, dan lihat masa berlaku langganan tiap akun.
 *
 * WHY daftarnya diambil dari /api/admin/pengguna dan bukan lagi dari
 * `muatPengguna()`: fungsi itu membaca koleksi `users` dengan SDK klien, dan
 * koleksi itu tidak tahu apa-apa soal langganan. Data langganan tinggal di
 * koleksi `subscriptions` yang hanya boleh dibaca Admin SDK di server.
 *
 * Dua kolom status, bukan satu, dan keduanya sengaja tidak digabung:
 * - "Langganan" adalah keadaan yang dihitung dari tanggal berakhir. Admin tidak
 *   bisa mengubahnya dari sini.
 * - "Akun" adalah saklar yang ditekan admin untuk memblokir seseorang.
 * Menggabungkannya akan menyembunyikan bedanya akun yang diblokir dengan akun
 * yang trial-nya habis - dua hal yang butuh tindakan berbeda.
 */

/* Bentuk baris sengaja ditulis ulang di sini, tidak diimpor dari berkas route.
   Mengimpor tipe dari modul route berarti komponen klien menunjuk ke modul yang
   memuat "server-only" di rantai impornya. */
type RingkasLangganan = {
  status: "belum" | "aktif" | "kedaluwarsa";
  percobaan: boolean;
  berakhirPada: string | null;
  sisaHari: number;
  planId: string | null;
};

type BarisPengguna = {
  id: string;
  nama: string;
  email: string;
  role: string;
  aktif: boolean;
  saya: boolean;
  accountId: string | null;
  langganan: RingkasLangganan;
};

const FORMAT_TANGGAL = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function tanggalPendek(iso: string): string {
  const t = new Date(iso);
  return Number.isNaN(t.getTime()) ? "-" : FORMAT_TANGGAL.format(t);
}

function tampilanLangganan(l: RingkasLangganan): {
  teks: string;
  kelas: string | undefined;
  catatan: string;
} {
  if (l.status === "aktif") {
    const sisa =
      l.sisaHari <= 1 ? "berakhir hari ini" : "sisa " + l.sisaHari + " hari";
    return {
      teks: l.percobaan ? "Trial" : "Aktif",
      kelas: l.percobaan ? gaya.trial : gaya.aktif,
      catatan: l.berakhirPada
        ? tanggalPendek(l.berakhirPada) + " \u00B7 " + sisa
        : sisa,
    };
  }
  if (l.status === "kedaluwarsa") {
    return {
      teks: l.percobaan ? "Trial habis" : "Kedaluwarsa",
      kelas: gaya.habis,
      catatan: l.berakhirPada
        ? "berakhir " + tanggalPendek(l.berakhirPada)
        : "tanggal tidak tercatat",
    };
  }
  return {
    teks: "Belum mulai",
    kelas: gaya.belum,
    catatan: "belum pernah berlangganan",
  };
}

export function AdminModal({ onTutup }: { onTutup: () => void }) {
  const { ubahPeran, toggleAktif } = useAuth();
  const [rows, setRows] = useState<BarisPengguna[] | null>(null);
  const [galat, setGalat] = useState("");
  const [diperbarui, setDiperbarui] = useState("");
  const [pasang, setPasang] = useState(false);
  useEffect(() => setPasang(true), []);

  const muat = useCallback(() => {
    setGalat("");
    setRows(null);
    /* cache: "no-store" penting. Tanpa itu peramban bisa menyajikan daftar
       kemarin, dan tabel yang menampilkan sisa hari justru salah persis pada
       hal yang ingin dipantau. */
    fetch("/api/admin/pengguna", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as {
          baris?: BarisPengguna[];
          error?: string;
        } | null;
        if (!res.ok) {
          throw new Error((data && data.error) || "HTTP " + res.status);
        }
        setRows((data && data.baris) || []);
        setDiperbarui(
          new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        );
      })
      .catch((e) => setGalat((e as Error).message));
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  async function onUbahPeran(id: string, peran: string) {
    try {
      await ubahPeran(id, peran);
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
    }
    muat();
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
            Gagal memuat daftar pengguna. Dua sebab yang paling mungkin: akun
            Anda belum memiliki custom claim <b>role=admin</b> di Firebase
            Authentication, atau sesi server sudah kedaluwarsa sehingga perlu
            masuk ulang.
            <br />
            <br />
            {galat}
          </div>
        ) : rows === null ? (
          <div className="tv-kosong">{"Memuat\u2026"}</div>
        ) : (
          <>
            <div className={gaya.segar}>
              <span>
                Status langganan dihitung saat daftar ini dimuat
                {diperbarui ? " (" + diperbarui + ")" : ""}.
              </span>
              <button className={gaya.tombolSegar} onClick={muat}>
                Muat ulang
              </button>
            </div>
            <table className="tv-tabel">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Peran</th>
                  <th>Langganan</th>
                  <th>Akun</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const tampil = tampilanLangganan(r.langganan);
                  return (
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
                        <div
                          className={[gaya.lang, tampil.kelas]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <span className={gaya.status}>{tampil.teks}</span>
                          <span className={gaya.catatan}>{tampil.catatan}</span>
                        </div>
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
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
