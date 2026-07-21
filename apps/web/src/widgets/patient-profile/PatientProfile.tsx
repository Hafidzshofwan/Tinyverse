"use client";

import { useCallback, useEffect, useState } from "react";

const LSKEY = "tv_pasien_aktif";

type Jk = "male" | "female" | null;

type Pasien = {
  nama?: string;
  usiaBulan?: number | null;
  bb?: number | null;
  tb?: number | null;
  jk?: Jk;
};

function load(): Pasien {
  try {
    return (JSON.parse(window.localStorage.getItem(LSKEY) || "{}") as Pasien) || {};
  } catch {
    return {};
  }
}

function num(v: string): number | null {
  const n = parseFloat(v);
  return isFinite(n) ? n : null;
}

// Sebar perubahan ke semua island (iframe) di halaman aktif -- instan.
// Island juga menerima event 'storage' bawaan browser sebagai cadangan.
function sebarKeIsland() {
  try {
    document.querySelectorAll("iframe").forEach((f) => {
      f.contentWindow?.postMessage({ __tvPasien: true }, "*");
    });
  } catch {
    /* abaikan */
  }
  // Beri tahu komponen React di window yang SAMA (bukan iframe) agar field
  // tersinkron langsung mengikuti begitu profil disimpan/direset.
  try {
    window.dispatchEvent(new CustomEvent("tv-pasien-change"));
  } catch {
    /* abaikan */
  }
}

export function PatientProfile() {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [thn, setThn] = useState("");
  const [bln, setBln] = useState("");
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [jk, setJk] = useState<Jk>(null);
  const [terisi, setTerisi] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);

  const isiDariStore = useCallback(() => {
    const p = load();
    const ub = p.usiaBulan;
    setNama(p.nama || "");
    setThn(ub != null ? String(Math.floor(ub / 12)) : "");
    setBln(ub != null ? String(ub % 12) : "");
    setBb(p.bb != null ? String(p.bb) : "");
    setTb(p.tb != null ? String(p.tb) : "");
    setJk((p.jk as Jk) || null);
  }, []);

  useEffect(() => {
    const refresh = () => {
      const p = load();
      setTerisi(!!(p.bb || p.usiaBulan || p.nama));
    };
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === LSKEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const buka = () => {
    isiDariStore();
    setOpen(true);
  };

  const simpan = () => {
    const t = num(thn);
    const b = num(bln);
    const ub = t != null || b != null ? (t || 0) * 12 + (b || 0) : null;
    const p: Pasien = { nama: nama.trim(), usiaBulan: ub, bb: num(bb), tb: num(tb), jk };
    try {
      window.localStorage.setItem(LSKEY, JSON.stringify(p));
    } catch {
      /* penyimpanan diblokir */
    }
    setTerisi(!!(p.bb || p.usiaBulan || p.nama));
    sebarKeIsland();
    setTersimpan(true);
    window.setTimeout(() => {
      setTersimpan(false);
      setOpen(false);
    }, 650);
  };

  const reset = () => {
    try {
      window.localStorage.setItem(LSKEY, JSON.stringify({}));
    } catch {
      /* abaikan */
    }
    setNama("");
    setThn("");
    setBln("");
    setBb("");
    setTb("");
    setJk(null);
    setTerisi(false);
    sebarKeIsland();
  };

  const bbN = num(bb);
  const t2 = num(thn);
  const b2 = num(bln);
  const ubN = t2 != null || b2 != null ? (t2 || 0) * 12 + (b2 || 0) : null;
  const warn: string[] = [];
  if (bbN != null && (bbN <= 0 || bbN > 150))
    warn.push("Berat badan tampak tidak wajar untuk pasien anak.");
  if (ubN != null && ubN > 216) warn.push("Usia melebihi 18 tahun \u2014 periksa kembali.");
  const adaData = bbN != null || ubN != null;

  return (
    <>
      <button
        type="button"
        id="tvPasienFab"
        className={terisi ? "terisi" : undefined}
        aria-label="Profil Pasien"
        title="Profil Pasien"
        onClick={buka}
      >
        {"\uD83D\uDC64"}
      </button>
      <div
        id="tvPasienOverlay"
        className={open ? "tampil" : undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="tv-pas-card" role="dialog" aria-label="Profil Pasien">
          <h3>{"\uD83D\uDC64"} Profil Pasien</h3>
          <p className="tv-pas-sub">
            Isi sekali — otomatis terpakai di Dosis, Cairan, Puyer, Nutrisi, Lab, Tumbuh
            Kembang, Mode Darurat, &amp; Ringkasan.
          </p>
          <div className="tv-pas-f">
            <label>Nama / Inisial</label>
            <input type="text" placeholder="cth: An. A" value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="tv-pas-f">
            <label>Jenis Kelamin</label>
            <div className="tv-jk">
              <button type="button" className={jk === "male" ? "tv-jk-btn aktif" : "tv-jk-btn"} onClick={() => setJk("male")}>
                {"\uD83D\uDC66"} Laki-laki
              </button>
              <button type="button" className={jk === "female" ? "tv-jk-btn aktif" : "tv-jk-btn"} onClick={() => setJk("female")}>
                {"\uD83D\uDC67"} Perempuan
              </button>
            </div>
          </div>
          <div className="tv-pas-row">
            <div className="tv-pas-f">
              <label>Usia (tahun)</label>
              <input type="number" min={0} step={1} placeholder="0" value={thn} onChange={(e) => setThn(e.target.value)} />
            </div>
            <div className="tv-pas-f">
              <label>+ bulan</label>
              <input type="number" min={0} max={11} step={1} placeholder="0" value={bln} onChange={(e) => setBln(e.target.value)} />
            </div>
          </div>
          <div className="tv-pas-row">
            <div className="tv-pas-f">
              <label>Berat (kg)</label>
              <input type="number" min={0} step={0.1} placeholder="cth: 12.5" value={bb} onChange={(e) => setBb(e.target.value)} />
            </div>
            <div className="tv-pas-f">
              <label>Tinggi (cm)</label>
              <input type="number" min={0} step={0.1} placeholder="opsional" value={tb} onChange={(e) => setTb(e.target.value)} />
            </div>
          </div>
          {adaData ? (
            <div className={warn.length ? "tv-safety warn" : "tv-safety ok"}>
              {warn.length ? (
                <>
                  <b>{"\u26A0\uFE0F"} Periksa data</b>
                  {warn.map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </>
              ) : (
                <>
                  <b>{"\u2713"} Safety Guard aktif</b>
                  Profil tersinkron ke semua kalkulator.
                </>
              )}
            </div>
          ) : null}
          <div className="tv-pas-act">
            <button type="button" className="tv-pas-btn tv-pas-save" onClick={simpan}>
              {tersimpan ? <>{"\u2713"} Tersimpan</> : <>{"\uD83D\uDCBE"} Simpan &amp; Terapkan</>}
            </button>
            <button type="button" className="tv-pas-btn tv-pas-reset" title="Reset" onClick={reset}>
              {"\u21BA"}
            </button>
          </div>
          <p className="tv-pas-note">Data tersimpan lokal di perangkat ini, tidak dikirim ke server.</p>
        </div>
      </div>
    </>
  );
}
