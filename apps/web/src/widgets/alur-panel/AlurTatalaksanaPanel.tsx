"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { ASMA } from "@/shared/lib/alur/asma";
import { hitungObat } from "@/shared/lib/alur/dosis";
import { bacaPasienAktif, PASIEN_AKTIF_KEY, tambahKeRingkasan } from "@/shared/lib/alur/ringkasan-bridge";
import type { BlokKonten, Layar, Nada, Pasien, Setting } from "@/shared/lib/alur/tipe";

const LABEL_SETTING: Record<Setting, string> = {
  fktp: "FKTP / Fasilitas Primer",
  rs: "Rumah Sakit",
};

const LABEL_DERAJAT: Record<string, string> = {
  "ringan-sedang": "Ringan\u2013Sedang",
  berat: "Berat",
  ancaman: "Ancaman henti napas",
};

function usiaTeks(bln: number | null | undefined): string {
  if (bln == null) return "\u2013";
  const th = Math.floor(bln / 12);
  const sisa = bln % 12;
  if (th <= 0) return `${bln} bln`;
  return sisa ? `${th} th ${sisa} bln` : `${th} th`;
}

function gayaTombol(nada?: Nada): CSSProperties {
  if (nada === "bahaya") return { background: "linear-gradient(160deg,#e23a5e,#c01643)", color: "#fff", border: "none" };
  if (nada === "biasa")
    return { background: "var(--tv-putih)", color: "var(--tv-teks)", border: "1px solid var(--tv-line)" };
  return {};
}

function warnaDerajat(derajat?: string): string {
  if (derajat === "ringan-sedang") return "#1c7c54";
  if (derajat === "berat") return "#c9761a";
  if (derajat === "ancaman") return "#c01643";
  return "var(--tv-soft-teks)";
}

function Timer({ menit }: { menit: number }) {
  const [sisa, setSisa] = useState<number | null>(null);

  useEffect(() => {
    if (sisa == null || sisa <= 0) return;
    const t = setInterval(() => setSisa((s) => (s == null ? s : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [sisa]);

  if (sisa == null) {
    return (
      <button type="button" className="tv-btn" onClick={() => setSisa(menit * 60)}>
        ⏱️ Mulai timer nilai ulang ({menit} menit)
      </button>
    );
  }

  const mm = String(Math.floor(sisa / 60)).padStart(2, "0");
  const ss = String(sisa % 60).padStart(2, "0");
  const selesai = sisa <= 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span
        style={{
          fontWeight: 800,
          fontSize: "1.5rem",
          fontVariantNumeric: "tabular-nums",
          color: selesai ? "#c01643" : "var(--tv-teks)",
        }}
      >
        {mm}:{ss}
      </span>
      {selesai && <span className="tv-warn">Waktunya nilai ulang.</span>}
      <button type="button" className="tv-btn" onClick={() => setSisa(null)}>
        Reset
      </button>
    </div>
  );
}

function RenderBlok({ blok, pasien }: { blok: BlokKonten; pasien: Pasien | null }) {
  if (blok.jenis === "teks") return <p style={{ margin: "6px 0" }}>{blok.teks}</p>;

  if (blok.jenis === "poin")
    return (
      <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
        {blok.poin.map((t, i) => (
          <li key={i} style={{ margin: "3px 0" }}>
            {t}
          </li>
        ))}
      </ul>
    );

  if (blok.jenis === "peringatan")
    return (
      <div className="tv-warn" style={{ margin: "8px 0" }}>
        ⚠️ {blok.teks}
      </div>
    );

  const d = hitungObat(blok.obatId, pasien ?? {});
  if (!d) return null;

  return (
    <div
      style={{
        border: "1px solid var(--tv-line)",
        borderRadius: 12,
        padding: "10px 12px",
        margin: "8px 0",
        background: "var(--tv-putih)",
      }}
    >
      <div style={{ fontWeight: 700 }}>
        💊 {d.def.nama} <span style={{ fontWeight: 400, color: "var(--tv-soft-teks)" }}>· {d.def.rute}</span>
      </div>
      <div style={{ marginTop: 2 }}>{d.hasil.ringkas}</div>
      {d.hasil.detail && (
        <div style={{ fontSize: ".86rem", color: "var(--tv-soft-teks)", marginTop: 2 }}>{d.hasil.detail}</div>
      )}
      {d.hasil.peringatan && (
        <div className="tv-warn" style={{ marginTop: 4 }}>
          ⚠️ {d.hasil.peringatan}
        </div>
      )}
    </div>
  );
}

function komposisiRingkasan(layar: Layar, setting: Setting, pasien: Pasien | null): string {
  const baris: string[] = [];
  baris.push(`Setting: ${LABEL_SETTING[setting]}`);
  if (pasien && (pasien.nama || pasien.bb != null || pasien.usiaBulan != null)) {
    baris.push(`Pasien: ${pasien.nama ?? "-"} \u00b7 BB ${pasien.bb ?? "-"} kg \u00b7 Usia ${usiaTeks(pasien.usiaBulan)}`);
  }
  baris.push("");
  for (const blok of layar.konten) {
    if (blok.jenis === "teks") baris.push(blok.teks);
    else if (blok.jenis === "poin") for (const p of blok.poin) baris.push(`\u2022 ${p}`);
    else if (blok.jenis === "peringatan") baris.push(`\u26a0 ${blok.teks}`);
    else {
      const d = hitungObat(blok.obatId, pasien ?? {});
      if (d) baris.push(`\u2022 ${d.def.nama} (${d.def.rute}): ${d.hasil.ringkas}`);
    }
  }
  return baris.join("\n");
}

export function AlurTatalaksanaPanel() {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [stack, setStack] = useState<string[]>([]);
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPasien(bacaPasienAktif());
    const muat = () => setPasien(bacaPasienAktif());
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === PASIEN_AKTIF_KEY) muat();
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __tvPasien?: boolean } | null;
      if (d && d.__tvPasien) muat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const mulai = useCallback((s: Setting) => {
    setSetting(s);
    setStack([ASMA.mulai[s]]);
  }, []);

  const pergi = useCallback((tujuan: string) => setStack((st) => [...st, tujuan]), []);
  const kembali = useCallback(() => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)), []);
  const resetSetting = useCallback(() => {
    setSetting(null);
    setStack([]);
  }, []);

  const kartuPasien = (
    <div
      style={{
        border: "1px solid var(--tv-line)",
        borderRadius: 12,
        padding: "10px 12px",
        background: "var(--tv-glass)",
        marginBottom: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2 }}>👶 Profil pasien aktif</div>
      {pasien && (pasien.nama || pasien.bb != null || pasien.usiaBulan != null) ? (
        <div style={{ fontSize: ".92rem" }}>
          {pasien.nama ?? "Tanpa nama"} · BB {pasien.bb ?? "\u2013"} kg · Usia {usiaTeks(pasien.usiaBulan)}
        </div>
      ) : (
        <div className="tv-warn" style={{ marginTop: 2 }}>
          Belum ada data pasien. Isi Profil Pasien agar dosis dihitung otomatis.
        </div>
      )}
    </div>
  );

  if (!setting) {
    return (
      <div className="tv-container">
        {kartuPasien}
        <div className="tv-card">
          <div className="tv-card-title">Serangan Asma</div>
          <div className="tv-card-desc">
            Alur interaktif tata laksana serangan asma anak. Pilih lokasi penanganan untuk memulai.
          </div>
          <div className="tv-stack" style={{ marginTop: 12 }}>
            <button type="button" className="tv-btn tv-btn-blok" onClick={() => mulai("fktp")}>
              🏥 FKTP / Fasilitas Primer
            </button>
            <button type="button" className="tv-btn tv-btn-blok" onClick={() => mulai("rs")}>
              🏨 Rumah Sakit
            </button>
          </div>
          <div style={{ fontSize: ".8rem", color: "var(--tv-soft-teks)", marginTop: 12 }}>
            Sumber: {ASMA.sumber}
          </div>
        </div>
      </div>
    );
  }

  const kiniId = stack[stack.length - 1];
  const layar: Layar | undefined = kiniId ? ASMA.layar[kiniId] : undefined;

  if (!layar) {
    return (
      <div className="tv-container">
        <div className="tv-card">
          <div className="tv-card-title">Alur tidak ditemukan</div>
          <button type="button" className="tv-btn" style={{ marginTop: 10 }} onClick={resetSetting}>
            Ulangi dari awal
          </button>
        </div>
      </div>
    );
  }

  const tambah = () => {
    tambahKeRingkasan({
      title: `Asma \u2014 ${layar.judul}`,
      body: komposisiRingkasan(layar, setting, pasien),
      source: "Alur Tata Laksana Asma",
    });
    setToast("Ditambahkan ke Ringkasan Klinis \u2705");
  };

  return (
    <div className="tv-container">
      {kartuPasien}

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <span
          style={{
            fontSize: ".78rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
            background: "var(--tv-accent-soft)",
            color: "var(--tv-navy)",
          }}
        >
          {LABEL_SETTING[setting]}
        </span>
        {stack.length > 1 && (
          <button type="button" className="tv-btn" onClick={kembali} style={{ padding: "4px 12px" }}>
            ← Kembali
          </button>
        )}
        <button type="button" className="tv-btn" onClick={resetSetting} style={{ padding: "4px 12px" }}>
          Ganti setting
        </button>
      </div>

      <div className="tv-card">
        {layar.derajat && (
          <div style={{ fontSize: ".78rem", fontWeight: 800, color: warnaDerajat(layar.derajat), marginBottom: 4 }}>
            {LABEL_DERAJAT[layar.derajat] ?? layar.derajat}
          </div>
        )}
        <div className="tv-card-title">{layar.judul}</div>

        <div style={{ marginTop: 8 }}>
          {layar.konten.map((blok, i) => (
            <RenderBlok key={i} blok={blok} pasien={pasien} />
          ))}
        </div>

        {layar.timerMenit != null && (
          <div style={{ margin: "12px 0" }}>
            <Timer menit={layar.timerMenit} />
          </div>
        )}

        {layar.ringkasan && (
          <button type="button" className="tv-btn" style={{ marginTop: 8 }} onClick={tambah}>
            📄 Tambahkan ke Ringkasan
          </button>
        )}

        {layar.tombol.length > 0 && (
          <div className="tv-stack" style={{ marginTop: 14 }}>
            {layar.tombol.map((tb, i) => (
              <button
                key={i}
                type="button"
                className="tv-btn tv-btn-blok"
                style={gayaTombol(tb.nada)}
                onClick={() => pergi(tb.tujuan)}
              >
                {tb.label}
              </button>
            ))}
          </div>
        )}

        {layar.tombol.length === 0 && (
          <div
            style={{
              marginTop: 14,
              padding: "8px 12px",
              borderRadius: 10,
              background: "var(--tv-accent-soft)",
              fontSize: ".9rem",
            }}
          >
            ✅ Akhir alur untuk kondisi ini. Gunakan “Ganti setting” atau “Kembali” untuk menelusuri cabang lain.
          </div>
        )}

        <div style={{ fontSize: ".78rem", color: "var(--tv-soft-teks)", marginTop: 14 }}>Sumber: {ASMA.sumber}</div>
      </div>

      <div className="tv-warn" style={{ marginTop: 12 }}>
        ⚠️ Alat bantu keputusan — bukan pengganti penilaian klinis. Verifikasi dosis sebelum pemberian.
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            background: "var(--tv-navy)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 999,
            zIndex: 50,
            boxShadow: "0 6px 20px rgba(0,0,0,.18)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
