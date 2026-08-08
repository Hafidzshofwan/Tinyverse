"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/widgets/user-account";
import gaya from "./ErrorLogs.module.css";

/**
 * Panel admin untuk memantau error produksi, dipasang di /admin/error-logs.
 *
 * Bentuk baris ditulis ulang di sini (tidak diimpor dari berkas route),
 * mengikuti pola yang sama dengan KelolaPenggunaPanel: berkas route memuat
 * "server-only" di rantai impornya.
 */

type BarisErrorLog = {
  id: string;
  type: string;
  message: string;
  stack: string;
  pathname: string;
  userAgent: string;
  email: string | null;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  resolved: boolean;
};

const FORMAT_WAKTU = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function waktuPendek(iso: string): string {
  const t = new Date(iso);
  return Number.isNaN(t.getTime()) ? "-" : FORMAT_WAKTU.format(t);
}

const LABEL_TYPE: Record<string, string> = {
  "window.onerror": "Runtime",
  unhandledrejection: "Promise",
  boundary: "Render",
  manual: "Manual",
};

export function ErrorLogsPanel() {
  const { profil } = useAuth();
  const [rows, setRows] = useState<BarisErrorLog[] | null>(null);
  const [galat, setGalat] = useState("");
  const [diperbarui, setDiperbarui] = useState("");
  const [terbuka, setTerbuka] = useState<string | null>(null);
  const [hanyaTerbuka, setHanyaTerbuka] = useState(true);

  const muat = useCallback(() => {
    setGalat("");
    fetch("/api/admin/error-logs", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as {
          baris?: BarisErrorLog[];
          error?: string;
        } | null;
        if (!res.ok) {
          throw new Error((data && data.error) || "HTTP " + res.status);
        }
        setRows((data && data.baris) || []);
        setDiperbarui(
          new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(
            new Date(),
          ),
        );
      })
      .catch((e) => setGalat((e as Error).message));
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  async function tandaiSelesai(id: string, resolved: boolean) {
    try {
      const res = await fetch("/api/admin/error-logs", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      muat();
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
    }
  }

  async function hapus(id: string) {
    if (!confirm("Hapus catatan error ini secara permanen?")) return;
    try {
      const res = await fetch("/api/admin/error-logs?id=" + encodeURIComponent(id), {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      muat();
    } catch (e) {
      alert("Gagal: " + (e as Error).message);
    }
  }

  const tampil = useMemo(() => {
    const r = rows || [];
    return hanyaTerbuka ? r.filter((x) => !x.resolved) : r;
  }, [rows, hanyaTerbuka]);

  const ringkas = useMemo(() => {
    const r = rows || [];
    return {
      total: r.length,
      terbuka: r.filter((x) => !x.resolved).length,
      kejadian: r.reduce((total, x) => total + x.count, 0),
    };
  }, [rows]);

  if (profil && profil.role !== "admin") {
    return <div className={gaya.kosong}>Halaman ini hanya untuk admin.</div>;
  }

  return (
    <div>
      <h1 className={gaya.judul}>Pemantauan Error Produksi</h1>
      <p className={gaya.sub}>
        Setiap error yang tertangkap di peramban pengguna — baik dari halaman
        yang gagal render, kode async, maupun penanganan event — dikirim ke
        sini. Kejadian yang berulang untuk bug yang sama digabung jadi satu
        baris; angka di kolom &quot;Kejadian&quot; menunjukkan berapa kali bug
        itu terpicu.
      </p>

      {galat ? (
        <div className={gaya.galat}>
          Gagal memuat log error. Kemungkinan besar akun Anda belum memiliki
          custom claim <b>role=admin</b>, atau sesi sudah kedaluwarsa.
          <div className={gaya.galatPesan}>{galat}</div>
        </div>
      ) : rows === null ? (
        <div className={gaya.kosong}>{"Memuat\u2026"}</div>
      ) : (
        <>
          <div className={gaya.ringkas}>
            <div className={gaya.kartu} style={{ borderLeftColor: "#94A3B8" }}>
              <div className={gaya.kartuAngka}>{ringkas.total}</div>
              <div className={gaya.kartuLabel}>Jenis error tercatat</div>
            </div>
            <div className={gaya.kartu} style={{ borderLeftColor: "#DC2626" }}>
              <div className={gaya.kartuAngka}>{ringkas.terbuka}</div>
              <div className={gaya.kartuLabel}>Belum ditandai selesai</div>
            </div>
            <div className={gaya.kartu} style={{ borderLeftColor: "#2563EB" }}>
              <div className={gaya.kartuAngka}>{ringkas.kejadian}</div>
              <div className={gaya.kartuLabel}>Total kejadian</div>
            </div>
          </div>

          <div className={gaya.bar}>
            <label className={gaya.filter}>
              <input
                type="checkbox"
                checked={hanyaTerbuka}
                onChange={(e) => setHanyaTerbuka(e.target.checked)}
              />
              Tampilkan yang belum selesai saja
            </label>
            <span>
              {tampil.length} ditampilkan{diperbarui ? " \u00B7 dimuat pukul " + diperbarui : ""}
            </span>
            <button className={gaya.tombolSegar} onClick={muat}>
              Muat ulang
            </button>
          </div>

          {tampil.length === 0 ? (
            <div className={gaya.kosong}>
              {hanyaTerbuka
                ? "Tidak ada error terbuka. Semua sudah ditandai selesai."
                : "Belum ada error tercatat."}
            </div>
          ) : (
            <div className={gaya.daftar}>
              {tampil.map((r) => (
                <div
                  key={r.id}
                  className={[gaya.baris, r.resolved ? gaya.selesai : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div
                    className={gaya.ringkasBaris}
                    onClick={() => setTerbuka(terbuka === r.id ? null : r.id)}
                  >
                    <span className={gaya.tipe}>{LABEL_TYPE[r.type] || r.type}</span>
                    <span className={gaya.pesanRingkas}>{r.message}</span>
                    <span className={gaya.jumlah}>{"\u00D7" + r.count}</span>
                    <span className={gaya.waktu}>{waktuPendek(r.lastSeenAt)}</span>
                  </div>
                  {terbuka === r.id ? (
                    <div className={gaya.detail}>
                      <div className={gaya.detailBaris}>
                        <b>Halaman:</b> {r.pathname || "-"}
                      </div>
                      <div className={gaya.detailBaris}>
                        <b>Pertama terlihat:</b> {waktuPendek(r.firstSeenAt)} &middot;{" "}
                        <b>Terakhir:</b> {waktuPendek(r.lastSeenAt)}
                      </div>
                      <div className={gaya.detailBaris}>
                        <b>Pengguna:</b> {r.email || "tidak masuk / tidak diketahui"}
                      </div>
                      {r.stack ? (
                        <pre className={gaya.stack}>{r.stack}</pre>
                      ) : null}
                      <div className={gaya.aksiDetail}>
                        <button
                          className="tv-mini"
                          onClick={() => tandaiSelesai(r.id, !r.resolved)}
                        >
                          {r.resolved ? "Buka lagi" : "Tandai selesai"}
                        </button>
                        <button className={gaya.tombolHapus} onClick={() => hapus(r.id)}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          <p className={gaya.catatanKaki}>
            Log ini hanya menangkap error di sisi peramban (klien). Error yang
            terjadi murni di server (mis. di dalam Route Handler) tetap perlu
            dilihat lewat log Vercel.
          </p>
        </>
      )}
    </div>
  );
}
