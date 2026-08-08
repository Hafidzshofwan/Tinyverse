"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/widgets/user-account";
import { ShieldUserIcon } from "@/shared/ui/icons/ShieldUserIcon";
import gaya from "./KelolaPengguna.module.css";

/**
 * Halaman kelola pengguna: daftar akun beserta masa berlaku langganannya.
 *
 * WHY kolom peran hanya label, bukan dropdown seperti versi modal dulu:
 * dropdown itu menulis `role` ke dokumen users/{uid}, sedangkan yang benar-benar
 * membuka pintu admin adalah custom claim di Firebase Authentication. Jadi
 * saklar itu menjanjikan kewenangan yang tidak pernah diberikannya - dan
 * sebaliknya, dokumen yang sama bisa diubah sendiri oleh pemiliknya dari
 * peramban. Saklar yang berbohong lebih berbahaya daripada tidak ada saklar.
 *
 * Toggle Aktif/Nonaktif tetap ada karena ia jujur: memang dokumen users yang
 * dibacanya, dan memang itu yang dipakai untuk memblokir seseorang.
 */

type RingkasLangganan = {
  status: "belum" | "aktif" | "kedaluwarsa";
  percobaan: boolean;
  berakhirPada: string | null;
  sisaHari: number;
  planId: string | null;
};

/* Bentuk baris ditulis ulang di sini, tidak diimpor dari berkas route: modul
   route memuat "server-only" di rantai impornya. */
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

const FORMAT_JAM = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
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

export function KelolaPenggunaPanel() {
  const { profil, toggleAktif } = useAuth();
  const [rows, setRows] = useState<BarisPengguna[] | null>(null);
  const [galat, setGalat] = useState("");
  const [diperbarui, setDiperbarui] = useState("");
  const [sinkronSedang, setSinkronSedang] = useState(false);
  const [sinkronPesan, setSinkronPesan] = useState("");

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
        setDiperbarui(FORMAT_JAM.format(new Date()));
      })
      .catch((e) => setGalat((e as Error).message));
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const ringkas = useMemo(() => {
    const r = rows || [];
    return {
      total: r.length,
      aktif: r.filter((x) => x.langganan.status === "aktif").length,
      trial: r.filter((x) => x.langganan.status === "aktif" && x.langganan.percobaan)
        .length,
      habis: r.filter((x) => x.langganan.status === "kedaluwarsa").length,
    };
  }, [rows]);

  /* Akun sendiri dikeluarkan dari tabel dan ditampilkan tersendiri di atas.
     Alasannya bukan sekadar rapi: satu-satunya baris yang tidak punya tombol
     Aktif/Nonaktif adalah baris ini, sehingga di dalam tabel ia tampak seperti
     baris yang tombolnya lupa dipasang. Di luar tabel, ketiadaan tombol itu
     justru masuk akal. */
  const saya = useMemo(() => (rows || []).find((r) => r.saya) ?? null, [rows]);
  const lain = useMemo(() => (rows || []).filter((r) => !r.saya), [rows]);
  const tampilSaya = saya ? tampilanLangganan(saya.langganan) : null;

  async function onToggleAktif(id: string, aktif: boolean) {
    try {
      await toggleAktif(id, aktif);
      muat();
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
    }
  }

  /* Dokumen users/{uid} tidak otomatis ikut terhapus saat akun
     Authentication-nya dihapus manual (mis. lewat Firebase Console), jadi
     daftar ini bisa terus menampilkan akun yang sebenarnya sudah tidak ada.
     Tombol ini memanggil endpoint yang mencocokkan setiap dokumen dengan
     Firebase Authentication yang sesungguhnya, lalu membersihkan yang basi. */
  async function onSinkron() {
    setSinkronSedang(true);
    setSinkronPesan("");
    try {
      const res = await fetch("/api/admin/pengguna/sinkron", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        penggunaDihapus?: string[];
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error((data && data.error) || "HTTP " + res.status);
      }
      const jumlah = data.penggunaDihapus?.length ?? 0;
      setSinkronPesan(
        jumlah > 0
          ? jumlah +
              " akun basi (sudah dihapus di Firebase Authentication) dibersihkan dari daftar."
          : "Sudah sinkron, tidak ada akun basi yang ditemukan.",
      );
      muat();
    } catch (e) {
      setSinkronPesan("Gagal sinkron: " + (e as Error).message);
    } finally {
      setSinkronSedang(false);
    }
  }

  if (profil && profil.role !== "admin") {
    return (
      <div className={gaya.kosong}>
        Halaman ini hanya untuk admin.
      </div>
    );
  }

  return (
    <div>
      <h1 className={gaya.judul}>
        <span className={gaya.ikon}>
          <ShieldUserIcon size={22} />
        </span>
        Kelola Pengguna
      </h1>
      <p className={gaya.sub}>
        Daftar seluruh akun beserta masa berlaku langganannya. Status dihitung
        dari tanggal berakhir setiap kali halaman ini dimuat, bukan dibaca dari
        kolom tersimpan.
      </p>

      {galat ? (
        <div className={gaya.galat}>
          Gagal memuat daftar pengguna. Dua sebab yang paling mungkin: akun Anda
          belum memiliki custom claim <b>role=admin</b> di Firebase
          Authentication, atau sesi server sudah kedaluwarsa sehingga perlu masuk
          ulang.
          <div className={gaya.galatPesan}>{galat}</div>
        </div>
      ) : rows === null ? (
        <div className={gaya.kosong}>{"Memuat\u2026"}</div>
      ) : (
        <>
          <div className={gaya.ringkas}>
            <div className={gaya.kartu} style={{ borderLeftColor: "#94A3B8" }}>
              <div className={gaya.kartuAngka}>{ringkas.total}</div>
              <div className={gaya.kartuLabel}>Total akun</div>
            </div>
            <div className={gaya.kartu} style={{ borderLeftColor: "#10B981" }}>
              <div className={gaya.kartuAngka}>{ringkas.aktif}</div>
              <div className={gaya.kartuLabel}>Masa aktif berjalan</div>
            </div>
            <div className={gaya.kartu} style={{ borderLeftColor: "#2563EB" }}>
              <div className={gaya.kartuAngka}>{ringkas.trial}</div>
              <div className={gaya.kartuLabel}>Sedang trial</div>
            </div>
            <div className={gaya.kartu} style={{ borderLeftColor: "#DC2626" }}>
              <div className={gaya.kartuAngka}>{ringkas.habis}</div>
              <div className={gaya.kartuLabel}>Sudah kedaluwarsa</div>
            </div>
          </div>

          {saya && tampilSaya ? (
            <div className={gaya.sayaKartu}>
              <div className={gaya.sayaUtama}>
                <div className={gaya.sayaLabel}>Akun Anda</div>
                <div className={gaya.nama}>{saya.nama}</div>
                <div className={gaya.email}>{saya.email}</div>
              </div>
              <span
                className={[
                  gaya.peran,
                  saya.role === "admin" ? gaya.peranAdmin : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {saya.role === "admin" ? "Admin" : "Pengguna"}
              </span>
              <div
                className={[gaya.lang, tampilSaya.kelas].filter(Boolean).join(" ")}
              >
                <span className={gaya.status}>{tampilSaya.teks}</span>
                <span className={gaya.catatan}>{tampilSaya.catatan}</span>
              </div>
            </div>
          ) : null}

          <div className={gaya.bar}>
            <span>
              {lain.length} pengguna lain. Dimuat
              {diperbarui ? " pukul " + diperbarui : ""}, yang kedaluwarsa di
              urutan atas.
            </span>
            <span className={gaya.barTombol}>
              <button
                className={gaya.tombolSegar}
                onClick={onSinkron}
                disabled={sinkronSedang}
                title="Cocokkan daftar ini dengan Firebase Authentication dan bersihkan akun yang sudah dihapus"
              >
                {sinkronSedang ? "Menyinkronkan\u2026" : "Sinkronkan"}
              </button>
              <button className={gaya.tombolSegar} onClick={muat}>
                Muat ulang
              </button>
            </span>
          </div>
          {sinkronPesan ? (
            <div className={gaya.sinkronPesan}>{sinkronPesan}</div>
          ) : null}

          {lain.length === 0 ? (
            <div className={gaya.kosong}>Belum ada pengguna lain.</div>
          ) : (
          <div className={gaya.gulir}>
            <table className={gaya.tabel}>
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Peran</th>
                  <th>Langganan</th>
                  <th>Akun</th>
                </tr>
              </thead>
              <tbody>
                {lain.map((r) => {
                  const tampil = tampilanLangganan(r.langganan);
                  const admin = r.role === "admin";
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className={gaya.nama}>{r.nama}</div>
                        <div className={gaya.email}>{r.email}</div>
                      </td>
                      <td>
                        <span
                          className={[gaya.peran, admin ? gaya.peranAdmin : ""]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {admin ? "Admin" : "Pengguna"}
                        </span>
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
                          <span className={gaya.catatan}>akun Anda</span>
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
          </div>
          )}

          <p className={gaya.catatanKaki}>
            Peran ditampilkan sebagai keterangan saja. Mengangkat seseorang
            menjadi admin dilakukan lewat custom claim di Firebase
            Authentication, bukan dari halaman ini - dokumen pengguna dapat
            ditulis oleh pemiliknya sendiri, sehingga tidak layak menjadi penentu
            kewenangan.
          </p>
        </>
      )}
    </div>
  );
}
