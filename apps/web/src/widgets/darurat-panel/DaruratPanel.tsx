"use client";

import { useCallback, useEffect, useState } from "react";
import { PatTab } from "@/features/emergency-pat";
import { ResusTab } from "@/features/emergency-resus";
import { PalsTab } from "@/features/emergency-pals";
import { GcsTab } from "@/features/emergency-gcs";
import { NORM_KEY } from "@/entities/emergency";

const PASIEN_KEY = "tv_pasien_aktif";

type TabId = "gcs" | "pat" | "pals" | "resus";

const TABS: { id: TabId; label: string }[] = [
  { id: "gcs", label: "🧠 GCS" },
  { id: "pat", label: "🔺 PAT" },
  { id: "pals", label: "💊 Dosis & Alat" },
  { id: "resus", label: "⏱️ Resusitasi" },
];

type Pasien = {
  nama?: string;
  usiaBulan?: number | null;
  bb?: number | null;
  tb?: number | null;
  jk?: "male" | "female" | null;
};

function loadPasien(): Pasien {
  if (typeof window === "undefined") return {};
  try {
    return (JSON.parse(window.localStorage.getItem(PASIEN_KEY) || "{}") as Pasien) || {};
  } catch {
    return {};
  }
}
function usiaTeks(b: number | null | undefined): string {
  if (b == null || (b as unknown) === "") return "";
  const n = Number(b);
  if (!isFinite(n)) return "";
  if (n < 24) return n + " bulan";
  const th = Math.floor(n / 12);
  const s = n % 12;
  return s ? th + " th " + s + " bln" : th + " tahun";
}
function parseUsia(t: string): number | null {
  t = String(t || "").toLowerCase().trim();
  if (!t) return null;
  const thn = t.match(/(\d+)\s*(th|thn|tahun|y)/);
  const bln = t.match(/(\d+)\s*(bl|bln|bulan|mo)/);
  if (thn || bln)
    return (thn ? parseInt(thn[1] ?? "0", 10) : 0) * 12 + (bln ? parseInt(bln[1] ?? "0", 10) : 0);
  const n = t.match(/(\d+)/);
  if (n) return parseInt(n[1] ?? "0", 10) * 12;
  return null;
}
function bacaNoRm(): string {
  try {
    return window.localStorage.getItem(NORM_KEY) || "";
  } catch {
    return "";
  }
}
function sebarKeIsland() {
  try {
    document.querySelectorAll("iframe").forEach((fr) => {
      fr.contentWindow?.postMessage({ __tvPasien: true }, "*");
    });
  } catch {
    /* abaikan */
  }
  try {
    window.dispatchEvent(new CustomEvent("tv-pasien-change"));
  } catch {
    /* abaikan */
  }
}

export function DaruratPanel() {
  const [tab, setTab] = useState<TabId>("gcs");
  const [nama, setNama] = useState("");
  const [noRm, setNoRm] = useState("");
  const [usia, setUsia] = useState("");
  const [bb, setBb] = useState("");
  const [badge, setBadge] = useState<string | null>(null);

  const syncDariPusat = useCallback(() => {
    const p = loadPasien();
    setNama(p.nama || "");
    setBb(p.bb != null && (p.bb as unknown) !== "" ? String(p.bb) : "");
    setUsia(p.usiaBulan != null ? usiaTeks(p.usiaBulan) : "");
    setNoRm(bacaNoRm());
  }, []);

  useEffect(() => {
    syncDariPusat();
    const onStorage = (e: StorageEvent) => {
      if (e.key === PASIEN_KEY || e.key === NORM_KEY) syncDariPusat();
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __tvPasien?: boolean } | null;
      if (d && d.__tvPasien) syncDariPusat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("message", onMsg);
    window.addEventListener("tv-pasien-change", syncDariPusat);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
      window.removeEventListener("tv-pasien-change", syncDariPusat);
    };
  }, [syncDariPusat]);

  const bbNum = (() => {
    const n = parseFloat(bb);
    return isFinite(n) ? n : null;
  })();
  const ubNum = parseUsia(usia);

  const simpanPasien = () => {
    const p = loadPasien();
    p.nama = (nama || "").trim();
    const b = parseFloat(bb);
    p.bb = isFinite(b) ? b : null;
    const ub = parseUsia(usia);
    if (ub != null) p.usiaBulan = ub;
    try {
      window.localStorage.setItem(PASIEN_KEY, JSON.stringify(p));
    } catch {
      /* abaikan */
    }
    try {
      window.localStorage.setItem(NORM_KEY, (noRm || "").trim());
    } catch {
      /* abaikan */
    }
    sebarKeIsland();
    setBadge("\u2713 Tersimpan & tersinkron");
    window.setTimeout(() => setBadge(null), 1100);
  };

  const bersihkanPasien = () => {
    const p = loadPasien();
    p.nama = "";
    p.usiaBulan = null;
    p.bb = null;
    p.tb = null;
    p.jk = null;
    try {
      window.localStorage.setItem(PASIEN_KEY, JSON.stringify(p));
    } catch {
      /* abaikan */
    }
    try {
      window.localStorage.removeItem(NORM_KEY);
    } catch {
      /* abaikan */
    }
    sebarKeIsland();
    syncDariPusat();
  };

  const hasBb = bb !== "";
  const badgeText =
    badge != null
      ? badge
      : nama || hasBb
        ? (nama || "Tanpa nama") + (hasBb ? " \u00b7 " + bb + " kg" : "")
        : "Belum ada pasien";
  const badgeAktif = badge != null || !!(nama || hasBb);

  return (
    <div className="tv-page-darurat-wrapper">
      <div className="tv-page-darurat" id="page-darurat">
        <div className="judul-section">
          <div className="ikon-bulat" style={{ background: "#FFD9D9" }} aria-hidden>
            🚨
          </div>
          <div>
            <h2>Mode Darurat</h2>
            <p>
              Alat bantu cepat: Penilaian PAT, Timer resusitasi & Kalkulator
              dosis PALS.
            </p>
          </div>
        </div>

        <div className="drt-pasien-bar">
          <div className="drt-pasien-head">
            <strong>👤 Data Pasien </strong>
            <span
              className="drt-pasien-badge"
              style={
                badgeAktif
                  ? { background: "var(--darurat)", color: "#fff" }
                  : undefined
              }
            >
              {badgeText}
            </span>
          </div>
          <div className="drt-pasien-grid">
            <div className="form-group">
              <label>Nama / Inisial</label>
              <input
                type="text"
                placeholder="cth: An. A"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>No. RM / ID</label>
              <input
                type="text"
                placeholder="opsional"
                value={noRm}
                onChange={(e) => setNoRm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Usia</label>
              <input
                type="text"
                placeholder="cth: 3 thn"
                value={usia}
                onChange={(e) => setUsia(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Berat Badan (kg)</label>
              <input
                id="drtBB"
                type="number"
                inputMode="decimal"
                placeholder="cth: 14"
                value={bb}
                onChange={(e) => setBb(e.target.value)}
              />
            </div>
          </div>
          <div className="drt-pasien-actions">
            <button
              className="drt-mini-btn simpan"
              type="button"
              onClick={simpanPasien}
            >
              💾 Simpan pasien aktif
            </button>
            <button
              className="drt-mini-btn hapus"
              type="button"
              onClick={bersihkanPasien}
            >
              Bersihkan
            </button>
          </div>
        </div>

        <div className="drt-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={"drt-tab" + (tab === t.id ? " aktif" : "")}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="drt-tabpane aktif">
          {tab === "gcs" ? <GcsTab ub={ubNum} nama={nama} noRm={noRm} /> : null}
          {tab === "pat" ? <PatTab /> : null}
          {tab === "pals" ? <PalsTab bb={bbNum} ub={ubNum} /> : null}
          {tab === "resus" ? (
            <ResusTab nama={nama} noRm={noRm} bb={bbNum} />
          ) : null}
        </div>

        <div className="drt-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> Mode Darurat adalah alat bantu
          dokumentasi, penilaian cepat & perhitungan dosis (PALS), bukan
          pengganti penilaian klinis. PAT menilai kesan awal, bukan diagnosis.
          Verifikasi setiap tindakan, dosis, dan ukuran alat sesuai protokol
          resusitasi yang berlaku.
        </div>
      </div>
    </div>
  );
}
